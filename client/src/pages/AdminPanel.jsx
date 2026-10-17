
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const menu = ["Dashboard", "Users", "Problems", "Security"];

const emptyProblem = {
  title: "",
  slug: "",
  description: "",
  difficulty: "Easy",
  category: "Array",
  tags: "",
  companies: "",
  acceptance_rate: "0",
  starter_code: "{}",
  solution: "{}",
  test_cases: "[]",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400";

const buttonClass =
  "rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString();
}

function parseJson(value, fieldName) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${fieldName} must contain valid JSON.`);
  }
}

function toProblemForm(problem) {
  return {
    title: problem.title ?? "",
    slug: problem.slug ?? "",
    description: problem.description ?? "",
    difficulty: problem.difficulty ?? "Easy",
    category: problem.category ?? "Array",
    tags: Array.isArray(problem.tags) ? problem.tags.join(", ") : "",
    companies: Array.isArray(problem.companies)
      ? problem.companies.join(", ")
      : "",
    acceptance_rate: String(problem.acceptance_rate ?? 0),
    starter_code: JSON.stringify(problem.starter_code ?? {}, null, 2),
    solution: JSON.stringify(problem.solution ?? {}, null, 2),
    test_cases: JSON.stringify(problem.test_cases ?? [], null, 2),
  };
}
function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activePage, setActivePage] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [problemForm, setProblemForm] = useState(emptyProblem);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
    // Initial authentication check and dashboard load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearAlerts() {
    setError("");
    setMessage("");
  }

  function handleError(err, fallback) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    setError(err.response?.data?.message || err.message || fallback);
  }

  async function loadDashboard() {
    setLoading(true);
    clearAlerts();

    try {
      const response = await api.get("/admin/dashboard", authConfig);
      setStats(response.data.stats);
    } catch (err) {
      handleError(err, "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    setLoading(true);
    clearAlerts();

    try {
      const response = await api.get("/admin/users", authConfig);
      setUsers(response.data.users ?? []);
    } catch (err) {
      handleError(err, "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProblems(filters = {}) {
    setLoading(true);
    clearAlerts();

    try {
      const params = {
        search: filters.search ?? search,
        difficulty: filters.difficulty ?? difficultyFilter,
      };

      const response = await api.get("/admin/problems", {
        ...authConfig,
        params,
      });

      setProblems(response.data.problems ?? []);
    } catch (err) {
      handleError(err, "Unable to load problems.");
    } finally {
      setLoading(false);
    }
  }

  function selectPage(page) {
    setActivePage(page);
    clearAlerts();

    if (page === "Dashboard") loadDashboard();
    if (page === "Users") loadUsers();
    if (page === "Problems") loadProblems();
  }

  async function toggleUser(user) {
    clearAlerts();

    try {
      await api.patch(
        `/admin/users/${user.id}/status`,
        { isActive: !user.is_active },
        authConfig
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? { ...item, is_active: !item.is_active }
            : item
        )
      );

      setMessage(
        `${user.name} has been ${
          user.is_active ? "deactivated" : "activated"
        }.`
      );
    } catch (err) {
      handleError(err, "Unable to update user.");
    }
  }

  function openCreateForm() {
    clearAlerts();
    setEditingId(null);
    setProblemForm(emptyProblem);
    setShowProblemForm(true);
  }

  async function openEditForm(id) {
    clearAlerts();
    setLoading(true);

    try {
      const response = await api.get(
        `/admin/problems/${id}`,
        authConfig
      );

      const problem = response.data.problem;

      setEditingId(id);
      setProblemForm(toProblemForm(problem));
      setShowProblemForm(true);
    } catch (err) {
      handleError(err, "Unable to load problem details.");
    } finally {
      setLoading(false);
    }
  }

  function closeProblemForm() {
    setShowProblemForm(false);
    setEditingId(null);
    setProblemForm(emptyProblem);
  }

  function updateProblemField(event) {
    const { name, value } = event.target;

    setProblemForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveProblem(event) {
    event.preventDefault();
    clearAlerts();

    if (!problemForm.title.trim() || !problemForm.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    let payload;

    try {
      payload = {
        title: problemForm.title.trim(),
        slug: problemForm.slug.trim(),
        description: problemForm.description,
        difficulty: problemForm.difficulty,
        category: problemForm.category,
        tags: problemForm.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        companies: problemForm.companies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        acceptance_rate: Number(problemForm.acceptance_rate),
        starter_code: parseJson(problemForm.starter_code, "Starter code"),
        solution: parseJson(problemForm.solution, "Solution"),
        test_cases: parseJson(problemForm.test_cases, "Test cases"),
      };
    } catch (err) {
      setError(err.message || "Please check the problem data.");
      return;
    }

    if (
      !Number.isFinite(payload.acceptance_rate) ||
      payload.acceptance_rate < 0 ||
      payload.acceptance_rate > 100
    ) {
      setError("Acceptance rate must be between 0 and 100.");
      return;
    }

    if (!Array.isArray(payload.test_cases)) {
      setError("Test cases must be a JSON array.");
      return;
    }

    setSaving(true);

    try {
      if (editingId !== null) {
        await api.patch(
          `/admin/problems/${editingId}`,
          payload,
          authConfig
        );
        setMessage("Problem updated successfully.");
      } else {
        await api.post("/admin/problems", payload, authConfig);
        setMessage("Problem created successfully.");
      }

      closeProblemForm();
      await loadProblems();
    } catch (err) {
      handleError(err, "Unable to save problem.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProblem(problem) {
    const confirmed = window.confirm(
      `Delete "${problem.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    clearAlerts();
    setSaving(true);

    try {
      await api.delete(
        `/admin/problems/${problem.id}`,
        authConfig
      );

      setMessage(`"${problem.title}" deleted successfully.`);
      await loadProblems();
    } catch (err) {
      handleError(err, "Unable to delete problem.");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    clearAlerts();

    try {
      const response = await api.patch(
        "/auth/change-password",
        passwords,
        authConfig
      );

      setMessage(
        response.data.message || "Password changed successfully."
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      handleError(err, "Password change failed.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function refreshCurrentPage() {
    if (activePage === "Dashboard") loadDashboard();
    else if (activePage === "Users") loadUsers();
    else if (activePage === "Problems") loadProblems();
  }

  const cards = stats
    ? [
        ["Total Users", stats.total_users],
        ["Active Users", stats.active_users],
        ["Problems", stats.total_problems],
        ["Interviews", stats.total_interviews],
        ["Administrators", stats.admins],
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">
      <aside className="w-full border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <h1 className="text-2xl font-bold text-cyan-400">
          CodingBhai
        </h1>

        <p className="mb-8 mt-1 text-sm text-slate-400">
          Admin Control Center
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {menu.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => selectPage(page)}
              className={`rounded-lg px-4 py-3 text-left ${
                activePage === page
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg border border-slate-700 px-4 py-3 text-left text-red-300 hover:bg-slate-800 md:mt-12 md:w-full"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              {activePage}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Manage your CodingBhai platform.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshCurrentPage}
            disabled={loading}
            className={`${buttonClass} border border-slate-700 hover:bg-slate-800`}
          >
            Refresh
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300"
          >
            {message}
          </div>
        )}

        {loading && (
          <p className="mb-5 text-slate-400">Loading...</p>
        )}

        {/* DASHBOARD */}
        {activePage === "Dashboard" && stats && (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, value]) => (
              <article
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-bold">
                  {value ?? 0}
                </p>
              </article>
            ))}
          </section>
        )}

        {/* USERS */}
        {activePage === "Users" && !loading && (
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-800"
                    >
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">
                        {user.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="p-4">
                        {user.role === "user" ? (
                          <button
                            type="button"
                            onClick={() => toggleUser(user)}
                            className={`${buttonClass} border border-slate-700 hover:bg-slate-800`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        ) : (
                          <span className="text-slate-500">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* PROBLEMS */}
        {activePage === "Problems" && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">
                  Problem Management
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Create and manage coding challenges.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className={`${buttonClass} bg-cyan-500 text-slate-950 hover:bg-cyan-400`}
              >
                + Create Problem
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    loadProblems({ search: event.currentTarget.value });
                  }
                }}
                placeholder="Search by title or slug..."
                className={inputClass}
              />

              <select
                value={difficultyFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  setDifficultyFilter(value);
                  loadProblems({ difficulty: value });
                }}
                className={`${inputClass} sm:max-w-48`}
              >
                <option value="">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button
                type="button"
                onClick={() => loadProblems()}
                className={`${buttonClass} border border-slate-700 hover:bg-slate-800`}
              >
                Search
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Problem</th>
                      <th className="p-4">Difficulty</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Created</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {problems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="border-t border-slate-800"
                      >
                        <td className="p-4">{problem.id}</td>

                        <td className="p-4">
                          <p className="font-medium">{problem.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {problem.slug}
                          </p>
                        </td>

                        <td className="p-4">
                          <span
                            className={
                              problem.difficulty === "Easy"
                                ? "text-emerald-400"
                                : problem.difficulty === "Medium"
                                  ? "text-amber-400"
                                  : "text-red-400"
                            }
                          >
                            {problem.difficulty}
                          </span>
                        </td>

                        <td className="p-4">
                          {problem.category || "—"}
                        </td>

                        <td className="p-4">
                          {formatDate(problem.created_at)}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(problem.id)}
                              className={`${buttonClass} border border-slate-700 hover:bg-slate-800`}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => removeProblem(problem)}
                              className={`${buttonClass} border border-red-500/40 text-red-300 hover:bg-red-500/10`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && problems.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-400"
                        >
                          No problems found. Create your first problem.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE / EDIT FORM */}
            {showProblemForm && (
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5 md:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">
                    {editingId !== null ? "Edit Problem" : "Create Problem"}
                  </h3>

                  <button
                    type="button"
                    onClick={closeProblemForm}
                    className={`${buttonClass} border border-slate-700 hover:bg-slate-800`}
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={saveProblem} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Title *
                      </span>
                      <input
                        name="title"
                        required
                        value={problemForm.title}
                        onChange={updateProblemField}
                        placeholder="Two Sum"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Slug *
                      </span>
                      <input
                        name="slug"
                        required
                        value={problemForm.slug}
                        onChange={updateProblemField}
                        placeholder="two-sum"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Difficulty *
                      </span>
                      <select
                        name="difficulty"
                        value={problemForm.difficulty}
                        onChange={updateProblemField}
                        className={inputClass}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Category *
                      </span>
                      <input
                        name="category"
                        required
                        value={problemForm.category}
                        onChange={updateProblemField}
                        placeholder="Array"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Tags (comma separated)
                      </span>
                      <input
                        name="tags"
                        value={problemForm.tags}
                        onChange={updateProblemField}
                        placeholder="Array, Hash Table"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm text-slate-300">
                        Companies (comma separated)
                      </span>
                      <input
                        name="companies"
                        value={problemForm.companies}
                        onChange={updateProblemField}
                        placeholder="Google, Amazon"
                        className={inputClass}
                      />
                    </label>

                    <label className="block space-y-2 md:col-span-2">
                      <span className="text-sm text-slate-300">
                        Acceptance Rate (0–100)
                      </span>
                      <input
                        name="acceptance_rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={problemForm.acceptance_rate}
                        onChange={updateProblemField}
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm text-slate-300">
                      Problem Description *
                    </span>
                    <textarea
                      name="description"
                      required
                      rows={7}
                      value={problemForm.description}
                      onChange={updateProblemField}
                      placeholder="Explain the problem, input, output and requirements..."
                      className={inputClass}
                    />
                  </label>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="font-medium">
                        Starter Code (JSON)
                      </span>
                      <p className="text-xs text-slate-400">
                        Example: <code>{'{"javascript": "function solve() { ... }"}'}</code>
                      </p>
                      <textarea
                        name="starter_code"
                        rows={8}
                        value={problemForm.starter_code}
                        onChange={updateProblemField}
                        spellCheck={false}
                        className={`${inputClass} font-mono text-sm`}
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="font-medium">
                        Reference Solution (JSON)
                      </span>
                      <p className="text-xs text-slate-400">
                        Keep reference solutions private.
                      </p>
                      <textarea
                        name="solution"
                        rows={8}
                        value={problemForm.solution}
                        onChange={updateProblemField}
                        spellCheck={false}
                        className={`${inputClass} font-mono text-sm`}
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="font-medium">
                      Hidden Test Cases (JSON array)
                    </span>
                    <p className="text-xs text-amber-300">
                      Only admins should access these test cases. Use the
                      format expected by your existing judge/runner.
                    </p>
                    <textarea
                      name="test_cases"
                      rows={10}
                      value={problemForm.test_cases}
                      onChange={updateProblemField}
                      spellCheck={false}
                      className={`${inputClass} font-mono text-sm`}
                    />
                  </label>

                  <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`${buttonClass} bg-cyan-500 px-6 py-3 text-slate-950 hover:bg-cyan-400`}
                    >
                      {saving
                        ? "Saving..."
                        : editingId !== null
                          ? "Save Changes"
                          : "Create Problem"}
                    </button>

                    <button
                      type="button"
                      onClick={closeProblemForm}
                      className={`${buttonClass} border border-slate-700 px-6 py-3 hover:bg-slate-800`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {/* SECURITY */}
        {activePage === "Security" && (
          <section className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-2 text-xl font-semibold">
              Change Admin Password
            </h3>

            <p className="mb-6 text-sm text-slate-400">
              Your current password is required. Other sessions should
              be invalidated after a successful change.
            </p>

            <form onSubmit={changePassword} className="space-y-4">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Current password"
                value={passwords.currentPassword}
                onChange={(event) =>
                  setPasswords((previous) => ({
                    ...previous,
                    currentPassword: event.target.value,
                  }))
                }
                className={inputClass}
              />

              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="New password (minimum 8 characters)"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords((previous) => ({
                    ...previous,
                    newPassword: event.target.value,
                  }))
                }
                className={inputClass}
              />

              <button
                type="submit"
                className={`${buttonClass} bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400`}
              >
                Update Password
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
export default AdminPanel;

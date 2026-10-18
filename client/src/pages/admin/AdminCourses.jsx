import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category: "Programming",
  thumbnail_url: "",
};

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/courses");
      setCourses(response.data.courses || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Courses load nahi ho paye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "title" && !editingId
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setForm({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      category: course.category || "Programming",
      thumbnail_url: course.thumbnail_url || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await api.put(`/admin/courses/${editingId}`, form);
        setMessage("Course updated successfully!");
      } else {
        await api.post("/admin/courses", form);
        setMessage("Course created successfully!");
      }

      resetForm();
      await loadCourses();
      setMessage(
        editingId
          ? "Course updated successfully!"
          : "Course created successfully!",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Course save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (course) => {
    try {
      const status = course.status === "published" ? "draft" : "published";

      await api.put(`/admin/courses/${course.id}`, { status });
      setMessage(`Course ${status} successfully.`);
      await loadCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Publish status update nahi hua.",
      );
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Delete "${course.title}" and its lessons? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/courses/${course.id}`);
      setMessage("Course deleted successfully.");
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Course delete nahi hua.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            CodingBhai Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold">Course Management</h1>
          <p className="mt-2 text-slate-400">
            Create, update and publish learning courses.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-10 space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Course" : "Create New Course"}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Course title *
              <input
                required
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="Java Complete Course"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block text-sm text-slate-300">
              URL slug *
              <input
                required
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="java-complete-course"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Category
              <input
                name="category"
                value={form.category}
                onChange={updateField}
                placeholder="Programming"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Thumbnail URL
              <input
                type="url"
                name="thumbnail_url"
                value={form.thumbnail_url}
                onChange={updateField}
                placeholder="https://example.com/java.png"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-300">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows={4}
              placeholder="What will students learn?"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              disabled={saving}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Course"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-700 px-5 py-3 hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">All Courses</h2>
            <button
              onClick={loadCourses}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
              No courses found. Create your first course above.
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="mt-1 break-all text-sm text-slate-400">
                      /learn/{course.slug}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {course.category} · {course.lesson_count ?? 0} lessons
                    </p>
                    <span
                      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${
                        course.status === "published"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        window.location.assign(
                          `/admin/courses/${course.id}/lessons`,
                        )
                      }
                      className="rounded-lg border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10"
                    >
                      Manage Lessons
                    </button>
                    <button
                      onClick={() => handlePublish(course)}
                      className="rounded-lg border border-cyan-500/40 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10"
                    >
                      {course.status === "published" ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(course)}
                      className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminCourses;

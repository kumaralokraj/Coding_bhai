
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  title: "",
  slug: "",
  content: "",
  position: 1,
};

function makeSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminLessons() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, lessonsResponse] = await Promise.all([
        api.get(`/admin/courses`),
        api.get(`/admin/courses/${courseId}/lessons`),
      ]);

      const foundCourse = (courseResponse.data.courses || []).find(
        (item) => String(item.id) === String(courseId)
      );

      setCourse(foundCourse || null);
      setLessons(lessonsResponse.data.lessons || []);

      if (!foundCourse) {
        setError("Course not found. Please check the course ID.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Lessons load nahi ho paye. API aur database check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadLessons();
  }, [courseId]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "title" && !editingId
        ? { slug: makeSlug(value) }
        : {}),
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      position: lessons.length + 1,
    });
    setEditingId(null);
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title || "",
      slug: lesson.slug || "",
      content: lesson.content || "",
      position: lesson.position || 1,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        position: Number(form.position),
      };

      if (editingId) {
        await api.put(
          `/admin/courses/lessons/${editingId}`,
          payload
        );
        setMessage("Lesson updated successfully.");
      } else {
        await api.post(
          `/admin/courses/${courseId}/lessons`,
          payload
        );
        setMessage("Lesson created successfully.");
      }

      resetForm();
      await loadLessons();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Lesson save nahi hua. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const changeLessonStatus = async (lesson) => {
    const status =
      lesson.status === "published" ? "draft" : "published";

    try {
      setError("");
      setMessage("");

      await api.put(`/admin/courses/lessons/${lesson.id}`, {
        status,
      });

      setMessage(`Lesson ${status} successfully.`);
      await loadLessons();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Lesson status update nahi hua."
      );
    }
  };

  const deleteLesson = async (lesson) => {
    if (
      !window.confirm(
        `Delete "${lesson.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/admin/courses/lessons/${lesson.id}`);

      setMessage("Lesson deleted successfully.");
      await loadLessons();
    } catch (err) {
      setError(
        err.response?.data?.message || "Lesson delete nahi hua."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          CodingBhai Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Lesson Management
        </h1>

        <p className="mt-2 text-slate-400">
          {course
            ? `Course: ${course.title}`
            : `Course ID: ${courseId}`}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Lesson" : "Add New Lesson"}
          </h2>

          <label className="block text-sm text-slate-300">
            Lesson title *
            <input
              required
              name="title"
              value={form.title}
              onChange={handleFieldChange}
              placeholder="Introduction to Java"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-300">
            URL slug *
            <input
              required
              name="slug"
              value={form.slug}
              onChange={handleFieldChange}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="introduction-to-java"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Lesson notes *
            <textarea
              required
              name="content"
              value={form.content}
              onChange={handleFieldChange}
              rows={14}
              placeholder={`# Introduction to Java

Explain the concept here.

## Example

Write code examples here.

## Key points

- Point one
- Point two`}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm leading-7 outline-none focus:border-cyan-400"
            />
            <span className="mt-2 block text-xs text-slate-500">
              Notes abhi plain text/Markdown format mein save honge.
            </span>
          </label>

          <label className="block text-sm text-slate-300">
            Lesson order
            <input
              required
              type="number"
              min="1"
              name="position"
              value={form.position}
              onChange={handleFieldChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || !course}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Lesson"}
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

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              Lessons ({lessons.length})
            </h2>

            <button
              type="button"
              onClick={loadLessons}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              No lessons yet. Create the first lesson above.
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-xs text-cyan-400">
                      LESSON {lesson.position}
                    </p>

                    <h3 className="mt-1 font-semibold">
                      {lesson.title}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-400">
                      {lesson.slug}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {lesson.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(lesson)}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => changeLessonStatus(lesson)}
                      className="rounded-lg border border-cyan-500/40 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10"
                    >
                      {lesson.status === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteLesson(lesson)}
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

export default AdminLessons;

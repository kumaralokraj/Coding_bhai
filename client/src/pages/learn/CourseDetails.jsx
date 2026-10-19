import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";
import api from "../../services/api";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/courses/${encodeURIComponent(courseId)}`
        );
        setCourse(response.data.course);
      } catch (err) {
        setCourse(null);
        setError(
          err.response?.data?.message || "Course load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const lessons = course?.lessons || [];
  const firstLesson = lessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
            <Link to="/learn" className="hover:text-cyan-400">
              Learning
            </Link>
            {course && (
              <>
                <span className="mx-2">/</span>
                <span className="text-white">{course.title}</span>
              </>
            )}
          </nav>

          {loading ? (
            <p className="text-slate-400">Loading course...</p>
          ) : error ? (
            <div className="rounded-2xl border border-slate-800 p-8">
              <h1 className="text-3xl font-bold">Course not found</h1>
              <p className="mt-3 text-slate-400">{error}</p>
              <Link
                to="/learn"
                className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
              >
                ← Back to Learning
              </Link>
            </div>
          ) : (
            <>
              <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-10">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                  {course.category || "Programming"}
                </span>

                <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                  {course.title}
                </h1>

                {course.description && (
                  <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                    {course.description}
                  </p>
                )}

                <p className="mt-6 inline-flex rounded-lg bg-slate-800 px-3 py-2 text-sm">
                  📚 {lessons.length} published{" "}
                  {lessons.length === 1 ? "lesson" : "lessons"}
                </p>

                {firstLesson && (
                  <Link
                    to={`/learn/${course.slug}/lesson/${firstLesson.slug}`}
                    className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Start Learning →
                  </Link>
                )}
              </header>

              <section className="mt-10">
                <h2 className="text-2xl font-bold">Course Curriculum</h2>
                <p className="mt-2 text-slate-400">
                  Choose a published lesson to start learning.
                </p>

                {lessons.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    No published lessons are available yet.
                  </p>
                ) : (
                  <ol className="mt-6 space-y-3">
                    {lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          to={`/learn/${course.slug}/lesson/${lesson.slug}`}
                          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 hover:border-cyan-400/60 hover:bg-slate-800/60"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                            {lesson.position}
                          </span>
                          <span className="flex-1 font-medium">
                            {lesson.title}
                          </span>
                          <span className="text-cyan-400" aria-hidden="true">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;

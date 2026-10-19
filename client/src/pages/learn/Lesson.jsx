import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";
import api from "../../services/api";

function Lesson() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`
        );
        setLesson(response.data.lesson);
      } catch (err) {
        setLesson(null);
        setError(
          err.response?.data?.message || "Lesson load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <p className="text-slate-400">Loading lesson...</p>
          ) : error ? (
            <div className="rounded-2xl border border-slate-800 p-8">
              <h1 className="text-3xl font-bold">Lesson not found</h1>
              <p className="mt-3 text-slate-400">{error}</p>
              <Link
                to={`/learn/${courseId}`}
                className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
              >
                ← Back to course
              </Link>
            </div>
          ) : (
            <>
              <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
                <Link to="/learn" className="hover:text-cyan-400">
                  Learning
                </Link>
                <span className="mx-2">/</span>
                <Link
                  to={`/learn/${lesson.course_slug}`}
                  className="hover:text-cyan-400"
                >
                  {lesson.course_title}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{lesson.lesson_title}</span>
              </nav>

              <article>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  Lesson {lesson.position}
                </p>
                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                  {lesson.lesson_title}
                </h1>
                <div className="mt-8 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-6 leading-8 text-slate-200 sm:p-8">
                  {lesson.content}
                </div>
              </article>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Lesson;

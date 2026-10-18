
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

function Learn() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Courses load nahi ho paye. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const text =
      `${course.title} ${course.category} ${course.description || ""}`
        .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="px-4 py-10 lg:ml-64 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-semibold uppercase tracking-widest text-cyan-400">
            CodingBhai Academy
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Learn. Build. <span className="text-cyan-400">Grow.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore programming courses and improve your coding skills
            step by step.
          </p>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="mt-8 w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {loading && (
            <p className="mt-8 text-slate-400">Loading courses...</p>
          )}

          {error && (
            <p className="mt-8 text-red-400">{error}</p>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 p-8 text-center">
              <h2 className="text-xl font-semibold">
                No courses found
              </h2>
              <p className="mt-2 text-slate-400">
                Publish a course from the Admin Panel to display it here.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-800 to-cyan-950">
                    <span className="text-5xl font-bold text-cyan-300">
                      {course.title?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    {course.category || "Programming"}
                  </span>

                  <h2 className="mt-4 text-xl font-bold">
                    {course.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                    {course.description || "Start learning this course today."}
                  </p>

                  <p className="mt-4 text-sm text-slate-500">
                    {course.lesson_count ?? 0} lessons
                  </p>

                  <Link
                    to={`/learn/${course.slug}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Start Learning →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Learn;

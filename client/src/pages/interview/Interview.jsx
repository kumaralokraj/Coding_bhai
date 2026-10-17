import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import interviewService from "../../services/interviewService";

function Interview() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await interviewService.getUserInterviews(1, 5);
        setSessions(response.data.interviews || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load interview sessions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  return (
    <div className="px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="mb-2 text-sm text-cyan-400">Practice and prepare</p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Interview Practice
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Pick a difficulty, answer real interview questions, and review your
            answers when you finish.
          </p>
          <Link
            to="/interview/setup"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start an interview
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Recent interviews</h2>
            <p className="mt-1 text-sm text-slate-400">
              Review completed practice sessions.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Loading your sessions...</p>
          ) : error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </p>
          ) : sessions.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
              No interviews yet. Start your first practice session above.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  to={
                    session.status === "completed"
                      ? `/interview/result/${session.id}`
                      : `/interview/session/${session.id}`
                  }
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium capitalize text-white">
                      {session.difficulty} interview
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">
                    {session.status.replaceAll("_", " ")}
                    {session.status === "completed" && session.score != null
                      ? ` · ${session.score}%`
                      : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Interview;

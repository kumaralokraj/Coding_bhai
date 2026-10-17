import { useEffect, useState } from "react";
import { getProgress } from "../services/progress";

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getActivityColor = (count) => {
  if (!count) return "bg-slate-800";
  if (count <= 2) return "bg-cyan-950";
  if (count <= 4) return "bg-cyan-800";
  if (count <= 6) return "bg-cyan-600";
  return "bg-cyan-400";
};

function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress();
        setProgress(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading your progress...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  const { summary, topics, activity } = progress;
  const activityByDate = new Map(activity.map((day) => [day.date, day]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDays = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (83 - index));

    const dateKey = formatDateKey(date);
    return {
      date: dateKey,
      ...(activityByDate.get(dateKey) || { submissions: 0, solvedProblems: 0 }),
    };
  });

  const stats = [
    { label: "Problems solved", value: summary.solvedProblems },
    { label: "Problems attempted", value: summary.attemptedProblems },
    { label: "Total submissions", value: summary.totalSubmissions },
    { label: "Acceptance rate", value: `${summary.acceptanceRate}%` },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">Your journey</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Progress
          </h1>
          <p className="mt-2 text-slate-400">
            Track your coding activity and solved problems.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Problem progress</h2>
            <p className="mt-1 text-sm text-slate-400">
              Problems solved in each topic.
            </p>
          </div>

          {topics.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
              No active problem topics yet.
            </p>
          ) : (
            <div className="space-y-5">
              {topics.map((topic) => {
                const percentage = topic.totalProblems
                  ? Math.round(
                      (topic.solvedProblems / topic.totalProblems) * 100
                    )
                  : 0;

                return (
                  <div key={topic.name}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-200">
                        {topic.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {topic.solvedProblems} / {topic.totalProblems} solved
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-800"
                      role="progressbar"
                      aria-label={`${topic.name} progress`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={percentage}
                    >
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Coding activity</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your submissions over the last 12 weeks.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="grid grid-flow-col grid-rows-7 gap-1">
                {activityDays.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.submissions} submissions on ${day.date}`}
                    className={`h-4 w-4 rounded-sm ${getActivityColor(
                      day.submissions
                    )}`}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <span className="text-xs text-slate-500">Less</span>
                {[0, 1, 3, 5, 7].map((count) => (
                  <div
                    key={count}
                    className={`h-4 w-4 rounded-sm ${getActivityColor(count)}`}
                  />
                ))}
                <span className="text-xs text-slate-500">More</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Progress;

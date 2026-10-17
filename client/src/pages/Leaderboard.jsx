import { useEffect, useState } from "react";
import leaderboardService from "../services/leaderboardService";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await leaderboardService.getGlobalLeaderboard(
          pagination.page,
          pagination.limit
        );

        if (isCurrent) {
          setLeaderboard(response.data.leaderboard || []);
          setPagination((current) => ({
            ...current,
            ...response.data.pagination,
          }));
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              "Failed to load leaderboard."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      isCurrent = false;
    };
  }, [pagination.page, pagination.limit, refreshKey]);

  return (
    <div className="px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">Community rankings</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Leaderboard</h1>
          <p className="mt-2 text-slate-400">
            Top coders ranked by unique problems solved.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-white">Global rankings</h2>
              <p className="mt-1 text-sm text-slate-400">
                {pagination.total} {pagination.total === 1 ? "coder" : "coders"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={loading}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="p-6 text-sm text-red-400">{error}</div>
          ) : loading ? (
            <div className="p-6 text-sm text-slate-400">
              Loading leaderboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-white">No rankings yet</p>
              <p className="mt-2 text-sm text-slate-400">
                Solve a problem to appear on the leaderboard.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Rank</th>
                      <th className="px-5 py-4 font-medium">Coder</th>
                      <th className="px-5 py-4 text-right font-medium">
                        Problems solved
                      </th>
                      <th className="px-5 py-4 text-right font-medium">
                        Submissions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {leaderboard.map((coder) => (
                      <tr
                        key={coder.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4 font-semibold text-cyan-400">
                          {Number(coder.rank) <= 3
                            ? ["🥇", "🥈", "🥉"][Number(coder.rank) - 1]
                            : `#${coder.rank}`}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 font-semibold text-cyan-400">
                              {(coder.name || "C").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-white">
                              {coder.name || "Coder"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-white">
                          {coder.problems_solved}
                        </td>
                        <td className="px-5 py-4 text-right text-slate-400">
                          {coder.total_submissions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
                <p className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPagination((current) => ({
                        ...current,
                        page: current.page - 1,
                      }))
                    }
                    disabled={pagination.page <= 1}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPagination((current) => ({
                        ...current,
                        page: current.page + 1,
                      }))
                    }
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Leaderboard;

import { useEffect, useState } from "react";
import { getActivity } from "../../services/activity";

function ActivityChart() {
  const [activeDay, setActiveDay] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ACTIVITY =================

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getActivity();

        console.log("Activity API:", data);

        setActivity(data.activity || []);
      } catch (error) {
        console.error("Activity Error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load activity"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // ================= COLORS =================

  const getActivityColor = (count) => {
    if (count === 0) return "bg-slate-800";
    if (count <= 2) return "bg-cyan-950";
    if (count <= 4) return "bg-cyan-800";
    if (count <= 6) return "bg-cyan-600";

    return "bg-cyan-400";
  };

  // ================= DATE =================

  const getDate = (dateValue) => {
    const date = new Date(dateValue);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ================= TOTAL =================

  const totalSolved = activity.reduce(
    (total, item) => total + Number(item.count || 0),
    0
  );

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Loading coding activity...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="mt-8 rounded-2xl border border-red-500/20 bg-slate-900 p-6">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-bold text-white">
            Coding Activity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your coding activity over the last 12 weeks.
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400">
            {totalSolved}
          </p>

          <p className="text-xs text-slate-500">
            problems solved
          </p>
        </div>

      </div>

      {/* Chart */}

      <div className="mt-8 overflow-x-auto">

        <div className="min-w-[650px]">

          {/* Labels */}

          <div className="mb-3 ml-1 flex justify-between text-xs text-slate-500">
            <span>12 weeks ago</span>
            <span>8 weeks ago</span>
            <span>4 weeks ago</span>
            <span>Today</span>
          </div>

          {/* Grid */}

          <div className="grid grid-flow-col grid-rows-7 gap-1">

            {activity.map((day, index) => (
              <div
                key={day.date || index}
                onClick={() => setActiveDay(day)}
                title={`${day.count} problems • ${getDate(day.date)}`}
                className={`
                  h-4
                  w-4
                  cursor-pointer
                  rounded-sm
                  transition-all
                  duration-200
                  hover:scale-125
                  ${getActivityColor(Number(day.count || 0))}
                `}
              />
            ))}

          </div>

          {/* Legend */}

          <div className="mt-5 flex items-center justify-end gap-2">

            <span className="text-xs text-slate-500">
              Less
            </span>

            <div className="h-4 w-4 rounded-sm bg-slate-800" />
            <div className="h-4 w-4 rounded-sm bg-cyan-950" />
            <div className="h-4 w-4 rounded-sm bg-cyan-800" />
            <div className="h-4 w-4 rounded-sm bg-cyan-600" />
            <div className="h-4 w-4 rounded-sm bg-cyan-400" />

            <span className="text-xs text-slate-500">
              More
            </span>

          </div>

        </div>
      </div>

      {/* Selected Day */}

      {activeDay && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-950 p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-white">
                {getDate(activeDay.date)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Coding activity
              </p>
            </div>

            <p className="text-lg font-bold text-cyan-400">
              {activeDay.count}{" "}
              {activeDay.count === 1 ? "problem" : "problems"}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default ActivityChart;
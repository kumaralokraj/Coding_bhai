import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import interviewService from "../../services/interviewService";

function InterviewSetup() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await interviewService.getInterviewQuestions(
          difficulty,
          null,
          1,
          20
        );

        if (isCurrent) {
          setQuestions(response.data.questions || []);
          setQuestionCount((count) =>
            Math.min(count, response.data.questions?.length || 5)
          );
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              "Failed to load interview questions."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isCurrent = false;
    };
  }, [difficulty]);

  const handleStart = async () => {
    try {
      setStarting(true);
      setError("");

      const selectedQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount);
      const response = await interviewService.startInterview(
        difficulty,
        selectedQuestions.map((question) => question.id)
      );

      navigate(`/interview/session/${response.data.interview.id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to start interview."
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/interview"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to interviews
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="mb-2 text-sm text-cyan-400">Customize your practice</p>
          <h1 className="text-3xl font-bold">Setup Interview</h1>
          <p className="mt-2 text-slate-400">
            Choose a difficulty and how many questions to practice.
          </p>

          <label
            htmlFor="interview-difficulty"
            className="mt-8 block text-sm font-medium text-slate-200"
          >
            Difficulty
          </label>
          <select
            id="interview-difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {loading ? (
            <p className="mt-6 text-sm text-slate-400">
              Loading available questions...
            </p>
          ) : questions.length === 0 ? (
            <p className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
              There are no {difficulty} questions available yet.
            </p>
          ) : (
            <>
              <p className="mt-6 text-sm font-medium text-slate-200">
                Number of questions
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[5, 10, 15, 20]
                  .filter((count) => count <= questions.length)
                  .map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        questionCount === count
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                          : "border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {count} questions
                    </button>
                  ))}
                {!([5, 10, 15, 20].includes(questions.length)) && (
                  <button
                    type="button"
                    onClick={() => setQuestionCount(questions.length)}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      questionCount === questions.length
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    All {questions.length}
                  </button>
                )}
              </div>
            </>
          )}

          {error && (
            <p className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={loading || starting || questions.length === 0}
            className="mt-8 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? "Starting..." : "Start practice"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewSetup;

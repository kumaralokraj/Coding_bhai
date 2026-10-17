import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import interviewService from "../../services/interviewService";

function InterviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadResult = async () => {
      try {
        const response = await interviewService.getInterviewSession(id);
        if (!isCurrent) return;

        if (response.data.interview.status !== "completed") {
          navigate(`/interview/session/${id}`, { replace: true });
          return;
        }

        setInterview(response.data.interview);
        setQuestions(response.data.questions || []);
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Failed to load interview results."
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadResult();
    return () => {
      isCurrent = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading interview results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
        <Link
          to="/interview"
          className="mt-4 inline-block text-sm text-cyan-400"
        >
          Back to interviews
        </Link>
      </div>
    );
  }

  const submittedAnswers = Array.isArray(interview.answers)
    ? interview.answers
    : [];
  const answerByQuestion = new Map(
    submittedAnswers.map((item) => [Number(item.questionId), item.answer])
  );
  const answeredCount = submittedAnswers.filter(
    (item) => typeof item.answer === "string" && item.answer.trim().length > 0
  ).length;

  return (
    <div className="px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="mb-2 text-sm capitalize text-cyan-400">
            {interview.difficulty} interview
          </p>
          <h1 className="text-3xl font-bold">Interview results</h1>
          <p className="mt-2 text-slate-400">
            You answered {answeredCount} of {questions.length} questions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl bg-slate-950 px-5 py-4">
              <p className="text-sm text-slate-400">Completion</p>
              <p className="mt-1 text-2xl font-bold text-cyan-400">
                {interview.score ?? 0}%
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 px-5 py-4">
              <p className="text-sm text-slate-400">Duration</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {interview.started_at && interview.ended_at
                  ? `${Math.max(
                      1,
                      Math.round(
                        (new Date(interview.ended_at) -
                          new Date(interview.started_at)) /
                          60000
                      )
                    )} min`
                  : "—"}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <section
              key={question.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
            >
              <p className="mb-3 text-sm font-semibold text-cyan-400">
                Question {index + 1}
              </p>
              <h2 className="font-medium leading-relaxed text-white">
                {question.question}
              </h2>

              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your answer
                </h3>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-300">
                  {answerByQuestion.get(Number(question.id)) ||
                    "No answer provided."}
                </p>
              </div>

              {question.answer && (
                <details className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-cyan-300">
                    Show reference answer
                  </summary>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                    {question.answer}
                  </p>
                </details>
              )}
            </section>
          ))}
        </div>

        <Link
          to="/interview/setup"
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Practice again
        </Link>
      </div>
    </div>
  );
}

export default InterviewResult;

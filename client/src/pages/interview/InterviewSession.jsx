import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import interviewService from "../../services/interviewService";

function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadSession = async () => {
      try {
        const response = await interviewService.getInterviewSession(id);
        if (!isCurrent) return;

        const session = response.data.interview;
        setInterview(session);
        setQuestions(response.data.questions || []);

        if (session.status === "completed") {
          navigate(`/interview/result/${id}`, { replace: true });
          return;
        }

        if (session.answers && Array.isArray(session.answers)) {
          setAnswers(
            Object.fromEntries(
              session.answers.map((item) => [
                item.questionId,
                item.answer || "",
              ])
            )
          );
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Failed to load interview."
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadSession();
    return () => {
      isCurrent = false;
    };
  }, [id, navigate]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      const response = await interviewService.submitInterview(
        id,
        questions.map((question) => ({
          questionId: question.id,
          answer: answers[question.id] || "",
        }))
      );

      if (response.data.success) {
        navigate(`/interview/result/${id}`);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to submit your interview."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading interview questions...
      </div>
    );
  }

  if (error && !interview) {
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

  if (questions.length === 0) {
    return (
      <div className="p-6">
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
          This interview has no questions.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm capitalize text-cyan-400">
              {interview.difficulty} interview
            </p>
            <h1 className="mt-1 text-3xl font-bold">Interview session</h1>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-300">
            {questions.length} questions
          </span>
        </div>

        <p className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
          Write your answer for each question. You can leave questions blank
          and review the reference answers after you submit.
        </p>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <section
              key={question.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-cyan-400">
                  Question {index + 1}
                </p>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-400">
                  {question.topic || question.difficulty}
                </span>
              </div>
              <h2 className="font-medium leading-relaxed text-white">
                {question.question}
              </h2>
              <textarea
                value={answers[question.id] || ""}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: event.target.value,
                  }))
                }
                maxLength={10000}
                rows={5}
                placeholder="Write your answer here..."
                aria-label={`Answer for question ${index + 1}`}
                className="mt-5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </section>
          ))}
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Link
            to="/interview"
            className="rounded-xl border border-slate-700 px-5 py-3 text-center font-medium text-slate-300 transition hover:border-slate-500"
          >
            Exit interview
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit and review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewSession;

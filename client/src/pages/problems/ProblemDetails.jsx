// import { Link, useParams } from "react-router-dom";

// const problems = [
//   {
//     id: 1,
//     title: "Two Sum",
//     difficulty: "Easy",
//     topics: ["Array", "Hash Map"],

//     description:
//       "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

//     examples: [
//       {
//         input: 'nums = [2,7,11,15], target = 9',
//         output: "[0,1]",
//         explanation:
//           "Because nums[0] + nums[1] = 2 + 7 = 9.",
//       },
//       {
//         input: "nums = [3,2,4], target = 6",
//         output: "[1,2]",
//         explanation:
//           "Because nums[1] + nums[2] = 2 + 4 = 6.",
//       },
//     ],

//     constraints: [
//       "2 <= nums.length <= 10⁴",
//       "-10⁹ <= nums[i] <= 10⁹",
//       "-10⁹ <= target <= 10⁹",
//       "Only one valid answer exists.",
//     ],
//   },

//   {
//     id: 2,
//     title: "Valid Parentheses",
//     difficulty: "Easy",
//     topics: ["Stack", "String"],

//     description:
//       "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",

//     examples: [
//       {
//         input: 's = "()"',
//         output: "true",
//         explanation:
//           "The opening and closing parentheses are properly matched.",
//       },
//       {
//         input: 's = "()[]{}"',
//         output: "true",
//         explanation:
//           "All brackets are correctly closed.",
//       },
//       {
//         input: 's = "(]"',
//         output: "false",
//         explanation:
//           "The opening parenthesis is closed by a square bracket.",
//       },
//     ],

//     constraints: [
//       "1 <= s.length <= 10⁴",
//       "s consists only of parentheses, brackets and braces.",
//     ],
//   },
// ];

// function ProblemDetails() {
//   const { id } = useParams();

//   const problem = problems.find(
//     (item) => item.id === Number(id)
//   );

//   if (!problem) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">
//             Problem Not Found
//           </h1>

//           <Link
//             to="/problems"
//             className="mt-5 inline-block text-cyan-400 hover:text-cyan-300"
//           >
//             ← Back to Problems
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">

//       {/* Header */}
//       <header className="border-b border-slate-800">
//         <div className="mx-auto max-w-6xl px-6 py-6">

//           <Link
//             to="/problems"
//             className="text-sm text-slate-400 transition hover:text-cyan-400"
//           >
//             ← Back to Problems
//           </Link>

//           <div className="mt-6">

//             <div className="flex flex-wrap items-center gap-3">

//               <h1 className="text-3xl font-bold">
//                 {problem.title}
//               </h1>

//               <DifficultyBadge
//                 difficulty={problem.difficulty}
//               />

//             </div>

//             {/* Topics */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {problem.topics.map((topic) => (
//                 <span
//                   key={topic}
//                   className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-400"
//                 >
//                   {topic}
//                 </span>
//               ))}
//             </div>

//           </div>

//         </div>
//       </header>

//       {/* Main */}
//       <main className="mx-auto max-w-6xl px-6 py-10">

//         <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

//           {/* Problem Content */}
//           <section>

//             {/* Description */}
//             <Section title="Problem Description">

//               <p className="leading-7 text-slate-300">
//                 {problem.description}
//               </p>

//             </Section>

//             {/* Examples */}
//             <Section title="Examples">

//               <div className="space-y-6">

//                 {problem.examples.map((example, index) => (
//                   <div
//                     key={index}
//                     className="rounded-xl border border-slate-800 bg-slate-900 p-5"
//                   >

//                     <h3 className="mb-4 font-semibold">
//                       Example {index + 1}
//                     </h3>

//                     <div className="space-y-3 text-sm">

//                       <div>
//                         <span className="text-slate-500">
//                           Input:
//                         </span>

//                         <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-cyan-300">
//                           {example.input}
//                         </pre>
//                       </div>

//                       <div>
//                         <span className="text-slate-500">
//                           Output:
//                         </span>

//                         <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-emerald-400">
//                           {example.output}
//                         </pre>
//                       </div>

//                       <div>
//                         <span className="text-slate-500">
//                           Explanation:
//                         </span>

//                         <p className="mt-1 text-slate-300">
//                           {example.explanation}
//                         </p>
//                       </div>

//                     </div>

//                   </div>
//                 ))}

//               </div>

//             </Section>

//             {/* Constraints */}
//             <Section title="Constraints">

//               <ul className="space-y-3">
//                 {problem.constraints.map(
//                   (constraint, index) => (
//                     <li
//                       key={index}
//                       className="flex gap-3 text-slate-300"
//                     >
//                       <span className="text-cyan-400">
//                         •
//                       </span>

//                       <code className="text-sm">
//                         {constraint}
//                       </code>
//                     </li>
//                   )
//                 )}
//               </ul>

//             </Section>

//           </section>

//           {/* Sidebar */}
//           <aside>

//             <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

//               <h2 className="text-lg font-semibold">
//                 Solve this problem
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-slate-400">
//                 Choose your language and start solving this
//                 problem in the CodingBhai editor.
//               </p>

//               <Link
//                 to={`/problems/${problem.id}/solve`}
//                 className="mt-6 block rounded-xl bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
//               >
//                 Start Coding →
//               </Link>

//               <div className="mt-6 border-t border-slate-800 pt-5">

//                 <p className="text-xs uppercase tracking-wide text-slate-500">
//                   Difficulty
//                 </p>

//                 <div className="mt-2">
//                   <DifficultyBadge
//                     difficulty={problem.difficulty}
//                   />
//                 </div>

//               </div>

//               <div className="mt-5">

//                 <p className="text-xs uppercase tracking-wide text-slate-500">
//                   Topics
//                 </p>

//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {problem.topics.map((topic) => (
//                     <span
//                       key={topic}
//                       className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400"
//                     >
//                       {topic}
//                     </span>
//                   ))}
//                 </div>

//               </div>

//             </div>

//           </aside>

//         </div>

//       </main>

//     </div>
//   );
// }


// /* ================= COMPONENTS ================= */

// function Section({ title, children }) {
//   return (
//     <section className="mb-10">

//       <h2 className="mb-4 text-xl font-bold">
//         {title}
//       </h2>

//       {children}

//     </section>
//   );
// }


// function DifficultyBadge({ difficulty }) {

//   const styles = {
//     Easy: "bg-emerald-500/10 text-emerald-400",
//     Medium: "bg-yellow-500/10 text-yellow-400",
//     Hard: "bg-red-500/10 text-red-400",
//   };

//   return (
//     <span
//       className={`rounded-lg px-3 py-1 text-xs font-semibold ${styles[difficulty]}`}
//     >
//       {difficulty}
//     </span>
//   );
// }


// export default ProblemDetails;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProblemById } from "../../services/problemService";

function ProblemDetails() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Problem ID:", id);

        const data = await getProblemById(id);

        console.log("Problem Details:", data);

        setProblem(data.problem);

      } catch (err) {
        console.error("Problem Details Error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load problem"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-cyan-400">
          Loading problem...
        </p>
      </div>
    );
  }


  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <p className="text-red-400 text-lg">
            {error}
          </p>

          <Link
            to="/problems"
            className="inline-block mt-4 rounded-lg bg-cyan-500 px-5 py-2 text-slate-950"
          >
            Back to Problems
          </Link>

        </div>
      </div>
    );
  }


  if (!problem) {
    return null;
  }


  // ================= PAGE =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Back */}

        <Link
          to="/problems"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Problems
        </Link>


        {/* Title */}

        <div className="mt-8">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl font-bold">
              {problem.title}
            </h1>

            <span
              className={`
                rounded-md px-3 py-1 text-sm font-medium
                ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-red-500/10 text-red-400"
                }
              `}
            >
              {problem.difficulty}
            </span>

          </div>


          {/* Category */}

          <p className="mt-3 text-slate-400">
            {problem.category}
          </p>

        </div>


        {/* Description */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Problem Description
          </h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
            {problem.description}
          </p>

        </div>


        {/* Tags */}

        {problem.tags?.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-lg font-bold">
              Topics
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">

              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300"
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>
        )}


        {/* Stats */}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-500">
              Acceptance Rate
            </p>

            <p className="mt-2 text-2xl font-bold">
              {problem.acceptance_rate ?? 0}%
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-500">
              Submissions
            </p>

            <p className="mt-2 text-2xl font-bold">
              {problem.total_submissions ?? 0}
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-500">
              Accepted
            </p>

            <p className="mt-2 text-2xl font-bold">
              {problem.total_accepted ?? 0}
            </p>

          </div>

        </div>


        {/* Solve Button */}

        <div className="mt-8">

          <Link
            to={`/problems/${problem.id}/solve`}
            className="inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Solve Problem →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default ProblemDetails;
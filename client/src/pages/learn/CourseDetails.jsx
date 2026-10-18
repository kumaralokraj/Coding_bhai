
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

const courses = {
  java: {
    title: "Java Programming Tutorial",
    category: "Programming",
    level: "Beginner to Advanced",
    description:
      "Learn Java programming from fundamentals to object-oriented programming, collections, exception handling and interview preparation.",
    topics: [
      {
        title: "Introduction to Java",
        lessons: [
          { id: "java-introduction", title: "What Is Java?", duration: "8 min" },
          { id: "java-installation", title: "Java Installation and Setup", duration: "10 min" },
          { id: "java-first-program", title: "Your First Java Program", duration: "12 min" },
        ],
      },
      {
        title: "Java Fundamentals",
        lessons: [
          { id: "java-variables", title: "Variables and Data Types", duration: "12 min" },
          { id: "java-operators", title: "Java Operators", duration: "10 min" },
          { id: "java-control-flow", title: "Conditions and Loops", duration: "15 min" },
        ],
      },
      {
        title: "Object-Oriented Programming",
        lessons: [
          { id: "java-classes-objects", title: "Classes and Objects", duration: "15 min" },
          { id: "java-inheritance", title: "Inheritance", duration: "12 min" },
          { id: "java-polymorphism", title: "Polymorphism", duration: "12 min" },
          { id: "java-encapsulation", title: "Encapsulation and Abstraction", duration: "15 min" },
        ],
      },
    ],
  },

  javascript: {
    title: "JavaScript Tutorial",
    category: "Web Development",
    level: "Beginner to Advanced",
    description:
      "Learn JavaScript fundamentals, functions, arrays, objects, promises, async programming and modern ES6+ features.",
    topics: [
      {
        title: "JavaScript Basics",
        lessons: [
          { id: "js-introduction", title: "Introduction to JavaScript", duration: "8 min" },
          { id: "js-variables", title: "Variables: let, const and var", duration: "12 min" },
          { id: "js-data-types", title: "Data Types and Type Conversion", duration: "12 min" },
        ],
      },
      {
        title: "Functions and Objects",
        lessons: [
          { id: "js-functions", title: "Functions and Arrow Functions", duration: "15 min" },
          { id: "js-arrays", title: "Arrays and Array Methods", duration: "15 min" },
          { id: "js-objects", title: "Objects and Destructuring", duration: "15 min" },
        ],
      },
      {
        title: "Asynchronous JavaScript",
        lessons: [
          { id: "js-promises", title: "Promises", duration: "15 min" },
          { id: "js-async-await", title: "Async and Await", duration: "15 min" },
          { id: "js-fetch-api", title: "Fetch API", duration: "12 min" },
        ],
      },
    ],
  },

  react: {
    title: "React.js Tutorial",
    category: "Web Development",
    level: "Beginner to Advanced",
    description:
      "Learn React components, JSX, props, state, hooks, routing and reusable UI development.",
    topics: [
      {
        title: "React Fundamentals",
        lessons: [
          { id: "react-introduction", title: "What Is React?", duration: "8 min" },
          { id: "react-jsx", title: "JSX and Components", duration: "15 min" },
          { id: "react-props", title: "Props and Component Reuse", duration: "12 min" },
        ],
      },
      {
        title: "React Hooks",
        lessons: [
          { id: "react-usestate", title: "useState Hook", duration: "15 min" },
          { id: "react-useeffect", title: "useEffect Hook", duration: "15 min" },
          { id: "react-custom-hooks", title: "Custom Hooks", duration: "15 min" },
        ],
      },
      {
        title: "Building Applications",
        lessons: [
          { id: "react-router", title: "React Router", duration: "15 min" },
          { id: "react-api", title: "Fetching API Data", duration: "15 min" },
          { id: "react-project", title: "Build a React Project", duration: "30 min" },
        ],
      },
    ],
  },

  python: {
    title: "Python Programming Tutorial",
    category: "Programming",
    level: "Beginner to Advanced",
    description:
      "Learn Python syntax, variables, data structures, functions, object-oriented programming and practical examples.",
    topics: [
      {
        title: "Python Basics",
        lessons: [
          { id: "python-introduction", title: "Introduction to Python", duration: "8 min" },
          { id: "python-variables", title: "Variables and Data Types", duration: "12 min" },
          { id: "python-conditions", title: "Conditions and Loops", duration: "15 min" },
        ],
      },
      {
        title: "Python Data Structures",
        lessons: [
          { id: "python-lists", title: "Lists and Tuples", duration: "15 min" },
          { id: "python-dictionaries", title: "Dictionaries and Sets", duration: "15 min" },
          { id: "python-functions", title: "Functions", duration: "15 min" },
        ],
      },
    ],
  },

  cpp: {
    title: "C++ Programming Tutorial",
    category: "Programming",
    level: "Beginner to Advanced",
    description:
      "Learn C++ fundamentals, object-oriented programming, STL, memory concepts and problem solving.",
    topics: [
      {
        title: "C++ Basics",
        lessons: [
          { id: "cpp-introduction", title: "Introduction to C++", duration: "8 min" },
          { id: "cpp-variables", title: "Variables and Data Types", duration: "12 min" },
          { id: "cpp-loops", title: "Conditions and Loops", duration: "15 min" },
        ],
      },
      {
        title: "Object-Oriented C++",
        lessons: [
          { id: "cpp-classes", title: "Classes and Objects", duration: "15 min" },
          { id: "cpp-inheritance", title: "Inheritance and Polymorphism", duration: "15 min" },
          { id: "cpp-stl", title: "Introduction to STL", duration: "20 min" },
        ],
      },
    ],
  },

  sql: {
    title: "SQL and DBMS Tutorial",
    category: "Databases",
    level: "Beginner to Advanced",
    description:
      "Learn SQL queries, joins, aggregate functions, database design and essential DBMS concepts.",
    topics: [
      {
        title: "SQL Basics",
        lessons: [
          { id: "sql-introduction", title: "Introduction to SQL", duration: "8 min" },
          { id: "sql-select", title: "SELECT, WHERE and ORDER BY", duration: "15 min" },
          { id: "sql-aggregate", title: "Aggregate Functions", duration: "12 min" },
        ],
      },
      {
        title: "SQL Joins and Design",
        lessons: [
          { id: "sql-joins", title: "SQL Joins Explained", duration: "15 min" },
          { id: "sql-subqueries", title: "Subqueries", duration: "15 min" },
          { id: "sql-normalization", title: "Database Normalization", duration: "15 min" },
        ],
      },
    ],
  },

  dsa: {
    title: "Data Structures and Algorithms",
    category: "Computer Science",
    level: "Beginner to Advanced",
    description:
      "Study data structures, algorithms, complexity analysis and common coding interview patterns.",
    topics: [
      {
        title: "DSA Fundamentals",
        lessons: [
          { id: "dsa-introduction", title: "What Is DSA?", duration: "8 min" },
          { id: "dsa-complexity", title: "Time and Space Complexity", duration: "15 min" },
          { id: "dsa-arrays", title: "Arrays", duration: "20 min" },
        ],
      },
      {
        title: "Core Data Structures",
        lessons: [
          { id: "dsa-strings", title: "Strings", duration: "20 min" },
          { id: "dsa-linked-lists", title: "Linked Lists", duration: "25 min" },
          { id: "dsa-stacks-queues", title: "Stacks and Queues", duration: "25 min" },
          { id: "dsa-trees", title: "Trees and Binary Search Trees", duration: "30 min" },
        ],
      },
    ],
  },

  genai: {
    title: "Generative AI Tutorial",
    category: "Artificial Intelligence",
    level: "Beginner to Advanced",
    description:
      "Learn LLMs, prompt engineering, embeddings, vector databases, RAG and AI application development.",
    topics: [
      {
        title: "GenAI Fundamentals",
        lessons: [
          { id: "genai-introduction", title: "What Is Generative AI?", duration: "10 min" },
          { id: "genai-llms", title: "Understanding LLMs", duration: "15 min" },
          { id: "genai-prompting", title: "Prompt Engineering", duration: "15 min" },
        ],
      },
      {
        title: "Building AI Applications",
        lessons: [
          { id: "genai-embeddings", title: "Embeddings", duration: "15 min" },
          { id: "genai-vectordb", title: "Vector Databases", duration: "20 min" },
          { id: "genai-rag", title: "Retrieval-Augmented Generation (RAG)", duration: "25 min" },
        ],
      },
    ],
  },
};

function CourseDetails() {
  const { courseId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState([0]);

  const course = courses[courseId?.toLowerCase()];

  const toggleTopic = (index) => {
    setExpandedTopics((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="px-4 py-12 lg:ml-64">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold">Course not found</h1>
            <p className="mt-3 text-slate-400">
              This course is not available yet.
            </p>
            <Link
              to="/learn"
              className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Learning
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const allLessons = course.topics.flatMap((topic) => topic.lessons);
  const totalMinutes = allLessons.reduce((total, lesson) => {
    return total + Number.parseInt(lesson.duration, 10);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
            <Link to="/learn" className="hover:text-cyan-400">
              Learning
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{course.title}</span>
          </nav>

          <header className="rounded-3xl border border-cyan-500/20 bg-gradient- to-br from-slate-900 to-blue-950 p-6 sm:p-10">
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
              {course.category}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              {course.title}
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-lg bg-slate-800 px-3 py-2">
                📚 {allLessons.length} lessons
              </span>
              <span className="rounded-lg bg-slate-800 px-3 py-2">
                ⏱️ About {Math.ceil(totalMinutes / 60)} hours
              </span>
              <span className="rounded-lg bg-slate-800 px-3 py-2">
                🎯 {course.level}
              </span>
            </div>

            {allLessons[0] && (
              <Link
                to={`/learn/${courseId}/${allLessons[0].id}`}
                className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Start Learning →
              </Link>
            )}
          </header>

          <section className="mt-10">
            <h2 className="text-2xl font-bold">Course Curriculum</h2>
            <p className="mt-2 text-slate-400">
              Follow the topics in order or choose any lesson.
            </p>

            <div className="mt-6 space-y-4">
              {course.topics.map((topic, index) => (
                <section
                  key={topic.title}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleTopic(index)}
                    aria-expanded={expandedTopics.includes(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-800/70"
                  >
                    <div>
                      <h3 className="font-bold">{topic.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {topic.lessons.length} lessons
                      </p>
                    </div>
                    <span className="text-cyan-400">
                      {expandedTopics.includes(index) ? "−" : "+"}
                    </span>
                  </button>

                  {expandedTopics.includes(index) && (
                    <div className="border-t border-slate-800">
                      {topic.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/learn/${courseId}/${lesson.id}`}
                          className="flex items-center gap-3 border-b border-slate-800/70 px-5 py-4 last:border-b-0 hover:bg-slate-800/60"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                            ▶
                          </span>

                          <span className="flex-1 text-sm font-medium sm:text-base">
                            {lesson.title}
                          </span>

                          <span className="text-xs text-slate-500">
                            {lesson.duration}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>

          <footer className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Keep Practicing</h2>
            <p className="mt-2 text-slate-400">
              Reinforce what you learn with coding challenges and examples.
            </p>
            <Link
              to="/problems"
              className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Practice Problems →
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;

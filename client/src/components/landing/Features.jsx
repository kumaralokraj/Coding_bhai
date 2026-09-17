function Features() {
  const features = [
    {
      icon: "💻",
      title: "Online IDE",
      description:
        "Write and test your code directly in the browser with a powerful coding environment.",
    },
    {
      icon: "⚡",
      title: "Code Execution",
      description:
        "Run your code instantly and see the output without leaving CodingBhai.",
    },
    {
      icon: "🤖",
      title: "AI Coding Mentor",
      description:
        "Get intelligent hints, explanations and guidance while you are coding.",
    },
    {
      icon: "🐛",
      title: "AI Debugger",
      description:
        "Understand your errors instead of simply copying a solution.",
    },
    {
      icon: "🧠",
      title: "DSA Practice",
      description:
        "Solve coding problems and improve your problem-solving skills step by step.",
    },
    {
      icon: "🎯",
      title: "Mock Interviews",
      description:
        "Practice technical interviews and improve your interview performance.",
    },
  ];

  return (
    <section className="bg-slate-950 px-6 py-24 text-white lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Powerful Features
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Everything you need to{" "}
            <span className="text-cyan-400">become a better coder</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            Code, practice, debug, learn and prepare for interviews — all
            inside one powerful platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-slate-900"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-2xl transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 text-sm font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Explore feature →
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;
function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "✍️",
      title: "Write Code",
      description:
        "Choose your language and write your code inside the CodingBhai online IDE.",
    },
    {
      number: "02",
      icon: "▶️",
      title: "Run & Test",
      description:
        "Execute your code instantly and test it with different inputs and test cases.",
    },
    {
      number: "03",
      icon: "🐛",
      title: "Debug",
      description:
        "If something goes wrong, AI explains the error and helps you understand the fix.",
    },
    {
      number: "04",
      icon: "🧠",
      title: "Learn",
      description:
        "Understand why the solution works instead of simply copying the answer.",
    },
  ];

  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            How CodingBhai works
          </p>

          <h2 className="text-3xl font-bold text-white md:text-5xl">
            From{" "}
            <span className="text-cyan-400">code</span> to confidence
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            CodingBhai helps you understand the complete coding process,
            from writing your first line to solving problems confidently.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Connecting Line */}
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-slate-800 lg:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative text-center"
            >
              {/* Number / Icon */}
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-3xl shadow-xl">
                {step.icon}
              </div>

              {/* Step Number */}
              <p className="mt-6 text-xs font-bold tracking-widest text-cyan-400">
                STEP {step.number}
              </p>

              {/* Title */}
              <h3 className="mt-2 text-xl font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-20 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
          <p className="text-xl font-semibold text-white md:text-2xl">
            Don't just fix the code.
            <span className="text-cyan-400"> Understand the bug.</span>
          </p>

          <p className="mt-3 text-sm text-slate-400">
            That's the CodingBhai difference.
          </p>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
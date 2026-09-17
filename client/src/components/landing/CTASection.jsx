function CTASection() {
  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-6 py-16 text-center md:px-12">

          {/* Background Glow */}
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-3xl">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Start your coding journey
            </p>

            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              Ready to become a{" "}
              <span className="text-cyan-400">better coder?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
              Practice problems, write real code, debug your mistakes and
              learn with your AI coding mentor — all in one place.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <button className="rounded-xl bg-cyan-500 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 hover:scale-105">
                Start Coding Free →
              </button>

              <button className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:border-cyan-500 hover:text-cyan-400">
                Explore Problems
              </button>

            </div>

            {/* Trust Text */}
            <p className="mt-8 text-sm text-slate-500">
              No credit card required • Learn at your own pace
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
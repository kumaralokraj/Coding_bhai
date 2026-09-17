function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 px-8 py-20 text-white lg:px-16">
      
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/4 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            AI-powered coding platform
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Code.
            <br />

            <span className="text-blue-500">Break.</span>

            <br />

            Debug.
            <br />

            <span className="text-slate-400">Learn.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Master coding with an AI-powered developer workspace.
            Practice problems, write code, understand your bugs,
            and prepare for real technical interviews — all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500">
              Start Coding
            </button>

            <button className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
              Explore Problems
            </button>
          </div>

          {/* Features */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>✓ Online IDE</span>
            <span>✓ AI Mentor</span>
            <span>✓ Smart Debugging</span>
            <span>✓ Interviews</span>
          </div>
        </div>

        {/* Right Code Preview */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              <span className="text-xs text-slate-500">
                solution.js
              </span>
            </div>

            {/* Code */}
            <div className="p-6 font-mono text-sm leading-7">
              <div>
                <span className="mr-6 text-slate-600">01</span>
                <span className="text-purple-400">function</span>{" "}
                <span className="text-blue-400">solve</span>
                <span className="text-slate-300">(nums) {"{"}</span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">02</span>
                <span className="text-slate-300">{"  "}const map = </span>
                <span className="text-yellow-400">new Map</span>
                <span className="text-slate-300">();</span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">03</span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">04</span>
                <span className="text-purple-400">for</span>
                <span className="text-slate-300"> (</span>
                <span className="text-purple-400">let</span>{" "}
                <span className="text-slate-300">i = 0; i {"<"} nums.length; i++) {"{"}</span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">05</span>
                <span className="text-slate-300">
                  {"    "}map.set(nums[i], i);
                </span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">06</span>
                <span className="text-slate-300">{"  }"}</span>
              </div>

              <div>
                <span className="mr-6 text-slate-600">07</span>
                <span className="text-slate-300">{"}"}</span>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="border-t border-slate-800 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-blue-400">✦</span>
                <span className="font-semibold text-white">
                  AI Analysis
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <p className="text-xs text-slate-500">
                    Complexity
                  </p>
                  <p className="mt-1 font-semibold text-green-400">
                    O(n)
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <p className="text-xs text-slate-500">
                    Code Status
                  </p>
                  <p className="mt-1 font-semibold text-green-400">
                    Optimized
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:block">
            <p className="text-xs text-slate-500">
              AI Mentor
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              Your approach looks good!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
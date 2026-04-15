import { useEffect, useRef, useState } from "react";

/**
 * The Sloth page — a deliberately slow-loading page for prerender testing.
 *
 * Runs a CPU-bound workload (prime sieve + bit mixing) in short chunks that
 * yield to the event loop, so the main thread stays busy for a random
 * 2-20s duration before the final HTML is appended to the DOM.
 */
export default function SlothPage() {
  const [status, setStatus] = useState<"working" | "ready">("working");
  const [durationMs, setDurationMs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [checksum, setChecksum] = useState(0);

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Sloth - Weird Animals";

    // Random duration between 2s and 20s.
    const target = Math.round(2000 + Math.random() * 18000);
    setDurationMs(target);

    const start = performance.now();
    let cancelled = false;
    let totalIterations = 0;
    let accumulator = 0;

    const burnCpu = () => {
      if (cancelled) return;

      // Do ~40ms of synchronous CPU work per chunk so we stay busy without
      // starving the browser's paint loop.
      const chunkStart = performance.now();
      while (performance.now() - chunkStart < 40) {
        // Trial-division prime sieve + bit mixing — actual CPU work,
        // not an async wait.
        const limit = 5000;
        for (let i = 2; i < limit; i++) {
          let isPrime = true;
          for (let j = 2; j * j <= i; j++) {
            if (i % j === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) {
            // Cheap hash-style mix to keep the optimizer honest.
            accumulator = (accumulator ^ (i * 2654435761)) >>> 0;
            accumulator = (accumulator + ((accumulator << 13) | 0)) >>> 0;
          }
        }
        totalIterations += limit;
      }

      const elapsed = performance.now() - start;
      setElapsedMs(Math.round(elapsed));
      setIterations(totalIterations);
      setChecksum(accumulator);

      if (elapsed >= target) {
        setStatus("ready");
        return;
      }
      // Yield to the event loop, then keep burning CPU.
      setTimeout(burnCpu, 0);
    };

    setTimeout(burnCpu, 0);

    return () => {
      cancelled = true;
    };
  }, []);

  // Once the CPU work is done, append the "loaded" HTML directly to the DOM.
  // This mirrors how a real customer SPA injects content after client-side work.
  useEffect(() => {
    if (status !== "ready" || !contentRef.current) return;

    const slothId = `SL-${Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0")}`;
    const leavesEaten = Math.floor(Math.random() * 25) + 1;
    const napsTaken = Math.floor(Math.random() * 40);

    contentRef.current.innerHTML = `
      <section data-testid="sloth-loaded" class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            🦥
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Meet Bradypus, our resident sloth</h2>
            <p class="text-gray-500">Sloth ID: ${slothId}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="p-4 bg-teal-50 rounded-lg">
            <h3 class="font-semibold text-teal-900">Leaves Eaten Today</h3>
            <p class="text-3xl font-bold text-teal-700 mt-2">${leavesEaten}</p>
          </div>
          <div class="p-4 bg-emerald-50 rounded-lg">
            <h3 class="font-semibold text-emerald-900">Naps Taken</h3>
            <p class="text-3xl font-bold text-emerald-700 mt-2">${napsTaken}</p>
          </div>
          <div class="p-4 bg-amber-50 rounded-lg">
            <h3 class="font-semibold text-amber-900">Top Speed</h3>
            <p class="text-3xl font-bold text-amber-700 mt-2">0.24 km/h</p>
          </div>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Fun sloth facts</h3>
          <ul class="space-y-2 text-gray-700">
            <li>• Sloths digest a single leaf for up to 30 days.</li>
            <li>• They only descend from their tree about once a week.</li>
            <li>• Algae grows in their fur, giving them a greenish camouflage.</li>
            <li>• Their grip is so strong they sometimes hang on after death.</li>
          </ul>
        </div>

        <div class="mt-8 text-xs text-gray-400 border-t pt-4">
          Rendered after ${elapsedMs}ms of CPU work
          (${iterations.toLocaleString()} prime iterations, checksum 0x${checksum
            .toString(16)
            .padStart(8, "0")}).
        </div>
      </section>
    `;
  }, [status, elapsedMs, iterations, checksum]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sloth
          </h1>
          <p className="text-xl text-gray-600">
            The slowest page in the jungle — CPU-bound JavaScript takes its
            sweet time before the content shows up.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Target duration: {durationMs}ms · Elapsed: {elapsedMs}ms
          </p>
        </div>

        {status === "working" && (
          <div
            data-testid="sloth-loading"
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">
              Hanging from a branch, crunching numbers very, very slowly...
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {iterations.toLocaleString()} prime iterations so far
            </p>
          </div>
        )}

        <div ref={contentRef} />
      </div>
    </div>
  );
}

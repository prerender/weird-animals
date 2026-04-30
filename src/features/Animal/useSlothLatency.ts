import { useEffect, useState } from "react";

// Log-normal latency model tuned to roughly match prod observations:
// median ~5s, p95 ~25s, with the long tail clamped at MAX_MS.
const LN_MU = Math.log(5);
const LN_SIGMA = 1.0;
const MIN_MS = 500;
const MAX_MS = 30_000;
const CPU_PROBABILITY = 0.4;
const CHUNK_MS = 40;
const PRIME_LIMIT = 5000;

function sampleLogNormalMs(): number {
  const u1 = Math.max(Math.random(), Number.EPSILON);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const ms = Math.exp(LN_MU + LN_SIGMA * z) * 1000;
  return Math.min(MAX_MS, Math.max(MIN_MS, ms));
}

function burnChunk(): void {
  const start = performance.now();
  while (performance.now() - start < CHUNK_MS) {
    for (let i = 2; i < PRIME_LIMIT; i++) {
      let isPrime = true;
      for (let j = 2; j * j <= i; j++) {
        if (i % j === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) void i;
    }
  }
}

function spinCpu(
  targetMs: number,
  alive: () => boolean,
  done: () => void,
): void {
  const start = performance.now();
  const tick = () => {
    if (!alive()) return;
    burnChunk();
    if (performance.now() - start >= targetMs) return done();
    setTimeout(tick, 0);
  };
  setTimeout(tick, 0);
}

export function useSlothLatency(active: boolean): boolean {
  const [ready, setReady] = useState(!active);

  useEffect(() => {
    if (!active) return;
    window.prerenderReady = false;
    const targetMs = sampleLogNormalMs();
    let cancelled = false;
    const done = () => {
      if (cancelled) return;
      window.prerenderReady = true;
      setReady(true);
    };
    if (Math.random() < CPU_PROBABILITY) {
      spinCpu(targetMs, () => !cancelled, done);
    } else {
      setTimeout(done, targetMs);
    }
    return () => {
      cancelled = true;
    };
  }, [active]);

  return ready;
}

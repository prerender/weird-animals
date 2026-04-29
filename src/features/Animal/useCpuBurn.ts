import { useEffect, useState } from "react";

const CHUNK_MS = 40;
const PRIME_LIMIT = 5000;

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

export function useCpuBurn(
  active: boolean,
  minSec: number,
  maxSec: number,
): boolean {
  const [ready, setReady] = useState(!active);

  useEffect(() => {
    if (!active) return;
    window.prerenderReady = false;
    const target = (minSec + Math.random() * (maxSec - minSec)) * 1000;
    const start = performance.now();
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      burnChunk();
      if (performance.now() - start >= target) {
        window.prerenderReady = true;
        return setReady(true);
      }
      setTimeout(tick, 0);
    };
    setTimeout(tick, 0);
    return () => {
      cancelled = true;
    };
  }, [active, minSec, maxSec]);

  return ready;
}

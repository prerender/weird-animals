/// <reference types="vite/client" />

declare global {
  interface Window {
    // Prerender.io "ready" signal — false while async/CPU work is in
    // flight, true once the page's final HTML is in the DOM.
    prerenderReady?: boolean;
  }
}

export {};

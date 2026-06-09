// QA-only Netlify Function that always returns a real HTTP 301 redirect
// to the site homepage. Used to test Prerender's handling of 3xx
// responses on a clean, page-looking URL. Reached publicly via /qa-301
// (see redirect in netlify.toml).
//
// The 301 status code and Location header are set by THIS function and
// passed through unchanged by Netlify's status=200 rewrite proxy — the
// client sees the 301 + Location, Netlify does not auto-follow it.

export default async (_req: Request): Promise<Response> => {
  return new Response(null, {
    status: 301,
    headers: {
      Location: "https://weirdanimals.life/",
    },
  });
};

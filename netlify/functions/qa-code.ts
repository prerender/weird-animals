// QA-only Netlify Function used to emit a fixed HTTP status code based on
// the public path the request came in on. One function, many rewrites in
// netlify.toml (one per code: /qa-301, /qa-302, /qa-303, /qa-307, /qa-308,
// /qa-401, /qa-403, /qa-404, /qa-429). Used to test how Prerender handles
// each status on a clean, page-looking URL.
//
// Note: /qa-status (200/500 via QA_FORCE_500 env toggle) is intentionally
// kept as its own function — it carries runtime configuration that does
// not fit a generic fixed-status dispatcher.
//
// How status preservation works:
// - The status code AND headers (Location / Content-Type) are set by THIS
//   function and passed through unchanged by Netlify's status=200 rewrite
//   proxy in netlify.toml. The client sees a real 301/302/303/307/308/
//   401/403/404/429 — not a 200 with error text, and Netlify does not
//   auto-follow the 3xx redirects server-side.
//
// How the path is read:
// - In Netlify Functions v2, req.url reflects the URL the client actually
//   requested (e.g. https://weirdanimals.life/qa-302), even when the
//   function was reached via a rewrite-proxy. We parse the pathname and
//   match against an explicit allow-list of codes. Unknown paths return
//   a 404 so misconfiguration fails loud instead of silently emitting a
//   wrong status.

type RedirectConfig = {
  kind: "redirect";
  status: number;
};

type HtmlConfig = {
  kind: "html";
  status: number;
  title: string;
  heading: string;
};

type CodeConfig = RedirectConfig | HtmlConfig;

const REDIRECT_LOCATION = "https://weirdanimals.life/";

const CODES: Record<string, CodeConfig> = {
  "301": { kind: "redirect", status: 301 },
  "302": { kind: "redirect", status: 302 },
  "303": { kind: "redirect", status: 303 },
  "307": { kind: "redirect", status: 307 },
  "308": { kind: "redirect", status: 308 },
  "401": { kind: "html", status: 401, title: "401 - QA", heading: "Unauthorized" },
  "403": { kind: "html", status: 403, title: "403 - QA", heading: "Forbidden" },
  "404": { kind: "html", status: 404, title: "404 - QA", heading: "Not Found" },
  "429": { kind: "html", status: 429, title: "429 - QA", heading: "Too Many Requests" },
};

function renderHtml(title: string, heading: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <h1>${heading}</h1>
  </body>
</html>
`;
}

export default async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);
  const match = pathname.match(/^\/qa-(\d{3})\/?$/);
  const code = match?.[1];
  const cfg = code ? CODES[code] : undefined;

  if (!cfg) {
    return new Response(
      `QA: no handler for path ${pathname}. Expected /qa-<code> where <code> is one of: ${Object.keys(CODES).join(", ")}.`,
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  if (cfg.kind === "redirect") {
    return new Response(null, {
      status: cfg.status,
      headers: { Location: REDIRECT_LOCATION },
    });
  }

  return new Response(renderHtml(cfg.title, cfg.heading), {
    status: cfg.status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

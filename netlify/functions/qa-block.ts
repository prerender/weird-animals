// QA-only Netlify Function used to test Prerender's handling of 4xx
// (blocked) pages on a clean, page-looking URL. Toggle the HTTP status
// across deploys via the Netlify env var QA_FORCE_403:
//   QA_FORCE_403="true"  -> HTTP 403, minimal HTML body
//   anything else/unset  -> HTTP 200, minimal HTML body
// Reached publicly via /qa-block (see redirect in netlify.toml).
//
// Kept as its own function (not folded into qa-code.ts) because the
// build-time env toggle does not fit the generic fixed-status
// dispatcher — same reasoning as qa-status.ts.

export default async (_req: Request): Promise<Response> => {
  if (process.env.QA_FORCE_403 === "true") {
    const blockedHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>QA Block Test</title>
  </head>
  <body>
    <h1>403 Forbidden</h1>
  </body>
</html>
`;
    return new Response(blockedHtml, {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>QA Block Test</title>
  </head>
  <body>
    <h1>QA Block Test</h1>
  </body>
</html>
`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

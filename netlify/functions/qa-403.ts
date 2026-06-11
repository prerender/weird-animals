// QA-only Netlify Function that always returns a real HTTP 403
// Forbidden with a minimal HTML body. Used to test Prerender's
// handling of 4xx responses on a clean, page-looking URL. Reached
// publicly via /qa-403 (see redirect in netlify.toml).
//
// The 403 status code and Content-Type are set by THIS function and
// passed through unchanged by Netlify's status=200 rewrite proxy —
// the client sees a real 403, not a 200 carrying error text.

export default async (_req: Request): Promise<Response> => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>403 - QA</title>
  </head>
  <body>
    <h1>Forbidden</h1>
  </body>
</html>
`;

  return new Response(html, {
    status: 403,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

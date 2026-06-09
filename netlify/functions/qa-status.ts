// QA-only Netlify Function used to test Prerender's error -> recovery (cache
// refresh) flow. Toggle the HTTP status across deploys via the Netlify env
// var QA_FORCE_500:
//   QA_FORCE_500="true"  -> HTTP 500, plain text body
//   anything else/unset  -> HTTP 200, minimal HTML page
// Reached publicly via /qa-status (see redirect in netlify.toml).

export default async (_req: Request): Promise<Response> => {
  if (process.env.QA_FORCE_500 === "true") {
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>500 - QA</title>
  </head>
  <body>
    <h1>Server Error</h1>
  </body>
</html>
`;
    return new Response(errorHtml, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QA Status Test</title>
  </head>
  <body>
    <h1>QA Status Test</h1>
  </body>
</html>
`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

import {
  parse,
  validate,
  execute,
} from "graphql";
import http from "http";
import schema from "./shema.mjs";

const GRAPHQL_PORT = 4000;
const GRAPHQL_HOST = "0.0.0.0";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    // Handle preflight request.
    if (req.method === "OPTIONS") {
      // Without an origin, it's an invalid request.
      if (!req.headers.origin) {
        return res.writeHead(400).end();
      }

      if (req.headers["access-control-request-headers"]) {
        // Allow all requested headers.
        res.setHeader(
          "Access-Control-Allow-Headers",
          req.headers["access-control-request-headers"]
        );
      }

      res
        .writeHead(204, {
          // Headers that may alter the preflight response. This is important for intermediate (CDN) cache.
          // Currently, Cloudflare only supports the use of 'vary' for serving images:
          // https://developers.cloudflare.com/cache/about/cache-control/#other
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
          Vary: "Origin, Access-Control-Request-Headers",
          // Request methods that the server supports.
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          // Informs the browser to cache the results of the preflight request.
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
          "Access-Control-Max-Age": "7200", // Chromium maximum age.
        })
        .end();
    } else if (req.method === "POST") {
      try {
        let operation;
        operation = JSON.parse(body);

        let document;
        try {
          document = parse(operation.query);
        } catch (error) {
          console.error(`Can't parse graphql query`, error);
        }

        const validationErrors = validate(schema, document);
        if (validationErrors.length > 0) {
          return res
            .writeHead(400, "GraphQL validation error")
            .end(JSON.stringify({ errors: validationErrors }));
        }

        let response = await execute({ schema, document });
        res.writeHead(200).end(JSON.stringify(response));
      } catch (error) {
        console.error("Cannot execute request", error);
      }
    }
  });
});

server.on("listening", () => {
  console.log(
    `GraphQL server started on HOST ${GRAPHQL_HOST} PORT ${GRAPHQL_PORT}`
  );
});

server.listen(GRAPHQL_PORT, GRAPHQL_HOST);

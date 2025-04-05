import "/flag#static";
import "/flag#frozen";
import "/flag#dangerous";

import http from "http";
import http2 from "http2";
import https from "https";
import {console} from "/js/Console.js";

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

let prev_listener;
let server;
export async function StaticCreateServer({
  certificate,
  port,
  hosts,
  proxy_port,
  listener,
  loader,
})
{
  if (!server)
  {
    const start = performance.now();

    if (typeof(port) !== "number")
    {
      throw new Error(`Server port must be a number, but it got "${typeof(port)}"`);
    }

    if (typeof(proxy_port) !== "number")
    {
      if (certificate) proxy_port = 443;
      else proxy_port = 80;
    }

    loader.Send("CREATE_PROXY_SERVER", {
      certificate,
      port,
      hosts,
      proxy_port,
    });

    if (certificate)
    {
      // console.log(certificate);
      const {cert, key} = certificate;

      server = http2.createSecureServer({
        cert,
        key,
        allowHTTP1: true,
      });

      // server.on("stream", (stream, headers) =>
      // {
      //   const method = headers[HTTP2_HEADER_METHOD];
      //   const path = headers[HTTP2_HEADER_PATH];
      //
      //   console.log("Stream", method, path);
      //
      //   stream.respond({
      //     [HTTP2_HEADER_STATUS]: 200,
      //     [HTTP2_HEADER_CONTENT_TYPE]: "text/plain; charset=utf-8",
      //   });
      //
      //   stream.write("hello ");
      //   stream.end("world");
      // });

      server.listen(port, () =>
      {
        const end = performance.now();
        console.log(`${console.YellowBright("HTTPS")} listening on port`, server.address().port, "after", Math.floor(end - start), "ms");
      });
    }
    else
    {
      server = http.createServer(Handler);
      server.listen(port, () =>
      {
        const end = performance.now();
        console.log(`${console.YellowBright("HTTP")} listening on port`, server.address().port, "after", Math.floor(end - start), "ms");
      });
    }

    loader.Destructor(import.meta.url, () =>
    {
      console.log("Destructing server");

      server.close();
      server = undefined;
    });
  }
  else
  {
    server.removeListener("request", prev_listener);
  }

  server.on("request", listener);
  prev_listener = listener;

  return server;
}

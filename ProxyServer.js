import net from "net";
import http from "http";
import https from "https";

const HOSTS = new Map();
const SERVERS = new Map();

class RequestError extends Error
{
  constructor(message, status = 500)
  {
    super(message);
    this.status = status;
  }
}

const SOCKET = Symbol("socket");
const BUFFER = Symbol("buffer");

export class ProxyServer
{
  static RegisterHosts(port, hosts, warn_on_override = true)
  {
    // Map each host provided to its target port
    for (const host of hosts)
    {
      if (warn_on_override === true && HOSTS.has(host))
      {
        const target_port = HOSTS.get(host);
        if (target_port !== port)
        {
          console.warn("Host", host, "was already mapped to port", target_port, "but now is getting mapped to port", port);
        }
      }

      HOSTS.set(host, port);
    }
  }

  static Create(options)
  {
    const {
      port,
      proxy_port,
      hosts,
      warn_on_override,
    } = options;

    if (hosts instanceof Array)
    {
      this.RegisterHosts(port, hosts, warn_on_override);
    }

    if (SERVERS.has(proxy_port))
    {
      return SERVERS.get(proxy_port);
    }
    else
    {
      const server = new this(options);
      SERVERS.set(proxy_port, server);
      return server;
    }
  }

  constructor({
    certificate,
    port,
    hosts = [],
    proxy_port,
    timeout,
    secure = !!certificate,
  })
  {
    this.port = port;
    this.proxy_port = proxy_port;
    this.secure = secure;
    this.timeout = timeout;

    if (!this.secure) this.server = http.createServer();
    else this.server = https.createServer(certificate);

    this.server.on("upgrade", this.OnUpgrade.bind(this));
    this.server.on("request", this.OnRequest.bind(this));

    this.server.listen(proxy_port, () =>
    {
      console.log(`Created ${this.secure ? "HTTPS" : "HTTP"} proxy server on port`, proxy_port);
    });
  }

  CreateHTTPHeader(line, headers)
  {
    return Object.keys(headers).reduce((head, key) =>
    {
      const value = headers[key];

      if (!Array.isArray(value))
      {
        head.push(key + ': ' + value);
        return head;
      }

      for (let i = 0; i < value.length; i++)
      {
        head.push(key + ': ' + value[i]);
      }

      return head;
    }, [line]).join('\r\n') + '\r\n\r\n';
  }

  SetupSocket(socket, buffer)
  {
    socket.setTimeout(0);
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 0);

    if (buffer && buffer.length > 0)
    {
      socket.unshift(buffer);
    }
  }

  CreateProxy(request)
  {
    const host = request?.headers?.host;

    if (!host)
    {
      throw new RequestError(`${request.method} request at ${request.url} does not have a host header, so it cannot be proxied`, 400);
    }

    // Whenever a request comes through, check if its host maps to a port
    if (!HOSTS.has(host))
    {
      throw new RequestError(`Host "${host}" is not a known proxy target`, 404);
    }

    const port = HOSTS.get(host);

    const options = {
      host,
      port,
      path: request.url,
      method: request.method,
      headers: request.headers,

      hints: request.hints,
      agent: request.agent,
      timeout: request.timeout,
      localAddress: request.localAddress,
      localPort: request.localPort,
      auth: request.auth,
      family: request.family,
      protocol: request.protocol,
      ca: request.ca,
    };

    // Allow self signed SSL certificates if we are local
    if (this.secure === true && (host === "localhost" || host === "127.0.0.1"))
    {
      options.rejectUnauthorized = false;
    }

    let proxy_request;
    if (this.secure === true) proxy_request = https.request(options);
    else proxy_request = http.request(options);

    // Forward an abort onto the proxy_request
    request.on("aborted", () => proxy_request.abort());

    // Pipe the original request into the proxy_request
    request.pipe(proxy_request);

    return proxy_request;
  }

  WriteSocketHeaders(socket, response)
  {
    let string = "";

    const headers = response.rawHeaders;
    for (let i = 0; i < headers.length; i += 2)
    {
      const key = headers[i + 0];
      const val = headers[i + 1];

      string += key + ": " + val + "\r\n";
    }

    socket.write(
      `HTTP/1.1 101 Web Socket Protocol Handshake\r\n` +
      string,
      "\r\n"
    );
  }

  // Wait for the request to timeout, provide a response, or throw an error
  AwaitResponse(request, upgrade_socket)
  {
    return new Promise((resolve, reject) =>
    {
      if (typeof(this.timeout) === "number")
      {
        request.setTimeout(this.timeout, () =>
        {
          request.abort();
        });
      }

      request.on("abort", () => resolve(undefined));
      request.on("close", () => resolve(undefined));
      request.on("error", error => reject(error));
      request.on("response", response => resolve(response));

      if (upgrade_socket)
      {
        console.log("Awaiting upgrade response", request.upgrade);

        request.on("upgrade", (response, socket, buffer) =>
        {
          try
          {
            socket.on("error", error =>
            {
              socket.end();
              reject(error);
            });

            // The pipe below will end proxySocket if socket closes cleanly, but not
            // if it errors (eg, vanishes from the net and starts returning
            // EHOSTUNREACH). We need to do that explicitly.
            upgrade_socket.on("error", () =>
            {
              socket.end();
              resolve();
            });

            this.SetupSocket(socket, buffer);

            // Remark: Handle writing the headers to the socket when switching protocols
            const header = this.CreateHTTPHeader(`HTTP/1.1 101 Switching Protocols`, response.headers);
            upgrade_socket.write(header);

            // socket.write(
            //   `HTTP/1.1 101 Web Socket Protocol Handshake\r\n` +
            //   "Upgrade: WebSocket\r\n" +
            //   "Connection: Upgrade\r\n" +
            //   "\r\n"
            // );

            socket.pipe(upgrade_socket).pipe(socket);
            resolve(response);
          }
          catch (error)
          {
            reject(error);
          }
        });

        request.end();
      }
    });
  }

  async OnRequest(request, response)
  {
    try
    {
      // Create a proxy for the original request which points to another port
      // Which port depends on the original request's host header
      const proxy_request = await this.CreateProxy(request);

      // Wait for the proxy_request to give us a response
      const proxy_response = await this.AwaitResponse(proxy_request);

      // If we don't get a proxy_response then it aborted or closed early
      if (proxy_response === undefined) return;

      // If the original response's headers haven't already been sent,
      // then copy the proxy_response headers over to it
      if (!response.headersSent)
      {
        if (request.httpVersion === "1.0")
        {
          proxy_response.headers.connection = request.headers.connection || "close";
        }
        else if (request.httpVersion !== "2.0" && !proxy_response.headers.connection)
        {
          proxy_response.headers.connection = request.headers.connection || "keep-alive";
        }

        const headers = proxy_response.rawHeaders;
        for (let i = 0; i < headers.length; i += 2)
        {
          const key = headers[i + 0];
          const val = headers[i + 1];

          response.setHeader(key, val);
        }
      }

      // If the original response has not finished yet
      // (and it shouldn't have finished, cause we haven't finished it)
      // then pipe the proxy_response into the original response
      if (!response.finished)
      {
        proxy_response.pipe(response);
      }
    }
    catch (error)
    {
      if (response.finished)
      {
        console.log("Error in ProxyServer on port", this.port);
        console.error(error);
      }
      else
      {
        if (error instanceof RequestError)
        {
          response.writeHead(error.status, { "Content-Type": "text/plain" });
          response.end(error.message);
        }
        else
        {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Internal server error");
        }
      }
    }
  }

  async OnUpgrade(request, socket, buffer)
  {
    let proxy_request;
    let proxy_response;

    try
    {
      this.SetupSocket(socket, buffer);

      // Create a proxy for the original request which points to another port
      // Which port depends on the original request's host header
      proxy_request = await this.CreateProxy(request);

      // Wait for the proxy_request to give us a response
      proxy_response = await this.AwaitResponse(proxy_request, socket);

      // If we don't get a proxy_response then it aborted or closed early
      if (proxy_response === undefined) return;

      // If upgrade event isn't going to happen, close the socket
      if (!proxy_response.upgrade)
      {
        const {httpVersion, statusCode, statusMessage} = proxy_response;
        const header = this.CreateHTTPHeader(`HTTP/${httpVersion} ${statusCode} ${statusMessage}`, proxy_response.headers);

        socket.write(header);
        proxy_response.pipe(socket);
      }
    }
    catch (error)
    {
      console.error("OnUpgrade error", error);

      // if (response.finished)
      // {
      //   console.log("Error in ProxyServer on port", this.port);
      //   console.error(error);
      // }
      // else
      // {
      //   if (error instanceof RequestError)
      //   {
      //     response.statusCode = error.status;
      //     response.write(error.message);
      //     response.end();
      //   }
      //   else
      //   {
      //     response.statusCode = 500;
      //     response.write("Internal server error");
      //     response.end();
      //   }
      // }
    }
  }
}

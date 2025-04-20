import {URL, pathToFileURL, fileURLToPath} from "node:url";
import {join, dirname, resolve} from "node:path";
import fs from "node:fs";
import cluster from "node:cluster";
import {MessageChannel, BroadcastChannel, Worker, threadId} from "node:worker_threads";
import os from "node:os";
import net from "node:net";
import http from "node:http";
import https from "node:https";
import util from "node:util";
import {Package} from "./Package.js";
import {Keyboard} from "./Keyboard.js";
import {ProxyServer} from "./ProxyServer.js";
import * as C from "./LoaderUtilities/ConsoleColors.js";

import readline from "node:readline";

const WORKER_OPTIONS = Symbol("worker_options");
const WORKER_TIMEOUT = Symbol("worker_timeout");
const WORKER_ERROR = Symbol("worker_error");
const WORKER_START = Symbol("worker_start");
const WORKER_STOPPED = Symbol("worker_stopped");
const WORKER_ALLOW_AUTO_RESTART = Symbol("worker_allow_auto_restart");
const WORKER_WILL = Symbol("worker_will"); // Will as in "last will and testament", not "will do"

export class Program extends Keyboard
{
  constructor()
  {
    super();

    this.death_count = 0; // Track how many cluster workers die
    // this.last_death = 0;
    this.proxy_servers = new Map();
    this.proxy_targets = new Map();

    const pkg_path = process.env.npm_package_json ?? join(process.cwd(), "./package.json");
    if (!fs.existsSync(pkg_path))
    {
      throw new Error(`You must define a package.json file`);
    }

    const text = fs.readFileSync(pkg_path, { encoding: "utf8" });
    this.base_package = JSON.parse(text);

    this.Launch();
  }

  async Input(hide = false)
  {
    const input  = C.BlueBright("input");
    const enter  = C.Cyan("enter");
    const equals = C.Cyan("=");
    const format = `${C.YellowBright("key")}${equals}${C.YellowBright(`value`)}`;
    const again  = `Please try again, or simply leave the input blank and press ${enter} to continue.`;
    const config = C.Cyan("npm_config");

    console.log(`Entering ${input} mode.\nType a line in the form of ${format} and then press ${enter} to submit it.\nEach entry will be added to the ${config} object, just like a command line parameter, except these will be secret to your program.\nWhen you are done, leave the input blank and press ${enter} to continue.\n`);

    const pairs = {};

    while (true)
    {
      const line = await this.GetLine();

      if (hide === true)
      {
        this.Up().ClearLine();
      }

      if (line === "")
      {
        break;
      }
      else if (!line.includes("="))
      {
        console.log(`The input ${C.YellowBright(`"${line}"`)} should contain an ${equals} sign. ${again}`);
        continue;
      }

      const parts = line.split("=");
      if (parts.length !== 2)
      {
        console.log(`The input ${C.YellowBright(`"${line}"`)} should split into`, 2, `parts, separated by an ${equals} sign. ${again}`);
        continue;
      }

      let key   = parts[0].trim();
      let value = parts[1].trim();

      try
      {
        // Attempt to parse as JSON, but do nothing if it fails
        key = JSON.parse(key);
      }
      catch (error)
      {
      }

      try
      {
        // Attempt to parse as JSON, but do nothing if it fails
        value = JSON.parse(value);
      }
      catch (error)
      {
      }

      pairs[key] = value;
      this.npm_config[key] = value;
    }

    if (hide === true)
    {
      for (const key in pairs)
      {
        if (!pairs.hasOwnProperty(key)) continue;
        const value = pairs[key].toString();
        pairs[key] = "*".repeat(value.length);
      }
    }

    console.log(`Exiting ${input} mode and copying`, pairs, `to the ${config} object.\n`);
  }

  Print()
  {
    const flags = {
      "--development": `To enter ${C.BlueBright("development")} mode`,
      "--input": `Set up private environment variables`,
    };

    Object.keys(flags).forEach(key =>
    {
      console.log(`${C.YellowBright(key)}: ${flags[key]}`);
    });

    const keybinds = {
      "ctrl-d": `To enter ${C.BlueBright("development")} mode`,
      "ctrl-q": `To ${C.BlueBright("restart")} the cluster workers`,
      "ctrl-r": `Hot ${C.BlueBright("reload")} all cluster workers`,
      "ctrl-c": `To ${C.RedBright("exit")}`,
    };

    Object.keys(keybinds).forEach(key =>
    {
      console.log(`${C.YellowBright(key)}: ${keybinds[key]}`);
    });
  }

  async Launch()
  {
    this.npm_config = this.CreateConfigObject();

    if (this.npm_config.print)
    {
      console.log("Printing?");
      await this.Print();
    }

    if (this.npm_config.input)
    {
      console.log("Input?");
      await this.Input(!!this.npm_config.hide);
    }

    cluster.on("fork", this.OnClusterFork.bind(this));
    cluster.on("online", this.OnClusterOnline.bind(this));
    cluster.on("message", this.OnClusterMessage.bind(this));
    cluster.on("listening", this.OnClusterListening.bind(this));
    cluster.on("disconnect", this.OnClusterDisconnect.bind(this));
    cluster.on("exit", this.OnClusterExit.bind(this));

    this.StartWorkers();
  }

  CreateConfigObject()
  {
    const config = {};
    const prefix = "npm_config_";
    for (const key in process.env)
    {
      if (!process.env.hasOwnProperty(key)) continue;
      // const value = process.env[key];
      let value;
      try
      {
        value = JSON.parse(process.env[key]);
      }
      catch (error)
      {
        value = process.env[key];
      }

      const index = key.indexOf(prefix);
      if (index !== -1)
      {
        const real_key = key.substring(index + prefix.length);
        const parts = real_key.split(".");

        const last_part = parts.pop();

        let target = config;
        for (let i = 0; i < parts.length; i++)
        {
          const part = parts[i];
          target = (target[part] ??= {});
        }
        target[last_part] = value;

        switch (key)
        {
          case "npm_config_cache":
          case "npm_config_globalconfig":
          case "npm_config_init_module":
          case "npm_config_metrics_registry":
          case "npm_config_msvs_version":
          case "npm_config_node_gyp":
          case "npm_config_noproxy":
          case "npm_config_prefix":
          case "npm_config_python":
          case "npm_config_userconfig":
          case "npm_config_user_agent":
          case "npm_config_staging":
          {
            // Whitelist all of these env variables that are set by NPM
            break;
          }
          default:
          {
            // Delete all others, so we clear out any set via command line args like: --key=value
            delete process.env[key];
          }
        }
      }
    }

    return config;
  }

  Send(worker, action, ...args)
  {
    if (!worker[WORKER_STOPPED])
    {
      try
      {
        const json = JSON.stringify([action, args]);
        // console.log("Sending", [action, args]);
        worker.send(json);
      }
      catch (error)
      {
        console.error("~~", error);
      }
    }

    return this;
  }

  Apply(worker, action, args)
  {
    switch (action)
    {
      case "ERROR": return this.OnWorkerError(worker, ...args);
      case "WILL": return this.OnWorkerWill(worker, ...args);
      case "ALLOW_AUTO_RESTART": return this.OnWorkerAllowAutoRestart(worker, ...args);
      case "CREATE_PROXY_SERVER": return this.OnCreateProxyServer(worker, ...args);
      // case "PING": return this.OnPing(worker, ...args);
      // case "PONG": return this.OnPong(worker, ...args);
      case "TIMEOUT_START": return this.OnTimeoutStart(worker, ...args);
      case "TIMEOUT_CANCEL": return this.OnTimeoutCancel(worker, ...args);
      default:
      {
        console.warn("Unknown Program action", action, args);
      }
    }
  }

  OnTimeoutStart(worker, timeout, name)
  {
    // console.log("Worker", worker.process.pid, "named", name, "starting timeout for", timeout);

    this.OnTimeoutCancel(worker);

    worker[WORKER_TIMEOUT] = global.setTimeout(() =>
    {
      // Kill the unresponsive worker
      // Can't just do worker.kill because it will never go through
      global.process.kill(worker.process.pid, "SIGINT");

      console.log("~~~~Hit timeout without hearing back~~~~", timeout, name);

      // const new_worker = cluster.fork();

      // console.log(new_worker);

      this.StartWorker(worker, {
        TAGGLY_TIMEOUT_NAME: name,
        // timeout: {
        //   timeout,
        //   name,
        // },
      });

      // global.setTimeout(() =>
      // {
      //   this.Send(new_worker, "TIMEOUT_REASON", timeout, name);
      // }, 20);
    }, timeout);
  }

  OnTimeoutCancel(worker)
  {
    if (worker.hasOwnProperty(WORKER_TIMEOUT))
    {
      // console.log("Clearing old timeout");
      global.clearTimeout(worker[WORKER_TIMEOUT]);
      delete worker[WORKER_TIMEOUT];
    }
  }

  CreateProxyRequest(request, port, callback)
  {
    const host = request?.headers?.host;

    const secure = (request.protocol === "https");

    const options = {
      host,
      port,
      path: request.url,
      // agent: request.agent,
      method: request.method,
      // timeout: request.timeout,
      // hints: request.hints,
      // family: request.family,
      // localAddress: request.localAddress,
      // localPort: request.localPort,
      headers: request.headers,
    };

    if (secure === true && host === "localhost" || host === "127.0.0.1")
    {
      console.log("Allowing self signed SSL certs");
      options.rejectUnauthorized = false;
    }

    console.log(options);

    if (secure) return https.request(options, callback);
    else return http.request(options, callback);
  }

  CreateProxyRequest(request, port, secure)
  {
    const host = request?.headers?.host;

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
    if (secure === true && (host === "localhost" || host === "127.0.0.1"))
    {
      options.rejectUnauthorized = false;
    }

    if (secure === true) return https.request(options);
    else return http.request(options);
  }

  CreateProxyRequestFull(is_secure, req)
  {
    const host = req?.headers?.host;

    if (!host)
    {
      console.warn(req.method, "request at", req.url, "does not have a host header, so it cannot be proxied. As far as I know, this shouldn't happen.");
      return;
    }

    // Whenever a request comes through, check if its host maps to a port
    if (!this.proxy_targets.has(host))
    {
      console.warn("No proxy host registered for request's host:", host);
      return;
    }

    // Proxy the request to the target port
    const target_port = this.proxy_targets.get(host);

    const options = {
      host,
      port: target_port,
      path: request.url,
      // agent: request.agent,
      method: request.method,
      // timeout: request.timeout,
      // hints: request.hints,
      // family: request.family,
      // localAddress: request.localAddress,
      // localPort: request.localPort,
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

    if (secure === true && (host === "localhost" || host === "127.0.0.1"))
    {
      // console.log("Allowing self signed SSL certs");
      options.rejectUnauthorized = false;
    }

    if (secure === true) return https.request(options);
    else return http.request(options);
  }

  GetProxyPortForRequest(req, res)
  {
    const host = req?.headers?.host;

    if (!host)
    {
      res.statusCode = 400;
      res.write(`${req.method} request at ${req.url} does not have a host header, so it cannot be proxied`);
      res.end();
      return;
    }

    // Whenever a request comes through, check if its host maps to a port
    if (!this.proxy_targets.has(host))
    {
      res.statusCode = 404;
      res.write(`Host "${host}" is not a known proxy target`);
      res.end();
      return;
    }

    // Proxy the request to the target port
    return this.proxy_targets.get(host);
  }

  OnProxyRequest(is_secure, req, res)
  {
    const host = req?.headers?.host;

    // Proxy the request to the target port
    const target_port = this.GetProxyPortForRequest(req, res);
    if (res.writableEnded) return;

    const proxy_req = this.CreateProxyRequest(req, target_port, is_secure);
    if (res.writableEnded) return;

    // proxy_req.on("socket", () =>
    // {
    //   console.log("~~~Proxy socket event");
    // });

    req.on("aborted", () => proxy_req.abort());

    req.on("error", () =>
    {
      console.error("~Request error so proxy_req must error!");
      // proxy_req.abort();
    });

    // if (options.proxyTimeout)
    // {
    //   proxyReq.setTimeout(options.proxyTimeout, function() {
    //      proxyReq.abort();
    //   });
    // }

    req.pipe(proxy_req);

    // proxy_req.on("error", error =>
    // {
    //   console.error("~Proxy error", error);
    //   if (req.socket.destroyed && error.code === "ECONNRESET")
    //   {
    //     console.log("Error: ECONNRESET, aborting");
    //     return proxy_req.abort();
    //   }
    //
    //   // req.abort();
    //   // return proxy_req.abort();
    // });

    proxy_req.on("response", proxy_res =>
    {
      if (!res.headersSent)
      {
        if (req.httpVersion === "1.0")
        {
          proxy_res.headers.connection = req.headers.connection || "close";
        }
        else if (req.httpVersion !== "2.0" && !proxy_res.headers.connection)
        {
          proxy_res.headers.connection = req.headers.connection || "keep-alive";
        }

        // const headers = proxy_res.rawHeaders;
        // for (let i = 0; i < headers.length; i += 2)
        // {
        //   const key = headers[i + 0];
        //   const val = headers[i + 1];
        //
        //   res.setHeader(key, val);
        // }

        // Copy the proxy response headers over to the original response
        const keys = Object.keys(proxy_res.headers);
        for (let i = 0; i < keys.length; i++)
        {
          const key = keys[i];
          const val = proxy_res.headers[key];

          res.setHeader(key, val);
        }
      }

      if (!res.finished)
      {
        // proxy_res.on("end", () =>
        // {
        //   server.emit("end", req, res, proxy_res);
        // });

        proxy_res.pipe(res);
      }
      else
      {
        // server.emit("end", req, res, proxy_res);
      }
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

  OnProxyUpgrade(is_secure, req, socket, buffer)
  {
    const host = req?.headers?.host;

    if (!host)
    {
      console.warn(req.method, "request at", req.url, "does not have a host header, so it cannot be proxied. As far as I know, this shouldn't happen.");
      return;
    }

    // Whenever a request comes through, check if its host maps to a port
    if (!this.proxy_targets.has(host))
    {
      console.warn("No proxy host registered for request's host:", host);
      return;
    }

    // Proxy the request to the target port
    const target_port = this.proxy_targets.get(host);

    this.SetupSocket(socket, buffer);

    const proxy_req = this.CreateProxyRequest(req, target_port, is_secure);

    proxy_req.on("error", error =>
    {
      console.error("Socket error", error);
      socket.end();
    });

    proxy_req.on("response", (res) =>
    {
      // If upgrade event isn't going to happen, close the socket
      if (!res.upgrade)
      {
        const header = this.CreateHTTPHeader(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`, res.headers);

        socket.write(header);
        res.pipe(socket);
      }
    });

    proxy_req.on("upgrade", (proxy_res, proxy_socket, proxy_buffer) =>
    {
      proxy_socket.on("error", error =>
      {
        console.error("Proxy socket error", error);
        proxy_socket.end();
      });

      // Allow us to listen when the websocket has completed
      proxy_socket.on("end", () =>
      {
        // server.emit('close', proxyRes, proxySocket, proxyHead);
      });

      // The pipe below will end proxySocket if socket closes cleanly, but not
      // if it errors (eg, vanishes from the net and starts returning
      // EHOSTUNREACH). We need to do that explicitly.
      socket.on("error", () =>
      {
        proxy_socket.end();
      });

      this.SetupSocket(proxy_socket, proxy_buffer);

      // Remark: Handle writing the headers to the socket when switching protocols
      // Also handles when a header is an array
      const header = this.CreateHTTPHeader(`HTTP/1.1 101 Switching Protocols`, proxy_res.headers);
      socket.write(header);

      proxy_socket.pipe(socket).pipe(proxy_socket);

      // server.emit("open", proxy_socket);
    });

    proxy_req.end();
  }

  OnCreateProxyServer(worker, {
    certificate,
    port,
    hosts = [],
    proxy_port,
    port_source,
    port_target,
    warn_on_override = true,
    secure = !!certificate,
  })
  {
    // Only create the server once per port, even though we may get many
    // requests per port (from duplicate cluster workers)
    if (!this.proxy_servers.has(port))
    {
      let server;
      if (!secure) server = http.createServer();
      else server = https.createServer(certificate);

      server.on("request", this.OnProxyRequest.bind(this, secure));
      server.on("upgrade", this.OnProxyUpgrade.bind(this, secure));

      server.listen(proxy_port, () =>
      {
        console.log(`Created ${secure ? "HTTPS" : "HTTP"} proxy server on port`, proxy_port);
      });

      this.proxy_servers.set(proxy_port, server);
    }

    // Map each host provided to its target port
    for (const host of hosts)
    {
      if (warn_on_override === true && this.proxy_targets.has(host))
      {
        const target_port = this.proxy_targets.get(host);
        if (target_port !== port)
        {
          console.warn("Host", host, "was already mapped to port", target_port, "but now is getting mapped to port", port);
        }
      }

      this.proxy_targets.set(host, port);
    }
  }

  OnCreateProxyServer(worker, options)
  {
    ProxyServer.Create(options);
  }

  OnWorkerError(worker, origin, message, stack)
  {
    // console.log("Worker", worker.process.pid, "error", origin, message, stack);
    worker[WORKER_ERROR] = {
      origin,
      message,
      stack,
    };
  }

  OnWorkerWill(worker, restart)
  {
    worker[WORKER_WILL] = {
      restart,
    };
  }

  OnWorkerAllowAutoRestart(worker, restart, min_lifespan = 1000)
  {
    worker[WORKER_ALLOW_AUTO_RESTART] = restart;
    worker[WORKER_START] = Date.now() + min_lifespan;
  }

  OnClusterFork(worker)
  {
    // console.log("Worker", worker.process.pid, "forked");
  }

  OnClusterOnline(worker)
  {
    // console.log("Worker", worker.process.pid, "is now online");
  }

  OnClusterMessage(worker, message, handle)
  {
    try
    {
      const data = JSON.parse(message);
      this.Apply(worker, ...data)
    }
    catch (error)
    {
      console.error("Worker message", message, "could not be parsed into JSON");
    }
  }

  OnClusterListening(worker, address)
  {
    // console.log(`A worker is now connected to ${address.address}:${address.port}`);
  }

  OnClusterDisconnect(worker, code, signal)
  {
    // console.log(`Worker ${worker.process.pid} disconnected`);
  }

  OnClusterExit(worker, code, signal)
  {
    switch (signal)
    {
      case "SIGINT":
      case "SIGTERM":
      case "SIGQUIT": return; // Do nothing
    }

    if (worker[WORKER_ALLOW_AUTO_RESTART] !== true)
    {
      console.log("Worker not auto restarting...");
      return;
    }

    const start = worker[WORKER_START] ?? Date.now();
    const lifespan = Date.now() - start;
    // console.log("Worker", worker.process.pid, "exited after", Date.now() - worker.start, "milliseconds");

    // If it has been more than N milliseconds since the worker was started
    if (lifespan >= 10_000)
    {
      console.log(lifespan, `\n\x1b[36mAutomatically restarting dead worker...\x1b[39m\n`); // Cyan color

      // Restart the worker
      cluster.fork();
    }
  }

  OnClusterExit(worker, code, signal)
  {
    switch (signal)
    {
      case "SIGINT":
      case "SIGTERM":
      case "SIGQUIT":
      {
        console.log(`\n\x1b[36mWorker ${worker.process.pid} exited with code ${code} and signal "${signal}"\x1b[39m\n`); // Cyan color
        return; // Do nothing
      }
      default:
      {
        // let error = worker[WORKER_ERROR]?.message
        console.log(`\n\x1b[36mWorker ${worker.process.pid} died with code ${code} and signal "${signal}"\x1b[39m`); // Cyan color
      }
    }

    if (worker[WORKER_ALLOW_AUTO_RESTART] === true)
    {
      const start = worker[WORKER_START] ?? Date.now();

      if (Date.now() > start)
      {
        console.log(`\n\x1b[36mAutomatically reviving worker...\x1b[39m\n`); // Cyan color

        // Restart the worker
        cluster.fork();
      }
    }
  }

  async CreatePackage(path)
  {
    const pkg_path = join(path, "./package.json");
    if (!fs.existsSync(pkg_path))
    {
      throw new Error(`You must define a package.json file`);
    }

    const text = fs.readFileSync(pkg_path, { encoding: "utf8" });
    const pkg = new Package(text);

    pkg.npm_config = this.npm_config;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const app_url = pathToFileURL(path);
    const app_parent_url = pathToFileURL(dirname(path));
    const framework_url = pathToFileURL(__dirname);

    if (!pkg.domains)
    {
      pkg.domains = [
        "protected",
        "private",
        "public",
      ];
    }

    if (!pkg.layers) {
      if (path === __dirname) {
        pkg.layers = [
          path
        ];
      } else {
        pkg.layers = [
          path,
          __dirname,
        ];
      }
    }

    // Make each layer path into an absolute file URL
    for (let i = 0; i < pkg.layers.length; i++)
    {
      const layer = pkg.layers[i];
      const path = resolve(layer);

      try
      {
        const stat = fs.statSync(layer);
      }
      catch (error)
      {
        throw new Error(`Failed to load layer ${i} at "${layer}"`);
      }

      pkg.layers[i] = pathToFileURL(path).href;
    }

    pkg.SetCWD(path);
    pkg.SetFrameworkCWD(__dirname);
    pkg.SetMainPath(join(__dirname, `./Start.js`));
    pkg.SetAppURL(app_url.href);
    pkg.SetAppParentURL(app_parent_url.href);
    pkg.SetFrameworkURL(framework_url.href);
    pkg.SetStartURL("/js/Loader.js");
    // pkg.SetStartURL(pathToFileURL(join(__dirname, `./private/js/Start.js`)));
    pkg.SetPackagePath(pkg_path);
    // pkg.SetLoaderPath("taggly/Preloader.js");
    pkg.SetLoaderPath(pathToFileURL(join(__dirname, "./Preloader.js")).href);
    pkg.SetWindowURL("https://localhost:3000/");
    pkg.SetClusterSize(1);
    pkg.preloads = new Map();
    pkg.instance = 0;

    pkg.buffer_bytes ??= 1024 * 1024;
    pkg.max_buffer_bytes ??= pkg.buffer_bytes * 64;

    if (!this.buffer)
    {
      this.buffer = new SharedArrayBuffer(pkg.buffer_bytes, { maxByteLength: pkg.max_buffer_bytes });
      const view = new DataView(this.buffer, 0);
      // view.setUint32(0, 0); // 
      view.setInt32(4, this.buffer.byteLength - 4, true);
      // console.log("Writing length", this.buffer.byteLength - 4, view.getInt32(4));
    }

    // this.buffer ??= new SharedArrayBuffer(pkg.buffer_bytes);
    pkg.buffer = this.buffer;

    // pkg.AddFlag("--trace-warnings");
    // pkg.AddFlag("--experimental-vm-modules");
    // pkg.AddFlag("--experimental-shadow-realm");
    // pkg.AddFlag("--experimental-modules");
    // pkg.AddFlag("--harmony-top-level-await");
    // pkg.AddFlag("--experimental-loader");
    // pkg.AddFlag("--import");
    // pkg.AddFlag("--experimental-loader " + pkg.GetLoaderPath());
    // pkg.AddFlag("--import " + pkg.GetLoaderPath());

    // if (pkg.GetLoaderPath()) pkg.AddFlag(pkg.GetLoaderPath());

    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++)
    {
      const arg = args[i];
      if (arg.includes("="))
      {
        const [key, value] = arg.split("=");
        pkg.Write(key, value);
      }
    }

    return pkg;
  }

  async CreatePackages()
  {
    const packages = [];
    if (this.base_package.sites)
    {
      for (const relative_path of this.base_package.sites)
      {
        const pkg_path = join(process.cwd(), relative_path);
        const pkg = await this.CreatePackage(pkg_path);
        packages.push(pkg);
      }
    }
    else
    {
      const pkg = await this.CreatePackage(process.cwd());
      packages.push(pkg);
    }

    return packages;
  }

  OnConnection(connection)
  {
    const sourceport = connection.localPort;
    const destport = 3000;
    if (sourceport === destport)
    {
      console.log("~~~~Already on 3000");
      return;
    }

    console.log("Remapping", connection.localPort, "to", destport);

    const target = net.createConnection(destport);

    let connected = false;
    let data = "";

    connection.on("data", (d) =>
    {
      console.log("connection on data");

      if (connected)
      {
        target.write(d);
      }
      else
      {
        data += d.toString();
      }
    });

    target.on("connect", () =>
    {
      console.log("target on connect");
      connected = true;
      target.write(data);
    });

    target.pipe(connection);

    // connection.pipe(target);
    // target.pipe(connection);

    // // console.log("Program server connection", connection);
    //
    // console.log("ARGS:", args);
    // console.log("ID:", connection.id);
    // console.log("REQUEST:", connection.request);
    // console.log("ADDRESS:", connection?.address());
    // console.log("localAddress:", connection.localAddress);
    // console.log("remoteAddress:", connection.remoteAddress);
    // console.log("remoteFamily:", connection.remoteFamily);
    // console.log("localPort:", connection.localPort);
    // console.log("remotePort:", connection.remotePort);
    // console.log("timeout:", connection.timeout);
    // console.log("readyState:", connection.readyState);
    // console.log("pending:", connection.pending);
    // console.log("connecting:", connection.connecting);
    //
    // // // Can we connect it to a sub port?
    // // connection.connect(connection.localPort);
    // // // connection.connect(3000);
    //
    // connection.on("lookup", (...args) =>
    // {
    //   console.log("lookup:", args);
    // });
    //
    // let data = "";
    // connection.on("data", chunk =>
    // {
    //   // console.log("~~buffer", buffer);
    //   data += chunk.toString("utf8");
    //   // console.log("data", data);
    // });
    //
    // connection.on("end", () =>
    // {
    //   console.log("Result:\n");
    //   console.log(data);
    // });
  }

  async CreateServer(port)
  {
    console.log("Creating server");
    const server = net.createServer();

    server.on("error", (error) =>
    {
      console.error("Program server error", error);
    });

    server.on("connection", this.OnConnection.bind(this));

    server.listen(port, () =>
    {
      // const handle = this.server._handle;
      // handle.onconnection = (err, new_handle) =>
      // {
      //   // console.log("handle onconnection", err, new_handle === handle, new_handle);
      //   this.DistributeHandle(err, new_handle);
      // };
    });
  }

  DistributeHandle(err, handle)
  {
    console.log("Distributing handle to a worker", handle);

    // for (const id in cluster.workers)
    // {
    //   const worker = cluster.workers[id];
    // }
  }

  async CreateClusterOptions(pkg)
  {
    const argv = [];
    if (pkg.flags) argv.push.apply(argv, pkg.flags);

    return {
      exec: pkg.main_path,
      execArgv: argv,
      args: pkg.args,
      cwd: pkg.cwd,
      silent: pkg.silent,
    };
  }

  // async RestartWorker(worker)
  // {
  //   const options = worker[WORKER_OPTIONS];
  //   global.process.kill(worker.process.pid, "SIGINT");
  // }

  async StartWorker(options, env)
  {
    // Options can also be a worker that is being restarted
    if (options.hasOwnProperty(WORKER_OPTIONS))
    {
      options = options[WORKER_OPTIONS];
    }

    if (env)
    {
      console.log("Starting worker with env", env);
    }

    // console.log(options);
    cluster.setupPrimary(options);
    const worker = cluster.fork(env);

    worker[WORKER_OPTIONS] = options;
    worker[WORKER_START] = Date.now();

    return worker;
  }

  Sleep(ms){ return new Promise(resolve => global.setTimeout(resolve, ms)); }

  async StartWorkers()
  {
    try
    {
      const packages = await this.CreatePackages();

      for (const pkg of packages)
      {
        process.env.TAGGLY_PACKAGE = JSON.stringify(pkg, undefined, 2);

        const argv = [];

        if (pkg.HasFlags()) argv.push.apply(argv, pkg.GetFlags());

        const options = await this.CreateClusterOptions(pkg);

        cluster.setupPrimary(options);

        let cluster_size = pkg.GetClusterSize();
        // cluster_size = 5;
        if (cluster_size === 0 || cluster_size === null || cluster_size === undefined)
        {
          // If cluster_size is 0, null, or undefined: treat it as one worker per core
          cluster_size = os.cpus().length;
        }
        else if (0 > cluster_size)
        {
          // If cluster_size is negative: treat it as the number of cores to leave open
          cluster_size = Math.max(1, os.cpus().length + cluster_size);
        }

        this.start_time = Date.now();
        for (let i = 0; i < cluster_size; i++)
        {
          const worker = await this.StartWorker(options);

          if (typeof(pkg.cluster_delay) === "number")
          {
            await this.Sleep(pkg.cluster_delay);
          }
        }
      }
    }
    catch (error)
    {
      console.error(error);
      throw error;
    }
  }

  async StartWorkers()
  {
    try
    {
      const packages = await this.CreatePackages();

      for (const pkg of packages)
      {
        process.env.TAGGLY_PACKAGE = JSON.stringify(pkg, undefined, 2);

        const argv = [];

        if (pkg.HasFlags()) argv.push.apply(argv, pkg.GetFlags());

        let cluster_size = pkg.GetClusterSize();
        if (cluster_size === 0 || cluster_size === null || cluster_size === undefined)
        {
          // If cluster_size is 0, null, or undefined: treat it as one worker per core
          cluster_size = os.cpus().length;
        }
        else if (0 > cluster_size)
        {
          // If cluster_size is negative: treat it as the number of cores to leave open
          cluster_size = Math.max(1, os.cpus().length + cluster_size);
        }

        this.start_time = Date.now();
        for (let i = 0; i < cluster_size; i++)
        {
          const worker = new Worker(pkg.GetMainPath(), {
            execArgv: pkg.flags,
          });

          if (typeof(pkg.cluster_delay) === "number")
          {
            await this.Sleep(pkg.cluster_delay);
          }
        }
      }
    }
    catch (error)
    {
      console.error(error);
      throw error;
    }
  }

  StopWorkers()
  {
    for (const id in cluster.workers)
    {
      const worker = cluster.workers[id];
      worker[WORKER_STOPPED] = true;

      // worker.kill();

      // For some reason, worker.kill seems to be ignored if there is an active
      // WebSocket connection. Using process.kill seems to work.
      global.process.kill(worker.process.pid);
    }
  }

  OnKeyR(key)
  {
    if (key.ctrl)
    {
      let command = "REFRESH";
      if (key.shift)
      {
        console.log("Shift is also pressed!");
        command = "HARD_REFRESH";
      }

      let count = 0;
      for (const id in cluster.workers)
      {
        count += 1;
        const worker = cluster.workers[id];
        this.Send(worker, command);
      }

      if (count === 0)
      {
        console.log(`\n\x1b[36mThere are no living workers to reload. Restarting instead...\x1b[39m`); // Cyan color
        this.StartWorkers();
      }
    }
  }

  OnKeyE(key)
  {
    if (key.ctrl)
    {
      let count = 0;
      for (const id in cluster.workers)
      {
        count += 1;
        const worker = cluster.workers[id];
        this.Send(worker, "HARD_REFRESH");
      }

      if (count === 0)
      {
        console.log(`\n\x1b[36mThere are no living workers to reload. Restarting instead...\x1b[39m`); // Cyan color
        this.StartWorkers();
      }
    }
  }

  _OnKeyR(key)
  {
    let command;
    if (key.ctrl) command = "REFRESH";
    else if (key.shift) command = "HARD_REFRESH";
    else return;

    let count = 0;
    for (const id in cluster.workers)
    {
      count += 1;
      const worker = cluster.workers[id];
      this.Send(worker, command);
    }

    if (count === 0)
    {
      console.log(`\n\x1b[36mThere are no living workers to reload. Restarting instead...\x1b[39m`); // Cyan color
      this.StartWorkers();
    }
  }

  OnKeyQ(key)
  {
    if (key.ctrl)
    {
      console.log(`\n\x1b[36mRestarting all cluster workers...\x1b[39m`); // Cyan color
      this.StopWorkers();
      this.StartWorkers();
    }
  }

  OnKeyP(key)
  {
    if (key.ctrl)
    {
      for (const id in cluster.workers)
      {
        const worker = cluster.workers[id];
        this.Send(worker, "PRINT");
      }
    }
  }

  OnKeyT(key)
  {
    if (key.ctrl)
    {
      for (const id in cluster.workers)
      {
        const worker = cluster.workers[id];
        this.Send(worker, "DEVELOPMENT");
      }
    }
  }

  OnKeyD(key)
  {
    if (key.ctrl && this.rl.closed === true)
    {
      console.log(`\n\x1b[36mReadLine interface closed because ctrl-D was pressed. Automatically rebuilding interface...\x1b[39m`);

      this.CreateReadLine();
    }
  }

  async OnKeyI(key)
  {
    if (key.ctrl)
    {
      const result = await this.Input();
      console.log("Result:", result);
    }
  }

  OnKey(raw, key)
  {
    for (const id in cluster.workers)
    {
      const worker = cluster.workers[id];
      // console.log(raw, key);
      this.Send(worker, "KEY", key);
    }

    const result = super.OnKey(raw, key);
    return result;
  }
}

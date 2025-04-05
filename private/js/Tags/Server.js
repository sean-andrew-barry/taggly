import cluster from "cluster";
import fs from "fs";
import http from "http";
import http2 from "http2";
import https from "https";
import path from "path";
import vm from "vm";
import zlib from "zlib";
import {pathToFileURL, fileURLToPath} from "url";

import {Tag} from "/js/Tag.js";
import {String as StringUtilities} from "/js/String.js";
import {Server as Base} from "/js/Tags/Server.js?after=/taggly/private/";
import {Index} from "/js/Tags/Page/Index.js";
import {URL} from "/js/Tags/URL.js";
import {Environment} from "/js/Environment.js";
import {Bundler} from "/js/Tags/Bundler.js";
import {Action} from "/js/Event/Action.js";
import {Secret} from "/js/Tags/Model/Secret.js";
import {Request} from "/js/Utility/Request.js";
import {Response} from "/js/Utility/Response.js";
import * as H from "/js/Utility/Headers.js";
import {console} from "/js/Console.js";
import {Loader} from "/js/Loader.js";
import {StaticCreateCertificate as CreateCertificate} from "/js/Tags/Server/StaticCreateCertificate.js";
// import {SetHandler, CreateServer} from "/js/Tags/Server/StaticCreateServer.js";
import {StaticCreateServer} from "/js/Tags/Server/StaticCreateServer.js";

import {Certificate} from "/js/Tags/Server/Certificate.js";

const loader = Loader.Get();
// import loader from "/js/Loader.js";
// loader.DepreciateFile(import.meta.url);

export class Server extends Base
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "server"; }

  #indexes = new Map();
  #parents = new Map();
  #express;
  #server;
  #options;
  #listeners;

  constructor(...args)
  {
    super(...args);

    this.#express = this.CreateExpress();
    this.#server = this.CreateServer();
    this.#options = this.CreateOptions();
    // this.dependencies = this.CreateDependencies();

    this.#listeners = new Map([
      ["GET", new Map()],
      ["HEAD", new Map()],
      ["POST", new Map()],
      ["PUT", new Map()],
      ["DELETE", new Map()],
      ["TRACE", new Map()],
      ["OPTIONS", new Map()],
      ["CONNECT", new Map()],
      ["PATCH", new Map()],
    ]);
  }

  // constructor(...args)
  // {
  //   super(...args);
  //
  //   this.indexes = new Map();
  //   this.parents = new Map();
  //
  //   this.express = this.CreateExpress();
  //   this.server = this.CreateServer();
  //   this.options = this.CreateOptions();
  //   // this.dependencies = this.CreateDependencies();
  //
  //   this.#listeners = new Map([
  //     ["GET", new Map()],
  //     ["HEAD", new Map()],
  //     ["POST", new Map()],
  //     ["PUT", new Map()],
  //     ["DELETE", new Map()],
  //     ["TRACE", new Map()],
  //     ["OPTIONS", new Map()],
  //     ["CONNECT", new Map()],
  //     ["PATCH", new Map()],
  //   ]);
  // }

  async Listen(method = "GET", url, fn)
  {
    const express = await this.GetExpress();
    console.log("Listening to", url);

    express[method](url, async (req, res, next) =>
    {
      // console.log(req);
      // const request = new Request(req);
      // const response = new Response(res, next);

      try
      {
        await fn(req, res, next);

        // if (!response.IsSent()) next();
      }
      catch (error)
      {
        console.error("Server.Listen error", error);
        res.status(500).send("Internal server error");
      }
    });

    return this;
  }

  Get    (url, fn){ return this.Listen("GET"    , url, fn); }
  Head   (url, fn){ return this.Listen("HEAD"   , url, fn); }
  Post   (url, fn){ return this.Listen("POST"   , url, fn); }
  Put    (url, fn){ return this.Listen("PUT"    , url, fn); }
  Delete (url, fn){ return this.Listen("DELETE" , url, fn); }
  Trace  (url, fn){ return this.Listen("TRACE"  , url, fn); }
  Options(url, fn){ return this.Listen("OPTIONS", url, fn); }
  Connect(url, fn){ return this.Listen("CONNECT", url, fn); }
  Patch  (url, fn){ return this.Listen("PATCH"  , url, fn); }

  async CreateExpress()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;
  }

  async CreateGreenlock()
  {
    return CreateGreenlockServer({
      staging: await this.GetCertificateStaging(),
      root: await this.GetCertificatePackageRoot(),
      dir: await this.GetCertificateConfigDirectory(),
      agree_to_terms: true,
      email: await this.GetCertificateMaintainerEmail(),
      domains: ["snarkyandscrappy.com", "www.snarkyandscrappy.com"],
      cluster: await this.GetCertificateCluster(),
      app: await this.GetExpress(),

      SecureHandler(req, res, next)
      {
        console.log("Greenlock SecureHandler");
        next(req, res);
      },
      Handler(req, res, next)
      {
        console.log("Greenlock Handler");
        next(req, res);
      },
    });
  }

  async CreateCertificate()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;

    const key = await this.GetKey();
    const cert = await this.GetCert();

    if (key && cert)
    {
      return {
        key,
        cert,
        ca: cert,
      };
    }
    else
    {
      const attrs = await this.GetCertificateAttributes();
      const extensions = await this.GetCertificateExtensions();

      return CreateCertificate(attrs, extensions);
    }
  }

  async LoadDependency(specifier, domains, dependencies, entries = new WeakSet())
  {
    console.log("Querying server for", specifier, domains);
    const entry = await loader.Query(specifier, domains);
    if (!entry)
    {
      throw new Error(`Failed to preload specifier "${specifier}" because no entry was found`);
    }

    if (entries.has(entry)) return;
    else entries.add(entry);

    let source = entry.GetSource();
    if (!source)
    {
      source = await entry.GetData();
      entry.SetSource(source);
    }

    dependencies.set(specifier, source);

    for (const spec of entry.GetSpecifiers().keys())
    {
      await this.LoadDependency(spec, domains, dependencies, entries);
    }
  }

  async CreateDependencies()
  {
    const specifier = Index.GetEntrySpecifier();

    const dependencies = new Map();

    await this.LoadDependency(specifier, ["public"], dependencies);

    return dependencies;
  }

  GetHosts()
  {
    return [
      "localhost",
      "127.0.0.1",
    ];
  }

  async CreateServer()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;

    const port = await this.GetPort();

    let certificate;
    if (await this.UseHTTPS())
    {
      // If there is an enabled database, then try to load a certificate from it
      const db = await this.GetDocument().GetDatabase();
      if (db && await db.IsEnabled())
      {
        let rsa_private_key = await new Secret().Key("==", "rsa_private_key").Search();
        let ssl_certificate = await new Secret().Key("==", "ssl_certificate").Search();

        if (rsa_private_key && ssl_certificate)
        {
          certificate = {
            key: rsa_private_key.GetValue(),
            cert: ssl_certificate.GetValue(),
          };
        }
        else
        {
          // Couldn't find a certificate, so now create one and store it in the database
          certificate = await this.CreateCertificate();
          rsa_private_key = await new Secret().Key("=", "rsa_private_key").Value("=", certificate.key).Insert();
          ssl_certificate = await new Secret().Key("=", "ssl_certificate").Value("=", certificate.cert).Insert();
        }
      }
      else
      {
        // No database, so just create a new certificate without storing it
        certificate = await this.CreateCertificate();
      }
    }

    const processor = await this.GetProcessor();

    const server = await StaticCreateServer({
      certificate,
      port,
      hosts: this.GetHosts(),
      loader,

      // TODO: The handler needs to be set early to catch requests after a hot reload
      listener: (req, res) =>
      {
        const request = new Request(req);
        const response = new Response(request, res);

        this.Process(request, response);
      },
    });

    // server.on("stream", (stream, headers) =>
    // {
    //   console.log("OnStream", headers);
    //
    //   // // stream is a Duplex
    //   // stream.respond({
    //   //   'content-type': 'text/html; charset=utf-8',
    //   //   ':status': 200
    //   // });
    //   //
    //   // stream.end('<h1>Hello World</h1>');
    // });
    //
    // server.on("session", (...args) =>
    // {
    //   console.log("session", args);
    // });

    return server;
  }

  async CreateOptions()
  {
    const etag = await this.UseETag();
    const extensions = await this.GetFileExtensions();
    const index = await this.GetIndexName();
    const maxAge = await this.GetCacheMaxAge();

    return {
      dotfiles: "ignore",
      etag,
      fallthrough: true,
      extensions,
      index,
      lastModified: true,
      immutable: false,
      maxAge,
      cacheControl: true,
    };
  }

  async GreenLockTODO()
  {
    GreenLockExpress
    .init({
      staging: await config.GetCertificateStaging(),
      packageRoot: await config.GetCertificatePackageRoot(),
      maintainerEmail: await config.GetCertificateMaintainerEmail(),
      configDir: await config.GetCertificateConfigDirectory(),

      // whether or not to run at cloudscale
      cluster: await config.GetCertificateCluster(),
    })
    .ready(glx =>
    {
      // Get the raw https server:
      this.https_server = glx.httpsServer(null, SecureHandler);
      this.https_server.listen(443, "0.0.0.0", () =>
      {
        console.log("Listening on", this.https_server.address());
      });

      // NOTE: You must ALSO listen on port 80 for ACME HTTP-01 Challenges
      // (the ACME and http->https middleware are loaded by glx.httpServer)
      this.http_server = glx.httpServer(null, Handler);
      this.http_server.listen(80, "0.0.0.0", () =>
      {
        console.log("Listening on", this.http_server.address());
      });
    });
  }

  async FindFile(request, response, domains)
  {
    const specifier = request.originalUrl;

    let parent = undefined;
    if (request.headers.referer)
    {
      // Try to find the parent module, if possible, so that it can detect circular imports
      const referer = new globalThis.URL(request.headers.referer);
      const parent_specifier = `${referer.pathname}${referer.search}`;
      parent = this.parents[parent_specifier];
    }

    const file = await loader.Search(parent, specifier, domains, undefined, "client");
    if (file)
    {
      if (file.href.includes("/private/"))
      {
        throw new Error(`Server file "${file.href}" includes private somehow!`);
      }

      this.parents[specifier] = file;
      return file;
    }
  }

  ThrowEntryIncludesPrivate(entry)
  {
    throw new Error(`Server entry somehow "${entry.href}" includes private! This shouldn't happen`);
  }

  async FindFile(request, response, domains)
  {
    // const referer = new globalThis.URL(request.headers.referer);

    // let specifier;
    // if ()
    const specifier = request.originalUrl;

    const entry = await loader.Query(specifier, domains);

    if (entry)
    {
      if (entry.href.includes("/private/")) this.ThrowEntryIncludesPrivate(entry);
      if (entry.href.includes("/protected/")) this.ThrowEntryIncludesPrivate(entry);

      return entry;
    }
  }

  async FindPage(request, response, domains)
  {
    let specifier = request.originalUrl;

    // NOTE: If the specifier has a ?query string
    const index = specifier.lastIndexOf("?");
    if (index !== -1)
    {
      // Then remove it to prevent cache flooding
      specifier = specifier.substring(0, index);
    }

    // // TODO: Re-enable caching
    // if (this.indexes.has(specifier))
    // {
    //   return this.indexes.get(specifier);
    // }

    const url = new URL(specifier);
    const page_ctor = url.Root(0);

    if (page_ctor)
    {
      const page = new Index();
      await page.Render(page_ctor);

      // const entry_specifier = await page.GetEntrySpecifier();
      // await this.Push(entry_specifier, request, response, domains);

      // const entry = await loader.Query(entry_specifier, domains);
      // await this.Push(entry, entry_specifier, request, response, domains);

      const html = page.GetHTML();

      this.#indexes.set(specifier, html);

      return html;
    }
  }

  async ShouldHotReload(req, res, specifier)
  {
    if (await Environment.IsDevelopment())
    {
      return true;

      // const entry_url = await Environment.GetURL();
      // if (entry_url.pathname === file.pathname)
      // {
      //   console.log("Should hot reload!");
      //   return true;
      // }
    }

    return false;
    // return (await Environment.IsDevelopment()) && !req.get("Referer"); // Referer spelling is deliberate
  }

  async HotReload(req, res, specifier)
  {
    // Hot reload the server
    const reloaded = await Environment.Reload(false, true, false);

    if (reloaded === true)
    {
      const host = req.GetHost();
      // console.log("~~~Hot reload redirecting!", host, specifier);

      // Tell the client to repeat this request
      // so that it will be handled by the NEW Server after the reload
      res.Found().Location(specifier).Send();

      return true;
    }

    return false;
  }

  async ShouldSendBundler(req, res, file)
  {
    if (await this.UseBundler())
    {
      const entry_url = await Environment.GetURL();
      if (entry_url.pathname === file.pathname)
      {
        return true;
      }
    }

    return false;
  }

  async ShouldSendBundler(req, res, file)
  {
    if (await this.UseBundler())
    {
      if (file.href.includes("/js/Start.js"))
      {
        return true;
      }
    }

    return false;
  }

  GZip(data)
  {
    return new Promise((resolve, reject) =>
    {
      zlib.gzip(data, (error, result) =>
      {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  async SendBundler(req, res, file)
  {
    const bundler = await this.GetBundler();
    const code = await bundler.GetCode();
    const source = await this.GZip(code);

    res.ContentEncoding("gzip");

    const allow = await this.GetAllowFor(file);
    if (allow) res.Allow(allow);

    const last_modified = await this.GetLastModifiedFor(file);
    if (last_modified) res.LastModified(last_modified);

    const date = await this.GetDateFor(file);
    if (date) res.Date(date);

    const etag = await this.GetETagFor(file);
    if (etag) res.ETag(etag);

    const cache_control = await this.GetCacheControlFor(file);
    if (cache_control) res.CacheControl(cache_control);

    const content_type = await this.GetContentTypeFor(file);
    if (content_type) res.ContentType(content_type);

    let length;
    if (typeof(source) === "string")
    {
      const char_set = await file.GetCharSet();
      length = Buffer.byteLength(source, char_set ?? "utf-8");
    }
    else
    {
      length = source.byteLength;
    }

    if (typeof(length) === "number") res.ContentLength(length);

    res.Status(200).TypeJavaScript().Send(source);

    return true;
  }

  SendFile(req, res, options, file)
  {
    const file_path = fileURLToPath(file.href);

    // res.setHeader("Content-Type", "text/javascript");

    return res.sendFile(file_path);
  }

  async SendFile(req, res, options, file)
  {
    let source = file.GetSource();
    if (!source)
    {
      source = await file.GetData();
      file.SetSource(source);
    }

    let links = [];
    for (const specifier of file.GetSpecifiers().keys())
    {
      links.push(`<${specifier}>; rel=preload; as=script; crossorigin`);
    }

    const link = links.join(", ");
    // console.log("Links:", link);

    res.SetHeader("Link", link);

    return res.Status(200).TypeJavaScript().Send(source);

    // const file_path = fileURLToPath(file.href);
    //
    // // res.setHeader("Content-Type", "text/javascript");
    //
    // return res.sendFile(file_path);
  }

  async SendFile(req, res, options, file)
  {
    // console.log("Send file", file.href);

    const allow = await this.GetAllowFor(file);
    if (allow) res.Allow(allow);

    const last_modified = await this.GetLastModifiedFor(file);
    if (last_modified) res.LastModified(last_modified);

    const date = await this.GetDateFor(file);
    if (date) res.Date(date);

    const etag = await this.GetETagFor(file);
    if (etag) res.ETag(etag);

    const cache_control = await this.GetCacheControlFor(file);
    if (cache_control) res.CacheControl(cache_control);

    const content_type = await this.GetContentTypeFor(file);
    if (content_type) res.ContentType(content_type);

    if (req.GetContentType() === "application/javascript")
    {
      const links = await this.GetPreloadLinksFor(file);
      if (links) res.Link(links);
    }

    // if (req.HasHeader(H.IF_NONE_MATCH))
    // {
    //   console.log("IF_NONE_MATCH", req.GetHeader(H.IF_NONE_MATCH), res.GetHeader(H.ETAG), req.GetHeader(H.IF_NONE_MATCH) === res.GetHeader(H.ETAG));
    // }

    if (req.GetHeader(H.IF_NONE_MATCH) === res.GetHeader(H.ETAG))
    {
      // console.log("Unchanged:", req.GetSpecifier());

      // Since the etags matched send 304 Not Modified
      // to tell the client that its cached version is still good
      return res.Status(304).TypeJS().Send("");
    }
    else
    {
      // const policies = await this.GetContentSecurityPolicyFor(file);
      // if (policies) res.SetHeader(H.CONTENT_SECURITY_POLICY, policies);

      // res.ContentEncoding();

      // console.log("Send file", file.GetNormalized());
      let data = await file.GetData();

      // if (file.GetMimeType() === "text/javascript" && !file.href.includes("ErrorHandler.js"))
      // {
      //   // const specifier = this.GetSpecifier();

      //   data = Buffer.concat([
      //     data,
      //     Buffer.from(`\n\n// Framework internals\nimport * as __MODULE from "${req.GetURL()}";\nimport __REGISTER from "/js/Loader/Register.js";\n__REGISTER(import.meta, __MODULE);`, "utf8"),
      //   ]);
      // }

      const gzipped = await file.GetGZip();

      // console.log(source.length, gzipped.length);

      // If it would save at least 100 bytes, use gzip
      if (data.length > gzipped.length && (data.length - gzipped.length) > 100)
      {
        res.ContentEncoding("gzip");
        // console.log("gzip saving", data.length - gzipped.length);
        data = gzipped;
      }

      return res.Status(200).TypeJavaScript().ContentLength(data.byteLength).Send(data);
    }
  }

  async GetAllowFor(entry){ return "GET, HEAD"; }

  async GetLastModifiedFor(entry)
  {
    const last_modified = await entry.GetLastModified();
    return last_modified?.toUTCString();
  }

  GetDateFor(entry){ return new Date().toUTCString(); }

  async GetETagFor(entry, ...parts)
  {
    if (parts.length === 0)
    {
      // parts.push(await entry.HRef());
      parts.push((await entry.GetLastModified()).toISOString());
    }

    const string = parts.join();
    const hash = StringUtilities.HashCyrb53(string);

    return `"${hash.toString(16)}"`;
  }

  GetCacheControlFor(entry)
  {
    return "no-cache"; // Can be cached, but should revalidate each time before use
  }

  // GetCacheControlFor(entry)
  // {
  //   return "must-revalidate, post-check=0, pre-check=0"; // Can be cached, but should revalidate each time before use
  // }

  async GetContentTypeFor(entry, mime_type, char_set)
  {
    mime_type ??= await entry.GetMimeType();
    char_set ??= await entry.GetCharSet();

    return `${mime_type ?? "text/plain"}; charset=${char_set ?? "utf-8"}`;
  }

  GetPreloadLinksFor(entry, ...links)
  {
    for (const specifier of entry.GetSpecifiers().keys())
    {
      links.push(`<${specifier}>; rel=preload; as=script; crossorigin`);
    }

    return links.join(", ");
  }

  GetContentSecurityPolicyFor(entry, ...policies)
  {
    policies.push(`script-src-attr 'none'`);
    policies.push(`style-src-attr 'none'`);

    return policies.join("; ");
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "ping": return ["pong", [window.Date.now()]];
      default:
      {
        console.log("Server firing Action event");
        new Action(this, undefined, action);
      }
    }
  }

  GetRequestBody(req)
  {
    return new Promise((resolve, reject) =>
    {
      let body = "";

      req.on("data", chunk =>
      {
        body += chunk.toString();
      });

      req.on("end", () =>
      {
        resolve(JSON.parse(body));
      });
    });
  }

  Listen(method, specifier, handler)
  {
    const listeners = this.GetListeners(method);
    if (listeners.has(specifier))
    {
      const handlers = listeners.get(specifier);
      handlers.push(handler);
    }
    else
    {
      listeners.set(specifier, [handler]);
    }

    return this;
  }

  GetListeners(method)
  {
    const listeners = this.#listeners.get(method);

    if (listeners) return listeners;
    else throw new Error(`Unknown method "${method}"`);
  }

  Silence(method, specifier, handler)
  {
    const listeners = this.GetListeners(method);
    if (listeners.has(specifier))
    {
      const handlers = listeners.get(specifier);
      for (let i = 0; i < handlers.length; i++)
      {
        if (handler === handlers[i])
        {
          handlers.splice(i, 1);
          return;
        }
      }
    }

    throw new Error(`Failed to silence "${method}" listener at "${specifier}"`);
  }

  Push(specifier, req, res)
  {
    const stream = res.push("/main.js", {
      status: 200, // optional
      method: "GET", // optional
      request: {
        accept: "*/*",
      },
      response: {
        "content-type": "application/javascript",
      },
    });

    stream.on("error", (error) =>
    {
      console.error("Push error", error);
    });

    stream.end(`alert("hello from push stream!");`);
  }

  async Push(specifier, req, res, domains, pushed = new WeakSet())
  {
    const entry = await loader.Query(specifier, domains);
    if (!entry)
    {
      console.error("~~~Push failed", specifier);
      throw new Error(`Failed to push specifier "${specifier}" because no entry was found`);
    }

    if (pushed.has(entry)) return;
    else pushed.add(entry);

    console.log("Pushing", specifier);

    for (const file of entry.GetImports())
    {
      const query = file.GetSpecifier();

      let sub_specifier = query.specifier;
      if (query.search)
      {
        // sub_specifier += "?" + query.parameters.toString();
        sub_specifier += query.search;
      }

      await this.Push(sub_specifier, req, res, domains, pushed);
    }

    const stream = res.push(specifier, {
      status: 200, // optional
      method: "GET", // optional
      request: {
        accept: "*/*",
      },
      response: {
        "content-type": "application/javascript",
      },
    });

    stream.on("error", (error) =>
    {
      console.error("Push error", error);
    });

    const source = entry.GetSource();

    if (source)
    {
      stream.end(source);
    }
    else
    {
      entry.Read().then(source =>
      {
        entry.SetSource(source);
        stream.end(source);
      });
    }
  }

  _Push(entry, specifier, req, res, domains, pushed = new WeakSet())
  {
    if (pushed.has(entry)) return;
    else pushed.add(entry);

    if (!entry.href.includes("/public/"))
    {
      return;
    }

    console.log("Pushing", specifier);

    for (const file of entry.GetImports())
    {
      const query = file.GetSpecifier();

      let sub_specifier = query.specifier;
      if (query.parameters)
      {
        sub_specifier += "?" + query.parameters.toString();
      }

      this.Push(file, sub_specifier, req, res, domains, pushed);
    }

    const stream = res.push(specifier, {
      status: 200, // optional
      method: "GET", // optional
      request: {
        accept: "*/*",
      },
      response: {
        "content-type": "application/javascript",
      },
    });

    stream.on("error", (error) =>
    {
      console.error("Push error", error);
    });

    const source = entry.GetSource();

    if (source)
    {
      stream.end(source);
    }
    else
    {
      entry.Read().then(source =>
      {
        entry.SetSource(source);
        stream.end(source);
      });
    }
  }

  async Process(req, res, next)
  {
    try
    {
      const method = req.GetMethod();
      const specifier = req.GetSpecifier();

      // console.log(specifier);

      const options = await this.GetOptions();
      const domains = await this.GetDomains();

      if (specifier === "/ping")
      {
        const [action, args, message_id] = await req.GetBody();

        const value = [
          "pong",
          [Date.now() - args[0]],
          message_id,
        ];

        return res.Status(200).TypeJSON().Send(JSON.stringify(value));
      }

      if (method)
      {
        const listeners = this.GetListeners(method);
        if (listeners.has(specifier))
        {
          const handlers = listeners.get(specifier);
          for (let i = 0; i < handlers.length; i++)
          {
            const handler = handlers[i];

            await handler(req, res);
            if (res.writableEnded)
            {
              return;
            }
          }
        }
      }
      else
      {
        console.warn("No method for", method, specifier);
      }

      if (specifier === "/flag")
      {
        return res.Status(200).TypeJS().Send("");
      }

      if (req.method === "POST" && specifier === "/action")
      {
        const [action, args] = await this.GetRequestBody(req);

        const result = this.Apply(action, args);
        res.type("json");
        res.send(JSON.stringify(result));
        return;
      }

      if (req.method !== "GET" && req.method !== "HEAD")
      {
        // Method not allowed
        res.statusCode = 405;
        res.setHeader("Allow", "GET, HEAD");
        res.setHeader("Content-Length", "0");
        res.end();
        return;
      }

      const file = await this.FindFile(req, res, domains);
      if (file?.IsFile())
      {
        if (await this.ShouldSendBundler(req, res, file) && await this.SendBundler(req, res, file))
        {
          return;
        }
        else
        {
          return await this.SendFile(req, res, options, file);
        }
      }
      else
      {
        if (await this.ShouldHotReload(req, res, specifier) && await this.HotReload(req, res, specifier))
        {
          return;
        }

        // Not a file, so see if it's a page path
        const html = await this.FindPage(req, res, domains);
        if (html)
        {
          if (false && req.IsPushAllowed())
          {
            const dependencies = await this.dependencies;

            for (const [specifier, source] of dependencies)
            {
              req.Push(specifier, source);
            }
          }

          res.send(html);
          return;
        }

        // // Not a page either, so check if it's a directory
        // if (file?.IsDirectory())
        // {
        //   const source = await file.GetSource(specifier, loader, domains);
        //   return res.Status(200).TypeJS().Send(source);
        // }

        const host = req.GetHost();
        console.warn("Unknown request", method, specifier, req.headers, host);
        // console.log(req.GetRequest());

        return res.Status(404).Send(`No file or page found for ${req.method} request to "${req.url}"`);
      }
    }
    catch (error)
    {
      console.error("HTTP Request error:", error);
      if (Environment.IsDevelopment())
      {
        return res.Status(500).Send(error.message);
      }
      else
      {
        return res.Status(500).Send("Internal server error");
      }
    }
  }

  UpdateCertificate({
    key,
    cert,
    ca,
  })
  {
    this.GetServer().setSecureContext({
      key,
      cert,
      ca,
    });

    return this;
  }

  // async UseBundler(){ return (await Bundler.Get())?.IsEnabled(); }
  // UseBundler(){ return false; }
  GetBundler(){ return this.GetDocument()?.GetBundler(); }
  UseBundler(){ return this.GetBundler()?.IsEnabled() ?? false; }
  IsEnabled(){ return true; }
  UseETag(){ return true; }
  UseProxy(){ return true; }
  UseCompression(){ return true; }
  UseCookieParser(){ return true; }
  UseJSONParser(){ return false; }
  UseFormParser(){ return false; }
  UseHTTPS(){ return true; }
  UseHTTP2(){ return false; }
  UseHTTP2Workaround(){ return true; }

  async GetPort()
  {
    const pkg = await loader.GetPackage();
    return pkg?.npm_config?.server?.port
        ?? pkg?.server?.port
        ?? pkg?.port
        ?? 3000;
  }

  GetKey(){ return undefined; }
  GetCert(){ return undefined; }
  GetSecret(){ throw new Error(`Server.GetSecret must be overridden`); }
  GetMaxAge(){ return 1000 * 60 * 60 * 24 * 7; } // 1 week
  GetCacheMaxAge(){ return 86400000; } // In milliseconds?
  GetIndexName(){ return "index.html"; }
  GetFileExtensions(){ return ["html"]; }
  GetMaxPayloadSize(){ return "10mb"; }
  GetCacheKey(){ return "server.default_key"; }
  GetDomains(){ return ["public"]; }
  GetProcessor(){ return this.Process.bind(this); }

  GetCertificateStaging(){ return true; }
  GetCertificatePackageRoot(){ return global.process.cwd(); }
  GetCertificateMaintainerEmail(){ throw new Error(`Server.GetCertificateMaintainerEmail must be overridden`); }
  GetCertificateConfigDirectory(){ return "./greenlock.d"; }
  GetCertificateCluster(){ return false; }

  GetCertificateCommonName(){ return "localhost"; }
  GetCertificateCountryName(){ return "US"; }
  GetCertificateStateName(){ return "Virginia"; }
  GetCertificateLocalityName(){ return "Blacksburg"; }
  GetCertificateOrganizationName(){ return "Test"; }
  GetCertificateOrganizationShortName(){ return "Test"; }
  GetCertificateAttributes()
  {
    return [
      {
        name: "commonName",
        value: this.GetCertificateCommonName(),
      },
      {
        name: "countryName",
        value: this.GetCertificateCountryName(),
      },
      {
        shortName: "ST",
        value: this.GetCertificateStateName(),
      },
      {
        name: "localityName",
        value: this.GetCertificateLocalityName(),
      },
      {
        name: "organizationName",
        value: this.GetCertificateOrganizationName(),
      },
      {
        shortName: "OU",
        value: this.GetCertificateOrganizationShortName(),
      },
    ];
  }

  GetCertificateExtensions()
  {
    return [
      {
        name: "basicConstraints",
        cA: true,
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: "extKeyUsage",
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true,
      },
      {
        name: "nsCertType",
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            type: 6, // URI
            value: "http://example.org/webid#me"
          },
          {
            type: 7, // IP
            ip: "127.0.0.1",
          },
        ],
      },
      {
        name: "subjectKeyIdentifier",
      },
    ];
  }

  // GetExpress(){ return this.express; }
  // GetServer(){ return this.server; }
  // GetOptions(){ return this.options; }
  GetExpress(){ return this.#express; }
  GetServer(){ return this.#server; }
  GetOptions(){ return this.#options; }

  GetConnectionCount()
  {
    return this.GetServer().then(server =>
    {
      return new Promise((resolve, reject) =>
      {
        server.getConnections((error, count) =>
        {
          if (error) return reject(error);
          else return resolve(count);
        });
      });
    });
  }

  async IsListening(){ return (await this.GetServer())?.listening === true; }
}

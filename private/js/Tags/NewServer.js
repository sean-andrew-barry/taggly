import http from "http";
import https from "https";
import http2 from "http2";
import path from "path";
import {pathToFileURL, fileURLToPath} from "url";

import Express from "/js/External/Express.js?static=true";
import body_parser from "/js/External/BodyParser.js?static=true";
import compression from "/js/External/Compression.js?static=true";
// import spdy from "/js/External/spdy.js?static=true";

import {Server as Base} from "/js/Tags/Server.js?next=taggly/private";

export class Server extends Base
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "server"; }

  constructor(...args)
  {
    super(...args);

    // this.indexes = new Map();
    // this.parents = new Map();

    // this.express = this.CreateExpress();
    this.server = this.CreateServer();
    // this.options = this.CreateOptions();

    this.listeners = new Map([
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

  async CreateCertificate()
  {
    let certificate;
    if (await this.UseHTTPS())
    {
      const {Secret} = await import("/js/Tags/Model/Secret.js");
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
        certificate = await this.CreateCertificate();
        rsa_private_key = await new Secret().Key("=", "rsa_private_key").Value("=", certificate.key).Insert();
        ssl_certificate = await new Secret().Key("=", "ssl_certificate").Value("=", certificate.cert).Insert();
      }
    }

    return certificate;
  }

  async CreateServer()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;

    const port = await this.GetPort();
    const certificate = await this.GetCertificate();
    const hosts = await this.GetHosts();

    const options = {
      cert: certificate.cert,
      key: certificate.key,
      allowHTTP1: true,
    };

    // const express = await this.GetExpress();
    const server = http2.createSecureServer(options, this.OnRequest.bind(this)).listen(port);

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

  async ProcessListeners(request, response)
  {
    const specifier = request.GetSpecifier();
    const listeners = this.GetListeners(method);

    if (listeners.has(specifier))
    {
      const handlers = listeners.get(specifier);
      for (let i = 0; i < handlers.length; i++)
      {
        const handler = handlers[i];

        await handler(request, response);

        if (response.IsDone()) return;

        // if (res.writableEnded)
        // {
        //   return;
        // }
      }
    }
  }

  ProcessFile(request, response)
  {
  }

  ProcessIndex(request, response)
  {
  }

  ProcessUnknown(request, response)
  {
  }

  OnRequest(req, res)
  {
    const request = new Request(req);
    const response = new Response(res);

    try
    {
      await this.ProcessListeners(request, response);
      if (response.IsDone()) return;

      await this.ProcessFile(request, response);
      if (response.IsDone()) return;

      await this.ProcessIndex(request, response);
      if (response.IsDone()) return;

      await this.ProcessUnknown(request, response);
      if (response.IsDone()) return;
    }
    catch (error)
    {

    }
  }

  GetCertificate(){ return this[CERTIFICATE] ??= this.CreateCertificate(); }
}

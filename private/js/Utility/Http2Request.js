import http2 from "http2";
import mime from "mime-types";
import fs from "fs";
import zlib from "zlib";
import {URL, pathToFileURL, fileURLToPath} from "url";
import {Request} from "/js/Utility/Request.js";

console.log("Importing", import.meta.url);

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_PROTOCOL,
  HTTP2_HEADER_ACCEPT_CHARSET,
  HTTP2_HEADER_ACCEPT_ENCODING,
  HTTP2_HEADER_ACCEPT_LANGUAGE,
  HTTP2_HEADER_ACCEPT_RANGES,
  HTTP2_HEADER_ACCEPT,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_METHODS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
  HTTP2_HEADER_ACCESS_CONTROL_EXPOSE_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_MAX_AGE,
  HTTP2_HEADER_ACCESS_CONTROL_REQUEST_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_REQUEST_METHOD,
  HTTP2_HEADER_AGE,
  HTTP2_HEADER_ALLOW,
  HTTP2_HEADER_AUTHORIZATION,
  HTTP2_HEADER_CACHE_CONTROL,
  HTTP2_HEADER_CONNECTION,
  HTTP2_HEADER_CONTENT_DISPOSITION,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_CONTENT_LANGUAGE,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_LOCATION,
  HTTP2_HEADER_CONTENT_MD5,
  HTTP2_HEADER_CONTENT_RANGE,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_COOKIE,
  HTTP2_HEADER_DATE,
  HTTP2_HEADER_DNT,
  HTTP2_HEADER_ETAG,
  HTTP2_HEADER_EXPECT,
  HTTP2_HEADER_EXPIRES,
  HTTP2_HEADER_FORWARDED,
  HTTP2_HEADER_FROM,
  HTTP2_HEADER_HOST,
  HTTP2_HEADER_IF_MATCH,
  HTTP2_HEADER_IF_MODIFIED_SINCE,
  HTTP2_HEADER_IF_NONE_MATCH,
  HTTP2_HEADER_IF_RANGE,
  HTTP2_HEADER_IF_UNMODIFIED_SINCE,
  HTTP2_HEADER_LAST_MODIFIED,
  HTTP2_HEADER_LINK,
  HTTP2_HEADER_LOCATION,
  HTTP2_HEADER_MAX_FORWARDS,
  HTTP2_HEADER_PREFER,
  HTTP2_HEADER_PROXY_AUTHENTICATE,
  HTTP2_HEADER_PROXY_AUTHORIZATION,
  HTTP2_HEADER_RANGE,
  HTTP2_HEADER_REFERER,
  HTTP2_HEADER_REFRESH,
  HTTP2_HEADER_RETRY_AFTER,
  HTTP2_HEADER_SERVER,
  HTTP2_HEADER_SET_COOKIE,
  HTTP2_HEADER_STRICT_TRANSPORT_SECURITY,
  HTTP2_HEADER_TRAILER,
  HTTP2_HEADER_TRANSFER_ENCODING,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_TK,
  HTTP2_HEADER_UPGRADE_INSECURE_REQUESTS,
  HTTP2_HEADER_UPGRADE,
  HTTP2_HEADER_USER_AGENT,
  HTTP2_HEADER_VARY,
  HTTP2_HEADER_VIA,
  HTTP2_HEADER_WARNING,
  HTTP2_HEADER_WWW_AUTHENTICATE,
  HTTP2_HEADER_X_CONTENT_TYPE_OPTIONS,
  HTTP2_HEADER_X_FRAME_OPTIONS,
  HTTP2_HEADER_HTTP2_SETTINGS,
  HTTP2_HEADER_KEEP_ALIVE,
  HTTP2_HEADER_PROXY_CONNECTION,
} = http2.constants;

export const C = http2.constants;

// console.log(http2.constants);

export const STREAM = Symbol("stream");
export const HEADERS = Symbol("headers");

export class Http2Request extends Request
{
  constructor(stream, headers)
  {
    super();

    this.SetStream(stream);
    this.SetHeaders(headers);
    this.response = {};
  }

  Push(parent)
  {
    // console.log("Pushing", parent.imports.size);
    // for (const url of parent.imports)
    // {
    //   console.log("Pushing", url.href);
    // }

    // const stream = this.GetStream();
    // stream.pushStream({ ":path": "/font.woff" }, { parent: stream.id }, (pushStream) =>
    // {
    //   // console.log('pushing');
    //   // pushStream.respondWithFile(path.join(serverRoot, "/font.woff"), {
    //   //     'content-type': "text/css"
    //   // }, {
    //   //     onError: (err) => {
    //   //         respondToStreamError(err, pushStream);
    //   //     }
    //   // });
    // });
  }

  async File(url, target_stream = this.GetStream())
  {
    await url.Refresh();

    // console.log("Sending", import.meta.url);

    // console.log("Sending", url.href);
    const accept_encoding = this.GetAcceptEncoding() || "";

    // let stream = url.stream || (url.stream = fs.createReadStream(url));
    // let stream = url.GetStream();
    // let stream = fs.createReadStream(url);

    let data = await url.GetData();
    this.ContentLength(data.length, false);

    if (accept_encoding.match(/\bgzip\b/))
    {
      this.ContentEncoding("gzip");
      // stream = url.gzip || (url.gzip = stream.pipe(zlib.createGzip()));
      // stream = stream.pipe(zlib.createGzip());
      data = await url.GetGZip();
      // stream = url.gzip || (url.gzip = stream.pipe(zlib.createGzip()));
    }
    else if (accept_encoding.match(/\bdeflate\b/))
    {
      this.ContentEncoding("deflate");
      data = await url.GetDeflate();
      // stream = url.deflate || (url.deflate = stream.pipe(zlib.createDeflate()));
      // stream = url.GetDeflate();
    }

    if (!this.HasType())
    {
      const path = url.file_path || (url.file_path = fileURLToPath(url));
      const type = url.mime_type || (url.mime_type = mime.lookup(path));

      if (typeof(type) === "string")
      {
        this.Type(type);
      }
    }

    this.Okay(false);
    this.Send(data);
    this.Push(url);
  }

  Pipe(value, target_stream = this.GetStream())
  {
    // const stream = this.GetStream();
    target_stream.respond(this.response);
    value.pipe(target_stream);

    return this;
  }

  Send(value = this.value)
  {
    const stream = this.GetStream();
    stream.respond(this.response);
    stream.end(value);

    return this;
  }

  SetResponse(key, value, force = true)
  {
    if (force === true)
    {
      this.response[key] = value;
    }
    else if (!this.HasResponse(key))
    {
      this.response[key] = value;
    }

    return this;
  }

  HasResponse(key){ return this.response.hasOwnProperty(key); }

  Type(v, f){ return this.SetResponse(C.HTTP2_HEADER_CONTENT_TYPE, v, f); }
  Status(v, f){ return this.SetResponse(C.HTTP2_HEADER_STATUS, v, f); }
  ContentEncoding(v, f){ return this.SetResponse(C.HTTP2_HEADER_CONTENT_ENCODING, v, f); }
  ContentLength(v, f){ return this.SetResponse(C.HTTP2_HEADER_CONTENT_LENGTH, v, f); }

  Value(value)
  {
    this.value = value;
    return this;
  }

  SetStream(v){ this[STREAM] = v; return this; }
  SetHeaders(v){ this[HEADERS] = v; return this; }

  GetStream(){ return this[STREAM]; }
  GetHeaders(){ return this[HEADERS]; }
  GetHeader(header){ return this.GetHeaders()[header]; }
  GetMethod(){ return this.GetHeader(C.HTTP2_HEADER_METHOD); }
  GetType(){ return this.GetHeader(C.HTTP2_HEADER_CONTENT_TYPE); }
  GetPath(){ return this.GetHeader(C.HTTP2_HEADER_PATH); }
  GetStatus(){ return this.GetHeader(C.HTTP2_HEADER_STATUS); }
  GetHostName(){ return this.GetHeader(C.HTTP2_HEADER_AUTHORITY); }
  GetAcceptEncoding(){ return this.GetHeader(C.HTTP2_HEADER_ACCEPT_ENCODING); }
  GetDomains(){ return this.GetHostName().split("."); }

  HasType(){ return this.HasResponse(C.HTTP2_HEADER_CONTENT_TYPE); }
  HasStatus(){ return this.HasResponse(C.HTTP2_HEADER_STATUS); }
  HasContentEncoding(){ return this.HasResponse(C.HTTP2_HEADER_CONTENT_ENCODING); }
}

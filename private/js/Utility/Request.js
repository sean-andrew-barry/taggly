import http2 from "http2";
import querystring from "querystring";
import * as H from "/js/Utility/Headers.js";

const {
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_PROTOCOL,
  HTTP2_HEADER_ACCEPT_ENCODING,
  HTTP2_HEADER_ACCEPT_LANGUAGE,
  HTTP2_HEADER_ACCEPT_RANGES,
  HTTP2_HEADER_ACCEPT,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_METHODS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
  HTTP2_HEADER_ACCESS_CONTROL_EXPOSE_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_REQUEST_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_REQUEST_METHOD,
  HTTP2_HEADER_AGE,
  HTTP2_HEADER_AUTHORIZATION,
  HTTP2_HEADER_CACHE_CONTROL,
  HTTP2_HEADER_CONNECTION,
  HTTP2_HEADER_CONTENT_DISPOSITION,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_COOKIE,
  HTTP2_HEADER_DATE,
  HTTP2_HEADER_ETAG,
  HTTP2_HEADER_FORWARDED,
  HTTP2_HEADER_HOST,
  HTTP2_HEADER_IF_MODIFIED_SINCE,
  HTTP2_HEADER_IF_NONE_MATCH,
  HTTP2_HEADER_IF_RANGE,
  HTTP2_HEADER_LAST_MODIFIED,
  HTTP2_HEADER_LINK,
  HTTP2_HEADER_LOCATION,
  HTTP2_HEADER_RANGE,
  HTTP2_HEADER_REFERER,
  HTTP2_HEADER_SERVER,
  HTTP2_HEADER_SET_COOKIE,
  HTTP2_HEADER_STRICT_TRANSPORT_SECURITY,
  HTTP2_HEADER_TRANSFER_ENCODING,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_UPGRADE_INSECURE_REQUESTS,
  HTTP2_HEADER_UPGRADE,
  HTTP2_HEADER_USER_AGENT,
  HTTP2_HEADER_VARY,
  HTTP2_HEADER_X_CONTENT_TYPE_OPTIONS,
  HTTP2_HEADER_X_FRAME_OPTIONS,
  HTTP2_HEADER_KEEP_ALIVE,
  HTTP2_HEADER_PROXY_CONNECTION,
  HTTP2_HEADER_X_XSS_PROTECTION,
  HTTP2_HEADER_ALT_SVC,
  HTTP2_HEADER_CONTENT_SECURITY_POLICY,
  HTTP2_HEADER_EARLY_DATA,
  HTTP2_HEADER_EXPECT_CT,
  HTTP2_HEADER_ORIGIN,
  HTTP2_HEADER_PURPOSE,
  HTTP2_HEADER_TIMING_ALLOW_ORIGIN,
  HTTP2_HEADER_X_FORWARDED_FOR,
  HTTP2_HEADER_ACCEPT_CHARSET,
  HTTP2_HEADER_ACCESS_CONTROL_MAX_AGE,
  HTTP2_HEADER_ALLOW,
  HTTP2_HEADER_CONTENT_LANGUAGE,
  HTTP2_HEADER_CONTENT_LOCATION,
  HTTP2_HEADER_CONTENT_MD5,
  HTTP2_HEADER_CONTENT_RANGE,
  HTTP2_HEADER_DNT,
  HTTP2_HEADER_EXPECT,
  HTTP2_HEADER_EXPIRES,
  HTTP2_HEADER_FROM,
  HTTP2_HEADER_IF_MATCH,
  HTTP2_HEADER_IF_UNMODIFIED_SINCE,
  HTTP2_HEADER_MAX_FORWARDS,
  HTTP2_HEADER_PREFER,
  HTTP2_HEADER_PROXY_AUTHENTICATE,
  HTTP2_HEADER_PROXY_AUTHORIZATION,
  HTTP2_HEADER_REFRESH,
  HTTP2_HEADER_RETRY_AFTER,
  HTTP2_HEADER_TRAILER,
  HTTP2_HEADER_TK,
  HTTP2_HEADER_VIA,
  HTTP2_HEADER_WARNING,
  HTTP2_HEADER_WWW_AUTHENTICATE,
  HTTP2_HEADER_HTTP2_SETTINGS,
} = http2.constants;

export class Request
{
  #request;
  #cookies;

  constructor(request)
  {
    this.#request = request;
  }

  get method(){ return this.GetHeader(HTTP2_HEADER_METHOD); }
  get originalUrl(){ return this.GetHeader(HTTP2_HEADER_PATH); }

  IsPushAllowed(){ return this.#request.stream?.pushAllowed; }

  Push(specifier, source)
  {
    return new Promise((resolve, reject) =>
    {
      this.#request.stream.pushStream(
        { ":path": specifier },
        (error, stream) =>
        {
          if (error) return reject(error);

          stream.respond({
            ":status": 200,
            "cache-control": "public, max-age=31536000",
            "content-type": "application/javascript",
          });

          stream.end(source);
          resolve();
        },
      );
    });
  }

  GetRequest(){ return this.#request; }
  GetVersion(){ return this.#request.httpVersion; }
  HasHeader(name){ return !!this.#request.headers[name.toLowerCase()]; }
  GetHeader(name){ return this.#request.headers[name.toLowerCase()]; }
  GetHeaders(){ return this.#request.headers; }
  GetRawHeaders(){ return this.#request.rawHeaders; }
  GetRawTrailers(){ return this.#request.rawTrailers; }
  GetScheme(){ return this.#request.scheme; }
  GetSocket(){ return this.#request.socket; }
  GetStream(){ return this.#request.stream; }
  GetTrailers(){ return this.#request.trailers; }
  GetURL(){ return this.#request.url; }
  GetMethod(){ return this.GetHeader(HTTP2_HEADER_METHOD) ?? this.#request.method; }
  GetSpecifier(){ return this.GetHeader(HTTP2_HEADER_PATH) ?? this.#request.url; }

  CreateCookies(){ return querystring.parse(this.#request.headers.cookie, ";"); }
  GetCookies(){ return this.#cookies ??= this.CreateCookies(); }

  // GetCookies(){ return this.#request.cookies; }
  // GetSignedCookies(){ return this.#request.signedCookies; }
  GetCookie(name){ return this.GetCookies()?.[name]; }
  // GetSignedCookie(name){ return this.#request.signedCookies[name]; }

  GetHost()
  {
    return this.GetHeader(HTTP2_HEADER_AUTHORITY)
        ?? this.GetHeader(HTTP2_HEADER_HOST)
        ?? this.#request.host;
  }

  GetParent()
  {
    return this.GetHeader(HTTP2_HEADER_REFERER)
        ?? this.#request.referer;
  }

  GetContentType()
  {
    return this.GetHeader(HTTP2_HEADER_CONTENT_TYPE)
        ?? this.#request.host;
  }

  GetBody()
  {
    return new Promise((resolve, reject) =>
    {
      try
      {
        let body = "";

        this.#request.on("data", chunk =>
        {
          body += chunk.toString();
        });

        this.#request.on("end", () =>
        {
          resolve(JSON.parse(body));
        });
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  GetAlpnProtocol()
  {
    if (this.IsHTTP2()) return this.#request?.stream?.session?.socket?.alpnProtocol;
    else return this.#request?.socket?.alpnProtocol;
  }

  IsComplete(){ return this.#request.complete === true; }
  IsHTTP1(){ return !this.IsHTTP2(); }
  IsHTTP2(){ return this.GetVersion() === "2.0"; }
  IsGet(){ return this.GetMethod() === "GET"; }
  IsPost(){ return this.GetMethod() === "POST"; }
  IsDelete(){ return this.GetMethod() === "DELETE"; }
  IsUpdate(){ return this.GetMethod() === "UPDATE"; }
  IsPatch(){ return this.GetMethod() === "PATCH"; }
  IsPut(){ return this.GetMethod() === "PUT"; }

  // For ease of setting the type
  JSON(value){ return this.Okay().TypeJSON().Value(value).Send(); }
  HTML(value){ return this.Okay().TypeHTML().Value(value).Send(); }
  Text(value){ return this.Okay().TypePlain().Value(value).Send(); }
  // Blob    (value){ return this.Type("text/download").Value(value).Send(); }
  // File    (value){ return this.Type("text/sendFile").Value(value).Send(); }
  // Redirect(value){ return this.Type("text/redirect").Value(value).Send(); }

  Status(){ throw new Error(`Request.Status must be overridden and must not call super.Status`); }
  Type(){ throw new Error(`Request.Type must be overridden and must not call super.Type`); }
  Value(){ throw new Error(`Request.Value must be overridden and must not call super.Value`); }
  Send(){ throw new Error(`Request.Send must be overridden and must not call super.Send`); }
}

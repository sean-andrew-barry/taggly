// import H from "/js/Utility/Headers.js";
import * as H from "/js/Utility/Headers.js";

// console.log(Headers);

import {String} from "/js/String.js";

export class Response
{
  #request;
  #response;

  constructor(request, response)
  {
    this.#request = request;
    this.#response = response;
    this.status = 200;
    this.type = undefined;
    this.message = undefined; // Status message, for compatibility with HTTP/1
  }

  SetHeader(name, value){ this.#response.setHeader(name, value); return this; }

  ContentLength(value){ return this.SetHeader("Content-Length", value); }
  ContentType(value){ return this.SetHeader("Content-Type", value); }
  ContentEncoding(value){ return this.SetHeader("Content-Encoding", value); }
  ContentLanguage(value){ return this.SetHeader("Content-Language", value); }
  ContentLocation(value){ return this.SetHeader("Content-Location", value); }

  WWWAuthenticate(v){ return this.SetHeader(H.WWW_AUTHENTICATE, v); }
  Authorization(v){ return this.SetHeader(H.AUTHORIZATION, v); }
  ProxyAuthenticate(v){ return this.SetHeader(H.PROXY_AUTHENTICATE, v); }
  ProxyAuthorization(v){ return this.SetHeader(H.PROXY_AUTHORIZATION, v); }
  Age(v){ return this.SetHeader(H.AGE, v); }
  CacheControl(v){ return this.SetHeader(H.CACHE_CONTROL, v); }
  ClearSiteData(v){ return this.SetHeader(H.CLEAR_SITE_DATA, v); }
  Expires(v){ return this.SetHeader(H.EXPIRES, v); }
  Pragma(v){ return this.SetHeader(H.PRAGMA, v); }
  Warning(v){ return this.SetHeader(H.WARNING, v); }
  Downlink(v){ return this.SetHeader(H.DOWNLINK, v); }
  ECT(v){ return this.SetHeader(H.ECT, v); }
  RTT(v){ return this.SetHeader(H.RTT, v); }
  SaveData(v){ return this.SetHeader(H.SAVE_DATA, v); }
  LastModified(v){ return this.SetHeader(H.LAST_MODIFIED, v); }
  ETag(v){ return this.SetHeader(H.ETAG, v); }
  IfMatch(v){ return this.SetHeader(H.IF_MATCH, v); }
  IfNoneMatch(v){ return this.SetHeader(H.IF_NONE_MATCH, v); }
  IfModifiedSince(v){ return this.SetHeader(H.IF_MODIFIED_SINCE, v); }
  IfUnmodifiedSince(v){ return this.SetHeader(H.IF_UNMODIFIED_SINCE, v); }
  Vary(v){ return this.SetHeader(H.VARY, v); }
  Connection(v){ return this.SetHeader(H.CONNECTION, v); }
  KeepAlive(v){ return this.SetHeader(H.KEEP_ALIVE, v); }
  Accept(v){ return this.SetHeader(H.ACCEPT, v); }
  AcceptEncoding(v){ return this.SetHeader(H.ACCEPT_ENCODING, v); }
  AcceptLanguage(v){ return this.SetHeader(H.ACCEPT_LANGUAGE, v); }
  Expect(v){ return this.SetHeader(H.EXPECT, v); }
  MaxForwards(v){ return this.SetHeader(H.MAX_FORWARDS, v); }
  Cookie(v){ return this.SetHeader(H.COOKIE, v); }
  SetCookie(v){ return this.SetHeader(H.SET_COOKIE, v); }
  Cookie2(v){ return this.SetHeader(H.COOKIE2, v); }
  SetCookie2(v){ return this.SetHeader(H.SET_COOKIE2, v); }
  AccessControlAllowOrigin(v){ return this.SetHeader(H.ACCESS_CONTROL_ALLOW_ORIGIN, v); }
  AccessControlAllowCredentials(v){ return this.SetHeader(H.ACCESS_CONTROL_ALLOW_CREDENTIALS, v); }
  AccessControlAllowHeaders(v){ return this.SetHeader(H.ACCESS_CONTROL_ALLOW_HEADERS, v); }
  AccessControlAllowMethods(v){ return this.SetHeader(H.ACCESS_CONTROL_ALLOW_METHODS, v); }
  AccessControlExposeHeaders(v){ return this.SetHeader(H.ACCESS_CONTROL_EXPOSE_HEADERS, v); }
  AccessControlMaxAge(v){ return this.SetHeader(H.ACCESS_CONTROL_MAX_AGE, v); }
  AccessControlRequestHeaders(v){ return this.SetHeader(H.ACCESS_CONTROL_REQUEST_HEADERS, v); }
  AccessControlRequestMethod(v){ return this.SetHeader(H.ACCESS_CONTROL_REQUEST_METHOD, v); }
  Origin(v){ return this.SetHeader(H.ORIGIN, v); }
  TimingAllowOrigin(v){ return this.SetHeader(H.TIMING_ALLOW_ORIGIN, v); }
  ContentDisposition(v){ return this.SetHeader(H.CONTENT_DISPOSITION, v); }
  ContentLength(v){ return this.SetHeader(H.CONTENT_LENGTH, v); }
  ContentType(v){ return this.SetHeader(H.CONTENT_TYPE, v); }
  ContentEncoding(v){ return this.SetHeader(H.CONTENT_ENCODING, v); }
  ContentLanguage(v){ return this.SetHeader(H.CONTENT_LANGUAGE, v); }
  ContentLocation(v){ return this.SetHeader(H.CONTENT_LOCATION, v); }
  Forwarded(v){ return this.SetHeader(H.FORWARDED, v); }
  XForwardedFor(v){ return this.SetHeader(H.X_FORWARDED_FOR, v); }
  XForwardedHost(v){ return this.SetHeader(H.X_FORWARDED_HOST, v); }
  XForwardedProto(v){ return this.SetHeader(H.X_FORWARDED_PROTO, v); }
  Via(v){ return this.SetHeader(H.VIA, v); }
  Location(v){ return this.SetHeader(H.LOCATION, v); }
  From(v){ return this.SetHeader(H.FROM, v); }
  Host(v){ return this.SetHeader(H.HOST, v); }
  Referer(v){ return this.SetHeader(H.REFERER, v); }
  ReferrerPolicy(v){ return this.SetHeader(H.REFERRER_POLICY, v); }
  UserAgent(v){ return this.SetHeader(H.USER_AGENT, v); }
  Allow(v){ return this.SetHeader(H.ALLOW, v); }
  Server(v){ return this.SetHeader(H.SERVER, v); }
  AcceptRanges(v){ return this.SetHeader(H.ACCEPT_RANGES, v); }
  Range(v){ return this.SetHeader(H.RANGE, v); }
  IfRange(v){ return this.SetHeader(H.IF_RANGE, v); }
  ContentRange(v){ return this.SetHeader(H.CONTENT_RANGE, v); }
  CrossOriginEmbedderPolicy(v){ return this.SetHeader(H.CROSS_ORIGIN_EMBEDDER_POLICY, v); }
  CrossOriginOpenerPolicy(v){ return this.SetHeader(H.CROSS_ORIGIN_OPENER_POLICY, v); }
  CrossOriginResourcePolicy(v){ return this.SetHeader(H.CROSS_ORIGIN_RESOURCE_POLICY, v); }
  ContentSecurityPolicy(v){ return this.SetHeader(H.CONTENT_SECURITY_POLICY, v); }
  ContentSecurityPolicyReportOnly(v){ return this.SetHeader(H.CONTENT_SECURITY_POLICY_REPORT_ONLY, v); }
  ExpectCT(v){ return this.SetHeader(H.EXPECT_CT, v); }
  FeaturePolicy(v){ return this.SetHeader(H.FEATURE_POLICY, v); }
  OriginIsolation(v){ return this.SetHeader(H.ORIGIN_ISOLATION, v); }
  StrictTransportSecurity(v){ return this.SetHeader(H.STRICT_TRANSPORT_SECURITY, v); }
  UpgradeInsecureRequests(v){ return this.SetHeader(H.UPGRADE_INSECURE_REQUESTS, v); }
  XContentTypeOptions(v){ return this.SetHeader(H.X_CONTENT_TYPE_OPTIONS, v); }
  XDownloadOptions(v){ return this.SetHeader(H.X_DOWNLOAD_OPTIONS, v); }
  XFrameOptions(v){ return this.SetHeader(H.X_FRAME_OPTIONS, v); }
  XPermittedCrossDomainPolicies(v){ return this.SetHeader(H.X_PERMITTED_CROSS_DOMAIN_POLICIES, v); }
  XPoweredBy(v){ return this.SetHeader(H.X_POWERED_BY, v); }
  XXSSProtection(v){ return this.SetHeader(H.X_XSS_PROTECTION, v); }
  PublicKeyPins(v){ return this.SetHeader(H.PUBLIC_KEY_PINS, v); }
  PublicKeyPinsReportOnly(v){ return this.SetHeader(H.PUBLIC_KEY_PINS_REPORT_ONLY, v); }
  SecFetchSite(v){ return this.SetHeader(H.SEC_FETCH_SITE, v); }
  SecFetchMode(v){ return this.SetHeader(H.SEC_FETCH_MODE, v); }
  SecFetchUser(v){ return this.SetHeader(H.SEC_FETCH_USER, v); }
  SecFetchDest(v){ return this.SetHeader(H.SEC_FETCH_DEST, v); }
  LastEventID(v){ return this.SetHeader(H.LAST_EVENT_ID, v); }
  NEL(v){ return this.SetHeader(H.NEL, v); }
  PingFrom(v){ return this.SetHeader(H.PING_FROM, v); }
  PingTo(v){ return this.SetHeader(H.PING_TO, v); }
  ReportTo(v){ return this.SetHeader(H.REPORT_TO, v); }
  TransferEncoding(v){ return this.SetHeader(H.TRANSFER_ENCODING, v); }
  TE(v){ return this.SetHeader(H.TE, v); }
  Trailer(v){ return this.SetHeader(H.TRAILER, v); }
  SecWebSocketKey(v){ return this.SetHeader(H.SEC_WEBSOCKET_KEY, v); }
  SecWebSocketExtensions(v){ return this.SetHeader(H.SEC_WEBSOCKET_EXTENSIONS, v); }
  SecWebSocketAccept(v){ return this.SetHeader(H.SEC_WEBSOCKET_ACCEPT, v); }
  SecWebSocketProtocol(v){ return this.SetHeader(H.SEC_WEBSOCKET_PROTOCOL, v); }
  SecWebSocketVersion(v){ return this.SetHeader(H.SEC_WEBSOCKET_VERSION, v); }
  AcceptPushPolicy(v){ return this.SetHeader(H.ACCEPT_PUSH_POLICY, v); }
  AcceptSignature(v){ return this.SetHeader(H.ACCEPT_SIGNATURE, v); }
  AltSvc(v){ return this.SetHeader(H.ALT_SVC, v); }
  Date(v){ return this.SetHeader(H.DATE, v); }
  EarlyData(v){ return this.SetHeader(H.EARLY_DATA, v); }
  LargeAllocation(v){ return this.SetHeader(H.LARGE_ALLOCATION, v); }
  Link(v){ return this.SetHeader(H.LINK, v); }
  PushPolicy(v){ return this.SetHeader(H.PUSH_POLICY, v); }
  RetryAfter(v){ return this.SetHeader(H.RETRY_AFTER, v); }
  Signature(v){ return this.SetHeader(H.SIGNATURE, v); }
  SignedHeaders(v){ return this.SetHeader(H.SIGNED_HEADERS, v); }
  ServerTiming(v){ return this.SetHeader(H.SERVER_TIMING, v); }
  ServiceWorkerAllowed(v){ return this.SetHeader(H.SERVICE_WORKER_ALLOWED, v); }
  SourceMap(v){ return this.SetHeader(H.SOURCEMAP, v); }
  Upgrade(v){ return this.SetHeader(H.UPGRADE, v); }
  XDNSPrefetchControl(v){ return this.SetHeader(H.X_DNS_PREFETCH_CONTROL, v); }

  // LastModified(v)
  // {
  //   if (v instanceof Date)
  //   {
  //     v = v.toUTCString();
  //   }
  //
  //   return this.SetHeader(H.LAST_MODIFIED, v);
  // }

  // ETag(...parts)
  // {
  //   const string = parts.join();
  //   const hash = String.HashCyrb53(string);
  //   const hex = hash.toString(16);
  //
  //   return this.SetHeader(H.ETAG, hex);
  // }

  IsDone(){ return this.#response.writableEnded === true; }
  GetRequest(name){ return this.#request; }
  GetHeader(name){ return this.#response.getHeader(name); }
  HasHeader(name){ return this.#response.hasHeader(name); }
  RemoveHeader(name){ return this.#response.removeHeader(name); }
  GetHeaderNames(){ return this.#response.getHeaderNames(); }
  GetHeaders(){ return this.#response.getHeaders(); }

  // Push(headers, callback)
  // {
  //   this.#response.createPushResponse(headers, callback);
  // }

  WriteHead(status, message, headers){ return this.#response.writeHead(status, message, headers); }
  Write(data, encoding, callback){ return this.#response.write(data, encoding, callback); }
  End(data, encoding, callback){ return this.#response.end(data, encoding, callback); }

  AreHeadersSent(){ return this.#response.headersSent === true; }

  // SetCode(code){ this.#response.statusCode = code; }

  Type(type){ this.type = type; return this; }
  Status(status){ this.status = status; return this; }

  Send(body = this.body)
  {
    let message = this.message;

    if (this.GetRequest().IsHTTP2())
    {
      message = undefined;
    }

    // if (!this.HasHeader("Content-Length"))
    // {
    //   this.ContentLength(Buffer.byteLength(body));
    // }

    if (!this.HasHeader("Content-Type") && this.type !== undefined)
    {
      this.ContentType(this.type);
    }

    if (!this.HasHeader("Content-Length") && body !== undefined)
    {
      let length;
      if (typeof(body) === "string")
      {
        length = Buffer.byteLength(body, "utf-8");
      }
      else
      {
        length = body.byteLength;
      }

      this.ContentLength(length);
    }

    this.WriteHead(this.status, message, this.GetHeaders());
    this.End(body);
  }

  SendText(...args){ return this.TypePlain().Send(...args); }
  SendJS(...args){ return this.TypeJS().Send(...args); }
  SendJSON(...args){ return this.TypeJSON().Send(...args); }

  type(...args){ return this.Type(...args); }
  send(...args){ return this.Send(...args); }
  status(...args){ return this.Status(...args); }
  setHeader(...args){ return this.SetHeader(...args); }
  end(...args){ return this.End(...args); }

  TypeJavaScript(){ return this.Type("application/javascript"); }
  TypeJS(){ return this.TypeJavaScript(); }
  TypeOctetStream(){ return this.Type("application/octet-stream"); }
  TypeOgg(){ return this.Type("application/ogg"); }
  TypePDF(){ return this.Type("application/pdf"); }
  TypeJSON(){ return this.Type("application/json"); }
  TypeXML(){ return this.Type("application/xml"); }
  TypeZip(){ return this.Type("application/zip"); }
  TypeForm(){ return this.Type("application/x-www-form-urlencoded"); }
  TypeAudioMPEG(){ return this.Type("audio/mpeg"); }
  TypeGIF(){ return this.Type("image/gif"); }
  TypeJPEG(){ return this.Type("image/jpeg"); }
  TypePNG(){ return this.Type("image/png"); }
  TypeTiff(){ return this.Type("image/tiff"); }
  TypeMixed(){ return this.Type("multipart/mixed"); }
  TypeAlternative(){ return this.Type("multipart/alternative"); }
  TypeRelated(){ return this.Type("multipart/related"); }
  TypeFormData(){ return this.Type("multipart/form-data"); }
  TypeCSS(){ return this.Type("text/css"); }
  TypeCSV(){ return this.Type("text/csv"); }
  TypeHTML(){ return this.Type("text/html"); }
  TypePlain(){ return this.Type("text/plain"); }
  TypeText(){ return this.TypePlain(); }
  TypeXML(){ return this.Type("text/xml"); }
  TypeVideoMPEG(){ return this.Type("video/mpeg"); }
  TypeMP4(){ return this.Type("video/mp4"); }
  TypeQuickTime(){ return this.Type("video/quicktime"); }
  TypeWebM(){ return this.Type("video/webm"); }

  // 100s, informational
  Continue(){ return this.Status(100); }
  SwitchingProtocols(){ return this.Status(101); }
  Processing(){ return this.Status(102); }

  // 200s, success
  OK(f){ return this.Status(200, f); }
  Okay(f){ return this.Status(200, f); }
  Created(f){ return this.Status(201, f); }
  Accepted(f){ return this.Status(202, f); }
  NonAuthoritativeInformation(f){ return this.Status(203, f); }
  NoContent(f){ return this.Status(204, f); }
  ResetContent(f){ return this.Status(205, f); }
  PartialContent(f){ return this.Status(206, f); }
  MultiStatus(f){ return this.Status(207, f); }
  AlreadyReported(f){ return this.Status(208, f); }
  ImUsed(f){ return this.Status(226, f); }

  // 300s, redirect
  MultipleChoices(f){ return this.Status(300, f); }
  MovedPermanently(f){ return this.Status(301, f); }
  Found(f){ return this.Status(302, f); }
  SeeOther(f){ return this.Status(303, f); }
  NotModified(f){ return this.Status(304, f); }
  UseProxy(f){ return this.Status(305, f); }
  TemporaryRedirect(f){ return this.Status(307, f); }
  PermanentRedirect(f){ return this.Status(308, f); }

  // 400s, client error
  BadRequest(f){ return this.Status(400, f); }
  Unauthorized(f){ return this.Status(401, f); }
  PaymentRequired(f){ return this.Status(402, f); }
  Forbidden(f){ return this.Status(403, f); }
  NotFound(f){ return this.Status(404, f); }
  MethodNotAllowed(f){ return this.Status(405, f); }
  NotAcceptable(f){ return this.Status(406, f); }
  ProxyAuthenticationRequired(f){ return this.Status(407, f); }
  RequestTimeout(f){ return this.Status(408, f); }
  Conflict(f){ return this.Status(409, f); }
  Gone(f){ return this.Status(410, f); }
  LengthRequired(f){ return this.Status(411, f); }
  PreconditionFailed(f){ return this.Status(412, f); }
  PayloadTooLarge(f){ return this.Status(413, f); }
  RequestURITooLong(f){ return this.Status(414, f); }
  UnsupportedMediaType(f){ return this.Status(415, f); }
  RequestedRangeNotSatisfiable(f){ return this.Status(416, f); }
  ExpectationFailed(f){ return this.Status(417, f); }
  ImATeapot(f){ return this.Status(418, f); }
  MisdirectedRequest(f){ return this.Status(421, f); }
  UnprocessableEntity(f){ return this.Status(422, f); }
  Locked(f){ return this.Status(423, f); }
  FailedDependency(f){ return this.Status(424, f); }
  UpgradeRequired(f){ return this.Status(426, f); }
  PreconditionRequired(f){ return this.Status(428, f); }
  TooManyRequests(f){ return this.Status(429, f); }
  RequestHeaderFieldsTooLarge(f){ return this.Status(431, f); }
  ConnectionClosedWithoutResponse(f){ return this.Status(444, f); }
  UnavailableForLegalReasons(f){ return this.Status(451, f); }
  ClientClosedRequest(f){ return this.Status(499, f); }

  // 500s, server error
  InternalServerError(f){ return this.Status(500, f); }
  NotImplemented(f){ return this.Status(501, f); }
  BadGateway(f){ return this.Status(502, f); }
  ServiceUnavailable(f){ return this.Status(503, f); }
  GatewayTimeout(f){ return this.Status(504, f); }
  HTTPVersionNotSupported(f){ return this.Status(505, f); }
  VariantAlsoNegotiates(f){ return this.Status(506, f); }
  InsufficientStorage(f){ return this.Status(507, f); }
  LoopDetected(f){ return this.Status(508, f); }
  NotExtended(f){ return this.Status(510, f); }
  NetworkAuthenticationRequired(f){ return this.Status(511, f); }
  NetworkConnectTimeoutError(f){ return this.Status(599, f); }
}

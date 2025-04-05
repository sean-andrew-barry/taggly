export class Response
{
  constructor(response, next)
  {
    // Hide the property so it doesn't flood logging
    Object.defineProperty(this, "response", {
      enumerable: false,
      writable: true,
      value: response,
    });

    this.sent = false;
    this.next = next;
  }

  Code (code ){ this.code  = code ; return this; }
  Type (type ){ this.type  = type ; return this; }
  Value(value){ this.value = value; return this; }

  // For ease of setting the type
  JSON    (){ return this.Type("json"    ); }
  HTML    (){ return this.Type("render"  ); }
  Text    (){ return this.Type("send"    ); }
  Blob    (){ return this.Type("download"); }
  File    (){ return this.Type("sendFile"); }
  Redirect(){ return this.Type("redirect"); }

  // For conveniently setting common responses
  Accept(value = null){ return this.Code(200).JSON().Value(value).Send(); }
  // Accept(value = null){ return this.Code(200).JSON().Value({ value }).Send(); }

  Reject(error)
  {
    console.error("Rejecting", error);
    return this.Code(500).JSON().Value(error).Send();
  }

  // Reject(error)
  // {
  //   console.error("Rejecting", error);
  //   return this.Code(200).JSON().Value({ error }).Send();
  // }

  // Reject     (value){ return this.Code(200).JSON().Value({ reject: value }); }
  // Error      (value){ return this.Code(200).JSON().Value({ error: value }); }
  // ClientError(client_error){ return this.Code(200).JSON().Value({ client_error }); }
  // ServerError(server_error){ return this.Code(200).JSON().Value({ server_error }); }
  // InternalError(internal_error){ return this.Code(200).JSON().Value({ internal_error }); }

  // // These all return 200, because browsers have built in handling for codes I want to avoid
  // ClientError  (message, name){ return this.Code(200).JSON().Value({ error: "ClientError", message, name, }); }
  // ServerError  (message, name){ return this.Code(200).JSON().Value({ error: "ServerError", message, name, }); }
  // InternalError(message, name){ return this.Code(200).JSON().Value({ error: "InternalError", message, name, }); }

  // Error(error)
  // {
  //   if (error instanceof ClientError) this.ClientError(error.message, error.name);
  //   else if (error instanceof ServerError) this.ServerError(error.message, error.name);
  //   else this.InternalError("Internal Error", "InternalError");
  // }

  HasCode(){ return this.code !== undefined; }
  HasType(){ return this.type !== undefined; }
  HasValue(){ return this.value !== undefined; }

  GetCode(){ return this.code || Response.default_code; }
  GetType(){ return this.type || Response.default_type; }
  GetValue(){ return this.value || Response.default_value; }

  SetStatus(code){ this.response.status(code); return this; }
  SetHeader(name, value){ this.response.setHeader(name, value); return this; }
  GetHeader(name){ return this.response.get(name); }
  WriteHead(code, headers){ console.log("~~WRITING HEAD~~", code, headers); this.response.writeHead(code, headers); return this; }
  Write(data){ this.response.write(data); return this; }

  End(value, type){ this.response.end(value, type); return this; }

  Send()
  {
    if (this.sent === true)
    {
      throw new Error(`Response already sent`);
    }

    this.sent = true;

    const code = this.GetCode();
    const type = this.GetType();
    const value = this.GetValue();

    // console.log("Sending response", code, type, value);
    this.response.status(code)[type](value);
    return this;
  }

  IsSent(){ return this.sent === true; }

  GetApp(){ return this.app; }
  GetResponse(){ return this.response; }

  SetCookie({
    name,
    value,
    domain,
    encode,
    expires,
    httpOnly = true,
    maxAge,
    path,
    secure,
    signed,
    sameSite,
  })
  {
    this.response.cookie(name, value, {
      domain,
      encode,
      expires,
      httpOnly,
      maxAge,
      path,
      secure,
      signed,
      sameSite,
    });

    return value;
  }

  // // For ease of setting the type
  // JSON(value){ return this.Okay().TypeJSON().Value(value).Send(); }
  // HTML(value){ return this.Okay().TypeHTML().Value(value).Send(); }
  // Text(value){ return this.Okay().TypePlain().Value(value).Send(); }
  // // Blob    (value){ return this.Type("text/download").Value(value).Send(); }
  // // File    (value){ return this.Type("text/sendFile").Value(value).Send(); }
  // // Redirect(value){ return this.Type("text/redirect").Value(value).Send(); }
  //
  // Status(){ throw new Error(`Request.Status must be overridden and must not call super.Status`); }
  // Type(){ throw new Error(`Request.Type must be overridden and must not call super.Type`); }
  // Value(){ throw new Error(`Request.Value must be overridden and must not call super.Value`); }
  // Send(){ throw new Error(`Request.Send must be overridden and must not call super.Send`); }
  //
  // TypeJavaScript(){ return this.Type("application/javascript"); }
  // TypeOctetStream(){ return this.Type("application/octet-stream"); }
  // TypeOgg(){ return this.Type("application/ogg"); }
  // TypePDF(){ return this.Type("application/pdf"); }
  // TypeJSON(){ return this.Type("application/json"); }
  // TypeXML(){ return this.Type("application/xml"); }
  // TypeZip(){ return this.Type("application/zip"); }
  // TypeForm(){ return this.Type("application/x-www-form-urlencoded"); }
  //
  // TypeAudioMPEG(){ return this.Type("audio/mpeg"); }
  //
  // TypeGIF(){ return this.Type("image/gif"); }
  // TypeJPEG(){ return this.Type("image/jpeg"); }
  // TypePNG(){ return this.Type("image/png"); }
  // TypeTiff(){ return this.Type("image/tiff"); }
  //
  // TypeMixed(){ return this.Type("multipart/mixed"); }
  // TypeAlternative(){ return this.Type("multipart/alternative"); }
  // TypeRelated(){ return this.Type("multipart/related"); }
  // TypeFormData(){ return this.Type("multipart/form-data"); }
  //
  // TypeCSS(){ return this.Type("text/css"); }
  // TypeCSV(){ return this.Type("text/csv"); }
  // TypeHTML(){ return this.Type("text/html"); }
  // TypePlain(){ return this.Type("text/plain"); }
  // TypeXML(){ return this.Type("text/xml"); }
  //
  // TypeVideoMPEG(){ return this.Type("video/mpeg"); }
  // TypeMP4(){ return this.Type("video/mp4"); }
  // TypeQuickTime(){ return this.Type("video/quicktime"); }
  // TypeWebM(){ return this.Type("video/webm"); }
  //
  // // 100s, informational
  // Continue(){ return this.Status(100); }
  // SwitchingProtocols(){ return this.Status(101); }
  // Processing(){ return this.Status(102); }
  //
  // // 200s, success
  // OK(f){ return this.Status(200, f); }
  // Okay(f){ return this.Status(200, f); }
  // Created(f){ return this.Status(201, f); }
  // Accepted(f){ return this.Status(202, f); }
  // NonAuthoritativeInformation(f){ return this.Status(203, f); }
  // NoContent(f){ return this.Status(204, f); }
  // ResetContent(f){ return this.Status(205, f); }
  // PartialContent(f){ return this.Status(206, f); }
  // MultiStatus(f){ return this.Status(207, f); }
  // AlreadyReported(f){ return this.Status(208, f); }
  // ImUsed(f){ return this.Status(226, f); }
  //
  // // 300s, redirect
  // MultipleChoices(f){ return this.Status(300, f); }
  // MovedPermanently(f){ return this.Status(301, f); }
  // Found(f){ return this.Status(302, f); }
  // SeeOther(f){ return this.Status(303, f); }
  // NotModified(f){ return this.Status(304, f); }
  // UseProxy(f){ return this.Status(305, f); }
  // TemporaryRedirect(f){ return this.Status(307, f); }
  // PermanentRedirect(f){ return this.Status(308, f); }
  //
  // // 400s, client error
  // BadRequest(f){ return this.Status(400, f); }
  // Unauthorized(f){ return this.Status(401, f); }
  // PaymentRequired(f){ return this.Status(402, f); }
  // Forbidden(f){ return this.Status(403, f); }
  // NotFound(f){ return this.Status(404, f); }
  // MethodNotAllowed(f){ return this.Status(405, f); }
  // NotAcceptable(f){ return this.Status(406, f); }
  // ProxyAuthenticationRequired(f){ return this.Status(407, f); }
  // RequestTimeout(f){ return this.Status(408, f); }
  // Conflict(f){ return this.Status(409, f); }
  // Gone(f){ return this.Status(410, f); }
  // LengthRequired(f){ return this.Status(411, f); }
  // PreconditionFailed(f){ return this.Status(412, f); }
  // PayloadTooLarge(f){ return this.Status(413, f); }
  // RequestURITooLong(f){ return this.Status(414, f); }
  // UnsupportedMediaType(f){ return this.Status(415, f); }
  // RequestedRangeNotSatisfiable(f){ return this.Status(416, f); }
  // ExpectationFailed(f){ return this.Status(417, f); }
  // ImATeapot(f){ return this.Status(418, f); }
  // MisdirectedRequest(f){ return this.Status(421, f); }
  // UnprocessableEntity(f){ return this.Status(422, f); }
  // Locked(f){ return this.Status(423, f); }
  // FailedDependency(f){ return this.Status(424, f); }
  // UpgradeRequired(f){ return this.Status(426, f); }
  // PreconditionRequired(f){ return this.Status(428, f); }
  // TooManyRequests(f){ return this.Status(429, f); }
  // RequestHeaderFieldsTooLarge(f){ return this.Status(431, f); }
  // ConnectionClosedWithoutResponse(f){ return this.Status(444, f); }
  // UnavailableForLegalReasons(f){ return this.Status(451, f); }
  // ClientClosedRequest(f){ return this.Status(499, f); }
  //
  // // 500s, server error
  // InternalServerError(f){ return this.Status(500, f); }
  // NotImplemented(f){ return this.Status(501, f); }
  // BadGateway(f){ return this.Status(502, f); }
  // ServiceUnavailable(f){ return this.Status(503, f); }
  // GatewayTimeout(f){ return this.Status(504, f); }
  // HTTPVersionNotSupported(f){ return this.Status(505, f); }
  // VariantAlsoNegotiates(f){ return this.Status(506, f); }
  // InsufficientStorage(f){ return this.Status(507, f); }
  // LoopDetected(f){ return this.Status(508, f); }
  // NotExtended(f){ return this.Status(510, f); }
  // NetworkAuthenticationRequired(f){ return this.Status(511, f); }
  // NetworkConnectTimeoutError(f){ return this.Status(599, f); }
}

Response.default_code = 200;
Response.default_type = "json";
Response.default_value = {};

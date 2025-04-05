export class Request
{
  constructor(request)
  {
    this.url = new URL(`${request.protocol}://${request.get("host")}${request.originalUrl}`);
    // Hide the request property so it doesn't flood logging
    Object.defineProperty(this, "request", {
      enumerable: false,
      writable: true,
      value: request,
    });
  }

  GetRequest(){ return this.request; }
  GetBaseURL(){ return this.request.url; }
  GetBody(){ return this.request.body; }
  GetCookies(){ return this.request.cookies; }
  GetSignedCookies(){ return this.request.signedCookies; }
  GetCookie(name){ return this.request.cookies[name]; }
  GetSignedCookie(name){ return this.request.signedCookies[name]; }
  GetParameters(){ return this.request.params; }
  GetParameter(parameter){ return this.request.params[parameter]; }
  GetHeader(header){ return this.request.headers[header]; }
  GetIP(){ return this.request.connection.remoteAddress; }
}

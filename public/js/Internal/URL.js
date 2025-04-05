import {String} from "/js/String.js";
import {window} from "/js/Window.js";

export class URL extends global.URL
{
  static Encode(buffer, value)
  {
    String.Encode(buffer, value.href);
  }

  static Decode(buffer)
  {
    const href = String.Decode(buffer);
    return new globalThis.URL(href);
  }

  static Get    (url, base){ return new this(url, base).MethodGet(); }
  static Head   (url, base){ return new this(url, base).MethodHead(); }
  static Post   (url, base){ return new this(url, base).MethodPost(); }
  static Put    (url, base){ return new this(url, base).MethodPut(); }
  static Delete (url, base){ return new this(url, base).MethodDelete(); }
  static Trace  (url, base){ return new this(url, base).MethodTrace(); }
  static Options(url, base){ return new this(url, base).MethodOptions(); }
  static Connect(url, base){ return new this(url, base).MethodConnect(); }
  static Patch  (url, base){ return new this(url, base).MethodPatch(); }

  Method(method){ this.method = method; return this; }
  MethodGet    (){ return this.Method("GET"    ); }
  MethodHead   (){ return this.Method("HEAD"   ); }
  MethodPost   (){ return this.Method("POST"   ); }
  MethodPut    (){ return this.Method("PUT"    ); }
  MethodDelete (){ return this.Method("DELETE" ); }
  MethodTrace  (){ return this.Method("TRACE"  ); }
  MethodOptions(){ return this.Method("OPTIONS"); }
  MethodConnect(){ return this.Method("CONNECT"); }
  MethodPatch  (){ return this.Method("PATCH"  ); }

  Mode(mode){ this.mode = mode; return this; }
  ModeCors(){ return this.Mode("cors"); }
  ModeNoCors(){ return this.Mode("no-cors"); }
  ModeSameOrigin(){ return this.Mode("same-origin"); }

  Credentials(credentials){ this.credentials = credentials; return this; }
  CredentialsOmit(){ return this.Credentials("omit"); }
  CredentialsSameOrigin(){ return this.Credentials("same-origin"); }
  CredentialsInclude(){ return this.Credentials("include"); }

  Cache(cache){ this.cache = cache; return this; }
  CacheNoStore(){ return this.Cache("no-store"); }
  CacheReload(){ return this.Cache("reload"); }
  CacheNoCache(){ return this.Cache("no-cache"); }
  CacheForceCache(){ return this.Cache("force-cache"); }
  CacheOnlyIfCached(){ return this.Cache("only-if-cached"); }

  Redirect(redirect){ this.redirect = redirect; return this; }
  RedirectFollow(){ return this.Redirect("follow"); }
  RedirectError(){ return this.Redirect("error"); }
  RedirectManual(){ return this.Redirect("manual"); }
  GetRedirect(){ return this.redirect; }

  Referrer(referrer){ this.referrer = referrer; return this; }
  ReferrerPolicy(referrer_policy){ this.referrer_policy = referrer_policy; return this; }
  Integrity(integrity){ this.integrity = integrity; return this; }
  KeepAlive(keep_alive){ this.keep_alive = keep_alive; return this; }
  Signal(signal){ this.signal = signal; return this; }

  Headers(headers){ this.headers = headers; return this; }

  AddHeader(name, value)
  {
    this.headers ??= new window.Headers();
    this.headers.append(name, value);
    return this;
  }

  ContentType(value){ return this.AddHeader("Content-Type", value) }
  ContentTypeJSON(){ return this.ContentType("application/json") }

  Authorization(value){ return this.AddHeader("Authorization", value) }

  IsKnownBody(body)
  {
    return body instanceof window.Blob
        || body instanceof window.BufferSource
        || body instanceof window.FormData
        || body instanceof window.URLSearchParams
        || body instanceof window.USVString
        || body instanceof window.ReadableStream;
  }

  Body(body)
  {
    if (!this.IsKnownBody(body))
    {
      body = JSON.stringify(body);
    }

    this.body = body;
    return this;
  }

  Fetch()
  {
    return window.fetch(this, {
      method: this.method ?? "GET",
      headers: this.headers,
      body: this.body,
      mode: this.mode ?? "cors",
      credentials: this.credentials,
      cache: this.cache,
      redirect: this.redirect,
      referrer: this.referrer,
      referrerPolicy: this.referrer_policy,
      integrity: this.integrity,
      keepalive: this.keep_alive,
      signal: this.signal,
    })
    .then(response =>
    {
      if (!response.ok)
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    });
  }

  AsJSON(){ return this.Fetch().then(r => r.json()); }
  AsText(){ return this.Fetch().then(r => r.text()); }
  AsArrayBuffer(){ return this.Fetch().then(r => r.arrayBuffer()); }
  AsBlob(){ return this.Fetch().then(r => r.blob()); }

  // AsRedirect(){ return this.Fetch().then(r => r.redirect()); }
  // AsFormData(){ return this.Fetch().then(r => r.formData()); }
  // AsError(){ return this.Fetch().then(r => r.error()); }
  // AsClone(){ return this.Fetch().then(r => r.clone()); }
}

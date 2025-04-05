import {URL} from "/js/Tags/URL.js";

export class Fetch extends URL
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "fetch"; }

  Method(method){ return this.SetAttribute("method", method); }
  MethodGet    (){ return this.Method("GET"    ); }
  MethodHead   (){ return this.Method("HEAD"   ); }
  MethodPost   (){ return this.Method("POST"   ); }
  MethodPut    (){ return this.Method("PUT"    ); }
  MethodDelete (){ return this.Method("DELETE" ); }
  MethodTrace  (){ return this.Method("TRACE"  ); }
  MethodOptions(){ return this.Method("OPTIONS"); }
  MethodConnect(){ return this.Method("CONNECT"); }
  MethodPatch  (){ return this.Method("PATCH"  ); }

  Mode(mode){ return this.SetAttribute("mode", mode); }
  ModeCors(){ return this.Mode("cors"); }
  ModeNoCors(){ return this.Mode("no-cors"); }
  ModeSameOrigin(){ return this.Mode("same-origin"); }

  Credentials(credentials){ return this.SetAttribute("credentials", credentials); }
  CredentialsOmit(){ return this.Credentials("omit"); }
  CredentialsSameOrigin(){ return this.Credentials("same-origin"); }
  CredentialsInclude(){ return this.Credentials("include"); }

  Cache(cache){ return this.SetAttribute("cache", cache); }
  CacheNoStore(){ return this.Cache("no-store"); }
  CacheReload(){ return this.Cache("reload"); }
  CacheNoCache(){ return this.Cache("no-cache"); }
  CacheForceCache(){ return this.Cache("force-cache"); }
  CacheOnlyIfCached(){ return this.Cache("only-if-cached"); }

  Redirect(redirect){ return this.SetAttribute("redirect", redirect); }
  RedirectFollow(){ return this.Redirect("follow"); }
  RedirectError(){ return this.Redirect("error"); }
  RedirectManual(){ return this.Redirect("manual"); }
  GetRedirect(){ return this.GetAttribute("redirect"); }

  Referrer(referrer){ this.referrer = referrer; return this; }
  ReferrerPolicy(referrer_policy){ this.referrer_policy = referrer_policy; return this; }
  Integrity(integrity){ this.integrity = integrity; return this; }
  KeepAlive(keep_alive){ this.keep_alive = keep_alive; return this; }
  Signal(signal){ this.signal = signal; return this; }

  // Type(type){ this.type = type; return this; }
  AsArrayBuffer(){ return this.Fetch().then(r => r.arrayBuffer()); }
  AsBlob(){ return this.Fetch().then(r => r.blob()); }
  AsFormData(){ return this.Fetch().then(r => r.formData()); }
  AsJSON(){ return this.Fetch().then(r => r.json()); }
  AsText(){ return this.Fetch().then(r => r.text()); }

  // Perform a HTTP request to the URL
  // This can work on the server, because it has a window.fetch polyfill
  Fetch()
  {
    // console.warn("URL.Fetch isn't currently working");
    return window.fetch(this.href, {
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
}

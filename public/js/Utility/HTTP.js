import {IsServer, IsClient} from "/js/Utility/Environment.js";

export class URL extends window.URL
{
  constructor(url = window.location.href, base = window.location.origin)
  {
    super(url, base);
    this.ValidateProtocol();
  }

  IsTrustedProtocol(protocol = this.protocol)
  {
    switch (protocol)
    {
      case "http:":
      case "https:": return true;
      default: return false;
    }
  }

  ValidateProtocol()
  {
    if (IsClient() && this.IsTrustedProtocol() !== true)
    {
      this.href = window.location.origin + "/" + this.pathname;

      // Some browsers may not cooperate with the new href, so make absolutely sure
      // the protocol HAS been changed for real
      if (this.IsTrustedProtocol() !== true)
      {
        throw new Error(`"${this.protocol}" Failed to fix the protocol for url ${this.href}, from "${window.location.protocol}"`);
      }
    }

    return this;
  }

  HRef(value){ this.href = value; return this; }
  Hash(value){ this.hash = value; return this; }
  Origin(value){ this.origin = value; return this; }
  UserName(value){ this.username = value; return this; }
  Password(value){ this.password = value; return this; }
  Protocol(value){ this.protocol = value; return this; }
  HostName(value){ this.hostname = value; return this; }
  Host(value){ this.host = value; return this; }
  PathName(value){ this.pathname = value; return this; }
  Search(value){ this.search = value; return this; }
  SetParameter(name, value){ this.searchParams.set(name, value); return this; }
  AppendParameter(name, value){ this.searchParams.append(name, value); return this; }
  DeleteParameter(name){ this.searchParams.delete(name); return this; }

  Method(method){ this.method = method; return this; }
  Get    (){ return this.Method("GET"    ); }
  Head   (){ return this.Method("HEAD"   ); }
  Post   (){ return this.Method("POST"   ); }
  Put    (){ return this.Method("PUT"    ); }
  Delete (){ return this.Method("DELETE" ); }
  Trace  (){ return this.Method("TRACE"  ); }
  Options(){ return this.Method("OPTIONS"); }
  Connect(){ return this.Method("CONNECT"); }
  Patch  (){ return this.Method("PATCH"  ); }

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
  Fetch()
  {
    return window.fetch(this.href, {
      method: this.method || "GET",
      headers: this.headers || "GET",
      body: this.body,
      mode: this.mode || "cors",
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

  Find(tag = Tag.Constructor(Root))
  {
    const parts = this.pathname.replace(/^\/|\/$/g, "").split("/");
    console.log("Finding", this.href);

    const count = tag.GetChildrenCount();
    for (let i = 0; i < count; i++)
    {
      let child = tag.GetChild(i);
      if (!child)
      {
        continue;
      }
      else if (child instanceof Match)
      {
        const branch = new this.constructor(this.href);
        // branch.SetIndex(this.GetIndex());
        // branch.SetParts(this.GetParts());

        // const branch = this.Branch();

        if (child.Test(branch))
        {
          return branch.Find(child);
        }
      }
      else if (child instanceof Constructor)
      {
        // Check if there is another class that matches even lower down
        const better_match = this.Find(url, child);
        if (better_match)
        {
          child = better_match;
        }

        this.class = child;
        this.url = url;

        return child.New(); // Return the first Constructor we find
      }
      else if (child instanceof Redirect)
      {
        // TODO: Make sure redirects cannot go into a loop!

        // Copy the src to the redirect attribute to keep a record of it
        this.Redirect(this.GetAttribute("src"));

        const redirect = new URL(child.GetAttribute("src"));

        // Copy the new src to this url tag
        this.Src(redirect);

        return this.Find(redirect);
      }
    }
  }

  // Navigate to the URL in the browser
  Go()
  {
  }
}

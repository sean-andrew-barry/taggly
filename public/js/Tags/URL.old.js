import {Tag} from "/js/Tag.js";
import {URL as UtilityURL} from "/js/Utility/URL.js";
import {Constructor} from "/js/Tags/Constructor.js";
import {Match} from "/js/Tags/Match.js";
import {Redirect} from "/js/Tags/Redirect.js";
import {Page} from "/js/Tags/Page.js";
import {Title} from "/js/Tags/Title.js";
import {History} from "/js/Tags/History.js";
import {Home} from "/js/Tags/Page/Home.js";
import {Error404} from "/js/Tags/Page/Error404.js";
import {Environment} from "/js/Utility/Environment.js";
import {OnConnect} from "/js/Tags/Event/Events.js";

export class URL extends Tag
{
  constructor(href = window.location.href, base = window.location.origin)
  {
    super();
    this.url = new UtilityURL(href, base);

    // this.SetAttribute("protocol", this.GetProtocol());
    // this.SetAttribute("hostname", this.GetHostName());
    // this.SetAttribute("pathname", this.GetPathName());
    //
    // const search = this.GetSearch();
    // if (search) this.SetAttribute("search", search);
    //
    // const hash = this.GetHash();
    // if (hash) this.SetAttribute("hash", hash);

    // this.content = this.CreateContent().catch(e => this.Error(e));
  }

  Render()
  {
    if (Environment.IsClient())
    {
      const ctor = this.Root(0);
      this.Clear().Add(new ctor());
    }

    return this;
  }

  Render()
  {
    if (Environment.IsServer()) return this;

    const value = this.Root(0);

    switch (typeof(value))
    {
      case "string": // A string is treated as a redirect
      {
        const url = new this.constructor(value, this.GetOrigin());

        // Make sure it's a different url we are being redirected to
        if (url.GetHRef() !== this.GetHRef())
        {
          History.Get().Replace(url.GetHRef());

          return url.Render();
        }
        else
        {
          throw new Error(`Circular redirect at "${url.GetHRef()}"`);
        }
      }
      case "function":
      {
        this.Clear().Add(new value());
        return this;
      }
      default:
      {
        this.Clear().Add(value);
        return this;
      }
    }
  }

  Find(redirects = [], max_redirects = 10)
  {
    const value = this.Root(0);

    if (typeof(value) === "string")
    {
      const current_url = this.GetHRef();
      redirects.push(current_url);

      this.HRef(value);
      const new_url = this.GetHRef();

      if (redirects.length >= max_redirects)
      {
        throw new Error(`The maximum number of redirects (${max_redirects}) has been reached`);
      }

      // Make sure it's a different url we are being redirected to
      for (let i = 0; i < redirects.length; i++)
      {
        const redirect = redirects[i];
        if (redirect === new_url)
        {
          throw new Error(`Circular redirect at "${new_url}" from "${current_url}"`);
        }
      }

      return this.Find(redirects);
    }
    else
    {
      return value;
    }
  }

  Render(redirects = [])
  {
    if (Environment.IsServer()) return this;

    const value = this.Root(0);

    switch (typeof(value))
    {
      case "string": // A string is treated as a redirect
      {
        const current_url = this.GetHRef();
        redirects.push(current_url);

        this.HRef(value);
        const new_url = this.GetHRef();

        // Make sure it's a different url we are being redirected to
        for (let i = 0; i < redirects.length; i++)
        {
          const redirect = redirects[i];
          if (redirect === new_url)
          {
            throw new Error(`Circular redirect at "${new_url}" from "${current_url}"`);
          }
        }

        History.Get().Replace(new_url);
        return this.Render(redirects);
      }
      case "function":
      {
        this.Clear().Add(new value());
        return this;
      }
      default:
      {
        this.Clear().Add(value);
        return this;
      }
    }
  }

  Render()
  {
    if (Environment.IsClient())
    {
      const value = this.Find();
      this.Clear().Add(value);

      History.Get().Replace(this.GetHRef());
    }

    return this;
  }

  String(index, name, min, max)
  {
    const string = this.Part(index);

    if (string.length === 0) return;
    if ((min !== undefined) && (min > string.length)) return;
    if ((max !== undefined) && (max < string.length)) return;

    this.SetValue(this.GetClass(0), string);
    // this.SetParameter(this.GetClass(0), string);

    return name;
  }

  Number(index, name, min, max)
  {
    const number = Number(this.Part(index));

    if (typeof(number) !== "number") return;
    if ((min !== undefined) && (min > number)) return;
    if ((max !== undefined) && (max < number)) return;

    this.SetValue(this.GetClass(0), number);
    // this.SetParameter(this.GetClass(0), number);

    return name;
  }

  Boolean(index, name)
  {
    const string = this.Part(index);

    let bool;
    if      (string === "true"  || string === "1") bool = true;
    else if (string === "false" || string === "0") bool = false;
    else return;

    this.SetValue(this.GetClass(0), bool);

    return name;
  }

  RegExp(string, url)
  {
    throw new Error(`Not implemented`);
  }

  ObjectID(index, name)
  {
    // Example ObjectID: 5ee2dc52a0e5b585a0256457

    try
    {
      const string = this.Part(index);
      const id = new ObjectID(string);
      this.SetValue(this.GetClass(0), id);

      return name;
    }
    catch (error)
    {
      return;
    }
  }

  Part(index)
  {
    const parts = this.GetParts();

    if (parts[index])
    {
      this.SetValue(parts[index], index);
    }

    return parts[index];
  }

  Root(i = 0)
  {
    switch (this.Part(i))
    {
      case "": return Home;
      default: return Error404;
    }
  }

  // async Wait()
  // {
  //   await this.content;
  //   return this;
  // }
  //
  // async CreateContent()
  // {
  //   await super.Wait();
  //
  //   if (Environment.IsServer() && !this.HasAttribute("server")) return undefined;
  //
  //   const tag = this.Root(0);
  //   if (!tag) throw new Error(`Failed to find a tag from url "${this.url.href}"`);
  //
  //   this.UpdateContent(tag);
  //   // this.UpdateHistory(tag);
  //   // this.UpdateTitle(tag);
  //
  //   return tag;
  // }
  //
  // UpdateContent(tag)
  // {
  //   if (tag instanceof Page)
  //   {
  //     tag.SetParentUrl(this);
  //   }
  //
  //   this.Add(tag);
  // }

  // UpdateTitle(tag)
  // {
  //   if (tag instanceof Page && this.IsVisible())
  //   {
  //     tag.UpdateTitle();
  //   }
  // }
  //
  // UpdateHistory(tag)
  // {
  //   if (tag instanceof Page && this.IsVisible())
  //   {
  //     tag.UpdateTitle();
  //   }
  // }

  // Navigate to the URL in the browser
  Go(...args)
  {
    const new_url = new this.constructor(...args).Render();

    if (this.IsInDocument())
    {
      this.Replace(new_url);
    }
    else
    {
      const body = Tag.Body();
      const first_url = body.Query("url");
      if (first_url)
      {
        first_url.Replace(new_url);
      }
      else
      {
        Tag.Body().AppendChild(new_url);
      }
    }

    History.Get().Push(new_url.GetHRef());

    return new_url.Wait();
  }

  Preview(v){ return this.ToggleClass("preview", v); }
  IsPreview(){ return this.HasClass("preview"); }

  GetHRef(){ return this.url.href; }
  GetHash(){ return this.url.hash; }
  GetOrigin(){ return this.url.origin; }
  GetPassword(){ return this.url.password; }
  GetUserName(){ return this.url.username; }
  GetProtocol(){ return this.url.protocol; }
  GetHostName(){ return this.url.hostname; }
  GetHost(){ return this.url.host; }
  GetPathName(){ return this.url.pathname; }
  GetSearch(){ return this.url.search; }
  GetParameters(){ return this.url.searchParams; }

  SetParts(parts = this.url.pathname.replace(/^\/|\/$/g, "").split("/")){ return this.parts = parts; }
  GetParts(){ return this.parts || this.SetParts(); }

  HRef(value){ this.url.href = value; return this; }
  Hash(value){ this.url.hash = value; return this; }
  Origin(value){ this.url.origin = value; return this; }
  UserName(value){ this.url.username = value; return this; }
  Password(value){ this.url.password = value; return this; }
  Protocol(value){ this.url.protocol = value; return this; }
  HostName(value){ this.url.hostname = value; return this; }
  Host(value){ this.url.host = value; return this; }
  PathName(value){ this.url.pathname = value; return this; }
  Search(value){ this.url.search = value; return this; }
  Parameter(name, value){ return this.SetParameter(name, value); }

  SetParameter(name, value)
  {
    this.url.searchParams.append(name, value);
    return this;
  }

  SetEncodedParameter(name, value)
  {
    this.url.searchParams.append(name, window.encodeURIComponent(value));
    return this;
  }

  GetParameter(name)
  {
    return this.url.searchParams.get(name);
  }

  HasParameter(name)
  {
    return this.url.searchParams.has(name);
  }

  GetDecodedParameter(name)
  {
    const value = this.GetParameter(name);

    if (!value) return value;
    else return window.decodeURIComponent(value);
  }

  // SetValue(name, value){ return this.url.SetValue(name, value); }
  GetValue(name, required){ return this.url.GetValue(name, required); }

  SetValue(name, value)
  {
    this.SetAttribute(name, value);
    return this.url.SetValue(name, value);
  }

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

  toString(){ return this.url.href; }
}

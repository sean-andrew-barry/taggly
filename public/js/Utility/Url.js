import {window} from "/js/Window.js";
import {Environment} from "/js/Utility/Environment.js";

export class URL extends globalThis.URL
{
  constructor(url, base = window.location.origin)
  {
    if (url instanceof URL)
    {
      return url;
    }

    super(url, base);

    // this.parts = this.pathname.replace(/^\/|\/$/g, "").split("/");
    // this.parameters = {};
    this.ValidateProtocol();
  }

  set href(value)
  {
    super.href = value;
    console.log("Setting url href and validating it", value);
    this.ValidateProtocol();
  }

  set origin(value)
  {
    super.origin = value;
    console.log("Setting url origin and validating it");
    this.ValidateProtocol();
  }

  set protocol(value)
  {
    super.protocol = value;
    console.log("Setting url protocol and validating it");
    this.ValidateProtocol();
  }

  set hostname(value)
  {
    super.hostname = value;
    console.log("Setting url hostname and validating it");
    this.ValidateProtocol();
  }

  set pathname(value)
  {
    super.pathname = value;
    console.log("Setting url pathname and validating it");
    this.ValidateProtocol();
  }

  get href(){ return super.href; }
  get origin(){ return super.origin; }
  get protocol(){ return super.protocol; }
  get hostname(){ return super.hostname; }
  get pathname(){ return super.pathname; }

  IsTrustedProtocol(protocol)
  {
    switch (protocol)
    {
      case "http:": return true;
      case "https:": return true;
      default: return false;
    }
  }

  ValidateProtocol()
  {
    if (Environment.IsServer()) return;

    if (this.IsTrustedProtocol(this.protocol) !== true)
    {
      this.href = window.location.origin + "/" + this.pathname;

      // Some browsers may not cooperate with the new href, so make absolutely sure
      // the protocol HAS been changed for real
      if (this.IsTrustedProtocol(this.protocol) !== true)
      {
        throw new Error(`"${this.protocol}" Failed to fix the protocol for url ${this.href}, from "${window.location.protocol}"`);
      }
    }
  }

  GetUrl(){ return this.href; }
  GetHRef(){ return this.href; }
  GetEncodedUrl(){ return window.encodeURIComponent(this.href); }
  GetEncodedHRef(){ return window.encodeURIComponent(this.href); }
  GetSlice(index){ return this.GetParts().slice(index); }

  GetParts(){ return this.parts || this.SetParts(); }
  SetParts(parts = this.pathname.replace(/^\/|\/$/g, "").split("/")){ return this.parts = parts; }
  GetPart(index){ return this.GetParts()[index] || ""; }

  GetHRef(){ return this.href; }
  GetHash(){ return this.hash; }
  GetOrigin(){ return this.origin; }
  GetPassword(){ return this.password; }
  GetUserName(){ return this.username; }
  GetProtocol(){ return this.protocol; }
  GetHostName(){ return this.hostname; }
  GetHost(){ return this.host; }
  GetPathName(){ return this.pathname; }
  GetSearch(){ return this.search; }
  GetParameters(){ return this.searchParams; }

  IsAtEnd(){ return this.GetIndex() >= this.GetParts().length; }

  GetParameter(name, required = false)
  {
    if (this.searchParams.has(name))
    {
      return this.searchParams.get(name);
    }
    else if (required === true)
    {
      throw new Error(`Failed to find a parameter named "${name}"`);
    }
  }

  SetParameter(name, value, path = false)
  {
    this.searchParams.set(name, value);
    return this;
  }
}

// export const PROTOCOL_WHITELIST = {
//   // "about:": true,
//   // "blob:": true,
//   // "callto:": true,
//   // "chrome:": true,
//   // "example:": true,
//   // "facetime:": true,
//   // "fax:": true,
//   // "file:": true,
//   // "filesystem:": true,
//   // "ftp:": true,
//   // "geo:": true,
//   // "git:": true,
//   "http:": true,
//   "https:": true,
//   // "irc:": true,
//   // "mailto:": true,
//   // "maps:": true,
//   // "market:": true,
//   // "message:": true,
//   // "news:": true,
//   // "notes:": true,
//   // "resource:": true,
//   // "sms:": true,
//   // "ssh:": true,
//   // "tel:": true,
//   // "udp:": true,
//   // "ws:": true,
//   // "wss:": true,
// };

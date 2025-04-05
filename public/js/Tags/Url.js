import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";
import {Document} from "/js/Tags/Document.js";
import {Environment} from "/js/Environment.js";
import {Connect} from "/js/Event/Connect.js";
import {Home} from "/js/Tags/Page/Home.js";
// import {Welcome} from "/js/Tags/Page/Welcome.js";
import {Error404} from "/js/Tags/Page/Error404.js";
import {Session} from "/js/Tags/Storage/Session.js";

// import * as Tags from "/js/Tags.js";

import {Docs} from "/js/Tags/Page/Docs.js";
import {Introduction} from "/js/Tags/Page/Docs/Introduction.js";
import {TheFileSystem} from "/js/Tags/Page/Docs/TheFileSystem.js";
import {CreatingYourOwnFiles} from "/js/Tags/Page/Docs/CreatingYourOwnFiles.js";
import {UsingTags} from "/js/Tags/Page/Docs/UsingTags.js";
import {UsingEvents} from "/js/Tags/Page/Docs/UsingEvents.js";

const GlobalURL = globalThis.URL;

export class URL extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "url"; }

  constructor(url, base)
  {
    super();

    if (url !== undefined)
    {
      this.Value(url, base);
    }
  }

  Dynamic(value){ return this.ToggleAttribute("dynamic", value); }

  Value(value, base = window.location?.origin)
  {
    if (typeof(value) === "string")
    {
      value = new GlobalURL(value, base);
    }

    if (!(value instanceof GlobalURL))
    {
      throw new Error(`URL tag expected its value to be a URL object`);
    }

    const result = super.Value(value);

    this.Protocol(value.protocol);
    this.Hostname(value.hostname);
    this.Port(value.port);
    this.Pathname(value.pathname);
    this.Hash(value.hash);

    const parameters = value.searchParams;
    for (const {key, value} of parameters)
    {
      this.SetAttribute(key, value);
    }

    return result;
  }

  async UpdateTitle(page, value)
  {
    const title = page.constructor.GetTitle();
    const site_name = page.constructor.GetSiteName();

    const doc = this.GetDocument();
    const history = doc.GetHistoryObserver();
    // console.warn("Not handling history and title...");
    history.Push(value);
    doc.Title(title, site_name); // This must happen AFTER the history push
  }

  async FindPageClass(index = 0)
  {
    return await this.Root(index) ?? Error404;
  }

  async RenderPageClass(page_class)
  {
    page_class = await page_class;
    const tag = await new page_class();
    this.ReplaceChildren(tag);

    const ancestor = this.QueryAncestor("url");
    if (!ancestor)
    {
      const value = this.GetValue();

      this.UpdateTitle(tag, value).catch(error => this.Throw(error));
    }

    return tag;
  }

  async [Connect](event)
  {
    if (this.IsDisabled()) return;
    if (Environment.IsServer()) return;

    try
    {
      const start = performance.now();

      const page_class = await this.FindPageClass(0);
      if (!page_class) throw new Error(`URL tag failed to find a page class`);

      await this.RenderPageClass(page_class);

      const end = performance.now();

      if (Environment.IsDevelopment())
      {
        console.log("Rendered page after", Math.round(end - start), "ms");
      }
    }
    catch (error)
    {
      console.error("CAUGHT ERROR", error);
    }
  }

  async OnBeforeUnload(event)
  {
    const session = await Session.Get();
    session.Set("scroll_state", "a.button.is-primary");
  }

  Navigate(url)
  {
    const replacement = new this.constructor(url);
    this.ReplaceWith(replacement);

    // TODO: History.Push(url);
    return replacement;
  }

  // QUESTION: Should the history update right away? I think probably no
  Redirect(url)
  {
    // Make a new URL
    const replacement = new this.constructor(url);

    if (this.IsConnected())
    {
      this.Replace(replacement);
    }
    else
    {
      return replacement.Root(0);
    }
  }

  GetString(index, name, min, max)
  {
    const string = this.GetPart(index);

    if (string.length === 0) return;
    if ((min !== undefined) && (min > string.length)) return;
    if ((max !== undefined) && (max < string.length)) return;

    this.SetPart(index, string);

    return name;
  }

  GetNumber(index, name, min, max)
  {
    const number = globalThis.Number(this.GetPart(index));

    if (typeof(number) !== "number") return;
    if (number === NaN) return;
    if ((min !== undefined) && (min > number)) return;
    if ((max !== undefined) && (max < number)) return;

    this.SetPart(index, number);

    return name;
  }

  GetBoolean(index, name)
  {
    const string = this.GetPart(index);

    let bool;
    if      (string === "true"  || string === "1") bool = true;
    else if (string === "false" || string === "0") bool = false;
    else return;

    this.SetPart(index, bool);

    return name;
  }

  GetRegExp(index, name)
  {
    throw new Error(`Not implemented`);
  }

  GetObjectID(index, name)
  {
    // Example ObjectID: 5ee2dc52a0e5b585a0256457

    try
    {
      const string = this.GetPart(index);
      const id = new ObjectID(string);
      this.SetPart(index, id);

      return name;
    }
    catch (error)
    {
      return;
    }
  }

  Test(index, regexp)
  {
    const part = this.GetPart(index);
    const result = regexp.exec(part);

    if (result)
    {
      this.SetPart(index, result[0]);

      if (result.groups)
      {
        for (const key of Object.keys(result.groups))
        {
          this.SetPart(index, result.groups[key]);
        }
      }
    }
  }

  RootDocs(i)
  {
    const part = this.GetPart(i);

    if (/introduction/i.test(part)) return Introduction;
    if (/the[-_]*file[-_]*system/i.test(part)) return TheFileSystem;
    if (/creating[-_]*your[-_]*own[-_]*files/i.test(part)) return CreatingYourOwnFiles;
    if (/using[-_]*tags/i.test(part)) return UsingTags;
    if (/using[-_]*events/i.test(part)) return UsingEvents;

    return Docs;
  }

  _RootDocs(i)
  {
    switch (this.GetPart(i))
    {
      case "introduction": return Introduction;
      case "the-file-system": return TheFileSystem;
      case "creating-your-own-files": return CreatingYourOwnFiles;
      case "using-tags": return UsingTags;
      case "using-events": return UsingEvents;
      default: return Docs;
    }
  }

  RootTag(i)
  {
    const part = this.GetPart(i);
    return Tags[part] ?? Tags[part.toUpperCase()] ?? Tags[part.toLowerCase()];
  }

  Root(i = 0)
  {
    switch (this.GetPart(i))
    {
      case "": return Home;
      // case "": return this.Redirect("/docs/introduction");
      case "docs": return this.RootDocs(i + 1);
      case "tag": return this.RootTag(i + 1);
      default:
      {
        if (this.Match(i, /tag/i)) return this.RootTag(i + 1);

        return Error404;
      }
    }
  }

  Root(i = 0)
  {
    switch (this.GetPart(i))
    {
      case "": return Home;
      // case "": return this.Redirect("/docs/introduction");
      case "docs": return this.RootDocs(i + 1);
      // default: return Error404;
    }
  }

  Preview(v){ return this.ToggleClass("preview", v); }
  IsPreview(){ return this.HasClass("preview"); }

  GetHRef(){ return this.GetValue().href; }
  GetHash(){ return this.GetValue().hash; }
  GetOrigin(){ return this.GetValue().origin; }
  GetPassword(){ return this.GetValue().password; }
  GetUsername(){ return this.GetValue().username; }
  GetProtocol(){ return this.GetValue().protocol; }
  GetHostname(){ return this.GetValue().hostname; }
  GetHost(){ return this.GetValue().host; }
  GetPathname(){ return this.GetValue().pathname; }
  GetSearch(){ return this.GetValue().search; }
  GetParameters(){ return this.GetValue().searchParams; }

  SetHRef(v){ this.GetValue().href = v; return this; }
  SetHash(v){ this.GetValue().hash = v; return this; }
  SetOrigin(v){ this.GetValue().origin = v; return this; }
  SetPassword(v){ this.GetValue().password = v; return this; }
  SetUsername(v){ this.GetValue().username = v; return this; }
  SetProtocol(v){ this.GetValue().protocol = v; return this; }
  SetHostname(v){ this.GetValue().hostname = v; return this; }
  SetHost(v){ this.GetValue().host = v; return this; }
  SetPathname(v){ this.GetValue().pathname = v; return this; }
  SetSearch(v){ this.GetValue().search = v; return this; }
  SetParameters(v){ this.GetValue().searchParams = v; return this; }

  SetParameter(name, value){ return this.GetValue().searchParams.set(name, value); }
  GetParameter(name){ return this.GetValue().searchParams.get(name); }
  HasParameter(name){ return this.GetValue().searchParams.has(name); }

  SetEncodedParameter(name, value){ return this.SetParameter(name, this.Encode(value)); }
  GetDecodedParameter(name){ return this.Decode(this.GetParameter(name)); }

  SetProtocol(protocol){ return this.SetAttribute("protocol", protocol); }
  HasProtocol(){ return this.HasAttribute("protocol"); }
  GetProtocol(){ return this.GetAttribute("protocol"); }
  Protocol(protocol){ return this.SetProtocol(protocol); }

  SetHostname(hostname){ return this.SetAttribute("hostname", hostname); }
  HasHostname(){ return this.HasAttribute("hostname"); }
  GetHostname(){ return this.GetAttribute("hostname"); }
  Hostname(hostname){ return this.SetHostname(hostname); }

  SetPort(port){ return this.SetAttribute("port", port); }
  HasPort(){ return this.HasAttribute("port"); }
  GetPort(){ return this.GetAttribute("port"); }
  Port(port){ return this.SetPort(port); }

  SetHash(hash){ return this.SetAttribute("hash", hash); }
  HasHash(){ return this.HasAttribute("hash"); }
  GetHash(){ return this.GetAttribute("hash"); }
  Hash(hash){ return this.SetHash(hash); }

  Pathname(pathname)
  {
    const parts = pathname.replace(/^\/|\/$/g, "").split("/");
    return this.SetAttribute("pathname", parts, pathname); // Store it as an array but display as string
  }

  GetPathname(){ return this.GetAttributeString("pathname"); } // Get the actual display pathname

  GetParts()
  {
    const parts = this.GetAttribute("pathname");

    if (!(parts instanceof globalThis.Array))
    {
      throw new Error(`Cannot get URL parts`);
    }

    return parts;
  }

  GetPart(index)
  {
    const parts = this.GetParts();
    return parts[index];
  }

  SetPart(index, value)
  {
    const parts = this.GetParts();
    parts[index] = value;

    return this;
  }

  Encode(string){ return globalThis.encodeURIComponent(string); }
  Decode(string){ return globalThis.decodeURIComponent(string); }

  toString(){ return this.GetValue().toString(); }
}

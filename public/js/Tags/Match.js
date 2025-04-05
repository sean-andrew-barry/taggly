import {Tag} from "/js/Tag.js";
import {ObjectID} from "/js/Utility/Database/ObjectID.js";

export class Match extends Tag
{
  Type(type){ return this.SetAttribute("type", type); }
  Protocol(){ return this.Type("protocol"); }
  Domain(){ return this.Type("domain"); }
  String(){ return this.Type("string"); }
  Number(){ return this.Type("number"); }
  Boolean(){ return this.Type("boolean"); }
  RegExp(){ return this.Type("regexp"); }
  ObjectID(){ return this.Type("object_id"); }
  Max(v){ return this.SetAttributeNumber("max", v); }
  Min(v){ return this.SetAttributeNumber("min", v); }
  Optional(v){ return this.SetAttribute("optional", v); }

  // MatchProtocol(string, url)
  // {
  //   // console.log("Matching string", string);
  //
  //   if (string.length === 0) return false;
  //
  //   if (this.HasAttribute("min") && Number(this.GetAttribute("min")) > string.length) return false;
  //   if (this.HasAttribute("max") && Number(this.GetAttribute("max")) < string.length) return false;
  //
  //   url.SetValue(this.GetClass(0), string);
  //   url.Next();
  //
  //   // console.log("Match successful");
  //
  //   return true;
  // }

  MatchString(string, url)
  {
    // console.log("Matching string", string);

    if (string.length === 0) return false;

    if (this.HasAttribute("min") && Number(this.GetAttribute("min")) > string.length) return false;
    if (this.HasAttribute("max") && Number(this.GetAttribute("max")) < string.length) return false;

    url.SetValue(this.GetClass(0), string);
    url.Next();

    // console.log("Match successful");

    return true;
  }

  MatchNumber(string, url)
  {
    const number = Number(string);
    if (typeof(number) !== "number") return false;

    if (this.HasAttribute("min") && this.GetAttributeNumber("min") > number) return false;
    if (this.HasAttribute("max") && this.GetAttributeNumber("max") < number) return false;

    url.SetValue(this.GetClass(0), number);

    return true;
  }

  MatchBoolean(string, url)
  {
    let bool;
    if      (string === "true"  || string === "1") bool = true;
    else if (string === "false" || string === "0") bool = false;
    else return false;

    url.SetValue(this.GetClass(0), bool);

    return true;
  }

  MatchRegExp(string, url)
  {
    throw new Error(`Not implemented`);
  }

  MatchObjectID(string, url)
  {
    // Example ObjectID: 5ee2dc52a0e5b585a0256457

    try
    {
      const id = new ObjectID(string);
      url.SetValue(this.GetClass(0), string);
      url.Next();

      return true;
    }
    catch (error)
    {
      return false;
    }
  }

  MatchDefault(string, url)
  {
    if (this.HasClass(string))
    {
      url.Next();
      return true;
    }
    else if (this.GetClass(0) === null && string === "")
    {
      url.Next();
      return true;
    }
    else if (this.GetAttribute("id") === string)
    {
      url.Next();
      return true;
    }

    return false;
  }

  OnMatch(fn, opts){ return this.AddEventListener("OnMatch", fn, opts); }
  OnFail(fn, opts){ return this.AddEventListener("OnFail", fn, opts); }
  OnSkip(fn, opts){ return this.AddEventListener("OnSkip", fn, opts); }

  Match(url)
  {
    const optional = this.HasAttribute("optional");
    const string = url.GetPart();

    switch (this.GetAttribute("type"))
    {
      case "protocol": return this.MatchDefault(string, url) || optional;
      case "domain": return this.MatchDefault(string, url) || optional;
      case "string": return this.MatchString(string, url) || optional;
      case "number": return this.MatchNumber(string, url) || optional;
      case "boolean": return this.MatchBoolean(string, url) || optional;
      case "regexp": return this.MatchRegExp(string, url) || optional;
      case "object_id": return this.MatchObjectID(string, url) || optional;
      default: return this.MatchDefault(string, url) || optional;
    }
  }

  Match(url)
  {
    const string = url.GetPart();

    switch (this.GetAttribute("type"))
    {
      case "protocol": return this.MatchDefault(string, url);
      case "domain": return this.MatchDefault(string, url);
      case "string": return this.MatchString(string, url);
      case "number": return this.MatchNumber(string, url);
      case "boolean": return this.MatchBoolean(string, url);
      case "regexp": return this.MatchRegExp(string, url);
      case "object_id": return this.MatchObjectID(string, url);
      default: return this.MatchDefault(string, url);
    }
  }

  Test(url)
  {
    if (this.Match(url))
    {
      this.FireEvent("OnMatch", url);
      return true;
    }
    else if (this.HasAttribute("optional"))
    {
      this.FireEvent("OnSkip", url);
      return true;
    }
    else
    {
      this.FireEvent("OnFail", url);
      return false;
    }
  }
}

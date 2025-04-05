import {Tag} from "/js/Tag.js";
import {Sanitize} from "/js/Tag/Sanitize.js";

export class Object extends Tag
{
  static GetLocalName(){ return "object"; }
  static GetMetaURL(){ return import.meta.url; }

  // The data attribute can be used in XSS attacks,
  // so ignore it if this node isn't trusted
  // Here's an example of one such attack:
  // <object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGVsbG8iKTs8L3NjcmlwdD4="></object>
  Data(v)
  {
    if (!this.IsTrusted()) return this;
    else return this.SetAttribute("data", v);
  }

  // Data(v){ return this.SetAttribute("data", v); }

  Apply(action, args)
  {
    switch (action)
    {
      case "data": return this.Data(...args);
      default: super.Apply(action, args);
    }
  }
}

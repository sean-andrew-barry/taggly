import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Title extends Singleton
{
  static GetLocalName(){ return "title"; }
  static GetMetaURL(){ return import.meta.url; }

  SetNode(){ return super.SetNode(window.document.querySelector("title")); }

  Base(base)
  {
    return this.SetAttribute("base", base);
  }

  GetBase(){ return this.GetAttribute("base"); }

  Text(text, base = this.GetBase())
  {
    if (base)
    {
      return super.Text(`${text} - ${base}`);
    }
    else
    {
      return super.Text(`${text}`);
    }
  }
}

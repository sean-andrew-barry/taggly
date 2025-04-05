import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";

export class HTML extends Tag
{
  static GetLocalName(){ return "html"; }
  static GetMetaURL(){ return import.meta.url; }
  static Get(){ return this.GetDocument().GetHTML(); }

  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }

  Log(...args)
  {
    console.log.apply(console, args);
  }

  Warn(...args)
  {
    console.warn.apply(console, args);
  }

  Error(...args)
  {
    console.error.apply(console, args);
  }

  Debug(...args)
  {
    if (Environment.IsDevelopment())
    {
      console.log.apply(console, args);
    }
  }
}

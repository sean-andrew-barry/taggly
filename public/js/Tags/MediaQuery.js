import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {Style} from "/js/Tags/Style.js";
import {Connect} from "/js/Event/Connect.js";

export class MediaQuery extends Tag
{
  static GetLocalName(){ return "media-query"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(query)
  {
    super().Query(query);
  }

  GetRule(){ return this.rule; }

  CreateRule(text, index)
  {
    const rule = this.GetRule();
    index = rule.insertRule(text, index ?? rule.cssRules.length);
    return rule.cssRules[index];
  }

  CreateCSS(selector = "*", css = ""){ return this.CreateRule(`${selector} {${css}}`); }

  // [Connect](event)
  // {
  //   if (Environment.IsServer()) return;
  //
  //   const parent = this.GetParent();
  //   if (parent instanceof Style)
  //   {
  //     this.rule ??= parent.CreateMedia(this.GetAttribute("query"));
  //     console.log(this.rule);
  //   }
  // }

  Query(query){ return this.SetAttribute("query", query); }
  Mobile(){ return this.Query("(max-width: 768px)"); }
  NotMobile(){ return this.Query("(min-width: 768px)"); }
  Tablet(){ return this.Query("(min-width: 769px) and (max-width: 1023px)"); }
  NotTablet(){ return this.Query("(max-width: 769px), (min-width: 1023px)"); }
  Desktop(){ return this.Query("(min-width: 1024px) and (max-width: 1215px)"); }
  NotDesktop(){ return this.Query("(max-width: 1024px), (min-width: 1215px)"); }
  Widescreen(){ return this.Query("(min-width: 1216px) and (max-width: 1407px)"); }
  NotWidescreen(){ return this.Query("(max-width: 1216px), (min-width: 1407px)"); }
  FullHD(){ return this.Query("(min-width: 1408px)"); }
  ReducedMotion(){ return this.Query("(prefers-reduced-motion)"); }

  Apply(action, args)
  {
    switch (action)
    {
      case "query": return this.Query(...args);
      default: return super.Apply(action, args);
    }
  }

  GetSelector()
  {
    const parent = this.GetParent();
    if (parent) return parent.GetSelector();
    else return "";
  }

  GetSelectorName(){ return ""; }

  GetStylesText(indent = "")
  {
    let text = `@media ${this.GetAttribute("query")} {\n`;

    let child = this.GetFirstChild();
    while (child)
    {
      text += child.GetStylesText(indent + "  ");
      this.RemoveChild(child);

      child = this.GetFirstChild();

      if (child)
      {
        text += "\n";
      }
    }

    text += "\n}";

    return text;
  }
}

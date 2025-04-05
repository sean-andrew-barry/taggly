import {Tag} from "/js/Tag.js";
import {CSS} from "/js/Tags/CSS.js";
import {Text} from "/js/Tags/Text.js";
import {Style} from "/js/Tags/Style.js";
import {Environment} from "/js/Environment.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";

export class MediaQuery extends CSS
{
  static GetLocalName(){ return "mediaquery"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(query)
  {
    super();

    if (query)
    {
      this.Query(query);
    }
  }

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

  CreateSelector(){ return `@media ${this.GetAttribute("query")}`; }

  CreateStyleText(indent = "")
  {
    const selector = this.GetSelector();

    let css = `${selector} {\n`;

    for (const child of this)
    {
      if (child instanceof CSS)
      {
        // Use Create instead of Get so we bypass any cached text and get proper indentation
        css += child.CreateStyleText(indent + "  ") + "\n";
      }
    }

    css += "\n}".trim();

    return css;
  }
}

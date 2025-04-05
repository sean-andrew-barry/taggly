import {Tag} from "/js/Tag.js";
import {CSS} from "/js/Tags/CSS.js";
import {Text} from "/js/Tags/Text.js";
import {Style} from "/js/Tags/Style.js";
import {Environment} from "/js/Environment.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";

export class KeyFrames extends CSS
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "keyframes"; }

  constructor(name)
  {
    super();

    if (name)
    {
      this.Name(name);
    }
  }

  CreateSelector()
  {
    return `@keyframes ${this.GetAttribute("name")}`;
  }

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

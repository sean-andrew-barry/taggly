import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {Style} from "/js/Tags/Style.js";
import {Connect} from "/js/Event/Connect.js";

export class KeyFrames extends Tag
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

  GetRule(){ return this.rule; }

  CreateRule(text)
  {
    const rule = this.GetRule();
    rule.appendRule(text);
    return rule.cssRules[rule.cssRules.length - 1];
  }

  CreateCSS(selector = "*", css = ""){ return this.CreateRule(`${selector} {${css}}`); }

  // [Connect](event)
  // {
  //   if (Environment.IsServer()) return;
  //
  //   const parent = this.GetParent();
  //   if (parent instanceof Style)
  //   {
  //     this.rule ??= parent.CreateKeyframes(this.GetAttribute("name"));
  //     console.log(this.rule);
  //   }
  //
  //   // const style = this.QueryAncestor("style");
  //   // if (style)
  //   // {
  //   //   this[RULE] ??= style.CreateCSS(
  //   //     this.GetSelector(),
  //   //     this.GetStylesText(),
  //   //   );
  //   // }
  // }

  GetSelector()
  {
    const parent = this.GetParent();
    if (parent) return parent.GetSelector();
    else return "";
  }

  GetSelectorName(){ return ""; }

  GetStylesText(indent = "")
  {
    let text = `@keyframes ${this.GetName()} {\n`;

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

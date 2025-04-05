import {Tag} from "/js/Tag.js";
import {Head} from "/js/Tags/Head.js";
import {Environment} from "/js/Environment.js";
// import {String} from "/js/Tags/String.js";
// import {Text} from "/js/Tags/Text.js";
import {Text} from "/js/Tags/Text.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";
import {StringUtilities} from "/js/Utility/String.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";

const SELECTOR = Tag.GetSelectorSymbol();

let global_style;
export class Style extends Tag
{
  static GetGlobalStyle()
  {
    global_style ??= new this().ID("taggly_global_style").Inject("head");

    return global_style;
  }

  static Get(){ return this.GetGlobalStyle(); }

  static GetLocalName(){ return "style"; }
  static GetMetaURL(){ return import.meta.url; }
  static Media(...args){ return new this().Media(...args); }

  // constructor(...args)
  // {
  //   super(...args);
  //
  //   if (Environment.IsClient())
  //   {
  //     this.Wait().then(() =>
  //     {
  //       // Optionally lazy load the CSS
  //       if (this.HasAttribute("lazy"))
  //       {
  //         PromiseUtilities.AddBackgroundTask(this.Load.bind(this));
  //       }
  //       else
  //       {
  //         this.Load();
  //       }
  //     });
  //   }
  // }

  #rules = new Map();

  Media(media){ return this.SetAttribute("media", media); }
  Mobile(){ return this.Media("(max-width: 768px)"); }
  NotMobile(){ return this.Media("(min-width: 768px)"); }
  Tablet(){ return this.Media("(min-width: 769px) and (max-width: 1023px)"); }
  NotTablet(){ return this.Media("(max-width: 769px), (min-width: 1023px)"); }
  Desktop(){ return this.Media("(min-width: 1024px) and (max-width: 1215px)"); }
  NotDesktop(){ return this.Media("(max-width: 1024px), (min-width: 1215px)"); }
  Widescreen(){ return this.Media("(min-width: 1216px) and (max-width: 1407px)"); }
  NotWidescreen(){ return this.Media("(max-width: 1216px), (min-width: 1407px)"); }
  FullHD(){ return this.Media("(min-width: 1408px)"); }
  ReducedMotion(){ return this.Media("(prefers-reduced-motion)"); }
  NotReducedMotion(){ return this.Media("not(prefers-reduced-motion)"); }

  GetStylesheet()
  {
    if (!this.IsConnected())
    {
      throw new Error(`A Style tag can only create a rule after it is connnected, because it does not have a CSSStyleSheet before then`);
    }

    return this.GetNode().sheet;
  }

  CreateRule(rule, index)
  {
    const sheet = this.GetStylesheet();
    index = sheet.insertRule(rule, index ?? sheet.cssRules.length);
    return sheet.cssRules[index];
  }

  CreateCSS(selector = "*", css = ""){ return this.CreateRule(`${selector} {${css}}`); }
  CreateMedia(condition = "()", css = ""){ return this.CreateRule(`@media ${condition} {${css}}`); }
  CreateNamespace(url = ""){ return this.CreateRule(`@namespace url(${url})`); }
  CreateKeyframes(name = "", rules = ""){ return this.CreateRule(`@keyframes ${name} {${rules}}`); }

  GetRule(tag)
  {
    const selector = tag.GetSelector();
    if (!this.rules.has(selector))
    {
      const rule = this.CreateCSS(selector);
      this.rules.set(selector, rule);
      rule.selectorText = selector;
      return rule;
    }
    else
    {
      return this.rules.get(selector);
    }
  }

  HasRule(tag)
  {
    const selector = tag.GetSelector();
    return this.rules.has(selector);
  }

  Load()
  {
    // Iterate each child and convert them to style text
    for (let i = 0; i < this.GetChildCount(); i++)
    {
      const child = this.GetChild(i);
      if (child && !child.IsText())
      {
        // const text = this.constructor.CreateText(child.GetStylesText(""));
        // const text = new Text(this.constructor.CreateText(child.GetStylesText("")));
        const text = new Text(child.GetStylesText(""));
        child.ReplaceWith(text);
      }
    }
  }

  Lazy(v){ return this.ToggleAttribute("lazy", v); }

  GetSelector()
  {
    if (this.hasOwnProperty(SELECTOR)) return this[SELECTOR];

    let selector = "";

    if (this.HasAttribute("scope"))
    {
      selector += `.${this.GetScope()} `;
    }

    // Cache the selector for performance
    // This matters since it will often be called multiple times by child tags
    return this[SELECTOR] = selector;
  }

  // Generate a unique scope name if one was not provided
  Scope(scope = StringUtilities.UniqueID("scope"))
  {
    return this.SetAttribute("scope", scope);
  }

  GetScope(){ return this.GetAttribute("scope"); }
  HasScope(){ return this.HasAttribute("scope"); }

  [Connect](event)
  {
    // console.log("Style Connect", this.GetNode());
    if (this.HasScope())
    {
      const parent = this.GetParent();
      parent.AddClass(this.GetScope());
    }

    // Optionally lazy load the CSS
    if (this.HasAttribute("lazy"))
    {
      PromiseUtilities.AddBackgroundTask(this.Load.bind(this));
    }
    else
    {
      this.Load();
    }
  }

  [Disconnect](event)
  {
    if (this.HasScope())
    {
      const scope = this.GetScope();

      const tags = this.constructor.QueryAll(`.${scope}`);
      for (let i = 0; i < tags.length; i++)
      {
        const tag = tags[i];
        tag.RemoveClass(scope);
      }
    }
  }
}

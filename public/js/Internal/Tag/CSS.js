import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {Style} from "/js/Tags/Style.js";
import {MediaQuery} from "/js/Tags/MediaQuery.js";
import {KeyFrames} from "/js/Tags/KeyFrames.js";
import {Text} from "/js/Tags/Text.js";
// import {OnConnect} from "/js/Tags/Event/OnConnect.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";

const SELECTOR = Tag.GetSelectorSymbol();
const STYLE_TEXT = Symbol("style_text");
const STYLE_NODE = Symbol("style_node");

export class CSS extends Tag
{
  static GetLocalName(){ return "css"; }
  static GetMetaURL(){ return import.meta.url; }

  static From(){ return new this("from"); }
  static To(){ return new this("to"); }

  constructor(...selectors)
  {
    super();

    this.Selector.apply(this, selectors);
  }

  _CreateRule(text, index)
  {
    const rule = this.GetRule();
    if (!rule) throw new Error(`CSS.CreateRule cannot be called because it does not have its own rule yet`);

    const sheet = rule.parentStyleSheet;
    index = sheet.insertRule(rule.selectorText + text, index ?? sheet.cssRules.length);
    return sheet.cssRules[index];
  }

  _GetRule(){ return this.rule; }
  _CreateCSS(selector = "*", css = ""){ return this.CreateRule(`${selector} {${css}}`); }

  // [OnConnect](event)
  // {
  //   if (Environment.IsServer()) return;
  //
  //   const parent = this.GetParent();
  //   if (parent instanceof Style)
  //   {
  //     this.rule ??= parent.CreateCSS(
  //       this.GetSelector(),
  //       this.GetStylesText(),
  //     );
  //   }
  //   else if (parent instanceof MediaQuery)
  //   {
  //     this.rule ??= parent.CreateCSS(
  //       this.GetSelector(),
  //       this.GetStylesText(),
  //     );
  //   }
  //   else if (parent instanceof KeyFrames)
  //   {
  //     this.rule ??= parent.CreateCSS(
  //       this.GetSelector(),
  //       this.GetStylesText(),
  //     );
  //     // console.log("Parent is KeyFrames", this.rule);
  //   }
  //   else if (parent instanceof this.constructor)
  //   {
  //     this.rule ??= parent.CreateCSS(
  //       this.GetSelector(),
  //       this.GetStylesText(),
  //     );
  //     // console.log("Parent is CSS", this.rule);
  //   }
  //
  //   // const style = this.QueryAncestor("style");
  //   // if (style)
  //   // {
  //   //   this.rule ??= style.CreateCSS(
  //   //     this.GetSelector(),
  //   //     this.GetStylesText(),
  //   //   );
  //   // }
  // }

  // [Connect](event)
  // {
  //   console.log("CSS Connect event");
  //   this[TEXT] ??= new Text(this.GetStylesText());
  //   console.log(this[TEXT]);
  //
  //   const style = this.QueryAncestor("style") ?? Style.GetGlobalStyle();
  //   if (style)
  //   {
  //     style.Add(this[TEXT]);
  //   }
  //   console.log(style);
  //   // this.Text();
  // }
  //

  IsTopLevel()
  {
    const parent = this.GetParent();
    if (!parent) return false;

    return !(parent instanceof CSS) // KeyFrames and MediaQuery are instances of CSS
        && !(parent instanceof Style);
  }

  [Connect](event)
  {
    if (this.IsTopLevel())
    {
      // Either get the nearest ancestor style or just place it in the document's style
      const style = this.QueryAncestor("style") ?? this.GetDocument().GetStyle();

      if (style)
      {
        const text = this.GetStyleText();
        style.Append(text);
      }
    }
    else
    {
      const text = this.GetStyleNode();
      this.ReplaceWith(text);
      // this.Append(text);
    }
  }

  // On Disconnect, if our Text node is in a Style, remove it
  [Disconnect](event)
  {
    const text = this.GetStyleNode();
    if (text?.IsConnected())
    {
      console.log("Removing CSS text node");
      text?.Remove();
    }
  }

  Selector(...selectors)
  {
    for (let i = 0; i < selectors.length; i++)
    {
      const selector = selectors[i];

      // If it's a tag instance or a tag class, get its local name
      if (typeof(selector) === "object" && selector instanceof Tag)
      {
        selectors[i] = selector.GetLocalName();
      }
      else if (typeof(selector) === "function")
      {
        const ctor = selector[Symbol.species];
        if (ctor)
        {
          selectors[i] = ctor.GetLocalName();
        }
      }
    }

    return this.SetAttribute("selector", selectors);
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "selector": return this.Selector(...args);
      default: return super.Apply(action, args);
    }
  }

  CreateSelector()
  {
    let selector = "";

    const parent = this.GetParent();

    // Don't include the selector for KeyFrames and MediaQueries
    if (((parent instanceof CSS) || (parent instanceof Style)) && parent.GetLocalName() !== "mediaquery" && parent.GetLocalName() !== "keyframes")
    {
      const parent_selector = parent.GetSelector();
      if (this.HasAttribute("combinator"))
      {
        selector += parent_selector + this.GetAttribute("combinator");
        // selector += parent_selector + " " + this.GetAttribute("combinator") + " ";
      }
      else
      {
        selector += parent_selector;
      }
    }

    let pseudo = "";
    if (this.HasAttribute("pseudo"))
    {
      pseudo = this.GetAttribute("pseudo");
    }

    if (this.HasAttribute("selector"))
    {
      const results = [];
      const selectors = this.GetAttribute("selector");
      for (let i = 0; i < selectors.length; i++)
      {
        let base_selector = selectors[i];

        // let selector = "";
        results.push(selector + base_selector + pseudo);
      }

      selector = results.join(", ");

      this.RemoveAttribute("selector");
    }

    return selector.trim();
  }

  CreateStyleText(indent = "")
  {
    let css = super.GetStylesText();

    if (css.length > 0)
    {
      const selector = this.GetSelector();
      css = `${indent}${selector.trim()} {\n${css.split("; ").map(l => `${indent}  ${l.trim()}`).join(";\n")}\n${indent}}`;
    }

    const count = this.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = this.GetChild(i);
      if (child)
      {
        css += "\n" + child.GetStylesText(indent);
      }
    }

    this.ClearStyles();
    return css;
  }

  CreateStyleNode()
  {
    const css = this.GetStyleText();
    return new Text(css);
  }

  // Cache the selector for performance
  // This matters since it will often be called multiple times by child tags
  GetSelector(){ return this[SELECTOR] ??= this.CreateSelector(); }
  GetStyleText(){ return this[STYLE_TEXT] ??= this.CreateStyleText(); }
  GetStyleNode(){ return this[STYLE_NODE] ??= this.CreateStyleNode(); }

  // GetSelector(){ return this.GetAttribute("selector")?.join(", ") ?? ""; }

  GetStylesText(indent = "")
  {
    let css = super.GetStylesText();

    if (css.length > 0)
    {
      const selector = this.GetSelector();
      css = `${indent}${selector.trim()} {\n${css.split("; ").map(l => `${indent}  ${l.trim()}`).join(";\n")}\n${indent}}`;
    }

    const count = this.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = this.GetChild(i);
      if (child)
      {
        css += "\n" + child.GetStylesText(indent);
      }
    }

    return css;
  }

  Combinator(v){ return this.SetAttribute("combinator", v); }
  CombinatorDescendant(){ return this.RemoveAttribute("combinator"); } // The default
  CombinatorChild(){ return this.Combinator(">"); }
  CombinatorSibling(){ return this.Combinator("~"); }
  CombinatorAdjacentSibling(){ return this.Combinator("+"); }
  CombinatorColumn(){ return this.Combinator("||"); }

  Pseudo(v){ return this.SetAttribute("pseudo", v); }
  PseudoAfter(){ return this.Pseudo("::after"); }
  PseudoBackdrop(){ return this.Pseudo("::backdrop"); }
  PseudoBefore(){ return this.Pseudo("::before"); }
  PseudoCue(){ return this.Pseudo("::cue"); }
  PseudoFirstLetter(){ return this.Pseudo("::first-letter"); }
  PseudoFirstLine(){ return this.Pseudo("::first-line"); }
  PseudoPlaceholder(){ return this.Pseudo("::placeholder"); }
  PseudoSelection(){ return this.Pseudo("::selection"); }
  PseudoSlotted(){ return this.Pseudo("::slotted"); }
  PseudoActive(){ return this.Pseudo(":active"); }
  PseudoDefault(){ return this.Pseudo(":default"); }
  PseudoChecked(){ return this.Pseudo(":checked"); }
  PseudoDefined(){ return this.Pseudo(":defined"); }
  PseudoDisabled(){ return this.Pseudo(":disabled"); }
  PseudoEmpty(){ return this.Pseudo(":empty"); }
  PseudoEnabled(){ return this.Pseudo(":enabled"); }
  PseudoFirst(){ return this.Pseudo(":first"); }
  PseudoFirstChild(){ return this.Pseudo(":first-child"); }
  PseudoFirstOfType(){ return this.Pseudo(":first-of-type"); }
  PseudoFocus(){ return this.Pseudo(":focus"); }
  PseudoFocusWithin(){ return this.Pseudo(":focus-within"); }
  PseudoHost(){ return this.Pseudo(":host"); }
  PseudoHover(){ return this.Pseudo(":hover"); }
  PseudoIndeterminate(){ return this.Pseudo(":indeterminate"); }
  PseudoInRange(){ return this.Pseudo(":in-range"); }
  PseudoInvalid(){ return this.Pseudo(":invalid"); }
  PseudoLastChild(){ return this.Pseudo(":last-child"); }
  PseudoLastOfType(){ return this.Pseudo(":last-of-type"); }
  PseudoLeft(){ return this.Pseudo(":left"); }
  PseudoLink(){ return this.Pseudo(":link"); }
  PseudoOnlyChild(){ return this.Pseudo(":only-child"); }
  PseudoOnlyOfType(){ return this.Pseudo(":only-of-type"); }
  PseudoOptional(){ return this.Pseudo(":optional"); }
  PseudoOutOfRange(){ return this.Pseudo(":out-of-range"); }
  PseudoReadOnly(){ return this.Pseudo(":read-only"); }
  PseudoReadWrite(){ return this.Pseudo(":read-write"); }
  PseudoRequired(){ return this.Pseudo(":required"); }
  PseudoRight(){ return this.Pseudo(":right"); }
  PseudoRoot(){ return this.Pseudo(":root"); }
  PseudoScope(){ return this.Pseudo(":scope"); }
  PseudoTarget(){ return this.Pseudo(":target"); }
  PseudoValid(){ return this.Pseudo(":valid"); }
  PseudoVisited(){ return this.Pseudo(":visited"); }
  PseudoLang(v){ return this.Pseudo(`:lang(${v})`); }
  PseudoNot(v){ return this.Pseudo(`:not(${v})`); }
  PseudoNthChild(v){ return this.Pseudo(`:nth-child(${v})`); }
  PseudoNthLastChild(v){ return this.Pseudo(`:nth-last-child(${v})`); }
  PseudoNthLastOfType(v){ return this.Pseudo(`:nth-last-of-type(${v})`); }
  PseudoNthOfType(v){ return this.Pseudo(`:nth-of-type(${v})`); }

  FindStyleClass(selector)
  {
    const sheets = window.document.styleSheets;
    for (let i = 0; i < sheets.length; i++)
    {
      const sheet = sheets[i];

      let rules;
      try
      {
        rules = sheet.cssRules;
      }
      catch (error)
      {
        continue;
      }

      for (let j = 0; j < rules.length; j++)
      {
        const rule = rules[j];
        // const selector = rule.selectorText;
        if (selector === rule.selectorText)
        {
          // console.log("Found CSS rule for", selector, rule);
          return rule;
        }
      }
    }
  }

  GenerateStyleCode()
  {
    console.log("Generating Style code for", this.GetNodeName());

    const node = this.GetNode();

    const styles = window.getComputedStyle(node);

    for (let i = 0; i < styles.length; i++)
    {
      const style = styles[i];
      const value = styles.getPropertyValue(style);
      console.log(i, style, value);
    }

    if (node.children.length > 0)
    {
      const children = [];
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i]);
        if (tag) tag.GenerateStyleCode();
      }
    }
  }

  GenerateStyleCode()
  {
    // console.log("Generating Style code for", this.GetNodeName());
    // console.log(this.FindStyleClass(".mdc-card"));

    const selectors = [];

    selectors.push(this.GetNodeName());

    if (this.HasAttribute("id"))
    {
      selectors.push(`#${this.GetAttribute("id")}`);
    }

    const classes = this.GetClassList();
    for (let i = 0; i < classes.length; i++)
    {
      selectors.push(`.${classes[i]}`);
    }

    for (let i = 0; i < selectors.length; i++)
    {
      const selector = selectors[i];
      const rule = this.FindStyleClass(selector);
      // console.log(i, selector, rule);

      // const text = `Tag.CSS("${rule.selectorText}")`;
    }

    const node = this.GetNode();
    if (node.children.length > 0)
    {
      const children = [];
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i]);
        if (tag) tag.GenerateStyleCode();
      }
    }
  }
}

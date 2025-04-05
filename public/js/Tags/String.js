import {Tag} from "/js/Tag.js";
import {Parser} from "/js/Tags/Parser.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Text} from "/js/Tags/Text.js";
// import {Position} from "/js/Tags/Parser/Position.js";
// import {Character} from "/js/Tags/Parser/Character.js";
import {Environment} from "/js/Utility/Environment.js";
import {Connect} from "/js/Event/Connect.js";
// import {DoubleQuoteSymbol} from "/js/Tags/Parser/Symbol/DoubleQuoteSymbol.js";
// import {SingleQuoteSymbol} from "/js/Tags/Parser/Symbol/SingleQuoteSymbol.js";
// import {TemplateQuoteSymbol} from "/js/Tags/Parser/Symbol/TemplateQuoteSymbol.js";
// import {TemplateExpressionOpenSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionOpenSymbol.js";
// import {TemplateExpressionCloseSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionCloseSymbol.js";
// import {CurlyBraceOpenSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceOpenSymbol.js";
// import {CurlyBraceCloseSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceCloseSymbol.js";
// import {Expression} from "/js/Tags/Parser/JavaScript/Expression.js";

export class String extends Tag
{
  // static SetNodeName(name = "string"){ return super.SetNodeName(name); }
  static GetLocalName(){ return "string"; }
  static GetMetaURL(){ return import.meta.url; }
  // SetNode(node = this.constructor.CreateText(this.value)){ return super.SetNode(node); }

  constructor(value = "")
  {
    super();

    // if (value)
    // {
    //   this.
    // }

    // if (Environment.IsClient() && this.raw !== true)
    // {
    //   this.Wait().then(() =>
    //   {
    //     if (this.raw === true) return;
    //     if (!this.IsInDocument()) return;
    //
    //     const parser = new Parser(this, this.GetText());
    //     const fragment = new Fragment();
    //     parser.Push(fragment);
    //
    //     while (parser.IsParsing())
    //     {
    //       const result = this.Parse(parser);
    //       if (result !== true)
    //       {
    //         throw new Error(`Failed to parse anything`);
    //       }
    //     }
    //
    //     parser.Pop(fragment);
    //
    //     if (fragment.HasNode())
    //     {
    //       if (this.GetParent())
    //       {
    //         // console.log("Replacing this", this);
    //         this.Replace(fragment);
    //       }
    //       else
    //       {
    //         console.warn("No parent for string", this);
    //       }
    //     }
    //   });
    // }
  }

  Text(text)
  {
    if (typeof(text) === "string")
    {
      text = new Text(text);
    }

    return this.Clear().AppendChild(text);
  }

  // GetText(){ return this.GetNode().nodeValue; }
  IsMatch(selector){ return false; }
  Query(selector){ return false; }
  QueryAll(selector){ return false; }
  QueryEach(selector){ return false; }

  // constructor(value = "")
  // {
  //   super();
  //
  //   // if (value instanceof window.Text)
  //   // {
  //   //   this.AppendChild(value);
  //   //   value = Tag.GetNodeValue(value);
  //   // }
  //   // else
  //   // {
  //   // }
  //
  //   this.Text(value); // Convert the string to a text node and add it to this
  //   this.value = value;
  // }

  // constructor(value = "")
  // {
  //   super();
  //
  //   this.value = value;
  // }

  [Connect](event)
  {
    if (this.IsDisabled()) return;
    if (this.HasChildren()) return;

    const value = this.GetValue();
    this.Text(value);
  }

  // SetNode(node)
  // {
  //   node = super.SetNode(node);
  //
  //   // this.value = Tag.GetNodeValue(node);
  //
  //   return node;
  // }

  // GetText(){ return this.GetFirstChildNode().nodeValue; }
  // GetText(){ return this.value; }
  // IsMatch(selector){ return false; }
  // Query(selector){ return false; }
  // QueryAll(selector){ return false; }
  // QueryEach(selector){ return false; }

  Raw(raw = true){ this.raw = raw; return this; }

  Deconvert(){ return this.GetText(); }

  _Parse(parser)
  {
    if (parser.IsDone()) return false;

    const top = parser.GetTop();
    const character = parser.Take();

    top.AppendText(character, true);

    return true;
  }

  // [Connect](event)
  // {
  //   if (this.IsDisabled()) return;
  //
  //   console.log("Parsing", this.GetText());
  //   const parser = new Parser(this, this.GetText());
  //
  //   while (parser.IsParsing())
  //   {
  //     const result = this.Parse(parser);
  //     if (result !== true)
  //     {
  //       throw new Error(`Failed to parse anything`);
  //     }
  //   }
  //
  //   if (parser.HasChildren())
  //   {
  //     // Swap out this Text tag for the Parser tag, which is a Fragment
  //     this.Replace(parser);
  //   }
  // }

  // ToPrettyHTML(indent = "")
  // {
  //   return indent + this.GetText();
  // }
}

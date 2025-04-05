import {Tag} from "/js/Tag.js";
// import {Environment} from "/js/Environment.js";
import {StringUtilities} from "/js/Utility/String.js";

export class Script extends Tag
{
  static GetLocalName(){ return "script"; }
  static GetMetaURL(){ return import.meta.url; }

  // EscapeHTML(value)
  // {
  //   throw new Error(`Escaping does NOT guarantee that putting HTML text in a <script> tag is safe!`);
  // }

  constructor(...args)
  {
    super(...args);

    // Obviously, scripts can be used in XSS attacks,
    // so set it to "text/plain" so the browser does not treat it as code
    if (!this.IsTrusted())
    {
      this.Type("text/plain"); // Override the type to prevent it from executing
    }
  }

  Body(fn)
  {
    const text = StringUtilities.ExtractFunctionBody(fn);
    return this.Text(text);
  }

  // Type(v)
  // {
  //   if (!this.IsTrusted()) return this;
  //   else return this.SetAttribute("data", v);
  // }

  _Trust(node)
  {
    console.log("Invoking Trust on Script");
    this.Type("text/plain"); // Override the type to prevent it from executing

    return super.Trust(node);
  }
}

import {Tag} from "/js/Tag.js";
import {Strong} from "/js/Tags/Strong.js";
import {Em} from "/js/Tags/Em.js";
import {StringUtilities} from "/js/Utility/String.js";

export class Code extends Tag
{
  static GetLocalName(){ return "code"; }
  static GetMetaURL(){ return import.meta.url; }

  static Strong(...args){ return this.Add(Strong.Add(...args)); }
  static Em(...args){ return this.Add(Em.Add(...args)); }

  Text(text)
  {
    if (typeof(text) === "function")
    {
      text = StringUtilities.ExtractFunctionBody(text);
    }

    return super.Text(text);
  }
}

import {Tag} from "/js/Tag.js";
import {Token} from "/js/Tags/Parser/Token.js";

export class Keyword extends Token
{
  static GetLocalName(){ return "keyword"; }

  // Describe(){ return this.AddClass("keyword"); }
}

import {Tag} from "/js/Tag.js";
import {Token} from "/js/Tags/Parser/Token.js";

export class Literal extends Token
{
  static GetLocalName(){ return "literal"; }
}

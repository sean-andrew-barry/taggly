import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class IfKeyword extends Keyword
{
  Parse(p){ return p.Read("if"); }
}

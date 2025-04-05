import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class ThrowKeyword extends Keyword
{
  Parse(p){ return p.Read("throw"); }
}

import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class AsyncKeyword extends Keyword
{
  Parse(p){ return p.Read("async"); }
}

import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class False extends Keyword
{
  Parse(p){ return p.Read("false"); }

  Describe(){ return this.AddClass("false"); }
}

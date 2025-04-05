import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class ExportKeyword extends Keyword
{
  Parse(p){ return p.Read("export"); }

  Describe(){ return this.AddClass("export"); }
}

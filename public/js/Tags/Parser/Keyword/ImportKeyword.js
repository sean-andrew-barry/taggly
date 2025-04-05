import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class ImportKeyword extends Keyword
{
  Parse(p){ return p.Read("import"); }

  Describe(){ return this.AddClass("import"); }
}

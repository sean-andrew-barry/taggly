import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class TemplateExpressionCloseSymbol extends Symbol
{
  Parse(p){ return p.Read("}"); }

  Describe(){ return this.AddClass("template"); }
}

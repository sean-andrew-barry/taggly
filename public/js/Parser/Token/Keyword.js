import {Token} from "/js/Parser/Token.js";

export class Keyword extends Token
{
}

// Some common keywords that are used in a variety of parsers, though mainly JavaScript
export class Class extends Keyword { Parse(p){ return p.Read("class"); } }
export class Extends extends Keyword { Parse(p){ return p.Read("extends"); } }
export class Export extends Keyword { Parse(p){ return p.Read("export"); } }
export class Import extends Keyword { Parse(p){ return p.Read("import"); } }
export class Default extends Keyword { Parse(p){ return p.Read("default"); } }
export class From extends Keyword { Parse(p){ return p.Read("from"); } }
export class As extends Keyword { Parse(p){ return p.Read("as"); } }
export class Function extends Keyword { Parse(p){ return p.Read("function"); } }
export class Do extends Keyword { Parse(p){ return p.Read("do") && p.Match(WhiteSpace); } }
export class Of extends Keyword { Parse(p){ return p.Read("of"); } }
export class If extends Keyword { Parse(p){ return p.Read("if"); } }
export class While extends Keyword { Parse(p){ return p.Read("while"); } }
export class For extends Keyword { Parse(p){ return p.Read("for"); } }
export class Else extends Keyword { Parse(p){ return p.Read("else"); } }
export class Return extends Keyword { Parse(p){ return p.Read("return"); } }
export class Throw extends Keyword { Parse(p){ return p.Read("throw"); } }
export class Const extends Keyword { Parse(p){ return p.Read("const"); } }
export class Let extends Keyword { Parse(p){ return p.Read("let"); } }
export class Var extends Keyword { Parse(p){ return p.Read("var"); } }
export class New extends Keyword { Parse(p){ return p.Read("new"); } }
export class Null extends Keyword { Parse(p){ return p.Read("null"); } }
export class Undefined extends Keyword { Parse(p){ return p.Read("undefined"); } }
export class True extends Keyword { Parse(p){ return p.Read("true"); } }
export class False extends Keyword { Parse(p){ return p.Read("false"); } }
export class This extends Keyword { Parse(p){ return p.Read("this"); } }
export class Super extends Keyword { Parse(p){ return p.Read("super"); } }
export class TypeOf extends Keyword { Parse(p){ return p.Read("typeof"); } }
export class InstanceOf extends Keyword { Parse(p){ return p.Read("instanceof"); } }
export class Async extends Keyword { Parse(p){ return p.Read("async"); } }
export class Await extends Keyword { Parse(p){ return p.Read("await"); } }
export class Get extends Keyword { Parse(p){ return p.Read("get"); } }
export class Set extends Keyword { Parse(p){ return p.Read("set"); } }
export class Infinity extends Keyword { Parse(p){ return p.Read("infinity"); } }
export class NaN extends Keyword { Parse(p){ return p.Read("NaN"); } }
export class Constructor extends Keyword { Parse(p){ return p.Read("constructor"); } }
export class Switch extends Keyword { Parse(p){ return p.Read("switch"); } }
export class Case extends Keyword { Parse(p){ return p.Read("case"); } }
export class Continue extends Keyword { Parse(p){ return p.Read("continue"); } }

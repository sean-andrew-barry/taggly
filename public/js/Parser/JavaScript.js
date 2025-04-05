import {Parser} from "/js/Parser.js";
import {Token} from "/js/Tags/Token.js";
import {Symbol} from "/js/Tags/Token/Symbol.js";
import {Keyword} from "/js/Tags/Token/Keyword.js";
import {Literal} from "/js/Tags/Token/Literal.js";
import {WhiteSpace} from "/js/Tags/Token/WhiteSpace.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";

export class OpenParenthesis extends Symbol { Parse(p){ return p.Read("("); } }
export class CloseParenthesis extends Symbol { Parse(p){ return p.Read(")"); } }
export class OpenCurlyBracket extends Symbol { Parse(p){ return p.Read("{"); } }
export class CloseCurlyBracket extends Symbol { Parse(p){ return p.Read("}"); } }
export class OpenBracket extends Symbol { Parse(p){ return p.Read("["); } }
export class CloseBracket extends Symbol { Parse(p){ return p.Read("]"); } }
export class Colon extends Symbol { Parse(p){ return p.Read(":"); } }
export class SemiColon extends Symbol { Parse(p){ return p.Read(";"); } }
export class Dot extends Symbol { Parse(p){ return p.Read("."); } }
export class Asterisk extends Symbol { Parse(p){ return p.Read("*"); } }
export class Hash extends Symbol { Parse(p){ return p.Read("#"); } }
export class Comma extends Symbol { Parse(p){ return p.Read(","); } }
export class Percent extends Symbol { Parse(p){ return p.Read("%"); } }
export class SingleQuote extends Symbol { Parse(p){ return p.Read("'"); } }
export class DoubleQuote extends Symbol { Parse(p){ return p.Read("\""); } }
export class TemplateQuote extends Symbol { Parse(p){ return p.Read("`"); } }
export class OpenTemplateExpression extends Symbol { Parse(p){ return p.Read("${"); } }
export class CloseTemplateExpression extends Symbol { Parse(p){ return p.Read("}"); } }
export class SingleLineComment extends Symbol { Parse(p){ return p.Read("//"); } }
export class OpenMultiLineComment extends Symbol { Parse(p){ return p.Read("/*"); } }
export class CloseMultiLineComment extends Symbol { Parse(p){ return p.Read("*/"); } }
export class Arrow extends Symbol { Parse(p){ return p.Read("=>"); } }
export class Rest extends Symbol { Parse(p){ return p.Read("..."); } }

export class Assign extends Symbol { Parse(p){ return p.Read("="); } }
export class Equal extends Symbol { Parse(p){ return p.Read("=="); } }
export class NotEqual extends Symbol { Parse(p){ return p.Read("!="); } }
export class ExactEqual extends Symbol { Parse(p){ return p.Read("==="); } }
export class NotExactEqual extends Symbol { Parse(p){ return p.Read("!=="); } }
export class Not extends Symbol { Parse(p){ return p.Read("!"); } }
export class Or extends Symbol { Parse(p){ return p.Read("||"); } }
export class And extends Symbol { Parse(p){ return p.Read("&&"); } }
export class Nullish extends Symbol { Parse(p){ return p.Read("??"); } }
export class Increment extends Symbol { Parse(p){ return p.Read("++"); } }
export class Decrement extends Symbol { Parse(p){ return p.Read("--"); } }
export class Add extends Symbol { Parse(p){ return p.Read("+"); } }
export class Sub extends Symbol { Parse(p){ return p.Read("-"); } }
export class Mul extends Symbol { Parse(p){ return p.Read("*"); } }
export class Div extends Symbol { Parse(p){ return p.Read("/"); } }
export class Mod extends Symbol { Parse(p){ return p.Read("%"); } }
export class AddAssign extends Symbol { Parse(p){ return p.Read("+="); } }
export class SubAssign extends Symbol { Parse(p){ return p.Read("-="); } }
export class MulAssign extends Symbol { Parse(p){ return p.Read("*="); } }
export class DivAssign extends Symbol { Parse(p){ return p.Read("/="); } }
export class ModAssign extends Symbol { Parse(p){ return p.Read("%="); } }
export class OrAssign extends Symbol { Parse(p){ return p.Read("||="); } }
export class AndAssign extends Symbol { Parse(p){ return p.Read("&&="); } }
export class NullishAssign extends Symbol { Parse(p){ return p.Read("??="); } }

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
export class Static extends Keyword { Parse(p){ return p.Read("static"); } }
export class Await extends Keyword { Parse(p){ return p.Read("await"); } }
export class Get extends Keyword { Parse(p){ return p.Read("get"); } }
export class Set extends Keyword { Parse(p){ return p.Read("set"); } }
export class Infinity extends Keyword { Parse(p){ return p.Read("infinity"); } }
export class NaN extends Keyword { Parse(p){ return p.Read("NaN"); } }
export class Constructor extends Keyword { Parse(p){ return p.Read("constructor"); } }
export class Switch extends Keyword { Parse(p){ return p.Read("switch"); } }
export class Case extends Keyword { Parse(p){ return p.Read("case"); } }
export class Continue extends Keyword { Parse(p){ return p.Read("continue"); } }

export class Comment extends Token
{
  static GetLocalName(){ return "comment"; }
}

export class SingleLine extends Comment
{
  // static GetLocalName(){ return "single-line-comment"; }

  Parse(p)
  {
    if (!p.Match(SingleLineComment)) return false;

    let text = "";
    while (!p.IsNewLine())
    {
      if (p.IsDone()) return false;
      text += p.Take();
    }

    p.Save(text);

    return true;
  }
}

export class MultiLine extends Comment
{
  // static GetLocalName(){ return "multi-line-comment"; }

  Parse(p)
  {
    if (!p.Match(OpenMultiLineComment)) return false;

    while (!p.Match(CloseMultiLineComment))
    {
      if (p.IsDone()) return false;
      p.Save(p.Take());
    }

    return true;
  }
}

export class Identifier extends Token
{
  // static GetLocalName(){ return "identifier"; }

  Parse(p)
  {
    const c = p.Next();
    if ((c !== "$") && (c !== "_") && !p.IsAlpha(c)) return false;

    const characters = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "_" && !p.IsAlNum(c)) break;

      characters.push(c);
      p.Next();
    }

    const id = characters.join("");
    p.Save(id);
    // this.Name(id);

    return true;
  }
}

export class Statement extends Token
{
  static GetLocalName(){ return "statement"; }

  Parse(p)
  {
    // return p.Check(WhiteSpace) && p.Check(SemiColon);
    return p.Check(SemiColon);
  }
}

export class WhileStatement extends Statement
{
  // static GetLocalName(){ return "while-statement"; }

  Parse(p)
  {
    if (p.Current() !== "w" || !p.Match(While)) return false;

    p.ParseSpace();

    if (!p.Match(ConditionStatement)) return false;

    p.ParseSpace();

    return p.Match(BlockStatement) && super.Parse(p);
  }
}

export class IfStatement extends Statement
{
  // static GetLocalName(){ return "if-statement"; }

  Parse(p)
  {
    if (p.Current() !== "i" || !p.Match(If)) return false;

    p.ParseSpace();

    if (!p.Match(ConditionStatement)) return false;

    p.ParseSpace();

    if (!p.Match(BlockStatement))
    {
      // If we fail to match a block statement, it should be an expression
      return p.Parse() && super.Parse(p);
    }
    else
    {
      return super.Parse(p);
    }
  }
}

export class DoStatement extends Statement
{
  // static GetLocalName(){ return "do-statement"; }

  Parse(p)
  {
    if (p.Current() !== "d" || !p.Match(Do)) return false;

    p.ParseSpace();

    if (!p.Match(BlockStatement)) return false;

    p.ParseSpace();

    if (!p.Match(While)) return false;

    p.ParseSpace();

    return p.Match(ConditionStatement) && super.Parse(p);
  }
}

export class BlockStatement extends Statement
{
  // static GetLocalName(){ return "block-statement"; }

  Parse(p)
  {
    if (!p.Match(OpenCurlyBracket)) return false;

    while (!p.Match(CloseCurlyBracket))
    {
      if (!p.Parse())
      {
        return false;
      }
    }

    return super.Parse(p);
  }
}

export class ClassBlockStatement extends Statement
{
  // static GetLocalName(){ return "class-block-statement"; }

  Parse(p)
  {
    if (!p.Match(OpenCurlyBracket)) return false;

    // p.ParseSpace();
    p.Match(WhiteSpace);

    // Loop until a } or we hit the end
    while (p.IsParsing() && p.Current() !== "}")
    {
      // p.ParseSpace();

      if (!p.Match(MethodExpression) && !p.Parse())
      {
        break;
      }
    }

    return p.Match(CloseCurlyBracket) && super.Parse(p);
  }
}

export class ReturnStatement extends Statement
{
  // static GetLocalName(){ return "return-statement"; }

  Parse(p)
  {
    if (!p.Match(Return)) return false;

    p.Match(WhiteSpace);
    // p.ParseExpression(); // Not necessary for it to match anything

    p.Match(MultiExpression);

    // if (!p.ParseExpression())
    // {
    //
    // }
    // p.Parse(); // Having something after a return is optional

    return super.Parse(p);
  }
}

export class ThrowStatement extends Statement
{
  // static GetLocalName(){ return "throw-statement"; }

  Parse(p)
  {
    if (!p.Match(Throw)) return false;

    p.Match(WhiteSpace);
    p.Parse(); // Having something after a throw is optional

    return super.Parse(p);
  }
}

export class ContinueStatement extends Statement
{
  // static GetLocalName(){ return "continue-statement"; }

  Parse(p)
  {
    if (!p.Match(Continue)) return false;

    p.Match(WhiteSpace);
    return super.Parse(p);
  }
}

export class ClassStatement extends Statement
{
  // static GetLocalName(){ return "class-statement"; }

  Parse(p){ return p.Match(ClassExpression) && super.Parse(p); }
}

export class FunctionStatement extends Statement
{
  // static GetLocalName(){ return "function-statement"; }

  Parse(p){ return p.Match(FunctionExpression) && super.Parse(p); }
}

export class ImportStatement extends Statement
{
  // static GetLocalName(){ return "import-statement"; }

  Parse(p)
  {
    if (!p.Match(Import)) return false;

    p.Match(WhiteSpace);

    let matched = false;
    if (p.Match(OpenCurlyBracket))
    {
      while (!p.Match(CloseCurlyBracket))
      {
        if (!p.Parse())
        {
          return false;
        }
      }

      matched = true;
    }
    else if (p.Match(Identifier))
    {
      matched = true;
    }

    if (matched === true)
    {
      p.Match(WhiteSpace);

      if (p.Match(From))
      {
        p.Match(WhiteSpace);
        return p.Match(StringLiteral) && super.Parse(p);
      }
    }

    return false;
  }
}

export class ExportStatement extends Statement
{
  // static GetLocalName(){ return "export-statement"; }

  // TODO: Finish matching the varieties of export statements
  Parse(p)
  {
    if (!p.Match(Export)) return false;

    p.Match(WhiteSpace);

    if (p.Match(Default))
    {
      p.Match(WhiteSpace);

      return p.Parse();
    }
    else if (p.Match(ExpressionStatement))
    {
      return true;
    }
    // else if (p.Match(ClassStatement))
    // {
    //   return true;
    // }
    // else if (p.Match(FunctionStatement))
    // {
    //   return true;
    // }
    else
    {
      if (p.Match(OpenCurlyBracket))
      {
        while (!p.Match(CloseCurlyBracket))
        {
          if (!p.Parse())
          {
            return false;
          }
        }

        return true;
      }
    }

    return false;
  }
}

export class LetStatement extends Statement
{
  // static GetLocalName(){ return "let-statement"; }

  Parse(p)
  {
    if (!p.Match(Let)) return false;
    if (!p.Match(WhiteSpace)) return false;
    if (!p.Match(Identifier)) return false;

    p.Match(WhiteSpace);

    if (p.Match(SemiColon))
    {
      return true;
    }
    else if (p.Match(Assign))
    {
      p.Match(WhiteSpace);

      return p.Parse() && super.Parse(p);
    }

    return false;
  }
}

export class ConstStatement extends Statement
{
  // static GetLocalName(){ return "const-statement"; }

  Parse(p)
  {
    if (!p.Match(Const)) return false;
    if (!p.Match(WhiteSpace)) return false;
    if (!p.Match(Identifier)) return false;

    p.ParseSpace();

    if (p.Match(SemiColon))
    {
      return true;
    }
    else if (p.Match(Assign))
    {
      p.Match(WhiteSpace);

      return p.Parse() && super.Parse(p);
    }

    return false;
  }
}

export class VarStatement extends Statement
{
  // static GetLocalName(){ return "var-statement"; }

  Parse(p)
  {
    if (!p.Match(Var)) return false;
    if (!p.Match(WhiteSpace)) return false;
    if (!p.Match(Identifier)) return false;

    if (p.Match(SemiColon))
    {
      return true;
    }
    else if (p.Match(Assign))
    {
      p.Match(WhiteSpace);

      return p.ParseExpression();
    }

    return false;
  }
}

export class CaseStatement extends Statement
{
  // static GetLocalName(){ return "case-statement"; }

  Parse(p)
  {
    if (!p.Match(Case)) return false;

    p.Match(WhiteSpace);

    if (p.Parse())
    {
      p.Match(WhiteSpace);

      if (p.Match(Colon))
      {
        p.Match(WhiteSpace);
      }
    }

    return p.Parse() && super.Parse(p);
  }
}

export class DefaultStatement extends Statement
{
  // static GetLocalName(){ return "default-statement"; }

  Parse(p)
  {
    if (!p.Match(Default)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(Colon)) return false;

    p.Match(WhiteSpace);

    if (p.Parse())
    {
      p.Match(WhiteSpace);
      p.Match(SemiColon);
      return true;
    }
    else
    {
      return false;
    }
  }
}

export class SwitchStatement extends Statement
{
  // static GetLocalName(){ return "switch-statement"; }

  Parse(p)
  {
    if (!p.Match(Switch)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(ParameterStatement)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(OpenCurlyBracket)) return false;

    p.Match(WhiteSpace);

    while (p.Match(CaseStatement))
    {
      // console.log("Matched CaseStatement");
      p.Match(WhiteSpace);
    }

    if (p.Match(DefaultStatement))
    {
      // console.log("Matched DefaultStatement");
      p.Match(WhiteSpace);
    }

    return p.Match(CloseCurlyBracket);
  }
}

export class ForOfStatement extends Statement
{
  Parse(p)
  {
    if (!p.Match(For)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(OpenParenthesis)) return false;

    p.Match(WhiteSpace);

    (p.Match(Const) || p.Match(Let) || p.Match(Var)) && p.Match(WhiteSpace);

    if (p.Match(Identifier))
    {
      p.Match(WhiteSpace);

      if (p.Match(Of))
      {
        p.Match(WhiteSpace);

        if (p.Parse())
        {
          p.Match(WhiteSpace);

          if (p.Match(CloseParenthesis))
          {
            p.Match(WhiteSpace);
            return p.Match(BlockStatement) || p.Parse();
          }
        }
      }
    }

    return false;
  }
}

// I think that Parameters are a statement in the same way a Block is
export class ParameterStatement extends Statement
{
  // static GetLocalName(){ return "parameter-statement"; }

  Parse(p)
  {
    if (!p.Match(OpenParenthesis)) return false;

    while (!p.Match(CloseParenthesis))
    {
      if (!p.Parse())
      {
        return false;
      }
    }

    return true;
  }
}

export class ConditionStatement extends Statement
{
  // static GetLocalName(){ return "condition-statement"; }

  Parse(p)
  {
    if (!p.Match(OpenParenthesis)) return false;

    while (!p.Match(CloseParenthesis))
    {
      if (!p.Parse())
      {
        return false;
      }
    }

    return true;
  }
}

export class ExpressionStatement extends Statement
{
  // static GetLocalName(){ return "expression-statement"; }

  Parse(p)
  {
    return p.ParseExpression() && super.Parse(p);
  }
}

export class Expression extends Token
{
  static GetLocalName(){ return "expression"; }
}

export class FunctionExpression extends Expression
{
  Parse(p)
  {
    p.Check(Async);

    if (!p.Match(Function)) return false;

    p.Match(WhiteSpace);

    if (p.Match(Identifier))
    {
      p.Match(WhiteSpace);
    }

    if (p.Match(ParameterStatement))
    {
      p.Match(WhiteSpace);
      return p.Match(BlockStatement);
    }

    return false;
  }
}

export class ClassExpression extends Expression
{
  // static GetLocalName(){ return "class-expression"; }

  Parse(p)
  {
    if (!p.Match(Class)) return false;

    p.ParseSpace();

    if (p.Match(Extends))
    {
      p.Match(WhiteSpace);
      p.Match(Identifier); // Match the super class name
      p.Match(WhiteSpace);
    }
    else if (p.Match(Identifier))
    {
      p.Match(WhiteSpace);

      if (p.Match(Extends))
      {
        p.Match(WhiteSpace);
        p.Match(Identifier);
        p.Match(WhiteSpace);
      }
    }

    return p.Match(ClassBlockStatement);
  }
}

export class MethodExpression extends Expression
{
  // static GetLocalName(){ return "method-expression"; }

  Parse(p)
  {
    p.Match(Static);
    p.Match(Async);

    if (!p.Match(Constructor) && !p.Match(Identifier)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(ParameterStatement)) return false;

    p.Match(WhiteSpace);
    return p.Match(BlockStatement);
  }
}

export class NewExpression extends Expression
{
  // static GetLocalName(){ return "new-expression"; }

  Parse(p)
  {
    if (!p.Match(New)) return false;

    p.ParseSpace();

    return p.ParseExpression();
  }
}

export class MultiExpression extends Expression
{
  // static GetLocalName(){ return "multi-expression"; }

  Parse(p)
  {
    while (p.IsParsing() && p.ParseExpression())
    {
      p.ParseSpace();
      // if (left)
      // {
      //
      // }
    }

    return true;
  }
}

export class MemberExpression extends Expression
{
  // static GetLocalName(){ return "member-expression"; }
  // MatchFirst(p)
  // {
  //   return p.Match(NewExpression)
  //       || p.Match(CallExpression)
  //       || p.Match(Identifier)
  //       ;
  // }

  Parse(p)
  {
    if (!p.Match(Identifier)) return false;
    // if (!this.MatchFirst(p)) return false;

    p.ParseSpace();

    if (!p.Match(Dot)) return false;

    p.ParseSpace();
    // p.Match(WhiteSpace);

    // return p.Parse();
    return p.ParseExpression();
  }
}

export class CallExpression extends Expression
{
  // static GetLocalName(){ return "call-expression"; }

  Parse(p)
  {
    if (!p.Match(Identifier)) return false;

    p.Match(WhiteSpace);

    if (p.Current() === "`")
    {
      return p.Match(StringLiteral);
    }
    else if (p.Current() === "(")
    {
      return p.Match(ParameterStatement);
    }
    else
    {
      return false;
    }

    // if (!p.Match(OpenParenthesis)) return false;
    //
    // while (!p.Match(CloseParenthesis))
    // {
    //   if (!p.Parse())
    //   {
    //     return false;
    //   }
    // }
    //
    // return true;
  }
}

export class ArrowFunctionExpression extends Expression
{
  // static GetLocalName(){ return "arrow-function-expression"; }

  Parse(p)
  {
    if (p.Match(OpenParenthesis))
    {
      while (!p.Match(CloseParenthesis))
      {
        if (!p.Parse())
        {
          return false;
        }
      }

      p.Match(WhiteSpace);

      if (p.Match(Arrow))
      {
        p.Match(WhiteSpace);

        if (p.Match(BlockStatement) || p.ParseExpression())
        {
          return true;
        }
      }
    }
    else if (p.Match(Identifier))
    {
      p.Match(WhiteSpace);

      if (p.Match(Arrow))
      {
        p.Match(WhiteSpace);

        if (p.Match(BlockStatement) || p.ParseExpression())
        {
          return true;
        }
      }
    }

    return false;
  }
}

export class TemplateExpression extends Expression
{
  // static GetLocalName(){ return "template-expression"; }

  Parse(p)
  {
    if (p.Current() !== "$" || !p.Match(OpenTemplateExpression)) return false;

    while (!p.Match(CloseTemplateExpression))
    {
      if (p.Current() === "\`" || !p.Parse())
      {
        return false;
      }
    }

    return true;
  }
}

export class StringLiteral extends Literal
{
  // static GetLocalName(){ return "string-literal"; }

  GetClosingCharacter(type)
  {
    switch (type)
    {
      case SingleQuote: return "'";
      case DoubleQuote: return "\"";
      case TemplateQuote: return "\`";
      default: throw new Error(`Unknown closing character type`);
    }
  }

  Parse(p)
  {
    let type;
    if      (p.Match(SingleQuote)) type = SingleQuote;
    else if (p.Match(DoubleQuote)) type = DoubleQuote;
    else if (p.Match(TemplateQuote)) type = TemplateQuote;
    else return false;

    const closing = this.GetClosingCharacter(type);

    let text = "";
    while (true)
    {
      // Fail if we hit the end of the input before finding the closing character
      if (p.IsDone()) return false;

      const c = p.Current();

      if (c === closing)
      {
        p.Save(text);
        text = "";

        p.Match(type);
        return true;
      }
      else if (type === TemplateQuote && c === "$")
      {
        p.Save(text);
        text = "";

        if (p.Match(TemplateExpression))
        {
          continue;
        }
      }

      text += c;
      p.Next();
    }

    return true;
  }
}

export class NumberLiteral extends Literal
{
  // static GetLocalName(){ return "number-literal"; }

  Parse(p)
  {
    const c = p.Next();
    if (c !== "-" && !p.IsDigit(c)) return false;

    const digits = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "." && c !== "_" && !p.IsDigit(c)) break;

      digits.push(c);
      p.Next();
    }

    const value = Number(digits.join(""));
    if (Number.isNaN(value)) return false;

    // this.Value(value);
    p.Save(value.toString());

    return true;
  }
}

export class BooleanLiteral extends Literal
{
  // static GetLocalName(){ return "boolean-literal"; }

  Parse(p)
  {
    if (p.Match(True) || p.Match(False))
    {
      return true;
    }

    return false;
  }
}

// NOTE: Most of the optimizing is a matter of limiting how often we need to
// fall back to parser.Parse()
// Since that checks everything, it is very slow.
export class JavaScript extends Parser
{
  static GetStyle()
  {
    if (this.style) return this.style;

    const constant_color = "#d19a66";
    const string_color = "#98c379";
    const object_color = "#e5c07b";
    const function_name = "#61afef";

    return this.style = new Style().Add(
      // new CSS(".Class ~ .Identifier").Color(object_color),
      // new CSS(".Extends ~ .Identifier").Color(object_color),
      // new CSS(".Function ~ .Identifier").Color(function_name),
      new CSS(".Class + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".Extends + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".New + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".Function + .WhiteSpace + .Identifier").Color(function_name),

      new CSS("symbol").Color("#abb2bf"),
      new CSS("keyword").Color("#c678dd"),
      new CSS("keyword.This, keyword.Super").Color("#e06c75"),
      new CSS("token.Identifier").Color("#e06c75"),
      new CSS("literal.NumberLiteral").Color(constant_color),
      new CSS("literal.BooleanLiteral > keyword").Color(constant_color),
      new CSS("literal.StringLiteral, literal.StringLiteral > symbol").Color(string_color),
      new CSS("expression.CallExpression > token.Identifier").Color(function_name),
      new CSS("expression.NewExpression > expression.CallExpression > token.Identifier").Color(object_color),
      new CSS("expression.ClassExpression > token.Identifier").Color(object_color),
      new CSS("expression.MethodExpression > token.Identifier").Color(function_name),
      new CSS("expression.FunctionExpression > token.Identifier").Color(function_name),
      new CSS("keyword.Constructor").Color(function_name),
      new CSS("comment, comment > symbol").Color("#5c6370").FontStyleItalic(),
    );
  }

  Begin(...args)
  {
    const result = super.Begin(...args);

    if (result)
    {
      result.Prepend(
        this.constructor.GetStyle(),
      );
    }

    return result;
  }

  ParseSpace()
  {
    return false
        || this.Match(SingleLine)
        || this.Match(MultiLine)
        || this.Match(WhiteSpace);
  }

  ParseSpace()
  {
    let count = 0;
    while (this.IsParsing())
    {
      if (!this.Match(WhiteSpace) && !this.Match(SingleLine) && !this.Match(MultiLine))
      {
        break;
      }
      else
      {
        count += 1;
      }
    }

    return count > 0;
  }

  ParseStatement()
  {
    return false
        // || this.Match(SingleLine)
        // || this.Match(MultiLine)
        || this.Match(ImportStatement)
        || this.Match(ExportStatement)
        || this.Match(ForOfStatement)
        || this.Match(SwitchStatement)
        || this.Match(ClassStatement)
        || this.Match(FunctionStatement)
        || this.Match(IfStatement)
        || this.Match(WhileStatement)
        || this.Match(DoStatement)
        || this.Match(BlockStatement)
        || this.Match(ReturnStatement)
        || this.Match(ThrowStatement)
        || this.Match(ContinueStatement)
        || this.Match(LetStatement)
        || this.Match(ConstStatement)
        || this.Match(VarStatement)
        // || this.Match(ExpressionStatement)
        || false;
  }

  ParseExpression()
  {
    return false
        // || this.Match(MultiExpression)
        || this.Match(ClassExpression)
        || this.Match(FunctionExpression)
        || this.Match(MemberExpression)
        || this.Match(ArrowFunctionExpression)
        || this.Match(CallExpression)
        || this.Match(NewExpression)
        || this.Match(MethodExpression)
        || this.ParseLiteral()
        || false;
  }

  ParseSymbol()
  {
    return false
        || this.Match(OpenParenthesis)
        || this.Match(CloseParenthesis)
        || this.Match(OpenCurlyBracket)
        || this.Match(CloseCurlyBracket)
        || this.Match(OpenBracket)
        || this.Match(CloseBracket)
        || this.Match(Colon)
        || this.Match(SemiColon)
        || this.Match(Rest)
        || this.Match(Dot)
        || this.Match(Asterisk)
        || this.Match(Hash)
        || this.Match(Comma)
        || this.Match(Percent)
        || this.Match(SingleQuote)
        || this.Match(DoubleQuote)
        || this.Match(TemplateQuote)
        || this.Match(SingleLineComment)
        || this.Match(OpenMultiLineComment)
        || this.Match(CloseMultiLineComment)
        || this.Match(Arrow)

        || this.Match(ExactEqual)
        || this.Match(Equal)
        || this.Match(Assign)

        || this.Match(NotExactEqual)
        || this.Match(NotEqual)
        || this.Match(Not)

        || this.Match(Or)
        || this.Match(And)
        || this.Match(Nullish)
        || this.Match(Increment)
        || this.Match(Decrement)
        || this.Match(Add)
        || this.Match(Sub)
        || this.Match(Mul)
        || this.Match(Div)
        || this.Match(Mod)
        || this.Match(AddAssign)
        || this.Match(SubAssign)
        || this.Match(MulAssign)
        || this.Match(DivAssign)
        || this.Match(ModAssign)
        || this.Match(OrAssign)
        || this.Match(AndAssign)
        || this.Match(NullishAssign)
        || false;
  }

  ParseKeyword()
  {
    return false
        || this.Match(Class)
        || this.Match(Extends)
        || this.Match(Export)
        || this.Match(Import)
        || this.Match(Default)
        || this.Match(From)
        || this.Match(As)
        || this.Match(Function)
        || this.Match(Do)
        || this.Match(If)
        || this.Match(While)
        || this.Match(For)
        || this.Match(Else)
        || this.Match(Return)
        || this.Match(Throw)
        || this.Match(Const)
        || this.Match(Let)
        || this.Match(Var)
        || this.Match(New)
        || this.Match(Null)
        || this.Match(Undefined)
        || this.Match(This)
        || this.Match(Super)
        || this.Match(Constructor)
        || this.Match(TypeOf)
        || this.Match(InstanceOf)
        || this.Match(Async)
        || this.Match(Await)
        || this.Match(Get)
        || this.Match(Set)
        || this.Match(Infinity)
        || this.Match(NaN)
        || this.Match(Switch)
        || this.Match(Case)
        || this.Match(True)
        || this.Match(False)
        || this.Match(Of)
        || false;
  }

  ParseLiteral()
  {
    return false
        || this.Match(StringLiteral)
        || this.Match(NumberLiteral)
        || this.Match(BooleanLiteral)
        || false;
  }

  Parse()
  {
    this.StartedParse();

    return false
        || this.Match(SingleLine)
        || this.Match(MultiLine)
        || this.ParseStatement()
        || this.ParseExpression()
        || this.ParseLiteral()
        || this.ParseKeyword() // Later this will be moved down, after I have statement parsing
        || this.ParseSymbol()
        || this.Match(Identifier)
        || this.Match(WhiteSpace)
        || super.Parse();
  }
}


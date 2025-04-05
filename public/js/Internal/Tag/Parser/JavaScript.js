import {Tag} from "/js/Tag.js";

import {Parser} from "/js/Tags/Parser.js";
import {Style } from "/js/Tags/Style.js";
import {CSS   } from "/js/Tags/CSS.js";

import {Identifier} from "/js/Tags/Parser/Identifier.js";

import {IfStatement        } from "/js/Tags/Parser/Statement/IfStatement.js";
import {ElseIfStatement    } from "/js/Tags/Parser/Statement/ElseIfStatement.js";
import {Else               } from "/js/Tags/Parser/Statement/Else.js";
import {ClassStatement     } from "/js/Tags/Parser/Statement/ClassStatement.js";
import {BlockStatement     } from "/js/Tags/Parser/Statement/BlockStatement.js";
import {ReturnStatement    } from "/js/Tags/Parser/Statement/ReturnStatement.js";
import {ThrowStatement     } from "/js/Tags/Parser/Statement/ThrowStatement.js";
import {ConstStatement     } from "/js/Tags/Parser/Statement/ConstStatement.js";
import {LetStatement       } from "/js/Tags/Parser/Statement/LetStatement.js";
import {VarStatement       } from "/js/Tags/Parser/Statement/VarStatement.js";
import {FunctionStatement  } from "/js/Tags/Parser/Statement/FunctionStatement.js";
import {ExpressionStatement} from "/js/Tags/Parser/Statement/ExpressionStatement.js";
import {Method             } from "/js/Tags/Parser/Statement/Method.js";

import {SingleLine} from "/js/Tags/Parser/Comment/SingleLine.js";
import {MultiLine } from "/js/Tags/Parser/Comment/MultiLine.js";

import {ClassKeyword          } from "/js/Tags/Parser/Keyword/ClassKeyword.js";
import {ExtendsKeyword        } from "/js/Tags/Parser/Keyword/ExtendsKeyword.js";
import {CurlyBraceOpenSymbol  } from "/js/Tags/Parser/Symbol/CurlyBraceOpenSymbol.js";
import {CurlyBraceCloseSymbol } from "/js/Tags/Parser/Symbol/CurlyBraceCloseSymbol.js";
import {ParenthesisOpenSymbol } from "/js/Tags/Parser/Symbol/ParenthesisOpenSymbol.js";
import {ParenthesisCloseSymbol} from "/js/Tags/Parser/Symbol/ParenthesisCloseSymbol.js";

import {ClassExpression        } from "/js/Tags/Parser/Expression/ClassExpression.js";
import {MethodExpression       } from "/js/Tags/Parser/Expression/MethodExpression.js";
import {FunctionExpression     } from "/js/Tags/Parser/Expression/FunctionExpression.js";
import {ArrowFunctionExpression} from "/js/Tags/Parser/Expression/ArrowFunctionExpression.js";
import {CallExpression         } from "/js/Tags/Parser/Expression/CallExpression.js";
import {NewExpression          } from "/js/Tags/Parser/Expression/NewExpression.js";
import {AsyncExpression        } from "/js/Tags/Parser/Expression/AsyncExpression.js";
import {GroupExpression        } from "/js/Tags/Parser/Expression/GroupExpression.js";

import {StringLiteral } from "/js/Tags/Parser/Literal/StringLiteral.js";
import {NumberLiteral } from "/js/Tags/Parser/Literal/NumberLiteral.js";
import {BooleanLiteral} from "/js/Tags/Parser/Literal/BooleanLiteral.js";

import {ThrowKeyword} from "/js/Tags/Parser/Keyword/ThrowKeyword.js";
import {New         } from "/js/Tags/Parser/Keyword/New.js";
import {Null        } from "/js/Tags/Parser/Keyword/Null.js";
import {Undefined   } from "/js/Tags/Parser/Keyword/Undefined.js";
import {True        } from "/js/Tags/Parser/Keyword/True.js";
import {False       } from "/js/Tags/Parser/Keyword/False.js";
import {This        } from "/js/Tags/Parser/Keyword/This.js";
import {Super       } from "/js/Tags/Parser/Keyword/Super.js";
import {TypeOf      } from "/js/Tags/Parser/Keyword/TypeOf.js";
import {InstanceOf  } from "/js/Tags/Parser/Keyword/InstanceOf.js";
import {AsyncKeyword} from "/js/Tags/Parser/Keyword/AsyncKeyword.js";
import {NaN         } from "/js/Tags/Parser/Keyword/NaN.js";
import {Infinity    } from "/js/Tags/Parser/Keyword/Infinity.js";

import {NewLine          } from "/js/Tags/Parser/Symbol/NewLine.js";
import {WhiteSpaceSymbol } from "/js/Tags/Parser/Symbol/WhiteSpaceSymbol.js";
import {NotSymbol        } from "/js/Tags/Parser/Symbol/NotSymbol.js";
import {OrSymbol         } from "/js/Tags/Parser/Symbol/OrSymbol.js";
import {AndSymbol        } from "/js/Tags/Parser/Symbol/AndSymbol.js";
import {ExactEqualsSymbol} from "/js/Tags/Parser/Symbol/ExactEqualsSymbol.js";
import {EqualsSymbol     } from "/js/Tags/Parser/Symbol/EqualsSymbol.js";
import {AssignmentSymbol } from "/js/Tags/Parser/Symbol/AssignmentSymbol.js";
import {DotSymbol        } from "/js/Tags/Parser/Symbol/DotSymbol.js";
import {Comma            } from "/js/Tags/Parser/Symbol/Comma.js";
import {BracketOpen      } from "/js/Tags/Parser/Symbol/BracketOpen.js";
import {BracketClose     } from "/js/Tags/Parser/Symbol/BracketClose.js";
import {Indent           } from "/js/Tags/Parser/Symbol/Indent.js";
import {RestSymbol       } from "/js/Tags/Parser/Symbol/RestSymbol.js";

export class Module extends Tag
{
  Parse(parser)
  {
    console.log("...Module parsing...");
    let index = 0;
    while (parser.IsParsing())
    {
      // const result = parser.Match(ClassExpression)
      //             || parser.Match(ClassKeyword)
      //             || parser.Match(ExtendsKeyword)
      //             || parser.Match(WhiteSpaceSymbol)
      //             || parser.Match(ParenthesisOpenSymbol)
      //             || parser.Match(ParenthesisCloseSymbol)
      //             || parser.Match(CurlyBraceOpenSymbol)
      //             || parser.Match(CurlyBraceCloseSymbol)
      //             || parser.Match(ExtendsKeyword)
      //             || parser.Match(Identifier)
      //             // || super.Parse(parser);

      const result = parser.ParseStatement();

      if (result)
      {
        // console.log("Module matched something!");
        // line.SetAttribute("row", 0);
        // this.Add(line);
      }
      else
      {
        console.log("Module failed");
        // return false;
        break;
      }
    }

    return true;

    // const quotes = this.QueryAll("symbol.string");
    // for (let i = 0; i < quotes.length; i += 2)
    // {
    //   const start = quotes[i];
    //   const end = quotes[i];
    // }

    // import {Parser} from "/js/Tags/Parser.js";
    // this.QueryEach("keyword.import", keyword =>
    // {
    //   if (keyword.MatchYoungerSibling(""))
    //   {
    //
    //   }
    // });
  }
}

export class Unknown extends Tag
{
  Parse(parser)
  {

  }
}

let style;
export class JavaScript extends Parser
{
  static GetLocalName(){ return "javascript"; }

  static GetStyle()
  {
    return style ??= new Style().Add(
      // new CSS("java-script").DisplayBlock().BackgroundColor("#abb2bf"),
      new CSS("java-script").FontSizeXL().Padding("2em").DisplayBlock().BackgroundColor("#21252b"),
      new CSS("class-symbol, extends-symbol, return-symbol").Color("#c678dd"),
      new CSS("identifier").Color("#e5c07b"),
      new CSS("curly-brace-open-symbol, curly-brace-close-symbol, parenthesis-open-symbol, parenthesis-close-symbol, end-symbol").Color("#abb2bf"),
      new CSS("string-literal").Color("#98c379"),
      new CSS("method-expression > identifier").Color("#61afef"),
    );
  }

  static GetStyle()
  {
    return style ??= new Style().Add(
      new CSS("javascript ")
      .FontFamilyMonoSpace()
      .FontSizeXL2()
      .Padding("2em")
      .DisplayBlock()
      .BackgroundColor("#21252b")
      .WhiteSpacePre()
      // .BorderLeft("0.5em solid")
      .Add(
        new CSS(".token").DisplayInline(),
        new CSS(".hovered").BackgroundColor("rgba(153, 187, 255, 0.04)"),
        new CSS("symbol").Color("#abb2bf"),
        new CSS("symbol.operator").Color("#c678dd"),
        new CSS("keyword").Color("#c678dd"),
        new CSS("identifier").Color("#e5c07b"),
        // new CSS(" literal.string, literal.string symbol.quote").Color("#98c379"),
        new CSS("literal.numeric").Color("#d19a66"),
        new CSS(".function > identifier").Color("#61afef"),
        new CSS(".method > identifier").Color("#61afef"),
        new CSS("keyword.constant").Color("#d19a66"),
        new CSS(".parameters > identifier").Color("#e06c75"),
        new CSS(".this", ".super").Color("#e06c75"),
        new CSS("expression.call > identifier").Color("#61afef"),
        new CSS("expression.new > expression.call > identifier").Color("#e5c07b"),
        new CSS("symbol.indent").DisplayInlineBlock().Color("rgba(171, 178, 191, 0.15)").BoxShadow("inset 1px 0").Contain("paint style"),
        new CSS(".test1", ".test2", ".test3").DisplayBlock(),
        // new CSS(" .variable").Color("#e06c75"),
        // new CSS(" symbol.space").WhiteSpaceBreakSpaces(),
        // new CSS(" symbol.new-line").DisplayBlock(),
        // new CSS(" symbol.space").DisplayNone(),
      ),

      new CSS("literal.string, literal.string symbol.quote").Color("#98c379"), // Color string literals and their quote symbols
      new CSS("comment").Color("#5c6370").FontStyleItalic(),
      // new CSS("literal.string symbol.template").Color("#abb2bf"),
      new CSS("expression identifier, literal identifier").Color("#e06c75"),
      new CSS(".function > identifier, .method > identifier").Color("#61afef"),
      new CSS("keyword.class + identifier, keyword.extends + identifier").Color("#e5c07b"),
      new CSS("keyword.false, keyword.true, keyword.const + identifier").Color("#d19a66"),
      // new CSS("expression symbol").Color("#abb2bf"),
    );
  }

  SkipWhiteSpace()
  {
    // while (this.Match(Indent))
    // {
    //   console.log("Indent!");
    // }

    return super.SkipWhiteSpace();
  }

  PostMatch()
  {
    // while (this.Match(WhiteSpaceSymbol) || this.Match(NewLine))
    // {
    //
    // }

    // return this.Match(WhiteSpaceSymbol) || this.Match(NewLine);
    // return this.Match(WhiteSpaceSymbol);
  }

  BeginNewLine()
  {
    const result = super.BeginNewLine();
    // console.log("New line", JSON.stringify(this.Current()));
    // console.log("New line", this.Current(), position.toString());

    while (this.Read("  ", false))
    {
      this.Save(new Indent().Text("  "));
    }

    return result;
  }

  MatchStatement()
  {
    return undefined
        || this.Match(SingleLine) // Comments
        || this.Match(MultiLine) // Comments
        || this.Match(ConstStatement)
        || this.Match(LetStatement)
        || this.Match(VarStatement)
        || this.Match(ElseIfStatement)
        || this.Match(Else)
        || this.Match(IfStatement)
        || this.Match(Method) // Must be below If, because otherwise If () looks like a method
        || this.Match(BlockStatement)
        || this.Match(FunctionStatement)
        || this.Match(ClassStatement)
        || this.Match(ReturnStatement)
        || this.Match(ThrowStatement)
        // || this.Match(ExpressionStatement)
        // || this.Match(MethodExpression)
        // || this.Match(FunctionExpression)
        // || this.Match(ArrowFunctionExpression)
        // || this.Match(MethodExpression)
        // || this.Match(ExtendsKeyword)
        // || this.Match(WhiteSpaceSymbol)
        // || this.Match(ParenthesisOpenSymbol)
        // || this.Match(ParenthesisCloseSymbol)
        // || this.Match(CurlyBraceOpenSymbol)
        // || this.Match(CurlyBraceCloseSymbol)
        // || this.Match(ExtendsKeyword)
        // || this.Match(Identifier)
        // || super.Parse()
        ;
  }

  MatchLiteral()
  {
    return this.Match(BooleanLiteral)
        || this.Match(StringLiteral)
        || this.Match(NumberLiteral)
        ;
  }

  MatchParameters()
  {
    if (!this.Match(ParenthesisOpenSymbol)) return false;

    while (!this.Match(ParenthesisCloseSymbol))
    {
      if (this.IsAtEnd()) return this.Throw(`Expected to find closing ")"`);

      if (this.Match(Identifier))
      {
        if (this.Match(AssignmentSymbol))
        {
          this.MatchExpression(); // Do we care if it matches or not?
        }

        if (!this.Match(Comma))
        {
          return this.Match(ParenthesisCloseSymbol);
        }
      }
      else
      {
        return false;
      }
    }

    return true;
  }

  MatchExpressionSequence()
  {

  }

  MatchExpression()
  {
    return this.Match(ClassExpression)
        || this.Match(FunctionExpression)
        // || this.Match(MethodExpression)
        || this.Match(ArrowFunctionExpression)
        || this.Match(CallExpression)
        || this.Match(NewExpression)
        || this.Match(AsyncExpression)
        || this.Match(ClassKeyword)
        || this.Match(ExtendsKeyword)
        || this.Match(New)
        || this.Match(This)
        || this.Match(Super)
        || this.Match(TypeOf) // Keywords
        || this.Match(InstanceOf) // Keywords
        || this.Match(DotSymbol)
        || this.Match(NotSymbol)
        || this.Match(OrSymbol)
        || this.Match(AndSymbol)
        || this.Match(RestSymbol)
        || this.Match(ExactEqualsSymbol)
        || this.Match(EqualsSymbol)
        || this.Match(AssignmentSymbol)
        || this.Match(GroupExpression)
        || this.MatchLiteral()
        || this.Match(ParenthesisOpenSymbol)
        || this.Match(ParenthesisCloseSymbol)
        || this.Match(CurlyBraceOpenSymbol)
        || this.Match(CurlyBraceCloseSymbol)
        || this.Match(RestSymbol)
        || this.Match(Comma)
        || this.Match(NaN)
        || this.Match(Infinity)
        // || this.Match(BracketOpen)
        // || this.Match(BracketClose)
        || this.Match(Identifier)
        // || this.Match(ExtendsKeyword)
        // || this.Match(Identifier)
        ;
  }

  Parse()
  {
    while (this.MatchStatement())
    {
    }

    // if (!this.IsDone())
    // {
    //   console.log("Parser still is not done, but failed to match a statement...");
    //   // while (this.MatchExpression())
    //   // {
    //   // }
    // }

    // return this.MatchStatement() || super.Parse();
  }
}

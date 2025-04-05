import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {BlockStatement} from "/js/Tags/Parser/Statement/BlockStatement.js";
import {ClassKeyword} from "/js/Tags/Parser/Keyword/ClassKeyword.js";
import {ExtendsKeyword} from "/js/Tags/Parser/Keyword/ExtendsKeyword.js";
import {CurlyBraceOpenSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceOpenSymbol.js";
import {CurlyBraceCloseSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceCloseSymbol.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";

export class ClassExpression extends Expression
{
  Parse(p)
  {
    if (!p.Match(ClassKeyword)) return false;

    // console.log("Matched ClassKeyword");

    if (p.Match(ExtendsKeyword))
    {
      // console.log("Matched ExtendsKeyword");
      p.Expect(Identifier);
    }
    else
    {
      p.Match(Identifier); // Optional

      if (p.Match(ExtendsKeyword))
      {
        // console.log("Matched ExtendsKeyword");
        p.Expect(Identifier);
      }
    }

    // p.Match(BlockStatement);

    return p.Match(BlockStatement);
    // return p.Expect(BlockStatement);
  }

  // Parse(p)
  // {
  //   if (!p.Match(ClassKeyword)) return false;
  //
  //   if (p.Match(ExtendsKeyword))
  //   {
  //     p.Expect(Identifier);
  //   }
  //   else
  //   {
  //     p.Match(Identifier); // Optional
  //
  //     if (p.Match(ExtendsKeyword))
  //     {
  //       p.Expect(Identifier);
  //     }
  //   }
  //
  //   if (!p.Match(CurlyBraceOpenSymbol)) return false;
  //
  //   while (!p.Match(CurlyBraceCloseSymbol))
  //   {
  //     if (p.IsDone()) return p.Throw(`ClassExpression expected a closing "}"`);
  //
  //     if (!p.MatchStatement())
  //     {
  //       console.warn("Block failed to match a statement!");
  //     }
  //
  //     p.Match(EndSymbol); // Optional
  //   }
  //
  //   return true;
  //
  //   // return p.Expect(BlockStatement);
  // }

  Describe(){ return this.AddClass("class"); }
}

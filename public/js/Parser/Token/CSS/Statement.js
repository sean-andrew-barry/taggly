import {Statement as Base} from "/js/Parser/Token/Statement.js";

import * as Keywords from "/js/Parser/Token/CSS/Keyword.js";
import * as Symbols from "/js/Parser/Token/CSS/Symbol.js";
import * as Literals from "/js/Parser/Token/CSS/Literal.js";
import * as Expressions from "/js/Parser/Token/CSS/Expression.js";

export class Statement extends Base
{
  Helper(p)
  {
    return p.Match(this.GetExpression()).And();
  }

  Parse(p)
  {
    if (p.Match(this.GetKeyword()))
    {
      return p.Generic() || p.While(() => this.Helper(p))?.End();
    }
  }
}

export class BackgroundColor extends Statement
{
  GetExpression(){ return Expressions.Box; }
  GetKeyword(){ return Keywords.BackgroundColor; }
}

export class BackgroundImage extends Statement
{
  Parse(p)
  {
    if (p.Match(Keywords.BackgroundImage))
    {
      return p.Generic() || p.Match(Expressions.BgImage)?.End();
    }
  }
}

export class BackgroundRepeat extends Statement
{
  GetExpression(){ return Expressions.RepeatStyle; }
  GetKeyword(){ return Keywords.BackgroundRepeat; }
}

export class BackgroundPosition extends Statement
{
  GetExpression(){ return Expressions.BgPosition; }
  GetKeyword(){ return Keywords.BackgroundPosition; }
}

export class BackgroundAttachment extends Statement
{
  GetExpression(){ return Expressions.Attachment; }
  GetKeyword(){ return Keywords.BackgroundAttachment; }
}

export class BackgroundClip extends Statement
{
  GetExpression(){ return Expressions.Box; }
  GetKeyword(){ return Keywords.BackgroundClip; }
}

export class BackgroundOrigin extends Statement
{
  GetExpression(){ return Expressions.Box; }
  GetKeyword(){ return Keywords.BackgroundOrigin; }
}

export class BackgroundSize extends Statement
{
  GetExpression(){ return Expressions.BgSize; }
  GetKeyword(){ return Keywords.BackgroundSize; }
}

// NOTE: This definitely isn't correct
export class Background extends Statement
{
  Helper(p)
  {
    return p.Match(Expressions.BgImage)
        || p.Match(Expressions.BgPosition)
        || p.Match(Expressions.BgSize)
        || p.Match(Expressions.RepeatStyle)
        || p.Match(Expressions.Attachment)
        || p.Match(Expressions.Box)
        || p.Match(Expressions.Box);
  }

  GetKeyword(){ return Keywords.Background; }
}

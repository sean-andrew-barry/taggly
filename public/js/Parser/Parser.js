import {Token} from "/js/Parser/Token.js";
import {Skip} from "/js/Parser/Token/Skip.js";
import {String} from "/js/String.js";

export class Parser extends Token
{
  constructor(string, index, offset, line, length = string.length)
  {
    super(index, offset, line, length);

    this.string = string;
    this.stack = [this];
    this.children = [];
  }

  IsAlpha(c = this.Peek()){ return String.IsCharAlpha(c); }
  IsAlNum(c = this.Peek()){ return String.IsCharAlNum(c); }
  IsUpper(c = this.Peek()){ return String.IsCharUpper(c); }
  IsLower(c = this.Peek()){ return String.IsCharLower(c); }
  IsDigit(c = this.Peek()){ return String.IsCharDigit(c); }
  IsSpace(c = this.Peek()){ return String.IsCharSpace(c); }
  IsPunct(c = this.Peek()){ return String.IsCharPunct(c); }
  IsHex  (c = this.Peek()){ return String.IsCharHex  (c); }

  IsParsing(){ return this.length > this.GetIndex(); }

  Peek(offset = 0){ return this.string[this.GetIndex() + offset]; }
  Current(){ return this.Peek(0); }

  Take()
  {
    const c = this.Peek();
    this.Next();

    return c;
  }

  Next()
  {
    const c = this.Current();

    if (c === "\n")
    {
      this.Line();
    }
    else
    {
      this.Move();
    }

    return c;
  }

  Parse()
  {
    // this.Next();
  }

  Read(value, save = true, string_case)
  {
    const index = this.GetIndex();
    const length = value.length;

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (this.GetLength() - index)) return;

    for (let i = 0; i < length; i++)
    {
      let c = this.string[index + i];

      if      (string_case === "lower") c = c.toLowerCase();
      else if (string_case === "upper") c = c.toUpperCase();

      // If the sequence is at all different, return
      if (this.string[index + i] !== value[i]) return;
    }

    this.Move(length);

    if (save === true)
    {
      this.Save(value); // Add the value to the top tag
    }

    return this;
  }

  ReadL(value){ return this.Read(value, true, "lower") }
  ReadU(value){ return this.Read(value, true, "upper") }

  And(){ return this.WSO().Comma()?.WSO() || this; }
  End(){ return this.WSO().SemiColon()?.WSO(); }

  Generic(){ return this.Match(Expressions.Generic); }

  Range(min, max, fn)
  {
    // If it fails before reaching `min` times, fail
    for (let i = 0; i < min; i++)
    {
      if (!fn.call(this, this))
      {
        return;
      }
    }

    // Allow it to continue up to `max`, but stop as soon as it fails
    for (let i = min; i < max; i++)
    {
      if (!fn.call(this, this))
      {
        break;
      }
    }

    return this;
  }

  While(fn)
  {
    // Must pass at least once
    if (!fn.call(this, this)) return;

    // Then continue for as long as it passes
    while (fn.call(this, this))
    {
    }

    return this;
  }

  Save(token)
  {
    const top = this.GetTop();
    top.Add(token);

    return token;
  }

  Push(token)
  {
    this.stack.push(token);
    return this;
  }

  Pop(token)
  {
    const popped = this.stack.pop();
    if (popped !== token)
    {
      throw new Error(`Failed to pop token ${token}`);
    }
  }

  GetTop(){ return this.stack[this.stack.length - 1]; }

  Create(ctor, length = 0)
  {
    return new ctor(this.GetIndex(), this.GetOffset(), this.GetLine(), length);
  }

  Match(ctor)
  {
    const token = this.Create(ctor);

    this.Push(token);
    const result = token.Parse(this);
    this.Pop(token);

    if (result)
    {
      this.Save(token);
      return this;
    }
    else
    {
      // Reset position back to where we were when we created the token
      this.Copy(token);
      return undefined;
    }
  }

  Check(ctor)
  {
    this.Match(ctor);
    return this; // Even if it failed
  }

  *[Symbol.iterator]()
  {
    const children = this.GetChildren();

    while (this.GetIndex() < this.string.length)
    {
      const start = this.GetIndex();
      const current = children.length;

      if (this.Parse())
      {
        for (let i = current; i < children.length; i++)
        {
          const child = children[i];
          if (child?.length === 0)
          {
            console.log("Parsed a zero length child, exiting");
            return;
          }

          yield child;

          // if (child instanceof Token)
          // {
          //   yield* child;
          // }
        }
      }
      else
      {
        const skip = this.Create(Skip);
        skip.Parse(this);
        this.Save(skip);
      }
    }
  }
}
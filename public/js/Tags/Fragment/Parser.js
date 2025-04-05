import {Tag} from "/js/Tag.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Position} from "/js/Tags/Parser/Position.js";
import {Token} from "/js/Tags/Parser/Token.js";
import {Text} from "/js/Tags/Text.js";

const SPACE = new Set("\t\n\v\f\r ");
const ALPHA = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const ALNUM = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const DIGIT = new Set("0123456789");
const PUNCT = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

let LOOPS = new WeakMap();

export class Parser extends Fragment
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "parser"; }

  static GetSpaceSet(){ return SPACE; }
  static GetAlphaSet(){ return ALPHA; }
  static GetAlNumSet(){ return ALNUM; }
  static GetUpperSet(){ return UPPER; }
  static GetLowerSet(){ return LOWER; }
  static GetDigitSet(){ return DIGIT; }
  static GetPunctSet(){ return PUNCT; }

  constructor(content = "")
  {
    super();

    this.content = content;
    this.position = new Position(0, 0, 0, 0);
    this.stack = [this];
    this.errors = [];
    this.skipped = "";
  }

  Throw(error)
  {
    this.errors.push(error);
    // console.log("Pseudo throwing", error);
  }

  SafeLoop(tag, max)
  {
    let current = 1;
    if (LOOPS.has(tag))
    {
      current = LOOPS.get(tag);
      LOOPS.set(tag, current + 1);
    }
    else
    {
      LOOPS.set(tag, current);
    }

    if (current >= max) throw new Error(`Exceeded safe loop for "${this.GetTop().GetOuterHTML()}" tag. First error is \n\n${this.errors[0]}`);
  }

  Parse()
  {
    if (this.IsParsing())
    {
      const c = this.Take();
      console.log("Parser hit base Parse", c);

      const top = this.GetTop();
      top.AppendText(c);
    }

    return false;
  }

  // SetNode(node = this.constructor.CreateFragment()){ return super.SetNode(node); }

  SetPosition(position){ this.position = position; }
  GetPosition(){ return this.position; }
  ClonePosition(){ return this.position.Clone(); }

  IsParsing(){ return this.content.length > this.position.GetIndex(); }
  IsDone(){ return !this.IsParsing(); }
  IsAtLast(){ return (this.position.GetIndex() + 1) >= this.content.length; }
  IsAtStart(){ return this.position.GetIndex() === 0; }
  IsAtEnd(){ return (this.position.GetIndex()) >= this.content.length; }
  IsNewLine(){ return this.Current() === "\n"; }

  IsAlpha(c = this.Current()){ return ALPHA.has(c); }
  IsAlNum(c = this.Current()){ return ALNUM.has(c); }
  IsUpper(c = this.Current()){ return UPPER.has(c); }
  IsLower(c = this.Current()){ return LOWER.has(c); }
  IsDigit(c = this.Current()){ return DIGIT.has(c); }
  IsSpace(c = this.Current()){ return SPACE.has(c); }
  IsPunct(c = this.Current()){ return PUNCT.has(c); }

  Peek(offset = 1){ return this.content[this.position.GetIndex() + offset]; }
  Current(){ return this.content[this.position.GetIndex()]; }

  Read(value, save = true)
  {
    const index = this.position.GetIndex();
    const length = value.length;

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (this.content.length - index)) return false;

    for (let i = 0; i < length; i++)
    {
      // If the sequence is at all different, return false
      if (this.content[index + i] !== value[i]) return false;
    }

    this.position.Move(length);

    if (save === true)
    {
      this.Save(value); // Add the value to the top tag
    }

    return true;
  }

  Next()
  {
    const c = this.Current();

    // if (c === "\n")
    // {
    //   this.position.Line();
    //   // this.BeginNewLine();
    // }
    // else
    // {
    // }

    this.position.Move();

    return c;
  }

  BeginNewLine()
  {
    this.Save("\n");
  }

  Take()
  {
    const c = this.Current();
    this.Next();

    return c;
  }

  SkipWhiteSpace()
  {
    // console.log("~~~ Parser skipping white space");
    while (this.IsParsing())
    {
      switch (this.Current())
      {
        case "\n":
        {
          this.position.Line();
          break;
        }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          this.position.Move();
          break;
        }

        // Non whitespace character, so we're done
        default: return;
      }
    }
  }

  SkipWhiteSpace(save = true)
  {
    while (this.IsParsing())
    {
      let c = this.Current();
      switch (c)
      {
        case "\n":
        {
          this.position.Line();

          if (save === true)
          {
            this.BeginNewLine(this.position);
          }

          break;
        }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          if (save === true)
          {
            this.Save(c);
          }

          this.position.Move();
          break;
        }

        // Non whitespace character, so we're done
        default: return;
      }
    }
  }

  Continue()
  {
    const c = this.Next();

    this.Save(c);

    return this.IsParsing();
  }

  Save(tag, offset = 1)
  {
    const top = this.GetTag(offset);

    if (typeof(tag) === "string")
    {
      top.AppendText(tag, Text);
      // this.skipped += tag;
    }
    else
    {
      // if (this.skipped.length > 0)
      // {
      //   top.AppendText(this.skipped, Text);
      //   this.skipped = "";
      // }

      // console.log("Adding", tag.GetLocalName(), "to top", top.GetLocalName() || top.GetNodeName());
      top.AppendChild(tag);
    }

    return tag;
  }

  PreMatch()
  {
  }

  PostMatch()
  {
  }

  Match(ctor)
  {
    // this.SafeLoop(this.GetTop(), 1000);

    // this.SkipWhiteSpace();

    const start = this.ClonePosition();

    const tag = new ctor();

    this.Push(tag);
    const result = tag.Parse(this);
    this.Pop(tag);

    if (result === true)
    {
      if (this.GetPosition().GetIndex() === start.GetIndex())
      {
        console.log("Match failed to advance!");
      }

      this.Save(tag);

      return true;
    }
    else
    {
      this.SetPosition(start);
      return false;
    }
  }

  Expect(ctor)
  {
    const result = this.Match(ctor);
    if (result !== true)
    {
      const top = this.GetTop();
      return this.Throw(new Error(`${top.constructor.name} expected a "${ctor.name}" tag`));
    }

    return true;
  }

  Check(ctor)
  {
    const start = this.ClonePosition();

    const tag = new ctor();

    this.Push(tag);
    const result = tag.Parse(this);
    this.Pop(tag);

    this.SetPosition(start);

    return result === true;
  }

  Push(tag)
  {
    this.stack.push(tag);
    return this;
  }

  Pop(tag)
  {
    const popped = this.stack.pop();
    if (popped !== tag)
    {
      throw new Error(`Failed to pop tag ${tag}`);
    }

    return this;
  }

  GetTop(){ return this.stack[this.stack.length - 1]; }
  GetTag(offset = 0){ return this.stack[this.stack.length - offset]; }
}

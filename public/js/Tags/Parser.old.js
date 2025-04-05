import {Tag} from "/js/Tag.js";
import {Position} from "/js/Tags/Parser/Position.js";

const SPACE = new Set("\t\n\v\f\r ");
const ALPHA = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const ALNUM = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const DIGIT = new Set("0123456789");
const PUNCT = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

export class Parser extends Tag
{
  static GetSpaceSet(){ return SPACE; }
  static GetAlphaSet(){ return ALPHA; }
  static GetAlNumSet(){ return ALNUM; }
  static GetUpperSet(){ return UPPER; }
  static GetLowerSet(){ return LOWER; }
  static GetDigitSet(){ return DIGIT; }
  static GetPunctSet(){ return PUNCT; }

  constructor(tag, content)
  {
    super();

    this.tag = tag;
    this.content = content;
    this.position = new Position(0, 0, 0, 0);
    this.stack = [this];
    // this.temp = "";
  }

  SetNode(node = this.constructor.CreateFragment()){ return super.SetNode(node); }

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

  Read(value)
  {
    const index = this.position.GetIndex();
    const length = value.length;

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (this.content.length - index)) return false;

    for (let i = 0; i < length; i++)
    {
      // If the sequence is at all different, return
      if (this.content[index + i] !== value[i]) return false;
    }

    this.position.Move(length);
    return true;
  }

  Read(value)
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
    this.Save(value); // Add the value to the top tag

    return true;
  }

  Next()
  {
    const c = this.Current();

    if (c === "\n") this.position.Line();
    else this.position.Move();

    return c;
  }

  Take()
  {
    const c = this.Current();
    this.Next();

    return c;
  }

  SkipWhiteSpace()
  {
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

  // Skip(skip = 1)
  // {
  //   this.skip += this.Take();
  //   // this.position.Skip(skip);
  //   // this.position.index += 1;
  //   // this.position.skip = this.position.GetIndex();
  //   return this;
  // }

  // Invoke this.tag.Parse(this) again
  Recurse()
  {
    if (this.IsDone()) return false;
    return this.tag.Parse(this) === true;
  }

  Recurse()
  {
    if (this.IsDone()) return false;

    if (this.tag.Parse(this))
    {
      this.Save(this.temp);
      this.temp = "";
      return true;
    }
    else
    {
      // this.Save(this.Take());

      // Take the next character and give it to the top tag
      this.temp += this.Take();
      return false;
    }
  }

  Recurse()
  {
    if (this.IsDone()) return false;

    if (this.tag.Parse(this))
    {
      return true;
    }
    else
    {
      // Take the next character and give it to the top tag
      this.Save(this.Take());
      return false;
    }
  }

  // TODO: Depreciate?
  Save(tag)
  {
    const top = this.stack[this.stack.length - 1];

    if (typeof(tag) === "string")
    {
      top.AppendText(tag);
    }
    else
    {
      // console.log("Adding", tag.GetLocalName(), "to top", top.GetLocalName());
      top.AppendChild(tag);
    }

    return tag;
  }

  Match(ctor)
  {
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

      // tag.Normalize();
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
      throw new Error(`${top.constructor.name} expected a "${ctor.name}" tag`);
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

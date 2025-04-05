import {Position} from "/js/Parser/Position.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Text} from "/js/Tags/Text.js";

const SPACE = new Set("\t\n\v\f\r ");
const ALPHA = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const ALNUM = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const DIGIT = new Set("0123456789");
const PUNCT = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

// const TOKENS = new Set();
const FORMATTER = new Intl.NumberFormat();

export class Parser
{
  static GetSpaceSet(){ return SPACE; }
  static GetAlphaSet(){ return ALPHA; }
  static GetAlNumSet(){ return ALNUM; }
  static GetUpperSet(){ return UPPER; }
  static GetLowerSet(){ return LOWER; }
  static GetDigitSet(){ return DIGIT; }
  static GetPunctSet(){ return PUNCT; }

  constructor(tag, content = tag.GetText())
  {
    this.tag = tag;
    this.content = content;
    this.position = new Position(0, 0, 0, 0);
    this.stack = [new Fragment()];
  }

  Begin()
  {
    const length = this.content.length;
    // console.log("Starting", length);
    const start = performance.now();

    const tag = this.GetTop();

    let matched = false;
    while (this.Parse())
    {
      matched = true;
    }

    const end = performance.now();

    const total = end - start;
    const ns_per = (total / length) * 1000;

    // console.log("Parsing took", FORMATTER.format(total), "ms for", FORMATTER.format(ns_per), "microseconds per character");

    // const tokens = [...TOKENS].sort((a, b) =>
    // {
    //   return a.GetTotal() - b.GetTotal();
    // });

    // for (const token of tokens)
    // {
    //   console.log(token.name, "took", token.GetTotal());
    // }

    // console.log("Hit base parse", this.parse_count, "times");

    // console.log(matched, tag);
    // matched = tag.HasChildNodes();

    if (matched) return tag;
    else return undefined;

    // return matched;
  }

  // *[Symbol.iterator]()
  // {
  //   console.log("Beginning parsing...");
  //
  //   while (this.Parse())
  //   {
  //     matched = true;
  //   }
  // }

  StartedParse()
  {
    this.parse_count ??= 0;
    this.parse_count += 1;
  }

  Parse(){ return this.Continue(); }

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
      this.Save(value, index, index + length); // Add the value to the top tag
    }

    return true;
  }

  Next()
  {
    const c = this.Current();

    if (c === "\n")
    {
      this.position.Line();
    }
    else
    {
      this.position.Move();
    }

    return c;
  }

  Take()
  {
    const c = this.Current();
    this.Next();

    return c;
  }

  Continue()
  {
    const c = this.Next();

    this.Save(c);

    return this.IsParsing();
  }

  Save(tag)
  {
    const top = this.GetTop();

    if (typeof(tag) === "string")
    {
      top.AppendChild(new Text(tag));
    }
    else
    {
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
    // TOKENS.add(ctor);

    // ctor.Start();
    const start = this.ClonePosition();

    const tag = new ctor();

    this.Push(tag);
    const result = tag.Parse(this);
    this.Pop(tag);

    if (result === true)
    {
      const start_index = start.GetIndex();
      const end_index = this.position.GetIndex();

      // console.log(tag.GetLocalName(), end_index - start_index);
      this.Save(tag);
      // ctor.Stop();
      return true;
    }
    else
    {
      this.SetPosition(start);
      // ctor.Stop();
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
    // ctor.Start();
    const start = this.ClonePosition();

    const tag = new ctor();

    this.Push(tag);
    const result = tag.Parse(this);
    this.Pop(tag);

    if (result === true)
    {
      this.Save(tag);
    }
    else
    {
      this.SetPosition(start);
    }

    // ctor.Stop();
    return true; // True even if it failed
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

  GetChunk(range = 20)
  {
    const index = this.position.GetIndex();
    const min = Math.max(index - range, 0);
    const max = Math.min(index + range, this.content.length - 1);

    return `${this.position}: ${JSON.stringify(this.content.substring(min, max))}`;
  }

  GetTop(){ return this.stack[this.stack.length - 1]; }
  GetBottom(){ return this.stack[0]; }
  GetTag(offset = 0){ return this.stack[this.stack.length - offset]; }
}

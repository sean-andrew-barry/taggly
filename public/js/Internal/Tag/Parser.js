import {Tag} from "/js/Tag.js";
import {Position} from "/js/Tags/Parser/Position.js";
import {Token} from "/js/Tags/Parser/Token.js";
import {Text} from "/js/Tags/Text.js";
import {Head} from "/js/Tags/Head.js";
import {BR} from "/js/Tags/BR.js";
import {Connect} from "/js/Event/Connect.js";
import {Input} from "/js/Event/Input.js";

const SPACE = new Set("\t\n\v\f\r ");
const ALPHA = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const ALNUM = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const DIGIT = new Set("0123456789");
const PUNCT = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

let LOOPS = new WeakMap();

export class Parser extends Tag
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

  static GetStyle(){}

  constructor()
  {
    super();

    // this.position = new Position(0, 0, 0, 0);
    // this.stack = [this];
  }

  // Text(text)
  // {
  //   if (typeof(text) === "string")
  //   {
  //     text = new Text(text);
  //   }
  //
  //   return this.Clear().AppendChild(text);
  // }

  Reset(tag, content)
  {
    // // NOTE: IDK if this is acceptable, but seems to make the parsing easier?
    // this.content = content.replaceAll("\r", "");

    LOOPS = new WeakMap();

    const children = tag.GetChildren();

    tag.Clear();

    this.content = content;
    this.position = new Position(0, 0, 0, 0);
    this.stack = [tag];
    this.errors = [];

    try
    {
      const start = performance.now();

      if (!tag.Parse(this))
      {
        tag.Add.apply(tag, children);
        return;

        // console.log("Failed to parse anything with", tag.GetNode());

        // const parent = tag.QueryClosest("statement") || this;
        //
        // if (parent !== tag)
        // {
        //   console.log("Failed to parse anything with", tag);
        //   return this.Reset(parent, parent.GetText());
        // }
      }

      // while (this.IsParsing())
      // {
      //   tag.Parse(this);
      // }
      const end = performance.now();
      console.log("Parsing took", end - start, "ms");
    }
    catch (error)
    {
      console.log("Parsing failed\n", content, "\n", error);
      // tag.Text(content);
      // tag.Add.apply(tag, children);

      // if (tag !== this)
      // {
      //   console.log("Resetting the whole parser...");
      //   this.Reset(this, this.GetText());
      // }
    }
    // console.log("Resulting text:", this.GetText());
  }

  [Connect](event)
  {
    this.Reset(this, this.GetText());

    Head.Get().AppendChild(this.constructor.GetStyle());
    // this.Add(this.constructor.GetStyle());

    this.ContentEditable();
  }

  [Input](event)
  {
    console.log(event);
    const selection = window.getSelection();
    // console.log(selection);
    const tag = selection.focusNode?.tag?.GetParent();
    if (tag)
    {
      const parent = tag.GetParent();
      if (parent)
      {
        const range = document.createRange();

        range.setStart(parent.GetNode(), 0);
        range.setEnd(selection.baseNode, selection.baseOffset);

        const offset = range.toString().length + event.data.length;

        // console.log(range);
        // console.log(range.toString());

        const text = parent.GetText();
        parent.Clear();
        this.Reset(text, parent);

        console.log("Offset", offset);

        range.collapse(true);
        range.setStart(parent.GetFirstChildNode(), 1);
        // range.setStart(parent.GetNode(), offset);
        // range.setEnd(parent.GetNode(), 0);
        // selection.collapse(parent.GetNode(), 0);
        selection.removeAllRanges();
        selection.addRange(range);

        console.log(parent.GetNode(), parent.GetText());
        // selection.setBaseAndExtent(range);
      }
      // console.log("Input", selection, parent.GetNode());
    }
  }

  [Input](event)
  {
    event.preventDefault();

    const selection = window.getSelection();
    const tag = selection.focusNode?.tag?.GetParent();
    if (tag)
    {
      const parent = tag.QueryClosest("statement") || this;
      if (parent)
      {
        const range = document.createRange();

        range.setStart(parent.GetNode(), 0);
        range.setEnd(selection.baseNode, selection.baseOffset);

        let offset = 0;
        switch (event.inputType)
        {
          case "deleteContentBackward":
          {
            offset = range.toString().length;
            break;
          }
          case "insertText":
          {
            offset = range.toString().length - 1 + event.data.length;
            break;
          }
          case "deleteContentForward":
          {
            offset = range.toString().length;
            break;
          }
          case "historyUndo":
          {
            offset = range.toString().length - 1;
            break;
          }
          case "insertParagraph":
          {
            offset = range.toString().length - 1;
            break;
          }
          default:
          {
            console.log("Unknown event.inputType", event);
            offset = range.toString().length - 1;
          }
        }

        const text = parent.GetText();
        this.Reset(parent, text);

        const r = parent.CreateRangeHelper({ count: offset });
        if (r)
        {
          r.collapse(false);
          selection.removeAllRanges();
          selection.addRange(r);
        }
      }
    }
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

    if (c === "\n")
    {
      // this.position.Line();
      this.NewLine();
    }

    else this.position.Move();

    return c;
  }

  BeginNewLine()
  {
    // this.Save(new BR());
    this.Save("\n");
  }

  // Next()
  // {
  //   const c = this.Current();
  //
  //   this.SkipWhiteSpace();
  //
  //   // if (c === "\n") this.position.Line();
  //   // else this.position.Move();
  //   //
  //   // this.SkipWhiteSpace();
  //
  //   this.position.Move();
  //
  //   return c;
  // }

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

  SkipWhiteSpace()
  {
    while (this.IsParsing())
    {
      let c = this.Current();
      switch (c)
      {
        case "\n":
        {
          // this.Save(new BR());
          // this.NewLine();
          // console.log("New line!", this.position.toString());
          // this.Save(c);
          // this.Save(c, 1);
          this.position.Line();

          this.BeginNewLine(this.position);
          break;
        }
        // case "\r":
        // {
        //   // this.Save(c);
        //   this.position.Move();
        //   break;
        // }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          this.Save(c);
          // this.Save("\0");
          // this.Save("_");
          this.position.Move();
          break;
        }

        // Non whitespace character, so we're done
        default: return;
      }
    }
  }

  // SkipWhiteSpace()
  // {
  //   while (this.IsParsing())
  //   {
  //     let c = this.Current();
  //     switch (c)
  //     {
  //       case " ":
  //       case "\t":
  //       case "\v":
  //       case "\f":
  //       case "\r":
  //       {
  //         // this.Save("\u00A0");
  //         // this.Save("\0");
  //         this.Save("_");
  //         this.position.Move();
  //         break;
  //       }
  //
  //       // Non whitespace character, so we're done
  //       default: return;
  //     }
  //   }
  // }

  // SkipLineSpace()
  // {
  //   while (this.IsParsing())
  //   {
  //     let c = this.Current();
  //     // if (c === "\n")
  //     // {
  //     //   const n = this.Current();
  //     //   if (n === "\r")
  //     //   {
  //     //     this.Save(new BR());
  //     //     this.position.Move();
  //     //     this.position.Move();
  //     //   }
  //     // }
  //     switch (c)
  //     {
  //       case "\n":
  //       {
  //         this.Save(new BR());
  //         this.position.Line();
  //         break;
  //       }
  //       // case "\r":
  //       // {
  //       //   this.position.Move();
  //       //   break;
  //       // }
  //
  //       // Non whitespace character, so we're done
  //       default: return;
  //     }
  //   }
  // }

  // SkipLineSpace()
  // {
  //   if (this.Current() === "\n")
  //   {
  //     this.Next();
  //     this.Save(new BR());
  //   }
  //   // return this.Read("\n");
  // }

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

  Save(tag, offset = 1)
  {
    const top = this.GetTag(offset);

    if (typeof(tag) === "string")
    {
      top.AppendText(tag, Text);
    }
    else
    {
      // console.log("Adding", tag.GetLocalName(), "to top", top.GetLocalName());
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
    this.SafeLoop(this.GetTop(), 1000);

    // this.PreMatch();
    this.SkipWhiteSpace();

    const start = this.ClonePosition();

    // if (start.GetOffset() === 0)
    // {
    //   this.BeginNewLine(start);
    // }

    const tag = new ctor();

    this.Push(tag);
    const result = tag.Parse(this);
    this.Pop(tag);

    if (result === true)
    {
      // console.log("Matched", ctor.name);
      if (this.GetPosition().GetIndex() === start.GetIndex())
      {
        console.log("Match failed to advance!");
      }

      // tag.Normalize();
      this.Save(tag);
      // this.SkipLineSpace();
      // this.SkipLineSpace();

      // this.PostMatch();
      // if (tag instanceof Token)
      // {
      //   tag.Describe();
      // }

      // this.SkipWhiteSpace();

      return true;
    }
    else
    {
      this.SetPosition(start);
      return false;
    }
  }

  // *Generate(ctor)
  // {
  //   const tag = new ctor();
  //
  //   for (const result of tag.Generate())
  //   {
  //
  //   }
  // }

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

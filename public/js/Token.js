import {String} from "/js/String.js";
import {StringBuilder} from "/js/Utility/StringBuilder.js";

const LOWER = Symbol("Lower");
const UPPER = Symbol("Upper");
let Tokens;

class Base
{
  static SetTokens(tokens){ Tokens = tokens; }

  IsAlpha(c = this.Peek()){ return String.IsPointAlpha(c.codePointAt(0)); }
  IsAlNum(c = this.Peek()){ return String.IsPointAlNum(c.codePointAt(0)); }
  IsUpper(c = this.Peek()){ return String.IsPointUpper(c.codePointAt(0)); }
  IsLower(c = this.Peek()){ return String.IsPointLower(c.codePointAt(0)); }
  IsDigit(c = this.Peek()){ return String.IsPointDigit(c.codePointAt(0)); }
  IsSpace(c = this.Peek()){ return String.IsPointSpace(c.codePointAt(0)); }
  IsPunct(c = this.Peek()){ return String.IsPointPunct(c.codePointAt(0)); }
  IsHex  (c = this.Peek()){ return String.IsPointHex  (c.codePointAt(0)); }
  IsBreak(c = this.Peek()){ return String.IsPointBreak(c.codePointAt(0)); }

  // IsAlpha(c = this.Code()){ return String.IsPointAlpha(c); }
  // IsAlNum(c = this.Code()){ return String.IsPointAlNum(c); }
  // IsUpper(c = this.Code()){ return String.IsPointUpper(c); }
  // IsLower(c = this.Code()){ return String.IsPointLower(c); }
  // IsDigit(c = this.Code()){ return String.IsPointDigit(c); }
  // IsSpace(c = this.Code()){ return String.IsPointSpace(c); }
  // IsPunct(c = this.Code()){ return String.IsPointPunct(c); }
  // IsHex  (c = this.Code()){ return String.IsPointHex  (c); }
  // IsBreak(c = this.Code()){ return String.IsPointBreak(c); }

  // IsAlpha(c = this.Peek()){ return String.IsPointAlpha(c.charCodeAt(0)); }
  // IsAlNum(c = this.Peek()){ return String.IsPointAlNum(c.charCodeAt(0)); }
  // IsUpper(c = this.Peek()){ return String.IsPointUpper(c.charCodeAt(0)); }
  // IsLower(c = this.Peek()){ return String.IsPointLower(c.charCodeAt(0)); }
  // IsDigit(c = this.Peek()){ return String.IsPointDigit(c.charCodeAt(0)); }
  // IsSpace(c = this.Peek()){ return String.IsPointSpace(c.charCodeAt(0)); }
  // IsPunct(c = this.Peek()){ return String.IsPointPunct(c.charCodeAt(0)); }
  // IsHex  (c = this.Peek()){ return String.IsPointHex  (c.charCodeAt(0)); }
  // IsBreak(c = this.Peek()){ return String.IsPointBreak(c.charCodeAt(0)); }

  // IsAlpha(c = this.Peek()){ return String.IsCharAlpha(c); }
  // IsAlNum(c = this.Peek()){ return String.IsCharAlNum(c); }
  // IsUpper(c = this.Peek()){ return String.IsCharUpper(c); }
  // IsLower(c = this.Peek()){ return String.IsCharLower(c); }
  // IsDigit(c = this.Peek()){ return String.IsCharDigit(c); }
  // IsSpace(c = this.Peek()){ return String.IsCharSpace(c); }
  // IsPunct(c = this.Peek()){ return String.IsCharPunct(c); }
  // IsHex  (c = this.Peek()){ return String.IsCharHex  (c); }
  // IsBreak(c = this.Peek()){ return String.IsCharBreak(c); }

  // Read(value, string_case)
  // {
  //   console.log("~READ", value);
  //   const start = this.GetPosition();
  //   const length = value.length;

  //   // If the input string would extend beyond the parser string, it cannot match
  //   if (length > (this.#string.length - start)) return false;

  //   for (let i = 0; i < length; i++)
  //   {
  //     let c = this.#string[start + i];

  //     if      (string_case === LOWER) c = c.toLowerCase();
  //     else if (string_case === UPPER) c = c.toUpperCase();

  //     // If the sequence is at all different, return
  //     if (c !== value[i]) return false;
  //   }

  //   const text = Tokens.Text.From(this);
  //   text.Walk(length);
  //   this.Append(text);

  //   return true;
  // }

  // _Read(value, string_case)
  // {
  //   const start = this.GetPosition();
  //   const length = value.length;

  //   // If the input string would extend beyond the parser string, it cannot match
  //   if (length > (this.#string.length - start)) return false;

  //   for (let i = 0; i < length; i++)
  //   {
  //     let c = this.#string[start + i];

  //     if      (string_case === LOWER) c = c.toLowerCase();
  //     else if (string_case === UPPER) c = c.toUpperCase();

  //     // If the sequence is at all different, return
  //     if (c !== value[i]) return false;
  //   }

  //   this.Walk(length);

  //   return true;
  // }

  // ReadL(value){ return this.Read(value, LOWER); }
  // ReadU(value){ return this.Read(value, UPPER); }

  // Save(value)
  // {
  //   // console.log("Saving", value);
  //   this.Append(value);
  // }
}

export class TokenPrivate extends Base
{
  static From(t)
  {
    return new this(t.#string, t.#end, t.#end, t.#line, t.#offset);
  }

  constructor(string, start = 0, end = 0, line = 0, offset = 0)
  {
    super();

    this.#string = string;
    this.#start = start;
    this.#end = end;
    this.#offset = offset;
    this.#line = line;
  }

  #string;
  #start;
  #end;
  #line; // The current line
  #offset; // The offset in the line
  #parent;
  #first_child;
  #prev_sibling;
  #next_sibling;

  GetParent(){ return this.#parent; }
  GetFirstChild(){ return this.#first_child; }
  GetPrevSibling(){ return this.#prev_sibling; }
  GetNextSibling(){ return this.#next_sibling; }

  Append(token)
  {
    if (typeof token === "string")
    {
      console.log("~~~~Appended string", token);
      token = new Tokens.Text(token);
      // token = Tokens.Text(token);
    }

    // When a token is appended, the parent gains its length
    this.#end += token.GetLength();

    token.#parent = this;
    
    if (!this.#first_child)
    {
      this.#first_child = token;
      return;
    }

    let current_child = this.#first_child;
    while (current_child.#next_sibling)
    {
      current_child = current_child.#next_sibling;
    }

    current_child.#next_sibling = token;
    token.#prev_sibling = current_child;
  }

  Remove()
  {
    // When a token is removed, the parent loses its length
    this.#parent.#end -= this.GetLength();

    // Update parent's first_child if this is the first child
    if (this.#parent && this.#parent.#first_child === this)
    {
      this.#parent.#first_child = this.#next_sibling;
    }

    // Update the next sibling's prev_sibling to bypass this node
    if (this.#next_sibling)
    {
      this.#next_sibling.#prev_sibling = this.#prev_sibling;
    }

    // Update the previous sibling's next_sibling to bypass this node
    if (this.#prev_sibling)
    {
      this.#prev_sibling.#next_sibling = this.#next_sibling;
    }

    // Clear the parent and sibling links for the removed node
    this.#parent = undefined;
    this.#prev_sibling = undefined;
    this.#next_sibling = undefined;
  }

  Match(ctor, append = true)
  {
    const token = ctor.From(this);

    if (token.Parse())
    {
      // console.log(this.GetName(), "Matched, adding length", token.#length);
      // this.#length += token.#length;

      if (append)
      {
        this.Append(token);
      }

      return true;
    }
    else
    {
      return false;
    }
  }

  Check(ctor)
  {
    this.Match(ctor);
    return true;
  }

  Optional(ctor)
  {
    this.Match(ctor);
    return true;
  }

  // Clone(){ return new this.constructor(this.#string, this.#index, this.#offset, this.#line, this.#length); }

  // Set(index, offset, line, length)
  // {
  //   this.#index = index;
  //   this.#offset = offset;
  //   this.#line = line;
  //   this.#length = length;
  // }

  // SetIndex(n){ this.#index = n; }
  // SetOffset(n){ this.#offset = n; }
  // SetLine(n){ this.#line = n; }
  // SetLength(n){ this.#length = n; }

  // AddIndex(n = 1){ this.#index += n; }
  // AddOffset(n = 1){ this.#offset += n; }
  // AddLine(n = 1){ this.#line += n; }
  // AddLength(n = 1){ this.#length += n; }

  GetString(){ return this.#string; }
  GetStart(){ return this.#start; }
  GetEnd(){ return this.#end; }
  GetLine(){ return this.#line; }
  GetOffset(){ return this.#offset; }
  GetLength(){ return this.#end - this.#start; }
  GetName(){ return this.constructor.name; }
  GetTotal(){ return this.#string.length; } // Total characters in the string
  GetRemaining(){ return this.#string.length - this.#end; } // Characters remaining relative to this token
  HasChildren(){ return !!this.#first_child; }
  GetText(){ return this.Substring(); }

  IsParsing(){ return this.GetTotal() > this.GetEnd(); }
  // IsDone(){ return !this.IsParsing(); }
  // IsAtLast(){ return (this.GetPosition() + 1) >= this.GetEnd(); }
  // IsAtStart(){ return this.GetPosition() === 0; }
  // IsAtEnd(){ return (this.GetPosition()) >= this.GetEnd(); }

  Substring(start = this.#start, end = this.#end)
  {
    // console.log("Getting substring at", start, length);
    return this.#string.slice(start, end);
  }

  // Reset()
  // {
  //   this.#index = 0;
  //   this.#offset = 0;
  //   this.#line = 0;
  //   this.#length = 0;
  // }

  // Back(n = 1)
  // {
  //   this.#length -= n;
  //   this.#offset -= n;
  // }

  // Move(n = 1)
  // {
  //   this.#length += n;
  //   this.#offset += n;
  // }

  // Skip(n = 1)
  // {
  //   this.Move(n);
  //   this.#length += n;
  // }

  // Line()
  // {
  //   this.#length += 1;
  //   this.#offset = 0; // Reset line offset
  //   this.#line += 1;
  // }

  IsSame(token)
  {
    return this.GetStart () === token.GetStart ()
        && this.GetEnd   () === token.GetEnd   ()
        && this.GetOffset() === token.GetOffset()
        && this.GetLine  () === token.GetLine  ();
  }

  // Copy(token)
  // {
  //   this.#index = token.GetIndex();
  //   this.#offset = token.GetOffset();
  //   this.#line = token.GetLine();
  // }

  Parse()
  {
  }

  Validate()
  {
  }

  Format(builder)
  {
    builder.NL(`${this.GetName()}<${this.GetStart()}, ${this.GetEnd()}>`).Add("{").In();

    let child = this.#first_child;
    while (child)
    {
      child.Format(builder);
      child = child.#next_sibling;
    }

    builder.Out().NL("}");
  }

  Print()
  {
    const builder = new StringBuilder().NL();

    this.Format(builder);

    return builder.Render();
  }

  toString(){ return `${this.GetName()} [${this.GetStart()}, ${this.GetEnd()}, ${this.GetLine()}, ${this.GetOffset()}]`; }

  GetPosition(){ return this.#end; }
  Peek(offset = 0){ return this.#string[this.GetPosition() + offset] ?? ""; }
  Current(){ return this.Peek(0); }
  
  Step()
  {
    const c = this.Peek();

    // If it's a break (AKA a new line)
    if (this.IsBreak(c))
    {
      this.#end += 1;
      this.#offset = 0; // Reset line offset
      this.#line += 1;
    }
    else
    {
      this.#end += 1;
      this.#offset += 1;
    }
  }

  Walk(steps = 1)
  {
    for (let i = 0; i < steps; i++)
    {
      this.Step();
    }
  }

  Take()
  {
    const c = this.Peek();
    this.Step();

    return c;
  }
}

export class TokenPublic extends Base
{
  static From(t)
  {
    // return new this(t.string, t.end, t.end, t.line, t.offset);
    return new this(t);
  }

  // constructor(string = "", start = 0, end = 0, line = 0, offset = 0)
  constructor(token)
  {
    super();

    if (typeof token === "string")
    {
      this.string = token;
      this.start = 0;
      this.end = 0;
      this.line = 0;
      this.offset = 0;
    }
    else
    {
      this.string = token.string;
      this.start = token.end;
      this.end = token.end;
      this.line = token.line;
      this.offset = token.offset;
    }
  }

  Log(...args){ console.log(...args); return true; }

  // string;
  // start;
  // end;
  // line; // The current line
  // offset; // The offset in the line
  // parent;
  // first_child;
  // last_child;
  // prev_sibling;
  // next_sibling;

  GetParent(){ return this.parent; }
  GetFirstChild(){ return this.first_child; }
  GetLastChild(){ return this.last_child; }
  GetPrevSibling(){ return this.prev_sibling; }
  GetNextSibling(){ return this.next_sibling; }

  Append(token)
  {
    // When a token is appended, the parent gains its length
    this.end += token.GetLength();
  
    token.parent = this;
    
    if (!this.first_child)
    {
      this.first_child = token;
      this.last_child = token; // Set last_child when first child is added
      return;
    }
  
    // Directly access last_child to append new token
    this.last_child.next_sibling = token;
    token.prev_sibling = this.last_child;
  
    // Update last_child to point to the newly added token
    this.last_child = token;
  }

  Remove()
  {
    // When a token is removed, the parent loses its length
    this.parent.end -= this.GetLength();
  
    // Update parent's first_child and last_child if this is either
    if (this.parent)
    {
      if (this.parent.first_child === this)
      {
        this.parent.first_child = this.next_sibling;
      }
      
      if (this.parent.last_child === this)
      {
        this.parent.last_child = this.prev_sibling;
      }
    }
  
    // Update the next sibling's prev_sibling to bypass this node
    if (this.next_sibling)
    {
      this.next_sibling.prev_sibling = this.prev_sibling;
    }
  
    // Update the previous sibling's next_sibling to bypass this node
    if (this.prev_sibling)
    {
      this.prev_sibling.next_sibling = this.next_sibling;
    }
  
    // Clear the parent and sibling links for the removed node
    this.parent = undefined;
    this.prev_sibling = undefined;
    this.next_sibling = undefined;
  }

  Test(ctor)
  {
    const token = new ctor(this);

    if (token.Parse())
    {
      return token;
    }
  }

  Match(ctor)
  {
    const token = new ctor(this);

    if (token.Parse())
    {
      this.Append(token);
      token.Validate();

      return true;
    }
    else
    {
      return false;
    }
  }

  _Match(ctor)
  {
    const token = this.Test(ctor);

    if (token)
    {
      this.Append(token);
      return true;
    }
    else
    {
      return false;
    }
  }

  Check(ctor)
  {
    this.Match(ctor);
    return true;
  }

  Force(ctor){ return this.Match(ctor); }
  Optional(ctor){ return this.Allow(ctor); }

  Allow(ctor)
  {
    this.Match(ctor);
    return true;
  }

  GetString(){ return this.string; }
  GetStart(){ return this.start; }
  GetEnd(){ return this.end; }
  GetLine(){ return this.line; }
  GetOffset(){ return this.offset; }
  GetLength(){ return this.end - this.start; }
  GetName(){ return this.constructor.name; }
  GetTotal(){ return this.string.length; } // Total characters in the string
  GetRemaining(){ return this.string.length - this.end; } // Characters remaining relative to this token
  HasChildren(){ return !!this.first_child; }
  GetText(){ return this.Substring(); }

  IsParsing(){ return this.GetTotal() > this.GetEnd(); }

  Substring(start = this.start, end = this.end)
  {
    // console.log("Getting substring at", start, length);
    return this.string.substring(start, end);
  }

  IsSame(token)
  {
    return this.GetStart () === token.GetStart ()
        && this.GetEnd   () === token.GetEnd   ()
        && this.GetOffset() === token.GetOffset()
        && this.GetLine  () === token.GetLine  ();
  }

  // Copy(token)
  // {
  //   this.#index = token.GetIndex();
  //   this.#offset = token.GetOffset();
  //   this.#line = token.GetLine();
  // }

  Parse()
  {
  }

  Validate()
  {
  }

  Format(builder)
  {
    builder.NL(`${this.GetName()}<${this.GetStart()}, ${this.GetEnd()}>`).Add("{").In();

    let child = this.first_child;
    while (child)
    {
      child.Format(builder);
      child = child.next_sibling;
    }

    builder.Out().NL("}");
  }

  Print()
  {
    const builder = new StringBuilder().NL();

    this.Format(builder);

    return builder.Render();
  }

  toString(){ return `${this.GetName()} [${this.GetStart()}, ${this.GetEnd()}, ${this.GetLine()}, ${this.GetOffset()}]`; }

  GetPosition(){ return this.end; }
  Peek(offset = 0){ return this.string[this.GetPosition() + offset] ?? ""; }
  // Peek(offset = 0){ return this.string.charAt(this.GetPosition() + offset) ?? ""; }
  Code(offset = 0){ return this.string.codePointAt(this.GetPosition() + offset); }
  Current(){ return this.Peek(0); }

  IsAlphaAt(offset = 0){ return String.IsPointAlpha(this.string.codePointAt(this.end + offset)); }
  IsAlNumAt(offset = 0){ return String.IsPointAlNum(this.string.codePointAt(this.end + offset)); }
  IsUpperAt(offset = 0){ return String.IsPointUpper(this.string.codePointAt(this.end + offset)); }
  IsLowerAt(offset = 0){ return String.IsPointLower(this.string.codePointAt(this.end + offset)); }
  IsDigitAt(offset = 0){ return String.IsPointDigit(this.string.codePointAt(this.end + offset)); }
  IsSpaceAt(offset = 0){ return String.IsPointSpace(this.string.codePointAt(this.end + offset)); }
  IsPunctAt(offset = 0){ return String.IsPointPunct(this.string.codePointAt(this.end + offset)); }
  IsHexAt  (offset = 0){ return String.IsPointHex  (this.string.codePointAt(this.end + offset)); }
  IsBreakAt(offset = 0){ return String.IsPointBreak(this.string.codePointAt(this.end + offset)); }
  
  Step()
  {
    // If it's a break (AKA a new line)
    if (this.IsBreakAt(0))
    {
      this.end += 1;
      this.offset = 0; // Reset line offset
      this.line += 1;
    }
    else
    {
      this.end += 1;
      this.offset += 1;
    }
  }

  Walk(steps = 1)
  {
    for (let i = 0; i < steps; i++)
    {
      this.Step();
    }
  }

  Take()
  {
    const c = this.Peek();
    this.Step();

    return c;
  }
}

export class TokenPrivateChildren extends Base
{
  static From(t)
  {
    return new this(t.#string, t.#end, t.#end, t.#line, t.#offset);
  }

  constructor(string, start = 0, end = 0, line = 0, offset = 0)
  {
    super();

    this.#string = string;
    this.#start = start;
    this.#end = end;
    this.#line = line;
    this.#offset = offset;
  }

  #string;
  #start;
  #end;
  #line; // The current line
  #offset; // The offset in the line
  #parent;
  #children = [];

  GetParent(){ return this.#parent; }
  GetFirstChild(){ return this.#children[0]; }
  GetLastChild(){ return this.#children[this.#children.length - 1]; }
  GetPrevSibling(){ return this.#parent.#children[this.GetIndex() - 1]; }
  GetNextSibling(){ return this.#parent.#children[this.GetIndex() + 1]; }
  GetIndex(){ return this.#parent.#children.indexOf(this); }
  HasChildren(){ return this.#children.length > 0 === true; }

  Append(token)
  {
    this.#end += token.GetLength();
    token.#parent = this;
    
    this.#children.push(token);
  }
  
  Remove()
  {
    if (this.#parent && this.#parent.#children)
    {
      this.#parent.#end -= this.GetLength();

      // const index = this.#parent.#children.indexOf(this);
      const index = this.GetIndex();
      if (index > -1)
      {
        this.#parent.#children.splice(index, 1);
      }
    }
  
    this.#parent = undefined;
  }

  Format(builder)
  {
    builder.NL(`${this.GetName()}<${this.GetStart()}, ${this.GetEnd()}>`).Add("{").In();

    if (this.#children)
    {
      for (const child of this.#children)
      {
        child.Format(builder);
      }
    }

    builder.Out().NL("}");
  }

  Match(ctor)
  {
    const token = ctor.From(this);

    if (token.Parse())
    {
      // console.log(this.GetName(), "matched", token.GetName(), "with", token.GetText());

      this.Append(token);

      return true;
    }
    else
    {
      return false;
    }
  }

  Check(ctor)
  {
    this.Match(ctor);
    return true;
  }

  Optional(ctor)
  {
    this.Match(ctor);
    return true;
  }

  GetString(){ return this.#string; }
  GetStart(){ return this.#start; }
  GetEnd(){ return this.#end; }
  GetLine(){ return this.#line; }
  GetOffset(){ return this.#offset; }
  GetLength(){ return this.#end - this.#start; }
  GetName(){ return this.constructor.name; }
  GetTotal(){ return this.#string.length; } // Total characters in the string
  GetRemaining(){ return this.#string.length - this.#end; } // Characters remaining relative to this token
  GetText(){ return this.Substring(); }

  IsParsing(){ return this.GetTotal() > this.GetEnd(); }

  Substring(start = this.#start, end = this.#end)
  {
    // console.log("Getting substring at", start, length);
    return this.#string.slice(start, end);
  }

  IsSame(token)
  {
    return this.GetStart () === token.GetStart ()
        && this.GetEnd   () === token.GetEnd   ()
        && this.GetOffset() === token.GetOffset()
        && this.GetLine  () === token.GetLine  ();
  }

  Parse()
  {
  }

  Validate()
  {
  }

  Print()
  {
    const builder = new StringBuilder().NL();

    this.Format(builder);

    return builder.Render();
  }

  toString(){ return `${this.GetName()} [${this.GetStart()}, ${this.GetEnd()}, ${this.GetLine()}, ${this.GetOffset()}]`; }

  GetPosition(){ return this.#end; }
  Peek(offset = 0){ return this.#string[this.GetPosition() + offset] ?? ""; }
  Current(){ return this.Peek(0); }
  
  Step()
  {
    const c = this.Peek();

    // If it's a break (AKA a new line)
    if (this.IsBreak(c))
    {
      this.#end += 1;
      this.#offset = 0; // Reset line offset
      this.#line += 1;
    }
    else
    {
      this.#end += 1;
      this.#offset += 1;
    }
  }

  Walk(steps = 1)
  {
    for (let i = 0; i < steps; i++)
    {
      this.Step();
    }
  }

  Take()
  {
    const c = this.Peek();
    this.Step();

    return c;
  }
}

// export {TokenPrivate as Token};
// export {TokenPrivateLastChild as Token};
export {TokenPublic as Token};
// export {TokenChildren as Token};
// export {TokenPrivateChildren as Token};
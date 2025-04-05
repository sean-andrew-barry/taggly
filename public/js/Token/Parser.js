import {Token} from "/js/Token.js";
import {String} from "/js/String.js";

const LOWER = Symbol("Lower");
const UPPER = Symbol("Upper");

export class Parser extends Token
{
  constructor(string, index = 0, offset = 0, line = 0, length = string.length)
  {
    super(index, offset, line, length);

    this.#string = string;
    this.#stack.push(this);
  }

  #string;
  #stack = [];

  Peek(offset = 0){ return this.#string[this.GetIndex() + offset]; }
  Current(){ return this.Peek(0); }
  
  IsAlpha(c = this.Peek()){ return String.IsCharAlpha(c); }
  IsAlNum(c = this.Peek()){ return String.IsCharAlNum(c); }
  IsUpper(c = this.Peek()){ return String.IsCharUpper(c); }
  IsLower(c = this.Peek()){ return String.IsCharLower(c); }
  IsDigit(c = this.Peek()){ return String.IsCharDigit(c); }
  IsSpace(c = this.Peek()){ return String.IsCharSpace(c); }
  IsPunct(c = this.Peek()){ return String.IsCharPunct(c); }
  IsHex  (c = this.Peek()){ return String.IsCharHex  (c); }
  IsBreak(c = this.Peek()){ return String.IsCharBreak(c); }
  
  IsParsing(){ return this.GetLength() > this.GetIndex(); }
  IsDone(){ return !this.IsParsing(); }
  IsAtLast(){ return (this.GetIndex() + 1) >= this.GetLength(); }
  IsAtStart(){ return this.GetIndex() === 0; }
  IsAtEnd(){ return (this.GetIndex()) >= this.GetLength(); }

  Step()
  {
    const c = this.Peek();

    if (this.IsBreak(c))
    {
      this.Line(); // Advances the index and line and resets the offset
    }
    else
    {
      this.Move(); // Advances the index and offset
    }
  }

  Walk(steps = 1)
  {
    for (let i = 0; i < steps; i++)
    {
      this.Step();
    }
  }

  Read(value, save = true, string_case)
  {
    const start = this.GetIndex();
    const length = value.length;

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (this.GetLength() - start)) return;

    for (let i = 0; i < length; i++)
    {
      let c = this.#string[start + i];

      if      (string_case === LOWER) c = c.toLowerCase();
      else if (string_case === UPPER) c = c.toUpperCase();

      // If the sequence is at all different, return
      if (c !== value[i]) return;
    }

    this.Walk(length);

    if (save === true)
    {
      this.Save(value); // Add the value to the top
    }

    return this;
  }

  ReadL(value){ return this.Read(value, true, LOWER) }
  ReadU(value){ return this.Read(value, true, UPPER) }
}
import {Tag} from "/js/Tag.js";

export class Position extends Tag
{
  constructor(index = 0, offset = 0, line = 0, skip = 0)
  {
    super();

    this.index = index; // Position in the buffer
    this.offset = offset; // Position in the line
    this.line = line; // Current line
    this.skip = skip; // An offset from the current position
  }

  Clone(){ return new Position(this.index, this.offset, this.line, this.skip); }

  Set(index, offset, line, skip)
  {
    this.index = index;
    this.offset = offset;
    this.line = line;
    this.skip = skip;
    return this;
  }

  Copy(position)
  {
    this.index = position.index;
    this.offset = position.offset;
    this.line = position.line;
    this.skip = position.skip;
    return this;
  }

  Add(index = 1, offset = 1, line = 1)
  {
    this.index = index;
    this.offset = offset;
    this.line = line;
    return this;
  }

  Reset()
  {
    this.index = 0;
    this.offset = 0;
    this.line = 0;
    this.skip = 0;
    return this;
  }

  SetIndex(n){ this.index = n; return this; }
  SetOffset(n){ this.offset = n; return this; }
  SetLine(n){ this.line = n; return this; }
  SetSkip(n){ this.skip = n; return this; }

  AddIndex(n = 1){ this.index += n; return this; }
  AddOffset(n = 1){ this.offset += n; return this; }
  AddLine(n = 1){ this.line += n; return this; }
  AddSkip(n = 1){ this.skip += n; return this; }

  GetIndex(){ return this.index; }
  GetOffset(){ return this.offset; }
  GetLine(){ return this.line; }
  GetSkip(){ return this.skip; }

  Back(n = 1)
  {
    this.index -= n;
    this.offset -= n;
    return this;
  }

  Move(n = 1)
  {
    this.index += n;
    this.offset += n;
    return this;
  }

  Skip(n = 1)
  {
    this.Move(n);
    this.skip += n;
    return this;
  }

  Line()
  {
    this.index += 1;
    this.offset = 0; // Reset line offset
    this.line += 1;
    return this;
  }

  IsSame(position)
  {
    return this.index === position.index
        && this.offset === position.offset
        && this.line === position.line
        && this.skip === position.skip;
  }

  toString(){ return `[${this.index}, ${this.offset}, ${this.line}, ${this.skip}]`; }
}

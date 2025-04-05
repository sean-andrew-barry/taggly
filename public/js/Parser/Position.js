export class Position
{
  constructor(index = 0, offset = 0, line = 0, length = 0)
  {
    this.index = index; // Position in the buffer
    this.offset = offset; // Position in the line
    this.line = line; // Current line
    this.length = length; // Total character length
  }

  Clone(){ return new Position(this.index, this.offset, this.line, this.length); }

  Set(index, offset, line, length)
  {
    this.index = index;
    this.offset = offset;
    this.line = line;
    this.length = length;
  }

  Copy(position)
  {
    this.index = position.GetIndex();
    this.offset = position.GetOffset();
    this.line = position.GetLine();
  }

  Add(index = 1, offset = 1, line = 1)
  {
    this.index = index;
    this.offset = offset;
    this.line = line;
  }

  Reset()
  {
    this.index = 0;
    this.offset = 0;
    this.line = 0;
    this.length = 0;
  }

  SetIndex(n){ this.index = n; }
  SetOffset(n){ this.offset = n; }
  SetLine(n){ this.line = n; }
  SetLength(n){ this.length = n; }

  AddIndex(n = 1){ this.index += n; }
  AddOffset(n = 1){ this.offset += n; }
  AddLine(n = 1){ this.line += n; }
  AddLength(n = 1){ this.length += n; }

  GetIndex(){ return this.index; }
  GetOffset(){ return this.offset; }
  GetLine(){ return this.line; }
  GetLength(){ return this.length; }

  Back(n = 1)
  {
    this.index -= n;
    this.offset -= n;
  }

  Move(n = 1)
  {
    this.index += n;
    this.offset += n;
  }

  Skip(n = 1)
  {
    this.Move(n);
    this.length += n;
  }

  Line()
  {
    this.index += 1;
    this.offset = 0; // Reset line offset
    this.line += 1;
  }

  IsSame(position)
  {
    return this.GetIndex () === position.GetIndex ()
        && this.GetOffset() === position.GetOffset()
        && this.GetLine  () === position.GetLine  ()
        && this.GetLength() === position.GetLength();
  }

  toString(){ return `[${this.GetIndex()}, ${this.GetOffset()}, ${this.GetLine()}]`; }
}

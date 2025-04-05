import {Text} from "/js/Token/Text.js";

export class Plain extends Text
{
  constructor(token, delimiter)
  {
    super(token);
    this.delimiter = delimiter;
  }
  
  IsSpecial(c = this.Peek())
  {
    switch (c)
    {
      case "(":
      case ")":
      case "[":
      case "]":
      case "{":
      case "}":
      case " ":
      case "'":
      case "\n":
      case "\"":
      case "\\": return true;
      default: return false;
    }
  }

  IsDelimiter(c = this.Peek(1))
  {
    return c === this.delimiter;
  }

  Parse()
  {
    while (this.IsParsing())
    {
      if (this.IsDelimiter())
      {
        return this.GetLength() > 0 ? this : undefined;
      }
      else
      {
        this.Step();
      }
    }

    return this;
  }
}
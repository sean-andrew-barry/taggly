export class StringBuilder
{
  constructor()
  {
    this.lines = [];
    this.depth = 0;
    this.indent = "";
  }

  Close()
  {
    // Close the current line
    if (this.current)
    {
      const line = this.current.join("");
      this.lines.push(line);
    }
  }

  NL(string)
  {
    this.Close();

    // Open a new line
    this.current = [this.indent];

    return this.Add(string);
  }

  NLO(string){ return this.NL(string); }

  WS(string)
  {
    if (string) return this.Add(" ").Add(string);
    else return this.Add(" ");
  }

  // Optional whitespace
  // The reason for this is easy overridding based on format preferences
  WSO(string)
  {
    if (string) return this.Add(string);
    else return this;
  }

  // Add a string to the currently open line
  Add(string)
  {
    switch (typeof(string))
    {
      case "string":
      {
        this.current.push(string);
        break;
      }
      default:
      {
        if (string !== undefined && string !== null)
        {
          this.current.push(string.toString());
        }
      }
    }

    return this;
  }

  SetIndent(indent, depth)
  {
    this.indent = indent.repeat(depth);
    this.depth = depth;
    // console.log("Setting indent to", depth, `"${this.indent}"`);
    return this;
  }

  In (indent = "  "){ return this.SetIndent(indent, this.depth + 1); }
  Out(indent = "  "){ return this.SetIndent(indent, this.depth - 1); }

  Reset()
  {
    this.lines = [];
    this.depth = 0;
    this.indent = "";

    return this;
  }

  Render()
  {
    this.Close();
    const text = this.lines.join("\n");
    this.Reset();

    return text;
  }

  RedBright(value){ return this.Add(value); }
  White(value){ return this.Add(value); }
  Number(value){ return this.Add(value); }
  Function(value){ return this.Add(value); }
  URL(value){ return this.Add(value); }

  Round(value, multiplier = 100){ return this.Number(Math.floor(value * multiplier) / multiplier); }
}

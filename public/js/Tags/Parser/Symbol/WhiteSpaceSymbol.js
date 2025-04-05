import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class WhiteSpaceSymbol extends Symbol
{
  Parse(parser)
  {
    let text = "";

    while (parser.IsParsing())
    {
      const c = parser.Current();
      if (parser.IsSpace(c))
      {
        text += c;
        parser.Next();
      }
      else
      {
        if (text.length > 0)
        {
          // console.log("White space matched", text, "characters", text.length);

          this.Text(text);
          return true;
        }
        else
        {
          return false;
        }
      }
    }

    // if (p.Read("class"))
    // {
    //   console.log("Matched class symbol");
    //   this.Text("class");
    //   return true;
    // }

    return false;
  }

  Parse(parser)
  {
    let text = "";
    while (parser.IsParsing())
    {
      const c = parser.Current();
      if (c === " " || c === "\t" || c === "\v")
      {
        text += c;
        parser.Next();
      }
      else
      {
        if (text.length > 0)
        {
          // console.log("White space matched", text, "characters", text.length);

          // const raw = String.raw(text);
          // console.log("Raw:", JSON.stringify(text));
          const json = JSON.stringify(text);
          this.Value(json.slice(1, -1));

          this.Text(text);
          return true;
        }
        else
        {
          return false;
        }
      }
    }

    return false;
  }

  Describe(){ return this.AddClass("space"); }
}

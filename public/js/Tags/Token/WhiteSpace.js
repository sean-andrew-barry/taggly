import {Token} from "/js/Tags/Token.js";
import {BR} from "/js/Tags/BR.js";

export class WhiteSpace extends Token
{
  static GetLocalName(){ return "white-space"; }

  Build(p)
  {
    let text = "";
    while (p.IsParsing())
    {
      const c = p.Current();
      switch (c)
      {
        case "\n":
        {
          text += c;
          p.position.Line();
          // this.AddClass("NewLine");
          break;
        }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          text += c;
          p.position.Move();
          break;
        }

        // Non whitespace character, so we're done
        default: return text;
      }
    }

    return text;
  }

  Parse(p)
  {
    const text = this.Build(p);

    if (text.length > 0)
    {
      p.Save(text);
      return true;
    }
    else
    {
      return false;
    }
  }

  _Parse(p)
  {
    let text = "";
    while (p.IsParsing())
    {
      const c = p.Current();
      switch (c)
      {
        case "\n":
        {
          p.Save(text);
          p.Save(new BR());
          // p.GetTag();
          text = "";

          // text += c;
          p.position.Line();
          break;
        }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          text += c;
          p.position.Move();
          break;
        }

        // Non whitespace character, so we're done
        default:
        {
          if (text.length > 0)
          {
            p.Save(text);
            return true;
          }
          else
          {
            return false;
          }
        }
      }
    }

    if (text.length > 0)
    {
      p.Save(text);
      return true;
    }
    else
    {
      return false;
    }
  }
}

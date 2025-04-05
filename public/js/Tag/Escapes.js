export class Escapes
{
  static EscapeCharacter(c)
  {
    switch (c)
    {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "\"": return "&quot;";
      case "'": return "&#x27;";
      case "/": return "&#x2F;";
      default: return c;
    }
  }

  static Escape(string, trusted)
  {
    string = string.toString();

    let escaped = "";
    for (let i = 0; i < string.length; i++)
    {
      escaped += this.EscapeCharacter(string[i]);
    }

    return escaped;
  }
}

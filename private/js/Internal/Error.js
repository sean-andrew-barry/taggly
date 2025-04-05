import {Error as Base} from "/js/Internal/Error.js?after=/taggly/private/";
import {Getter} from "/js/Loader/Getter.js";

export class Error extends Base
{
  static _FormatHelper(error, builder)
  {
    const loader = Getter();

    builder.NL();
    builder.NL().RedBright(`Error`).Add(": ").White(error.message);

    // if (error.cause) builder.NL().RedBright("Cause").Add(": ").White(error.cause.message);

    builder.NL();

    // this.PopNodeInternals();
    const stack = ErrorParser(error);

    builder.In();

    for (const {name, file, line, column} of stack)
    {
      const entry = loader.Query(file);
      builder.NL(" from ");

      if (name) builder.Function(name).Add(" at ");

      builder.Add(" line ").Number(line).Add(" and column ").Number(column).Add(" in file ");

      if (entry)
      {
        builder.URL(entry.GetNormalized());
      }
      else
      {
        builder.URL(file);
      }
    }

    if (error.cause)
    {
      this.FormatHelper(error.cause, builder);
    }

    builder.Out();
    builder.NL();

    return builder;
  }

  static _Format(error)
  {
    const builder = new StringBuilder();
    this.Format(error, builder);

    return builder.Render();
  }

  PopNodeInternals()
  {
    const stack = this.GetStack();

    // Pop any node internal calls from the end, but don't remove them if they are intermediary
    while (stack.length > 0)
    {
      const last = stack.at(-1);
      if (last.file.startsWith("node:internal")) stack.pop();
      else break;
    }
  }

  toString()
  {
    const builder = new StringBuilder();

    const cause = this.GetCause();

    builder.NL();
    builder.NL(`${console.RedBright("Error")}: ${console.White(this.GetMessage())}`);

    if (cause) builder.NL().RedBright("Cause").Add(": ").White(cause.message);

    builder.NL();

    // this.PopNodeInternals();
    const stack = this.GetStack();

    builder.In();

    for (const {name, file, line, column} of stack)
    {
      const entry = Getter().Query(file);
      builder.NL(" from ");

      if (name) builder.Function(name).Add(" at ");

      builder.Add(" line ").Number(line).Add(" and column ").Number(column).Add(" in file ");

      if (entry)
      {
        builder.URL(entry.GetNormalized());
      }
      else
      {
        builder.URL(file);
      }
    }

    builder.Out();
    builder.NL();

    const help = this.GetHelp();
    if (help)
    {

    }

    return builder.Render();
  }

  toString()
  {
    const cause = this.GetCause();

    const lines = [];

    lines.push("");
    lines.push(`${console.RedBright("Error")}: ${console.White(this.GetMessage())}`);

    if (cause) lines.push(`${console.RedBright("Cause")}: ${console.White(cause.message)}`);

    lines.push("");

    this.PopNodeInternals();

    const stack = this.GetStack();

    for (const {name, file, line, column} of stack)
    {
      const entry = Getter().Query(file);
      let string = "  from ";

      if (name) string += console.Function(name) + " at ";

      string += `line ${console.Number(line)} and column ${console.Number(column)} in file `;

      if (entry)
      {
        string += console.URL(entry.GetNormalized());
      }
      else
      {
        string += console.URL(file);
      }

      lines.push(string);
    }

    lines.push("");

    const help = this.GetHelp();
    if (help)
    {

    }

    return lines.join("\n");
    // return super.toString();
  }
}

import {Tag} from "/js/Tag.js";
import {HSLA} from "/js/Utility/Color/HSLA.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";
import {P} from "/js/Tags/P.js";
import {Span} from "/js/Tags/Span.js";
import {Strong} from "/js/Tags/Strong.js";
import {Pre} from "/js/Tags/Pre.js";
import {Code} from "/js/Tags/Code.js";
import {Div} from "/js/Tags/Div.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Number} from "/js/Tags/Number.js";
// import {Tooltip} from "/js/Tags/Tooltip.js";
import {Modal} from "/js/Tags/Modal.js";
import {Connect} from "/js/Event/Connect.js";
import {Render} from "/js/Event/Render.js";
import {Click} from "/js/Event/Click.js";
import {ErrorStyle as style} from "/js/Tags/Error.style.js";
import {Environment} from "/js/Environment.js";
import {ErrorParser} from "/js/External/ErrorParser.js";

export class Error extends Tag
{
  static GetLocalName(){ return "error"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(value)
  {
    super();

    if (value instanceof window.Error)
    {
      this.Value(value);
    }
    else if (typeof(value) === "string")
    {
      this.Value(new window.Error(value));
    }
  }

  [Render](event)
  {
    if (this.IsDisabled()) return; // If disabled, don't auto invoke

    const error = this.GetValue();

    try
    {
      if (typeof(error) !== "object")
      {
        throw new Error(`The Error tag expected to have an object value, but got "${typeof(value)}"`);
      }

      if (!(error instanceof global.Error))
      {
        throw new Error(`The Error tag expected its value to be an error`);
      }

      console.error(error);

      this
      .DisplayBlock()
      .BorderRadius(3)
      .BackgroundColorDanger()
      .ColorDark()
      .PaddingXY(5)
      .FontSize(5)
      .ReplaceChildren(
        this.ErrorMessage(error).Add(
          this.Span().Text(error.constructor.name),
          this.Span().Text(": "),
          this.Span().Text(error.message),
        ),
        this.ErrorStack(error).Add(
          this.ErrorCode(error),
        ),
      );
    }
    catch (error)
    {
      console.error("Error within an error", error);
    }
  }

  [Connect](event)
  {
  }

  Span(){ return new Span().FontSize(5); }

  ErrorMessage(error)
  {
    return new P("error-message")
    .MarginBottom(2)
    .BorderRadius(1)
    .Padding(3)
    .BackgroundColorWhite();
  }

  ErrorStack(error)
  {
    return new Pre("error-stack")
    .BorderRadius(1)
    .WhiteSpacePreWrap()
    .OverflowX("auto")
    .Padding("1.25em 1.5em")
    .WordWrapNormal()
    .BackgroundColor("#f5f5f5")
    .Color("#4a4a4a")
    .FontSize(".875em")
    .FontFamilyMonoSpace();
  }

  ErrorCode(error)
  {
    const stack = ErrorParser(error);

    if (stack)
    {
      const div = new Div("content is-medium")
      .DisplayGrid()
      .GridTemplateColumns("auto auto auto 1fr")
      .ColumnGap("1em")
      .Add(
        new Strong().FontSize("1.25em").Text("Function name"),
        new Strong().FontSize("1.25em").Text("Line"),
        new Strong().FontSize("1.25em").Text("Column"),
        new Strong().FontSize("1.25em").Text("Source file"),
      );

      console.log(stack);
      for (let i = 0; i < stack.length; i++)
      {
        const {line, column, name, file, source} = stack[i];

        // const file = Environment.Normalize(file);

        div.Add(
          Span.Text(name).Color("#3850b7"),
          new Number(line).Color("#22655b"),
          new Number(column).Color("#22655b"),
          Span.Text(file).TextDecorationLineUnderline(),
        );
      }

      return new Fragment().Add(
        div,
        new Code().Text(error.stack),
      );
    }
    else
    {
      return new Code().Text(error.stack);
    }
  }

  Deconvert(){ console.warn("Deconverting error, maybe should throw?"); return this.GetValue(); }
}

import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {Div} from "/js/Tags/Div.js";
import {H1} from "/js/Tags/H1.js";
import {H3} from "/js/Tags/H3.js";
import {A} from "/js/Tags/A.js";
import {Span} from "/js/Tags/Span.js";
import {Figure} from "/js/Tags/Figure.js";
import {Img} from "/js/Tags/Img.js";

export class Error404 extends Page
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "error-404"; }
  static GetTitle(){ return super.GetTitle("Error 404 - Page not found"); }
  static GetURL(...parts){ return super.GetURL("error", ...parts); }

  constructor(...args)
  {
    super(...args).Add(
      new Div("container").Add(
        new Div("columns is-marginless is-centered").MinHeight("500px").Add(
          new Div("column").Margin("2em").Add(
            new A().HRef("/").Add(
              new Figure("image").Add(
                // new Img().Src("/images/logo_small_square_01.png").MarginTop("-2em").MarginBottom("-6em").Alt("Be Fit Beyond Fifty logo"),
              ),
            ),
          ),
          new Div("column is-5").Margin("2em").Add(
            new Div("content is-large").Add(
              new H1().Text("Sorry!"),
              new H3().Add(
                "We couldn't find a page at ",
                window.location.pathname,
              ),
              new A("button is-primary is-large").FontSize("1.25em").HRef("/").Add(
                new Span("is-hidden-tablet").Text("Home"),
                new Span("is-hidden-mobile").Text("Return to home page"),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

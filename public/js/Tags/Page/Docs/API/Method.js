import {Page} from "/js/Tags/Page.js";

const MDN = "https://developer.mozilla.org/en-US/docs/Web";

export class Method extends Page
{
  Article()
  {
    return super.Article(
      this.TitleHeader(),
      this.Introduction(),

      this.HeaderParameters(),
      this.Parameters(),

      this.HeaderReturns(),
      this.Returns(),

      this.SeeAlso(),
    );
  }

  HeaderTitle(){ return this.H1`${this.constructor.name}`; }
  HeaderParameters(){ return this.H3`Parameters`; }
  HeaderReturns(){ return this.H3`Returns`; }

  Introduction()
  {
    return this.Div(
      this.P`Nothing here yet...`,
    );
  }

  Parameters()
  {
    return this.Div(
      this.P`Nothing here yet...`,
    );
  }
}

export class DispatchEvent extends Method
{
  Introduction()
  {
    return this.DIV(
      this.P`Fires an ${this.A`Event`.HRef("/docs/Event")} through the ${Tag}`,
    );
  }

  Parameters()
  {
    return this.DIV(
      this.DL(
        this.DT(this.CODE`event`),
        this.DD(
          this.P`The ${this.DFN`standard`} Event object to be fired`,
        ),
      ),
    );
  }
}

export class GlobalAttributes extends Method
{
  Title(){ this.H1`Global attributes`; }

  A_B_Code(text){ return this.A(this.B(this.Code(text))); }

  Introduction()
  {
    return this.Div(
      this.P`${this.Strong`Global attributes`} are attributes common to all HTML elements; they can be used on all elements, though they may have no effect on some elements.`,

      this.P`Global attributes may be specified on all ${this.A`HTML elements`.HRef("/Web/HTML/Element", MDN)}, ${this.Em`even those not specified in the standard`}. That means that any non-standard elements must still permit these attributes, even though using those elements means that the document is no longer HTML5-compliant. For example, HTML5-compliant browsers hide content marked as ${this.Code`<foo hidden>...</foo>`}, even though ${this.Code`<foo>`} is not a valid HTML element.`,

      this.P`In addition to the basic HTML global attributes, the following global attributes also exist:`,

      this.UL(
        this.LI`${this.A(this.B(this.Code`xml:lang`))} and ${this.A(this.B(this.Code`xml:base`))} — these are inherited from the XHTML specifications and deprecated, but kept for compatibility purposes.`,

        this.LI`The multiple ${this.A(this.B(this.Code`aria-*`))} attributes, used for improving accessibility.`,

        this.LI`The ${this.A`event handler`.HRef("", MDN)} attributes: ...`,
      ),
    );
  }

  Parameters()
  {
    return this.Div(
      this.DL(
        this.DT(this.Code`event`),
        this.DD(
          this.P`The ${this.DFN`standard`} Event object to be fired`,
        ),
      ),
    );
  }
}

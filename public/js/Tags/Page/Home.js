import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {Div} from "/js/Tags/Div.js";
import {Section} from "/js/Tags/Section.js";
import {P} from "/js/Tags/P.js";

export class Home extends Page
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "home"; }
  static GetURL(...parts){ return super.GetURL("", ...parts); }

  constructor(...args)
  {
    super(...args).Add(
      new Div("box").Add(
        new Section("section").Add(
          new Paragraph().Add(`Welcome to Taggly!`),
        ),
      )
    );
  }
}

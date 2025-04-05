import {Tag} from "/js/Tag.js";
import {Div} from "/js/Tags/Div.js";
import {Button} from "/js/Tags/Button.js";

import {Render} from "/js/Event/Render.js";
import {Click} from "/js/Event/Click.js";

export class Modal extends Tag
{
  static GetLocalName(){ return "modal"; }
  static GetMetaURL(){ return import.meta.url; }

  [Render](event)
  {
    this.Clear().Class("modal is-active").Add(
      Div.Class("modal-background"),
      Div.Class("modal-content").Add(
        this.content,
      ),

      Button.Class("modal-close is-large").AriaLabel("close").On(Click, event =>
      {
        event.preventDefault();
        event.stopPropagation();
        this.RemoveClass("is-active");
        this.Remove();
      }),
    );
  }

  Content(...tags)
  {
    this.content ??= Div.Add(
      ...tags,
    );

    return this;
  }
}

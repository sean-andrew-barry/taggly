import {Tag, OnClick} from "/js/Tag.js";
import {Material} from "/js/Tags/Material.js";
import {Dialog, OnClose, OnAccept} from "/js/Tags/Material/Dialog.js";

export class DialogButton extends Material
{
  Render()
  {
    super.Render(
      Tag.Button("mdc-button mdc-dialog__button").Type("button").Add(
        Tag.Div("mdc-button__ripple"),
        Tag.Span("mdc-button__label"),
      ),
    );
  }

  [OnClick](event)
  {
    switch (this.GetAttribute("action"))
    {
      case "cancel": return new OnClose(this).Rise();
      case "accept": return new OnAccept(this).Rise();
    }
  }

  Cancel(){ return this.SetAttribute("action", "cancel"); }
  Accept(){ return this.SetAttribute("action", "accept"); }

  Label(...tags){ return this.AddTo(".mdc-button__label", ...tags); }
}

DialogButton.Register();

import {Tag, Event, OnKeyEscape} from "/js/Tag.js";
import {Material} from "/js/Tags/Material.js";

export class OnClose extends Event {};
export class OnCancel extends Event {};
export class OnAccept extends Event {};
// export class OnOpened extends Event {};
// export class OnClosing extends Event {};

export const ID_INDEX = new WeakMap();

export class Dialog extends Material
{
  static GenerateIDs(...args)
  {
    const index = ID_INDEX.get(this) || 1;

    // Update the index
    ID_INDEX.set(this, index + 1);

    // Create the base id
    args[0] = `${args[0]}-${index}`;

    // Create all the relative ids
    for (let i = 1; i < args.length; i++)
    {
      args[i] = `${args[0]}-${args[i]}`;
    }

    return args;
  }

  OnClose(event)
  {
    console.log("Closing");
    event.preventDefault();
  }

  Listen(event_ctor, callback)
  {
    this[event_ctor.GetName()] = callback;
    return this;
  }

  Render()
  {
    const [id, title_id, content_id] = this.constructor.GenerateIDs("dialog", "title", "content");

    super.Render(
      Tag.Div("mdc-dialog").Add(
        Tag.Div("mdc-dialog__container").Add(
          Tag.Div("mdc-dialog__surface")
          .RoleAlertDialog()
          .AriaModal("true")
          .AriaLabelledBy(title_id)
          .AriaDescribedBy(content_id)
          .Add(
            Tag.Header2("mdc-dialog__title").ID(title_id),
            Tag.Div("mdc-dialog__content").ID(content_id),
            Tag.Footer("mdc-dialog__actions"),
          ),
        ),
        Tag.Span("mdc-dialog__scrim"),
      ),
    );
  }

  [OnClose](event)
  {
    console.log("Closing");
    this.Remove();
  }

  [OnAccept](event)
  {
    console.log("Accepting");
    this.Remove();
  }

  [OnKeyEscape](event)
  {
    new OnClose(this).Fire();
  }

  Title(...tags){ return this.AddTo(".mdc-dialog__title", ...tags); }
  Content(...tags){ return this.AddTo(".mdc-dialog__content", ...tags); }
  Actions(...tags){ return this.AddTo(".mdc-dialog__actions", ...tags); }

  Open(){ this.Query(".mdc-dialog").AddClass("mdc-dialog--open"); return this; }
  Close(){ this.Query(".mdc-dialog").RemoveClass("mdc-dialog--open"); return this; }

  Layout(){}

  IsOpen(){}
}

Dialog.Register();

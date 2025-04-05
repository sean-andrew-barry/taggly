import {Tag} from "/js/Tag.js";
import {Bulma} from "/js/Tags/Bulma.js";

export const INSTANCE = Symbol("instance");

export class Modal extends Bulma
{
  static New(...args){ return this[INSTANCE] || (this[INSTANCE] = new this(...args)); }

  constructor(...args)
  {
    super(...args);

    if (!this.constructor.hasOwnProperty(INSTANCE))
    {
      this.constructor[INSTANCE] = this;
    }

    Tag.Body().AppendChild(this);
  }

  Render()
  {
    return super.Render(
      Tag.Div("modal").Add(
        Tag.Div("modal-background").OnClick(e => this.Hide()),
        Tag.Div("modal-content"),
        Tag.Button("modal-close is-large").AriaLabel("close").OnClick(e => this.Hide()),
      ),
    );
  }

  Show(){ this.Query(".modal").AddClass("is-active"); return this; }
  Hide(){ this.Query(".modal").RemoveClass("is-active"); return this; }
  Content(...tags){ this.Query(".modal-content").Clear().Add(...tags); return this; }
}

Tag.Constructor(Modal);

export class Card extends Bulma
{
  Render()
  {
    return super.Render(
      Tag.Div("card").Add(
        Tag.Div("card-content").Add(),
        Tag.Div("modal-background").OnClick(e => this.Hide()),
      ),
    );
  }

  Show(){ this.Query(".modal").AddClass("is-active"); return this; }
  Hide(){ this.Query(".modal").RemoveClass("is-active"); return this; }
  Content(...tags){ this.Query(".card-content").Clear().Add(...tags); return this; }
}

Tag.Constructor(Card);

import {Tag} from "/js/Tag.js";
import {Material} from "/js/Tags/Material.js";

export class Card extends Material
{
  Render()
  {
    super.Render(
      Tag.Div("mdc-card").Width("344px").Add(
        Tag.Div("mdc-card__primary-action").Add(
          Tag.Div("mdc-card__media mdc-card__media--square").Add(
            Tag.Div("mdc-card__media-content").Add(
              "Title",
            ),
            "... additional primary action content ...",
          ),
        ),
        Tag.Div("mdc-card__actions").Add(
          Tag.Div("mdc-card__action-buttons").Add(
            Tag.Button("mdc-button mdc-card__action mdc-card__action--button").Add(
              Tag.Div("mdc-button__ripple"),
              Tag.Span("mdc-button__label").Text("Action 1"),
            ),
            Tag.Button("mdc-button mdc-card__action mdc-card__action--button").Add(
              Tag.Div("mdc-button__ripple"),
              Tag.Span("mdc-button__label").Text("Action 2"),
            ),
          ),
          Tag.Div("mdc-card__action-icons").Add(
            Tag.Button("material-icons mdc-icon-button mdc-card__action mdc-card__action--icon").Title("Share").Text("share"),
            Tag.Button("material-icons mdc-icon-button mdc-card__action mdc-card__action--icon").Title("More options").Text("more_vert"),
          ),
        ),
      ),
    );
  }

  Outlined(v){ this.Query("mdc-card").ToggleClass("mdc-card--outlined", v); return this; }

  Title(...tags){ return this.AddTo(".mdc-dialog__title", ...tags); }
  Content(...tags){ return this.AddTo(".mdc-dialog__content", ...tags); }
  Actions(...tags){ return this.AddTo(".mdc-dialog__actions", ...tags); }
}

Card.Register();

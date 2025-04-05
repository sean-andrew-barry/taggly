import {Div} from "/js/Tags/Div.js";
import {Strong} from "/js/Tags/Strong.js";
import {FullViewEnter} from "/js/Event/FullViewEnter.js";
import {FullViewLeave} from "/js/Event/FullViewLeave.js";

export class UsingVisibilityEvents extends Div
{
  constructor()
  {
    super()
    .Class("box")
    .MinHeight("3em")
    .FontSize("3em")
    .FlexCenter()
    .WhiteSpacePre();
  }

  [FullViewEnter](event)
  {
    this.BackgroundColor("#00d1b2").ReplaceChildren`I ${Strong.Text("am")} fully visible!`;
  }

  [FullViewLeave](event)
  {
    this.BackgroundColor("#e8e8e8").ReplaceChildren`I am ${Strong.Text("not")} fully visible!`;
  }
}

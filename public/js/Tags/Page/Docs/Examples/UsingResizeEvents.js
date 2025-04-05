import {Div} from "/js/Tags/Div.js";
import {Strong} from "/js/Tags/Strong.js";
import {Tablet} from "/js/Event/Tablet.js";
import {Mobile} from "/js/Event/Mobile.js";

export class UsingResizeEvents extends Div
{
  constructor()
  {
    super()
    .Class("box")
    .MinHeight("10em")
    .FlexCenter()
    .WhiteSpacePre();
  }

  [Tablet](event)
  {
    this.BackgroundColor("#00d1b2").Clear().TL`I ${Strong.Text("am")} fully visible!`;
  }

  [Mobile](event)
  {
    this.BackgroundColor("#e8e8e8").Clear().TL`I am ${Strong.Text("not")} fully visible!`;
  }
}

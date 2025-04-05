import {Button} from "/js/Tags/Button.js";
import {Click} from "/js/Event/Click.js";

export class UsingSymbolFunction extends Button
{
  constructor()
  {
    super()
    .Class("button is-large")
    .WhiteSpacePre()
    .Text("Click me!");
  }

  [Click](event)
  {
    event.preventDefault();
    this.count ??= 1;
    this.Clear().TL`Event "${event.type}" fired ${this.count++} times`;
  }
}

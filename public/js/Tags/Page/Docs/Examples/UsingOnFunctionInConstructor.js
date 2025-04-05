import {Button} from "/js/Tags/Button.js";
import {Click} from "/js/Event/Click.js";

export class UsingOnFunctionInConstructor extends Button
{
  constructor()
  {
    super()
    .Class("button is-large")
    .Text("Click me!")
    .WhiteSpacePre()
    .On(Click, event =>
    {
      event.preventDefault();
      this.count ??= 1;
      this.Clear().TL`Event "${event.type}" fired ${this.count++} times`;
    });
  }
}

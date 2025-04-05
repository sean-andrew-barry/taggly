import {Button} from "/js/Tags/Button.js";
import {Click} from "/js/Event/Click.js";

export function UsingOnFunctionCounter()
{
  let count = 1;

  return new Button("button is-large")
  .WhiteSpacePre()
  .Add("Click me!")
  .On(Click, (event, self) =>
  {
    event.preventDefault();
    self.Clear().TL`${count++} clicks`;
  });
}

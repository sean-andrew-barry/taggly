import {Description} from "/js/Tags/Docs/Description.js";
import {Method} from "/js/Tags/Docs/Method.js";
import {Return} from "/js/Tags/Docs/Return.js";
import {Parameter} from "/js/Tags/Docs/Parameter.js";
import {Group} from "/js/Tags/Docs/Group.js";
import {Example} from "/js/Tags/Docs/Example.js";
import PaddingX from "/js/Docs/Tag/PaddingX.js";
import PaddingY from "/js/Docs/Tag/PaddingY.js";

export class PaddingXY extends Method
{
  constructor()
  {
    super().HTML`A simple wrapper function for both ${PaddingX.Link()} and ${PaddingY.Link()}.`;
  }

  // GetDescription(){ return this.HTML``; }
}

export default new Method().Name("PaddingXY").Value(fn => fn.Add(
  new Description().HTML(`Simple wrapper function for both ${PaddingX} and ${PaddingY}.`),

  new UnorderedList().Add(
    new ListItem().HTML(Padding),
    new ListItem().HTML(PaddingX),
    new ListItem().HTML(PaddingY),
  ),
));

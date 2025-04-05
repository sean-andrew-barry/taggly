import {Base} from "/js/Tag/Base.js";
import {Description} from "/js/Tags/Docs/Description.js";
import {Class} from "/js/Tags/Docs/Class.js";
import {Method} from "/js/Tags/Docs/Method.js";
import {Return} from "/js/Tags/Docs/Return.js";
import {Parameter} from "/js/Tags/Docs/Parameter.js";
import {Group} from "/js/Tags/Docs/Group.js";
import {Example} from "/js/Tags/Docs/Example.js";

const style_v = new Parameter().Name("v").Class("v").Add(
  new Description().Add(

  ),
);

const style_i = new Parameter().Name("i").Class("i");

const padding_right = new Variable().Name("padding-right");
const padding_top = new Variable().Name("padding-top");
const padding_bottom = new Variable().Name("padding-bottom");
const padding_left = new Variable().Name("padding-left");

export default new Class().Value(self =>
{

});

export default new Class().Value(Base).Add(
  new Group().Name("Padding").Add(
    new Method().Name("Padding").Add(
      style_v.Clone(),
      style_i.Clone(),
      new Description().Text("Sets the padding style"),
    ),
    new Method().Name("PaddingLeft").Add(
      style_v.Clone(),
      style_i.Clone(),
      new Description().HTML`Sets the ${padding_left} style`,
    ),
    new Method().Name("PaddingRight").Add(
      style_v.Clone(),
      style_i.Clone(),
    ),
    new Method().Name("PaddingTop").Add(
      style_v.Clone(),
      style_i.Clone(),
    ),
    new Method().Name("PaddingBottom").Add(
      style_v.Clone(),
      style_i.Clone(),
    ),
    new Method().Name("PaddingX").Add(
    ),
    new Method().Name("PaddingY").Add(
    ),
    new Method().Name("PaddingXY").Add(
      new Description().HTML`Sets both ${}`,
    ),
  ),
);

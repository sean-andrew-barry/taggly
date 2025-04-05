import {Tag} from "/js/Tag.js";
import {Class} from "/js/Tags/Docs/Class.js";
import {Method} from "/js/Tags/Docs/Method.js";
import {Parameter} from "/js/Tags/Docs/Parameter.js";
import {Span} from "/js/Tags/Span.js";
import {Property} from "/js/Tags/Docs/Property.js";
import {Description} from "/js/Tags/Docs/Description.js";
import {Ref} from "/js/Tags/Docs/Ref.js";
import {Return} from "/js/Tags/Docs/Return.js";
import {Code} from "/js/Tags/Code.js";

function* GenerateAttributes(pairs = {})
{
  for (const code in pairs)
  {
    const name = pairs[code];

    yield new Method(name).Add(
      new Parameter("value").TypeOf("string").InstanceOf(String),
      new Description().Add(
        "Sets the ",
        new Code(code),
        " attribute",
      ),
      new Return(
        new Ref(".this"),
      ),
    );
  }
}

export default new Class(Tag).Add(
  new Property("this").Hidden().InstanceOf("class.Tag").Add(
    new Description().Add("The ", new Ref("class.Tag"), " pointer"),
  ),

  new Property("node").IsSymbol().InstanceOf("class.Node").Hidden().Add(
    new Description().Add("The browser ", new Ref("class.Node"), " object"),
  ),

  GenerateAttributes({
    id: "ID",
    name: "Name",
    placeholder: "Placeholder",
    value: "Value",
    href: "HRef",
    xmlns: "XMLNS",
    viewbox: "ViewBox",
    d: "D",
    src: "Src",
    rel: "Rel",
    sizes: "Sizes",
    color: "Color",
    role: "Role",
    type: "Type",
    alt: "Alt",
    min: "Min",
    max: "Max",
    for: "For",
    tabindex: "TabIndex",
    download: "Download",
    method: "Method",
    action: "Action",
    width: "Width",
    height: "Height",
    title: "Title",
    crossorigin: "CrossOrigin",
    preload: "Preload",
    playsinline: "PlaysInline",
    autoplay: "AutoPlay",
    muted: "Muted",
    loop: "Loop",
    poster: "Poster",
    frameborder: "FrameBorder",
    allow: "Allow",
    allowfullscreen: "AllowFullScreen",
    allowtransparency: "AllowTransparency",
    rows: "Rows",
    integrity: "Integrity",
  }),

  new Method("Add").Add(
    new Parameter("...args").InstanceOf("class.Array"),
  ),
);

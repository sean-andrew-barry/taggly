import {Tag} from "/js/Tag.js";
import {Menu} from "/js/Tags/Material/Menu.js";

export default [
  Tag.Style().Add(
    Tag.CSS(Menu)
    .DisplayNone()
    .PositionAbsolute()
    .BoxSizing("border-box")
    .MaxWidth("calc(100vw - 32px)")
    .MaxHeight("calc(100vh - 32px)")
    .Margin(0)
    .Padding(0)
    .Transform("scale(1)")
    .TransformOrigin("top left")
    .Opacity("0")
    .Overflow("auto")
    .WillChange("transform, opacity")
    .ZIndex("8")
    .Transition("opacity .03s linear,-webkit-transform .12s cubic-bezier(0, 0, 0.2, 1)")
    .Transition("opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1)")
    .Transition("opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1),-webkit-transform .12s cubic-bezier(0, 0, 0.2, 1)")
    .BoxShadow("0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0,0,0,.12)")
    .BackgroundColor("#fff")
    .Color("#000")
    .BorderRadius("4px")
    .TransformOriginLeft("top left")
    .TransformOriginRight("top right")
    .MinWidth("112px").Add(
      Tag.CSS(Tag.UnorderedList)
      .TextFamily("Roboto, sans-serif")
      .SetStyle("-moz-osx-font-smoothing", "grayscale")
      .SetStyle("-webkit-font-smoothing", "antialiased")
      .TextSize("1rem")
      .TextHeight("1.75rem")
      .TextWeight("400")
      .TextSpacing("009375em")
      .TextDecoration("inherit")
      .TextTransform("inherit")
      .TextHeight("1.5rem")
      .Margin("0")
      .Padding("8px 0")
      .ListStyleTypeNone()
      .Color("rgba(0,0,0,.87)")
      .Color("var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))")
    ),

    Tag.CSS(Menu).Class("open")
    .DisplayInlineBlock()
    .Transform("scale(1)")
    .Opacity("1"),
  ),
];

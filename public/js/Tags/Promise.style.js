import {Tag} from "/js/Tag.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";
import {KeyFrames} from "/js/Tags/KeyFrames.js";
import {Span} from "/js/Tags/Span.js";

let style;
export default function()
{
  return style ??= new Style().Add(
    new CSS("promise")
    // .DisplayFlex()
    // .Width("auto")
    // .Height("auto")
    // .Height("100px")
    .MinHeight("100%")
    // .MinWidth("40px")
    // .Width("100%")
    // .Height("100%")
    // .AlignItemsCenter()
    // .JustifyContentCenter()
    .PositionRelative()
    ,

    new CSS("spinner")
    .Animation("1.5s linear infinite promise-spinner")
    .AnimationPlayState("inherit")
    .Border("solid 7.5px #cfd0d1")
    .BorderBottomColor("#1c87c9")
    .BorderRadius("50%")
    // .Content("")
    // .Height("inherit")
    .MinWidth("40px")
    .MinHeight("40px")
    // .Width("40px")
    // .PositionRelative()
    .PositionAbsolute()
    .Top("50%")
    .Left("50%")
    // .FlexShrink1()
    .TransformTranslate3D("-50%", "-50%", "0")
    ,

    new KeyFrames("promise-spinner").Add(
      new CSS("0%").TransformTranslate3D("-50%", "-50%", "0").TransformRotate("0deg"),
      new CSS("100%").TransformTranslate3D("-50%", "-50%", "0").TransformRotate("360deg"),
    ),
  );
}

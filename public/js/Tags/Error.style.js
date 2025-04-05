import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";

let style;
export function ErrorStyle()
{
  return style ??= new Style().Add(
    new CSS("error ")
    .DisplayBlock()
    .BorderRadius(3)
    .BackgroundColorDanger()
    .ColorDark()
    .PaddingXY(5)
    .FontSize(5)
    .Add(
      new CSS(".error-message")
      .MarginBottom(2)
      .BorderRadius(1)
      .Padding(3)
      .BackgroundColorWhite(),

      new CSS(".error-stack")
      .BorderRadius(1)
      .WhiteSpacePreWrap()
      .OverflowX("auto")
      .Padding("1.25em 1.5em")
      .WordWrapNormal()
      .BackgroundColor("#f5f5f5")
      .Color("#4a4a4a")
      .FontSize(".875em")
      .FontFamilyMonoSpace(),
    ),
  );
}

// export default new Style().Add(
//   new CSS("error")
//   .DisplayBlock()
//   .BorderRadius(3)
//   .BackgroundColorDanger()
//   .ColorDark()
//   .PaddingXY(5)
//   .FontSize(5)
//   .Add(
//     new CSS(" .error-message")
//     .MarginBottom(2)
//     .BorderRadius(1)
//     .Padding(3)
//     .BackgroundColorWhite(),
//
//     new CSS(" .error-stack")
//     .BorderRadius(1)
//     .WhiteSpacePreWrap()
//     .OverflowX("auto")
//     .Padding("1.25em 1.5em")
//     .WordWrapNormal()
//     .BackgroundColor("#f5f5f5")
//     .Color("#4a4a4a")
//     .FontSize(".875em")
//     .FontFamilyMonoSpace(),
//   ),
// );

import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";
import {KeyFrames} from "/js/Tags/KeyFrames.js";

export default new Style().Add(
  new KeyFrames("animate-stripes").Add(
    new CSS("0%").BackgroundPosition("0 0"),
    new CSS("100%").BackgroundPosition("60px 0"),
  ),
  new KeyFrames("auto-progress").Add(
    new CSS("0%").Width("0"),
    new CSS("100%").Width("100%"),
  ),

  new CSS("progress-bar")
  .BackgroundColor("#1a1a1a")
  .Height("45px")
  .Width("450px")
  .Margin("50px auto")
  .BorderRadius("5px")
  .BoxShadow("0 1px 5px #000 inset, 0 1px 0 #444")
  ,

  new CSS("stripes")
  .BackgroundSize("30px 30px")
  .BackgroundImage(`linear-gradient(
    135deg,
    rgba(255, 255, 255, .15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, .15) 50%,
    rgba(255, 255, 255, .15) 75%,
    transparent 75%,
    transparent
  )`)
  ,

  new CSS("stripes.animated").Animation("animate-stripes 0.6s linear infinite"),
  new CSS("stripes.animated.slower").AnimationDuration("1.25s"),
  new CSS("stripes.reverse").AnimationDirection("reverse"),

  new CSS(".progress-bar-inner").DisplayBlock().Height("45px").Width("0%").BackgroundColor("#34c2e3")
  .BorderRadius("3px")
  .BoxShadow("0 1px 0 rgba(255, 255, 255, .5) inset")
  .PositionRelative()
  .Animation("auto-progress 10s infinite linear")
  ,
);

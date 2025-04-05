import {CSS} from "/js/Tags/CSS.js";
import {Head} from "/js/Tags/Head.js";
import {Emoji} from "/js/Tags/Img/Emoji.js";

Head.Await(head =>
{
  head.Add(
    new CSS(Emoji)
    .DisplayInlineBlock()
    .Width("1.5em")
    .Height("1.5em")
    .Margin("0 0.05em 0 0.1em")
    .VerticalAlign("-0.1em"),
  );
});

Head.Get().Add(
  new CSS(Emoji)
  .DisplayInlineBlock()
  .Width("1.5em")
  .Height("1.5em")
  .Margin("0 0.05em 0 0.1em")
  .VerticalAlign("-0.1em"),
);

// export default new CSS(Emoji)
// .DisplayInlineBlock()
// .Width("1.5em")
// .Height("1.5em")
// .Margin("0 0.05em 0 0.1em")
// .VerticalAlign("-0.1em");

import {Tag} from "/js/Tag.js";

export class Reject extends Tag
{
  static GetNodeName(){ return "reject"; }

  constructor(node, error)
  {
    super(node)
    .DisplayBlock()
    .BorderRadius(3)
    .TextSize(6)
    .BackgroundDanger()
    .TextLight()
    .PaddingXY(5)
    .Add(
      Tag.Paragraph().Padding(3).Add(
        Tag.Span().Text(error.constructor.name),
        Tag.Span().Text(": "),
        Tag.Span().Text(error.message),
      ),
      error.stack && Tag.Pre().BorderRadius(1).WhiteSpacePreWrap().TextSizeSM().Add(
        Tag.Code().Text(error.stack),
      ),
    );
  }
}

Reject.Register();

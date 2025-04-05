import {Tag} from "/js/Tag.js";
import {NotificationFrame} from "/js/Tags/NotificationFrame.js";
import {HSLA} from "/js/Utility/Color/HSLA.js";
import {Hex} from "/js/Utility/Color/Hex.js";

export class Notification extends Tag
{
  static GetNodeName(){ return "notification"; }

  constructor(...args)
  {
    const content = [];
    for (let i = 0; i < args.length; i++)
    {
      content.push(args[i], " ");
    }

    super().Add(
      Tag.Div("Dismiss").Add(
        this.anchor = Tag.Anchor("Button").Text("DISMISS").OnClick(this.OnClickDismissHandler.bind(this)),
      ),
      Tag.Paragraph("Content").Add(
        ...content,
      ),
    );

    this.OnMouseOver(this.OnMouseOverHandler.bind(this));
    this.OnMouseOut(this.OnMouseOutHandler.bind(this));
    this.OnConnect(this.OnConnectHandler.bind(this));
  }

  OnClickDismissHandler(event)
  {
    event.preventDefault();
    this.remaining = 0;
  }

  OnMouseOverHandler(event)
  {
    this.paused = true;
  }

  OnMouseOutHandler(event)
  {
    this.remaining = this.duration; // Reset the remaining time
    this.paused = false;
  }

  OnConnectHandler(event)
  {
    this.duration = 6000;
    this.duration = 600000;
    this.remaining = this.duration;
    this.paused = false;

    this.id = setInterval(() =>
    {
      if (!this.paused) this.remaining -= 100;

      if (0 >= this.remaining)
      {
        clearInterval(this.id);

        this.Animation().Opacity(100, 0).MS(250).Play().Wait().then(a =>
        {
          if (this.IsInBody())
          {
            this.Remove();
          }
        });
      }
    }, 100);

    this.Animation().Opacity(0, 100).MS(250).Play();
  }

  Display()
  {
    Tag.NotificationFrame().AppendChild(this);
    return this;
  }

  Render()
  {
    return super.Render(
      Tag.Div("Dismiss").Add(
        this.anchor = Tag.Anchor("Button").Text("DISMISS").OnClick(event =>
        {
          e.preventDefault();
          this.remaining = 0;
        }),
      ),
      Tag.Paragraph("Content").Add(
        ...this.array,
      ),
    );
  }

  Yellow(){ this.BackgroundYellow(5).TextDark(); this.anchor.TextBlack(); return this; }
  Blue(){ this.BackgroundBlue(5).Color(HSLA.Grey(95)); return this; }
  Red(){ this.BackgroundColor(Hex.Danger()).Color(Hex.White()); this.anchor.Color(Hex.White()); return this; }
  Green(){ this.BackgroundGreen(5).TextWhite(); return this; }
  Dark(){ this.BackgroundDark().TextWhite(); return this; }
  Light(){ this.BackgroundColor(HSLA.Grey(95)).FontColorGrey(); return this; }

  Red(){ this.BackgroundColor("danger"); this.anchor.Color("black"); return this; }
}

Tag.Constructor(Notification).Bind().Add(
  Tag.Style().Add(
    Tag.CSS("notification")
    .DisplayFlex()
    .FlexWrapNoWrap()
    .FlexDirectionRowReverse()
    .FlexBasis("content")
    .Bottom("0")
    .Right("0")
    // .BackgroundGrey(8)
    .BackgroundColor(HSLA.Grey(15))
    .Bordered()
    // .BorderRed(4)
    .BorderColor(HSLA.Red(40))
    .Rounded()
    .PaddingXY(8, 5)
    .MarginXY(5, 6)
    .TextLight()
    .TextSize(6)
    .OverflowWrapBreakWord()
    .PointerEventsAuto()
    .MinWidth("40%")
    .Add(
      Tag.CSS("div.Dismiss").DisplayFlex().AlignItemsCenter().PaddingLeft(4).Add(
        // Tag.CSS("a.Button").TextGreen(4),
        Tag.CSS("a.Button")
        .Color(HSLA.Green(60))
        ,
      ),
      Tag.CSS("p.Content")
      .PointerEventsNone()
      .FlexGrow1()
      .FontSizeXL()
      .Color(HSLA.Grey(95))
      ,
    ),
    // Tag.CSS("notification.yellow").BackgroundYellow(5).TextDark().Add(
    //   Tag.CSS("a.Button").TextBlack(),
    // ),
    // Tag.CSS("notification.red").BackgroundRed(5).TextWhite().Add(
    //   Tag.CSS("a.Button").TextLight(),
    // ),
    // Tag.CSS("notification.blue").BackgroundBlue(5).TextWhite(),
    // Tag.CSS("notification.green").BackgroundGreen(5).TextWhite(),
    // Tag.CSS("notification.dark").BackgroundDark().TextWhite(),
    // Tag.CSS("notification.light").BackgroundLight().TextDark(),
  ),
);

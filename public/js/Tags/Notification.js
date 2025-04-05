import {Tag} from "/js/Tag.js";
import {NotificationFrame} from "/js/Tags/NotificationFrame.js";
import {HSLA} from "/js/Utility/Color/HSLA.js";
import {Hex} from "/js/Utility/Color/Hex.js";
import {Div} from "/js/Tags/Div.js";
import {A} from "/js/Tags/A.js";
import {P} from "/js/Tags/P.js";

export class Notification extends Tag
{
  static GetLocalName(){ return "notification"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(...args)
  {
    // const content = [];
    // for (let i = 0; i < args.length; i++)
    // {
    //   content.push(args[i], " ");
    // }

    super().Add(
      new P().GridArea("content").Add(
        ...args,
      ),
      new Div().GridArea("dismiss").Add(
        this.anchor = new A("Button").Text("DISMISS").OnClick(this.OnClickDismissHandler.bind(this)),
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
    this.remaining = this.duration;
    this.paused = false;

    this.id = setInterval(() =>
    {
      if (!this.paused) this.remaining -= 100;

      if (0 >= this.remaining)
      {
        clearInterval(this.id);

        this.Animate().TranslateY("0px", "300px").Opacity(100, 0).MS(250).Play().Wait().then(a =>
        {
          if (this.IsInBody())
          {
            this.Remove();
          }
        });
      }
    }, 100);

    this.Animate().TranslateY("300px", "0px").Opacity(0, 100).MS(250).Play();
  }

  Display()
  {
    NotificationFrame.Get().AppendChild(this);
    return this;
  }

  Render()
  {
    return super.Render(
      new Div("Dismiss").Add(
        this.anchor = new A("Button").Text("DISMISS").OnClick(event =>
        {
          e.preventDefault();
          this.remaining = 0;
        }),
      ),
      new P("Content").Add(
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

// Tag.Constructor(Notification).Bind().Add(
//   Tag.Style().Add(
//     Tag.CSS("notification")
//     .DisplayGrid()
//     .JustifyItems("stretch")
//     .AlignItems("center")
//     // .JustifyContent("center")
//     // .JustifyContent("stretch")
//     // .AlignContent("stretch")
//     .GridTemplateColumns("1fr auto")
//     .GridTemplateAreas([
//       "content dismiss",
//     ])
//     .MarginBottom("2rem")
//     .MarginX("2rem")
//     .PaddingX("1rem")
//     .Rounded()
//     .PointerEventsAuto()
//     // .Opacity("0")
//     // .TransformTranslateY("300px")
//     // .TransitionProperty("opacity, transform")
//     // .TransitionDuration("0.5s")
//     // .TransitionTimingFunction("ease-in-out")
//     ,
//
//     // Tag.CSS("notification.animate").Opacity("1").TransformTranslateY("0"),
//
//     // Tag.MediaQuery().Mobile().Add(
//     //   Tag.CSS("notification").MarginRight("unset"),
//     // ),
//
//     // Tag.CSS("notification")
//     // .DisplayFlex()
//     // .FlexWrapNoWrap()
//     // .FlexDirectionRowReverse()
//     // .FlexBasis("content")
//     // .Bottom("0")
//     // .Right("0")
//     // // .BackgroundGrey(8)
//     // .BackgroundColor(HSLA.Grey(15))
//     // .Bordered()
//     // // .BorderRed(4)
//     // .BorderColor(HSLA.Red(40))
//     // .Rounded()
//     // .PaddingXY(8, 5)
//     // .MarginXY(5, 6)
//     // .TextLight()
//     // .TextSize(6)
//     // .OverflowWrapBreakWord()
//     // .PointerEventsAuto()
//     // .MinWidth("40%")
//     // .Add(
//     //   Tag.CSS("div.Dismiss").DisplayFlex().AlignItemsCenter().PaddingLeft(4).Add(
//     //     // Tag.CSS("a.Button").TextGreen(4),
//     //     Tag.CSS("a.Button")
//     //     .Color(HSLA.Green(60))
//     //     ,
//     //   ),
//     //   Tag.CSS("p.Content")
//     //   .PointerEventsNone()
//     //   .FlexGrow1()
//     //   .FontSizeXL()
//     //   .Color(HSLA.Grey(95))
//     //   ,
//     // ),
//     // Tag.CSS("notification.yellow").BackgroundYellow(5).TextDark().Add(
//     //   Tag.CSS("a.Button").TextBlack(),
//     // ),
//     // Tag.CSS("notification.red").BackgroundRed(5).TextWhite().Add(
//     //   Tag.CSS("a.Button").TextLight(),
//     // ),
//     // Tag.CSS("notification.blue").BackgroundBlue(5).TextWhite(),
//     // Tag.CSS("notification.green").BackgroundGreen(5).TextWhite(),
//     // Tag.CSS("notification.dark").BackgroundDark().TextWhite(),
//     // Tag.CSS("notification.light").BackgroundLight().TextDark(),
//   ),
// );

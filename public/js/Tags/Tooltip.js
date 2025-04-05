import {Tag} from "/js/Tag.js";
import {RGB} from "/js/Utility/Color/RGB.js";
import {Div} from "/js/Tags/Div.js";
// import {Slot} from "/js/Tags/Slot.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";
// import {Div} from "/js/Tags/Div.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";
import {Resize} from "/js/Event/Resize.js";
import {ViewEnter} from "/js/Event/ViewEnter.js";
import {ViewLeave} from "/js/Event/ViewLeave.js";
import {FullViewEnter} from "/js/Event/FullViewEnter.js";
import {FullViewLeave} from "/js/Event/FullViewLeave.js";
import {MouseOver} from "/js/Event/MouseOver.js";
import {MouseOut} from "/js/Event/MouseOut.js";

class TooltipFrame extends Div
{
  static GetMetaURL(){ return import.meta.url; }

  [Resize](event)
  {
    // console.log("TooltipFrame.Resize");
    this.GetParent().UpdatePosition();
  }
}

export class Tooltip extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "tooltip"; }

  static BackgroundColor(){ return new RGB(0, 0, 0); }
  static Color(){ return "white"; }

  static GetStyle()
  {
    const bg_color = this.BackgroundColor();

    return this.style ??= new Style().Inject("head").Append(
      new CSS("tooltip")
      .DisplayNone()
      .PositionFixed()
      // .PointerEventsNone()
      // .Width("100%")
      // .Height("100%")
      // .Bottom("0")
      // .Left("0")
      // .Right("0")
      // .Top("0")
      // .ZIndex("-100")
      .Append(
        new CSS(".top")
        .Bottom("100%")
        .Left("0")
        .Right("0"),
      ),

      new CSS("tooltip > div.tooltip-frame")
      .PaddingBottom("0.5em")
      ,

      new CSS("tooltip > div.tooltip-frame > div.content")
      .PositionAbsolute()
      // .PointerEventsNone()
      .Width("100px")
      .LineHeight("20px")
      .Padding("10px")
      .FontSize("14px")
      .TextAlign("center")
      .Color("rgb(113, 157, 171)")
      .Color(this.Color())
      .Background(bg_color)
      .Border(`4px solid ${bg_color}`)
      .BorderRadius("5px")
      .TextShadow("rgba(0, 0, 0, 0.1) 1px 1px 1px")
      .BoxShadow("rgba(0, 0, 0, 0.1) 1px 1px 2px 0px")
      .DisplayFlex()
      .JustifyContent("center")
      .AlignItems("center")
      .AlignContent("center")
      .Width("auto")
      .Bottom("100%")
      .Padding("1rem")
      // .MarginY("1rem")
      // .Opacity(0)
      .Transition("opacity 0.3s ease-in-out")
      .WhiteSpaceNoWrap()
      .ZIndex("1000")
      .OverflowY("visible")
      .FontSize("1em")
      .FontWeightNormal()
      ,

      new CSS("tooltip.bottom > div.content")
      .Bottom("0")
      .Top("100%"),

      new CSS("tooltip div.content:after")
      .Content(`""`)
      .PositionAbsolute()
      .DisplayBlock()
      .Width("0")
      .Height("0")
      .BorderWidth("10px")
      .BorderStyle("solid")
      .BorderColor("transparent")
      .BorderTopColor("inherit")
      .Bottom("-20px")
      .Left("10%")
      ,

      // new CSS("tooltip:hover > div.content")
      // .Opacity(1)
      // .Transition("opacity 0.3s ease-in-out")
      // .TransitionDelay("0.3s")
      // .PointerEvents("unset"),

      new CSS("tooltip:hover").DisplayBlock(),
      new CSS("*:hover + tooltip").DisplayBlock(),
      // new CSS("tooltip + *:hover").DisplayBlock(),
      // new CSS("*:hover > tooltip").DisplayBlock(),
    );
  }

  static GetStyle()
  {
    const bg_color = this.BackgroundColor();

    return this.style ??= new Style().Inject("head").Append(
      new CSS("tooltip")
      // .DisplayNone()
      .PositionFixed()
      // .PointerEventsNone()
      // .Width("100%")
      // .Height("100%")
      // .Bottom("0")
      // .Left("0")
      // .Right("0")
      // .Top("0")
      // .ZIndex("-100")
      .Append(
        // new CSS(".top")
        // .Bottom("100%")
        // .Left("0")
        // .Right("0"),

        new CSS(".bottom")
        .Bottom("0")
        .Top("100%"),
      ),

      new CSS("tooltip > div.tooltip-frame")
      .PositionAbsolute()
      .LineHeight("20px")
      // .Padding("10px")
      .Width("auto")
      .Bottom("100%")
      .PaddingBottom("10px")
      .ZIndex("1000")
      // .PaddingBottom("0.5em")
      ,

      new CSS("tooltip.bottom > div.tooltip-frame")
      .Bottom("unset")
      .PaddingBottom("0px")
      .PaddingTop("10px")
      // .PaddingBottom("0.5em")
      ,

      new CSS("tooltip div.tooltip-content")
      // .PositionAbsolute()
      // .PointerEventsNone()

      .FontSize("14px")
      .TextAlign("center")
      // .Color("rgb(113, 157, 171)")
      .Color(this.Color())
      .Background(bg_color)
      .Border(`4px solid ${bg_color}`)
      .BorderRadius("5px")
      .TextShadow("rgba(0, 0, 0, 0.1) 1px 1px 1px")
      .BoxShadow("rgba(0, 0, 0, 0.1) 1px 1px 2px 0px")
      .DisplayFlex()
      .JustifyContent("center")
      .AlignItems("center")
      .AlignContent("center")

      .Padding("1rem")
      // .MarginY("1rem")
      // .Opacity(0)
      .Transition("opacity 0.3s ease-in-out")
      .WhiteSpaceNoWrap()
      .ZIndex("1000")
      .OverflowY("visible")
      .FontSize("1em")
      .FontWeightNormal()
      ,

      new CSS("tooltip .tooltip-content:after")
      // .Content(`""`)
      .Content("")
      .PositionAbsolute()
      .DisplayBlock()
      .Width("0")
      .Height("0")
      .BorderWidth("10px")
      .BorderStyle("solid")
      .BorderColor("transparent")
      .BorderTopColor("inherit")
      .Bottom("-10px")
      .Left("10%")
      ,

      new CSS("tooltip.bottom .tooltip-content:after")
      // .Bottom("-10px")
      // .Bottom("0px")
      .TransformRotate("180deg").Bottom("0").Top("-10px")
      ,

      // new CSS("tooltip.bottom .tooltip-content:after").TransformRotate("180deg").Bottom("0").Top("-20px"),

      new CSS("tooltip:hover").DisplayBlock(),
      new CSS("*:hover + tooltip").DisplayBlock(),
      // new CSS("tooltip + *:hover").DisplayBlock(),
      // new CSS("*:hover > tooltip").DisplayBlock(),
    );
  }

  static GetStyle()
  {
    const bg_color = this.BackgroundColor();

    return this.style ??= new Style().Inject("head").Append(
      new CSS("tooltip")
      .DisplayNone()
      // .PointerEventsNone()
      // .PositionRelative()
      .PositionFixed()
      .ZIndex("1000")
      .Append(
        new CSS(".bottom")
        .Bottom("0")
        .Top("100%"),
      ),

      new CSS(".is-active").DisplayBlock(),
      // new CSS("tooltip:hover").DisplayBlock(),
      // new CSS("*:hover > tooltip").DisplayBlock(),

      new CSS("tooltip > div.tooltip-frame")
      .PositionAbsolute()
      .LineHeight("20px")
      .Width("auto")
      .Bottom("100%")
      .PaddingBottom("10px")
      .ZIndex("1000")
      ,

      new CSS("tooltip.bottom > div.tooltip-frame")
      .Bottom("unset")
      .PaddingBottom("0px")
      .PaddingTop("10px")
      ,

      new CSS("tooltip:hover").DisplayBlock(),
      new CSS("*:hover + tooltip").DisplayBlock(),

      new CSS("tooltip div.tooltip-content")
      .FontSize("14px")
      .TextAlign("center")
      // .Color("rgb(113, 157, 171)")
      .Color(this.Color())
      .Background(bg_color)
      .Border(`4px solid ${bg_color}`)
      .BorderRadius("5px")
      .TextShadow("rgba(0, 0, 0, 0.1) 1px 1px 1px")
      .BoxShadow("rgba(0, 0, 0, 0.1) 1px 1px 2px 0px")
      .DisplayFlex()
      .JustifyContent("center")
      .AlignItems("center")
      .AlignContent("center")
      .Padding("1rem")
      .WhiteSpaceNoWrap()
      .OverflowY("visible")
      .FontSize("1em")
      .FontWeightNormal()
      ,

      new CSS("tooltip .tooltip-content:after")
      .Content("")
      .PositionAbsolute()
      .DisplayBlock()
      .Width("0")
      .Height("0")
      .BorderWidth("10px")
      .BorderStyle("solid")
      .BorderColor("transparent")
      .BorderTopColor("inherit")
      .Bottom("-10px")
      .Left("10%")
      ,

      new CSS("tooltip.bottom .tooltip-content:after")
      .TransformRotate("180deg")
      .Bottom("0")
      .Top("-10px")
      ,
    );
  }

  constructor(...args)
  {
    super();

    // this.AddClass("is-active");

    super.Append(
      // new Div().Class("tooltip-frame").Append(
      new TooltipFrame().Class("tooltip-frame").Append(
        new Div().Class("tooltip-content content is-medium")
        .Append(
          // new Slot().Name("content"),
          ...args,
        ),
      ),
    );

    this.constructor.GetStyle();

    // this.OnConnect(this.OnConnectHandler.bind(this));
    // this.OnDisconnect(this.OnDisconnectHandler.bind(this));
    // this.OnFullViewEnter(this.OnFullViewEnterHandler.bind(this));
    // this.OnFullViewLeave(this.OnFullViewLeaveHandler.bind(this));
  }

  // Or use Append?
  Add(...args)
  {
    this.Query("div.tooltip-content").Append(...args);
    return this;
  }

  static Target(...args){ return new this().Target(...args); }
  Target(target){ return this.SetAttribute("target", target); }

  GetTarget()
  {
    let target = this.GetParent();
    if (this.HasAttribute("target"))
    {
      const selector = this.GetAttribute("target");
      target = Tag.Query(selector);

      if (!target)
      {
        throw new Error(`Tooltip failed to find a target from selector "${selector}"`);
      }
    }

    return target;
  }

  UpdatePosition()
  {
    const target = this.GetTarget();

    const rect = target.GetBoundingClientRect();

    this.Top(`${rect.y}px`);
    this.Left(`${rect.x}px`);

    return this;
  }

  Listen()
  {
    const target = this.GetTarget();

    target.Once(MouseOver, event =>
    {
      this.Show();

      target.Once(MouseOut, event =>
      {
        this.Hide();
        this.Listen();
      });
    });

    return this;
  }

  Show(){ return this.AddClass("is-active"); }
  Hide(){ return this.RemoveClass("is-active"); }

  [Connect](event)
  {
    this.Listen();
    // const target = this.GetTarget();
    // target.On(MouseOver, event =>
    // {
    //
    // });
    //
    // target.On(MouseOut, event =>
    // {
    //
    // });
  }

  // [Connect](event)
  // {
  //   let target = this.GetParent();
  //   if (this.HasAttribute("target"))
  //   {
  //     const selector = this.GetAttribute("target");
  //     target = Tag.Query(selector);
  //
  //     if (!target)
  //     {
  //       throw new Error(`Tooltip failed to find a target from selector "${selector}"`);
  //     }
  //   }
  //
  //   target.On(Resize, event =>
  //   {
  //     const rect = target.GetBoundingClientRect();
  //
  //     // console.log("Target resized!", rect);
  //
  //     this.Top(`${rect.y}px`);
  //     this.Left(`${rect.x}px`);
  //   });
  // }

  // [ViewEnter](event)
  // {
  //   console.log("Tooltip.ViewEnter");
  // }
  //
  // [ViewLeave](event)
  // {
  //   console.log("Tooltip.ViewLeave");
  // }
  //
  // [FullViewEnter](event)
  // {
  //   console.log("Tooltip.FullViewEnter");
  // }
  //
  // [FullViewLeave](event)
  // {
  //   console.log("Tooltip.FullViewLeave");
  // }

  // [Connect](event)
  // {
  //   // return;
  //
  //   console.log("Tooltip.Connect");
  //   // this.prev = this.GetPrevSibling();
  //   this.prev = this.GetParent();
  //   // this.on_resize_handler = this.OnResizeHandler.bind(this);
  //   // this.prev.On(Resize, this.on_resize_handler);
  //
  //   // this.on_resize_handler();
  // }

  // [Disconnect](event)
  // {
  //   // return;
  //
  //   console.log("Tooltip.Disconnect");
  //   this.prev.Off(Resize, this.on_resize_handler);
  //   delete this.on_resize_handler;
  // }

  OnResizeHandler(event)
  {
    const rect = this.prev.GetBoundingClientRect();

    let offset = 0;
    if (this.HasClass("bottom"))
    {
      offset = rect.height;
    }

    this.Top(`${rect.y + offset}px`);
    this.Left(`${rect.x}px`);
    // this.Width(`${rect.width}px`);
    // this.Height(`${rect.height + offset}px`);

    // this.constructor.GetGlobal()
    // .ReplaceChildren(...this.args)
    // .Top(`${rect.y}px`)
    // .Left(`${rect.x}px`)
    // .Width(`${rect.width}px`)
    // .Height(`${rect.height}px`);

    // this.Bottom("100%");
    // this.Left("0");
    // this.Right("0");

    // // Copy the dimensions of the previous tag
    // this.Left(`${rect.x}px`);
    // this.Top(`${rect.y}px`);
    // this.Width(`${rect.width}px`);
    // this.Height(`${rect.height}px`);
  }

  OnResizeHandler(event)
  {
    const current = this.GetBoundingClientRect();
    const rect = this.prev.GetBoundingClientRect();

    const x = current.x - rect.x;
    const y = current.y - rect.y;

    console.log(x, y);
    // console.log(current);
    // console.log(rect);

    this.Bottom(`${y}px`);
    if (x !== 0) this.Right(`${x}px`);
    // this.Top(`${rect.y - current.y}px`);
    // this.Left(`${rect.x - current.x}px`);
    // this.Width(`${rect.width}px`);
    // this.Height(`${rect.height + offset}px`);

    // this.constructor.GetGlobal()
    // .ReplaceChildren(...this.args)
    // .Top(`${rect.y}px`)
    // .Left(`${rect.x}px`)
    // .Width(`${rect.width}px`)
    // .Height(`${rect.height}px`);

    // this.Bottom("100%");
    // this.Left("0");
    // this.Right("0");

    // // Copy the dimensions of the previous tag
    // this.Left(`${rect.x}px`);
    // this.Top(`${rect.y}px`);
    // this.Width(`${rect.width}px`);
    // this.Height(`${rect.height}px`);
  }

  // OnShow(fn, opts){ return this.AddEventListener("OnShow", fn, opts); }
  // OnHide(fn, opts){ return this.AddEventListener("OnHide", fn, opts); }

  OnConnectHandler(event)
  {
    const parent = this.GetParent();
    if (parent) parent.AddClass("is-tooltip-base");
  }

  OnDisconnectHandler(event)
  {
    const parent = this.GetParent();
    if (parent) parent.RemoveClass("is-tooltip-base");
  }

  OnFullViewEnterHandler(event)
  {
    console.log("Tooltip content FullViewEnter");
  }

  OnFullViewLeaveHandler(event)
  {
    console.log("Tooltip content FullViewLeave");
  }

  _OnConnectHandler(event)
  {
    console.log("OnConnect", this.GetNode());
    this.target = this.GetParent();
    this.target.PositionRelative();

    this.on_mouse_over_handler = this.OnMouseOverHandler.bind(this);
    this.on_mouse_out_handler = this.OnMouseOutHandler.bind(this);

    this.target.OnMouseOver(this.on_mouse_over_handler);
    this.target.OnMouseOut(this.on_mouse_out_handler);
  }

  _OnDisconnectHandler(event)
  {
    this.target.RemoveEventListener("mouseover", this.on_mouse_over_handler);
    this.target.RemoveEventListener("mouseout", this.on_mouse_out_handler);
  }

  _OnMouseOverHandler(event)
  {
    event.preventDefault();
    // console.log("Show tooltip?");
    this.AddClass("active");
    // this.AppendChild(this.tooltip);
  }

  OnMouseOutHandler(event)
  {
    event.preventDefault();
    // console.log("Hide tooltip?");
    this.RemoveClass("active");
    // this.tooltip.Remove();
  }
}

// window.addEventListener("OnAttribute", event =>
// {
//   const {name, value, old} = event.value;
//   console.log("OnAttribute", name, value, old);
//   if (name === "tooltip")
//   {
//     console.log("Setting tooltip handler for", event.tag);
//   }
// }, { capture: true });

// Tag.HTML().OnAttribute(event =>
// {
//   const {name, value, old} = event.value;
//   console.log("OnAttribute", name, value, old);
//   if (name === "tooltip")
//   {
//     console.log("Setting tooltip handler for", event.tag);
//   }
// }, { capture: true });

// const GREYN80 = HSLA.Grey(-80);
// const GREY80 = HSLA.Grey(80);
// function Generate()
// {
//
// }

// const GREY5  = HSLA.Grey(5);
// const GREY15 = HSLA.Grey(15);
// const GREY95 = HSLA.Grey(95);
// const GREY99 = HSLA.Grey(99);
// const BLUE55 = HSLA.Blue(55);
//
// function Generate(cls, bg, text)
// {
//   return new CSS(`tooltip${cls} > div.content`).BackgroundColor(bg).BorderColor(bg).Color(text);
// }

// Tag.Style().Add(
//   Generate("", GREY15, GREY95),
//   Generate(".dark", GREY15, GREY95),
//   Generate(".light", GREY99, GREY5),
//   Generate(".blue", BLUE55, GREY95),
//   // Tag.CSS("tooltip > div.content").BackgroundColor(GREY15).BorderColor(GREY15).Color(GREY95),
//   // Tag.CSS("tooltip.dark > div.content").BackgroundColor(GREY15).BorderColor(GREY15).TextGrey(95),
//   // Tag.CSS("tooltip.light > div.content").BackgroundColor(GREY99).BorderColor(GREY99).Color(GREY5),
//   // Tag.CSS("tooltip.blue > div.content").BackgroundColor(BLUE55).BorderColor(BLUE55).Color(GREY95),
// );

// Tag.Constructor(Tooltip).Bind().Add(
//   Tag.Style().Add(
//     Tag.CSS(".is-tooltip-base").PositionRelative(),
//
//     Tag.CSS("tooltip")
//     // .PositionRelative()
//     .Width("100%")
//     .Height("100%")
//     .Overlayed()
//     // .MarginBottom("-100%") // Use this to overlay it on the parent, because the parent may not be relative
//     // .MarginTop("-100%") // Use this to overlay it on the parent, because the parent may not be relative
//     // .MarginY("-100%") // Use this to overlay it on the parent, because the parent may not be relative
//     .DisplayFlex()
//     .JustifyContent("center")
//     .AlignItems("center")
//     .Overflow("visible")
//     .OverflowY("visible")
//     ,
//
//     Tag.CSS("tooltip > div.content")
//     .PositionAbsolute()
//     .PointerEventsNone()
//     .Width("100px")
//     .LineHeight("20px")
//     .Padding("10px")
//     .FontSize("14px")
//     .TextAlign("center")
//     .Color("rgb(113, 157, 171)")
//     .Background("rgb(255, 255, 255)")
//     .Border("4px solid rgb(255, 255, 255)")
//     .BorderRadius("5px")
//     .TextShadow("rgba(0, 0, 0, 0.1) 1px 1px 1px")
//     .BoxShadow("rgba(0, 0, 0, 0.1) 1px 1px 2px 0px")
//     .DisplayFlex()
//     .JustifyContent("center")
//     .AlignItems("center")
//     .AlignContent("center")
//     .Width("auto")
//     .Bottom("100%")
//     .Padding("1rem")
//     .MarginY("1rem")
//     .Opacity(0)
//     .Transition("opacity 0.3s ease-in-out")
//     .WhiteSpaceNoWrap()
//     .ZIndex("1000")
//     .OverflowY("visible")
//     .FontSize("1em")
//     .FontWeightNormal()
//     ,
//
//     Tag.CSS("tooltip.bottom > div.content")
//     .Bottom("0")
//     .Top("100%"),
//
//     Tag.CSS("tooltip:hover > div.content")
//     .Opacity(1)
//     .Transition("opacity 0.3s ease-in-out")
//     .TransitionDelay("0.3s")
//     .PointerEvents("unset"),
//
//     Tag.CSS("tooltip > div.content:after")
//     .Content(`""`)
//     .PositionAbsolute()
//     .DisplayBlock()
//     .Width("0")
//     .Height("0")
//     .BorderWidth("10px")
//     .BorderStyle("solid")
//     .BorderColor("transparent")
//     .BorderTopColor("inherit")
//     .Bottom("-20px")
//     ,
//
//     Tag.CSS("tooltip.bottom > div.content:after").TransformRotate("180deg").Bottom("0").Top("-20px"),
//
//     Generate("", GREY15, GREY95),
//     Generate(".dark", GREY15, GREY95),
//     Generate(".light", GREY99, GREY5),
//     Generate(".blue", BLUE55, GREY95),
//   ),
// );

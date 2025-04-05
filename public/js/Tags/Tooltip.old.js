import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Tooltip extends Tag
{
  constructor(...args)
  {
    // Create a grid that overlays the target object and then align the tooltip as a negative offset to that grid
    super().Add(
      Tag.Div("control").Add(
        Tag.Div("notification is-dark").Add(
        // Tag.Div("has-background-dark").Add(
          Tag.Div("content is-medium").WhiteSpaceNoWrap().Add(
            Tag.Paragraph().Add(...args),
            // Tag.Pre().Add(
            // ),
          ),
        ),
      ),

      // Tag.Div("grid").Add(
      //
      // ),
    );

    // this.tooltip = Tag.Div().Add(
    //   Tag.Div("notification is-dark").Add(
    //     Tag.Div("content is-medium").Add(
    //       Tag.Paragraph().Add(...args),
    //     ),
    //   ),
    // );

    // .DisplayNone()
    // this.PositionAbsolute().BackgroundDark();
    // Tag.Body().AppendChild(this);

    // this.Wait().then(() =>
    // {
    //   const parent = this.GetParent();
    //   // console.log("Added tooltip to DOM", parent);
    //
    //   parent.OnMouseOver(this.OnMouseOverHandler.bind(this));
    //   parent.OnMouseOut(this.OnMouseOutHandler.bind(this));
    // });

    this.OnConnect(this.OnConnectHandler.bind(this));
    this.OnDisconnect(this.OnDisconnectHandler.bind(this));
  }

  OnConnectHandler(event)
  {
    console.log("OnConnect", this.GetNode());
    this.target = this.GetParent();
    this.target.PositionRelative();

    this.on_mouse_over_handler = this.OnMouseOverHandler.bind(this);
    this.on_mouse_out_handler = this.OnMouseOutHandler.bind(this);

    this.target.OnMouseOver(this.on_mouse_over_handler);
    this.target.OnMouseOut(this.on_mouse_out_handler);
  }

  OnDisconnectHandler(event)
  {
    this.target.RemoveEventListener("mouseover", this.on_mouse_over_handler);
    this.target.RemoveEventListener("mouseout", this.on_mouse_out_handler);
  }

  OnMouseOverHandler(event)
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

Tag.Constructor(Tooltip).Add(
  Tag.Style().Add(
    // .Left("0").Right("0").Top("0").Bottom("0")
    // .DisplayGrid()
    Tag.CSS("tooltip")
    // .DisplayGrid()
    .PositionAbsolute()
    .Width("100%")
    .Height("100%")
    .Left("0")
    .Top("0")
    .Right("0")
    .Bottom("0")
    // .Padding("1rem")
    .DisplayFlex()
    .JustifyContent("center")
    .AlignItems("center")
    // .AlignContent("center")
    .Overflow("visible")
    .Add(
      Tag.CSS(".control")
      .PositionAbsolute()
      // .DisplayNone()
      .Width("auto")
      // .Top("100%")
      .Bottom("100%")
      .Padding("1rem")
      // .Opacity("0")
      // .Transition("opacity 0.3s ease-in")
      ,
    ),

    Tag.CSS("tooltip > .control")
    .PositionAbsolute()
    .Width("100px")
    .Height("20px")
    .LineHeight("20px")
    .Padding("10px")
    .FontSize("14px")
    .TextAlign("center")
    .Color("rgb(113, 157, 171)")
    .Background("rgb(255, 255, 255)")
    .Border("4px solid rgb(255, 255, 255)")
    .BorderRadius("5px")
    .TextShadow("rgba(0, 0, 0, 0.1) 1px 1px 1px")
    .BoxShadow("rgba(0, 0, 0, 0.1) 1px 1px 2px 0px")
    ,

    Tag.CSS("tooltip > .control").Opacity(0).Transition("opacity 0.3s ease-in-out"),
    Tag.CSS("tooltip:hover > .control").Opacity(1).Transition("opacity 0.3s ease-in-out").TransitionDelay("0.3s"),

    Tag.CSS("tooltip .notification::before")
    .Content(`""`)
    .DisplayBlock()
    .Width("0")
    .Height("0")
    .PositionAbsolute()
    .BorderTop("8px solid transparent")
    .BorderLeft("8px solid transparent")
    .BorderBottom("8px solid black")
    .Left("-8px")
    .Top("100%")
    ,
    // Tag.CSS("tooltip").DisplayBlock().BoxSizingBorderBox().PositionAbsolute().Width("100%").Height("100%").Add(
    //   // Tag.CSS(".control").DisplayNone().PositionAbsolute().ZIndex(100).PointerEventsNone().OverflowHidden().WhiteSpacePre(),
    // ),
    // Tag.CSS("tooltip.active .control").DisplayBlock().Opacity("1"),
    // Tag.CSS("[data-tooltip]").Content("attr(data-tooltip)").DisplayNone(),
    // Tag.CSS("[data-tooltip]").PseudoHover().DisplayBlock(),
    // [data-tooltip] {
    //   content: attr(data-tooltip);
    //   display: none;
    //   // however people wanna style it..
    // }
    // [data-tooltip]:hover {
    //   display: block; // or something..
    // }
  ),
);

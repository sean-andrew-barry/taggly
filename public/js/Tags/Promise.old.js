import {Tag} from "/js/Tag.js";

export class Promise extends Tag
{
  // static GetLocalName(){ return "promise"; }

  constructor(promise)
  {
    // super("lds-roller");
    super();

    this.promise = promise.then(result =>
    {
      return this.Wait().then(() =>
      {
        const tag = this.Convert(result);

        if (tag) this.Replace(tag);
        else this.Remove();
      });
    })
    .catch(error =>
    {
      // console.error("Promise tag error", error);
      // Tag.Body().Error(error);
      const tag = this.Convert(error);
      this.Replace(tag);
    });
  }

  _Render()
  {
    this.promise.then(r =>
    {
      const result = this.Convert(r);

      // If the result can be converted to a tag, replace this with it
      if (result) this.Replace(result);
      else this.Remove();
    });

    return super.Render(
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
      Tag.Div(),
    );
  }

  Deconvert(){ return this.promise; }

  // Initialize(parent)
  // {
  //   const children = [
  //     {
  //       delay: "-0.036s",
  //       top: "63px",
  //       left: "63px",
  //     },
  //     {
  //       delay: "-0.072s",
  //       top: "68px",
  //       left: "56px",
  //     },
  //     {
  //       delay: "-0.108s",
  //       top: "71px",
  //       left: "48px",
  //     },
  //     {
  //       delay: "-0.18s",
  //       top: "71px",
  //       left: "32px",
  //     },
  //     {
  //       delay: "-0.144s",
  //       top: "72px",
  //       left: "40px",
  //     },
  //     {
  //       delay: "-0.216s",
  //       top: "68px",
  //       left: "24px",
  //     },
  //     {
  //       delay: "-0.252s",
  //       top: "63px",
  //       left: "17px",
  //     },
  //     {
  //       delay: "-0.288s",
  //       top: "56px",
  //       left: "12px",
  //     },
  //   ];
  //
  //   // NOTE: Full credit for this animation goes to https://loading.io/css/
  //   // Thank you!
  //   Promise.GetStyles().Add(
  //
  //   );
  // }

  // Connect()
  // {
  //   const parent = this.GetParent();
  //
  //   this.promise.then(result =>
  //   {
  //     const tag = this.Convert(result);
  //
  //     if (tag) parent.ReplaceChild(this, tag);
  //     else parent.RemoveChild(this);
  //
  //     return tag;
  //   })
  //   .catch(error =>
  //   {
  //     return this.Reject(error);
  //   });
  // }
}

// const children = [
//   {
//     delay: "-0.036s",
//     top: "63px",
//     left: "63px",
//   },
//   {
//     delay: "-0.072s",
//     top: "68px",
//     left: "56px",
//   },
//   {
//     delay: "-0.108s",
//     top: "71px",
//     left: "48px",
//   },
//   {
//     delay: "-0.18s",
//     top: "71px",
//     left: "32px",
//   },
//   {
//     delay: "-0.144s",
//     top: "72px",
//     left: "40px",
//   },
//   {
//     delay: "-0.216s",
//     top: "68px",
//     left: "24px",
//   },
//   {
//     delay: "-0.252s",
//     top: "63px",
//     left: "17px",
//   },
//   {
//     delay: "-0.288s",
//     top: "56px",
//     left: "12px",
//   },
// ];

// Tag.Constructor(Promise).Bind().Add(
//   // // NOTE: Full credit for this animation goes to https://loading.io/css/
//   // // Thank you!
//   // Tag.Style().Add(
//   //   new Tag("promise", "lds-roller")
//   //   // .DisplayInlineBlock()
//   //   .PositionRelative()
//   //   // .Width("80px")
//   //   // .Height("80px")
//   //   .Width("100%")
//   //   .Height("100%")
//   //   .DisplayFlex()
//   //   .AlignItemsCenter()
//   //   .JustifyContentCenter()
//   //   .Add(
//   //     Tag.Div()
//   //     .SetStyle("animation", "lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite")
//   //     .SetStyle("transform-origin", "40px 40px"),
//   //
//   //     Tag.Div()
//   //     .PseudoAfter()
//   //     .Content(" ")
//   //     .DisplayBlock()
//   //     .PositionAbsolute()
//   //     .Width("6px")
//   //     .Height("6px")
//   //     .BorderRadius("50%")
//   //     .Background("#bb9c9c")
//   //     .Margin("-4px 0 0 -4px"),
//   //
//   //     children.map(({delay, top, left}, index) =>
//   //       Tag.Div().PseudoNthChild(index + 1).SetStyle("animation-delay", delay).Add(
//   //         Tag.Null().PseudoAfter().Top(top).Left(left),
//   //       ),
//   //     ),
//   //
//   //     Tag.KeyFrames("lds-roller").Add(
//   //       Tag.KeyFrame("0%").Transform("rotate(0deg)"),
//   //       Tag.KeyFrame("100%").Transform("rotate(360deg)"),
//   //     ),
//   //   ),
//   // ),
//
//   // () =>
//   // {
//   //   console.log("Generating Promise Styles!");
//   //   return ;
//   // },
// );

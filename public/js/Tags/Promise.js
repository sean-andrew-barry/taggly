import {Tag} from "/js/Tag.js";
import {Error} from "/js/Tags/Error.js";
import {Div} from "/js/Tags/Div.js";
import {Head} from "/js/Tags/Head.js";
import {CSS} from "/js/Tags/CSS.js";
import {KeyFrames} from "/js/Tags/CSS/KeyFrames.js";
import {Connect} from "/js/Event/Connect.js";
import {Redraw} from "/js/Event/Redraw.js";
import {ViewEnter} from "/js/Event/ViewEnter.js";
// import style from "/js/Tags/Promise.style.js";

class Spinner extends Tag
{
  static GetLocalName(){ return "spinner"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(...args)
  {
    super(...args)
    .PositionAbsolute()
    .AnimationDuration("1500ms")
    .AnimationIterationCount("infinite")
    .Border("solid 7.5px #cfd0d1")
    .BorderBottomColor("#1c87c9")
    .BorderRadius("50%")
    .MinWidth("40px")
    .MinHeight("40px")
    .Top("50%")
    .Left("50%")
    .Transform(["rotate(0deg)", "rotate(360deg)"])
    .Animate();
  }
}

// const PROMISE_SPINNER = new KeyFrames("promise-spinner").Add(
//   new CSS("0%").TransformTranslate3D("-50%", "-50%", "0").TransformRotate("0deg"),
//   new CSS("100%").TransformTranslate3D("-50%", "-50%", "0").TransformRotate("360deg"),
// );

const GlobalPromise = globalThis.Promise;

export class Promise extends Tag
{
  static GetLocalName(){ return "promise"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(value)
  {
    super();

    if (value instanceof GlobalPromise)
    {
      this.Value(value);
    }

    this.AddClass("pending");

    // Head.Get().Add(
    //   style(),
    // );
  }

  Spinner()
  {
    return new Div("spinner")
    .AnimationDuration("1.5s")
    .AnimationPlayState("inherit")
    .Border("solid 7.5px #cfd0d1")
    .BorderBottomColor("#1c87c9")
    .BorderRadius("50%")
    .MinWidth("40px")
    .MinHeight("40px")
    .PositionAbsolute()
    .Top("50%")
    .Left("50%")
    .Transform(["rotate(0deg)", "rotate(360deg)"])
    // .TransformTranslate3D("-50%", "-50%", "0")
    // .TransformRotate(["0deg", "360deg"])
    // .Rotate(["0deg", "360deg"])
    // .Translate3D("-50%, -50%, 0", "-50%, -50%, 0")
    .Play(Infinity)
    // .Rotate({ from: "0deg", to: "360deg", })
    // .TransformRotate("0deg")
    // .TransformRotate("360deg")
    ;
  }

  Spinner()
  {
    return new Div("spinner")
    .AnimationDuration("1500ms")
    .AnimationIterationCount("infinite")
    .Border("solid 7.5px #cfd0d1")
    .BorderBottomColor("#1c87c9")
    .BorderRadius("50%")
    .MinWidth("40px")
    .MinHeight("40px")
    .PositionAbsolute()
    .Top("50%")
    .Left("50%")
    .Transform(["rotate(0deg)", "rotate(360deg)"])
    .Animate();
  }

  [Redraw](event)
  {
    const spinner = this.Query(".spinner");
    if (spinner)
    {
      // console.log("Promise Redraw");

      const rect = this.GetBoundingClientRect();
      const size = Math.min(rect.width, rect.height) / 2;

      if (0 >= size)
      {
        // console.log("Setting DisplayNone");
        // spinner.DisplayNone();
      }
      else
      {
        const px = `${size}px`;
        console.log("Setting size", size);
        // spinner.RemoveStyle("display").Width(px).Height(px);
        spinner.Display().Width(px).Height(px);
      }
    }
  }

  [Connect](event)
  {
    if (this.IsDisabled()) return; // Don't auto invoke

    const value = this.GetValue();

    if (!(value instanceof GlobalPromise))
    {
      const error = new Error(`Promise Tag expected its value to be a Promise object`);
      return this.Throw(error);
    }

    value.then(this.OnResolve.bind(this)).catch(this.OnReject.bind(this));
  }

  [ViewEnter](event)
  {
    if (this.rendered !== true && (!this.HasClass("resolved") && !this.HasClass("rejected")))
    {
      this.rendered = true;
      this
      .MinHeight("100%")
      .PositionRelative()
      .Add(
        this.Spinner(),
      );
    }
  }

  OnResolve(result)
  {
    this.RemoveClass("pending");
    this.AddClass("resolved");
    this.Clear().Add(result);
  }

  OnReject(error)
  {
    this.RemoveClass("pending");
    this.AddClass("rejected");
    this.Throw(error);
  }

  Deconvert(){ return this.GetValue(); }

  then(resolve, reject)
  {
    const value = this.GetValue() ?? Promise.resolve();
    const promise = value.then(resolve);

    if (!reject) return promise;
    else return promise.catch(reject);
  }

  catch(handler)
  {
    const value = this.GetValue() ?? Promise.resolve();
    return value.catch(handler);
  }

  finally(handler)
  {
    const value = this.GetValue() ?? Promise.resolve();
    return value.finally(handler);
  }
}

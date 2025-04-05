import {Environment} from "/js/Utility/Environment.js";
import {URL} from "/js/Utility/Extensions/URL.js";

// const state = {
//   url: new URL(window.location.href, window.location.origin),
// };
//
// // Tell the browser to remember the initial state
// window.history.replaceState(state, "", state.url);

export class History extends window.History
{
  static GetStateObject(){ return state; }
  static GetURL(){ return this.GetStateObject().url; }
  static SetURL(url){ this.GetStateObject().url ??= url; return this; }
  static GetHistoryLength(){ return window.history.length; }

  static Back(){ window.history.back(); return this; }
  static Forward(){ window.history.forward(); return this; }
  static Go(i){ window.history.go(i); return this; }

  static SetScrollRestoration(value){ window.history.scrollRestoration = value; return this; }
  static SetScrollRestorationManual(){ return this.SetScrollRestoration("manual"); }
  static SetScrollRestorationAuto(){ return this.SetScrollRestoration("auto"); }

  static GetScrollRestoration(){ return window.history.scrollRestoration; }
  static IsScrollRestorationManual(){ return this.GetScrollRestoration() === "manual"; }
  static IsScrollRestorationAuto(){ return this.GetScrollRestoration() === "auto"; }

  static Update(url, force = false)
  {
    if (!(url instanceof window.URL))
    {
      throw new Error(`Expected first parameter to be an instance of window.URL.`);
    }

    const original = this.GetURL();

    // Only push a new state if forced OR the url actually changed
    if ((force === true) || (original.href !== updated.href))
    {
      this.SetURL(url);
      return true;
    }
    else
    {
      return false;
    }
  }

  static Push(url, force)
  {
    if (this.Update(url, force))
    {
      window.history.pushState(this.GetStateObject(), "", url);
      return true;
    }
    else
    {
      return false;
    }
  }

  static Pop(url, force)
  {
    if (this.Update(url, force))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  static Replace(url, force)
  {
    if (this.Update(url, force))
    {
      window.history.replaceState(this.GetStateObject(), "", url);
      return true;
    }
    else
    {
      return false;
    }
  }
}

import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Environment} from "/js/Utility/Environment.js";

export class History extends Singleton
{
  constructor(...args)
  {
    super(...args);

    this.state = {
      url: window.location.href,
    };

    this.Src(this.state.url);

    if (Environment.IsClient())
    {
      // When back and forward browser buttons or history.go() is called
      window.addEventListener("popstate", this.OnPopState.bind(this), false);

      // Tell the browser to remember the initial state
      window.history.replaceState(this.state, "", this.state.url);
    }
  }

  OnPopState(event)
  {
    // console.log("PopState!");
    event.preventDefault();

    if (event.state)
    {
      // console.log("Swapping state", this.state.url, "for", event.state.url);
      this.state = event.state;
      this.Src(event.state.url);

      const url = Tag.Body().Query("url");
      if (url)
      {
        url.Go(this.GetAttribute("src"));
      }

      // Tag.Url().HRef(this.GetAttribute("src")).Go();
    }
  }

  Back(){ window.history.back(); return this; }
  Forward(){ window.history.forward(); return this; }
  Go(i){ window.history.go(i); return this; }

  SetScrollRestoration(value){ window.history.scrollRestoration = value; return this; }
  SetScrollRestorationManual(){ return this.SetScrollRestoration("manual"); }
  SetScrollRestorationAuto(){ return this.SetScrollRestoration("auto"); }
  GetScrollRestoration(){ return window.history.scrollRestoration; }
  IsScrollRestorationManual(){ return this.GetScrollRestoration() === "manual"; }
  IsScrollRestorationAuto(){ return this.GetScrollRestoration() === "auto"; }

  GetHistoryLength(){ return window.history.length; }

  Push(url, force = false)
  {
    const original = this.GetAttribute("src");
    this.Src(url);
    const updated = this.GetAttribute("src");

    // Only push a new state if forced OR the url actually changed
    if ((force === true) || (original !== updated))
    {
      // console.log("Pushing new history state", updated);
      this.state.url = updated;
      window.history.pushState(this.state, "", updated);
    }
  }

  Replace(url, force = false)
  {
    const original = this.GetAttribute("src");
    this.Src(url);
    const updated = this.GetAttribute("src");

    // Only replace the state if forced OR the url actually changed
    if ((force === true) || (original !== updated))
    {
      // console.log("Replacing history state", updated);
      this.state.url = updated;
      window.history.replaceState(this.state, "", updated);
    }
  }
}

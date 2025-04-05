import {window} from "/js/Window.js";
import {Observer} from "/js/Observer.js";
import {Object as ObjectHelper} from "/js/Object.js";

export class HistoryObserver extends Observer
{
  CreateHistory(){ return window.history; }
  CreateCurrent(){ return new URL(window.location.href, window.location.origin); }
  CreateOnPopStateHandler(){ return this.OnPopState.bind(this); }
  CreateOnHashChangeHandler(){ return this.OnHashChange.bind(this); }
  CreateOnScrollHandler(){ return this.OnScroll.bind(this); }
  CreateState()
  {
    return {
      url: this.current.href,
    };
  }

  constructor(tag)
  {
    super(tag);

    this.history = this.CreateHistory();
    this.current = this.CreateCurrent();
    this.on_pop_state_handler = this.CreateOnPopStateHandler();
    this.on_hash_change_handler = this.CreateOnHashChangeHandler();
    this.on_scroll_handler = this.CreateOnScrollHandler();
    this.state = this.CreateState();

    // Tell the browser to remember the initial state
    this.history.replaceState(this.state, "", this.state.url);

    // Fires when back and forward browser back/forward buttons are pressed or history.go() is called
    window.addEventListener("popstate", this.on_pop_state_handler, false);
    window.addEventListener("hashchange", this.on_hash_change_handler, false);
    window.addEventListener("scroll", this.on_scroll_handler.bind(this));
  }

  destructor(...args)
  {
    window.removeEventListener("popstate", this.on_pop_state_handler);
    window.removeEventListener("hashchange", this.on_hash_change_handler);
    window.removeEventListener("scroll", this.on_scroll_handler);

    delete this.history;
    delete this.current;
    delete this.on_pop_state_handler;
    delete this.on_hash_change_handler;
    delete this.on_scroll_handler;
    delete this.state;

    return super.destructor(...args);
  }

  OnPopState(event)
  {
    event.preventDefault();

    if (!event.state) return;

    // console.log("Swapping state", this.state.url, "for", event.state.url);
    // console.log("Loading state", JSON.stringify(event.state));

    this.state = event.state;

    const url = new URL(event.state.url, window.location.origin);

    if (this.Pop(url))
    {
      // Find the first URL tag
      const old_url = this.GetTag().Query("url");

      if (old_url)
      {
        // Create a new dynamic URL to replace the existing ones
        const new_url = new old_url.constructor(url).Dynamic(true);

        // Swap out each old dynamic URL tag with the new version
        old_url.ReplaceWith(new_url);
      }
    }
  }

  OnHashChange(event)
  {
  }

  OnScroll(event)
  {
    // this.has_scrolled = true;
    const x = window.scrollX;
    const y = window.scrollY;

    // this.Write("scroll_x", x);
    // this.Write("scroll_y", y);

    // console.log("HistoryObserver OnScroll", x, y, this.state);
  }

  Write(...keys){ return ObjectHelper.Write(this.state, ...keys); }
  Read(...keys){ return ObjectHelper.Read(this.state, ...keys); }

  Update(url, force = false)
  {
    if (!(url instanceof URL))
    {
      throw new Error(`Expected first parameter to be an instance of URL.`);
    }

    const current = this.GetCurrent();

    // Only update if forced OR the url actually changed
    if ((force === true) || (current.href !== url.href))
    {
      // console.log("Updating history from", current.pathname, "to", url.pathname);

      // this.SetSessionURL(url.href);

      this.current = url;
      this.GetState().url = url.href;
      return true;
    }
    else
    {
      if (this.IsScrollRestorationManual())
      {
        // Promise.resolve(this.RestoreScroll(url))
        // .catch(error => this.GetTag().Throw(error));
      }

      return false;
    }
  }

  Push(url, force)
  {
    if (this.Update(url, force))
    {
      this.history.pushState(this.GetState(), this.GetTitle(), url.href);
      return true;
    }
    else
    {
      return false;
    }
  }

  Pop(url, force)
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

  Replace(url, force)
  {
    if (this.Update(url, force))
    {
      this.history.replaceState(this.GetState(), this.GetTitle(), url);
      return true;
    }
    else
    {
      return false;
    }
  }

  SetScrollRestoration(value){ this.history.scrollRestoration = value; return this; }
  SetScrollRestorationManual(){ return this.SetScrollRestoration("manual"); }
  SetScrollRestorationAuto(){ return this.SetScrollRestoration("auto"); }
  SetScrollRestorationDefault(){ return this.SetScrollRestorationManual(); }

  GetScrollRestoration(){ return this.history.scrollRestoration; }
  IsScrollRestorationManual(){ return this.GetScrollRestoration() === "manual"; }
  IsScrollRestorationAuto(){ return this.GetScrollRestoration() === "auto"; }

  GetState(){ return this.state; }
  GetCurrent(){ return this.current; }
  SetCurrent(url){ this.current = url; return this; }
  GetHistoryLength(){ return this.history.length; }
  GetTitle(){ return ""; } // Title parameter is currently unused by most/all browsers

  Back(){ this.history.back(); return this; }
  Forward(){ this.history.forward(); return this; }
  Go(i){ this.history.go(i); return this; }
}

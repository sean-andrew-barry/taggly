import {Observer} from "/js/Observer.js";
import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {FullViewEnter} from "/js/Event/FullViewEnter.js";
import {FullViewLeave} from "/js/Event/FullViewLeave.js";
import {ViewEnter} from "/js/Event/ViewEnter.js";
import {ViewLeave} from "/js/Event/ViewLeave.js";
import {window} from "/js/Window.js";

const PARTIALLY_VISIBLE = new WeakSet();
const FULLY_VISIBLE = new WeakSet();

// JSDOM does not provide an IntersectionObserver (which makes sense, since it doesn't do layout)
// So this is just a pseudo definition so it can still be constructed on the server side
const WindowIntersectionObserver = (window.IntersectionObserver ?? class IntersectionObserver
{
  disconnect(){}
  observe(){}
  unobserve(){}
  takeRecords(){}
});

export class IntersectionObserver extends Observer
{
  static GetPartiallyVisibleWeakSet(){ return PARTIALLY_VISIBLE; }
  static GetFullyVisibleWeakSet(){ return FULLY_VISIBLE; }

  GetObserverClass(){ return WindowIntersectionObserver; }
  GetRootMargin(){ return undefined; }
  GetThreshold(){ return [0, 1]; }
  GetOptions()
  {
    return {
      rootMargin: this.GetRootMargin(),
      threshold: this.GetThreshold(),
    };
  }

  constructor(tag)
  {
    super(tag);

    const options = this.GetOptions();

    // TODO: I may want to create a fallback to an iterative design if
    // IntersectionObserver is not supported
    const observer_class = this.GetObserverClass();
    this.observer = new observer_class((entries, observer) =>
    {
      // console.log(entries);
      this.OnObserver(entries, observer);
    }, options);
  }

  destructor()
  {
    this.observer.disconnect();
    delete this.observer;
  }

  Observe(tag)
  {
    this.observer?.observe(tag.GetNode());
  }

  Unobserve(tag)
  {
    // console.log("Unobserving", tag.GetNode());
    PARTIALLY_VISIBLE.delete(tag);
    FULLY_VISIBLE.delete(tag);
    REDRAWN.delete(tag);
    this.observer?.unobserve(tag.GetNode());
  }

  OnFullViewEnter(tag, entry)
  {
    // console.log("OnFullViewEnter", tag.GetNode());
    new FullViewEnter(tag);
  }

  OnFullViewLeave(tag, entry)
  {
    // console.log("OnFullViewLeave", tag.GetNode());
    new FullViewLeave(tag);
  }

  OnViewEnter(tag, entry)
  {
    // console.log("OnViewEnter", tag.GetLocalName());
    new ViewEnter(tag);

    // const rect = entry.boundingClientRect;
    //
    // const abs = tag.GetAbsoluteBoundingClientRect(rect);
    // const hash = String.fromCharCode(abs.x, abs.y, abs.width, abs.height);
    // // const hash = tag.GetRectHash(abs);
    //
    // if (REDRAWN.has(tag))
    // {
    //   const old_hash = REDRAWN.get(tag);
    //
    //   if (old_hash !== hash)
    //   {
    //     REDRAWN.set(tag, hash); // Update
    //     this.OnRedraw(tag, entry);
    //   }
    // }
    // else
    // {
    //   REDRAWN.set(tag, hash);
    //   this.OnRender(tag, entry);
    // }
  }

  OnViewLeave(tag, entry)
  {
    // console.log("OnViewLeave", tag.GetNode());
    new ViewLeave(tag);
  }

  OnRedraw(tag, entry)
  {
    // console.log("OnRedraw", tag.GetNode());
    new Redraw(tag);
  }

  OnRender(tag, entry)
  {
    // console.log("OnRender", tag.GetNode());
    new Render(tag);
  }

  GetWindowWidth(){ return Math.max(window.document.documentElement.clientWidth, window.innerWidth); }
  GetWindowHeight(){ return Math.max(window.document.documentElement.clientHeight, window.innerHeight); }

  GetRectHash(tag, rect)
  {
    const abs = tag.GetAbsoluteBoundingClientRect(rect);
    return String.fromCharCode(abs.x, abs.y, abs.width, abs.height);
  }

  // TODO: Probably depreciate this, but I'm not certain yet
  TestRedraw(tag, entry)
  {
    if (!RENDERED.has(tag))
    {
      RENDERED.add(tag);
      this.OnRender(tag, entry);
    }

    const rect = entry.boundingClientRect;

    // const abs = tag.GetAbsoluteBoundingClientRect(rect);
    // const hash = String.fromCharCode(abs.x, abs.y, abs.width, abs.height);
    const hash = this.GetRectHash(tag, rect);

    if (REDRAWN.has(tag))
    {
      const old_hash = REDRAWN.get(tag);

      // console.log("Redraw?", hash, old_hash, tag.GetNode());

      if (old_hash !== hash)
      {
        REDRAWN.set(tag, hash); // Update
        this.OnRedraw(tag, entry);
      }
    }
    else
    {
      REDRAWN.set(tag, hash);
      this.OnRedraw(tag, entry);
    }
  }

  OnObserver(entries, observer)
  {
    const window_width = this.GetWindowWidth();
    const window_height = this.GetWindowHeight();

    for (let i = 0; i < entries.length; i++)
    {
      const entry = entries[i];

      const tag = Tag.For(entry.target);
      if (!tag) continue;

      const rect = entry.boundingClientRect;

      // console.log("Intersection", tag.GetNode());

      // // If it doesn't actually have a size, skip it
      // if (rect.width === 0 || rect.height === 0)
      // {
      //   // console.log("Skipping", tag.GetNode());
      //   continue;
      // }

      const width = window_width;
      const height = window_height;

      // this.TestRedraw(tag, entry);

      if (tag.IsFullyOnScreen(rect, width, height))
      {
        // if (entry.intersectionRatio !== 1)
        // {
        //   console.log("IsFullyOnScreen but ratio is", entry.intersectionRatio, entry.target);
        // }

        if (!FULLY_VISIBLE.has(tag))
        {
          FULLY_VISIBLE.add(tag);
          this.OnFullViewEnter(tag, entry);
        }

        // If it's fully visible then it is also partially visible
        if (!PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.add(tag);
          this.OnViewEnter(tag, entry);
        }
      }
      else
      {
        // Not fully in view
        if (FULLY_VISIBLE.has(tag))
        {
          // So remove it if it was previously fully in view
          FULLY_VISIBLE.delete(tag);
          this.OnFullViewLeave(tag, entry);
        }

        if (tag.IsFullyOffScreen(rect, width, height))
        {
          // If it's fully off screen, it can't be partially in view
          if (PARTIALLY_VISIBLE.has(tag))
          {
            PARTIALLY_VISIBLE.delete(tag);
            this.OnViewLeave(tag, entry);
          }
        }
        else
        {
          // It isn't fully on or fully off screen, so it must be partially on screen
          if (!PARTIALLY_VISIBLE.has(tag))
          {
            PARTIALLY_VISIBLE.add(tag);
            // this.OnViewLeave(tag, entry); // We trigger leave here since it's partially leaving
            this.OnViewEnter(tag, entry);
          }
        }
      }
    }
  }
}

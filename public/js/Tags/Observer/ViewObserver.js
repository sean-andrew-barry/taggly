import {Tag} from "/js/Tag.js";
import {Observer} from "/js/Tags/Observer.js";

const PARTIALLY_VISIBLE = new WeakSet();
const FULLY_VISIBLE = new WeakSet();

export class ViewObserver extends Observer
{
  static GetPartiallyVisibleWeakSet(){ return PARTIALLY_VISIBLE; }
  static GetFullyVisibleWeakSet(){ return FULLY_VISIBLE; }

  constructor(root = window)
  {
    super();
    this.root = root;

    this.root.addEventListener("scroll", this.OnScrollHandler.bind(this), { passive: true });
    this.root.addEventListener("resize", this.OnScrollHandler.bind(this), { passive: true });
    this.root.addEventListener("OnMutation", this.OnMutationHandler.bind(this), { passive: true });
  }

  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }

  UpdateView(tag, width, height)
  {
    const rect = tag.GetBoundingClientRect();

    const visible = tag.IsVisible();

    // Test if it's fully on the screen
    if (tag.IsFullyOnScreen(rect, width, height))
    {
      // console.log("Is fully ON screen", rect, tag.GetNode());

      if (visible)
      {
        if (!FULLY_VISIBLE.has(tag))
        {
          FULLY_VISIBLE.add(tag);
          // console.log("Full view enter", tag);
          tag.FireEvent("OnFullViewEnter");
        }

        // If it's fully visible then it is also partially visible
        if (!PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.add(tag);
          tag.FireEvent("OnViewEnter");
        }
      }
    }
    else
    {
      // No longer fully in view
      if (FULLY_VISIBLE.has(tag))
      {
        FULLY_VISIBLE.delete(tag);
        tag.FireEvent("OnFullViewLeave");
      }

      // Test if it's fully off the screen
      if (tag.IsFullyOffScreen(rect, width, height))
      {
        // If it's fully off screen, it isn't partially in view
        if (PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.delete(tag);
          tag.FireEvent("OnViewLeave");
        }
      }
      else
      {
        // It isn't fully on or fully off screen, so it must be partially on screen
        if (visible && !PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.add(tag);
          tag.FireEvent("OnViewEnter");
        }
      }
    }

    const count = tag.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = tag.GetChild(i);
      if (child && child.IsElement()) this.UpdateView(child, width, height);
    }
  }

  OnScrollHandler(event)
  {
    this.UpdateView(Tag.Body(), this.GetWindowWidth(), this.GetWindowHeight());
  }

  OnResizeHandler(event)
  {
    this.UpdateView(Tag.Body(), this.GetWindowWidth(), this.GetWindowHeight());
  }

  OnMutationHandler(event)
  {
    this.UpdateView(Tag.Body(), this.GetWindowWidth(), this.GetWindowHeight());
  }
}

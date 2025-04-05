import {Observer} from "/js/Observer.js";
import {window} from "/js/Window.js";

import {Resize} from "/js/Event/Resize.js";
import {Redraw} from "/js/Event/Redraw.js";
import {FullViewEnter} from "/js/Event/FullViewEnter.js";
import {FullViewLeave} from "/js/Event/FullViewLeave.js";
import {ViewEnter} from "/js/Event/ViewEnter.js";
import {ViewLeave} from "/js/Event/ViewLeave.js";

const PARTIALLY_VISIBLE = new WeakSet();
const FULLY_VISIBLE = new WeakSet();
const HASHES = new WeakMap();
const REDRAWN = new WeakMap();

export class ViewObserver extends Observer
{
  static GetPartiallyVisibleWeakSet(){ return PARTIALLY_VISIBLE; }
  static GetFullyVisibleWeakSet(){ return FULLY_VISIBLE; }
  static GetRedrawnWeakSet(){ return REDRAWN; }

  constructor(tag, options = {
    attributes: true,
    childList: true,
    subtree: true, // Omit or set to false to observe only changes to the parent node
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
  })
  {
    super(tag);

    const node = tag.GetNode();

    // ViewObserver should only kick in if there is no IntersectionObserver
    if (window.IntersectionObserver === undefined)
    {
      node.addEventListener("scroll", this.OnScroll.bind(this), { passive: true });
      node.addEventListener("resize", this.OnResize.bind(this), { passive: true });

      this.observer = new window.MutationObserver((mutations, observer) =>
      {
        this.OnMutation(mutations, observer);

        // It's possible for running the mutations to generate new mutations with the same added/removed sets
        const records = observer.takeRecords();
        if (records.length > 0)
        {
          this.OnMutation(records, observer);
        }
      });

      this.observer.observe(node, options);

      this.on_scroll_time = 0;
      this.on_resize_time = 0;
      this.on_mutation_time = 0;

      this.last_x = window.scrollX;
      this.last_y = window.scrollY;
    }
  }

  destructor()
  {
    this.observer.disconnect();
    delete this.observer;
  }

  GetBody(){ return this.GetTag().GetBody(); }
  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }

  Update(tag = this.GetBody(), width = this.GetWindowWidth(), height = this.GetWindowHeight())
  {
    if (!tag)
    {
      throw new Error(`No Tag was provided to ViewObserver.Update`);
    }

    const rect = tag.GetBoundingClientRect();
    const hash = String.fromCharCode(rect.x, rect.y, rect.width, rect.height);

    if (HASHES.has(tag))
    {
      if (HASHES.get(tag) === hash)
      {
        // console.log("ViewObserver skipping", tag);
        return;
      }
    }
    else
    {
      HASHES.set(tag, hash);
    }

    const visible = tag.IsVisible();

    if (visible)
    {
      const abs = tag.GetAbsoluteBoundingClientRect();
      const hash = String.fromCharCode(abs.x, abs.y, abs.width, abs.height);

      if (REDRAWN.has(tag))
      {
        const old_hash = REDRAWN.get(tag);

        if (old_hash !== hash)
        {
          REDRAWN.set(tag, hash); // Update
          new Redraw(tag);
        }
      }
      else
      {
        REDRAWN.set(tag, hash);
        // TODO: Possibly a Draw event here for the first time?
      }
    }

    // Test if it's fully on the screen
    if (tag.IsFullyOnScreen(rect, width, height))
    {
      // console.log("Is fully ON screen", rect, tag.GetNode());

      if (visible)
      {
        if (!FULLY_VISIBLE.has(tag))
        {
          FULLY_VISIBLE.add(tag);
          new FullViewEnter(tag);
        }

        // If it's fully visible then it is also partially visible
        if (!PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.add(tag);
          new ViewEnter(tag);
        }
      }
    }
    else
    {
      // No longer fully in view
      if (FULLY_VISIBLE.has(tag))
      {
        FULLY_VISIBLE.delete(tag);
        new FullViewLeave(tag);
      }

      // Test if it's fully off the screen
      if (tag.IsFullyOffScreen(rect, width, height))
      {
        // If it's fully off screen, it isn't partially in view
        if (PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.delete(tag);
          new ViewLeave(tag);
        }
      }
      else
      {
        // It isn't fully on or fully off screen, so it must be partially on screen
        if (visible && !PARTIALLY_VISIBLE.has(tag))
        {
          PARTIALLY_VISIBLE.add(tag);
          new ViewEnter(tag);
        }
      }
    }

    const count = tag.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = tag.GetChild(i);
      if (child && child.IsElement()) this.Update(child, width, height);
    }
  }

  OnScroll(event)
  {
    if (this.last_x === window.scrollX && this.last_y === window.scrollY)
    {
      console.log("ViewObserver skipping OnScroll");
    }
    else
    {
      this.last_x = window.scrollX;
      this.last_y = window.scrollY;
    }

    const start = performance.now();
    this.Update();
    const end = performance.now();
    this.on_scroll_time += end - start;
  }

  OnResize(event)
  {
    const start = performance.now();
    this.Update();
    const end = performance.now();
    this.on_resize_time += end - start;
  }

  OnMutation(mutations, observer)
  {
    const start = performance.now();

    for (let i = 0; i < mutations.length; i++)
    {
      const {target} = mutations[i];
      if (target && target.tag)
      {
        this.Update(target.tag);
      }
    }
    // this.Update();

    const end = performance.now();
    this.on_mutation_time += end - start;
  }
}

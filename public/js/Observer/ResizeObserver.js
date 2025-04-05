import {Observer} from "/js/Observer.js";
import {Tag} from "/js/Tag.js";
import {Resize} from "/js/Event/Resize.js";
import {window} from "/js/Window.js";

// JSDOM does not provide a ResizeObserver (which makes sense, since it doesn't do layout)
// So this is just a pseudo definition so it can still be constructed on the server side
const WindowResizeObserver = (window.ResizeObserver ?? class ResizeObserver
{
  disconnect(){}
  observe(){}
  unobserve(){}
  takeRecords(){}
});

export class ResizeObserver extends Observer
{
  GetObserverClass(){ return WindowResizeObserver; }
  
  GetOptions()
  {
    return {};
  }

  constructor(tag)
  {
    super(tag);

    this.positions = new WeakMap();
    this.sizes = new WeakMap();

    const options = this.GetOptions();
    const observer_class = this.GetObserverClass();

    this.observer = new observer_class((entries, observer) =>
    {
      const resized = new WeakSet();
      const moved = new WeakSet();
      // console.log(entries);
      this.OnObserver(entries, observer, resized, moved);
    }, options);
  }

  Observe(tag)
  {
    this.observer?.observe(tag.GetNode());
  }

  Unobserve(tag)
  {
    this.observer?.unobserve(tag.GetNode());
  }

  GetRectHash(tag, rect)
  {
    const abs = tag.GetAbsoluteBoundingClientRect(rect);
    return String.fromCharCode(abs.x, abs.y, abs.width, abs.height);
  }

  HashCode(x, y)
  {
    const temp = y + ((x + 1) / 2);
    return x + (temp * temp);
  }

  HashRect(rect)
  {
    return this.HashCode(
      this.HashCode(rect.x, rect.y),
      this.HashCode(rect.width, rect.height),
    );
  }

  OnRedraw(tag, entry, redrawn)
  {
    if (redrawn.has(tag)) return;
    else redrawn.add(tag);

    const rect = tag.GetBoundingClientRect();

    const position = this.HashCode(rect.x, rect.y);
    const old_position = this.positions.get(tag) ?? 0;

    const size = this.HashCode(rect.width, rect.height);
    const old_size = this.sizes.get(tag) ?? 0;

    if (position !== old_position)
    {
      console.log("Moved", tag.GetNode());
      this.positions.set(tag, size);
    }

    if (size !== old_size)
    {
      console.log("Sized", tag.GetNode());
      this.sizes.set(tag, size);
    }

    const children = tag.GetChildNodes();
    if (children && children.length > 0)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = Tag.For(children[i]);
        if (child) this.OnRedraw(child, entry, redrawn);
      }
    }
  }

  CheckChildren(tag, entry, resized)
  {
    const rect = tag.GetBoundingClientRect();

    const position = this.HashCode(rect.x, rect.y);
    const old_position = this.positions.get(tag) ?? 0;

    if (position !== old_position)
    {
      // console.log("Moved", tag.GetNode());
      this.positions.set(tag, position);

      new Resize(tag, undefined, entry);
    }

    const children = tag.GetChildNodes();
    if (children && children.length > 0)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = Tag.For(children[i]);
        if (child)
        {
          this.OnResize(child, entry, resized);
        }
      }
    }
  }

  OnResize(tag, entry, resized)
  {
    if (resized.has(tag)) return;
    else resized.add(tag);

    if (!tag.IsElement()) return;

    if (entry.target !== tag.GetNode())
    {
      const rect = tag.GetBoundingClientRect();

      const position = this.HashCode(rect.x, rect.y);
      const old_position = this.positions.get(tag) ?? 0;

      if (position !== old_position)
      {
        // console.log("Moved", tag.GetNode());
        this.positions.set(tag, position);

        new Resize(tag, undefined, entry);
      }
    }
    else
    {
      // console.log("Resize", tag.GetNode());
      new Resize(tag, undefined, entry);
    }

    const children = tag.GetChildNodes();
    if (children && children.length > 0)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = Tag.For(children[i]);
        if (child)
        {
          this.OnResize(child, entry, resized);
        }
      }
    }
  }

  _OnResize(tag, entry, resized)
  {
    if (resized.has(tag)) return;
    else resized.add(tag);

    const rect = entry.contentRect;

    const position = this.HashCode(rect.x, rect.y);
    this.positions.set(tag, position);

    new Resize(tag, undefined, entry);

    // this.CheckChildren();
  }

  OnObserver(entries, observer, resized, moved)
  {
    for (let i = 0; i < entries.length; i++)
    {
      const entry = entries[i];
      const tag = Tag.For(entry.target);

      if (tag)
      {
        this.OnResize(tag, entry, resized);
        // this.OnMoved(tag, entry, resized);
      }
    }

    // for (let i = 0; i < entries.length; i++)
    // {
    //   const entry = entries[i];
    //   const tag = Tag.For(entry.target);
    //
    //   if (tag)
    //   {
    //     this.OnMoved(tag, entry, resized);
    //   }
    // }
  }
}

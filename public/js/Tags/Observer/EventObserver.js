import {Tag} from "/js/Tag.js";
import {Observer} from "/js/Tags/Observer.js";

export class EventObserver extends Observer
{
  constructor(root = window.document.documentElement)
  {
    super();

    this.root = root;
    this.handlers = {};

    const keys = Object.keys(Events);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const ctor = Events[key];
      const name = ctor.GetName();

      this.Listen(name, ctor, undefined);
    }
  }

  FireSymbol(wrapper, tag, symbol, event)
  {
    const fn = tag[symbol];
    if (typeof(fn) === "function")
    {
      Promise.resolve(fn.call(tag, event))
      .then(result => wrapper.Resolve(result))
      .catch(error => wrapper.Reject(error));
    }

    if (event.bubbles === true)
    {
      const parent = tag.GetParent();
      if (parent) return this.FireSymbol(wrapper, parent, symbol, event);
    }
  }

  Listen(name, ctor = Event, handler)
  {
    if (this.handlers.hasOwnProperty(ctor.name)) return;

    const symbol = SymbolUtilities.GetSymbol(ctor);

    this.root.addEventListener(name, this.handlers[ctor.name] = handler || ((event) =>
    {
      if (ctor.IsKey() && ctor.GetKey() !== event.keyCode)
      {
        return;
      }

      const wrapper = new ctor(event);
      this.FireSymbol(wrapper, event.tag, symbol, event);
    }), { capture: true }); // NOTE: Is passive valid?

    return this;
  }
}

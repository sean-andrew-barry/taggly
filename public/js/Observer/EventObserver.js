import {window} from "/js/Window.js";
import {Observer} from "/js/Observer.js";
import * as Events from "/js/Events.js";

export class EventObserver extends Observer
{
  GetEvents(){ return Events; }

  constructor(tag)
  {
    super(tag);

    const node = tag.GetNode();
    const events = this.GetEvents();

    const keys = Object.keys(events);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const ctor = events[key];

      ctor.Capture(node);
    }
  }
}

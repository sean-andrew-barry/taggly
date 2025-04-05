import {Observer} from "/js/Observer.js";
import {Environment} from "/js/Environment.js";

export class PerformanceObserver extends Observer
{
  #observer;

  GetObserverClass(){ return globalThis.PerformanceObserver; }

  GetEntryTypes()
  {
    if (Environment.IsClient())
    {
      return [
        "mark",
        "measure",
        "element",
        "navigation",
        "resource",
        "paint",
        "longtask",
      ];
    }
    else
    {
      return [
        "mark",
        "measure",
      ];
    }
  }

  GetBuffered(){ return false; }

  GetOptions()
  {
    return {
      entryTypes: this.GetEntryTypes(),
      buffered: this.GetBuffered(),
    };
  }

  constructor(tag)
  {
    super(tag);

    const observer_class = this.GetObserverClass();
    const options = this.GetOptions();

    this.#observer = new observer_class((list, observer) =>
    {
      this.OnPerformance(list.getEntries(), observer);
    });

    this.#observer.observe(options);

    // performance.mark("registered-observer");
  }

  destructor()
  {
    this.#observer.disconnect();
    return super.destructor();
  }

  OnMark(entry){}
  OnMeasure(entry){}

  // Browser only
  OnElement(entry){}
  OnNavigation(entry){}
  OnResource(entry){}
  OnPaint(entry){}
  OnLongTask(entry){}

  OnUnknown(entry)
  {
    throw new Error(`Unknown performance entry type "${entry.entryType}"`);
  }

  OnEntry(entry)
  {
    switch (entry.entryType)
    {
      case "mark": return this.OnMark(entry);
      case "measure": return this.OnMeasure(entry);
      case "node": return this.OnNode(entry);
      case "gc": return this.OnGC(entry);
      case "function": return this.OnFunction(entry);
      case "http2": return this.OnHTTP2(entry);
      case "http": return this.OnHttp(entry);
      case "element": return this.OnElement(entry);
      case "navigation": return this.OnNavigation(entry);
      case "resource": return this.OnResource(entry);
      case "paint": return this.OnPaint(entry);
      case "longtask": return this.OnLongTask(entry);
      default: this.OnUnknown(entry);
    }
  }

  OnPerformance(entries, observer)
  {
    for (let i = 0; i < entries.length; i++)
    {
      const entry = entries[i];

      this.OnEntry(entry);

      // if (entry.entryType !== "gc")
      // {
      //   console.log("NonGC", entry);
      // }
    }
  }
}

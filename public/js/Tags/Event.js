import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";

// const WRAPPER = Symbol("wrapper");
const HANDLER = Symbol("handler");
const OPTIONS = Symbol("options");
const WRAPPER = Tag.GetEventSymbol();
// const EVENTS = new WeakMap();

Environment.DepreciateFile(import.meta.url, "/js/Event.js");

// EventObserver constructs the correct Event tag for each event it sees
export class Event extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "event"; }

  static GetWrapperSymbol(){ return WRAPPER; }
  static IsKey(){ return false; }

  static OnCapture(node, event)
  {
    const tag = event.target?.tag ?? event?.fromElement?.tag ?? node?.tag;
    // const tag = event?.fromElement?.tag ?? event.target?.tag ?? node?.tag;
    if (tag)
    {
      const wrapper = new this(tag, event);
    }
    else
    {
      console.warn("No tag found for event", event);
    }
  }

  static Capture(node)
  {
    const name = this.GetLocalName();

    // NOTE: Is passive valid?
    node.addEventListener(name, this.OnCapture.bind(this, node), { capture: true });
    return this;
  }

  // constructor(event)
  // {
  //   super();
  //
  //   if (event === undefined) event = new window.Event(this.constructor.GetName());
  //   if (event.hasOwnProperty(WRAPPER)) return event[WRAPPER];
  //
  //   this.name = event.type;
  //   this.event = event;
  //   this.promise = new Promise((resolve, reject) =>
  //   {
  //     this.resolve = resolve;
  //     this.reject = reject;
  //   });
  //
  //   if (event.target)
  //   {
  //     event.tag = event.target.tag;
  //   }
  //   event[WRAPPER] = this;
  //   // event[NODE] = this;
  //
  //   this.promise.catch(error =>
  //   {
  //     event.tag.Error(error);
  //   });
  // }

  constructor(tag, event)
  {
    super();
    // event ??= new window.Event(this.constructor.GetLocalName())

    if (event)
    {
      this.event = event;
    }

    if (tag)
    {
      this.Fire(tag);
    }
    else
    {
      tag = this.GetTarget();

      if (tag)
      {
        this.Fire(tag);
      }
    }
  }

  Fire(tag, symbol = this.constructor.GetSymbol())
  {
    if (this.Stopped() === true) return;

    const fn = tag[symbol];
    if (typeof(fn) === "function")
    {
      try
      {
        const result = fn.call(tag, this);
        if (result instanceof window.Promise)
        {
          result.catch(error =>
          {
            console.error("Event promise error:", error);

            tag.Add(
              new Error(error),
            );
          })
        }
      }
      catch (error)
      {
        console.error("Event error:", error);

        tag.Add(
          new Error(error),
        );
      }

      if (this.Stopped() === true) return;
    }

    if (this.Bubbles() === true)
    {
      const parent = tag.GetParent();
      if (parent) return this.Fire(parent);
    }

    if (this.Sinks() === true)
    {
      const children = tag.GetChildNodes();
      for (let i = 0; i < children.length; i++)
      {
        if (this.Stopped() !== true) return;

        const child = children[i].tag;
        if (child)
        {
          this.Fire(child);
        }
      }
    }
  }

  Call(fn, tag)
  {
    try
    {
      const result = fn.call(tag, this);
      if (result instanceof window.Promise)
      {
        result.catch(error =>
        {
          console.error("Event promise error:", error);

          tag.Add(
            new Error(error),
          );
        })
      }
    }
    catch (error)
    {
      console.error("Event error:", error);

      tag.Add(
        new Error(error),
      );
    }
  }

  Fire(tag, symbol = this.constructor.GetSymbol())
  {
    if (this.Stopped() === true) return;

    const fn = tag[symbol];
    if (typeof(fn) === "function")
    {
      this.Call(fn, tag);

      if (this.Stopped() === true) return;
    }

    if (tag.IsElement())
    {
      const attribute = tag.GetAttribute(this.constructor.GetLocalName());
      if (typeof(attribute) === "function")
      {
        this.Call(attribute, tag);

        if (this.Stopped() === true) return;
      }
    }

    if (this.Bubbles() === true)
    {
      const parent = tag.GetParent();
      if (parent) return this.Fire(parent);
    }

    if (this.Sinks() === true)
    {
      const children = tag.GetChildNodes();
      for (let i = 0; i < children.length; i++)
      {
        if (this.Stopped() !== true) return;

        const child = children[i].tag;
        if (child)
        {
          this.Fire(child);
        }
      }
    }
  }

  Stop()
  {
    this.GetEvent()?.preventDefault();
    this.stopped = true;

    return this;
  }

  Stopped(){ return this.GetEvent()?.defaultPrevented ?? this.stopped ?? false; }
  Bubbles(){ return this.GetEvent()?.bubbles ?? false; }
  Sinks(){ return false; }
  PreventDefault(){ this.GetEvent()?.preventDefault(); return this; }
  StopPropagation(){ this.GetEvent()?.stopPropagation(); return this; }

  GetTargetFromElement(){ return this.GetEvent()?.fromElement?.tag; }
  GetTarget(){ return this.GetEvent()?.target?.tag ?? this.GetTargetFromElement(); }
  // GetTarget(){ return this.GetEvent()?.fromElement?.tag ?? this.GetEvent()?.target?.tag; }

  SetHandler(handler){ this[HANDLER] = handler; return this; }
  SetOptions(options){ this[OPTIONS] = options; return this; }
  GetHandler(){ return this[HANDLER]; }
  GetOptions(){ return this[OPTIONS]; }

  GetName(){ return this.event?.name; }
  GetEvent(){ return this.event; }
  GetPhase(){ return this.event?.eventPhase ?? 0; }
  IsPhaseNone     (){ return this.GetPhase() === 0; }
  IsPhaseCapturing(){ return this.GetPhase() === 1; }
  IsPhaseAtTarget (){ return this.GetPhase() === 2; }
  IsPhaseBubbling (){ return this.GetPhase() === 3; }

  // Wait(){ return this.promise; }
  // Resolve(value){ this.done = true; return this.resolve(value); }
  // // Reject(error){ return this.reject(error); }
  //
  // Reject(error)
  // {
  //   if (this.done === true)
  //   {
  //     // The reason for this is that an error can be thrown AFTER the promise has already been resolved,
  //     // and we don't want those errors to be completely ignored
  //     this.event.tag.Error(error);
  //   }
  //
  //   this.done = true;
  //   return this.reject(error);
  // }
}

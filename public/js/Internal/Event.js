import "/flag#internal";

// import {Environment} from "/js/Environment.js";
import {window} from "/js/Window.js";

const CAPTURED_EVENTS = new WeakSet();

const SYMBOL = Symbol("symbol");

export class Event
{
  static Encode(buffer, event)
  {
  }

  static Decode(buffer)
  {
    // const tag; // Events fire on a specific tag... Should this always happen on the document?
    // const event;
    // const state;
  }

  static GetLocalName()
  {
    throw new Error(`No local name has been specified for event "${this.name}". Set it like this: static GetLocalName(){ return "MyName"; }`);
  }

  static CreateSymbol()
  {
    const name = this.GetLocalName() ?? this.name;
    return Symbol(name);
  }

  static GetSymbol(){ return this[SYMBOL] ??= this.CreateSymbol(); }
  static ToSymbol(){ return this.GetSymbol(); }

  static [Symbol.toPrimitive](hint)
  {
    switch (hint)
    {
      case "string": return this.GetSymbol();
      default: return Object[Symbol.toPrimitive](hint);
    }
  }

  static Bubbles(){ return false; }
  static Cancelable(){ return false; }
  static Composed(){ return false; }

  static OnCapture(node, event)
  {
    // Since the constructor invokes DispatchEvent, it will then trigger the OnCapture,
    // causing it to be re-constructed and Fire to be called again
    // This WeakSet is used to prevent it from being re-constructed
    if (CAPTURED_EVENTS.has(event))
    {
      return;
    }

    const tag = event.target?.tag ?? event?.fromElement?.tag ?? node?.tag;

    if (tag)
    {
      const wrapper = new this(tag, event);
    }
    else
    {
      console.warn("No tag found for event", event);
    }
  }

  static Capture(node, name = this.GetLocalName(), options = {
    capture: true,
  })
  {
    node.addEventListener(name, this.OnCapture.bind(this, node), options);

    return this;
  }

  static CreateEvent()
  {
    return new window.Event(this.GetLocalName(), {
      bubbles: this.Bubbles(),
      cancelable: this.Cancelable(),
      composed: this.Composed(),
    });
  }

  constructor(tag, event, state)
  {
    if (tag === undefined)
    {
      throw new Error(`Event.constructor was given an undefined tag`);
    }

    this.tag = tag;
    this.event = event ?? this.CreateEvent();
    this.state = state;

    this.event.tag ??= this.tag;
    this.event.state ??= this.state;
    // this.event.preventDefault();

    this.Setup();
  }

  Setup()
  {
    const tag = this.GetTag();
    const event = this.GetEvent();

    this.Fire(tag, event);

    if (this.IsPhaseNone())
    {
      CAPTURED_EVENTS.add(event);
      tag.DispatchEvent(event);
    }
  }

  CreateEvent(){ return this.constructor.CreateEvent(); }

  Call(fn, tag, event)
  {
    try
    {
      const result = fn.call(tag, event, this);
      if (result instanceof window.Promise)
      {
        result.catch(error => tag.Throw(error));
      }
    }
    catch (error)
    {
      tag.Throw(error);
    }
  }

  Fire(tag, event, symbol = this.constructor.ToSymbol())
  {
    if (this.Stopped() === true) return;
    if (tag === undefined)
    {
      throw new Error(`Event.Fire was given an undefined tag`);
    }

    const fn = tag[symbol];
    if (typeof(fn) === "function")
    {
      // console.log("Found fn", fn);
      this.Call(fn, tag, event);

      if (this.Stopped() === true) return;
    }

    if (this.Bubbles() === true)
    {
      const parent = tag.GetParent();
      if (parent) return this.Fire(parent, event, symbol);
    }
  }

  Stopped(){ return this.GetEvent()?.defaultPrevented ?? this.stopped ?? false; }
  Bubbles(){ return this.GetEvent()?.bubbles ?? this.constructor.Bubbles(); }
  Sinks(){ return false; }
  PreventDefault(){ this.GetEvent()?.preventDefault(); return this; }
  StopPropagation(){ this.GetEvent()?.stopPropagation(); return this; }

  GetTag(){ return this.tag; }
  GetEvent(){ return this.event; }
  GetPhase(){ return this.GetEvent()?.eventPhase ?? 0; }
  IsPhaseNone     (){ return this.GetPhase() === 0; }
  IsPhaseCapturing(){ return this.GetPhase() === 1; }
  IsPhaseAtTarget (){ return this.GetPhase() === 2; }
  IsPhaseBubbling (){ return this.GetPhase() === 3; }
}

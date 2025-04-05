import {Event, PHASES, SetPhase, SetPath} from "/js/Utility/DOM/Event.js";

export const InvokeEventListeners = Symbol("EventTarget.Internal.InvokeEventListeners");
export const InnerInvokeEventListeners = Symbol("EventTarget.Internal.InnerInvokeEventListeners");

export class EventListener
{
  constructor({
    type,
    callback,
    capture,
    passive,
    once,
    signal,
  })
  {
    this.type = type;
    this.callback = callback;
    this.capture = capture;
    this.passive = passive;
    this.once = once;
    this.signal = signal;
  }

  handleEvent(event)
  {
    return undefined;
  }
}

export class _EventTarget
{
  // #listeners = new Map();
  #listeners = new WeakMap();
  // #listeners = [];

  #GetListeners(type)
  {
    let listeners;
    if (this.#listeners.has(type))
    {
      listeners = this.#listeners.get(type);
    }
    else
    {
      listeners = new Map();
      this.#listeners.set(type, listeners);
    }

    return listeners;
  }

  // https://dom.spec.whatwg.org/#concept-event-listener-invoke
  [InvokeEventListeners](struct, eventImpl, phase)
  {
    const structIndex = eventImpl._path.indexOf(struct);

    for (let i = structIndex; i >= 0; i--)
    {
      const t = eventImpl._path[i];
      if (t.target)
      {
        eventImpl.target = t.target;
        break;
      }
    }

    eventImpl.relatedTarget = idlUtils.wrapperForImpl(struct.relatedTarget);

    if (eventImpl._stopPropagationFlag)
    {
      return;
    }

    eventImpl.currentTarget = idlUtils.wrapperForImpl(struct.item);

    const listeners = struct.item._eventListeners;
    this[InnerInvokeEventListeners](eventImpl, listeners, phase, struct.itemInShadowTree);
  }

  // https://dom.spec.whatwg.org/#concept-event-listener-inner-invoke
  [InnerInvokeEventListeners](eventImpl, listeners, phase, itemInShadowTree)
  {
    let found = false;

    const {type, target} = eventImpl;
    const wrapper = idlUtils.wrapperForImpl(target);

    if (!listeners || !listeners[type])
    {
      return found;
    }

    // Copy event listeners before iterating since the list can be modified during the iteration.
    const handlers = listeners[type].slice();

    for (let i = 0; i < handlers.length; i++)
    {
      const listener = handlers[i];
      const { capture, once, passive } = listener.options;

      // Check if the event listener has been removed since the listeners has been cloned.
      if (!listeners[type].includes(listener))
      {
        continue;
      }

      found = true;

      if ((phase === "capturing" && !capture) || (phase === "bubbling" && capture))
      {
        continue;
      }

      if (once) {
        listeners[type].splice(listeners[type].indexOf(listener), 1);
      }

      let window = null;
      if (wrapper && wrapper._document)
      {
        // Triggered by Window
        window = wrapper;
      }
      else if (target._ownerDocument)
      {
        // Triggered by most webidl2js'ed instances
        window = target._ownerDocument._defaultView;
      }
      else if (wrapper._ownerDocument)
      {
        // Currently triggered by some non-webidl2js things
        window = wrapper._ownerDocument._defaultView;
      }

      let currentEvent;
      if (window)
      {
        currentEvent = window._currentEvent;

        if (!itemInShadowTree)
        {
          window._currentEvent = eventImpl;
        }
      }

      if (passive)
      {
        eventImpl._inPassiveListenerFlag = true;
      }

      try
      {
        listener.callback.call(eventImpl.currentTarget, eventImpl);
      }
      catch (e)
      {
        if (window)
        {
          reportException(window, e);
        }
        // Errors in window-less documents just get swallowed... can you think of anything better?
      }

      eventImpl._inPassiveListenerFlag = false;

      if (window)
      {
        window._currentEvent = currentEvent;
      }

      if (eventImpl._stopImmediatePropagationFlag)
      {
        return found;
      }
    }

    return found;
  }

  #flatten(options)
  {
    if (typeof(options) === "boolean") return options;
    else return options.capture;
  }

  #flattenMore(options)
  {
    let capture = this.#flatten(options);
    let once = false;
    let passive = false;
    let signal = null;

    if (typeof(options) === "object" && options !== null)
    {
      once = options.once;
      passive = options.passive;
      if (options.hasOwnProperty("signal"))
      {
        signal = options.signal;
      }
    }

    return {
      capture,
      passive,
      once,
      signal,
    };
  }

  #compareListeners(a, b)
  {
    return a.type === b.type
        && a.callback === b.callback
        && a.capture === b.capture;
  }

  #addEventListener(listener)
  {
    // TODO: 1

    if (listener.signal !== null && listener.aborted !== undefined) return; // 2
    if (listener.callback === null) return; // 3

    // 4
    let found = false;
    for (const value of this.#listeners.values())
    {
      if (this.#compareListeners(value, listener) === true)
      {
        found = true;
        break;
      }
    }

    if (found !== true)
    {
      this.#listeners.set(listener.callback, listener);
    }

    if (listener.signal !== null) // 5
    {
      // TODO
    }
  }

  addEventListener(type, callback, options)
  {
    const flattened = this.#flattenMore(options);
    flattened.type = type;
    flattened.callback = callback;

    const listener = new EventListener(flattened);
    this.#addEventListener(listener);
  }

  #removeEventListener(listener)
  {
    // TODO: 1
    this.#listeners.delete(listener.callback);
  }

  removeEventListener(type, callback, options)
  {
    const capture = this.#flatten(options);

    if (this.#listeners.has(callback))
    {
      const listener = this.#listeners.get(callback);
      this.#removeEventListener(listener);
    }
  }

  dispatchEvent(event)
  {
    if (event.dispatch || !event.initialized) throw new DOMException("InvalidStateError");

    event.isTrusted = false;

    const path = [];

    // Build up the event path
    let parent = this.parentNode;
    while (parent)
    {
      path.push(parent);
      parent = parent.parentNode;
    }

    event[SetPath](path);

    // Iterate down the path
    for (let i = path.length - 1; i >= 0; --i)
    {
      const struct = path[i];

      if (struct.target !== null)
      {
        event[SetPhase](PHASES.AT_TARGET);
      }
      else
      {
        event[SetPhase](PHASES.CAPTURING_PHASE);
      }

      this[InvokeEventListeners](struct, event, "capturing");
    }

    // Iterate back up the path
    for (let i = 0; i < path.length; i++)
    {
      const struct = path[i];

      if (struct.target !== null)
      {
        event[SetPhase](PHASES.AT_TARGET);
      }
      else
      {
        if (!event.bubbles) continue;

        event[SetPhase](PHASES.BUBBLING_PHASE);
      }

      this[InvokeEventListeners](struct, event, "bubbling");
    }

    event[SetPhase](PHASES.NONE);
  }

  // TODO: https://dom.spec.whatwg.org/#retarget
  #retarget(a, b)
  {
  }

  // https://dom.spec.whatwg.org/#concept-event-dispatch
  #dispatch(event, target, legacyTargetOverrideFlag, legacyOutputDidListenersThrowFlag)
  {
    const target = this;

    event.dispatch = true; // 1
    let targetOverride = target; // 2, partial
    let activationTarget = null; // 3
    let relatedTarget = this.#retarget(event.relatedTarget, target); // 4: TODO

    if (target !== relatedTarget || target === event.relatedTarget) // 5
    {
      let touchTargets = [];
      for (const touchTarget of event.touchTargets)
      {
        touchTargets.push(this.#retarget(touchTarget, target));
      }
    }
  }

  dispatchEvent(event)
  {
    if (event.dispatch || !event.initialized) throw new DOMException("InvalidStateError");

    event.isTrusted = false;

    return this.#dispatch(event);
  }
}

export class EventTarget {
  #listeners = new Map(); // Stores event listeners

  addEventListener(type, callback) {
    if (!this.#listeners.has(type)) {
      this.#listeners.set(type, []);
    }
    this.#listeners.get(type).push(callback);
  }

  removeEventListener(type, callback) {
    if (!this.#listeners.has(type)) return;

    const stack = this.#listeners.get(type);
    const index = stack.indexOf(callback);
    
    if (index !== -1) {
      stack.splice(index, 1);
    }
  }

  dispatchEvent(event) {
    if (!this.#listeners.has(event.type)) return true;

    const stack = this.#listeners.get(event.type).slice();

    for (const handler of stack) {
      if (event.defaultPrevented) break;
      handler.call(this, event);
    }

    return !event.defaultPrevented;
  }
}
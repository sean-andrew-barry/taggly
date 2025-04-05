import {Node} from "/js/Utility/DOM/Node.js";
import {ShadowRoot} from "/js/Utility/DOM/ShadowRoot.js";
import {Data} from "/js/Utility/DOM/Data.js";

export const PHASES = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3,
};

export class _Event
{
  static #Create(realm, time, dictionary)
  {
    const event = new this("", dictionary);
    event.initialized = true;
    event.timeStamp = time;
    event.isTrusted = false;

    return event;
  }

  static {
    // Expose controlled access to these private methods
    Data.set(this, {
      Create: (...args) => this.#Create(...args),
      SetPhase: (event, ...args) => event.#SetPhase(...args),
      SetPath: (event, ...args) => event.#SetPath(...args),
      Dispatch: (event, ...args) => event.#Dispatch(...args),
    });
  }

  #type;
  #isTrusted;
  #bubbles;
  #cancelable;
  #composed;
  #eventPhase;
  #currentTarget;
  #defaultPrevented;
  #path = [];

  get type(){ return this.#type; }
  get isTrusted(){ return this.#isTrusted; }
  get bubbles(){ return this.#bubbles; }
  get cancelable(){ return this.#cancelable; }
  get composed(){ return this.#composed; }
  get currentTarget(){ return this.#currentTarget; }
  get defaultPrevented(){ return this.#defaultPrevented; }
  get eventPhase(){ return this.#eventPhase; }

  constructor(type, options)
  {
    this.#type = type;
    this.#bubbles = options.bubbles;
    this.#cancelable = options.cancelable;
    this.#composed = options.composed;
  }

  #SetPhase(eventPhase){ this.#eventPhase = eventPhase; }
  #SetPath(path){ this.#path = path; }

  #appendToEventPath(invocationTarget, shadowAdjustTarget, relatedTarget, touchTargets, slotInClosedTree)
  {
    let invocationTargetInShadowTree = false; // 1

    // 2
    if (invocationTarget instanceof Node && invocationTarget.getRootNode instanceof ShadowRoot)
    {
      invocationTargetInShadowTree = true;
    }

    let rootOfClosedTree = false; // 3

    // 4
    if (invocationTarget instanceof ShadowRoot && invocationTarget.mode === "closed")
    {
      rootOfClosedTree = true;
    }

    this.#path.push({
      invocationTarget,
      invocationTargetInShadowTree,
      shadowAdjustedTarget,
      relatedTarget,
      touchTargets,
      rootOfClosedTree,
      slotInClosedTree,
    });
  }

  #Dispatch(target, legacyTargetOverrideFlag, legacyOutputDidListenersThrowFlag)
  {
    this.dispatch = true; // 1
    let targetOverride = target; // 2, partial
    let activationTarget = null; // 3
    let relatedTarget = this.#retarget(this.relatedTarget, target); // 4: TODO

    if (target !== relatedTarget || target === this.relatedTarget) // 5
    {
      let touchTargets = [];
      for (const touchTarget of this.touchTargets)
      {
        touchTargets.push(this.#retarget(touchTarget, target));
      }

      this.#appendToEventPath(target, targetOverride, relatedTarget, touchTargets, false); // 5.3

      let isActivationEvent = (this instanceof MouseEvent && this.type === "click"); // 5.4

      if (isActivationEvent === true)
      {
        // // TODO: https://dom.spec.whatwg.org/#eventtarget-activation-behavior
        // activationTarget = target;

        let slottable = null;
        if (target.IsSlottable() && target.IsAssigned()) slottable = target; // 5.6

        let slotInClosedTree = false;
        let parent = target.GetTheParent(event);

        while (parent !== null) // 9
        {
          if (slottable !== null) // 9.1
          {
            if (!parent.IsSlot()) throw new Error(`Parent must be a slot`); // 9.1.1

            slottable = null; // 9.1.2

            if (parent.RootIsShadowRoot("closed")) // 9.1.3
            {
              slotInClosedTree = true;
            }
          }

          if (parent.IsSlottable() && parent.IsAssigned()) slottable = parent; // 9.2

          let relatedTarget = this.Retarget(this.relatedTarget, parent); // 9.3
          let touchTargets = []; // 9.4

          for (const touchTarget of this.touchTargets) // 9.5
          {
            touchTargets.push(this.Retarget(touchTarget, target));
          }

          if (parent.IsWindow() || (parent instanceof Node && target.IsRootShadowIncludingInclusiveAncestorOf(parent))) // 9.6
          {
            if (isActivationEvent === true && this.#bubbles === true && activationTarget === null && parent.HasActivationBehavior())
            {
              activationTarget = parent;
              this.#appendToEventPath(parent, null, relatedTarget, touchTargets, slotInClosedTree); // 9.6.2
            }
          }
          else if (parent === relatedTarget) // 9.7
          {
            parent = null;
          }
          else // 9.8
          {
            target = parent;
            if (isActivationEvent === true && activationTarget === null && target.HasActivationBehavior())
            {
              activationTarget = target;
            }

            this.#appendToEventPath(parent, target, relatedTarget, touchTargets, slotInClosedTree); // 9.8.2
          }

          if (parent !== null)
          {
            parent = parent.GetTheParent(this);
          }

          slotInClosedTree = false;
        }

        // 10
        let clearTargetsStruct;
        for (let i = this.#path.length - 1; i > 0; i--)
        {
          const struct = this.#path[i];
          if (struct.shadowAdjustTarget !== null)
          {
            clearTargetsStruct = struct;
            break;
          }
        }

        let clearTargets = this.ShouldClearTargets(clearTargetsStruct); // 11

        if (activationTarget !== null && activationTarget.HasLegacyPreActivationBehavior())
        {
          activationTarget.RunLegacyPreActivationBehavior();
        }

        for (let i = this.#path.length - 1; i > 0; i--) // 13
        {
          const struct = this.#path[i];
          if (struct.shadowAdjustTarget !== null)
          {
            this.#eventPhase = PHASES.AT_TARGET;
          }
          else
          {
            this.#eventPhase = PHASES.CAPTURING_PHASE;
          }

          this.Invoke(struct, event, "capturing", legacyOutputDidListenersThrowFlag);
        }

        for (let i = 0; i < this.#path.length; i++) // 14
        {
          const struct = this.#path[i];
          if (struct.shadowAdjustTarget !== null)
          {
            this.#eventPhase = PHASES.AT_TARGET;
          }
          else
          {
            if (this.#bubbles === false) continue;

            this.#eventPhase = PHASES.BUBBLING_PHASE;
          }

          this.Invoke(struct, event, "bubbling", legacyOutputDidListenersThrowFlag);
        }
      }
    }
  }

  IsNodeShadowRoot(node, mode)
  {
    return node instanceof Node
        && node.RootIsShadowRoot(mode);
  }

  IsAnyNodeShadowRoot(nodes, mode)
  {
    for (const node of nodes)
    {
      if (this.IsNodeShadowRoot(node)) return true;
    }

    return false;
  }

  ShouldClearTargets(clearTargetsStruct)
  {
    return this.IsNodeShadowRoot(clearTargetsStruct.shadowAdjustTarget)
        || this.IsNodeShadowRoot(clearTargetsStruct.relatedTarget)
        || this.IsAnyNodeShadowRoot(clearTargetsStruct.touchTargets)
        || false;
  }

  composedPath(){ return this.#path; }
  preventDefault(){ return; }
  stopImmediatePropagation(){ return; }
  stopPropagation(){ return; }
}

export class Event {
  #type;
  #target;
  #currentTarget;
  #bubbles = false;
  #cancelable = false;
  #defaultPrevented = false;
  #composed = false;
  #timeStamp;

  constructor(type, eventInitDict = {}) {
    this.#type = type;
    this.#bubbles = eventInitDict.bubbles || false;
    this.#cancelable = eventInitDict.cancelable || false;
    this.#composed = eventInitDict.composed || false;
    this.#timeStamp = Date.now();
  }

  get type() { return this.#type; }
  get target() { return this.#target; }
  get currentTarget() { return this.#currentTarget; }
  get bubbles() { return this.#bubbles; }
  get cancelable() { return this.#cancelable; }
  get defaultPrevented() { return this.#defaultPrevented; }
  get timeStamp() { return this.#timeStamp; }

  preventDefault() {
    if (this.#cancelable) {
      this.#defaultPrevented = true;
    }
  }

  stopPropagation() {
    // TODO: In a full implementation, this would stop the event from
    // moving on to the next phase in its propagation path.
  }

  stopImmediatePropagation() {
    // TODO: In a full implementation, this would prevent other listeners
    // from being called.
  }

  // Additional methods for handling phases and targets would also be included
  // in a more complete implementation.
}

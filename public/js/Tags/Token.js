import {Tag} from "/js/Tag.js";
// import {Connect} from "/js/Event/Connect.js";
import {Render} from "/js/Event/Render.js";

const START = Symbol("start");
const TOTAL = Symbol("total");
const CHILDREN = Symbol("children");

export class Token extends Tag
{
  static GetLocalName(){ return "token"; }

  static Start()
  {
    this[START] = window.performance.now();
  }

  static Stop()
  {
    const stop = window.performance.now();
    this[TOTAL] ??= 0;
    this[TOTAL] += stop - this[START];
  }

  static GetTotal(){ return this[TOTAL]; }

  // [Connect](event)
  // {
  //   this.AddClass(this.constructor.name);
  // }

  [Render](event)
  {
    this.AddClass(this.constructor.name);
  }

  // Add(...args)
  // {
  //   if (!this.hasOwnProperty(CHILDREN))
  //   {
  //     this[CHILDREN] ??= args;
  //   }
  //   else
  //   {
  //     this[CHILDREN].push.apply(this[CHILDREN], args);
  //   }
  //
  //   return this;
  // }
  //
  // AppendChild(child)
  // {
  //   if (!this.hasOwnProperty(CHILDREN))
  //   {
  //     this[CHILDREN] ??= [child];
  //   }
  //   else
  //   {
  //     this[CHILDREN].push(child);
  //   }
  //
  //   return this;
  // }
}

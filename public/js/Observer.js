import {window} from "/js/Window.js";

// const INSTANCE = Symbol("instance");
const TAG = Symbol("tag");

export class Observer
{
  // static Get(){ return this[INSTANCE]; }
  //
  // static Initialize()
  // {
  //   return this[INSTANCE] ??= new this();
  // }

  constructor(tag)
  {
    this[TAG] = tag;

    window.addEventListener("unload", event =>
    {
      this.destructor();
    }, { once: true });
  }

  destructor()
  {
    // console.log("Destructing observer", this.constructor.name);
  }

  GetTag(){ return this[TAG]; }
}

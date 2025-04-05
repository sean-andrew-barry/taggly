import {Color} from "/js/Utility/Color.js";

export class RGBA extends Color
{
  set red(v){ this[0] = v; }
  set blue(v){ this[1] = v; }
  set green(v){ this[2] = v; }

  get red(){ return this[0]; }
  get blue(){ return this[1]; }
  get green(){ return this[2]; }

  toString(){ return `rgba(${this.ToInt(this[0])}, ${this.ToInt(this[1])}, ${this.ToInt(this[2])}, ${this.ToFloat(this[3])})`; }
}

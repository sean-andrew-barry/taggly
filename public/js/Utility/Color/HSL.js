import {HSLA} from "/js/Utility/Color/HSLA.js";

export class HSL extends HSLA
{
  toString(){ return `hsl(${this.ToDegree(this[0])}, ${this.ToPercent(this[1])}, ${this.ToPercent(this[2])})`; }
}

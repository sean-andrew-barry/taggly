import {RGBA} from "/js/Utility/Color/RGBA.js";

export class RGB extends RGBA
{
  toString(){ return `rgb(${this.ToInt(this[0])}, ${this.ToInt(this[1])}, ${this.ToInt(this[2])})`; }
}

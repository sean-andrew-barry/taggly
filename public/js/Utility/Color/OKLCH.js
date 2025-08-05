import { Color } from "/js/Utility/Color.js";

export class OKLCH extends Color {
  set lightness(v) { this[0] = v; }
  set chroma(v) { this[1] = v; }
  set hue(v) { this[2] = v; }

  get lightness() { return this[0]; }
  get chroma() { return this[1]; }
  get hue() { return this[2]; }

  toString() { return `oklch(${this[0]} ${this[1]} ${this[2]} / ${this[3]})`; }
}
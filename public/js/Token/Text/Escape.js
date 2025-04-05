import {Text} from "/js/Token/Text.js";

export class Escape extends Text
{
  #escaped;

  GetMaxHexLength(){ return 6; }
  GetText(){ return this.#escaped; }
  SetText(value){ this.#escaped = value; }

  IsStartCharacter(c = this.Peek())
  {
    return c === "\\";
  }
}
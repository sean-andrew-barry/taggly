import {Escape} from "/js/Token/Text/Escape.js";

export class CharacterEscape extends Escape
{
  Parse()
  {
    if (!this.IsStartCharacter()) return false;

    this.Step();

    let character = this.Take();

    this.SetText(character);

    return true;
  }
}
import {Tag} from "/js/Tag.js";

export class Character extends Tag
{
  Parse(p)
  {
    if (p.IsDone())
    {
      return false;
    }
    else
    {
      this.SetAttribute("value", p.Take());
      return true;
    }
  }
}

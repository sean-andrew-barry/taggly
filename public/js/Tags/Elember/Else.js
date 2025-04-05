import {Tag} from "/js/Tag.js";
import {If} from "/js/Tags/Elember/If.js";
import {ElseIf} from "/js/Tags/Elember/ElseIf.js";

export class Else extends Tag
{
  Connect(parent)
  {
    const prev = this.GetPrevSibling();

    if (!(prev instanceof If) && !(prev instanceof ElseIf))
    {
      throw new Error(`Else tag can only be placed after an If or an ElseIf tag`);
    }

    if (prev.GetResult() !== true)
    {
      super.Connect(parent);
    }
  }

  // Test(target)
  // {
  //   const prev = this.GetPrevSibling();
  //
  //   if (!(prev instanceof If))
  //   {
  //     throw new Error(`Else tag can only be placed after an If or an ElseIf tag`);
  //   }
  //
  //   if (prev.Test(target)) return false;
  //
  //   return true;
  // }

  Run(parent, target)
  {
    this.SetResult(true); // True by default

    let prev = this.GetPrevSibling();
    if (!(prev instanceof If))
    {
      throw new Error(`Else tag can only be placed after an If or an ElseIf tag`);
    }

    while (prev)
    {
      if (prev.GetResult() === true)
      {
        this.SetResult(false);
        break;
      }

      prev = prev.GetPrevSibling();
      if (!(prev instanceof If)) break;
    }

    if (this.GetResult() === true)
    {
      console.log("Else passed!");
      super.Run(parent, target, false);
    }
    else // Failed
    {
      console.log("Else failed!");
    }
  }
}

Else.Register();

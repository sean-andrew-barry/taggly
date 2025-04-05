import {Tag} from "/js/Tag.js";
import {If} from "/js/Tags/Elember/If.js";

export class ElseIf extends If
{
  _Connect(parent)
  {
    const prev = this.GetPrevSibling();

    if (!(prev instanceof If) && !(prev instanceof ElseIf))
    {
      throw new Error(`ElseIf tag can only be placed after an If or an ElseIf tag`);
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
  //     throw new Error(`ElseIf tag can only be placed after an If or an ElseIf tag`);
  //   }
  //
  //   // Make sure the previous one does NOT evaluate to true
  //   if (prev.Test(target)) return false;
  //
  //   // Allow the If.Test to do the actual evaluation
  //   return super.Test(target);
  // }

  Run(parent, target)
  {
    // this.SetResult(undefined);

    const prev = this.GetPrevSibling();

    if (!(prev instanceof If))
    {
      throw new Error(`ElseIf tag can only be placed after an If or an ElseIf tag`);
    }

    if (prev.GetResult() !== true)
    {
      super.Run(parent, target, false);
    }
  }
}

ElseIf.Register();

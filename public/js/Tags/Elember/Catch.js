import {Tag} from "/js/Tag.js";

export class Catch extends Tag
{
  Connect(parent)
  {
    const promise = parent.GetResult();
    this.Expect(promise).Named("promise").ToBePromise();

    promise.catch(result =>
    {
      this.SetResult(result);
      super.Connect(parent);
    });
  }
}

Catch.Register();

import {Tag} from "/js/Tag.js";

export class Then extends Tag
{
  Connect(parent)
  {
    const promise = parent.GetResult();
    this.Expect(promise).Named("promise").ToBePromise();

    promise.then(result =>
    {
      console.log("Then tag resolving!", result);
      this.SetResult(result);
      super.Connect(parent);
    });
  }
}

Then.Register();

import {Tag} from "/js/Tag.js";

export class Finally extends Tag
{
  Connect(parent)
  {
    const promise = parent.GetResult();
    this.Expect(promise).Named("promise").ToBePromise();

    promise.finally(result =>
    {
      this.SetResult(result);
      super.Connect(parent);
    });
  }
}

Finally.Register();

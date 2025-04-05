import {Tag} from "/js/Tag.js";

export class AsyncIterable extends Tag
{
  static GetLocalName(){ return "async-iterable"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(value)
  {
    super();

    this.value = value;
    this.Next();
  }

  Next(promise = this.value.next())
  {
    const tag = this.ConvertPromise(
      promise.then(({done, value}) =>
      {
        if (done) return undefined;

        this.Next();
        return value;
      })
    );

    this.AppendChild(tag);
    return tag;
  }

  Deconvert(){ return this.value; }
}

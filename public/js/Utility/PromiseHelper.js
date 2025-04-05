export const RESOLVE = Symbol("resolve");
export const REJECT = Symbol("reject");

export class PromiseHelperOld extends Promise
{
  // This is necessary, otherwise the behavior is really weird and it errors, not sure why
  static get [Symbol.species](){ return Promise; }

  constructor(resolve_callback, reject_callback)
  {
    let _resolve;
    let _reject;

    super((resolve, reject) =>
    {
      _resolve = resolve;
      _reject = reject;
    });

    this[RESOLVE] = _resolve;
    this[REJECT] = _reject;
    this.resolve_callback = resolve_callback;
    this.reject_callback = reject_callback;
  }

  Resolve(value){ if (this.resolve_callback) this.resolve_callback(); return this[RESOLVE](value); }
  Reject(value){ if (this.reject_callback) this.reject_callback(); return this[REJECT](value); }
}

export class PromiseHelper extends Promise
{
  // This is necessary, otherwise the behavior is really weird and it errors, not sure why
  static get [Symbol.species](){ return Promise; }

  constructor(callback, self = undefined)
  {
    // let _resolve;
    // let _reject;

    super((resolve, reject) =>
    {
      // _resolve = resolve;
      // _reject = reject;
      callback = callback.bind(self, resolve, reject);
    });

    this.callback = callback;

    // this[RESOLVE] = _resolve;
    // this[REJECT] = _reject;
    // this.callback = callback.bind(self, _resolve, _reject);
  }

  Call(){ return this.callback(); }
  // Resolve(value){ if (this.resolve_callback) this.resolve_callback(); return this[RESOLVE](value); }
  // Reject(value){ if (this.reject_callback) this.reject_callback(); return this[REJECT](value); }

  then(resolve, reject)
  {
    return new PromiseHelper(resolve);
  }
}

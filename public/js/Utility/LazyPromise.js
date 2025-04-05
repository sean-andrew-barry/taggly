export const PROMISE = Symbol("promise");

export class LazyPromise
{
  // Make (promise instanceof Promise) be true
  static get [Symbol.species](){ return Promise; }

  static race(...args){ return Promise.race(...args); }
  static reject(...args){ return Promise.reject(...args); }
  static resolve(...args){ return Promise.resolve(...args); }
  static any(...args){ return Promise.any(...args); }
  static all(...args){ return Promise.all(...args); }
  static allSettled(...args){ return Promise.allSettled(...args); }

  constructor(timeout)
  {
    this.Reset(timeout);
  }

  Reset(timeout)
  {
    this.promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });

    if (typeof(timeout) === "number")
    {
      this.ClearTimeout();

      this.timeout_id = window.setTimeout(() =>
      {
        console.log("Promise timeout");
        this.Resolve();
      }, timeout);
    }
  }

  IsWaiting(){ return this.resolve !== undefined; }

  ClearTimeout()
  {
    if (this.timeout_id)
    {
      window.clearTimeout(this.timeout_id);
      this.timeout_id = undefined;
    }
  }

  Resolve(result)
  {
    const resolve = this.resolve;
    this.resolve = undefined;
    this.reject = undefined;

    this.ClearTimeout();

    resolve?.(result);
  }

  Reject(error)
  {
    const reject = this.reject;
    this.resolve = undefined;
    this.reject = undefined;

    this.ClearTimeout();

    reject?.(error);
  }

  then(resolve, reject)
  {
    const promise = this.promise.then(resolve);

    if (!reject) return promise;
    else return promise.catch(reject);
  }

  catch(handler)
  {
    return this.promise.catch(handler);
  }

  finally(handler)
  {
    return this.promise.finally(handler);
  }

  _then(resolve, reject)
  {
    return this.promise;
  }
}

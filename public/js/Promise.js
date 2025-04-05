import {window} from "/js/Window.js";
import {Function} from "/js/Function.js";
import {RequestIdleCallback} from "/js/Utility/RequestIdleCallback.js";

const GlobalPromise = globalThis.Promise;

const DOM_LOADED = new GlobalPromise((resolve, reject) =>
{
  window.addEventListener("DOMContentLoaded", resolve, { once: true });
});

const BEFORE_UNLOAD = new GlobalPromise((resolve, reject) =>
{
  window.addEventListener("beforeunload", resolve, { once: true });
});

const UNLOAD = new GlobalPromise((resolve, reject) =>
{
  window.addEventListener("unload", resolve, { once: true });
});

let profile_count = 1;
let queue;
let frame;
let idle;
export class Promise extends GlobalPromise
{
  static Loaded(fn)
  {
    if (!fn) return DOM_LOADED;
    else return DOM_LOADED.then(fn);
  }

  static BeforeUnload(fn)
  {
    if (!fn) return BEFORE_UNLOAD;
    else return BEFORE_UNLOAD.then(fn);
  }

  static Unload(fn)
  {
    if (!fn) return UNLOAD;
    else return UNLOAD.then(fn);
  }

  static Sleep(ms)
  {
    return new GlobalPromise(resolve => globalThis.setTimeout(resolve, ms));
  }

  static Queue()
  {
    const prev = queue;
    return queue = new GlobalPromise(async (resolve, reject) =>
    {
      await prev; // Wait for the previous promise to resolve
      resolve();
    });
  }

  static Queue()
  {
    const prev = queue;
    return queue = new GlobalPromise((resolve, reject) =>
    {
      prev.then(resolve); // Wait for the previous promise to resolve
    });
  }

  static Frame()
  {
    return frame ??= new GlobalPromise((resolve, reject) =>
    {
      window.requestAnimationFrame(dt =>
      {
        // Clear the frame, so that when AwaitAnimationFrame is called it generates a new promise
        frame = undefined;
        resolve(dt);
      });
    });
  }

  static Idle(options)
  {
    return idle ??= new Promise((resolve, reject) =>
    {
      RequestIdleCallback(deadline =>
      {
        idle = undefined;
        resolve(deadline);
      }, options);
    });
  }

  static async Task(callback, options)
  {
    const is_generator = Function.IsGenerator(callback);
    const is_async_generator = Function.IsAsyncGenerator(callback);

    if (!is_generator && !is_async_generator)
    {
      // Wait for the thread to be idle (on supporting browsers)
      const deadline = await this.Idle(options);

      // Then invoke the function
      return callback();
    }

    const generator = callback();
    let slowest = 0;

    while (true)
    {
      // Wait for the thread to be idle (on supporting browsers)
      const deadline = await this.Idle(options);
      let remaining = deadline.timeRemaining();

      // Only run the next step if we estimate that it will
      // take less time than the remaining time
      while (remaining >= slowest)
      {
        let next;
        if (is_generator)
        {
          next = generator.next();
        }
        else if (is_async_generator)
        {
          next = await generator.next();
        }

        if (next.done === true || deadline.didTimeout === true)
        {
          return next.value;
        }
        else
        {
          const prev = remaining;
          remaining = deadline.timeRemaining();

          // Track the slowest iteration, and use that to estimate if
          // we have enough time to perform another iteration
          const time = prev - remaining;
          if (time > slowest) slowest = time;
        }
      }
    }
  }

  static async Profile(callback, options = {})
  {
    const has_duration = options.hasOwnProperty("duration");
    const has_iterations = options.hasOwnProperty("iterations");
    const is_async = Function.IsAsync(callback);
    const is_generator = Function.IsGenerator(callback);
    const is_async_generator = Function.IsAsyncGenerator(callback);
    const name = callback.name ?? `profile-${profile_count++}`;

    let generator;
    let next;
    let done = false;
    let idles = 0;
    let steps = 0;
    let total = 0; // Total run time in MS
    let average = 0;
    let fastest = Number.MAX_SAFE_INTEGER;
    let slowest = 0;

    if (is_generator || is_async_generator)
    {
      generator = callback();
    }

    while (true)
    {
      // Wait for the thread to be idle
      const deadline = await this.Idle(options);
      idles++;

      let remaining = deadline.timeRemaining();
      if (remaining === 0)
      {
        console.log("Remaining is already at 0!");
        break;
      }

      // Only run the next step if we estimate that it will take less
      // time than the remaining time
      while (remaining >= slowest)
      {
        if      (is_generator) next = generator.next();
        else if (is_async_generator) next = await generator.next();
        else if (is_async) await callback();
        else callback();

        if (has_duration)
        {
          done = total >= options.duration;
        }
        else if (has_iterations)
        {
          done = steps >= options.iterations;
        }
        else if (generator)
        {
          done = next.done;
        }
        else
        {
          throw new Error(`Promise.Task was not provided with a stopping condition, such as an iterations or duration number`);
        }

        if (done === true || deadline.didTimeout === true)
        {
          return {
            name,
            idles,
            steps,
            total,
            value: next?.value,
            average,
            fastest,
            slowest,
            timeout: deadline.didTimeout,
            nsper: average * (1000.0 * 1000.0),
          };
        }
        else
        {
          const prev = remaining;
          remaining = deadline.timeRemaining();
          const time = prev - remaining;

          steps++;

          if (time > slowest) slowest = time;
          if (time < fastest) fastest = time;

          total += time;
          average = total / steps;
        }
      }
    }
  }

  static DurationProfile(callback, duration){ return this.Profile(callback, { duration }); }
  static IterationProfile(callback, iterations){ return this.Profile(callback, { iterations }); }
  static TimeoutProfile(callback, timeout){ return this.Profile(callback, { timeout }); }

  static async Profiles(options)
  {
    const profiles = [];
    for (const key of Object.keys(options))
    {
      const value = options[key];

      if (typeof(value) === "function")
      {
        const profile = await this.Profile(value, options);
        profiles.push(profile);
      }
    }

    return profiles.sort((a, b) =>
    {
      return a.average - b.average;
    });
  }

  static Encode(buffer, value)
  {
    throw new Error(`A Promise cannot be encoded to a buffer, resolve it first`);
  }

  static Decode(buffer)
  {
    throw new Error(`A Promise cannot be decoded from a buffer, and shouldn't have ever been encoded`);
  }
}

import {monitorEventLoopDelay, performance} from "perf_hooks";
import {PerformanceObserver as Base} from "/js/Observer/PerformanceObserver.js?after=/taggly/private/";

export class PerformanceObserver extends Base
{
  #last;
  #interval_id;

  GetEntryTypes()
  {
    const entry_types = super.GetEntryTypes();

    if (entry_types)
    {
      entry_types.push(
        "node",
        "gc",
        "function",
        "http2",
        "http",
      );
    }

    return entry_types;
  }

  GetBuffered(){ return true; }

  constructor(tag)
  {
    super(tag);

    // this.monitor = monitorEventLoopDelay({
    //   resolution: 10,
    // });
    //
    // this.monitor.enable();

    // const interval = 1000;
    //
    // global.setInterval(() =>
    // {
    //   // console.log("Checking monitor", this.monitor.stddev, this.monitor.mean);
    //   console.log("Checking monitor");
    //   // this.monitor.reset();
    //   // this.monitor.disable();
    //   const h = this.monitor;
    //   h.disable();
    //   console.log(h.min);
    //   console.log(h.max);
    //   console.log(h.mean);
    //   console.log(h.stddev);
    //   console.log(h.percentiles);
    //   console.log(h.percentile(50));
    //   console.log(h.percentile(99));
    // }, 1000);

    // function measureLag(iteration)
    // {
    //   const start = new Date();
    //
    //   globalThis.setTimeout(() =>
    //   {
    //     const lag = new Date() - start;
    //     // console.log(`Loop ${iteration} took\t${lag} ms`)l
    //     measureLag(iteration + 1); // Recurse
    //   });
    // }
    //
    // measureLag(1);

    // this.#last = performance.eventLoopUtilization();
    this.#last = globalThis.performance.now();
    // this.last = globalThis.process.hrtime.bigint();
    this.interval_id = globalThis.setInterval(this.OnEventLoop.bind(this));
  }

  destructor(...args)
  {
    if (this.interval_id)
    {
      globalThis.clearInterval(this.interval_id);
      delete this.interval_id;
    }

    return super.destructor(...args);
  }

  OnEventLoop()
  {
    const current = globalThis.performance.now();
    // const current = globalThis.process.hrtime.bigint();
    const elapsed = current - this.last;

    console.log(elapsed);

    this.last = current;

    // this.monitor.reset();
  }

  OnEventLoop()
  {
    this.#last = performance.eventLoopUtilization(this.#last);
    console.log(this.#last);
  }

  OnEventLoop()
  {
    const current = globalThis.performance.now();
    const elapsed = current - this.#last;
    // console.log(elapsed);
    this.#last = current;
  }

  OnNode(entry)
  {
  }

  OnGC(entry)
  {
    // console.log("OnGC", entry.duration);
  }

  OnFunction(entry){}

  OnHTTP(entry)
  {
    // console.log("OnHTTP", entry);
  }

  OnHTTP2(entry)
  {
    console.log("OnHTTP2", entry);

    const {
      bytesRead,
      bytesWritten,
      id,
      timeToFirstByte,
      timeToFirstByteSent,
      timeToFirstHeader,
    } = entry;
  }

  OnEntry(entry)
  {
    switch (entry.entryType)
    {
      case "node": return this.OnNode(entry);
      case "gc": return this.OnGC(entry);
      case "function": return this.OnFunction(entry);
      case "http2": return this.OnHTTP2(entry);
      case "http": return this.OnHTTP(entry);
      default: super.OnEntry(entry);
    }
  }
}

import {Tag} from "/js/Tag.js";
import {Function} from "/js/Tags/Function.js";
import {Document} from "/js/Tags/Document.js";
import {Progress} from "/js/Tags/Progress.js";
import {P} from "/js/Tags/P.js";
import {Div} from "/js/Tags/Div.js";
import {H3} from "/js/Tags/H3.js";
import {Span} from "/js/Tags/Span.js";
// import {Assertion} from "/js/Utility/Debug/Assertion.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";
import {Environment} from "/js/Environment.js";
import {Connect} from "/js/Event/Connect.js";
import {Promise} from "/js/Promise.js";

// import style from "/js/Tags/Progress.style.js";

export class Profile extends Function
{
  static GetLocalName(){ return "profile"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(...args)
  {
    super(...args).Add(
      new Div().Class("card").Add(
        new Div().Class("card-content").Add(
          new Div().Class("content is-large").Add(
            new Div().Class("columns is-centered is-vcentered").Add(
              new Div().Class("column is-2").Add(
                this.title = new Span().Class("has-text-weight-bold"),
              ),
              new Div().Class("column").Add(
                this.progress = new Progress().Class("progress is-info is-large"),
              ),
            ),
            new Div().Class("columns is-centered is-vcentered").Add(
              new Div().Class("column").Add(
                new Span().Class("has-text-weight-bold").Text("Remaining: "),
                this.remaining = new Span(),
              ),
              new Div().Class("column").Add(
                new Span().Class("has-text-weight-bold").Text("Average: "),
                this.average = new Span(),
              ),
              new Div().Class("column").Add(
                new Span().Class("has-text-weight-bold").Text("Calls: "),
                this.calls = new Span(),
              ),
              new Div().Class("column").Add(
                new Span().Class("has-text-weight-bold").Text("Loops: "),
                this.loops = new Span(),
              ),
              new Div().Class("column").Add(
                new Span().Class("has-text-weight-bold").Text("Sample rate: "),
                this.sample_rate = new Span(),
              ),
            ),
          ),
        ),
        // new Div().Class("card-footer is-size-4 has-text-left").Add(
        //   new Div().Class("card-footer-item").Add(
        //     new Span().Class("has-text-weight-bold").Text("Average: "),
        //     this.average = new Span(),
        //   ),
        //   new Div().Class("card-footer-item").Add(
        //     new Span().Class("has-text-weight-bold").Text("Calls: "),
        //     this.calls = new Span(),
        //   ),
        //   new Div().Class("card-footer-item").Add(
        //     new Span().Class("has-text-weight-bold").Text("Loops: "),
        //     this.loops = new Span(),
        //   ),
        //   new Div().Class("card-footer-item").Add(
        //     new Span().Class("has-text-weight-bold").Text("Sample rate: "),
        //     this.sample_rate = new Span(),
        //   ),
        // ),
      ),
    );
  }

  [Connect](event)
  {
    this.title.Text(this.GetAttribute("name"));
    return super[Connect](event);
  }

  Async(v){ return this.ToggleAttribute("async", v); }

  Calls(calls){ return this.SetAttribute("calls", calls); }
  Timeout(timeout){ return this.SetAttribute("timeout", timeout); }
  Duration(duration){ return this.SetAttribute("duration", duration); }
  Remaining(remaining){ return this.SetAttribute("remaining", Math.max(0, remaining), undefined, "ms"); }
  SampleRate(sample_rate){ return this.SetAttribute("sample_rate", sample_rate); }
  Loops(loops){ return this.SetAttribute("loops", loops); }
  Average(average){ return this.SetAttribute("average", average, undefined, "ns"); }
  Percent(percent){ return this.SetAttribute("percent", percent, undefined, "%"); }

  GetDuration(){ return this.GetAttribute("duration") ?? 1000; }
  GetSamples(){ return this.GetAttribute("samples") ?? 1000; }
  GetRemaining(){ return this.GetAttribute("remaining") ?? 0; }
  GetAverage(){ return this.GetAttribute("average") ?? 0; }

  // Invoke the function
  async Call(...args)
  {
    args.unshift(this);

    const value = this.GetValue();
    if (typeof(value) !== "function")
    {
      throw new Error(`The Profile tag expected to have a function value, but got "${typeof(value)}"`);
    }

    let duration = this.GetAttribute("duration") ?? 1000;
    if (typeof(duration) !== "number")
    {
      throw new Error(`Profile tag expected its duration to be a number in milliseconds`);
    }

    let calls = this.GetAttribute("calls") ?? 0;
    if (typeof(calls) !== "number")
    {
      throw new Error(`Profile tag expected its calls to be a number`);
    }

    const is_async = this.HasAttribute("async");

    // const samples = this.GetSamples();
    // if (typeof(samples) !== "number")
    // {
    //   throw new Error(`Profile tag expected its samples to be a number`);
    // }

    // await PromiseUtilities.AwaitAnimationFrame();
    // await PromiseUtilities.Sleep(1000);
    await PromiseUtilities.AwaitLoaded();

    const total = duration;

    let loops = 0;
    let samples = 1;
    while (duration >= 0)
    {
      await PromiseUtilities.AwaitBackgroundTask();
      // await PromiseUtilities.Sleep(100);

      const start = window.performance.now();

      for (let i = 0; i < samples; i++)
      {
        if (is_async)
        {
          await value.apply(this, args);
        }
        else
        {
          value.apply(this, args);
        }
      }

      const stop = window.performance.now();
      const time = stop - start;
      const percent = (time / total) * 100;

      // await Promise.all();

      // console.log("Percent:", percent, samples);

      // If the current sample size took less than 1% of the total duration
      if (1.0 > percent)
      {
        // Then double the sampling rate
        samples = samples * 2;
      }

      duration -= (stop - start); // Subtract the elapsed time from the duration
      calls += samples; // Add the samples to the iterations
      loops += 1;

      // The average nanoseconds per call
      const average = ((total - duration) / calls) * 1000.0 * 1000.0;

      this.Remaining(duration);
      // this.Percent(percent);
      this.Calls(calls);
      this.SampleRate(samples);
      this.Loops(loops);
      this.Average(average);

      this.Draw();

      await PromiseUtilities.AwaitAnimationFrame();
    }
  }

  *Task(value, ...args)
  {
    for (let i = 0; i < 1000; i++)
    {
      yield value.apply(this, args);
    }
  }

  Sort()
  {
    const prev = this.GetPrevSibling();
    if (!prev || !(prev instanceof this.constructor))
    {
      this.GetParent()?.QuerySort("profile", (a, b) =>
      {
        return a.GetAverage() - b.GetAverage();
      });
    }
  }

  Draw()
  {
    const duration = this.GetDuration();
    const remaining = this.GetRemaining();

    // Update the progress bar
    this.progress.Percent(Math.abs(duration - remaining), duration);
    this.remaining.Text(this.GetAttributeDisplay("remaining"));
    this.average.Text(this.GetAttributeDisplay("average"));
    this.calls.Text(this.GetAttributeDisplay("calls"));
    this.loops.Text(this.GetAttributeDisplay("loops"));
    this.sample_rate.Text(this.GetAttributeDisplay("sample_rate"));

    this.Sort();
  }
}

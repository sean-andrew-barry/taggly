import {Tag} from "/js/Tag.js";
import {Function} from "/js/Tags/Function.js";
import {Document} from "/js/Tags/Document.js";
// import {Assertion} from "/js/Utility/Debug/Assertion.js";
import {Promise} from "/js/Promise.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";
import {Environment} from "/js/Environment.js";
import {window} from "/js/Window.js";
import {IFrame} from "/js/Tags/IFrame.js";

export class Test extends Function
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "test"; }
  static GetIFrame(){ return this.iframe ??= new IFrame().Class("tests_frame"); }

  Load(v){ return this.SetAttribute("load", v); }
  Client(){ return this.Load("client"); } // Only run on the client
  Server(){ return this.Load("server"); } // Only run on the server
  Inline(){ return this.Load("inline"); } // Only run in an iframe

  About(v){ return this.SetAttribute("about", v); }
  Comment(v){ return this.SetAttribute("comment", v); }
  Delay(v){ return this.SetAttribute("delay", v); }
  State(v){ return this.SetAttribute("state", v); }
  Should(v){ return this.SetAttribute("should", v); }
  Timeout(v){ return this.SetAttribute("timeout", v); }
  Duration(v){ return this.SetAttribute("duration", v); }
  Result(v){ return this.SetAttribute("result", v); }
  Live(v){ return this.ToggleAttribute("live", v); }

  GetDelay(){ return this.GetAttribute("delay"); }
  GetState(){ return this.GetAttribute("state"); }

  IsRunning(){ return this.GetState() === "running"; }
  IsPassed(){ return this.GetState() === "passed"; }
  IsFailed(){ return this.GetState() === "failed"; }
  IsTimeout(){ return this.GetState() === "timeout"; }

  Throw(error)
  {
    if (typeof(error) === "string")
    {
      error = new Error(error);
    }

    console.error(`Test "${this.GetName()}" failed!\n\n`, error);
    return this.Result(error.message);
  }

  Assert(value)
  {
    return new Assertion(this, value);
  }

  async Setup()
  {
    // If we're in development mode and not flagged with "live", don't run the test
    if (!this.HasAttribute("live"))
    {
      const doc = Document.Get();
      if (!(await doc.IsDevelopment())) return false;
    }

    let sleep = 0;
    if (this.HasAttribute("delay"))
    {
      sleep = this.GetDelay();
    }

    this.State("queued");

    // return Promise.AddBackgroundTask(this.Run.bind(this));
    await Promise.Sleep(sleep);
    await Promise.Idle();

    // await PromiseUtilities.AwaitBackgroundTask(sleep);
    return true;
  }

  async Call(...args)
  {
    if (this.HasAttribute("state")) return; // Already run

    const setup = await this.Setup();
    if (setup !== true)
    {
      return;
    }

    this.State("running");

    let timeout_id;
    if (this.HasAttribute("timeout"))
    {
      const timeout = this.GetAttribute("timeout");
      timeout_id = globalThis.setTimeout(() =>
      {
        this.State("timeout");
        // console.error(`Test "${this.GetName()}" timed out after ${timeout} ms`);
        this.Throw(new Error(`Test "${this.GetName()}" timed out after ${timeout} ms`));
      }, timeout);
    }

    let start;
    let stop;

    try
    {
      start = globalThis.performance.now();
      const result = await super.Call(...args);
      stop = globalThis.performance.now();

      this.State("passed");
      return result;
    }
    catch (error)
    {
      stop = globalThis.performance.now();

      this.State("failed");
      this.Throw(error);
      throw error; // Pass the error back to the Function's OnConnect
    }
    finally
    {
      if (timeout_id)
      {
        globalThis.clearTimeout(timeout_id);
      }

      // console.log("Test finished after", stop - start);
      this.SetAttribute("ms", stop - start);
    }
  }
}

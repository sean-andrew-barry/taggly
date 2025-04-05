import {Tag} from "/js/Tag.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";
import {Environment} from "/js/Utility/Environment.js";

export class Test extends Tag
{
  static GetLocalName(){ return "test"; }

  constructor(...args)
  {
    super(...args);
    this.result = this.Setup();
  }

  Src(src){ return this.SetAttribute("src", src); }

  Load(v){ return this.SetAttribute("load", v); }
  Client(){ return this.Load("client"); } // Only run on the client
  Server(){ return this.Load("server"); } // Only run on the server
  Inline(){ return this.Load("inline"); } // Only run in an iframe

  // IFrame(url)
  // {
  //   console.log("Running test in IFrame", this.GetNode());
  //   return this.SetAttribute("iframe", url);
  // }

  Immediate(v){ return this.ToggleAttribute("immediate", v); }
  Delay(v){ return this.SetAttribute("delay", v); }
  State(v){ return this.SetAttribute("state", v); }
  Should(v){ return this.SetAttribute("should", v); }
  Timeout(v){ return this.SetAttribute("timeout", v); }
  Duration(v){ return this.SetAttribute("duration", v); }
  Live(v){ return this.ToggleAttribute("live", v); }
  GetDelay(){ return this.GetAttributeNumber("delay") || 100; }

  Call(callback)
  {
    this.Expect(callback).Named("callback").ToBeFunction();
    this.callback = callback;
    return this;
  }

  async Run()
  {
    this.Expect(this.callback).Named("callback").ToBeFunction();
    this.State("running");

    let timeout_id;
    if (this.HasAttribute("timeout"))
    {
      const timeout = this.GetAttributeNumber("timeout");
      timeout_id = window.setTimeout(() =>
      {
        this.State("timeout");
        console.error(`Test "${this.GetClass(0)}" timed out after ${timeout} ms`);
      }, timeout);
    }

    // If the test has a src, navigate to it automatically
    if (this.HasAttribute("src"))
    {
      console.log("Loading src", this.GetAttribute("src"));
      const url = await Tag.Url().Go(this.GetAttribute("src"));
    }

    const start = global.performance.now();
    let stop;

    try
    {
      const result = await this.callback(this);
      stop = global.performance.now();

      this.State("passed");
      // this.Add(result);
    }
    catch (error)
    {
      stop = global.performance.now();

      this.State("failed");
      console.error(`Test "${this.GetClass(0)}" failed!\n\n`, error);
      this.Clear().Add(error);
    }
    finally
    {
      if (timeout_id)
      {
        window.clearTimeout(timeout_id);
      }

      this.SetAttribute("ms", stop - start);
    }

    await PromiseUtilities.Sleep(this.GetDelay());
  }

  async Setup()
  {
    await this.Wait();

    // If it isn't flagged as immediate, wait for any previously declared tests to finish first
    // This allows the tests to run in a specific order
    // NOTE: Is this necessary? Does PromiseUtilities.AddBackgroundTask already ensure this?
    if (!this.HasAttribute("immediate"))
    {
      const prev = this.GetPrevSibling(Test);
      if (prev)
      {
        await prev.Wait();
        await prev.result;
      }
    }

    if (this.HasAttribute("load"))
    {
      const load = this.GetAttribute("load");
      if (load === "client" && !Environment.IsClient()) return;
      if (load === "server" && !Environment.IsServer()) return;
      if (load === "inline" && !Environment.IsInlineFrame()) return;
    }

    // if (this.HasAttribute("development"))
    // {
    //   const config = await Tag.Config().Wait();
    //   if (!(await config.IsDevelopment())) return;
    // }

    // If we're in development mode and not flagged with "live", don't run the test
    if (!this.HasAttribute("live"))
    {
      const config = await Tag.Config().Wait();
      if (!(await config.IsDevelopment())) return;
    }

    this.State("waiting");

    return PromiseUtilities.AddBackgroundTask(this.Run.bind(this));
  }

  GetName(){ return `Test "${super.GetName()}"`; }
}

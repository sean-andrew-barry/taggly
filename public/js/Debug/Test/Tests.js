import {Tag} from "/js/Tag.js";
import {Test, tests} from "/js/Debug/Test.js";
import {Module} from "/js/Module.js";

export class Tests extends Module
{
  async Mute(config)
  {
    if (await config.GetTestsMuteConsoleLog())
    {
      // console.log("Muting console.log()");
      console._log = console.log;
      console.log = function(){};
    }

    if (await config.GetTestsMuteConsoleWarn())
    {
      // console.log("Muting console.warn()");
      console._warn = console.warn;
      console.warn = function(){};
    }

    if (await config.GetTestsMuteConsoleError())
    {
      // console.log("Muting console.error()");
      console._error = console.error;
      console.error = function(){};
    }
  }

  constructor(config)
  {
    super(config);

    if (global.IsInlineFrame())
    {
      this.Mute(config);
    }
  }

  async Run(config)
  {
    const importer = await config.GetDynamicImporter().Wait();

    // console.log("Running tests with a delay of", this.delay);

    for (let i = 0; i < tests.length; i += 2)
    {
      const url  = tests[i + 0];
      const args = tests[i + 1];

      try
      {
        const mod = await importer.Import(url);

        for (const key in mod)
        {
          const ctor = mod[key];

          const test = new ctor(url, args);
          this.tests.push(test);

          if (test instanceof Test)
          {
            await test.Run(config, this.delay);
          }
        }
      }
      catch (error)
      {
        console.error("DynamicImport failed:", error);
      }
      finally
      {
        await global.Sleep(this.pause);
      }
    }

    // console.log("Tests finished");
    // console.log(`${tests.length} tests finished with ${passed.length} passes and ${failed.length} fails.`);
  }

  async Initialize(config, old)
  {
    if (await config.IsDevelopment())
    {
      this.delay = await config.GetTestsDelay();
      this.pause = await config.GetTestsPause();

      this.tests = [];

      if (!global.IsServer() && await config.GetTestsUseInlineFrame())
      {
        if (global.IsInlineFrame())
        {
          this.Run(config);
        }
        else
        {
          this.iframe = Tag.InlineFrame().Src("/").DisplayNone();
          Tag.Body().Add(this.iframe);
        }
      }
      else
      {
        this.Run(config);
      }
    }

    return super.Initialize(config);
  }
}

// global.Test = function(path, ...args)
// {
//   tests.push(path, args);
// }
//
// global.ClientTest = function(...args)
// {
//   if (!global.IsServer()) return global.Test.apply(global, args);
// }
//
// global.ServerTest = function(...args)
// {
//   if (global.IsServer()) return global.Test.apply(global, args);
// }

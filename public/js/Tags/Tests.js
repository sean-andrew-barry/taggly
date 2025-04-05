import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Environment} from "/js/Utility/Environment.js";

export class Tests extends Singleton
{
  constructor(...args)
  {
    super(...args).DisplayNone();

    if (!Environment.IsInlineFrame())
    {
      this.Wait().then(async () =>
      {
        const config = await Tag.Config().Wait();
        if (!(await config.IsDevelopment())) return;

        console.log("Constructing Tests singleton", this.GetNode());

        let src = "/";
        if (this.HasAttribute("src"))
        {
          src = this.GetAttribute("src");
        }

        this.AppendChild(Tag.InlineFrame().Src("/"));
      });
    }
  }

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
}

import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {Loader} from "/js/Loader.js";
import {Index} from "/js/Tags/Page/Index.js";
import {Bundler as Base} from "/js/Tags/Bundler.js?next=/taggly/private/";

export class Bundler extends Base
{
  constructor(...args)
  {
    super(...args);

    // this.GetCode();
  }

  IsEnabled(){ return !Environment.IsDevelopment(); }
  UseRollup(){ return true; }
  UseWebpack(){ return false; }

  async CreateCode()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;

    let code;
    if (await this.UseRollup())
    {
      const {default: StaticCreateRollup} = await import("/js/Tags/Bundler/StaticCreateRollup.js?static=true");

      const entry = Index.GetEntrySpecifier();
      const loader = Loader.Get();
      const domains = ["public"];

      code = await StaticCreateRollup({
        entry,
        loader,
        domains,
      });
    }
    else if (await this.UseWebpack())
    {
      console.warn("Webpack is not implemented in the Bundler");
    }

    return code;
  }

  GetCode(){ return this.code ??= this.CreateCode(); }
}

import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Environment} from "/js/Environment.js";

export class Seeder extends Singleton
{
  async Render()
  {
    const old = Environment.GetCached("seeder");
    const config = await Tag.Config().Wait();

    if (await config.UseSeeder())
    {
    }

    Environment.SetCached("seeder", this);
    return super.Render();
  }
}

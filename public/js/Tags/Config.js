import {Tag} from "/js/Tag.js";
import {Base} from "/js/Tags/Config/Base.js";

export class Config extends Base
{
  IsDevelopment(){ return window.document.location.hostname.endsWith("localhost"); }

  async GetSessionID()
  {
    const cache = await Tag.Head().GetCache();
    await cache.loaded;

    const result = cache.Get(".session", () =>
    {
      const session = Tag.Div("session");

      if (!session.HasAttribute("id"))
      {
        console.log("Session doesn't have an ID, so generating one");

        const array = new Uint32Array(6);
        window.crypto.getRandomValues(array);

        let id = "";
        for (let i = 0; i < array.length; i++)
        {
          id += array[i].toString(16);
        }

        session.ID(id);
      }

      return session;
    });

    return result.GetAttribute("id");
  }

  IsSecure(){ return window.location.protocol === "https:"; }
  GetHost(){ return window.location.host; }
  GetSocketUrl(){ return `${this.IsSecure() ? "wss" : "ws"}://${this.GetHost()}`; }
  UseInlineFrame(){ return false; }
}

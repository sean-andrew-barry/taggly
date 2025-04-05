import {window} from "/js/Window.js";
import {Environment} from "/js/Environment.js";

const GLOBAL_URL = globalThis.URL;

export class Sanitize
{
  static IsProtocolTrusted(url, origin = window.location.href)
  {
    if (!(url instanceof GLOBAL_URL))
    {
      url = new GLOBAL_URL(url, origin);
    }

    switch (url.protocol)
    {
      case "http:":
      case "https:": return true;
      default: return false;
    }
  }

  static URL(url, origin = window.location.href)
  {
    if (Environment.IsServer())
    {
      return url;
    }

    if (!(url instanceof GLOBAL_URL))
    {
      url = new GLOBAL_URL(url, origin);
    }

    if (this.IsProtocolTrusted(url, origin) === true)
    {
      return url;
    }
    else
    {
      // console.warn("Untrusted url protocol of", url.protocol, "set raw to", true, "to override this check");
      // url.origin = window.location.origin;
      // console.log(url);
      // url.pathname = "#";
      // url.protocol = "https:";

      // return url.href;

      // return new GLOBAL_URL("/", window.location.origin);
      return "#";
    }
  }
}

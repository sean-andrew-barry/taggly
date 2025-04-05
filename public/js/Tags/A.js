import {Tag} from "/js/Tag.js";
import {Body} from "/js/Tags/Body.js";
import {URL} from "/js/Utility/URL.js";
import {Environment} from "/js/Utility/Environment.js";
import {History} from "/js/Tags/History.js";
import {console} from "/js/Console.js";

export class A extends Tag
{
  static GetLocalName(){ return "a"; }
  static GetMetaURL(){ return import.meta.url; }

  _HRef(url, base = window.location.origin)
  {
    url = new URL(url, base);
    this.SetAttribute("href", url.toString());

    if (Environment.IsClient())
    {
      if (url.GetOrigin() === window.location.origin)
      {
        this.OnMouseDown(event =>
        {
          url.Preview(true);
          url.Expiration(10000);
          Body.Get().AppendChild(url.Render());
        });

        this.OnMouseUp(event =>
        {
          url.Remove();
        });

        this.OnClick(event =>
        {
          event.preventDefault();

          History.Get().Push(url.GetHRef());

          url.RemoveAttribute("expiration");
          url.Preview(false); // Remove the preview class so it can be displayed

          this.QueryAncestor("url").Replace(url);
          url.ScrollToSmooth();
        });
      }
      else
      {
        // TODO: Add a setting to control behavior on external links, such as a redirect
      }
    }

    return this;
  }
}

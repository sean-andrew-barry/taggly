import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {URL as TagURL} from "/js/Tags/URL.js";
import {URL} from "/js/Utility/URL.js";
import {Redirect} from "/js/Tags/Redirect.js";

export class Location extends Tag
{
  static GetNodeName(){ return "location"; }

  constructor(value)
  {
    super("location", value);
    this.Src(window.location.href);
    this.cache = {};
  }

  LoadSearchParameters(url)
  {
    const variables = url.search.substring(1).split("&");
    const map = {};

    if ((variables.length === 1) && (variables[0] === "")) return map;

    for (let i = 0; i < variables.length; i++)
    {
      const [key, value] = variables[i].split("=");
      map[key] = decodeURIComponent(value);
    }

    return map;
  }

  FindPage(current, url)
  {
    const count = current.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const tag = current.GetChild(i);
      if (!tag) continue;

      if (tag instanceof Url)
      {
        if (!tag.Test(url)) continue;

        url.Next();

        const result = this.FindPage(tag, url);
        if (result) return result;
      }
      else if (tag instanceof Page)
      {
        // url.page = tag;
        url.SetPage(tag);
        url.SetConstructor(tag.GetConstructor());
        // console.log(url.pathname, "matched", tag.GetNode(), tag.GetConstructor().name);
        return url;
      }
      else if (tag instanceof Redirect)
      {
        const unused_parts = url.parts.slice(index);

        // Append any unused url parts to the end of the redirect url
        const redirect = tag.GetAttribute("href") + "/" + unused_parts.join("/");

        console.log("Found a redirect!", redirect);

        const result = this.Search(redirect);
        if (result) return result;
      }
      else
      {
        const result = this.FindPage(tag, url);
        if (result) return result;
      }
    }
  }

  Search(url = this.GetAttribute("src"), base = window.location.origin)
  {
    if (typeof(url) === "string")
    {
      url = new URL(decodeURI(url).toLowerCase(), base);
    }

    const cached = this.cache[url.href];
    if (cached && !cached.IsExpired())
    {
      // console.log("Using cached url", cached);
      return cached;
    }
    else
    {
      const result = this.FindPage(this, url);

      if (result)
      {
        this.cache[result.href] = result;
      }

      return result;
    }
  }
}

import {Tag} from "/js/Tag.js";
import {URL} from "/js/Utility/URL.js";

export class Redirect extends Tag
{
  static GetNodeName(){ return "redirect"; }

  constructor(node, url)
  {
    super(node);
    this.Src(url);
    // this.url = url;
  }

  // Connect()
  // {
  //   this.url = new URL(this.url);
  //   this.Src(this.url.href);
  // }

  Test(url)
  {
    // Append any unused url parts to the end of the redirect url
    const redirect = this.redirect + "/" + url.GetSlice().join("/");

    console.log({ redirect });

    window.app.Redirect(redirect);

    return url.GetTag(0).Test(url.Push(this).Redirect(redirect));
    // return url.GetTag(0).Test(new Url(redirect));
    // return url.GetTag(0).Test(new Url(redirect));
  }
}

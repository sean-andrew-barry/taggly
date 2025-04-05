import {HTML} from "/js/Tags/HTML.js";
import {Head} from "/js/Tags/Head.js";
import {Body} from "/js/Tags/Body.js";
import {Home} from "/js/Tags/HTML/Page/Home.js";
import {Error} from "/js/Tags/HTML/Page/Error.js";
import {URL} from "/js/Utility/URL.js";
import {Environment} from "/js/Utility/Environment.js";
import {Config} from "/js/Tags/Config.js";

const html = window.document.documentElement;
const head = window.document.head;
const body = window.document.body;

// The index document is what picks other documents based on the URL
// It is always the first document that gets constructed on load, then replaces itself
export class Index extends HTML
{
  static GetHTMLNode(){ return html; }
  static GetHeadNode(){ return head; }
  static GetBodyNode(){ return body; }

  static Get(){ return this.GetHTMLNode().tag; }

  SetNode(){ return super.SetNode(html); }

  // constructor()
  // {
  //   super();
  //
  // }

  constructor()
  {
    super();

    console.log("Constructing Index", head, body);

    const head_tag = new Head(head);
    const body_tag = new Body(body);

    head_tag.config = Config.Get();
    head_tag.cache = head_tag.CreateCache(head_tag.config);
    head_tag.dynamic_importer = head_tag.CreateDynamicImporter(head_tag.config);
    head_tag.history = head_tag.CreateHistory(head_tag.config);
    head_tag.database = head_tag.CreateDatabase(head_tag.config);
    head_tag.server = head_tag.CreateServer(head_tag.config);
    head_tag.socket = head_tag.CreateSocket(head_tag.config);
    head_tag.webpack = head_tag.CreateWebpack(head_tag.config);
    head_tag.mailer = head_tag.CreateMailer(head_tag.config);

    head_tag.Render();

    // this.url = new URL(href, base);

    if (Environment.IsClient())
    {
      const tag = this.Parse();
      this.Replace(tag);
    }
    else
    {
    }
  }

  async Render(href = window.location.href, base = window.location.origin)
  {
    const url = new URL(href, base);

    console.log("Index is rendering");
    const result = await this.Find(url, 0);
    console.log("Result:", result);

    if (result instanceof HTML)
    {
      // this.Replace(result);
      // this.Remove();
    }
  }

  Search(url, redirects = [], max_redirects = 10)
  {
    const value = this.Root(url, 0);

    if (typeof(value) === "string")
    {
      redirects.push(url);

      this.HRef(value);
      const new_url = this.GetHRef();

      if (redirects.length >= max_redirects)
      {
        throw new Error(`The maximum number of redirects (${max_redirects}) has been reached`);
      }

      // Make sure it's a different url we are being redirected to
      for (let i = 0; i < redirects.length; i++)
      {
        const redirect = redirects[i];
        if (redirect === new_url)
        {
          throw new Error(`Circular redirect at "${new_url}" from "${current_url}"`);
        }
      }

      return this.Search(redirects, max_redirects);
    }
    else
    {
      return value;
    }
  }

  Parse(href = window.location.href, base = window.location.origin)
  {
    const url = new URL(href, base);
    // console.log("Parsing", url);
    const result = this.Find(url, 0);

    return this.Convert(result);
  }

  Find(url, i = 0)
  {
    switch (url.Part(i))
    {
      // case "redirect": return this.Redirect("/");
      case "": return new Home();
      default: return new Error();
    }
  }
}

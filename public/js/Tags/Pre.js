import {Tag} from "/js/Tag.js";
// import {Import} from "/js/Tags/Import.js";
import {Text} from "/js/Tags/Text.js";
import {BR} from "/js/Tags/BR.js";
import {Connect} from "/js/Event/Connect.js";
import {Load} from "/js/Event/Load.js";
import {StringUtilities} from "/js/Utility/String.js";
import {HTML} from "/js/Parser/HTML.js";
import {CSS} from "/js/Parser/CSS.js";
import {JavaScript} from "/js/Parser/JavaScript.js";
import {Promise as PromiseUtility} from "/js/Promise.js";

export class Pre extends Tag
{
  static GetLocalName(){ return "pre"; }
  static GetMetaURL(){ return import.meta.url; }

  Fetch(src)
  {
    if (src.includes(".js")) this.Type("js");
    else if (src.includes(".html")) this.Type("html");
    else if (src.includes(".css")) this.Type("css");

    return this.Add(
      // Add the promise from fetch so we get the spinner
      window.fetch(src, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      .then(response => response.text())
      .then(text =>
      {
        const tag = new Text(text);

        // Replace the Promise with the text
        this.Text(tag);
        this.Parse();

        // Fire a load event
        new Load(this);

        // const type = this.GetAttribute("type");
        // if (type === "html")
        // {
        //   const parser = new HTML(this);
        //   const result = parser.Begin();
        // }
      }),
    );
  }

  [Connect](event)
  {
  }

  Parse()
  {
    if (!this.HasAttribute("type"))
    {
      return this;
    }

    this.BackgroundColor("#282c34").Color("#828997");

    let parser;
    switch (this.GetAttribute("type"))
    {
      case "js":
      case "javascript":
      {
        parser = new JavaScript(this);
        break;
      }
      case "css":
      {
        parser = new CSS(this);
        break;
      }
      case "html":
      {
        parser = new HTML(this);
        break;
      }
      default:
      {
        console.warn("Unknown type");
      }
    }

    if (parser)
    {
      PromiseUtility.Task(() =>
      {
        const result = parser.Begin();

        if (result)
        {
          // const start = performance.now();
          // const new_lines = result.QueryAll(".NewLine");
          // // console.log(new_lines);
          // for (let i = 0; i < new_lines.length; i++)
          // {
          //   const line = new_lines[i];
          //   line.Replace(new BR());
          // }
          // const end = performance.now();
          // console.log("Line replace took", end - start);
          // result.DisplayNone();

          this.Clear().Add(result);

          // console.log("Done adding div");
        }
      });
    }

    return this;
  }

  Body(fn)
  {
    return this;
  }

  Text(text)
  {
    if (typeof(text) === "function")
    {
      text = StringUtilities.ExtractFunctionBody(text);
      // console.log("Converting function to text", text);
    }

    return super.Text(text);
  }
}

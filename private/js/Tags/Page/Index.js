import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {Error404} from "/js/Tags/Page/Error404.js";
import {Document} from "/js/Tags/Document.js";
// import {URL} from "/js/Tags/URL.js";
import {NoScript} from "/js/Tags/NoScript.js";
import {Script} from "/js/Tags/Script.js";
import {Span} from "/js/Tags/Span.js";
import {Div} from "/js/Tags/Div.js";
import {BR} from "/js/Tags/BR.js";
import {P} from "/js/Tags/P.js";
import {A} from "/js/Tags/A.js";
import {I} from "/js/Tags/I.js";
import {Strong} from "/js/Tags/Strong.js";
import {Meta} from "/js/Tags/Meta.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Link} from "/js/Tags/Link.js";
import {bulma} from "/js/Tags/Bulma.js";
import {Environment} from "/js/Environment.js";
import {Loader} from "/js/Loader.js";

// QUESTION: Should the Index page be public? It does get served to the client after all

// const url = new globalThis.URL(import.meta.url, window.location.origin);
const url = new globalThis.URL(import.meta.url);

export class Index extends Page
{
  static GetLocalName(){ return "index"; }
  static GetMetaURL(){ return import.meta.url; }

  CreatePreload(specifier)
  {
  }

  async CreatePreloads(specifier, domains, entries = new WeakSet())
  {
    const loader = Loader.Get();

    const entry = await loader.Query(specifier, domains);
    if (!entry)
    {
      throw new Error(`Failed to preload specifier "${specifier}" because no entry was found`);
    }

    if (entries.has(entry)) return;
    else entries.add(entry);

    const preloads = [];
    preloads.push(new Link().Rel("preload").RawHRef(specifier).AsScript().ToggleAttribute("crossorigin"));

    for (const spec of entry.GetSpecifiers().keys())
    {
      const results = await this.CreatePreloads(spec, domains, entries);
      if (results) preloads.push.apply(preloads, results);
    }

    return preloads;
  }

  async Render(page = Error404)
  {
    page = await page;
    // const entry_specifier = await this.GetEntrySpecifier();
    // const preloads = await this.CreatePreloads(entry_specifier, ["public"]);
    //
    // console.log(preloads.map(p => p.GetAttribute("href")));

    return this.Clear().Add(
      Tag.Custom("html").Lang("en").Add(
        Tag.Custom("head").Add(
          await this.GetDataScript(),
          await this.GetErrorHandler(),
          await this.GetEntryPoint(),
          await this.GetNoModuleEntryPoint(),
          await page.CreateMetadata(),
          // new Div().Class("preloads").Add(
          //   ...preloads,
          // ),
        ),
        Tag.Custom("body").Add(
          await this.GetLoader(),
          await this.GetNoScriptWarning(),
        ),
      ),
    );
  }

  // static CreateStyles()
  // {
  //   return new Fragment().Add(
  //     bulma,
  //     new Link().Stylesheet().RawHRef(`https://cdn.jsdelivr.net/npm/bulma-pageloader@0.3.0/dist/css/bulma-pageloader.min.css`),
  //   );
  // }

  GetLoader()
  {
    return new Fragment().Add(
      new Div("pageloader is-light is-active").ZIndex("1").ID("loader").Add(
        new Span("title is-size-5 has-text-centered").Add(
          new Strong().Add(
            new Span().Text("Loading..."),
          ),
        ),
      ),
    );
  }

  GetNoScriptWarning()
  {
    return new NoScript().Add(
      new Div("modal is-active").Add(
        new Div("modal-content columns").Add(
          new Div("column is-narrow").Add(
            new Div("notification is-danger has-text-centered is-size-5").PaddingRight("1.25rem").Add(
              new P("is-size-4").Add(
                new Span("icon is-large").Add(
                  new I("icon-warning"),
                ),
                new Span().Text("Sorry! Your browser has JavaScript disabled."),
                new BR(),
                new P().Text("This website requires JavaScript to work."),
                new P().Text("Please enable it and reload this page."),
                new BR(),
                new A("button is-danger is-medium is-inverted is-outlined is-fullwidth").RawHRef("/").Add(
                  new Span("icon is-large").Add(
                    new I("icon-spinner11"),
                  ),
                  new Span("is-hidden-mobile").Text("Click here to reload this page"),
                  new Span("is-hidden-tablet").Text("Reload"),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  GetErrorHandler()
  {
    return new Script().RawSrc(`/js/Browser/ErrorHandler.js`);
  }

  GetEntryPoint()
  {
    return new Script().RawSrc(`/js/Start.js${url.search ?? ""}`).Type("module");
  }

  static GetEntrySpecifier()
  {
    return `/js/Start.js${url.search ?? ""}`;
  }

  GetEntrySpecifier()
  {
    return `/js/Start.js${url.search ?? ""}`;
  }

  GetEntryPoint()
  {
    const entry = `/js/Start.js${url.search ?? ""}`;
    console.log(`Entry point is:`, entry);

    function ErrorHandler()
    {
      try
      {
        const element = document.createElement("script");
        element.language = "javascript";
        element.type = "text/javascript";
        element.defer = true;
        element.text = "try{callingAnonymousMethod();} catch(ex) {alert('error caught');}";
        const head = document.getElementsByTagName("head")[0];
        head.appendChild(element);
      }
      catch(err)
      {
        alert("error caught");
      }
    }

    return new Script().Type("module").Text([
      `console.log("Entry point is:", "${entry}");`,
      // `import("${entry}")`,
      // `.then(mod => console.log("Finished loading"))`,
      // `.catch(error => console.error("Failed to load", error))`,
    ].join("\n"));
  }

  GetData()
  {
    return Environment.GetData();
  }

  async GetDataScript()
  {
    const data = await this.GetData();

    if (data)
    {
      return new Script().ID(Environment.GetDataID()).Type("application/json").Text(
        // JSON.stringify(data, undefined, 2),
        JSON.stringify(data),
      );
    }
  }

  GetEntryPoint()
  {
    const entry = this.GetEntrySpecifier();

    // return new Script().RawSrc(`/js/Start.js${url.search ?? ""}`).Type("module");
    return new Script().RawSrc(entry).Type("module");
  }

  GetNoModuleEntryPoint()
  {
    return new Script().RawSrc(`/js/Browser/NoModule.js${url.search ?? ""}`).SetAttribute("nomodule");
  }

  GetHTML()
  {
    return "<!DOCTYPE html>\n" + this.GetInnerHTML();
  }
}

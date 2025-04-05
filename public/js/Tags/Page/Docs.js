import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {Div} from "/js/Tags/Div.js";
import {Section} from "/js/Tags/Section.js";
import {P} from "/js/Tags/P.js";
import {Nav} from "/js/Tags/Nav.js";
import {Link} from "/js/Tags/Link.js";
import {Span} from "/js/Tags/Span.js";
import {Img} from "/js/Tags/Img.js";
import {A} from "/js/Tags/A.js";
import {I} from "/js/Tags/I.js";
import {H1} from "/js/Tags/H1.js";
import {H2} from "/js/Tags/H2.js";
import {H3} from "/js/Tags/H3.js";
import {H4} from "/js/Tags/H4.js";
import {H5} from "/js/Tags/H5.js";
import {H6} from "/js/Tags/H6.js";
import {Pre} from "/js/Tags/Pre.js";
import {Em} from "/js/Tags/Em.js";
import {OL} from "/js/Tags/OL.js";
import {UL} from "/js/Tags/UL.js";
import {LI} from "/js/Tags/LI.js";
import {Strong} from "/js/Tags/Strong.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Form} from "/js/Tags/Form.js";
import {Input} from "/js/Tags/Input.js";
import {Label} from "/js/Tags/Label.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";
import {Number} from "/js/Tags/Number.js";
import {Template} from "/js/Tags/Template.js";
import {Code} from "/js/Tags/Code.js";
import {Button} from "/js/Tags/Button.js";
import {Aside} from "/js/Tags/Aside.js";
import {StringUtilities} from "/js/Utility/String.js";
import {bulma} from "/js/Tags/Bulma.js";

import {Session} from "/js/Tags/Storage/Session.js";
import {MouseOver} from "/js/Event/MouseOver.js";
import {MouseOut} from "/js/Event/MouseOut.js";
import {Click} from "/js/Event/Click.js";

import * as Tags from "/js/Tags.js";

// const FIRST = import("/js/Tags/Page/Docs/Introduction.js");
const PAGES = Symbol("pages");

// const styles = new Style("docs_styles").SetAttribute("file", import.meta.url).Inject("head");

class BlueCode extends Code
{
  static GetMetaURL(){ return import.meta.url; }

  constructor(...args)
  {
    super(...args)
    .AddClass(this.GetHash())
    .DisplayInlineBlock()
    .Padding("0 0.6em")
    .Margin("0")
    .BackgroundColor("#9980fa1a")
    .FontWeight("600")
    .FontFamilyMonoSpace()
    .Color("#9980fa")
    .FontFeatureSettings(`"tnum" 1`)
    .BorderRadius("2px")
    .TransitionProperty("background-color")
    .TransitionDuration("0.5s")
    ;
  }

  SetBackgroundColorAll(color)
  {
    const text = this.GetText();

    for (const code of this.QueryAncestor("url").GetElementsByClass(this.GetHash()))
    {
      if (code.GetText() === text)
      {
        code.BackgroundColor(color);
      }
    }
  }

  [MouseOver](event)
  {
    this.SetBackgroundColorAll("#9980fa4d");
  }

  [MouseOut](event)
  {
    // this.SetBackgroundColorAll("#9980fa1a");
    this.SetBackgroundColorAll();
  }
}

class SectionLink extends A
{
  constructor(...args)
  {
    super(...args)
    .PositionAbsolute()
    .Margin("1em -1.7em")
    .FontSize("1.5em")
    .Color("#6e9987")
    .TextDecorationNone();
  }
}

export class Docs extends Page
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "docs"; }
  static GetSiteName(){ return "Docs"; }
  static GetURL(...parts){ return super.GetURL(Docs.GetLocalName(), ...parts); }
  static GetNext(){}

  static URL(...parts){ return super.URL({ name: "docs" }, ...parts); }
  static URL(...parts){ return super.URL(/docs/i, ...parts); }

  static Match(url){ return super.Match(url)?.IfMatch("docs"); }
  // static Match(url)
  // {
  //   const result = super.Match(url);
  //   console.log("Docs match result", result, result.IsString);
  //   return result?.IsString("docs");
  //
  //   // return super.Match(url)?.IsString("docs");
  // }

  static _RegisterPage(page, index)
  {
    if (typeof(index) === "number")
    {
      PAGES.splice(index, 0, page);
    }
    else
    {
      PAGES.push(page);
    }

    return this;
  }

  static Root(url, index)
  {
    switch (url.GetPart(index))
    {
      case "": return this;
      case "introduction": return import("/js/Tags/Page/Docs/Introduction.js");
      case "the-file-system": return import("/js/Tags/Page/Docs/TheFileSystem.js");
    }
  }

  async *ForPages()
  {
    yield (await import("/js/Tags/Page/Docs/Introduction.js")).Introduction;
    yield (await import("/js/Tags/Page/Docs/TheFileSystem.js")).TheFileSystem;
    yield (await import("/js/Tags/Page/Docs/CreatingYourOwnFiles.js")).CreatingYourOwnFiles;
    yield (await import("/js/Tags/Page/Docs/UsingTags.js")).UsingTags;
    yield (await import("/js/Tags/Page/Docs/UsingEvents.js")).UsingEvents;
  }

  GetDocsStyles(){ return styles; }

  constructor(...args)
  {
    super(...args);

    return this.Render();
  }

  RenderHeadNavBar()
  {
    return new Nav().Class("navbar").Add(
      new Div().Class("container").Add(
        new Div().Class("navbar-brand").Add(
          new A().Class("navbar-item").HRef("/").Add(
            new Img().Src("https://bulma.io/images/bulma-type-white.png").Alt("logo"),
          ),
        ),
        new Div().Class("navbar-menu").ID("navbarMenuHeroA").Add(
          new Div().Class("navbar-end").Add(
            new A().Class("navbar-item is-active").HRef("/").Text("Home"),
            new A().Class("navbar-item").HRef("/examples").Text("Examples"),
            new A().Class("navbar-item").HRef("/documentation").Text("Documentation"),
            new Span().Class("navbar-item").Add(
              new A().Class("button is-primary is-inverted").Add(
                new Span().Class("icon").Add(
                  new I().Class("fab fa-github"),
                ),
                new Span().Text("Download"),
              ),
            ),
          ),
        ),
      ),
    );
  }

  RenderHead(...tags)
  {
    return new Div().Class("hero-head").Add(
      this.RenderHeadNavBar.bind(this),
      ...tags,
    );
  }

  RenderBody(...tags)
  {
    return new Div().Class("hero-body").Add(
      ...tags,
    );
  }

  RenderFoot(...tags)
  {
    return new Div().Class("hero-foot").Add(
      ...tags,
    );
  }

  GetSessionValue(key)
  {
    const session = Session.Get();
    return session.Get(key);
  }

  GetRootFilePathID(){ return Docs.UID("root_file_path"); }
  GetTagglyFilePathID(){ return Docs.UID("taggly_file_path"); }
  GetWebsiteNameID(){ return Docs.UID("website_name"); }

  GetRootFilePath()
  {
    return this.GetSessionValue(this.GetRootFilePathID())?.replace(/^\/|\/$/g, "")
        ?? "C:/Users/User/Documents/";
  }

  GetTagglyFilePath()
  {
    return this.GetSessionValue(this.GetTagglyFilePathID())?.replace(/^\/|\/$/g, "")
        ?? "C:/Users/User/Documents/node_modules/taggly";
  }

  GetWebsiteName()
  {
    return this.GetSessionValue(this.GetWebsiteNameID())
        ?? "MyWebsite";
  }

  RenderPanelBlock(text)
  {
    return A.Class("panel-block").Add(
      Span.Class("panel-icon").Add(
        I.Class("fas fa-book").AriaHidden("true"),
      ),
      text,
    );
  }

  ToggleButton(callback)
  {
    return new Button().Class("button is-info is-outlined").On("click", (event, self) =>
    {
      self.ToggleClass("is-outlined");
    });
  }

  async ForEachPage(callback)
  {
    let current = Tags.Introduction;
    while (current)
    {
      callback(current);
      current = await current.GetNext();
    }
  }

  RenderPanelSearch()
  {
    return Input.Class("input is-large")
    .Type("text")
    .Placeholder("Search")
    .On("input", async (event, self) =>
    {
      const text = self.GetValue();
      console.log("Searching for", text);

      // const pages = [];
      // const properties = [];
      //
      // await this.ForEachPage(page =>
      // {
      //   pages.push(page);
      //
      //   const string = page.toString();
      //   let names = Object.getOwnPropertyNames(page);
      //   // const names = [...Object.getOwnPropertyNames(page), ...Object.getOwnPropertyNames(Object.getPrototypeOf(page))];
      //
      //   for (let i = 0; i < names.length; i++)
      //   {
      //     const name = names[i];
      //     const value = page[name];
      //
      //     if (typeof(value) === "function")
      //     {
      //       properties.push(name);
      //       // properties.push(value);
      //     }
      //   }
      //
      //   // const proto = Object.getPrototypeOf(page);
      //   const proto = page.prototype;
      //   const proto_names = Object.getOwnPropertyNames(proto);
      //
      //   for (let i = 0; i < proto_names.length; i++)
      //   {
      //     const name = proto_names[i];
      //     const value = proto[name];
      //
      //     if (typeof(value) === "function")
      //     {
      //       properties.push(name);
      //       // properties.push(value);
      //     }
      //   }
      //
      //   // const distance = StringUtilities.DiceCoefficient(string, text);
      //   // console.log(page.name, distance);
      // });
      //
      // console.log(pages);
      // console.log(properties);
      //
      // const sorted_pages = StringUtilities.SortMatch(text, ...pages);
      // console.log("Sorted pages:", sorted_pages);
      //
      // const sorted_properties = StringUtilities.SortMatch(text, ...properties);
      // console.log("Sorted properties:", sorted_properties);
    });
  }

  RenderPanel()
  {
    return Nav.Class("panel")
    .PositionRelative()
    .Add(
      new Div()
      .PositionSticky()
      .Top("0")
      .Left("0")
      .Add(
        this.Content()
        .Add(
          P.Class("panel-heading").Add("Docs"),

          // Div.Class("panel-block").Add(
          //   P.Class("control").Add(
          //     this.RenderPanelSearch(),
          //
          //     Span.Class("icon is-left").Add(
          //       I.Class("fas fa-search").AriaHidden("true"),
          //     ),
          //   ),
          // ),

          // Div.Class("panel-block").Add(
          //   Div.Class("buttons are-small").Add(
          //     this.ToggleButton().Text("Classes"),
          //     this.ToggleButton().Text("Methods"),
          //   ),
          // ),
          //
          // Div.Class("panel-block").Add(
          //   new Button().Class("button is-primary is-outlined is-fullwidth is-medium").Text("Reset"),
          // ),

          // P.Class("panel-tabs").Add(
          //   A.Class("is-active").Text("All"),
          //   A.Text("Public"),
          //   A.Text("Private"),
          //   A.Text("Sources"),
          //   A.Text("Forks"),
          // ),

          async fn =>
          {
            for (const page of await this.GetPages())
            {
              fn.Append(
                A.Class("panel-block").HRef(page.GetURL()).Append(
                  Span.Class("panel-icon").Append(
                    I.Class("fas fa-book").AriaHidden("true"),
                  ),
                  page.GetTitle(),
                ),
              );
            }
          },
        ),
      ),
    );
  }

  RenderHeroHead()
  {
    return new Div().Class("hero-head").Add(
      // new Nav().Class("navbar").Add(
      //   new Div().Class("container").Add(
      //     new Div().Class("navbar-brand").Add(
      //       new A().Class("navbar-item").HRef("/").Add(
      //         new Img().Src("https://bulma.io/images/bulma-type-white.png").Alt("logo"),
      //       ),
      //     ),
      //     new Div().Class("navbar-menu").ID("navbarMenuHeroA").Add(
      //       new Div().Class("navbar-end").Add(
      //         new A().Class("navbar-item is-active").HRef("/").Text("Home"),
      //         new A().Class("navbar-item").HRef("/examples").Text("Examples"),
      //         new A().Class("navbar-item").HRef("/documentation").Text("Documentation"),
      //         new Span().Class("navbar-item").Add(
      //           new A().Class("button is-primary is-inverted").Add(
      //             new Span().Class("icon").Add(
      //               new I().Class("fab fa-github"),
      //             ),
      //             new Span().Text("Download"),
      //           ),
      //         ),
      //       ),
      //     ),
      //   ),
      // ),
    );
  }

  RenderHeroBody(...tags)
  {
    return new Div().Class("hero-body").Add(
      this.Section().Add(
        this.Container().Add(
          this.Content().Add(
            // this.Title(),
            // this.Subtitle(),
            ...tags,
          ),
        ),
      ),
    );
  }

  RenderHeroFoot()
  {
    return new Div().Class("hero-foot").Add(
      this.Section().Add(
        this.Container().Add(
          new Div().Class("buttons is-centered").Add(
            this.GetPrev(),
            this.GetHome(),
            this.GetNext(),
          ),
          // new Div().Class("columns is-centered is-vcentered").Add(
          //   new Div().Class("column is-3").Add(
          //     this.GetPrev(),
          //   ),
          //   new Div().Class("column"),
          //   new Div().Class("column is-3").Add(
          //     this.GetNext(),
          //   ),
          // ),
        ),
      ),
    );
  }

  Render(...tags)
  {
    return this.DisplayBlock().Add(
      bulma,
      this.Hero()?.Add(
        this.RenderPanel()?.GridArea("panel"),
        this.RenderHeroHead()?.GridArea("head"),
        this.RenderHeroBody(...tags)?.GridArea("body"),
        this.RenderHeroFoot()?.GridArea("foot"),
      ),
    );
  }

  Render(...tags)
  {
    return this.DisplayBlock().Add(
      // bulma,
      this.Hero()?.Add(
        this.RenderPanel()?.GridArea("panel"),
        this.RenderHeroHead()?.GridArea("head"),
        this.RenderHeroBody(...tags)?.GridArea("body"),
        this.RenderHeroFoot()?.GridArea("foot"),
      ),
    );
  }

  Hero()
  {
    return new Section()
    .Class("hero")
    .MinHeight("100vh")
    .DisplayGrid()
    .JustifyContent("stretch")
    // .PositionRelative()
    .GridTemplateColumns("15% auto")
    .GridTemplateRows("50px 1fr auto")
    .GridTemplateAreas([
      "panel head",
      "panel body",
      "panel foot",
    ]);
  }

  Section(){ return new Section("section"); }
  Container(){ return new Div("container"); }
  Content(){ return new Div("content is-large"); }
  Button(){ return new A("button is-primary is-large"); }
  Code(){ return new BlueCode(); }
  Pre(){ return new Pre(); }
  Note(){ return new Aside().Blue(); }
  Example(){ return new P(); }
  C(strings, ...values){ return this.Code().TL(strings, ...values); }
  B(strings, ...values){ return new Strong().TL(strings, ...values); }
  I(strings, ...values){ return new Em().TL(strings, ...values); }
  BI(strings, ...values){ return new Strong().Add(new Em().TL(strings, ...values)); }
  H2(){ return new H2().FontSize("4em").LineHeight("1.1em").Margin("1em 0 0").FontWeight("900"); }

  Title()
  {
    return new H2("title")
    .FontSize("4em")
    .LineHeight("1.1em")
    // .MarginTop("1em")
    .FontWeight("900")
    .LetterSpacing("-.022em");
  }

  SubTitle()
  {
    return new H3("title")
    .FontSize("2.5em")
    .LineHeight("1.1em")
    .FontWeight("900")
    .LetterSpacing("-.022em");
  }

  MiniTitle()
  {
    return new H4("title")
    .FontSize("1.5em")
    .LineHeight("1.1em")
    .FontWeight("900")
    .LetterSpacing("-.022em");
  }

  MicroTitle()
  {
    return new H5("title")
    .FontSize("1.25em")
    .LineHeight("1.1em")
    .FontWeight("900")
    .LetterSpacing("-.022em");
  }

  GetTitle(title){ return title && new H1("title").Text(title); }
  GetSubtitle(subtitle){ return subtitle && new H3("subtitle").Text(subtitle); }

  async FindPageOffset(offset = 1)
  {
    const pages = await this.GetPages();

    for (let i = 0; i < pages.length; i++)
    {
      if (this instanceof pages[i])
      {
        return pages[i + offset];
      }
    }
  }

  async GetNext(href)
  {
    const next = await this.FindPageOffset(1);

    if (next) return this.Button().HRef(next.GetURL()).Text("Next");
    else return this.Button().Disabled(true).Text("Next");
  }

  GetHome(href = "/docs")
  {
    if (href) return this.Button().HRef(href).Text("Home");
    else return this.Button().Disabled(true).Text("Home");
  }

  async GetPrev(href)
  {
    const prev = await this.FindPageOffset(-1);

    if (prev) return this.Button().HRef(prev.GetURL()).Text("Prev");
    else return this.Button().Disabled(true).Text("Prev");
  }

  async CreatePages()
  {
    const pages = [];
    let page = Tags.Introduction;
    while (page)
    {
      pages.push(page);
      page = await page.GetNext();
    }

    return pages;
  }

  GetPages(){ return this[PAGES] ??= this.CreatePages(); }

  get taggly(){ return this.Code().Text(`Taggly`); }
  get loader(){ return this.Code().Text(`Loader`); }
  get root_path(){ return "C:/Users/User/Documents/"; }
  get website(){ return "MyWebsite"; }
  get node(){ return this.Code().Text("Node"); }
  get first_file(){ return this.Code().Text("Docs"); }
  get public(){ return this.Code().Text("public"); }
  get private(){ return this.Code().Text("private"); }
  get import(){ return this.Code().Text("import"); }
  get development(){ return this.Code().Text("development"); }
  get specifier(){ return "/js/Tags/Page/Docs.js"; }
  get specifier_code(){ return this.Code().Text(this.specifier); }

  get refresh()
  {
    return new A().Text("refresh").TextDecorationLineUnderline().On(Click, e =>
    {
      window.location.reload();
    });
  }

  get sample_1(){ return this.Code().Text("GetSample1()"); }
  get sample_2(){ return this.Code().Text("GetSample2()"); }
  get sample_3(){ return this.Code().Text("GetSample3()"); }

  GetSample1(){}
  GetSample2(){}
  GetSample3(){}
}

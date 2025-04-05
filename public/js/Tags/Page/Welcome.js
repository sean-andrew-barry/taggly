import {Tag} from "/js/Tag.js";
import {Page} from "/js/Tags/Page.js";
import {Docs} from "/js/Tags/Page/Docs.js";
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
import {Code as CodeBase} from "/js/Tags/Code.js";
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
import {MediaQuery} from "/js/Tags/MediaQuery.js";
import {KeyFrames} from "/js/Tags/KeyFrames.js";
import {Number} from "/js/Tags/Number.js";
import {Template} from "/js/Tags/Template.js";
import {BR} from "/js/Tags/BR.js";
import {StringUtilities} from "/js/Utility/String.js";
import bulma from "/js/Tags/Bulma.js";
import {OnConnect} from "/js/Tags/Event/OnConnect.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";

const url = new URL(import.meta.url);

const SAMPLE_1 = `
import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=MyWebsite";

export class Welcome extends Base
{
  GetSample1()
  {
    return "Hello world!";
  }
}
`;

import {OnMouseOver} from "/js/Tags/Event/OnMouseOver.js";
import {OnMouseOut} from "/js/Tags/Event/OnMouseOut.js";
import {OnInput} from "/js/Tags/Event/OnInput.js";
import {OnClick} from "/js/Tags/Event/OnClick.js";

export class Code extends CodeBase
{
  [OnMouseOver](event)
  {
    const text = this.GetText();
    for (const tag of Code.QueryAll(`code`))
    {
      if (tag.GetText() === text)
      {
        tag.AddClass("welcome_highlight");
      }
    }
  }

  [OnMouseOut](event)
  {
    const text = this.GetText();
    for (const tag of Code.QueryAll(`code`))
    {
      if (tag.GetText() === text)
      {
        tag.RemoveClass("welcome_highlight");
      }
    }
  }
}

export class WebsiteNameInput extends Input
{
  [OnInput](event)
  {
    const text = this.GetValue();

    for (const tag of Tag.QueryAll(".website_name"))
    {
      tag.Text(text);
    }

    return super[OnInput](event);
  }
}

export class FilePathInput extends Input
{
  [OnInput](event)
  {
    const text = this.GetValue();

    for (const tag of Tag.QueryAll(".root_path"))
    {
      tag.Text(text);
    }

    return super[OnInput](event);
  }
}

let style;

// Style.Get().Add(
//   // new CSS("code:hover").BackgroundColor("#eadfdf"),
//   // new CSS("code").Add(
//   //   new CSS(".taggly, .node").BackgroundColor("#eadfdf"),
//   // ),
//   // new CSS("code.taggly, code.node, code.node_modules, code.package").BackgroundColor("#eadfdf"),
//   new CSS("code.welcome_highlight").BackgroundColor("#eadfdf"),
//   // new CSS("code.welcome_highlight").Outline("solid"),
// );

export class Welcome extends Docs
{
  static GetTitle(){ return "Welcome"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "welcome"; }

  Div(){ return new Code().Text("Div"); }
  Import(){ return new Code().Text("import"); }
  Layers(){ return new Code().Text("layers"); }
  Layer(){ return new Code().Text("layer"); }
  Domains(){ return new Code().Text("domains"); }
  Domain(){ return new Code().Text("domain"); }
  Public(){ return new Code().Text("public"); }
  Private(){ return new Code().Text("private"); }
  JS(){ return new Code().Text("js"); }
  Tags(){ return new Code().Text("Tags"); }
  Page(){ return new Code().Text("Page"); }
  Welcome(){ return new Code().Text("Welcome.js"); }
  Specifier(){ return new Code().Text(this.SpecifierPath()); }
  Sample1Code(){ return new Pre().Text(SAMPLE_1.trim()); }
  Sample1(){ return new Code().Text("GetSample1()"); }
  Sample2(){ return new Code().Text("GetSample2()"); }
  HelloWorld(){ return new Code().Text(`"${this.GetSample1() ?? "Hello world!"}"`); }

  GetWebsitePath(){ return this.file_path_input?.GetValue().replace(/^\/|\/$/g, ""); }
  GetTagglyPath(){ return this.taggly_file_path_input?.GetValue().replace(/^\/|\/$/g, ""); }

  RootPath()
  {
    return new Span().Class("root_path").Text(this.file_path_input?.GetValue().replace(/^\/|\/$/g, "") ?? `C:/Users/Sean/Documents/`);
  }

  SpecifierPath(){ return `/js/Tags/Page/Welcome.js`; }

  Website()
  {
    return new Span().Class("website_name").Text(this.website_name_input?.GetValue().replace(/^\/|\/$/g, "") ?? "MyWebsite");
  }

  CtrlQ(){ return new Code().Text("ctrl-q"); }
  Next(){ return new Code().Text("next"); }

  FullPathPublic()
  {
    return new Code().OverflowWrapBreakWord().WhiteSpacePreLine().Add(
      this.RootPath(),
      this.Website(),
      "/",
      new Strong().Text(`public`),
      this.SpecifierPath(),
    );
  }

  FullPathPrivate()
  {
    return new Code().OverflowWrapBreakWord().WhiteSpacePreLine().Add(
      this.RootPath(),
      this.Website(),
      "/",
      new Strong().Text(`private`),
      this.SpecifierPath(),
    );
  }

  FrameworkFullPathPublic()
  {
    return new Code().OverflowWrapBreakWord().WhiteSpacePreLine().Add(
      this.RootPath(),
      this.Website(),
      "/node_modules/taggly/",
      new Strong().Text(`public`),
      this.SpecifierPath(),
    );
  }

  FrameworkFullPathPrivate()
  {
    return new Code().OverflowWrapBreakWord().WhiteSpacePreLine().Add(
      this.RootPath(),
      this.Website(),
      "/node_modules/taggly/",
      new Strong().Text(`private`),
      this.SpecifierPath(),
    );
  }

  GetSample1(){}
  GetSample2(){}

  GetSample2Code()
  {
    const name = this.GetSample2.name;
    const class_string = this.constructor.toString();
    const regex = new RegExp(`\\n\\r\\n(\\s+)${name}`, "g");

    console.log(regex);

    let white_space = "";
    const whitespace = class_string.replace(regex, (match, p1, offset) =>
    {
      white_space = p1;
      console.log("Matched", {match, p1, offset});
    });
    // console.log(string);
    //
    // const start = string.indexOf("GetSample2");
    // if (start !== -1)
    // {
    //   const sub
    // }
    const string = this.GetSample2.toString();
    // const string = this.GetSample2 + "";
    const padding = string.substring(0, string.length - string.trimStart().length);
    console.log(`Padding is "${padding}"`);

    // return string;
    const lines = string.split("\n");
    console.log(lines);

    return lines.map(l => l.replace(white_space, "")).join("\n");
    // return lines.map(l => l.trim()).join("\n");
  }

  GetSample2Code()
  {
    return StringUtilities.ExtractFunctionBody(this.GetSample2);
  }

  get layers(){ return new Code().Text("layers"); }
  get layer(){ return new Code().Text("layer"); }
  get tag(){ return new Code().Text(`Tag`); }
  get taggly(){ return new Code().Text(`Taggly`); }
  get loader(){ return new Code().Text(`Loader`); }
  get import(){ return new Code().Text(`import`); }
  get import_welcome(){ return new Code().Text(`import {Welcome} from "/js/Tags/Page/Welcome.js";`); }
  get not(){ return new Strong().Text("not"); }
  get next(){ return new Code().Text("next"); }
  get welcome(){ return new Code().Text("Welcome.js"); }
  get specifier(){ return new Code().Text(this.SpecifierPath()); }
  get domains(){ return new Code().Text("domains"); }
  get domain(){ return new Code().Text("domain"); }
  get public(){ return new Code().Text("public"); }
  get private(){ return new Code().Text("private"); }
  get node(){ return new Code().Text("Node.js"); }
  get node_modules(){ return new Code().Text("node_modules"); }
  get package_json(){ return new Code().Text("package.json"); }
  get js(){ return new Code().Text("js"); }
  get tags(){ return new Code().Text("Tags"); }
  get page(){ return new Code().Text("Page"); }
  get div_specifier(){ return Code.Text(this.div_specifier_string); }
  get div_specifier_string(){ return `/js/Tags/Div.js`; }
  get import_div_text(){ return Code.TL`import {Div} from ${this.div_specifier};`; }
  get import_div_block(){ return Pre.TL`${this.import_div_text}`; }
  get div(){ return new Code().Text("Div"); }
  get dom(){ return new Code().Text("DOM"); }
  get node(){ return new Code().Text("Node"); }
  get example_3(){ return new Code().Text("Example3"); }

  get root_path(){ return new Span().Class("root_path").Text(this.GetWebsitePath()); }
  // get taggly_layer_path(){ return Code.TL`${this.root_path}`; }
  get specifier_path(){ return `/js/Tags/Page/Welcome.js`; }
  get website(){ return this.Website(); }
  get refresh()
  {
    return new A().Text("refresh").OnClick(e =>
    {
      window.location.reload();
    });
  }
  get add(){ return Code.TL`Add`; }
  get text(){ return Code.TL`Text`; }
  get tl(){ return Code.TL`TL`; }

  CreatePath(subpath, domain, specifier)
  {
    return new Code().OverflowWrapBreakWord().WhiteSpacePreLine().Add(
      this.RootPath(),
      this.Website(),
      subpath,
      "/",
      new Strong().Text(domain),
      specifier,
    );
  }

  // Section(...tags)
  // {
  //   return new Div().Class("content is-medium").Add(
  //     ...tags,
  //   );
  // }

  Section(...tags)
  {
    return new Section("section").Add(
      new Div().Class("container").Add(
        new Div().Class("content is-medium").Add(
          ...tags,
        ),
      ),
    );
  }

  SubSection(...tags)
  {
    return new Section("sub-section").Add(
      ...tags,
    );
  }

  RenderTextField(name, label, value, selector)
  {
    return new Div().Class("field").Add(
      label && new Label().Class("label is-medium").Text(label),
      new Div().Class("control").Add(
        this[name] ??=
        new Input()
        .Class("input is-medium")
        .TypeText()
        .Value(value)
        .ID(this.UID(name))
        .OnInput(event =>
        {
          const text = this.GetValue();

          for (const tag of Tag.QueryAll(selector))
          {
            tag.Text(text);
          }
        }),
      ),
    );
  }

  Introduction()
  {
    return this.Section(
      new H1().Class("title").Text("Welcome to Taggly"),
      new H3().Class("subtitle").Text("Ready to get started?"),

      new Form().Add(
        P.TL`This is completely optional, but if you want to, you can use these fields to customize what values will be displayed throughout this guide. These values are private and never leave your computer.`,

        this.RenderTextField("file_path_input", "What's your file path?", "C:/Users/User/Documents/", ".root_path"),
        this.RenderTextField("taggly_file_path_input", "Where is Taggly installed?", "C:/Users/User/Documents/node_modules/taggly", ".taggly_path"),
        this.RenderTextField("website_name_input", "What's the name of your website?", "MyWebsite", ".website_name"),

        // new Div().Class("field").Add(
        //   new Label().Class("label is-medium").Text(`What's your file path?`),
        //   new Div().Class("control").Add(
        //     this.#file_path_input ??=
        //     new FilePathInput()
        //     .Class("input is-medium")
        //     .TypeText()
        //     .Value("C:/Users/User/Documents/")
        //     .ID(this.UID("file_path_input")),
        //   ),
        // ),
        //
        // new Div().Class("field").Add(
        //   new Label().Class("label is-medium").Text(`What's the name of your website?`),
        //   new Div().Class("control").Add(
        //     this.#website_name_input ??=
        //     new WebsiteNameInput()
        //     .Class("input is-medium")
        //     .TypeText()
        //     .Placeholder("")
        //     .Value("MyWebsite")
        //     .ID(this.UID("website_name_input")),
        //   ),
        // ),
      ),
    );
  }

  TheFileSystem()
  {
    return this.Section(
      H2.Text(`The file system`),
      P.TL`The first thing you need to understand about developing in ${this.taggly} is how its file loading system works. ${this.taggly} uses JavaScript's ES6 modules to import files in both the client side browser and the server side Node.js environments.`,

      P.TL`Here's an example of what an import looks like:`,

      this.import_div_block,

      P.TL`The above statement is trying to import a class called ${this.div} from the specifier ${this.div_specifier}. Note that the specifier is ${Strong.TL`not`} an absolute file path; it is relative. When ${this.taggly} is launched in Node.js the first thing it does is create something called the ${this.loader}. The ${this.loader}'s job is to map a relative specifier, like the one above, to an actual file in your filesystem. How it does this is very important to understand.`,

      P.TL`The ${this.loader} uses what I call "layers" to resolve each specifier. By default, ${this.taggly} has ${2} layers.`,

      OL.Add(
        LI.TL`The first of these layers is ${Em.Text(`your layer`)} and it is where ever you initialized your NPM package for this current program and it is where you will create your own code files.`,
        LI.TL`The second layer is the ${this.taggly} framework itself. It contains all the code that I wrote, including the code that created this page you are reading now.`,
      ),

      P.TL`Each layer is further broken down into what are called domains. By default, there are ${2} domains in each layer. They are called:`,

      OL.Add(
        LI.Add(this.private),
        LI.Add(this.public),
      ),

      P.TL`Each layer refers to an actual directory in your computer's filesystem, and each domain refers to a sub-directory in each layer. If you take a look in ${this.taggly}'s actual filesystem (usually you will have it installed in your ${this.node_modules} directory), you will see that it does indeed have these two ${this.public} and ${this.private} directories.`,

      P.TL`Here's a visualization of the layer system.`,

      this.VisializeLoader(),

      P.TL`When the ${this.loader} gets a specifier from an import statement, like ${this.div_specifier}, it begins by iterating over each layer, and then each domain in each layer. It will check if there is a file at each of these paths:`,

      OL.Add(
        LI.Add(Code.TL`${this.root_path}${this.website}/private${this.div_specifier_string}`),
        LI.Add(Code.TL`${this.root_path}${this.website}/public${this.div_specifier_string}`),
        LI.Add(Code.TL`${this.root_path}taggly/private${this.div_specifier_string}`),
        LI.Add(Code.TL`${this.root_path}taggly/public${this.div_specifier_string}`),
      ),

      P.TL`Here is some pseudo code to help illustrate what's happening:`,

      Pre.Add(
        Div.TL`const domains = ["private", "public"];`,
        Div.TL`const specifier = "${this.div_specifier_string}";`,
        Div.TL` `,
        Div.TL`// Each layer is an absolute path, like "${this.root_path}${this.website}"`,
        Div.TL`for (const layer of this.GetLayers())`,
        Div.TL`{`,
        Div.TL`  for (const domain of domains)`,
        Div.TL`  {`,
        Div.TL`    const result = layer.Resolve(\`/\${domain}\${specifier}\`);`,
        Div.TL`    if (result) return result;`,
        Div.TL`  }`,
        Div.TL`}`,
      ),

      P.TL`When one of the paths matches a real file, the search is stopped and that file is the one that gets given to the import statement.`,
    );
  }

  CreatingYourOwnFiles()
  {
    return this.Section(
      H3.Text("Creating your own files"),

      P.Add(
        Span.TL`Okay, let's actually get started writing some code! The first thing you should do is create your two ${this.domain} subdirectories in your project's root folder. For example, if your project is setup at ${Code.Add(this.root_path, this.website)} then you should create two new directories, at `,

        // UL.Add(
        //   LI.Add(Code.Add(this.root_path, this.website, `/public`)),
        //   LI.Add(Code.Add(this.root_path, this.website, `/private`)),
        // ),

        UL.Add(
          LI.Add(Code.TL`${this.root_path}${this.website}/public`),
          LI.Add(Code.TL`${this.root_path}${this.website}/private`),
        ),
      ),

      P.TL`Now, inside the ${this.public} directory you just created, we're going to create some more directories. Create each of the following directories, each one as a subdirectory of the previous.`,

      OL.Add(
        LI.Add(this.js),
        LI.Add(this.tags),
        LI.Add(this.page),
      ),

      P.TL`Now your ${this.public} directory file path should look something like this: `,

      Pre.TL`${this.root_path}${this.website}/public/js/Tags/Page`,

      P.TL`So, what was the point of all that? Well I think it's best to just show you how the ${this.loader} in action, then explain it afterwards.`,

      P.TL`To do this, go to the ${Em.TL`lowest`} of the directories you just created, the one called ${this.page} and create a ${Strong.TL`file`} (not a directory) called ${this.welcome} and then paste the following code into it:`,

      Pre.Add(
        Div.TL`import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=${this.website}";`,
        Div.TL` `,
        Div.TL`export class Welcome extends Base`,
        Div.TL`{`,
        Div.TL`  GetSample1()`,
        Div.TL`  {`,
        Div.TL`    return "Hello world!";`,
        Div.TL`  }`,
        Div.TL`}`,
      ),

      P.TL`Now switch to your ${this.node} command line window, where your server is running, and press ${this.CtrlQ()} and then return to the browser and refresh this page that you are currently looking at.`,

      new Pre().Text(this.GetSample1()),

      P.TL`After you have refreshed the page, notice anything different? Right above this paragraph it now says ${this.HelloWorld()}. If you look at the code you just pasted into your ${this.welcome} file, you can see that the function ${this.Sample1()} returns the string ${this.HelloWorld()}, and that string is indeed the text you see above.`,

      P.TL`Try changing what the function returns. For example, instead of returning ${this.HelloWorld()}, you could make it return any string you want. After you write whatever you want in there, refresh the page again.`,

      P.TL`Now you're probably a bit confused about what just happened, but before I fully explain it, let's try a second example. Inside the ${Code.TL`class Welcome extends Base`} that you just copied into your code, create a second function right below the ${this.Sample1()} function. Name this function exactly ${this.Sample2()} and inside of the function write any valid JavaScript code you want and then refresh the page.`,

      P.TL`Since you wrote any valid JavaScript code in that function, I could not possibly know in advance what you were going to write... Right?`,

      P.TL`Well, using the power of suggestion throughout this whole guide, I have been subtly manipulating your subconscious, so you will ${Em.TL`think`} that you chose what to write in the ${this.Sample2()} function, but really you just wrote what ${Em.TL`I`} wanted you to write. So... ${Em.TL`is this your code?`}`,

      new Pre().Text(this.GetSample2Code()),

      P.TL`I'm a magician!`,

      P.TL`Okay, obviously I'm just joking, but what is actually going on here?`,

      this.paragraph_target = P.TL`Well, let's go back to the original code I asked you to copy in to ${this.welcome}. Specifically, let's look at this line: ${Code.Text(`import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=MyWebsite";`)}. That ${this.import} statement is handled by the ${this.loader}. It tells the ${this.loader} to search for a file called ${this.welcome} in the path ${Code.Text(`/js/Tags/Page`)}.`,

      P.TL`The ${this.loader} begins by searching the first ${this.layer} and in that layer, it searches the first ${this.domain} which is ${this.private}. `,
      `If your root directory is at ${Code.Add(this.RootPath(), this.Website())} then the complete file path it checks would be ${this.FullPathPrivate()}.`,

      P.TL`That file does not exist, so the loader moves on to the next ${this.domain} and checks for a file at ${this.FullPathPublic()}, which actually does exist. It is the file you created.`,

      P.TL`The ${this.loader} resolves to your file, causing it to be imported by the program. Now, according to the rules I just described, ${this.specifier} resolves to your file. And your file imports ${this.specifier} and inherits from it. Does that mean your code is actually inheriting itself? It is its own parent class?`,

      P.TL`No, not at all. A class cannot inherit from itself; that is logically impossible. This is where that ${Code.TL`?next=${this.website}`} query parameter comes into play. ${this.next} is a special command that the ${this.loader} knows. The specifier ${this.specifier} resolves to your ${this.welcome} file, but then the ${this.next} parameter kicks in and causes the loader to continue searching for the next file which also matches the specifier. Because remember, these specifiers are not absolute, they are relative to each ${this.layer} and ${this.domain} There can be multiple ${this.welcome} files in different ${this.layers} or ${this.domains}.`,

      P.TL`And indeed, there actually are multiple ${this.welcome} files. If you look at this framework's file structure, you will see that inside ${Code.TL`/js/Tags/Page`} there is a file called ${this.welcome}. In that file you can see all of the code that generated this text you are reading right now.`,
    );
  }

  Summary()
  {
    return this.Section(
      H3.Text(`Summary`),
      new P().Add(
        `Let's go over the entire sequence of events here.`,
        new UL().Add(
          LI.TL`First, somewhere in my code (we'll discuss where later) there is a file that has ${this.import_welcome} note that it does ${this.not} have a ${this.next} parameter.`,

          LI.TL`That ${this.import} statement causes the ${this.loader} to search ${this.FullPathPrivate()} which fails to match a file.`,

          LI.TL`Next, the ${this.loader} checks ${this.FullPathPublic()} which ${Strong.TL`does`} match ${Em.TL`your`} file.`,

          new LI().Add(
            Span.TL`Your file imports ${this.specifier} which would resolve to itself, resulting in an error, except for that ${this.next} parameter which causes the ${this.loader} to move on. The ${this.loader} tries:`,

            new UL().Add(
              LI.TL`${this.FrameworkFullPathPrivate()} which does ${Strong.TL`not`} exist, then`,
              LI.TL`${this.FrameworkFullPathPublic()} which ${Strong.TL`does`} exist (it's this file I wrote)`,
            ),
          ),

          LI.TL`Your ${this.welcome} file ${Code.TL`extends`} from my ${this.welcome} file.`,

          LI.TL`And finally, after the imports are all resolved, my code which began this process by importing the ${Code.TL`Welcome`} ${Code.TL`class`} calls ${Code.TL`new Welcome()`} and renders it on to the page.`,
        ),
      ),
    );
  }

  SectionUsingTags()
  {
    const div = new Div().GetOuterHTML();
    const a = new A().GetOuterHTML();
    const p = new P().GetOuterHTML();

    return this.Section(
      H3.Text(`Using Tags`),

      P.TL`In ${this.taggly} everything is based around the concept of a ${this.tag}. Almost every object in ${this.taggly} is a ${this.tag}. A ${this.tag} is a wrapper class around a ${this.dom} ${this.node}. The best way to learn is by doing, so go to your ${this.welcome} file. At the top of the file, import the ${this.div} class, like this:`,
      this.import_div_block,
      P.TL`Now, inside the ${this.welcome} class, define a third function. Name it ${this.example_3}. Inside the function, put this code:`,
      Pre.TL`return new Div().Class("box").Text("Hello world!");`,
      P.TL`After you have created the ${this.example_3} function, ${this.refresh} this page to apply the changes.`,
      fn =>
      {
        const example_3_result = this.Example3?.();
        if (example_3_result)
        {
          const text = example_3_result.GetText();

          fn.Add(
            P.TL`And here is your new ${this.div} tag:`,

            example_3_result,

            P.TL`If you use your browser's inspector tools, you can see that you created a ${Code.TL`<div></div>`} element. It has a class attribute called "${example_3_result.GetClass(0)}", and it has the text "${text}"`,

            P.TL`So, with that in mind, it probably isn't hard to understand what the code inside the ${this.example_3} function did. And that's the basics of what ${this.tag}s are. Just like the ${this.div} creates a ${Code.Text(div)}, the ${Code.TL`A`} ${this.tag} creates an ${Code.Text(a)}, and the ${Code.TL`P`} ${this.tag} creates an ${Code.Text(p)}.`,
            P.TL`Equally unsurprisingly, the ${Code.TL`Class("my_class")`} function sets the ${this.node}'s ${Code.TL`class`} attribute. The ${Code.TL`ID("my_id")`} function sets the ${Code.TL`id`} attribute, ${Code.TL`Name("my_name")`} sets the ${Code.TL`name`} attribute, etc.`,

            P.TL`That's the basic idea of using Tags. But Tags do ${Em.TL`${Strong.TL`so much more`}`} than just give functions which provide a 1-to-1 mapping with their standard DOM counterparts. They are ${Strong.TL`very`} powerful.`,

            P.TL`Let's explore some more. In your ${this.example_3} function, add the ${Code.TL`CursorCrosshair()`} function call to the ${this.div}, just like how you called the ${Code.TL`Class()`} and ${this.refresh}.`,

            P.TL`Now your ${this.div} has ${Code.TL`style="cursor: crosshair;"`}. If you mouse over it, your crosshair will change.`,

            P.TL`How about setting the background color next? Call ${Code.TL`BackgroundColor("#cecece")`} on the ${this.div} and ${this.refresh}.`,

            P.TL`Since tags are all about generating HTML, and HTML is hierarchical, next let's talk about how to add child tags to a tag. Well, actually, you've already done it. That's what the ${Code.TL`Text("${text}")`} function does. It clears the tag's existing children, and then gives it a Text Node as a new child, just like if you called ${Code.TL`Node.textContent = "${text}"`}`,

            P.TL`But obviously you need to be able to add other types of children than just strings. This is where the ${this.add} function comes in. ${this.add} takes any number of arguments, converts them into HTML Nodes, and adds them as children of the tag it was called on.`,

            P.TL`For example, instead of calling ${Code.TL`Text("${text}")`} on your ${this.div} tag, what if you called ${Code.TL`Add("${text}")`}? Go ahead and try it. The result will be basically the same. The big difference between ${Code.TL`Text`} and ${this.add} is that ${this.add} does not ${Code.TL`Clear`} any existing children of the tag first, and that while ${this.text} only takes ${1} string argument, ${this.add} takes any number of arguments of any type`,

            P.TL`And when I say "${Em.TL`any type`}", I mean it. ${this.taggly} knows how to convert all the standard JavaScript primitive types into tags. Try it! In your ${this.div}'s ${this.add} function, add another parameter that is a number, like so:`,
            Pre.TL`return new Div().Class("box").CursorCrosshair().BackgroundColor("#cecece").Add(\n  "${text}",\n  42,\n);`,
            P.TL`Then ${this.refresh} the page.`,

            fn =>
            {
              const number = example_3_result?.Query("number");
              if (number)
              {
                fn.Add(
                  P.TL`Look at that new parameter in your browser's dev tools. It looks like this: ${Code.Text(number.GetOuterHTML())}. The framework automatically converted it to a ${Code.TL`Number`} tag for you. This is the same as if you imported the ${Code.TL`Number`} tag class from ${Code.TL`"/js/Tags/Number.js"`} and instead of putting ${number.GetValue()} as a argument for the ${this.add} call, you gave it ${Code.TL`new Number(42),`}. The framework is doing that for you.`,

                  P.TL`After the ${42} parameter, try adding a function as a parameter, like this:`,
                  Pre.TL`fn =>\n{\n  // Code here...\n},`,

                  fn =>
                  {
                    const func = example_3_result?.Query("function");
                    if (func)
                    {
                      fn.Add(
                        P.TL`In your dev tools, that function will look like this: ${Code.Text(func.GetOuterHTML())}. Once again, the framework automatically converted the parameter into a tag. But in addition to converting it, it automatically ${Em.TL`calls`} the function, and provides itself as the first parameter. That ${Code.TL`fn`} parameter is the actual function tag itself. Try it! Add ${Code.TL`fn.Add("Some text!");`} to the body of the function, and ${this.refresh}.`,
                      );

                      if (func.HasChildren())
                      {
                        fn.Add(
                          P.TL`Scroll up to where the result of the ${this.example_3} is being displayed, and you will see that text added as a child of the function!`,
                          new P(), // IDK why the spacing is messed up. Probably cause of the Function tag I guess? Whatever
                        );
                      }
                    }
                  },
                );
              }
            },

            this.RenderTemplateLiteral(),
            this.SubSectionStaticConstructors(),
          );
        }
      },
    );
  }

  RenderTemplateLiteral()
  {
    return this.SubSection(
      H4.Text(`The TL function`),

      P.TL`In addition to ${this.add} and ${this.text} there is one other way of adding children to a tag that I want to introduce for now. It's called ${this.tl}, which stands for "Template Literal". But before I explain what ${this.tl} is and how you use it, I want to explain the problem it is designed to solve. Take a look at this code:`,

      new Pre().Text(function()
      {
        new P().Add(
          `Well, let's go back to the original code I asked you to copy in to `,
          new Code().Text("Welcome.js"),
          `. Specifically, let's look at this line: `,
          new Code().Text(`import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=${this.website}";`),
          `. That `,
          new Code().Text("import"),
          ` statement is handled by the `,
          new Code().Text("loader"),
          `. It tells the `,
          new Code().Text("loader"),
          ` to search for a file called `,
          new Code().Text("Welcome.js"),
          ` in the path `,
          new Code().Text("/js/Tags/Page"),
          `.`,
        );
      }),

      P.TL`As you might remember, the above example code is actually code from earlier this page. It serves as a good example of the problem. See ${Em.TL`normally`} ${this.taggly} code is very consice and simple, because ${Em.TL`most`} HTML you generate is not strings of text heavily interspliced with different HTML tags. But in the case of making a page that is heavily text based - like this documentation page - the syntax starts to get a little messy.`,

      new Div("notification is-info").Add(
        P.TL`The raw HTML generated looks like this: ${Pre.Add(this.paragraph_target?.RemoveAttribute("id").ToPrettyHTML())}`,
      ),

      P.TL`This is where ${this.tl} comes in. ${this.tl} is a bit different from ${this.add} and ${this.text}. If you aren't very familiar with JavaScript template literal strings, this might look pretty weird, but it is ${Em.TL`very`} useful. Here's an example that shows using ${this.tl}:`,

      Pre.TL`new Div().TL\`Hello world!\`;`,

      P.TL`Instead of a normal function call, like ${Code.TL`TL()`} it uses the syntax of a tagged template literal. Rather than having my text broken up into lots of small strings, I can keep it as one long template literal and use the ${Code.TL`\${...}`} syntax to ${Em.TL`inject`} each of my tags into the string. Using ${this.tl}, I can rewrite that messy example from before into the following:`,

      new Pre().OverflowWrapBreakWord().WhiteSpacePreLine().Text(function()
      {
        new P().TL`Well, let's go back to the original code I asked you to copy in to ${new Code().Text("Welcome.js")}. Specifically, let's look at this line: ${new Code().Text(`import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=${this.website}";`)}. That ${new Code().Text("import")} statement is handled by the ${new Code().Text("loader")}. It tells the ${new Code().Text("loader")} to search for a file called ${new Code().Text("Welcome.js")} in the path ${new Code().Text(`/js/Tags/Page`)}.`;
      }),

      P.TL`Now that's ${Em.TL`better`}, but it's still kind of messy because of all the ${Code.TL`new Code().Text("...")`} bits. So, what I'm going to do is add some getter functions to this ${this.welcome} class to help me out. Here are the functions I will add:`,

      new Pre().Add(
        Div.TL`get loader(){ return new Code().Text("Loader"); }`,
        Div.TL`get import(){ return new Code().Text("import"); }`,
        Div.TL`get welcome(){ return new Code().Text("Welcome.js"); }`,
        Div.TL`get page_specifier(){ return new Code().Text("/js/Tags/Page"); }`,
        Div.TL`get welcome_import(){ return new Code().Text(\`import {Welcome as Base} from "/js/Tags/Page/Welcome.js?next=${this.website}";\`); }`,
      ),

      P.TL`Using those new getter functions, my code now looks like this:`,

      new Pre().OverflowWrapBreakWord().WhiteSpacePreLine().Text(function()
      {
        new P().TL`Well, let's go back to the original code I asked you to copy in to ${this.welcome}. Specifically, let's look at this line: ${this.welcome_import}. That ${this.import} statement is handled by the ${this.loader}. It tells the ${this.loader} to search for a file called ${this.welcome} in the path ${this.page_specifier}.`;
      }),

      P.TL`Much more readable! If you take a look at the source code for this page I am writing now, you will see this style is used constantly.`,

      new Div("notification is-info").Add(
        P.TL`And if you aren't familiar with how taggled template literals work, you might be concerned that ${this.tl} works by some weird string manipulation and has terrible performance. It doesn't. It actually has great performance, so use it freely.`,
      ),

      // P.TL`Now I want to stress that ${Em.TL`usually`} you will just be using the ${this.add} and ${this.text} functions. But in cases where you have lots of text heavily mixed with lots of tags, the ${this.tl} function is very handy!`,
    );
  }

  SubSectionStaticConstructors()
  {
    return this.SubSection(
      // new BR(),
      P.TL``,
      H4.Text(`Static constructors`),

      P.TL`Programmers have a lot of great tools at their disposal for quickly generating boilerplate code. Most code editors will have some sort of "snippets" feature, where you just start typing something, press a special key, and the editor will automatically expand it into a longer string of code.`,

      P.TL`Just like it would be pretty crazy to write plain HTML by manually typing out ${Code.Text(new Div().GetOuterHTML())} every time you want a ${Code.TL`div`}, I strongly recommend you set up some sort of snippet system for working in ${this.taggly}. However, even with tools like snippets, it's often nice have code with less visible boilerplate, as it ${Em.TL`can`} improve the readability.`,

      P.TL`As you know, the way you construct an object in JavaScript is by using the ${Code.TL`new`} operator on its constructor like this:`,

      Pre.TL`new Div();`,

      P.TL`While you should use snippets to generate that kind of boilerplate code, it still can clutter up your code a bit, especially when you are using many different tags in a single template literal, as discussed in the previous section. This is where ${this.taggly}s static constructors come in. These static constructors are just extremely simple static member functions on the ${this.tag} class that help you write more compact code. Here's an example:`,

      Pre.TL`P.TL\`Hello world!\``,

      P.TL`The static ${this.tl} function simply first constructs an instance of the ${this.tag} class it is called on, and then it calls the regular ${this.tl} function on that new instance and returns it. In other words, the above is identical to:`,

      Pre.TL`new P().TL\`Hello world!\``,

      P.TL`Except that it's a bit shorter. The static ${this.tl} function's definition is very simple, it just looks like this:`,

      Pre.TL`static ${Tag.TL.toString()}`,

      P.TL`I made quite a few of these static constructors for various frequently used ${this.tag} functions. Here's the full list:`,

      UL.Add(
        LI.TL`${Code.TL`P.TL\`\``} instead of ${Code.TL`new P().TL\`\``}`,
        LI.TL`${Code.TL`P.Add(...)`} instead of ${Code.TL`new P().Add(...)`}`,
        LI.TL`${Code.TL`P.Text(...)`} instead of ${Code.TL`new P().Text(...)`}`,
        LI.TL`${Code.TL`P.ID(...)`} instead of ${Code.TL`new P().ID(...)`}`,
        LI.TL`${Code.TL`P.Class(...)`} instead of ${Code.TL`new P().Class(...)`}`,
        LI.TL`${Code.TL`P.Name(...)`} instead of ${Code.TL`new P().Name(...)`}`,
        LI.TL`${Code.TL`P.HRef(...)`} instead of ${Code.TL`new P().HRef(...)`}`,
        LI.TL`${Code.TL`P.Src(...)`} instead of ${Code.TL`new P().Src(...)`}`,
        LI.TL`${Code.TL`P.Type(...)`} instead of ${Code.TL`new P().Type(...)`}`,
      ),

      P.TL`I selected these ones just because they are ones I use often, but you can very easily create any additional ones you like yourself. More on how to customize the ${this.tag} class later.`,
    );
  }

  RenderVisualLayer(name, index, domains = ["private", "public"])
  {
    return new Div().Class("columns is-centered").Add(
      new Div().Class("column is-8").Add(
        new Div().Class("box").Add(
          new H2().Add("Layer ", index + 1, ": ", name),

          new Div().Class("columns is-centered").Add(
            ...domains.map((d, i) =>
              new Div().Class("column is-5").Add(
                new Div().Class("box has-background-primary").Add(
                  new P().Class("has-text-white").Add("Domain: ", i + 1, ": ", d),
                  // new P().Class("has-text-white").Add(this.#loader_order++, ": ", d),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  #loader_order = 1;
  VisializeLoader(layers = [this.website, "Taggly"], domains)
  {
    this.#loader_order = 1;

    return new Fragment().Add(
      new Div().Class("content is-large has-text-centered").Add(
        ...layers.map((l, i) => this.RenderVisualLayer(l, i, domains)),
      ),
    );
  }

  RenderBody()
  {
    return super.RenderBody(
      style ??= new Style().Add(
        new CSS("code.welcome_highlight").BackgroundColor("#eadfdf"),
      ),

      this.Introduction.bind(this),
      this.TheFileSystem.bind(this),
      this.CreatingYourOwnFiles.bind(this),
      this.Summary.bind(this),
      this.SectionUsingTags.bind(this),
    );
  }

  // #file_path_input;
  // #website_name_input;
  constructor(...args)
  {
    super(...args);
  }
}

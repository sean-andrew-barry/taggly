import {Docs} from "/js/Tags/Page/Docs.js";
import {Div} from "/js/Tags/Div.js";
import {H2} from "/js/Tags/H2.js";
import {P} from "/js/Tags/P.js";
import {OL} from "/js/Tags/OL.js";
import {UL} from "/js/Tags/UL.js";
import {LI} from "/js/Tags/LI.js";
import {Code} from "/js/Tags/Code.js";
import {Pre} from "/js/Tags/Pre.js";
import {Strong} from "/js/Tags/Strong.js";
import {Em} from "/js/Tags/Em.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Span} from "/js/Tags/Span.js";
import {CreatingYourOwnFiles} from "/js/Tags/Page/Docs/CreatingYourOwnFiles.js";

export class TheFileSystem extends Docs
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "the-file-system"; }
  static GetTitle(){ return "The file system"; }
  static GetNext(){ return CreatingYourOwnFiles; }
  static GetURL(...parts){ return super.GetURL(TheFileSystem.GetLocalName(), ...parts); }

  get div_specifier(){ return this.Code().Text("/js/Tags/Div.js"); }

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
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  VisializeLoader(layers = [this.website, "Taggly"], domains)
  {
    return new Fragment().Add(
      new Div().ID("loader_visualization").Class("content is-large has-text-centered").Add(
        ...layers.map((l, i) => this.RenderVisualLayer(l, i, domains)),
      ),
    );
  }

  RenderTheFileSystem()
  {
    return [
      this.Title().Text("The file system"),

      P.TL`The first thing you need to understand about developing in ${this.taggly} is how its file loading system works. ${this.taggly} uses JavaScript's ES6 modules to import files in both the client side browser and the server side Node.js environments.`,

      P.TL`Here's an example of what an import looks like:`,

      this.Pre().Fetch("/js/Tags/Page/Docs/Examples/FileSystemImport.js"),

      P.TL`The above statement is trying to import a class called ${this.div} from the specifier ${this.div_specifier}. Note that the specifier is ${Strong.TL`not`} an absolute file path; it is relative. When ${this.taggly} is launched in Node.js the first thing it does is create something called the ${this.loader}. The ${this.loader}'s job is to map a relative specifier, like the one above, to an actual file in your filesystem. How it does this is very important to understand.`,
    ];
  }

  RenderLoaderLayers()
  {
    return [
      this.SubTitle().Text("Layers"),

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

      P.TL`Here's a simple visualization of the layer system.`,

      this.VisializeLoader(),

      P.TL`When the ${this.loader} gets a specifier from an import statement, like ${this.div_specifier}, it begins by iterating over each layer, and then each domain in each layer. It will check if there is a file at each of these paths:`,

      OL.Add(
        LI.TL`${this.root_path}${this.website}/private/js/Tags/Div.js`,
        LI.TL`${this.root_path}${this.website}/public/js/Tags/Div.js`,
        LI.TL`${this.root_path}${this.website}/node_modules/taggly/private/js/Tags/Div.js`,
        LI.TL`${this.root_path}${this.website}/node_modules/taggly/public/js/Tags/Div.js`,
      ),

      P.TL`Here is some pseudo code to help illustrate what's happening:`,

      this.Pre().Fetch("/js/Tags/Page/Docs/Examples/LoaderPseudoCode.js"),

      P.TL`When one of the paths matches a real file, the search is stopped and that file is the one that gets given to the import statement.`,
    ];
  }

  RenderLoaderDomains()
  {
    return [
      this.SubTitle().Text("Domains"),

      P.TL`Each layer is further broken down into what are called domains. By default, there are ${2} domains in each layer. They are called:`,

      OL.Add(
        LI.Add(this.private),
        LI.Add(this.public),
      ),
    ];
  }

  Render()
  {
    return super.Render(
      ...this.RenderTheFileSystem(),
      ...this.RenderLoaderLayers(),
      ...this.RenderLoaderDomains(),
    );
  }
}

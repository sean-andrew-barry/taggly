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
import {UsingTags} from "/js/Tags/Page/Docs/UsingTags.js";

import {StringUtilities} from "/js/Utility/String.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";

export class CreatingYourOwnFiles extends Docs
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "creating-your-own-files"; }
  static GetTitle(){ return "Creating your own files"; }
  static GetNext(){ return UsingTags; }
  static GetURL(...parts){ return super.GetURL(CreatingYourOwnFiles.GetLocalName(), ...parts); }

  static Match(url){ return super.Match(url)?.IfMatch("creating-your-own-files"); }

  get ctrl_q(){ return this.Code().Text("ctrl-q"); }
  get hello_world(){ return this.Code().Text("Hello world!"); }
  get next(){ return this.Code().Text("next"); }
  get domains(){ return this.Code().Text("domains"); }
  get domain(){ return this.Code().Text("domain"); }

  GetSample2Code()
  {
    return StringUtilities.ExtractFunctionBody(this.GetSample2);
  }

  Render()
  {
    return super.Render(
      this.Title().Text("Creating your own files"),

      P.Add(
        Span.TL`Okay, let's actually get started writing some code! The first thing you should do is create your two ${this.domain} subdirectories in your project's root folder. For example, if your project is setup at ${Code.Add(this.root_path, this.website)} then you should create two new directories, at `,

        UL.Add(
          LI.Add(Code.TL`${this.root_path}${this.website}/public`),
          LI.Add(Code.TL`${this.root_path}${this.website}/private`),
        ),
      ),

      P.TL`Now, inside the ${this.public} directory you just created, we're going to create some more directories. Create each of the following directories, each one as a subdirectory of the previous.`,

      OL.Add(
        LI.Add("js"),
        LI.Add("Tags"),
        LI.Add("Page"),
      ),

      this.Note().Add(
        P.TL`Note that this is not case sensitive. Importing a file from ${this.public} is the same as importing a file from ${this.public.Text("PUBLIC")} or ${this.public.Text("pUBLiC")}.`,

        P.TL`The reason my ${this.Code().Text("js")} and ${this.Code().Text("public")} and ${this.Code().Text("private")} are lower case and the rest of my file system is in ${this.Code().Text("CamelCase")} style is a historical artifact.`,

        P.TL`${this.taggly} has a few of these artifacts scattered about. Another example is the fact that the ${this.Code().Text("Tags")} directory is plural, which does not fit with the rest of my naming scheme. These are problems for future Sean to deal with. That idiot has a ${this.B`lot`} of problems...`,
      ),

      P.TL`Now your ${this.public} directory file path should look something like this: `,

      Pre.TL`${this.root_path}${this.website}/public/js/Tags/Page`,

      P.TL`So, what was the point of all that? Well I think it's best to just show you how the ${this.loader} in action, then explain it afterwards.`,

      P.TL`To do this, go to the ${Em.TL`lowest`} of the directories you just created, the one called ${this.page} and create a ${Strong.TL`file`} (not a directory) called ${this.first_file} and then paste the following code into it:`,

      this.Pre().Fetch("/js/Tags/Page/Docs/Examples/CreatingYourOwnFilesSample1.js"),

      P.TL`Now switch to your ${this.node} command line window, where your server is running, and press ${this.ctrl_q} and then return to the browser and ${this.refresh} this page that you are currently looking at.`,

      fn =>
      {
        const sample = this.GetSample1();
        if (sample)
        {
          fn.Add(
            new Pre().Text(sample),

            P.TL`Now that you have refreshed, right above this paragraph it now displays the string you returned. If you look at the code you just pasted into your ${this.first_file} file, you can see that the function ${this.sample_1} returns the string ${this.hello_world}, and that string is indeed the exact same string rendered above.`,

            // this.Note().Add(
            //   P.TL`If you want to, feel free to add another line in your function like ${this.Code().Text(`console.log("Test?");`)} right before the returned string. Open up your browser's developer tools and ${this.refresh} the page. You will see that I am indeed calling your ${this.sample_1} function.`,
            // ),

            // P.TL`Try changing what the function returns. For example, instead of returning ${this.hello_world}, you could make it return any string you want. Or try putting a ${this.Code().Text(`console.log()`)} call before the ${this.Code().Text("return")} and opening up your browser's developer tools to see the output.`,

            // P.TL`After you modify the function, ${this.refresh} the page again. You will see that above message changed to reflect your modified function.`,

            P.TL`Now you're probably a bit confused about what just happened, but before I fully explain it, let's try a second example. Inside the class that you just copied into your code, create a second function right below the ${this.sample_1} function. Name this function exactly ${this.sample_2} and inside of the function write any valid JavaScript code you want and then refresh the page.`,

            P.TL`Since you wrote any valid JavaScript code in that function, I could not possibly know in advance what you were going to write... Right?`,

            P.TL`Well, using the power of suggestion throughout this whole guide, I have been subtly manipulating your subconscious, so you will ${Em.TL`think`} that you chose what to write in the ${this.sample_2} function, but really you just wrote what ${Em.TL`I`} wanted you to write. So... ${Em.TL`is this your code?`}`,

            fn =>
            {
              const code = this.GetSample2Code();
              if (code)
              {
                fn.Add(
                  new Pre().Text(code).Type("js").Parse(),

                  P.TL`I'm a magician!`,

                  P.TL`Okay, obviously I'm just joking, but what is actually going on here?`,

                  this.paragraph_target = P.TL`Well, let's go back to the original code I asked you to copy in to ${this.first_file}. Specifically, let's look at that ${this.import} statement at the top. That ${this.import} statement is handled by the ${this.loader}. It tells the ${this.loader} to search for a file called ${this.Code().Text("CreatingYourOwnFiles")} in the path ${this.Code().Text(`/js/Tags/Page`)}.`,

                  P.TL`The ${this.loader} begins by searching the first ${this.layer} and in that layer, it searches the first ${this.domain} which is ${this.private}.`,

                  // P.TL`If your root directory is at ${this.Code().Add(this.root_path, this.website)} then the complete file path it checks would be ${this.Code().Add(this.root_path, this.website, "/private", this.specifier)}.`,

                  Pre.Add(this.root_path, this.website),

                  P.TL`Then the complete file path it checks would be:`,

                  Pre.Add(this.root_path, this.website, "/", this.B`private`, this.specifier),

                  P.TL`That file does not exist, so the loader moves on to the next ${this.domain} and checks for a file at:`,

                  Pre.Add(this.root_path, this.website, "/", this.B`public`, this.specifier),

                  P.TL`Which actually does exist. It is the file you created.`,

                  P.TL`The ${this.loader} resolves to your file, causing it to be imported by the program. Now, according to the rules I just described, ${this.specifier_code} resolves to your file. And your file imports ${this.specifier_code} and inherits from it. Does that mean your code is actually inheriting itself? It is its own parent class?`,

                  P.TL`No, not at all. A class cannot inherit from itself; that is logically impossible.`,

                  P.TL`This is where that ${this.Code().TL`?next=${this.website}`} query parameter comes into play. ${this.next} is a special command that the ${this.loader} knows. The specifier ${this.specifier_code} resolves to your ${this.first_file} file, but then the ${this.next} parameter kicks in and causes the loader to continue searching for the next file which also matches the specifier. Because remember, these specifiers are not absolute, they are relative to each ${this.layer} and ${this.domain} There can be multiple ${this.first_file} files in different ${this.layers} or ${this.domains}.`,

                  P.TL`And indeed, there actually are multiple ${this.first_file} files. If you look at this framework's file structure, you will see that inside ${this.Code().TL`/js/Tags/Page`} there is a file called ${this.first_file}. ${this.B`That`} is the file that defines the class you are inheriting from. This file I am writing now, the one generating the text you are currently reading, inherits from ${this.first_file}. ${this.I`That means my file is inheriting from the class ${this.B`you`} created.`}`,

                  P.TL`${this.B`This`} is how I can "know" what code you chose to write. All I have to do to get the content of your ${this.sample_2} code is something like this:`,

                  new Pre().Type("js").Text(`const code = this.GetSample2.toString();`).Parse(),

                  P.TL`Then I just do a little bit of string editing to extract just the function body, and I can print out your code, even though I actually have no clue what you decided to write.`,

                  P.TL`It's very important to fully understand the significance of this. It means that, by simply creating a file in the right path, you could completely and seamlessly replace ${this.B`any`} of this framework's core files. And ${this.B`my`} code, which was written before yours even existed, will actually respect your changes.`,

                  P.TL`Let's do one more quick example to illustrate this. In your ${this.first_file} class, addd the following function:`,

                  new Pre().Type("js").Text(`Code(...args){ return super.Code(...args).Color("#000000"); }`).Parse(),

                  P.TL`Then ${this.refresh} as usual.`,

                  P.TL`After the refresh, all of the little ${this.Code().Text("code")} elements on this page will now have their text be solid black. But what's more is try navigating to a different page in these docs, then back again. ${this.B`Every`} one of the documentation pages have their code elements modified. That's because each page of these docs inherit from ${this.specifier}, which means they all inherit ${this.I`your`} class. The base ${this.first_file} class has a function called ${this.Code().Text("Code")}, which I call whenever I want to insert a HTML ${this.Code().Text("<code></code>")} element.`,

                  this.Note().Add(
                    P.TL`By the way, the ${this.Code().Text("Color")} function just sets the ${this.Code().Text("color")} CSS property as an inline style. You can see this if you look in your browser's developer tools.`,
                  ),
                );
              }
            },
          );
        }
      },
    );
  }
}

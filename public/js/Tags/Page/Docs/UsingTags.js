import {Docs} from "/js/Tags/Page/Docs.js";
import {Div} from "/js/Tags/Div.js";
import {Label} from "/js/Tags/Label.js";
import {Input} from "/js/Tags/Input.js";
import {Form} from "/js/Tags/Form.js";
import {H1} from "/js/Tags/H1.js";
import {H3} from "/js/Tags/H3.js";
import {P} from "/js/Tags/P.js";
import {A} from "/js/Tags/A.js";
import {Em} from "/js/Tags/Em.js";
import {Aside} from "/js/Tags/Aside.js";
import {UL} from "/js/Tags/UL.js";
import {LI} from "/js/Tags/LI.js";
import {Strong} from "/js/Tags/Strong.js";
import {Pre} from "/js/Tags/Pre.js";
import {Span} from "/js/Tags/Span.js";
import {Scope} from "/js/Tags/CSS/Scope.js";
import {Emoji} from "/js/Tags/Img/Emoji.js";
import {UsingEvents} from "/js/Tags/Page/Docs/UsingEvents.js";

export class UsingTags extends Docs
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "using-tags"; }
  static GetTitle(){ return "Using tags"; }
  static GetNext(){ return UsingEvents; }
  static GetURL(...parts){ return super.GetURL(UsingTags.GetLocalName(), ...parts); }

  get tag(){ return this.Code().Text("Tag"); }

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

  RenderUsingTagsSection()
  {
    return [
      this.SubTitle().Text("The On function"),

      P.TL`In ${this.taggly} everything is based around the concept of a ${this.tag}. Almost every object in ${this.taggly} is a ${this.tag}. A ${this.tag} is a wrapper class around a DOM Node. The best way to learn is by doing, so go to your ${this.first_file} file. At the top of the file, import the ${this.div} class, like this:`,

      this.Pre().Fetch("/js/Tags/Page/Docs/Examples/FileSystemImport.js"),

      this.Note().Add(
        P.TL`I will finish implementing this later...`,
      ),

      // P.TL`Now, inside the ${this.first_file} class, define a third function. Name it ${this.example_3}. Inside the function, put this code:`,
      //
      // Pre.TL`return new Div().Class("box").Text("Hello world!");`,
      //
      // P.TL`After you have created the ${this.example_3} function, ${this.refresh} this page to apply the changes.`,
      //
      // P.TL`Events are a big part of developing in JavaScript, and so of course they are also a big part of developing in ${this.taggly}.`,
      //
      // P.TL`The default way you listen to an event is by using the ${this.on} function. Here's an example:`,
      //
      // this.Pre().Fetch("/js/Tags/Page/Docs/Examples/UsingOnFunctionCounter.js"),
      //
      // P.TL`And here is the button generated by the default function:`,
      //
      // this.Example().Add(
      //   UsingOnFunctionCounter,
      // ),
      //
      // P.TL`The ${this.on} function is pretty easy to understand. It just calls the standard ${this.addEventListener} function. The first parameter to ${this.on} is usually an ${this.event} object (more on that in a moment), but it can also be a string, like:`,
      //
      // this.Pre().Type("js").TL`new Button().On("click", (event, self) => \n{\n  ...\n});`.Parse(),
      //
      // P.TL`The ${this.self} parameter passed to the event handler is just the tag that has the event. In this case, it's the Button.`,
    ];
  }

  Render()
  {
    return super.Render(
      this.Title().Text("Using tags"),

      ...this.RenderUsingTagsSection(),
    );
  }
}

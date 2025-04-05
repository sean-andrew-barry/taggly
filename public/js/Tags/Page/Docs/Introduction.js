import {Tag} from "/js/Tag.js";
import {Docs} from "/js/Tags/Page/Docs.js";
import {Div} from "/js/Tags/Div.js";
import {Label} from "/js/Tags/Label.js";
import {Input} from "/js/Tags/Input.js";
import {Form} from "/js/Tags/Form.js";
import {Span} from "/js/Tags/Span.js";
import {H1} from "/js/Tags/H1.js";
import {H3} from "/js/Tags/H3.js";
import {P} from "/js/Tags/P.js";
import {A} from "/js/Tags/A.js";
import {OL} from "/js/Tags/OL.js";
import {UL} from "/js/Tags/UL.js";
import {LI} from "/js/Tags/LI.js";
import {Emoji} from "/js/Tags/Img/Emoji.js";
import {TheFileSystem} from "/js/Tags/Page/Docs/TheFileSystem.js";
import {Style} from "/js/Tags/Style.js";

// import WebSocketPerformance from "/js/Tags/Page/Docs/Examples/WebSocketPerformance.js";

export class Introduction extends Docs
{
  static GetMetaURL(){ return import.meta.url; }
  static GetTitle(){ return "Introduction"; }
  static GetLocalName(){ return "introduction"; }
  static GetOrder(){ return 0; }
  static GetNext(){ return TheFileSystem; }
  static GetURL(...parts){ return super.GetURL(Introduction.GetLocalName(), ...parts); }

  static Match(url){ return super.Match(url)?.IfMatch("introduction"); }

  get local_host(){ return this.Code().Text("localhost") }
  get http(){ return this.Code().Text("HTTP") }
  get web_socket(){ return this.Code().Text("WebSocket") }

  RenderTextField(id, value, label)
  {
    return new Div().Class("field").Add(
      label && new Label().Class("label is-medium").Text(label),
      new Div().Class("control").Add(
        new Input()
        .Class("input is-medium")
        .TypeText()
        .Value(value)
        .ID(id)
        .OnInput(event =>
        {
          const text = this.GetValue();

          for (const tag of Tag.GetAllByClass(id))
          {
            tag.Text(text);
          }
        }),
      ),
    );
  }

  RenderForm()
  {
    return [];

    return [
      P.TL`This is completely optional, but if you want to, you can use these fields to customize what values will be displayed throughout this guide. These values are private and never leave your computer.`,

      new Form().Add(
        this.RenderTextField(this.GetRootFilePathID(), this.GetRootFilePath(), "What's your file path?"),
        this.RenderTextField(this.GetTagglyFilePathID(), this.GetTagglyFilePath(), "Where is Taggly installed?"),
        this.RenderTextField(this.GetWebsiteNameID(), this.GetWebsiteName(), "What's the name of your website?"),
      ),
    ];
  }

  RenderFeaturePerformance()
  {
    return [
      this.SubTitle().Text("Performance"),

      P.TL`Since I began programming, optimizing has been my obsession. I ${this.I`love`} efficient code. A big part of why I chose to build ${this.taggly} is because I was unhappy with the performance of other systems that are offered. That's why ${this.taggly} is ${this.BI`fast`}.`,
    ];
  }

  RenderFeatureHotReload()
  {
    return [
      this.SubTitle().Text("Hot reloading"),

      P.TL`Imagine you're developing a website on ${this.local_host} with a server that runs in Node.js. You change an API in your server side code, and want to see the changes reflected in your browser. You refresh your browser to see the changes, but get an error message because your ${this.I`new`} client side API is trying to talk to your ${this.I`old`} server side API. You forgot to restart your Node.js server, so it's still running the previous version of the program.`,

      P.TL`So, you switch over to your Node.js terminal, press ${this.C`ctrl-c`}, and confirm that you actually want to exit. Then you enter in the start command, and press ${this.C`enter`} and your program begins to boot up. How long it takes to start can vary a lot depending on the program, but it's usually in the range of like 3 - 30 seconds.`,

      P.TL`${this.I`Now`} you can go back to your browser and refresh the page and see how your ${this.I`new`} client side interacts with your ${this.I`new`} server side.`,

      P.TL`It's all a huge pain. There are some other frameworks out there that try to make this process more automatic and faster, but in all of them that I am aware of, it's still slow and still frustrating.`,

      P.TL`However, ${this.taggly} has a very cool design for addressing this. It has a "hot reload" system built in to the Node.js side of the program. It can, without the program ever shutting down, reload all of its files. And this hot reload is ${this.B`fast`}. It usually only takes a few hundred milliseconds to complete.`,

      P.TL`What's more, when in ${this.development} mode, the framework will automatically hot reload the server whenever you refresh the browser. This means you can develop both the server and client sides, and never have to worry about them getting out of sync.`,
    ];
  }

  RenderFeatureFlexibility()
  {
    return [
      this.SubTitle().Text("Flexibility"),

      P.TL`The traditional way you interact with frameworks or code libraries is that they provide some function for you to call that accepts a settings object. Then the framework uses that settings object to select between some predefined options in how it will work.`,

      P.TL`This kind of a design is ${this.I`okay`}, I guess, but it really leaves a lot to be desired. The framework's developer needs to have ${this.I`anticipated`} how you, the user, will want to use the framework. And, speaking from experience, it's just impossible to anticipate every use case.`,

      P.TL`And even if the framework's developer creates something that is very customizable, usually the settings object becomes ${this.B`very`} complicated, in terms of exactly what keys it will accept and what are the allowed data types.`,

      P.TL`I believe there has been a serious need for a new kind of configuration system that gives the user a really good default experience right out of the box, while also giving them ${this.BI`full`} control of the framework if they need it. A system that ${this.B`doesn't`} involve hacky nonsense like messing with a class's ${this.C`prototype`}.`,

      P.TL`What I did is create an entirely new approach to how files are loaded. I won't go into detail of how it works right now, since it requires a more in depth explanation, but suffice it to say that without any customization, ${this.taggly} will work beautifully. But when you decide you ${this.I`want`} to customize something, you will find you have ${this.B`unlimited`} control of any and every aspect of ${this.taggly}.`,

      P.TL`No complicated settings objects, no hacky workarounds, no manipulating ${this.C`prototype`}, no weird complex build tools, no performance overhead cost. Just full control using standard JavaScript.`,

      // P.TL`Something I have always kept in mind while developing ${this.taggly} is that ${this.B`I don't know best.`} That is to say, while I personally have endless opinions on how programs should be developed, what is bad practice, what is good practice, these are just my ${this.B`opinions`}. I always tried to code with the understanding that I cannot anticipate every use case and I shouldn't try to.`,
    ];
  }

  RenderTextExchangeExample()
  {
    class TextMessage extends Div
    {
      constructor(...args)
      {
        super(...args).Class("columns").PaddingTop("1em").Add(
          this.column = new Div().Class("column is-8 notification").Padding("1em").BorderRadius("1em"),
        );
      }

      Request(message)
      {
        this.column.AddClass("is-offset-4").AddClass("is-link").Add(
          P.TL`Hi,`,
          P.TL`My name is Sean Barry. I'm a programmer that specializes in writing high performance code, mostly in C++ and JavaScript. You may not remember me. We first met a year ago at a conference for programmers.`,
          P.TL`${message}`,
        );

        return this;
      }

      Response(message)
      {
        this.column.AddClass("is-link").AddClass("is-light").Add(
          P.TL`Hello,`,
          P.TL`Uhh, let me think... Sean Barry... Sean Barry... Programmer... Conference... Oh! Yes I remember you.`,
          P.TL`${message}`,
        );

        return this;
      }
    }

    return [
      Div.Class("columns is-centered").Add(
        Div.Class("column is-2"),
        Div.Class("column").Add(
          new TextMessage().Request("How are you?"),
          new TextMessage().Response("I'm doing well, thanks."),
          new TextMessage().Request("Glad to hear it."),
          new TextMessage().Response("How about you?"),
          new TextMessage().Request("I'm doing pretty well."),
        ),
        Div.Class("column is-2"),
      ),
    ];
  }

  RenderFeatureNotHTTP()
  {
    return [
      this.SubTitle().Text("Not HTTP based"),

      P.TL`Okay, that little title might be a bit confusing. Of course ${this.taggly} does still ${this.I`use`} ${this.http}, but only for what ${this.http} is actually good at. Let me explain...`,

      P.TL`${this.http} has a ${this.B`lot`} of overhead cost. On each request and response, there are hundreds of characters of text along for the ride. This is because ${this.http} was created to be a stateless system. Essentially, the server has no memory of the client between each request, so each request has to include a lot of information overhead.`,

      P.TL`The ${this.http} design was made a long time ago, when websites were all about sending large blocks of data. And ${this.http} is quite good for that. Those hundreds of characters in each request barely even register in comparison to the many thousands, or even millions, of characters in many files.`,

      P.TL`However as the web has evolved, people have been building more and more dynamic websites. These modern websites usually send lots of tiny requests, rather than fewer large requests. But ${this.http} wasn't designed for this, and it's extremely inefficient at doing it. Most of these small requests end up being something like 80% - 90% ${this.B`overhead`}. It's ${this.B`wasted`} data. Think about this for a moment. Imagine a website that's getting and responding to thousands of little requests a second. Something like 80% - 90% of the data its receiving is ${this.B`just overhead`}.`,

      P.TL`To put this staggering inefficiency in another way, imagine if texting someone worked like this:`,

      ...this.RenderTextExchangeExample(),

      P.TL`This silly example really isn't that far off from what countless real web servers are doing ${this.I`right now`}. On every message sent, the client reintroduces themselves to the server. The server then has to take that introduction, and look it up in its database in order to remember who this client is. Looking something up in a database is (relatively) slow.`,

      P.TL`This whole process is silly and absurdly inefficient. The reason why they are doing it is because ${this.http} is ${this.I`stateless`}. It has no memory built into it, so it must fall back on some sort of storage like a database.`,

      P.TL`But what if instead, we made a system of communication where the two parties exchange introductions only when the conversation ${this.B`begins`} and then they remember each other until their conversation ends?`,

      P.TL`Fortunately, we don't have to invent such a system, because it already exists! It is a technology called a ${this.web_socket}.`,

      P.TL`When ${this.taggly} starts running in a browser, it creates a ${this.web_socket} connection with the server. Then, for as long as that browser tab is open, it can send and receive any messages with ${this.I`almost no overhead cost!`} Without all that ${this.http} nonsense, this means each message is tiny! And tiny means fast to send, and fast for the server to receive and respond to.`,

      P.TL`In tests of sending the same data via ${this.http} or via a ${this.web_socket}, I have found that a single server instance can handle a few hundred ${this.http} requests a second. But the same server instance can handle around ${this.B`${20_000}`} ${this.web_socket} requests per second, with the ${this.I`same data payload`}.`,

      // WebSocketPerformance,

      P.TL`That means a server built with ${this.taggly}'s ${this.web_socket} based system will be able to handle around a ${this.B`hundred`} times more requests per second than a traditional ${this.http} based server can.`,

      this.Note().Add(
        P.TL`The way ${this.http} was designed makes sense for the problems it was designed to solve. Modern websites rather abuse ${this.http} and use it for things it is terrible at.`,
      ),
    ];
  }

  RenderFeatures()
  {
    return [
      this.SubTitle().Text("Why use Taggly?"),

      P.TL`There are a ${this.I`lot`} of JavaScript frameworks out there. So many that it's a frequently memed thing. I built yet another one. I want to show you why ${this.taggly} is special, and why you should use it.`,

      ...this.RenderFeaturePerformance(),
      ...this.RenderFeatureHotReload(),
      ...this.RenderFeatureFlexibility(),
      ...this.RenderFeatureNotHTTP(),
    ];
  }

  RenderTODO()
  {
    return [
      P.TL`There's suppose to be a lot more here, but I don't have the time to write it ATM. One more thing on the to do list I guess. ${Emoji.StuckOutTongue().Style()}`,
    ];
  }

  RenderShadowRootTest()
  {
    class StylingTest extends Tag
    {
      static GetMetaURL(){ return import.meta.url; }
      static GetLocalName(){ return "styling-test"; }

      constructor()
      {
        super("test_class")
        .Stylesheet(Style.Get())
        .DisplayFlex()
        .Width("400px")
        .Height("400px");
      }
    }

    return [
      // styles,
      new StylingTest(),
      new StylingTest(),
    ];
  }

  Render()
  {
    return super.Render(
      this.Title().Text("Welcome to Taggly"),

      // ...this.RenderShadowRootTest(),
      ...this.RenderForm(),
      ...this.RenderFeatures(),
      // ...this.RenderTODO(),

      // this.SubTitle().Text("Ready to get started?"),
    );
  }
}

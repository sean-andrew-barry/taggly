import {Tag as Target} from "/js/Tag.js";
import {Page} from "/js/Tags/Docs/Page.js";

export class RegExp extends Page
{
  static Ref()
  {
    return new Anchor().HRef("/docs/global/regexp").Add(
      new Code().Text("RegExp"),
    );
  }

  static Demo(fn)
  {
    return new InteractiveExample().Name("JavaScript Demo: RegExp.lastIndex").Value(fn);
  }

  YesNo(value){ return value === true ? "yes" : "no"; }

  PropertyAttributes(writable = false, enumerable = false, configurable = false)
  {
    return new Table().Add(
      new THead().Add(
        new TR().Add(
          new TH().Class("header").ColSpan("2").Add(
            "Property attributes of ",
            this.LastIndex().PrependText("RegExp: "),
          ),
        ),
      ),
      new TBody().Add(
        new TR().Add(
          new TD().Text("Writable"),
          new TD().Text(this.YesNo(writable)),
        ),
        new TR().Add(
          new TD().Text("Enumerable"),
          new TD().Text(this.YesNo(enumerable)),
        ),
        new TR().Add(
          new TD().Text("Configurable"),
          new TD().Text(this.YesNo(configurable)),
        ),
      ),
    );
  }

  Description(){ return new H2().ID("description").Text("Description"); }

  constructor()
  {
    super();
  }
}

export class dotAll extends RegExp
{
  static Self(){ return new Code().Text("dotAll"); }
  Self(){ return this.constructor.Self(); }

  constructor()
  {
    super().Add(
      new P().Add("The ", this.Self(), " property indicates whether or not the \"", this.FlagS(), "\" flag is used with the regular expression. ", this.Self(), " is a read-only property of an individual regular expression instance."),

      new Div().Add(
        this.Demo(() =>
        {
          const regex1 = new RegExp('foo', 's');

          console.log(regex1.dotAll);
          // expected output: true

          const regex2 = new RegExp('bar');

          console.log(regex2.dotAll);
          // expected output: false
        }),
      ),

      new Test().Value(test =>
      {

      }),

      new Div().Add(
        this.PropertyAttribues(false, false, true),
      ),

      this.Description(),

      new P().Add(
        "The value of ", this.Self(), " is a ", Boolean.Self(), ` and `, Boolean.True(), ` if the `, this.FlagS(), " flag was used; otherwise, ", Boolean.False(), ". The ", this.FlagS(), ` flag indicates that the dot special character `, this.Test(), ` should automatically match the following line terminator ("newline") characters in a string, which it would not match otherwise:`,
      ),

      new UL().Add(
        new LI().Add(`U+000A LINE FEED (LF) ("`, new Code().Text("\n"), `")`),
        new LI().Add(`U+000D CARRIAGE RETURN (CR) ("`, new Code().Text("\r"), `")`),
        new LI().Add(`U+2028 LINE SEPARATOR`),
        new LI().Add(`U+2029 PARAGRAPH SEPARATOR`),
      ),

      new P().Add(`This effectively means the dot will match any character on the Unicode Basic Multilingual Plane (BMP). To allow it to match astral characters, the "`, new Code().Text("u"), `" (unicode) flag should be used. Using both flags in conjunction allows the dot to match any Unicode character, without exceptions.`),

      new P().Add("You cannot change this property directly."),

      new H2().Text("Examples"),

      new H3().Add("Using ", this.Self()),

      new Pre().Text(function()
      {
        var str1 = 'bar\nexample foo example';

        var regex1 = new RegExp('bar.example','s');

        console.log(regex1.dotAll); // Output: true

        console.log(str1.replace(regex1,'')); // Output: foo example

        var str2 = 'bar\nexample foo example';

        var regex2 = new RegExp('bar.example');

        console.log(regex2.dotAll); // Output: false

        console.log(str2.replace(regex2,'')); // Output: bar
                                              //         example foo example
      }),
    );
  }
}

export class Tag extends Page
{
  Code(text){ return new Code().Text(text); }

  CodeLink(text, href)
  {
    return new A().HRef(href).Add(
      this.Code(text),
    );
  }

  PaddingStyle(){ return this.CodeLinkMDN("padding", "/mdn/link/padding-top"); }
  PaddingTopStyle(){ return this.CodeLinkMDN("padding-top", "/mdn/link/padding-top"); }
  PaddingBottomStyle(){ return this.CodeLinkMDN("padding-bottom", "/mdn/link/padding-bottom"); }
  PaddingLeftStyle(){ return this.CodeLinkMDN("padding-left", "/mdn/link/padding-left"); }
  PaddingRightStyle(){ return this.CodeLinkMDN("padding-right", "/mdn/link/padding-right"); }

  CodeI(){ return this.Code("i"); }
  CodeImportant(){ return this.Code("!important"); }
  CodeTag(){ return this.Code("tag"); }
  CodeResult(){ return this.Code("result"); }

  LastIndexBold(){ return new Strong().Add(this.LastIndex()); }

  Title(...tags)
  {
    return new Section().ID("title").Add(
      ...tags
    );
  }

  Syntax(...tags)
  {
    return new Section().ID("syntax").Add(
      ...tags
    );
  }

  Description(...tags)
  {
    return new Section().ID("syntax").Add(
      ...tags
    );
  }

  Examples(...tags)
  {
    return new Section().ID("examples").Add(
      ...tags
    );
  }

  SeeAlso(...tags)
  {
    return new Section().ID("syntax").Add(
      ...tags
    );
  }

  RegExpA()
  {
    return new Anchor().HRef("/docs/global/regexp").Add(
      new Code().Text("RegExp"),
    );
  }

  RegExpTest()
  {
    return new Anchor().HRef("/docs/global/regexp/prototype/test").Add(
      new Code().Text("test()"),
    );
  }

  RegExpExec()
  {
    return new Anchor().HRef("/docs/global/regexp/prototype/exec").Add(
      new Code().Text("exec()"),
    );
  }

  ExecOrTest()
  {
    return [this.RegExpExec(), " or ", this.RegExpTest()];
  }

  constructor()
  {
    super().Add(
      new P().Add(this.LastIndexBold(), ` is a read/write integer property of `, this.RegExpA(), ` instances that specifies the index at which to start the next match.`),

      new P().Add(`Note that `, this.LastIndex(), ` is not a property of the `, this.RegExpA(), ` prototype but is instead only exposed from the `, this.RegExpA(), ` instances.`),

      new Div().Add(
        this.InteractiveExample(),
      ),

      new Div().Add(
        this.PropertyAttributes(true, false, false),
      ),

      this.Description(),

      new P().Add("This property is set only if the regular expression instance used the ", this.FlagG(), " flag to indicate a global search, or the ", this.FlagY(), " flag to indicate a sticky search. The following rules apply when ", this.RegExpTest(), " and ", this.RegExpExec(), " are called on a given input:"),

      new UL().Add(
        new LI().Add("If ", this.LastIndex(), " is greater than the length of the input, ", this.ExecOrTest(), " will not find a match, and", this.LastIndex(), " will be set to ", 0, "."),
        new LI().Add("If ", this.LastIndex(), " is equal to or less than the length of the input, ", this.ExecOrTest(), " will attempt to match the input starting from ", this.LastIndex(), ".").Add(
          new UL().Add(
            new LI().Add("If ", this.ExecOrTest(), " find a match, then ", this.LastIndex(), " will be set to the position of the end of the matched string in the input."),
            new LI().Add("If ", this.ExecOrTest(), " do not find a match, then ", this.LastIndex(), " will be set to ", 0, ".")
          ),
        ),
      ),

      new H2().ID("Examples").Text("Examples"),

      new H3().ID("Using_lastIndex").Text("Using lastIndex"),

      new P().Text("Consider the following sequence of statements:"),

      new Pre().Class("brush: js").Text(function()
      {
        var re = /(hi)?/g;
      }),

      new P().Text("Matches the empty string."),

      new Pre().Class("brush: js").Text(function()
      {
        console.log(re.exec('hi'));
        console.log(re.lastIndex);
      }),

      new P().Add("Returns ", new Code().Text(`["hi", "hi"]`), " with ", this.LastIndex(), " equal to ", 2, "."),

      new Pre().Class("brush: js").Text(function()
      {
        console.log(re.exec('hi'));
        console.log(re.lastIndex);
      }),

      new P().Add("Returns ", new Code().Text(`["", undefined]`), ", an empty array whose zeroth element is the match string. In this case, the empty string because ", this.LastIndex(), " was ", 2, "(and still is ", 2, ") and ", new Code().Text("hi"), " has length ", 2, "."),

      new H2().ID("BrowserCompatibility").Text("Browser compatibility"),

      new P().Add(
        this.BrowserCompatibility(),
      ),

      new H2().ID("SeeAlso").Text("See also"),

      new UL().Add(
        new LI().Add(this.RegExpDotAll()),
        new LI().Add(this.RegExpGlobal()),
        new LI().Add(this.RegExpHasIndices()),
        new LI().Add(this.RegExpIgnoreCase()),
        new LI().Add(this.RegExpMultiline()),
        new LI().Add(this.RegExpSource()),
        new LI().Add(this.RegExpSticky()),
        new LI().Add(this.RegExpUnicode()),
      ),
    );
  }

  Version1()
  {
    return this.Add(
      new Paragraph().Add(
        this.LastIndexBold(),
        ` is a read/write integer property of `,
        this.RegExpA(),
        ` instances that specifies the index at which to start the next match.`,
      ),

      new Paragraph().Add(
        `Note that `,
        this.LastIndex(),
        ` is not a property of the `,
        this.RegExpA(),
        ` prototype but is instead only exposed from the `,
        this.RegExpA(),
        ` instances.`,
      ),
    );
  }

  InteractiveExample()
  {
    return new InteractiveExample().Name("JavaScript Demo: RegExp.lastIndex").Value(() =>
    {
      const regex1 = new RegExp('foo', 'g');
      const str1 = 'table football, foosball';

      regex1.test(str1);

      console.log(regex1.lastIndex);
      // expected output: 9

      regex1.test(str1);

      console.log(regex1.lastIndex);
      // expected output: 19
    });
  }

  TestExample()
  {
    function Add(...values)
    {
      for (let i = 0; i < values.length; i++)
      {
        const value = values[i];
        if (value !== undefined)
        {
          this.AppendChild(value);
        }
      }

      return this;
    }


  }
}

// export default new Class().Value(tag =>
// {
//   const PaddingX  = tag.Method("PaddingX" );
//   const PaddingY  = tag.Method("PaddingY" );
//   const PaddingXY = tag.Method("PaddingXY");

//   // new Guide().Add(
//   //   new H2().Text("Welcome to Taggly's documentation!"),
//   //   new Paragraph().Add(
//   //     new H2().Text("Getting started"),
//   //     new Span().HTML`The first thing to understand about using Taggly is that nearly everything is a ${Tag}`,
//   //   ),
//   // );
// });

export default new Highlighter(Tag, tag =>
{
  tag.Query("method.Add", m =>
  {
    m.Query("method.Add").Add(
      new P().Add("Here's a description of how the Add function works"),
    );
    m.Query("varargs").Add(
      new P().Add("Accepts any number of values"),
    );
    m.QueryEach("identifier.values", tag => tag.Add(
      new P().Add("An array of values that will be converted into ", new Code().Text("Node"), "s."),
    ));
    m.QueryEach("identifier.AppendChild", tag => tag.Add(
      new A().HRef("Tag/prototype/AppendChild"),
    ));

    m.Add(
      new P().Add("Some stuff about how to use this function, such as examples"),
      new P().Add("Maybe a live demo as well"),
      new Pre().Value(async function()
      {
        const {Div} = await import("/js/Tags/Div.js");
      }),
    );
  });
});

// export default function(module)
// {
//   const Add = module.Query("method.Add");
//   const Remove = module.Query("method.Remove");
//   const Padding = module.Query("method.Padding");
//   const PaddingX = module.Query("method.PaddingX");
//   const PaddingY = module.Query("method.PaddingY");
//   const PaddingXY = module.Query("method.PaddingXY");
// }

import {Tag} from "/js/Docs/Tag.js";
import {P} from "/js/Tags/P.js";
import {H2} from "/js/Tags/H2.js";
import {UL} from "/js/Tags/UL.js";
import {LI} from "/js/Tags/LI.js";
import {Code} from "/js/Tags/Code.js";

// export default new Docs(Tag.prototype.Padding);

export class Docs extends Page
{
  static Import(path)
  {
    return new Promise((resolve, reject) =>
    {
      import(path)
      .then(mod =>
      {
        resolve(mod);
      })
      .catch(error =>
      {
        resolve(undefined);
      });
    });
  }

  static async Load(object, name, keys)
  {
    for (const key of keys)
    {
      const value = object[key];
      const mod = await this.Import(`/js/Tags/Page/Docs/${name}/${key}.js`);

      await this.Register(value, mod);
    }
  }

  static async Register(ctor)
  {
    const proto = ctor.prototype;

    const symbols = Object.getOwnPropertySymbols(ctor);

    for (const name of Object.getOwnPropertyNames(ctor))
    {
      const value = ctor[name];
      const mod = await this.Import(`/js/Tags/Page/Docs/${ctor.name}/${name}.js`);
    }
  }

  constructor(source)
  {
    super().Add(
      this.article = new Article().Add(
        this.title = new H2().Class("title"),
        this.subtitle = new H2().Class("subtitle"),
        this.syntax = new Div(),
        this.examples = new Div(),
        this.description = new Div(),
        this.see = new UL(),
      ),
    );
  }

  Title(...args){ this.title.Add(...args); return this; }
  Subtitle(...args){ this.subtitle.Add(...args); return this; }
  Syntax(...args){ this.syntax.Add(...args); return this; }
  See(...args){ this.see.Add(LI.Add(...args)); return this; }

  Title(...args)
  {
    this.article.Add(
      new H2().Class("title").Add(...args),
    );

    return this;
  }

  Subtitle(...args)
  {
    this.article.Add(
      new H2().Class("subtitle").Add(...args),
    );

    return this;
  }

  SeeAll(...args)
  {
    this.article.Add(
      UL.Add(
        args.map(arg =>
        {
          if (!(arg instanceof LI))
          {
            arg = new LI().Add(arg);
          }

          return arg;
        }),
      ),
    );

    return this;
  }

  get BooleanLiteral(){ return A.Add(Code.Add`Boolean`).HRef("/mdn/global/Boolean"); }
  get TrueLiteral(){ return A.Add(Code.Add`true`).HRef("/mdn/global/Boolean"); }
  get FalseLiteral(){ return A.Add(Code.Add`false`).HRef("/mdn/global/Boolean"); }
}

export class Padding extends Docs
{
  SyntaxExample()
  {
    const result = tag.Padding(value, important);
  }

  Title(){ return H2.Add`Tag.prototype.Padding`; }
  Subtitle(){ return H2.Add`The ${this.self} method sets the ${this.PaddingStyle()} css style.`; }
  Description(){ return P.Add`Sets the ${this.PaddingStyle()} css style.`; }

  Syntax()
  {
    return Pre.From(Tag.prototype.Padding).Add(
      Tooltip.Target(`[name=result]`).Add`The ${this._this} reference`,
      Tooltip.Target(`[name=tag]`).Add`${Code.Add`tag`} is an instance of a ${this.tag}`,
      Tooltip.Target(`[name=value]`).Add`The CSS value. Can be anything that converts to a ${this.string} with ${this.to_string}`,
    );
  }

  Examples()
  {
    return [
      new Test().Value(async function()
      {
        const {Div} = await import("/js/Tags/Div.js");
        const div = new Div().Padding(value, important);

        this.Assert(div.GetStyles().padding).Is("2em");
      }),
    ];
  }

  See()
  {
    return [
      GetStyles,
      SetStyle,
      PaddingX,
      PaddingY,
      PaddingXY,
    ];
  }

  See()
  {
    return [
      Tag.prototype.GetStyles,
      Tag.prototype.SetStyle,
      Tag.prototype.PaddingX,
      Tag.prototype.PaddingY,
      Tag.prototype.PaddingXY,
    ];
  }

  constructor(...args)
  {
    super(...args)
    .Title`Tag.prototype.Padding`
    .Subtitle`The ${this.self} method sets the ${this.PaddingStyle()} css style.`
    .Syntax(
      Pre.From(Tag.prototype.Padding).Add(
        Tooltip.Target(`[name=result]`).Add`The ${this._this} reference`,
        Tooltip.Target(`[name=tag]`).Add`${Code.Add`tag`} is an instance of a ${this.tag}`,
        Tooltip.Target(`[name=value]`).Add`The CSS value. Can be anything that converts to a ${this.string} with ${this.to_string}`,
      ),
    )
    .Description`Sets the ${this.PaddingStyle()} css style.`
    .Examples(
      new Test().Value(async function()
      {
        const {Div} = await import("/js/Tags/Div.js");
        const div = new Div().Padding(value, important);

        this.Assert(div.GetStyles().padding).Is("2em");
      }),
    )
    .SeeAll(
      GetStyles,
      SetStyle,
      PaddingX,
      PaddingY,
      PaddingXY,
    );
  }
}

export default function(page, code)
{
  return page
}

export class Padding extends Docs
{
  static Self(){ return new Code().Text("Padding"); }
  static Terms(){ return ["padding", "css", "style"]; }
  static Path(){ return "/Tag/prototype/Padding"; }
  static For(){ return Tag.prototype.Padding; }

  get tag(){ return A.Add(Code.Add`Tag`).HRef("/docs/Tag"); }
  get boolean(){ return A.Add(Code.Add`Boolean`).HRef("/docs/Boolean"); }
  get _this(){ return Code.Add`this`; }
  get to_string(){ return Code.Add`.toString()`; }
  get string(){ return A.Add(Code.Add`String`).HRef("pseudo/mdn/string"); }

  constructor()
  {
    super()
    .Title(
      H2.Add`Tag.prototype.Padding`,
      P.Add`The ${this.self} method sets the ${this.PaddingStyle()} css style.`,
    )
    .Syntax(
      new Pre().ID("syntax").Type("js").Body(() =>
      {
        const result = tag.Padding(value, important);
      }),
      Tooltip.Target(`#syntax token[name=result]`).Add`The ${this._this} reference`,
      Tooltip.Target(`#syntax token[name=tag]`).Add`${Code.Add`tag`} is an instance of a ${this.tag}`,
      Tooltip.Target(`#syntax token[name=value]`).Add`The CSS value. Can be anything that converts to a ${this.string} with ${this.to_string}`,

      Pre.Add(
        new JavaScript()
        .Const()
        .Variable`result ${this.tag} is an instance of a ${this.Link(Tag)}`
        .Equals()
        .Variable`tag ${this.tag} is an instance of a ${this.Link(Tag)}`
        .Member()
        .Method`Padding`
        .OpenParameter()
        .Variable("value")
        .Variable("important")
        .CloseParameter()
        ,
      ),
      UL.Add(
        LI.Add`${this.CodeTag()} is an instance of a ${this.Link(Tag)}`,
        LI.Add`${this.CodeResult()} is the ${this.CodeThis()} returned by the function`,
        LI.Add`${this.i} is a ${this.boolean} that sets the ${this.css} ${this.important} property`,
        UL.Add(
          new LI().Add("If ", Boolean.True(), " the style will be flagged as ", this.CodeImportant()),
          new LI().Add("If ", Boolean.False(), " the style will ", new Strong().Text("not"), " be flagged as ", this.CodeImportant()),
        ),
      ),
    )
    .Description(
      new P().Add("Sets the ", this.PaddingStyle(), " css style."),
    )
    .Examples(
      new Test().Value(async function()
      {
        const {Div} = await import("/js/Tags/Div.js");
        const div = new Div().Padding(value, important);

        this.Assert(div.GetStyles().padding).Is("2em");
      }),
    )
    .SeeAlso(
      UL.Add(
        new LI().Add(GetStyles.Link()),
        new LI().Add(SetStyle.Link()),
        new LI().Add(PaddingX.Link()),
        new LI().Add(PaddingY.Link()),
        new LI().Add(PaddingXY.Link()),
      ),
    );
  }
}

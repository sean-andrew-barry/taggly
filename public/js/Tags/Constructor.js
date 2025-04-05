import {Tag} from "/js/Tag.js";
import {ObjectUtilities} from "/js/Utility/Object.js";
import {StringUtilities} from "/js/Utility/String.js";

const CONSTRUCTORS = new WeakMap();

export class Constructor extends Tag
{
  static GetLocalName(){ return "ctor"; }
  static GetNodeName(){ return "ctor"; }

  static Has(ctor){ return CONSTRUCTORS.has(ctor); }
  static Get(ctor){ return CONSTRUCTORS.get(ctor); }

  static Find(ctor)
  {
    if (this.Has(ctor))
    {
      return this.Get(ctor);
    }
    else
    {
      const parent = ObjectUtilities.GetParent(ctor);
      return this.Find(parent);
    }
  }

  constructor(ctor, classes)
  {
    if (ctor.hasOwnProperty(Symbol.species))
    {
      ctor = ctor[Symbol.species];
    }

    if (CONSTRUCTORS.has(ctor))
    {
      return CONSTRUCTORS.get(ctor);
    }

    super(classes);
    this.AddClass(ctor.name);
    this.AddClass(ctor.GetLocalName());
    this.ctor = ctor;

    if (ctor === Tag)
    {
      window.document.head.appendChild(this.GetNode());
    }
    else
    {
      this.ctor.RegisterHTMLName();
      // ctor.Bind();

      const parent = ObjectUtilities.GetParent(this.ctor);
      this.ctor.Constructor(parent).AppendChild(this);

      // TAG_ENCODER.RegisterNames(this.ctor);
    }

    CONSTRUCTORS.set(ctor, this);
    CONSTRUCTORS.set(this, ctor);
  }

  Bind(base, name, symbol)
  {
    this.ctor.Bind(base, name, symbol);
    return this;
  }

  // Redirect New to create an instance of the Constructor.ctor, rather than Constructor itself
  New(...args)
  {
    const ctor = this.GetConstructor();
    return ctor.New.apply(ctor, args);
  }

  Hash(string)
  {
    if (typeof(string) !== "string")
    {
      throw new Error(`Constructor.Hash expected a string`);
    }

    const hash = StringUtilities.HashCyrb32(string).toString(16);
    this.hash = hash;
    return this.AddClass(hash);
  }

  Private(v){ return this.ToggleAttribute("private", v); }

  Public(v)
  {
    if (v !== false)
    {
      this.ctor.AddPublicName();
    }

    return this.ToggleAttribute("public", v);
  }

  GetConstructor(){ return this.ctor; }
  GetHash(){ return this.hash; }

  // // Open Graph Properties
  // Title      (v){ return this.SetAttribute("og:title"           , v); }
  // Description(v){ return this.SetAttribute("og:description"     , v); }
  // Determiner (v){ return this.SetAttribute("og:determiner"      , v); }
  // Locale     (v){ return this.SetAttribute("og:locale"          , v); }
  // LocaleAlt  (v){ return this.SetAttribute("og:locale:alternate", v); }
  // SiteName   (v){ return this.SetAttribute("og:site_name"       , v); }
  // Type       (v){ return this.SetAttribute("og:type"            , v); }
  // Url        (v){ return this.SetAttribute("og:url"             , v); }
  //
  // Image         (v){ return this.SetAttribute("og:image"           , v); }
  // ImageURL      (v){ return this.SetAttribute("og:image"           , v); }
  // ImageSecureURL(v){ return this.SetAttribute("og:image:secure_url", v); }
  // ImageType     (v){ return this.SetAttribute("og:image:type"      , v); }
  // ImageWidth    (v){ return this.SetAttribute("og:image:width"     , v); }
  // ImageHeight   (v){ return this.SetAttribute("og:image:height"    , v); }
  // ImageAlt      (v){ return this.SetAttribute("og:image:alt"       , v); }
  //
  // VideoURL      (v){ return this.SetAttribute("og:video"           , v); }
  // VideoSecureURL(v){ return this.SetAttribute("og:video:secure_url", v); }
  // VideoType     (v){ return this.SetAttribute("og:video:type"      , v); }
  // VideoWidth    (v){ return this.SetAttribute("og:video:width"     , v); }
  // VideoHeight   (v){ return this.SetAttribute("og:video:height"    , v); }
  //
  // AudioURL      (v){ return this.SetAttribute("og:audio"           , v); }
  // AudioSecureURL(v){ return this.SetAttribute("og:audio:secure_url", v); }
  // AudioType     (v){ return this.SetAttribute("og:audio:type"      , v); }
  //
  // ImageTypeJPG(){ return this.ImageType("image/jpg"); }
  // ImageTypePNG(){ return this.ImageType("image/png"); }
  // VideoTypeMP4(){ return this.VideoType("video/mp4"); }
  // AudioTypeMP3(){ return this.AudioType("audio/mp3"); }
  // TypeWebsite(){ return this.Type("website"); }
  // TypeArticle(){ return this.Type("article"); }
  //
  // HasTitle(){ return this.HasAttribute("og:title"); }
  // GetTitle(){ return this.GetAttribute("og:title"); }
}

// Constructor.Bind();
// Constructor.New(Constructor);

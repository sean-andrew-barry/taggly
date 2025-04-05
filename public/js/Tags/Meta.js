import {Tag} from "/js/Tag.js";

export class Meta extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "meta"; }

  Charset(v){ return this.SetAttribute("charset", v); }
  Content(v){ return this.SetAttribute("content", v); }
  Property(v){ return this.SetAttribute("property", v); }

  Apply(action, args)
  {
    switch (action)
    {
      case "charset": return this.Charset(...args);
      case "content": return this.Content(...args);
      case "property": return this.Property(...args);
      default: return super.Apply(action, args);
    }
  }

  // Open Graph Properties
  Title      (v){ return this.Property("og:title"           ).Content(v); }
  Description(v){ return this.Property("og:description"     ).Content(v); }
  Determiner (v){ return this.Property("og:determiner"      ).Content(v); }
  Locale     (v){ return this.Property("og:locale"          ).Content(v); }
  LocaleAlt  (v){ return this.Property("og:locale:alternate").Content(v); }
  SiteName   (v){ return this.Property("og:site_name"       ).Content(v); }
  Type       (v){ return this.Property("og:type"            ).Content(v); }
  URL        (v){ return this.Property("og:url"             ).Content(v); }

  EnUS(v){ return this.Locale("en_US"); }
  EnGB(v){ return this.Locale("en_GB"); }

  DeterminerA(v){ return this.Determiner("a"); }
  DeterminerAn(v){ return this.Determiner("an"); }
  DeterminerThe(v){ return this.Determiner("the"); }
  DeterminerBlank(v){ return this.Determiner(""); }
  DeterminerAuto(v){ return this.Determiner("auto"); }

  Image         (v){ return this.Property("og:image"           ).Content(v); }
  ImageURL      (v){ return this.Property("og:image"           ).Content(v); }
  ImageSecureURL(v){ return this.Property("og:image:secure_url").Content(v); }
  ImageType     (v){ return this.Property("og:image:type"      ).Content(v); }
  ImageWidth    (v){ return this.Property("og:image:width"     ).Content(v); }
  ImageHeight   (v){ return this.Property("og:image:height"    ).Content(v); }
  ImageAlt      (v){ return this.Property("og:image:alt"       ).Content(v); }

  VideoURL      (v){ return this.Property("og:video"           ).Content(v); }
  VideoSecureURL(v){ return this.Property("og:video:secure_url").Content(v); }
  VideoType     (v){ return this.Property("og:video:type"      ).Content(v); }
  VideoWidth    (v){ return this.Property("og:video:width"     ).Content(v); }
  VideoHeight   (v){ return this.Property("og:video:height"    ).Content(v); }

  AudioURL      (v){ return this.Property("og:audio"           ).Content(v); }
  AudioSecureURL(v){ return this.Property("og:audio:secure_url").Content(v); }
  AudioType     (v){ return this.Property("og:audio:type"      ).Content(v); }

  ImageTypeJPG(){ return this.ImageType("image/jpg"); }
  ImageTypePNG(){ return this.ImageType("image/png"); }
  VideoTypeMP4(){ return this.VideoType("video/mp4"); }
  AudioTypeMP3(){ return this.AudioType("audio/mp3"); }
  TypeWebsite(){ return this.Type("website"); }
  TypeArticle(){ return this.Type("article"); }

  TileColor(v){ return this.Name("msapplication-TileColor").Content(v); }
  ThemeColor(v){ return this.Name("theme-color").Content(v); }
  Viewport(v){ return this.Name("viewport").Content(v); }
}

import {Tag} from "/js/Tag.js";
import {Constructor} from "/js/Tags/Constructor.js";

export class Preview extends Tag
{
  SetNode(){ return super.SetNode(this.constructor.CreateFragment()); }

  Search(tag)
  {
    // const ctor = tag.GetPrevSibling() || tag.GetParent();
    const ctor = tag.GetParent();

    if (!ctor) return;
    else if (ctor instanceof Constructor) return ctor;
    else return this.Search(ctor);
  }

  Find(tag, matches = [])
  {
    const ctor = this.Search(tag);

    if (ctor)
    {
      matches.push(ctor);
      this.Find(ctor, matches);
    }

    return matches;
  }

  FindAttribute(scope, name)
  {
    for (let i = 0; i < scope.length; i++)
    {
      const ctor = scope[i];
      if (ctor.HasAttribute(name))
      {
        return ctor.GetAttribute(name);
      }
    }
  }

  AddMeta(scope, names = [])
  {
    for (let i = 0; i < names.length; i++)
    {
      const name = names[i];

      const value = this.FindAttribute(scope, name);

      if (value !== undefined)
      {
        // console.log("Generating preview metadata", name, value);
        this.AppendChild(Tag.Meta().Property(name).Content(value));
      }
    }
  }

  Load(root)
  {
    const scope = this.Find(root, [root]);
    // console.log("Found scope", scope);

    this.Clear().AddMeta(scope, [
      "og:title",
      "og:description",
      "og:determiner",
      "og:locale",
      "og:locale:alternate",
      "og:site_name",
      "og:type",
      "og:url",

      "og:image",
      "og:image:secure_url",
      "og:image:type",
      "og:image:width",
      "og:image:height",
      "og:image:alt",

      "og:video",
      "og:video:secure_url",
      "og:video:type",
      "og:video:width",
      "og:video:height",

      "og:audio",
      "og:audio:secure_url",
      "og:audio:type",
    ]);

    return this;
  }

  // Open Graph Properties
  Title      (v){ return this.SetAttribute("og:title"           , v); }
  Description(v){ return this.SetAttribute("og:description"     , v); }
  Determiner (v){ return this.SetAttribute("og:determiner"      , v); }
  Locale     (v){ return this.SetAttribute("og:locale"          , v); }
  LocaleAlt  (v){ return this.SetAttribute("og:locale:alternate", v); }
  SiteName   (v){ return this.SetAttribute("og:site_name"       , v); }
  Type       (v){ return this.SetAttribute("og:type"            , v); }
  Url        (v){ return this.SetAttribute("og:url"             , v); }

  EnUS(v){ return this.Locale("en_US"); }
  EnGB(v){ return this.Locale("en_GB"); }
  DeterminerA(v){ return this.Determiner("a"); }
  DeterminerAn(v){ return this.Determiner("an"); }
  DeterminerThe(v){ return this.Determiner("the"); }
  DeterminerBlank(v){ return this.Determiner(""); }
  DeterminerAuto(v){ return this.Determiner("auto"); }

  Image         (v){ return this.SetAttribute("og:image"           , v); }
  ImageURL      (v){ return this.SetAttribute("og:image"           , v); }
  ImageSecureURL(v){ return this.SetAttribute("og:image:secure_url", v); }
  ImageType     (v){ return this.SetAttribute("og:image:type"      , v); }
  ImageWidth    (v){ return this.SetAttribute("og:image:width"     , v); }
  ImageHeight   (v){ return this.SetAttribute("og:image:height"    , v); }
  ImageAlt      (v){ return this.SetAttribute("og:image:alt"       , v); }

  VideoURL      (v){ return this.SetAttribute("og:video"           , v); }
  VideoSecureURL(v){ return this.SetAttribute("og:video:secure_url", v); }
  VideoType     (v){ return this.SetAttribute("og:video:type"      , v); }
  VideoWidth    (v){ return this.SetAttribute("og:video:width"     , v); }
  VideoHeight   (v){ return this.SetAttribute("og:video:height"    , v); }

  AudioURL      (v){ return this.SetAttribute("og:audio"           , v); }
  AudioSecureURL(v){ return this.SetAttribute("og:audio:secure_url", v); }
  AudioType     (v){ return this.SetAttribute("og:audio:type"      , v); }

  ImageTypeJPG(){ return this.ImageType("image/jpg"); }
  ImageTypePNG(){ return this.ImageType("image/png"); }
  VideoTypeMP4(){ return this.VideoType("video/mp4"); }
  AudioTypeMP3(){ return this.AudioType("audio/mp3"); }
  TypeWebsite(){ return this.Type("website"); }
  TypeArticle(){ return this.Type("article"); }
}

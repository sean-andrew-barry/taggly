import {Tag} from "/js/Tag.js";
import {Widget} from "/js/Tags/Widget.js";
import {Meta} from "/js/Tags/Meta.js";
import {Link} from "/js/Tags/Link.js";
import {Title} from "/js/Tags/Title.js";
import {Div} from "/js/Tags/Div.js";
import {Span} from "/js/Tags/Span.js";
import {Strong} from "/js/Tags/Strong.js";
import {NoScript} from "/js/Tags/NoScript.js";
import {P} from "/js/Tags/P.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {bulma} from "/js/Tags/Bulma.js";

export class Page extends Widget
{
  static Match(url){ return url; }

  static GetLocalName(){ return "page"; }
  static GetMetaURL(){ return import.meta.url; }

  static GetTitle(){ return this.name; }
  static GetDescription(){}
  static GetDeterminer(){}
  static GetLocale(){ return "en_US"; }
  static GetLocaleAlt(){}
  static GetType(){}
  static GetURL(...url){ return `/${url.join("/")}/`; }
  static GetSiteName(){ return "Taggly"; }
  static GetImage(){}
  static GetImageURL(){}
  static GetImageSecureURL(){}
  static GetImageType(){}
  static GetImageWidth(){}
  static GetImageHeight(){}
  static GetImageAlt(){}
  static GetVideoURL(){}
  static GetVideoSecureURL(){}
  static GetVideoType(){}
  static GetVideoWidth(){}
  static GetVideoHeight(){}
  static GetAudioURL(){}
  static GetAudioSecureURL(){}
  static GetAudioType(){}
  static GetCharSet(){ return "utf-8"; }
  static GetViewport(){ return "width=device-width, initial-scale=1.0"; }
  static GetTileColor(){ return "#2d89ef"; }
  static GetThemeColor(){ return "#2f3ba2"; }
  static GetShortcutIcon(){ return "data:;base64,iVBORw0KGgo="; }
  static GetAppleTouchIcon(){ return "/safari-pinned-tab.svg"; }
  static GetMaskIcon(){ return "/safari-pinned-tab.svg"; }
  static GetMaskIconColor(){ return "#3359a1"; }
  static GetManifest(){ return "/manifest.json"; }
  static GetFavIcon16(){}
  static GetFavIcon32(){}

  static CreateDefaultTitle(){ return Tag.Custom("title").Text(`${this.GetTitle()} - ${this.GetSiteName()}`); }
  static CreateTitle(v = this.GetTitle()){ if (v) return new Meta().Title(v); }
  static CreateDescription(v = this.GetDescription()){ if (v) return new Meta().Description(v); }
  static CreateDeterminer(v = this.GetDeterminer()){ if (v) return new Meta().Determiner(v); }
  static CreateLocale(v = this.GetLocale()){ if (v) return new Meta().Locale(v); }
  static CreateLocaleAlt(v = this.GetLocaleAlt()){ if (v) return new Meta().LocaleAlt(v); }
  static CreateSiteName(v = this.GetSiteName()){ if (v) return new Meta().SiteName(v); }
  static CreateType(v = this.GetType()){ if (v) return new Meta().Type(v); }
  static CreateURL(v = this.GetURL()){ if (v) return new Meta().URL(v); }

  static CreateImage(v = this.GetImage()){ if (v) return new Meta().Image(v); }
  static CreateImageURL(v = this.GetImageURL()){ if (v) return new Meta().ImageURL(v); }
  static CreateImageSecureURL(v = this.GetImageSecureURL()){ if (v) return new Meta().ImageSecureURL(v); }
  static CreateImageType(v = this.GetImageType()){ if (v) return new Meta().ImageType(v); }
  static CreateImageWidth(v = this.GetImageWidth()){ if (v) return new Meta().ImageWidth(v); }
  static CreateImageHeight(v = this.GetImageHeight()){ if (v) return new Meta().ImageHeight(v); }
  static CreateImageAlt(v = this.GetImageAlt()){ if (v) return new Meta().ImageAlt(v); }

  static CreateVideoURL(v = this.GetVideoURL()){ if (v) return new Meta().VideoURL(v); }
  static CreateVideoSecureURL(v = this.GetVideoSecureURL()){ if (v) return new Meta().VideoSecureURL(v); }
  static CreateVideoType(v = this.GetVideoType()){ if (v) return new Meta().VideoType(v); }
  static CreateVideoWidth(v = this.GetVideoWidth()){ if (v) return new Meta().VideoWidth(v); }
  static CreateVideoHeight(v = this.GetVideoHeight()){ if (v) return new Meta().VideoHeight(v); }

  static CreateAudioURL(v = this.GetAudioURL()){ if (v) return new Meta().AudioURL(v); }
  static CreateAudioSecureURL(v = this.GetAudioSecureURL()){ if (v) return new Meta().AudioSecureURL(v); }
  static CreateAudioType(v = this.GetAudioType()){ if (v) return new Meta().AudioType(v); }

  static CreateCharSet(v = this.GetCharSet()){ if (v) return new Meta().CharSet(v); }
  static CreateViewport(v = this.GetViewport()){ if (v) return new Meta().Viewport(v); }
  static CreateTileColor(v = this.GetTileColor()){ if (v) return new Meta(v).TileColor(v); }
  static CreateThemeColor(v = this.GetThemeColor()){ if (v) return new Meta(v).ThemeColor(v); }

  static CreateShortcutIcon(v = this.GetShortcutIcon()){ if (v) return new Link().ShortcutIcon(v); }
  static CreateAppleTouchIcon(v = this.GetAppleTouchIcon()){ if (v) return new Link().AppleTouchIcon(v); }
  static CreateManifest(v = this.GetManifest()){ if (v) return new Link().Manifest(v); }
  static CreateFavIcon16(v = this.GetFavIcon16()){ if (v) return new Link().Icon("image/png", v); }
  static CreateFavIcon32(v = this.GetFavIcon32()){ if (v) return new Link().Icon("image/png", v); }

  static CreateMaskIcon(mask = this.GetMaskIcon(), color = this.GetMaskIconColor())
  {
    if (mask && color)
    {
      return new Link().MaskIcon(mask, color);
    }
  }

  static CreateStyles(...styles)
  {
    return new Fragment().Add(
      bulma,
      new Link().Stylesheet().RawHRef(`https://cdn.jsdelivr.net/npm/bulma-pageloader@0.3.0/dist/css/bulma-pageloader.min.css`),
      ...styles,
    );
  }

  static CreateMetadata()
  {
    return new Fragment().Add(
      this.CreateDefaultTitle(),
      this.CreateTitle(),
      this.CreateDescription(),
      this.CreateDeterminer(),
      this.CreateLocale(),
      this.CreateLocaleAlt(),
      this.CreateSiteName(),
      this.CreateType(),
      this.CreateURL(),
      this.CreateImage(),
      this.CreateImageURL(),
      this.CreateImageSecureURL(),
      this.CreateImageType(),
      this.CreateImageWidth(),
      this.CreateImageHeight(),
      this.CreateImageAlt(),
      this.CreateVideoURL(),
      this.CreateVideoSecureURL(),
      this.CreateVideoType(),
      this.CreateVideoWidth(),
      this.CreateVideoHeight(),
      this.CreateAudioURL(),
      this.CreateAudioSecureURL(),
      this.CreateAudioType(),
      this.CreateCharSet(),
      this.CreateViewport(),
      this.CreateTileColor(),
      this.CreateThemeColor(),
      this.CreateShortcutIcon(),
      this.CreateAppleTouchIcon(),
      this.CreateMaskIcon(),
      this.CreateManifest(),
      this.CreateFavIcon16(),
      this.CreateFavIcon32(),
      this.CreateStyles(),
    );
  }
}

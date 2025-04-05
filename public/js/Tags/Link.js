import {Tag} from "/js/Tag.js";
import {StringUtilities} from "/js/Utility/String.js";

export class Link extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "link"; }

  async GenerateCSS()
  {
    const response = await fetch(this.GetAttribute("href"));
    const text = await response.text();

    // console.log(text);

    this.InnerHTML(`<style>${text}</style>`);
    const styles = this.GetFirstChildNode();
    const sheet = styles.sheet;
    const rules = styles.sheet.cssRules;

    const results = [];
    const missing = [];

    for (let i = 0; i < rules.length; i++)
    {
      const rule = rules[i];
      // console.log(i, rule);
      const selector = rule.selectorText;

      let result;
      if (!selector)
      {
        result = `Tag.CSS()`;
      }
      else if (selector.includes("\""))
      {
        result = `Tag.CSS(\`${selector}\`)`;
      }
      else
      {
        result = `Tag.CSS("${selector}")`;
      }

      let style = rule.style || rule.cssRules.style;
      if (!style)
      {
        console.log("No style for rule", rule);
        continue;
      }

      for (let j = 0; j < style.length; j++)
      {
        const key = style[j];
        const val = style.getPropertyValue(key);
        const fn_name = StringUtilities.FromKebabCase(key);
        // console.log(j, key, fn_name, val);

        if (!Tag.prototype[fn_name])
        {
          missing.push(`${fn_name}(v, i){ return this.SetStyle("${key}", v, i); }`);
          // console.warn("Tag missing", fn_name, key);
        }

        if (val.includes("\""))
        {
          result += `.${fn_name}(${val})`;
        }
        else
        {
          result += `.${fn_name}("${val}")`;
        }
      }

      results.push(result);
    }

    // console.log(missing.join("\n"));
    console.log(results.join(",\n"));
  }

  Stylesheet(){ return this.Rel("stylesheet"); }
  Alternate(){ return this.Rel("alternate"); }

  Manifest(v){ return this.Rel("manifest").HRef(v); }
  Icon(t, v){ return this.Rel("icon").Type(t).HRef(v); }
  MaskIcon(v, c){ return this.Rel("mask-icon").HRef(v).Color(c); }
  ShortcutIcon(v){ return this.Rel("shortcut icon").HRef(v); }
  AppleTouchIcon(v){ return this.Rel("apple-touch-icon").HRef(v); }

  As(value){ return this.SetAttribute("as", value); }
  AsAudio(){ return this.As("audio"); }
  AsVideo(){ return this.As("video"); }
  AsTrack(){ return this.As("track"); }
  AsScript(){ return this.As("script"); }
  AsStyle(){ return this.As("style"); }
  AsFont(){ return this.As("font"); }
  AsImage(){ return this.As("image"); }
  AsFetch(){ return this.As("fetch"); }
  AsWorker(){ return this.As("worker"); }
  AsEmbed(){ return this.As("embed"); }
  AsObject(){ return this.As("object"); }
  AsDocument(){ return this.As("document"); }
}

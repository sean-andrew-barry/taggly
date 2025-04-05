import {Tag} from "/js/Tag.js";
import {Input as InputEvent} from "/js/Event/Input.js";
import {Connect} from "/js/Event/Connect.js";
import {Session} from "/js/Tags/Storage/Session.js";
import {StringUtilities} from "/js/Utility/String.js";

const ALPHA_LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const ALPHA_UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const ALPHA = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
const NUMERIC = new Set("-.1234567890");
const ALPHA_NUMERIC = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
const EMAIL = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_@.");
const URL_SET = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~:/?#[]@!$&'()*+,;=");

export class Input extends Tag
{
  static GetLocalName(){ return "input"; }
  static GetMetaURL(){ return import.meta.url; }

  GetResult(){ return this.GetValue(); }

  [InputEvent](event)
  {
    // if (this.HasAttribute("id"))
    // {
    //   const key = this.GetID("id");
    //   const session = Session.Get();
    //
    //   const value = this.GetValue();
    //
    //   session.Set(key, value);
    //   // console.log("Saving session value", key, value);
    // }
  }

  [Connect](event)
  {
    // console.log("Input Connect", this.GetHash());
  }

  Cache(key)
  {
    const session = Session.Get();

    if (session.Has(key))
    {
      const value = session.Get(key);
      console.log("Loaded session value for", key, value);
      this.Value(value);
    }

    return this.SetAttribute("cache", key);
  }

  ID(id)
  {
    const result = super.ID(id);

    const session = Session.Get();

    if (session.Has(id))
    {
      const value = session.Get(id);
      this.Value(value);
    }

    return result;
  }

  Ban(set)
  {
    if (typeof(set) === "string")
    {
      set = new Set(set);
    }

    return this.OnInput(event =>
    {
      event.preventDefault();

      const value = this.GetValue();
      const legal = [];

      for (let i = 0; i < value.length; i++)
      {
        const c = value[i];
        if (!set.has(c)) legal.push(c);
      }

      this.SetValue(legal.join(""));
    });
  }

  AutoComplete(array)
  {
    this.OnInput(event =>
    {
      if (event.defaultPrevented) return;

      const value = event.tag.GetValue();

      const matches = array.sort((a, b) =>
      {
        const distance_a = StringUtilities.LevenshteinDistance(a, value);
        const distance_b = StringUtilities.LevenshteinDistance(b, value);
        return distance_a - distance_b;
      });

      console.log("AutoComplete matches", matches);
    });

    return this;
  }

  BanNumbers(){ return this.Ban("1234567890"); }
  BanAlpha(){ return this.Ban(ALPHA); }
  BanAlphaLower(){ return this.Ban(ALPHA_LOWER); }
  BanAlphaUpper(){ return this.Ban(ALPHA_UPPER); }

  RestrictToLowerCase()
  {
    return this.OnInput(event =>
    {
      event.preventDefault();
      const value = this.GetValue();
      this.SetValue(value.toLowerCase());
    });
  }

  RestrictToUpperCase()
  {
    return this.OnInput(event =>
    {
      event.preventDefault();
      const value = this.GetValue();
      this.SetValue(value.toUpperCase());
    });
  }

  RestrictCharactersToSet(set)
  {
    return this.OnInput(event =>
    {
      event.preventDefault();

      const value = this.GetValue();
      const legal = [];

      for (let i = 0; i < value.length; i++)
      {
        const c = value[i];
        if (set.has(c)) legal.push(c);
      }

      this.SetValue(legal.join(""));
    });
  }

  RestrictToURL(base = window.location.origin)
  {
    return this.OnBlur(event =>
    {
      event.preventDefault();
      const value = this.GetValue();

      try
      {
        const url = new URL(value, base);
        console.log("Restrict to URL", url.href);
        this.SetValue(url.href);
        this.RemoveClass("is-danger");
      }
      catch (error)
      {
        console.error(error);
        this.AddClass("is-danger");
      }
    });
  }

  RestrictToAlpha(){ return this.RestrictCharactersToSet(ALPHA); }
  RestrictToNumeric(){ return this.RestrictCharactersToSet(NUMERIC); }
  RestrictToAlphaNumeric(){ return this.RestrictCharactersToSet(ALPHA_NUMERIC); }
  RestrictToEmail(){ return this.RestrictCharactersToSet(EMAIL); }
}

export {Input as INPUT};

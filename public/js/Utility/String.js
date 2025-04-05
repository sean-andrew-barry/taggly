const TITLE_CACHE = {};
const SLUG_CACHE = {};
const KEBAB_CASE_CACHE = {};
const SNAKE_CASE_CACHE = {};
const ID_INDEXES = {};

const SPACE = new Set("\t\n\v\f\r ");
const ALPHA = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const ALNUM = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const UPPER = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER = new Set("abcdefghijklmnopqrstuvwxyz");
const DIGIT = new Set("0123456789");
const PUNCT = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

import {ToTitleCase} from "/js/External/ToTitleCase.js";
import {ToSlug} from "/js/External/ToSlug.js";
import {Hash} from "/js/External/Hash.js";
import {HashCyrb32, HashCyrb53} from "/js/External/HashCyrb53.js";
// import {HashCyrb53} from "/js/External/HashCyrb53.js";
// import {HashCyrb32} from "/js/External/HashCyrb32.js";
import {HashCode} from "/js/External/HashCode.js";
import {HashMurmur3} from "/js/External/HashMurmur3.js";
import {HashFNV1a} from "/js/External/HashFNV1a.js";
import {ToBase64} from "/js/External/ToBase64.js";
import {LevenshteinDistance} from "/js/External/LevenshteinDistance.js";
import {DiceCoefficient} from "/js/External/DiceCoefficient.js";

export class StringUtilities
{
  static GetTitleCacheObject(){ return TITLE_CACHE; }
  static GetSlugCacheObject(){ return SLUG_CACHE; }
  static GetKebabCaseCacheObject(){ return KEBAB_CASE_CACHE; }
  static GetSnakeCaseCacheObject(){ return SNAKE_CASE_CACHE; }
  static GetIdIndexesObject(){ return ID_INDEXES; }

  static IsAlpha(c){ return ALPHA.has(c); }
  static IsAlNum(c){ return ALNUM.has(c); }
  static IsUpper(c){ return UPPER.has(c); }
  static IsLower(c){ return LOWER.has(c); }
  static IsDigit(c){ return DIGIT.has(c); }
  static IsSpace(c){ return SPACE.has(c); }
  static IsPunct(c){ return PUNCT.has(c); }

  static ToTitleCase(string){ return ToTitleCase(string, TITLE_CACHE); }
  static ToSlug(string){ return ToSlug(string, SLUG_CACHE); }

  // NOTE: Sadly I have lost where I got this RegExp from, but at a minimum I want to specify that
  // I did not create it, so thank you to whoever did and shared it!
  // If anyone reading this happens to know where it came from, I would love to give proper credit!
  static ToKebabCase(string)
  {
    if (Object.prototype.hasOwnProperty.call(KEBAB_CASE_CACHE, string)) return KEBAB_CASE_CACHE[string];
    else return KEBAB_CASE_CACHE[string] = string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  static FromKebabCase(string)
  {
    if (Object.prototype.hasOwnProperty.call(KEBAB_CASE_CACHE, string)) return KEBAB_CASE_CACHE[string];
    else return KEBAB_CASE_CACHE[string] = string.replace(/^-*/, "").replace(/(^|-)(.)/g, (str, a, b) => b.toUpperCase());
  }

  // NOTE: Same as above, I (stupidly) did not record where I found this, so I cannot credit. Sorry!
  static ToSnakeCase(string)
  {
    if (Object.prototype.hasOwnProperty.call(SNAKE_CASE_CACHE, string)) return SNAKE_CASE_CACHE[string];
    else return SNAKE_CASE_CACHE[string] = string.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  }

  static FromSnakeCase(string)
  {
    if (Object.prototype.hasOwnProperty.call(SNAKE_CASE_CACHE, string)) return SNAKE_CASE_CACHE[string];
    else return SNAKE_CASE_CACHE[string] = string.replace(/(^|_)(.)/g, (str, a, b) => b.toUpperCase());
  }

  static Hash(string, seed = 0, limit){ return Hash(string, seed, limit); }
  static HashCyrb53(string, seed, stride){ return HashCyrb53(string, seed, stride); }
  static HashCyrb32(string, seed, stride){ return HashCyrb32(string, seed, stride); }

  static Hash32(string, seed = 0, limit)
  {
    const [h2, h1] = this.Hash(string, seed, limit);
    return h2;
  }

  static Hash64(string, seed = 0, limit)
  {
    const [h2, h1] = this.Hash(string, seed, limit);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  static Hash16(string, seed = 0, limit)
  {
    const [h2, h1] = this.Hash(string, seed, limit);
    return h2 >>> 16;
  }

  static HashCode(string){ return HashCode(string); }

  static HashObject(object)
  {
    const json = JSON.stringify(object);
    return HashCode(json);
  }

  static HashMurmur3(key, seed, stride){ return HashMurmur3(key, seed, stride); }
  static HashFNV1a(string, seed, stride){ return HashFNV1a(string, seed, stride); }
  static ToBase64(buffer){ return ToBase64(buffer); }

  static FromBase64(string)
  {
    return Uint8Array.from(atob(string), c => c.charCodeAt(0));
  }

  static UniqueID(base)
  {
    if (ID_INDEXES.hasOwnProperty(base))
    {
      const index = ++ID_INDEXES[base];
      return `${base}-${index}`;
    }
    else
    {
      ID_INDEXES[base] = 0;
      return `${base}-0`;
    }
  }

  static LevenshteinDistance(a, b){ return LevenshteinDistance(a, b); }
  static DiceCoefficient(a, b){ return DiceCoefficient(a, b); }

  static BestMatch(match, ...values)
  {
    let best_score = 0;
    let best_value = undefined;

    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      const string = value.toString();

      const score = this.DiceCoefficient(match, string);
      if (score > best_score)
      {
        best_score = score;
        best_value = value;
      }
    }

    return {
      value: best_value,
      score: best_score,
    };
  }

  static SortMatch(match, ...values)
  {
    const scores = [];

    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      const string = value.toString();

      scores.push({
        value,
        score: this.DiceCoefficient(match, string),
      });
    }

    return scores
    .sort((a, b) =>
    {
      return b.score - a.score;
    });
  }

  // Remove the body text from a function
  static ExtractFunctionBody(fn)
  {
    return fn.toString().replace(/.+\{(.*)\}/, (m, p1) =>
    {
      return p1.split("\r\n").map(l => l.trim()).join("\r\n");
    });
  }

  // Remove the body text from a function
  static ExtractFunctionBody(fn)
  {
    const text = fn.toString();
    const body = text.substring(text.indexOf("{") + 1, text.lastIndexOf("}")).trimEnd();
    console.log(body);

    const lines = body.split("\r\n");
    lines.shift();

    let shortest;
    for (let i = 0; i < lines.length; i++)
    {
      const line = lines[i];
      const padding = line.substring(0, line.length - line.trimStart().length);

      console.log(padding, i);

      if (shortest === undefined)
      {
        shortest = padding;
      }
      else if (shortest > padding.length)
      {
        shortest = padding;
      }
    }

    console.log(`Shortest is "${shortest}"`);

    // const padding = text.substring(0, text.length - text.trimStart().length);
    // console.log(`Padding is "${padding}"`);

    return lines.map(l => l.replace(shortest, "")).join("\r\n");
  }

  // Remove the body text from a function
  static ExtractFunctionBody(fn)
  {
    const text = fn.toString();
    const body = text.substring(text.indexOf("{") + 1, text.lastIndexOf("}")).trimEnd();

    const lines = body.split("\r\n");
    if (lines[0] === "")
    {
      lines.shift();
    }

    let shortest;
    for (let i = 0; i < lines.length; i++)
    {
      const line = lines[i];

      let spaces = 0;
      for (let j = 0; j < line.length; j++)
      {
        const c = line[j];
        if (!this.IsSpace(c)) break;
        else spaces += 1;
      }

      if (shortest === undefined || shortest > spaces)
      {
        shortest = spaces;
      }
    }

    return lines.map(l => l.substring(shortest)).join("\r\n");
  }
}

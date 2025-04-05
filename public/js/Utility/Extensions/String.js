export class String extends global.Date
{
  static #title_cache = {};
  static #slug_cache = {};
  static #kebab_case_cache = {};
  static #snake_case_cache = {};
  static #id_indexes = {};

  static #space = new Set("\t\n\v\f\r ");
  static #alpha = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  static #alnum = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  static #upper = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  static #lower = new Set("abcdefghijklmnopqrstuvwxyz");
  static #digit = new Set("0123456789");
  static #punct = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

  static IsAlpha(c){ return String.#alpha.has(c); }
  static IsAlNum(c){ return String.#alnum.has(c); }
  static IsUpper(c){ return String.#upper.has(c); }
  static IsLower(c){ return String.#lower.has(c); }
  static IsDigit(c){ return String.#digit.has(c); }
  static IsSpace(c){ return String.#space.has(c); }
  static IsPunct(c){ return String.#punct.has(c); }
}

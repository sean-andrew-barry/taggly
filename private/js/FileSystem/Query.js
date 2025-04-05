const CACHE = new Map();

const SPECIFIER = Symbol("specifier");
const NORMALIZED = Symbol("normalized");
const FRAGMENT = Symbol("fragment");
const SEARCH = Symbol("search");
const PARAMETERS = Symbol("parameters");
const PARTS = Symbol("parts");

export class Query
{
  static Get(specifier)
  {
    if (CACHE.has(specifier)) return CACHE.get(specifier);

    const query = new Query(specifier);
    CACHE.set(specifier, query);

    return query;
  }

  constructor(specifier)
  {
    if (typeof specifier !== "string")
    {
      throw new TypeError(`Query expected specifier to be a string, not "${typeof specifier}"`);
    }

    this[SPECIFIER] = specifier;
    this[NORMALIZED] = specifier;

    // An absolute specifier should always start with the file scheme
    // We are not accounting for other types of schemes here for simplicity
    this[ABSOLUTE] = specifier.toLowerCase().startsWith("file:///");

    const fragment_index = this[NORMALIZED].indexOf("#");
    if (fragment_index !== -1)
    {
      const fragment = this[NORMALIZED].substring(fragment_index + 1); // Extract the anchor string WITHOUT the #
      this[NORMALIZED] = this[NORMALIZED].substring(0, fragment_index); // Get the rest without the anchor string
      this[FRAGMENT] = new URLSearchParams(fragment);
    }

    const search_index = this[NORMALIZED].indexOf("?");
    if (search_index !== -1)
    {
      const search = this[NORMALIZED].substring(search_index + 1); // Extract the search string WITHOUT the ?
      this[NORMALIZED] = this[NORMALIZED].substring(0, search_index); // Get the rest without the search string
      this[SEARCH] = new URLSearchParams(search);
    }

    // Remove leading and trailing slashes and split the string into an array of parts
    if (this[ABSOLUTE])
    {
      // For absolute paths we have to get rid of the scheme name so it doesn't add empty parts
      this[PARTS] = this[NORMALIZED].slice(8).replace(/^\/|\/$/g, "").split("/");
    }
    else
    {
      this[PARTS] = this[NORMALIZED].replace(/^\/|\/$/g, "").split("/");
    }
  }

  GetSpecifier(){ return this[SPECIFIER]; }
  toString(){ return this.GetSpecifier(); }
}
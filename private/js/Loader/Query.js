const CACHE = new Map();

let cache_misses = 0;
let cache_hits = 0;

export class Query
{
  static GetCache(){ return CACHE; }
  static GetCacheHits(){ return cache_hits; }
  static GetCacheMisses(){ return cache_misses; }
  static GetCacheSize(){ return CACHE.size; }
  static Uncache(specifier){ return CACHE.delete(specifier); }

  // original;
  // specifier;
  // anchor;
  // search;
  // parameters;
  // parts;
  // absolute = false;

  constructor(specifier)
  {
    if (specifier === undefined) return this;
    const lower = specifier?.toLowerCase();

    if (CACHE.has(lower))
    {
      cache_hits += 1;
      return CACHE.get(lower);
    }
    else
    {
      cache_misses += 1;
      CACHE.set(lower, this);
    }

    this.original = specifier;
    this.specifier = specifier;
    this.absolute = lower.startsWith("file:///");

    const anchor_index = lower.lastIndexOf("#");
    if (anchor_index !== -1)
    {
      this.anchor = lower.substring(anchor_index + 1); // Extract the anchor string
      this.specifier = this.specifier.substring(0, anchor_index); // Get the rest without the search string
    }

    const query_index = lower.lastIndexOf("?");
    if (query_index !== -1)
    {
      this.search = lower.substring(query_index); // Extract the search string
      this.specifier = this.specifier.substring(0, query_index); // Get the rest without the search string
      this.parameters = new URLSearchParams(this.search);
    }

    if (this.IsAbsolute())
    {
      this.parts = new URL(this.specifier).pathname.replace(/^\/|\/$/g, "").split("/");
    }
    else
    {
      this.parts = this.specifier.replace(/^\/|\/$/g, "").split("/");
    }
  }

  GetOriginal(){ return this.original; }
  GetSpecifier(){ return this.specifier; }
  GetParameters(){ return this.parameters; }
  GetAnchor(){ return this.anchor; }
  GetSearch(){ return this.search; }
  GetParts(){ return this.parts; }
  IsAbsolute(){ return this.absolute === true; }
  IsRelative(){ return this.absolute !== true; }

  HasNext(){ return this.GetParameters()?.has("next"); }
  GetNext(){ return this.GetParameters()?.get("next"); }

  HasAfter(){ return this.GetParameters()?.has("after"); }
  GetAfter(){ return this.GetParameters()?.get("after"); }

  HasBefore(){ return this.GetParameters()?.has("before"); }
  GetBefore(){ return this.GetParameters()?.get("before"); }

  HasLayer(){ return this.GetParameters()?.has("layer"); }
  GetLayer(){ return this.GetParameters()?.get("layer"); }

  HasDomain(){ return this.GetParameters()?.has("domain"); }
  GetDomain(){ return this.GetParameters()?.get("domain"); }

  HasInclude(){ return this.GetParameters()?.has("include"); }
  GetInclude(){ return this.GetParameters()?.get("include"); }

  HasExclude(){ return this.GetParameters()?.has("exclude"); }
  GetExclude(){ return this.GetParameters()?.get("exclude"); }

  HasRecursive(){ return this.GetParameters()?.has("recursive"); }
  GetRecursive(){ return this.GetParameters()?.get("recursive"); }

  HasWrapper(){ return this.GetParameters()?.has("wrapper"); }
  GetWrapper(){ return this.GetParameters()?.get("wrapper"); }

  HasResolved(){ return this.GetParameters()?.has("resolved"); }
  GetResolved(){ return this.GetParameters()?.get("resolved"); }

  HasFlag(){ return this.GetParameters()?.has("flag"); }
  GetFlag(){ return this.GetParameters()?.get("flag"); }

  HasStatic(){ return this.GetParameters()?.has("static"); }
  HasSoft(){ return this.GetAnchor() === "soft"; }
  HasIgnore(){ return this.GetAnchor() === "ignore"; }

  toString(){ return this.original; }
}

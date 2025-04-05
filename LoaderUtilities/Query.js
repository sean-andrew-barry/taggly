const QUERY_CACHE = new Map();

export class Query
{
  constructor(specifier)
  {
    // specifier = specifier?.toLowerCase();

    if (QUERY_CACHE.has(specifier))
    {
      return QUERY_CACHE.get(specifier);
    }
    else
    {
      QUERY_CACHE.set(specifier, this);
    }

    if (specifier === undefined) return this;

    this.original = specifier;
    this.specifier = specifier;
    this.search;
    this.parameters;
    this.parts;
    this.is_absolute = this.specifier.startsWith("file:///");

    const index = specifier.lastIndexOf("?");
    if (index !== -1)
    {
      this.search = specifier.substring(index); // Extract the search string
      this.specifier = specifier.substring(0, index); // Get the rest without the search string
      this.parameters = new URLSearchParams(this.search);
    }

    if (this.IsAbsolute())
    {
      this.relative_queries = new WeakMap();
    }
    else
    {
      this.parts = this.specifier.toLowerCase().replace(/^\/|\/$/g, "").split("/");
      // this.parts = this.specifier.replace(/^\/|\/$/g, "").split("/");
    }
  }

  From(entry)
  {
    if (this.IsRelative())
    {
      throw new Error(`Cannot call From on a relative Query`);
    }

    if (this.relative_queries.has(entry))
    {
      return this.relative_queries.get(entry);
    }
    else
    {
      const relative_specifier = this.MakeSpecifierRelative(this.GetOriginal(), entry.href);

      const query = new Query(relative_specifier);

      this.relative_queries.set(entry, query);

      return query;
    }
  }

  GetOriginal(){ return this.original; }
  GetSpecifier(){ return this.specifier; }
  GetParameters(){ return this.parameters; }
  GetSearch(){ return this.search; }
  GetParts(){ return this.parts; }
  IsAbsolute(){ return this.is_absolute === true; }
  IsRelative(){ return this.is_absolute !== true; }

  HasNext(){ return this.GetParameters()?.has("next"); }
  GetNext(){ return this.GetParameters()?.get("next"); }

  HasLayer(){ return this.GetParameters()?.has("layer"); }
  GetLayer(){ return this.GetParameters()?.get("layer"); }

  HasDomain(){ return this.GetParameters()?.has("domain"); }
  GetDomain(){ return this.GetParameters()?.get("domain"); }

  HasInclude(){ return this.GetParameters()?.has("include"); }
  GetInclude(){ return this.GetParameters()?.get("include"); }

  HasExclude(){ return this.GetParameters()?.has("exclude"); }
  GetExclude(){ return this.GetParameters()?.get("exclude"); }

  HasStatic(){ return this.GetParameters()?.has("static"); }

  // GetPrev(){ return this.prev; }
  // SetPrev(prev){ this.prev = prev; return this; }

  _GetRelativeParts(entry)
  {
    if (this.relative_parts.has(entry))
    {
      return this.relative_parts.get(entry);
    }
    else
    {
      let specifier = this.specifier;
      if (specifier.startsWith("file:///") === true)
      {
        specifier = this.MakeSpecifierRelative(specifier, entry.href);
      }

      const parts = specifier.replace(/^\/|\/$/g, "").split("/");
      console.log(parts);

      this.relative_parts.add(entry, parts);
      return parts;
    }
  }

  // Find where the specifier differs from the href
  MakeSpecifierRelative(specifier, href)
  {
    const length = Math.max(specifier.length, href.length);

    for (let i = 0; i < length; i++)
    {
      if (href[i] !== specifier[i])
      {
        return specifier.substring(i);
      }
    }

    throw new Error(`Failed to make "${specifier}" relative to "${href}"`);
  }
}

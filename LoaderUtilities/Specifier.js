const CACHE = {};

export class Specifier extends global.URL
{
  // constructor(specifier, base)
  // {
  //   const original = specifier;
  //
  //   if (CACHE.hasOwnProperty(original))
  //   {
  //     return CACHE[original];
  //   }
  //
  //   // If the specifier is NOT absolute
  //   if (specifier.startsWith("file:///") !== true)
  //   {
  //     const href = base.href;
  //     const length = Math.max(specifier.length, href.length);
  //
  //     for (let i = 0; i < length; i++)
  //     {
  //       if (href[i] !== specifier[i])
  //       {
  //         specifier = specifier.substring(i);
  //       }
  //     }
  //   }
  //   else if (specifier.startsWith("/"))
  //   {
  //     // specifier
  //   }
  //
  //   super(specifier, base);
  //
  //   let pathname = this.pathname;
  //   if (pathname.startsWith("/"))
  //   {
  //     pathname = pathname.substring(1);
  //   }
  //
  //   this.filename = pathname;
  //   this.specifier = original;
  //   this.parts = pathname.replace(/^\/|\/$/g, "").split("/");
  //
  //   if (this.search)
  //   {
  //     this.original_parameters = this.searchParams;
  //     this.original_search = this.search;
  //     this.search = "";
  //   }
  //
  //   CACHE[original] = this;
  // }

  constructor(specifier, base)
  {
    const original = specifier;

    if (CACHE.hasOwnProperty(original))
    {
      return CACHE[original];
    }

    // If the specifier is NOT absolute
    if (specifier.startsWith("file:///") !== true)
    {
      specifier = base.GetName() + "/public" + specifier;
      // const href = base.href;
      // const length = Math.max(specifier.length, href.length);
      //
      // for (let i = 0; i < length; i++)
      // {
      //   if (href[i] !== specifier[i])
      //   {
      //     specifier = specifier.substring(i);
      //   }
      // }
    }

    super(specifier, base);

    let pathname = this.pathname;
    if (pathname.startsWith("/"))
    {
      pathname = pathname.substring(1);
    }

    this.filename = pathname;
    this.specifier = original;
    this.parts = pathname.replace(/^\/|\/$/g, "").split("/");

    if (this.search)
    {
      this.original_parameters = this.searchParams;
      this.original_search = this.search;
      this.search = "";
    }

    CACHE[original] = this;
  }

  GetParts(){ return this.parts; }
  GetParameters(){ return this.original_parameters; }

  Reset()
  {
    this.search = this.original_search;
  }
}

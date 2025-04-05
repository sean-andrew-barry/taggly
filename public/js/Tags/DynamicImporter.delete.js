import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
// import {Module} from "/js/Tags/Module.js";

export class DynamicImporter extends Singleton
{
  // async LoadModule(config)
  // {
  //   this.map = {};
  //   window.__dynamic_importer = this;
  //
  //   try
  //   {
  //     // Test if the browser supports dynamic imports
  //     this.importer = new Function("path", "return import(path)");
  //   }
  //   catch (error)
  //   {
  //   }
  // }

  constructor(...args)
  {
    super(...args);

    this.map = {};
    window.__dynamic_importer = this;
    this.importer = this.CreateImporter();
  }

  async CreateImporter()
  {
    try
    {
      // Test if the browser supports dynamic imports
      this.importer = new Function("path", "return import(path)");
    }
    catch (error)
    {
    }
  }

  Import(path)
  {
    return this.GetImporter().then(importer =>
    {
      if (importer) return importer(path);
      else return new Promise((resolve, reject) =>
      {
        const url = new URL(path, window.location);

        // Check if we have a cached module for this url
        if (this.map[url])
        {
          resolve(this.map[url]);
          return;
        }

        const blob = new Blob([
          `import * as module from "${url}";`,
          `window.__dynamic_importer.map["${url}"] = module;`, // "export" the module
        ], { type: "text/javascript" });

        const script = Tag
        .Script()
        .Type("module")
        .SetAttribute("defer", "defer")
        .Src(URL.createObjectURL(blob))
        .OnError(e =>
        {
          URL.revokeObjectURL(script.GetAttribute("src"));
          if (script.IsInPage()) script.Remove();
          reject(new Error(`Failed to import: ${url}`));
        })
        .OnLoad(e =>
        {
          URL.revokeObjectURL(script.GetAttribute("src"));
          if (script.IsInPage()) script.Remove();
          resolve(this.map[url]);
        });

        document.head.appendChild(script.node);
      });
    });
  }

  Require(path, name)
  {
    return new Promise((resolve, reject) =>
    {
      // Check if we have a cached module for this url
      if (this.map[path])
      {
        resolve(this.map[path]);
        return;
      }

      const script = Tag
      .Script()
      .Src(path)
      .AddEventListener("error", e =>
      {
        script.Remove();
        reject(new Error(`Failed to import: ${url}`));
      })
      .OnLoad(e =>
      {
        script.Remove();

        if (name && window[name])
        {
          this.map[path] = window[name];
          resolve(window[name]);
        }
        else
        {
          resolve(undefined);
        }
      });

      document.head.appendChild(script.node);
    });
  }

  GetImporter(){ return this.importer; }
}

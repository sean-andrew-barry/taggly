import Module from "module";
import FS, {promises as FSP} from "fs";

const NULL_URL = new URL("./LoaderUtilities/Null.js", import.meta.url).href;

const RESOLVE_SKIPS = new Set([
  ...Module.builtinModules,
  "greenlock",
  "jsdom",
  "memfs",
  "mongodb",
  "node-fetch",
  "node-forge",
  "nodemailer",
  "rollup",
  "terser",
  "webpack",
  "webpack-virtual-modules",
  "ws",
  "terser-webpack-plugin",
]);

const data = JSON.parse(process.env.TAGGLY_PACKAGE);

// Delete the TAGGLY_PACKAGE because it can hold secrets, and I do not want
// those secrets to be exposed to every random module.
// It IS possible for the secrets to be exposed by a module that is designed
// to target this framework, but at least a module just designed to copy out
// the entire process.env will not get them.
delete process.env.TAGGLY_PACKAGE;

let loader = undefined;
data.instance = 0;
data.resolve_skips = RESOLVE_SKIPS;

const LOADER_URL = data.loader_url ?? "/js/Loader.js";

function Round(value, multiplier)
{
  return Math.floor(value * multiplier) / multiplier;
}

export async function resolve(specifier, context, default_resolve)
{
  try
  {
    if (loader !== undefined)
    {
      const result = await loader.OnResolve(specifier, context, default_resolve);
      if (result) return result;
    }

    if (RESOLVE_SKIPS.has(specifier))
    {
      return default_resolve(specifier, context, default_resolve);
    }

    if (!context.parentURL)
    {
      const start = performance.now();
      await import("/js/Loader.js")
      .then(mod =>
      {
        data.time = performance.now() - start;
        console.log(`Imported "/js/Loader.js" after`, Round(performance.now() - start, 100), "ms");
        loader = new mod.Loader(data);
        return loader.Start();
      })
      .catch(error =>
      {
        console.error(`Importing "/js/Loader.js" failed after`, Round(performance.now() - start, 100), "ms");
        console.error(error);
      });

      return {
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier === "loader:static" || specifier === "/loader.static")
    {
      return {
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier.startsWith("file:///"))
    {
      return {
        format: "module",
        url: specifier,
      };
    }
    else
    {
      let next_matched = false;
      for (let i = 0; i < data.layers.length; i++)
      {
        const layer = data.layers[i];

        for (let j = 0; j < data.domains.length; j++)
        {
          const domain = data.domains[j];

          const url = new URL(layer + "/" + domain + specifier);

          let stats;
          try
          {
            stats = await FSP.stat(url);
          }
          catch (error)
          {
            continue; // URL is not a real file
          }

          if (stats)
          {
            if (next_matched === false && url.searchParams.has("next"))
            {
              const next = url.searchParams.get("next");
              if (url.pathname.includes(next))
              {
                next_matched = true;
              }

              continue;
            }
            else if (next_matched === false && url.searchParams.has("after"))
            {
              const after = url.searchParams.get("after");
              if (url.pathname.includes(after))
              {
                next_matched = true;
              }

              continue;
            }

            if (url.searchParams.has("include"))
            {
              const include = url.searchParams.get("include");
              if (!url.pathname.includes(include)) continue;
            }

            if (url.searchParams.has("exclude"))
            {
              const exclude = url.searchParams.get("exclude");
              if (url.pathname.includes(exclude)) continue;
            }

            url.searchParams.set("instance", data.instance);

            // if (data.version)
            // {
            //   url.searchParams.set("version", data.version);
            // }

            // console.log("No loader for", url.href);

            return {
              format: "module",
              url: url.href,
            };
          }
        }
      }
    }

    return default_resolve(specifier, context, default_resolve);
  }
  catch (error)
  {
    console.error("Error while resolving", specifier, "from", context.parentURL);
    console.error(error);
  }
}

export function load(url, context, default_load)
{
  if (loader) return loader.OnLoad(url, context, default_load);
  else return default_load(url, context, default_load);
}

export function getFormat(url, context, default_get_format)
{
  if (loader) return loader.OnGetFormat(url, context, default_get_format);
  else return default_get_format(url, context, default_get_format);
}

export function getSource(url, context, default_get_source)
{
  if (loader) return loader.OnGetSource(url, context, default_get_source);
  else return default_get_source(url, context, default_get_source);
}

export function transformSource(source, context, default_transform_source)
{
  if (loader) return loader.OnTransformSource(source, context, default_transform_source);
  else return default_transform_source(source, context, default_transform_source);
}

globalThis.process.on("message", (...args) =>
{
  if (loader) return loader.OnMessage.apply(loader, args);
});

globalThis.process.on("uncaughtExceptionMonitor", (...args) =>
{
  if (loader) return loader.OnUncaughtException.apply(loader, args);
});

import Module from "node:module";
import FS, {promises as FSP} from "node:fs";
import { threadId, workerData as data } from "node:worker_threads";

const NULL = new URL("./private/js/Loader/Null.js", import.meta.url);
const NULL_URL = NULL.href;

const RESOLVE_SKIPS = new Set([
  ...Module.builtinModules,
  ...Module.builtinModules.map(m => "node:" + m), // Add all the builtins with their node: prefix
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

function AddPreload(url, parent_url)
{
  if (!data.preloads.has(url))
  {
    data.preloads.set(url, {
      parent_url,
      imports: [],
      references: [],
      flags: [],
    });
  }

  if (data.preloads.has(parent_url))
  {
    data.preloads.get(parent_url).imports.push(url);
    data.preloads.get(url).references.push(parent_url);
  }
}

function Flag(url, flag)
{
  data.preloads.get(url).flags.push(flag);
}

function Trim(url)
{
  if (typeof url !== "string") return "";

  return url.replace("file:///C:/Users/Sean/Documents/Visual%20Studio%202017/Projects/JavaScript/", "").replace("?instance=0", "");
}

// let Block;

export async function initialize()
{
  // console.log("Initializing Preloader", data);
  // console.log("Initializing Preloader");

  // data = thread_data;

  // const block_mod = await import("/js/Memory/Block.js");
  // Block = block_mod.Block;

  // console.log(data.layers);

  // const result = await import("/js/Loader/Data.js");
  // data = result.Data;
  // data.preloads = new Map();

  // for (const key in thread_data)
  // {
  //   if (!thread_data.hasOwnProperty(key)) continue;
  //   result.Data[key] = thread_data[key];
  // }

  // data = result.Data;

  // Import and initialize the loader
  const {Loader} = await import("/js/Loader.js");
  const loader = await Loader.Get();
  // data.loader = loader;
  
  try
  {
    // console.log("~~~Imported Loader");
    await loader.Initialize(data);
    await loader.Start();
  }
  catch (error)
  {
    loader.OnStartError(error);
  }
  // finally
  // {
  //   const array = new Int32Array(data.buffer);
  //   Atomics.add(array, 0, 1);
  //   Atomics.notify(array, 0);
  //   console.log("Notifying", Atomics.load(array, 0));
  // }
}

function simulateAsyncFsStat() {
  return new Promise((resolve) => {
    // Randomize the time it takes to resolve this promise
    // to simulate varying times for fs.stat calls
    const randomTime = Math.floor(Math.random() * 100); // between 0 and 99 milliseconds

    setTimeout(() => {
      resolve(`Took ${randomTime} milliseconds`);
    }, randomTime);
  });
}

function Sleep(ms)
{
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

const DATA = new Map();

function Read(url)
{
  return new Promise((resolve, reject) =>
  {
    const pathname = url.pathname;

    if (DATA.has(pathname))
    {
      return resolve(DATA.get(pathname));
    }

    FS.readFile(url, (error, data) =>
    {
      if (error)
      {
        if (error.code !== "ENOENT") return reject(error);
        else return resolve(undefined); // File does not exist
      }

      DATA.set(pathname, data);

      return resolve(data);
    });
  });
}

/**
 * Synchronous counterpart to Read().
 * Returns a String or `undefined` (for a missing file).
 * Throws any other I/O error.
 */
function ReadSync(url) {
  const pathname = url.pathname;

  /* 1 — in‑memory cache */
  if (DATA.has(pathname)) return DATA.get(pathname);   // string

  /* 2 — load from disk (sync) */
  let source;
  try {
    // Passing "utf8" makes readFileSync return a string directly
    source = FS.readFileSync(url, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return undefined;       // file does not exist
    throw err;                                         // propagate unexpected errors
  }

  /* 3 — populate cache, return string */
  DATA.set(pathname, source);
  return source;
}

function Stat(url)
{
  return new Promise((resolve, reject) =>
  {
    FS.stat(url, (error, stats) =>
    {
      if (error) return resolve(undefined);
      else return resolve(stats);
    });
  });
}

function Access(url, flags = FS.constants.F_OK | FS.constants.R_OK)
{
  return new Promise((resolve, reject) =>
  {
    FS.access(url, flags, (error) =>
    {
      // if (error)
      // {
      //   console.log("Failed to find", error instanceof Error, error.stack);
      // }

      if (error) return resolve(false);
      else return resolve(true);
    });
  });
}

async function Resolver(specifier, context, default_resolve)
{
  try
  {
    // console.log(Trim(context.parentURL), specifier);
    // console.log(Trim(context.parentURL), specifier);

    // await simulateAsyncFsStat();

    const loader = data.loader;

    // As soon as there is a loader, hand control over to it
    if (loader !== undefined)
    {
      const result = await loader.OnResolve(specifier, context, default_resolve);
      
      if (result)
      {
        return result;
      }
    }

    if (RESOLVE_SKIPS.has(specifier))
    {
      // console.log("~~~Importing skip", specifier);
      return await default_resolve(specifier, context, default_resolve);
    }

    // If it has no parentURL, then it's the first import
    if (!context.parentURL)
    {
      console.log("No parent URL for", specifier);

      return {
        shortCircuit: true,
        format: "module",
        // url: NULL_URL,
        url: specifier,
      };
    }
    else if (specifier.startsWith("/flag"))
    {
      const index = specifier.indexOf("#");
      if (index !== -1)
      {
        // Extract the fragment part of the specifier after the "#"
        const fragment = specifier.substring(index + 1);

        // Now split the fragment by semicolons to get individual flags
        const flags = fragment.split(";");

        // Iterate over each flag and call the Flag function
        for (let i = 0; i < flags.length; i++)
        {
          const flag = flags[i].trim().toLowerCase();
          if (flag !== "")
          {
            Flag(context.parentURL, flag);
          }
        }
      }

      return {
        shortCircuit: true,
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier.startsWith("/loader"))
    {
      if (specifier.startsWith("/loader.flag"))
      {
        const index = specifier.indexOf("#");
        if (index !== -1)
        {
          // Extract the fragment part of the specifier after the "#"
          const fragment = specifier.substring(index + 1);
  
          // Now split the fragment by semicolons to get individual flags
          const flags = fragment.split(";");
  
          // Iterate over each flag and call the Flag function
          for (let i = 0; i < flags.length; i++)
          {
            const flag = flags[i].trim().toLowerCase();
            if (flag !== "")
            {
              Flag(context.parentURL, flag);
            }
          }
        }
      }

      return {
        shortCircuit: true,
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier.toLowerCase().startsWith("file:///"))
    {
      AddPreload(specifier, context.parentURL);

      return {
        shortCircuit: true,
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

          // const stats = await Access(url);
          const stats = await Read(url);
          // const stats = await Stat(url);

          if (stats)
          {
            const fragment = url.hash;
            if (fragment !== "")
            {
              url.hash = "";
              // throw new Error(`Invalid hash! ${url.href}`);
            }

            // TODO: Make sure the parent is trusted to do this I think
            if (url.searchParams.has("optional"))
            {
              const optional = url.searchParams.get("optional") === "true";
              if (optional)
              {
                console.log("Pushing optional");
                data.domains.unshift("optional");
              }
              else
              {
                console.log("Popping optional");
                data.domains.shift("optional");
              }

              url.searchParams.delete("optional");
            }

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
            // url.searchParams.set("imported", data.imported.getTime());

            url.searchParams.delete("next");
            url.searchParams.delete("after");

            // if (data.development === true)
            // {
            //   url.searchParams.set("development", "true");
            // }

            const href = url.href;

            AddPreload(href, context.parentURL);

            return {
              shortCircuit: true,
              format: "module",
              url: href,
              raw: url,
            };
          }
        }
      }
    }

    return await default_resolve(specifier, context, default_resolve);
  }
  catch (error)
  {
    const loader = data.loader;
    
    if (loader)
    {
      const result = await loader.OnResolveError(error, specifier, context);
      if (result) return result;
    }

    console.error("Error while resolving", specifier, "from", context.parentURL);
    console.error(error);

    return {
      shortCircuit: true,
      format: "module",
      url: NULL_URL,
      raw: NULL,
    };
  }
}

function ResolverSync(specifier, context, default_resolve)
{
  try
  {
    const loader = data.loader;

    // As soon as there is a loader, hand control over to it
    if (loader !== undefined)
    {
      const result = loader.OnResolveSync(specifier, context, default_resolve);
      
      if (result)
      {
        return result;
      }
    }

    if (RESOLVE_SKIPS.has(specifier))
    {
      // console.log("~~~Importing skip", specifier);
      return default_resolve(specifier, context, default_resolve);
    }

    // If it has no parentURL, then it's the first import
    if (!context.parentURL)
    {
      console.log("No parent URL for", specifier);

      return {
        shortCircuit: true,
        format: "module",
        // url: NULL_URL,
        url: specifier,
      };
    }
    else if (specifier.startsWith("/flag"))
    {
      const index = specifier.indexOf("#");
      if (index !== -1)
      {
        // Extract the fragment part of the specifier after the "#"
        const fragment = specifier.substring(index + 1);

        // Now split the fragment by semicolons to get individual flags
        const flags = fragment.split(";");

        // Iterate over each flag and call the Flag function
        for (let i = 0; i < flags.length; i++)
        {
          const flag = flags[i].trim().toLowerCase();
          if (flag !== "")
          {
            Flag(context.parentURL, flag);
          }
        }
      }

      return {
        shortCircuit: true,
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier.startsWith("/loader"))
    {
      if (specifier.startsWith("/loader.flag"))
      {
        const index = specifier.indexOf("#");
        if (index !== -1)
        {
          // Extract the fragment part of the specifier after the "#"
          const fragment = specifier.substring(index + 1);
  
          // Now split the fragment by semicolons to get individual flags
          const flags = fragment.split(";");
  
          // Iterate over each flag and call the Flag function
          for (let i = 0; i < flags.length; i++)
          {
            const flag = flags[i].trim().toLowerCase();
            if (flag !== "")
            {
              Flag(context.parentURL, flag);
            }
          }
        }
      }

      return {
        shortCircuit: true,
        format: "module",
        url: NULL_URL,
      };
    }
    else if (specifier.toLowerCase().startsWith("file:///"))
    {
      AddPreload(specifier, context.parentURL);

      return {
        shortCircuit: true,
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

          const stats = ReadSync(url);

          if (stats)
          {
            const fragment = url.hash;
            if (fragment !== "")
            {
              url.hash = "";
              // throw new Error(`Invalid hash! ${url.href}`);
            }

            // TODO: Make sure the parent is trusted to do this I think
            if (url.searchParams.has("optional"))
            {
              const optional = url.searchParams.get("optional") === "true";
              if (optional)
              {
                console.log("Pushing optional");
                data.domains.unshift("optional");
              }
              else
              {
                console.log("Popping optional");
                data.domains.shift("optional");
              }

              url.searchParams.delete("optional");
            }

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
            // url.searchParams.set("imported", data.imported.getTime());

            url.searchParams.delete("next");
            url.searchParams.delete("after");

            // if (data.development === true)
            // {
            //   url.searchParams.set("development", "true");
            // }

            const href = url.href;

            AddPreload(href, context.parentURL);

            return {
              shortCircuit: true,
              format: "module",
              url: href,
            };
          }
        }
      }
    }

    return default_resolve(specifier, context, default_resolve);
  }
  catch (error)
  {
    const loader = data.loader;
    
    if (loader)
    {
      const result = loader.OnResolveErrorSync(error, specifier, context);
      if (result) return result;
    }

    console.error("Error while resolving", specifier, "from", context.parentURL);
    console.error(error);

    return {
      shortCircuit: true,
      format: "module",
      url: NULL_URL,
      // raw: NULL,
    };
  }
}

let last_parent_url;
const PARENTS = new Map();

export async function resolve(specifier, context, default_resolve)
{
  if (context.parentURL && !PARENTS.has(context.parentURL))
  {
    context.parent = {
      first: true,
      complete: false,
      flags: [],
      imports: [],
      url: context.parentURL,
    };

    PARENTS.set(context.parentURL, context.parent);
  }
  else
  {
    context.parent = PARENTS.get(context.parentURL);
    context.parent.first = false;
  }

  if (context.parent.complete === true)
  {
    context.dynamic = true;
  }
  else if (last_parent_url && last_parent_url !== context.parentURL)
  {
    PARENTS.get(last_parent_url).complete = true;
  }

  last_parent_url = context.parentURL;

  if (RESOLVE_SKIPS.has(specifier))
  {
    context.skip = true;
  }
  else if (specifier.startsWith("/flag"))
  {
    const flags = specifier.trim().split("#");
    for (let i = 1; i < flags.length; i++)
    {
      context.parent.flags.push(flags[i]);
    }
  }

  const result = await Resolver(specifier, context, default_resolve);
  // console.log("Module", Trim(context.parentURL), "imported", Trim(result.url));

  // result.importAssertions = {};

  // if (Block)
  // {
  //   const block = Block.GetFirst(data.buffer);
  //   // console.log("Result is", Trim(context.parentURL), Trim(result.url), block?.GetLength());
  //   // console.log("Result is", Trim(context.parentURL), Trim(result.url));
  // }

  // console.log("Resolved", result);

  return result;
}

export function resolveSync(specifier, context, default_resolve)
{
  // console.log("Resolving:", specifier, "from", context.parentURL);
  // console.log("Resolving:", specifier);

  if (context.parentURL && !PARENTS.has(context.parentURL))
  {
    context.parent = {
      first: true,
      complete: false,
      flags: [],
      imports: [],
      url: context.parentURL,
    };

    PARENTS.set(context.parentURL, context.parent);
  }
  else
  {
    context.parent = PARENTS.get(context.parentURL);
    context.parent.first = false;
  }

  if (context.parent.complete === true)
  {
    context.dynamic = true;
  }
  else if (last_parent_url && last_parent_url !== context.parentURL)
  {
    PARENTS.get(last_parent_url).complete = true;
  }

  last_parent_url = context.parentURL;

  if (RESOLVE_SKIPS.has(specifier))
  {
    context.skip = true;
  }
  else if (specifier.startsWith("/flag"))
  {
    const flags = specifier.trim().split("#");
    for (let i = 1; i < flags.length; i++)
    {
      context.parent.flags.push(flags[i]);
    }
  }

  const result = ResolverSync(specifier, context, default_resolve);
  // result.shortCircuit = false;
  // console.log(result);

  // console.log("Resolving:", result.url);
  
  // console.log("Module", Trim(context.parentURL), "imported", Trim(result.url));

  // result.importAssertions = {};

  // if (Block)
  // {
  //   const block = Block.GetFirst(data.buffer);
  //   // console.log("Result is", Trim(context.parentURL), Trim(result.url), block?.GetLength());
  //   // console.log("Result is", Trim(context.parentURL), Trim(result.url));
  // }

  // console.log("Resolved", result);

  return result;
}

export async function load(url, context, default_load)
{
  // console.log("~~~FINISHING~~~", Trim(url));

  if (RESOLVE_SKIPS.has(url))
  {
    return await default_load(url, context, default_load);
  }

  const loader = data.loader;

  try
  {
    if (context.format === "module")
    {
      if (context?.importAssertions.type === "json")
      {
        const mod = await import(url);

        return {
          format: "json",
          shortCircuit: true,
          source: JSON.stringify(mod),
        };
      }

      const full_url = new URL(url);

      return {
        format: "module",
        shortCircuit: true,
        source: await Read(full_url),
      };
    }

    if (loader)
    {
      const result = await loader.OnLoad(url, context, default_load);
      if (result) return result;
    }

    const result = await default_load(url, context, default_load);
    // console.log(result);
    return result;
  }
  catch (error)
  {
    if (loader)
    {
      const result = await loader.OnLoadError(error, url, context);
      if (result) return result;
    }

    console.error("Error while loading", url, "from", context.parentURL);
    console.error(error);

    return {
      format: "module",
      responseURL: url,
      shortCircuit: true,
      source: "",
    };
  }
}

export function loadSync(url, context, default_load)
{
  // console.log("Loading:", url);
  // console.log("~~~FINISHING~~~", Trim(url));

  if (RESOLVE_SKIPS.has(url))
  {
    return default_load(url, context, default_load);
  }

  const loader = data.loader;


  try
  {
    if (loader) {
      const result = loader.OnLoadSync(url, context, default_load);
      if (result) return result;
    } else if (context.format === "module") {
      // if (context?.importAssertions.type === "json")
      // {
      //   const mod = await import(url);

      //   return {
      //     format: "json",
      //     shortCircuit: true,
      //     source: JSON.stringify(mod),
      //   };
      // }

      const full_url = new URL(url);
      const source = ReadSync(full_url);

      // const tagged = `${source}\n//# sourceMappingURL=${fileURLToPath(full_url.href)}\n`;

      // // Compile once ourselves so V8 can tag errors with `url`
      // try {
      //   new SourceTextModule(tagged, { identifier: fileURLToPath(full_url.href) });
      // } catch (err) {
      //   // The SyntaxError now contains `url` and line/col
      //   console.log("~~~ERRORING~~~", full_url.href);
      //   throw err;                          // propagate
      // }

      

      // console.log("~~~FINISHING~~~", full_url.href);

      return {
        url: full_url.href,
        format: "module",
        shortCircuit: true,
        source: source + '\n//# sourceURL=' + full_url.href,
      };
    }

    const result = default_load(url, context, default_load);
    console.log(result);
    return result;
  }
  catch (error) {
    if (loader) {
      const result = loader.OnLoadErrorSync(error, url, context);
      if (result) return result;
    }

    console.error("Error while loading", url, "from", context.parentURL);
    console.error(error);

    return {
      format: "module",
      url: url,
      shortCircuit: true,
      source: "",
    };
  }
}

globalThis.process.on("message", async (...args) =>
{
  console.log("message", args);
  const loader = data.loader;
  if (loader) return await loader.OnMessage.apply(loader, args);
});

// console.log(parentPort, isMainThread);

// parentPort.on("message", async (...args) =>
// {
//   console.log("message", args);
//   const loader = data.loader;
//   if (loader) return await loader.OnMessage.apply(loader, args);
// });

globalThis.process.on("uncaughtExceptionMonitor", async (...args) =>
{
  console.error("~~~~~~~~uncaughtExceptionMonitor~~~~~");
  const loader = data.loader;
  if (loader) return await loader.OnUncaughtException.apply(loader, args);
});

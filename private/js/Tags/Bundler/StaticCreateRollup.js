import "/loader.static";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import rollup from "/js/External/Rollup.js";
import terser from "/js/External/Terser.js";
// import rollup_terser from "/js/External/RollupTerser.js";
import console from "/js/Console.js";

class Resolver
{
  constructor(loader, domains)
  {
    this.loader = loader;
    this.domains = domains;
    this.name = "Resolver";
    this.specifiers = {};

    this.resolveId = this.ResolveID.bind(this);
    this.transform = this.Transform.bind(this);
  }

  async ResolveID(source, parent, object)
  {
    // if (parent)
    // {
    //   const issuer = pathToFileURL(parent);
    //   parent = await loader.Query(issuer.href, domains);
    //   if (!parent)
    //   {
    //     throw new Error(`Failed to find a parent for "${source}" with "${issuer.href}"`);
    //   }
    // }

    if (source === "loader:static" || source === "/loader.static")
    {
      return;
    }

    const entry = await this.loader.Query(source, this.domains);
    if (!entry) return console.warn("Failed to find rollup file for", source);

    const path = fileURLToPath(entry);

    this.specifiers[path] = source; // Store the original source specifier

    return path;
  }

  async Transform(code, id)
  {
    const url = pathToFileURL(id);
    // console.log("Transform", code.length, url.href);

    const file = await this.loader.Query(url.href, this.domains);
    if (file)
    {
      const specifier = this.specifiers[id];
      const replacement = `{ url: \`\${window.location.origin}${specifier}\` }`;

      return {
        code: code.replaceAll("import.meta", replacement),
        // map: { mappings: '' },
      };
    }
  }
}

class Terser
{
  constructor(loader, domains)
  {
    this.loader = loader;
    this.domains = domains;
    this.name = "Terser";

    this.renderChunk = this.RenderChunk.bind(this);
  }

  async RenderChunk(code, chunk, options)
  {
    const result = await terser.minify(code, {
      // module: true,
      // toplevel: true,
      compress: false,
      mangle: true,
    });

    return result;
  }
}

async function Create({
  entry,
  loader,
  domains = ["public"],
})
{
  const start = performance.now();

  const specifiers = {};

  const inputOptions = {
    external(id, parentId, isResolved)
    {
      // console.log({id, parentId, isResolved});
      return false;
    },
    // input: entry.href,
    input: "/js/Start.js",

    onwarn(warning)
    {
      if (warning.code === "UNRESOLVED_IMPORT")
      {
        if (warning.source === "/loader.static")
        {
          return; // Ignore
        }
      }

      // Silence the circular dependency warnings
      if (warning.code === "CIRCULAR_DEPENDENCY") return;

      console.error(warning.message);
    },

    plugins: [
      new Resolver(loader, domains),
      new Terser(loader, domains),

      // {
      //   name: "terser",
      //
      //   async renderChunk(code, chunk, outputOptions)
      //   {
      //
      //   },
      // },
      // rollup_terser.terser({
      //   compress: false,
      //   mangle: true,
      //   // ecma: 2020,
      //   // mangle: { toplevel: true },
      //   // numWorkers: 0,
      //   // compress: {
      //   //   module: true,
      //   //   toplevel: true,
      //   //   unsafe_arrows: true,
      //   //   // drop_console: !devMode,
      //   //   // drop_debugger: !devMode,
      //   // },
      //   // output: { quote_style: 1 },
      // }),
    ],
  };

  const outputOptions = {
    // minifyInternalExports: true,
    // compact: true,
  };

  const bundle = await rollup.rollup(inputOptions);

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const {output} = await bundle.generate(outputOptions);

  let code = "";
  for (const value of output)
  {
    if (value.type !== "asset")
    {
      // console.log("Modules", value.modules);
      code += value.code;
    }
  }

  // closes the bundle
  await bundle.close();

  const end = performance.now();

  console.log(`Generated`, code?.length, "characters after", end - start, "ms");

  return code;
}

let code;
export default function(options = {})
{
  if (options.reload === true)
  {
    code = undefined;
  }

  return code ??= Create(options);
}

async function renderChunk(code, chunk, outputOptions)
{
  if (!this.worker) {
    this.worker = new Worker(require.resolve("./transform.js"), {
      numWorkers: userOptions.numWorkers,
    });
    this.numOfBundles = 0;
  }

  this.numOfBundles++;

  const defaultOptions = {
    sourceMap:
      outputOptions.sourcemap === true ||
      typeof outputOptions.sourcemap === "string",
  };
  if (outputOptions.format === "es" || outputOptions.format === "esm") {
    defaultOptions.module = true;
  }
  if (outputOptions.format === "cjs") {
    defaultOptions.toplevel = true;
  }

  const normalizedOptions = { ...defaultOptions, ...userOptions };

  // remove plugin specific options
  for (let key of ["numWorkers"]) {
    if (normalizedOptions.hasOwnProperty(key)) {
      delete normalizedOptions[key];
    }
  }

  const serializedOptions = serialize(normalizedOptions);

  try {
    const result = await this.worker.transform(code, serializedOptions);

    if (result.nameCache) {
      let { vars, props } = userOptions.nameCache;

      // only assign nameCache.vars if it was provided, and if terser produced values:
      if (vars) {
        const newVars =
          result.nameCache.vars && result.nameCache.vars.props;
        if (newVars) {
          vars.props = vars.props || {};
          Object.assign(vars.props, newVars);
        }
      }

      // support populating an empty nameCache object:
      if (!props) {
        props = userOptions.nameCache.props = {};
      }

      // merge updated props into original nameCache object:
      const newProps =
        result.nameCache.props && result.nameCache.props.props;
      if (newProps) {
        props.props = props.props || {};
        Object.assign(props.props, newProps);
      }
    }

    return result.result;
  } catch (error) {
    const { message, line, col: column } = error;
    console.error(
      codeFrameColumns(code, { start: { line, column } }, { message })
    );
    throw error;
  } finally {
    this.numOfBundles--;

    if (this.numOfBundles === 0) {
      this.worker.end();
      this.worker = 0;
    }
  }
}

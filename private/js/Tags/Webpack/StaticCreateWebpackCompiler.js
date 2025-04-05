import {fileURLToPath, pathToFileURL} from "url";
import path from "path";
import webpack from "/js/External/Webpack.js?static=true";
import memfs from "/js/External/MemFS.js?static=true";
import TerserPlugin from "/js/External/TerserWebpackPlugin.js?static=true";
import VirtualModulesPlugin from "/js/External/WebpackVirtualModules.js?static=true";

export function Create({
  mode = "development",
  context,
  plugins = [],
  extensions = [".js"],
  entry_url,
  entry_file,
  output_path,
  public_output_path,
  output_file_name,
  performance_hints = false,
  keep_class_names = false,
  keep_function_names = false,
  concatenate_modules = false,
  top_level_await = false,
})
{
  const compiler = webpack({
    mode,
    context,
    entry: entry_file ?? fileURLToPath(entry_url),
    output: {
      path: output_path,
      publicPath: public_output_path,
      filename: output_file_name,
      pathinfo: false,
    },
    plugins,
    resolve: {
      extensions,
      symlinks: false,
      cacheWithContext: false,
    },
    optimization: {
      concatenateModules: concatenate_modules, // Messes up the module names otherwise

      // Minimize in development mode spawns a worker which makes a new loader
      minimize: mode === "development" ? false : true,
      // minimize: true,

      minimizer: mode === "development" ? undefined : [
        new TerserPlugin({
          parallel: false,
          terserOptions: {
            // mangle: false,
            // module: true,
            // ecma: 6,
            keep_classnames: keep_class_names,
            keep_fnames: keep_function_names, // Probably necessary
          },
        }),
      ],
    },
    performance: {
      hints: performance_hints, // The warning about the file being too large
    },
    experiments: {
      topLevelAwait: top_level_await,
    },
  });

  compiler.outputFileSystem = memfs;

  return new Promise((resolve, reject) =>
  {
    compiler.run((error, stats) =>
    {
      if (error) return reject(error);

      if (stats.hasErrors())
      {
        const info = stats.toJson();
        console.error("[Webpack] Errors:", info.errors);
      }
      else if (stats.hasWarnings())
      {
        const info = stats.toJson();
        console.warn("[Webpack] Warnings:", info.warnings);
      }
      else
      {
        const compilation = stats.compilation;
        if (!compilation) return;

        // console.log(stats);

        const output = path.resolve(output_path, output_file_name);

        // console.log("Output:", output);
        const code = memfs.readFileSync(output);
        // console.log(code?.length);

        // const time = compilation.endTime - compilation.startTime;
        // const modules = compilation?._modules?.size;
        // const mode = compilation?.options?.mode;
        stats.code = code;

        resolve(stats);
      }
    });
  });
}

let options_json;
let compiler;
export default function(options)
{
  const json = JSON.stringify(options);

  // If the options have changed from the last time, reload it
  if (options_json && options_json !== json)
  {
    options.reload = true;
  }

  // Store the options string for next time
  options_json = json;

  if (options.reload === true)
  {
    compiler = undefined;
  }

  return compiler ??= Create(options);
}

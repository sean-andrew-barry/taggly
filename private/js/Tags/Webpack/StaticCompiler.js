import {fileURLToPath, pathToFileURL} from "url";
import path from "path";
import webpack from "/js/External/Webpack.js?static=true";
import memfs from "/js/External/MemFS.js?static=true";
import TerserPlugin from "/js/External/TerserWebpackPlugin.js?static=true";
import VirtualModulesPlugin from "/js/External/WebpackVirtualModules.js?static=true";

export async function CreateCompiler({
  mode = "development",
  context,
  plugins = [],
  extensions = [".js"],
  entry_url,
  entry_file,
  output_path,
  output_file_name,
  performance_hints = false,
  keep_class_names = false,
  keep_function_names = false,
  concatenate_modules = false,
  top_level_await = false,
})
{

}

export async function CreateCompilation()
{

}

export async function CreateCode()
{

}

let options_json = "";
export async function CreateOptions(new_options)
{
  const json = JSON.stringify(new_options);

  // If the options have changed from the last time, rebuild everything
  if (options_json !== json)
  {
    GetCompiler(true);
    GetCompilation(true);
    GetCode(true);
  }
}

let compiler;
export function GetCompiler(force = false)
{
  if (force === true) compiler = undefined;
  return compiler ??= CreateCompiler();
}

let compilation;
export function GetCompilation(force = false)
{
  if (force === true) compilation = undefined;
  return compilation ??= CreateCompilation();
}

let code;
export function GetCode(force = false)
{
  if (force === true) code = undefined;
  return code ??= CreateCode();
}

let options;
export function GetOptions(force = false)
{
  if (force === true) options = undefined;
  return options ??= CreateOptions();
}

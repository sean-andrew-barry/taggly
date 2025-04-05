// import "/flag#local";
// import {Console as Base} from "console";
// import {Environment} from "/js/Environment.js";
// import loader from "/js/Loader.js";
import {Getter} from "/js/Loader/Getter.js";
import {ErrorParser} from "/js/External/ErrorParser.js";

const formatter = new Intl.NumberFormat();
// const global_console = globalThis.console;

export class Console
{
  #url;
  #prefix;

  constructor({
    url, // The file that the console is running in (usually from import.meta.url)
    prefix, // The prefix to put before each output

    // // Node.js standard settings, usually their defaults are fine and can be ignored
    // stdout = globalThis.process.stdout,
    // stderr = globalThis.process.stderr,
    // ignoreErrors = true,
    // colorMode = true,
    // inspectOptions,
    // groupIndentation = 2,
  } = {})
  {
    if (typeof(url) === "string")
    {
      url = new globalThis.URL(url);
    }

    // super({
    //   stdout,
    //   stderr,
    //   ignoreErrors,
    //   colorMode,
    //   inspectOptions,
    //   groupIndentation,
    // });

    this.#url ??= url;
    this.#prefix ??= prefix;
  }

  Prefix(args, remove = this.Prefix)
  {
    if (this.#prefix)
    {
      args.unshift(this.#prefix);
    }
    else
    {
      const error = {};
      Error.captureStackTrace(error, remove);
      const stack = ErrorParser(error);
      // console.log(stack);
      const {name, file, line, column, source} = stack.shift();

      const entry = Getter().Query(file);

      const file_name = entry.GetNormalized();

      args.unshift(this.Cyan(`[${this.Underline(file_name)}:`) + this.Green(line) + this.Cyan("]"));
    }

    return this;
  }

  debug(...args)
  {
    // Then only print if we're actually in development mode
    if (Getter().IsDevelopment())
    {
      this.Prefix(args, Console.prototype.debug);
      return globalThis.console.debug.apply(this, args);
    }
    else
    {
      this.Prefix(args, Console.prototype.debug);
      return globalThis.console.debug.apply(this, args);
    }
  }

  log(...args)
  {
    this.Prefix(args, Console.prototype.log);
    return globalThis.console.log.apply(this, args);
  }

  warn(...args)
  {
    this.Prefix(args, Console.prototype.warn);
    return globalThis.console.warn.apply(this, args);
  }

  error(...args)
  {
    this.Prefix(args, Console.prototype.error);
    return globalThis.console.error.apply(this, args);
  }

  dir(...args)
  {
    this.Prefix(args, Console.prototype.dir);
    return globalThis.console.dir.apply(this, args);
  }

  dirxml(...args)
  {
    this.Prefix(args, Console.prototype.dirxml);
    return globalThis.console.dirxml.apply(this, args);
  }

  trace(...args)
  {
    this.Prefix(args, Console.prototype.trace);
    return globalThis.console.trace.apply(this, args);
  }

  Reset(s){ return `\u001b[0m${s}\u001b[0m`; }
  Bold(s){ return `\u001b[1m${s}\u001b[22m`; }
  Dim(s){ return `\u001b[2m${s}\u001b[22m`; }
  Italic(s){ return `\u001b[3m${s}\u001b[23m`; }
  Underline(s){ return `\u001b[4m${s}\u001b[24m`; }
  Inverse(s){ return `\u001b[7m${s}\u001b[27m`; }
  Hidden(s){ return `\u001b[8m${s}\u001b[28m`; }
  Strikethrough(s){ return `\u001b[9m${s}\u001b[29m`; }
  Black(s){ return `\u001b[30m${s}\u001b[39m`; }
  Red(s){ return `\u001b[31m${s}\u001b[39m`; }
  Green(s){ return `\u001b[32m${s}\u001b[39m`; }
  Yellow(s){ return `\u001b[33m${s}\u001b[39m`; }
  Blue(s){ return `\u001b[34m${s}\u001b[39m`; }
  Magenta(s){ return `\u001b[35m${s}\u001b[39m`; }
  Cyan(s){ return `\u001b[36m${s}\u001b[39m`; }
  White(s){ return `\u001b[37m${s}\u001b[39m`; }
  Gray(s){ return `\u001b[90m${s}\u001b[39m`; }
  Grey(s){ return `\u001b[90m${s}\u001b[39m`; }
  RedBright(s){ return `\u001b[91m${s}\u001b[39m`; }
  GreenBright(s){ return `\u001b[92m${s}\u001b[39m`; }
  YellowBright(s){ return `\u001b[93m${s}\u001b[39m`; }
  BlueBright(s){ return `\u001b[94m${s}\u001b[39m`; }
  MagentaBright(s){ return `\u001b[95m${s}\u001b[39m`; }
  CyanBright(s){ return `\u001b[96m${s}\u001b[39m`; }
  WhiteBright(s){ return `\u001b[97m${s}\u001b[39m`; }
  BlackBG(s){ return `\u001b[40m${s}\u001b[49m`; }
  RedBG(s){ return `\u001b[41m${s}\u001b[49m`; }
  GreenBG(s){ return `\u001b[42m${s}\u001b[49m`; }
  YellowBG(s){ return `\u001b[43m${s}\u001b[49m`; }
  BlueBG(s){ return `\u001b[44m${s}\u001b[49m`; }
  MagentaBG(s){ return `\u001b[45m${s}\u001b[49m`; }
  CyanBG(s){ return `\u001b[46m${s}\u001b[49m`; }
  WhiteBG(s){ return `\u001b[47m${s}\u001b[49m`; }
  GrayBG(s){ return `\u001b[100m${s}\u001b[49m`; }
  GreyBG(s){ return `\u001b[100m${s}\u001b[49m`; }
  RedBrightBG(s){ return `\u001b[101m${s}\u001b[49m`; }
  GreenBrightBG(s){ return `\u001b[102m${s}\u001b[49m`; }
  YellowBrightBG(s){ return `\u001b[103m${s}\u001b[49m`; }
  BlueBrightBG(s){ return `\u001b[104m${s}\u001b[49m`; }
  MagentaBrightBG(s){ return `\u001b[105m${s}\u001b[49m`; }
  CyanBrightBG(s){ return `\u001b[106m${s}\u001b[49m`; }
  WhiteBrightBG(s){ return `\u001b[107m${s}\u001b[49m`; }

  Log(value){ return this.Cyan(value); }
  Warn(value){ return this.YellowBright(value); }
  Error(value){ return this.RedBright(value); }
  URL(value){ return this.Underline(this.Cyan(value)); }
  Number(value){ return this.Green(formatter.format(value)); }
  Function(value){ return this.BlueBright(value); }
  String(value){ return this.YellowBright(value); }
}

export const console = new Console({});

import process from "process";
import inspector from "inspector";
import vm from "vm";
import cluster from "cluster";
import Module from "module";
import v8 from "v8";
import node_path from "path";
import https from "https";
import {webcrypto as crypto} from "crypto";
import {URL, pathToFileURL, fileURLToPath} from "url";
import {performance} from "perf_hooks";
import {Package} from "./Package.js";
import {Entry} from "./LoaderUtilities/Entry.js";
import {Directory} from "./LoaderUtilities/Directory.js";
import {File, OPTIONAL} from "./LoaderUtilities/File.js";
import {Layer} from "./LoaderUtilities/Layer.js";
import {Specifier} from "./LoaderUtilities/Specifier.js";
import {VirtualMachine} from "./LoaderUtilities/VirtualMachine.js";
import {Query} from "./LoaderUtilities/Query.js";
import {ConsoleColors, Yellow, Blue, Cyan, Magenta, Green, YellowBright, BlueBright, Gray, Dim, Underline, Italic} from "./LoaderUtilities/ConsoleColors.js";
import {ConsoleColors as C} from "./LoaderUtilities/ConsoleColors.js";

const SELF_URL = new File(import.meta.url);
const RELOAD_PROMISE = Symbol("reload_promise");

const NULL_URL = new URL("./LoaderUtilities/Null.js", import.meta.url).href;

const NULL_HREF = "file:///null";
const DESTRUCTOR_HREF = "file:///destructor";

// TODO: The loader should NOT inherit from Package.
// Instead, it should be an entry (or layer?) that has a package

// The loader IS a Layer. Specifically, it is always the layer,
// since that is the location the "npm start" command is executed at

// TODO: A virtual file system may have value for loading layers from git and stuff
// Perhaps it could be implemented as a different type of layer, like a VirtualLayer

// QUESTION: Does a directory import break the protected import system? I think it probably can

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

class Remote extends File
{
  constructor(specifier, host)
  {
    super(specifier, host);

    this.original_specifier = specifier;
    this.original_host = host;

    // console.log("Created Remote", {
    //   host,
    //   specifier,
    //   href: this.href,
    // });
  }

  async Fetch()
  {
    return [
      `import {Div as Base} from "/js/Tags/Div.js"`,
      ``,
      `console.log("Hi from pseudo remote Div.js!");`,
      ``,
      `export class Div extends Base`,
      `{`,
      `  constructor(...args)`,
      `  {`,
      `    super(...args);`,
      `    console.log("Created pseudo remote Div!");`,
      `  }`,
      `}`,
    ].join("\n");
  }

  async Hash(text)
  {
    const buffer = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", buffer);

    console.log(hash);

    // console.log(new TextDecoder().decode(hash));

    let string = "";
    for (let i = 0; i < hash.length; i++)
    {
      const byte = hash[i];
      string += byte.toString(16).padStart(2, "0");
    }

    // Convert it to a hex string
    const array = Array.from(new Uint8Array(hash));
    const hex = array.map(b => b.toString(16).padStart(2, "0")).join("");

    console.log("Hex hash:", hex);
    console.log("String:", string);
  }

  async Hash(text)
  {
    const {default: murmur3} = await import("/js/External/HashMurmur3.js?static=true");

    const hash = murmur3(text);

    console.log(hash);

    console.log("Hex hash:", hash.toString(16));
  }

  async GetCustomSource()
  {
    // console.log("Calling Remote GetCustomSource");

    const text = await this.Fetch();

    // await this.Hash(text);

    return text;
  }
}

async function Import(specifier)
{
  const url = new URL(specifier, import.meta.url);
  return import(url);
}

async function Initialize()
{
  const {Loader} = await Import("./private/js/Loader.js");
  const {Layer} = await Import("./private/js/Loader/Layer.js");
  const {File} = await Import("./private/js/Loader/File.js");
}

export class Loader extends Layer
{
  // constructor()
  // {
  //   super(process.env.TAGGLY_PACKAGE);
  //
  //   // Delete the TAGGLY_PACKAGE because it can hold secrets, and I do not want
  //   // those secrets to be exposed to every random module.
  //   // It IS possible for the secrets to be exposed by a module that is designed
  //   // to target this framework, but at least a module just designed to copy out
  //   // the entire process.env will not get them.
  //   delete process.env.TAGGLY_PACKAGE;
  //
  //   this.start = performance.now();
  //   this.stop = this.start;
  //
  //   this.version = this?.npm_config?.version ?? this.version ?? "1.0.0";
  //
  //   const parts = this.version.split(".").map(p =>
  //   {
  //     const n = Number(p);
  //
  //     if (Number.isNaN(n)) return 0;
  //     else return n;
  //   });
  //
  //   this.version_major = parts[0];
  //   this.version_minor = parts[1];
  //   this.version_patch = parts[2];
  //
  //   this.development = this?.npm_config?.development ?? this.development ?? false;
  //   this.instance = 0;
  //   this.cache = {};
  //   this.reloadable = false;
  //   this.environment = undefined;
  //   // this.hard_reloadable = false; // QUESTION: Should I watch changes outside the layers?
  //   this.search_time = 0;
  //   this.chars = 0;
  //   this.lines = 0;
  //   this.files = 0;
  //   this.destructor = undefined;
  //   this.static_entries = new WeakMap();
  //   this.updated_entries = new Set();
  //   this.specifiers = new WeakMap();
  //   this.destructors = new Map();
  //   this.redirects = new Map();
  //
  //   // this.redirects.set("loader:test", TEST_URL);
  //   // this.CreateRedirect("/js/Loader/File.js");
  //
  //   this.request_index = 0;
  //   this.requests = new Map();
  //   this.parents = new Map();
  //
  //   // this.open = inspector.open(9229, "localhost");
  //   // // this.open = inspector.open("localhost:3000");
  //   // this.session = new inspector.Session();
  //   // this.session.connect();
  //
  //   const {heapTotal, heapUsed} = process.memoryUsage();
  //   this.start_heap = heapUsed;
  //   this.last_heap_growth = 0;
  //   this.character_count = 0;
  //   this.line_count = 0;
  //   this.layers ??= [];
  //
  //   for (let i = 0; i < this.layers.length; i++)
  //   {
  //     const layer = new Layer(this.layers[i]);
  //     layer.SetParent(this);
  //     layer.SetLayer(layer);
  //     layer.SetLayerIndex(i);
  //     layer.SetVersion(this.version);
  //     layer.SetInstance(this.instance);
  //     layer.SetDevelopment(this.development);
  //     this.layers[i] = layer;
  //
  //     layer.IsReal()
  //     .then(async real =>
  //     {
  //       if (!real) throw new Error(`Failed to load layer "${layer.href}"`);
  //
  //       const pkg = await layer.GetPackage();
  //       if (pkg) layer.SetName(pkg.Read("name"));
  //
  //       // layer.Watch(this);
  //     })
  //     .catch(error =>
  //     {
  //       throw error;
  //     });
  //   }
  //
  //   // this.ancestor = this.FindLayerCommonAncestor();
  //   // console.log(this.ancestor);
  // }

  // CreatePackage()
  // {
  //   console.log("Creating Loader Package!");
  //   return super.CreatePackage(this.data);
  // }

  constructor()
  {
    const data = JSON.parse(process.env.TAGGLY_PACKAGE);

    // Delete the TAGGLY_PACKAGE because it can hold secrets, and I do not want
    // those secrets to be exposed to every random module.
    // It IS possible for the secrets to be exposed by a module that is designed
    // to target this framework, but at least a module just designed to copy out
    // the entire process.env will not get them.
    delete process.env.TAGGLY_PACKAGE;

    super(data.app_url);

    // const keys = Object.keys(data);
    // for (let i = 0; i < keys.length; i++)
    // {
    //   const key = keys[i];
    //   const val = data[key];
    //
    //   this[key] = val;
    // }

    this.SetPackage(new Package(data));
    const pkg = this.GetPackage();
    // console.log(pkg);

    this.SetParent(this);
    this.SetLayer(this);
    this.SetLayerIndex(0);
    this.SetVersion(pkg.version);
    this.SetInstance(pkg.instance);
    this.SetDevelopment(pkg.development);

    this.start = performance.now();
    this.stop = this.start;

    this.version = this?.npm_config?.version ?? this.version ?? "1.0.0";

    const parts = this.version.split(".").map(p =>
    {
      const n = Number(p);

      if (Number.isNaN(n)) return 0;
      else return n;
    });

    this.version_major = parts[0];
    this.version_minor = parts[1];
    this.version_patch = parts[2];

    this.development = this?.npm_config?.development ?? this.development ?? false;
    this.instance = 0;
    this.cache = {};
    this.reloadable = false;
    this.environment = undefined;
    // this.hard_reloadable = false; // QUESTION: Should I watch changes outside the layers?
    this.search_time = 0;
    this.chars = 0;
    this.lines = 0;
    this.files = 0;
    this.destructor = undefined;
    this.static_entries = new WeakMap();
    this.updated_entries = new Set();
    this.specifiers = new WeakMap();
    this.destructors = new Map();
    this.redirects = new Map();

    this.request_index = 0;
    this.requests = new Map();
    this.parents = new Map();

    const {heapTotal, heapUsed} = process.memoryUsage();
    this.start_heap = heapUsed;
    this.last_heap_growth = 0;
    this.character_count = 0;
    this.line_count = 0;
    this.layers = [];

    for (let i = 0; i < pkg.layers.length; i++)
    {
      const layer = this.CreateLayer(this.layers[i], i + 1);
      this.layers[i] = layer;

      layer.IsReal()
      .then(async real =>
      {
        if (!real) throw new Error(`Failed to load layer "${layer.href}"`);

        const pkg = await layer.GetPackage();
        if (pkg) layer.SetName(pkg.Read("name"));
      })
      .catch(error =>
      {
        throw error;
      });
    }

    const framework_layer = this.CreateLayer(pkg.framework_url, this.layers.length + 1);
    this.layers.push(framework_layer);
  }

  CreateLayer(href, index)
  {
    // console.log("Creating layer", index, href);
    const layer = new Layer(href);

    layer.SetParent(this);
    layer.SetLayer(layer);
    layer.SetLayerIndex(index);
    layer.SetVersion(this.version);
    layer.SetInstance(this.instance);
    layer.SetDevelopment(this.development);

    return layer;
  }

  CreateRedirect(specifier, domain = "protected")
  {
    const url = new URL("./" + domain + specifier, import.meta.url);
    this.redirects.set(specifier, url);
  }

  async Destructor(specifier, callback)
  {
    const entry = await this.Query(specifier, this.GetDomains());
    this.destructors.set(entry, callback);
  }

  Destructor(specifier, callback)
  {
    let destructors;
    if (this.destructors.has(specifier))
    {
      destructors = this.destructors.get(specifier);
    }
    else
    {
      destructors = [];
      this.destructors.set(specifier, destructors);
    }

    destructors.push(callback);

    // if (this.destructors.has(specifier))
    // {
    //   throw new Error(`A destructor is already registered for specifier "${specifier}"`);
    // }

    // this.destructors.set(specifier, callback);
  }

  async Theory(specifier)
  {
    // The Loader is the entry point layer
    const entry = await this.Query(specifier);
    if (entry) return entry;

    this.layers = ["../snarkyandscrappy", "../taggly-fontawesome"];
    for (const layer of this.layers)
    {
      // Each layer has its own this.layers array, which it also queries
      const entry = await layer.Query(specifier);
      if (entry) return entry;
    }

    // Finally query the base framework layer, which is ONLY held by the Loader layer
    return this.framework.Query(specifier);
  }

  MakeStatic(specifier)
  {
    return new Promise((resolve, reject) =>
    {
      this.Query(specifier, this.GetDomains())
      .then(entry =>
      {
        if (entry)
        {
          entry.SetStatic(true);
          this.static_entries.set(entry, specifier);

          // This is not returning the entry on purpose
          // We do not want to expose the entry to potentially untrusted code
          resolve();
        }
        else
        {
          reject(`Loader failed to find a file to make static with specifier "${specifier}"`);
        }
      })
      .catch(error => reject(error));
    });
  }

  FindLayerCommonAncestor(parts = this.layers[0].GetParts().slice(0))
  {
    for (let i = 0; i < this.layers.length; i++)
    {
      const layer = this.layers[i];

      const layer_parts = layer.GetParts();

      for (let j = 0; j < parts.length; j++)
      {
        if (parts[j] !== layer_parts[j])
        {
          parts.pop();
          return this.FindLayerCommonAncestor(parts);
        }
      }
    }

    // If the files are in two different drives, they will not have a *true* common ancestor
    // So use this instead
    if (parts.length === 0)
    {
      // console.log("No true ancestor", new URL("/js/Tags/Page.js", SELF_URL));
      // console.log("No true ancestor", new URL("/js/Tags/Page.js", "file:///C:"));
      return new Directory("file:///C:");
    }

    return new Directory(pathToFileURL(parts.join("/")));
  }

  Normalize(url)
  {
    if (typeof(url) === "string")
    {
      url = new URL(url);
    }

    const href = url.href;
    const domains = this.GetDomains();
    for (let i = 0; i < domains.length; i++)
    {
      const domain = `/${domains[i]}/`;
      if (href.includes(domain))
      {
        const parts = href.split(domain);
        return "/" + parts[1];
      }
    }

    throw new Error(`Failed to normalize url "${url.href}"`);
  }

  LogLoaded()
  {
    const f = new Intl.NumberFormat();

    const path  = this.Normalize(this.root);
    const time  = f.format(Math.round(this.stop - this.start));
    const chars = f.format(this.GetChars());
    const lines = f.format(this.GetLines());
    const mb    = f.format(this.GetHeapUsed());
    const files = f.format(this.files);

    const {
      code_and_metadata_size,
      bytecode_and_metadata_size,
      external_script_source_size,
    } = v8.getHeapCodeStatistics();

    const code = f.format(code_and_metadata_size / (1024 * 1024)) + " mb";
    const bytecode = f.format(bytecode_and_metadata_size / (1024 * 1024)) + " mb";
    const external = f.format(external_script_source_size / (1024 * 1024)) + " mb";

    const heaps = v8.getHeapSpaceStatistics();

    const {
      total_heap_size,
      total_heap_size_executable,
      total_physical_size,
      total_available_size,
      used_heap_size,
      heap_size_limit,
      malloced_memory,
      peak_malloced_memory,
      does_zap_garbage,
      number_of_native_contexts,
      number_of_detached_contexts,
    } = v8.getHeapStatistics();

    // console.log(heaps);
    // console.log(v8.getHeapStatistics());

    // console.log(`\nCode size: ${Green(code)}, bytecode size: ${Green(bytecode)}, external code size: ${Green(external)}`);

    let in_development = "";
    if (this.development === true)
    {
      in_development = ` in development mode`;
    }

    if (this.GetLines() === 0)
    {
      console.log(`\nRoot ${Underline(Cyan(path))} imported ${Green(files)} files after ${Green(time)} ms using ${Green(mb)} mb${in_development}\n`);
    }
    else
    {
      console.log(`\nRoot ${Underline(Cyan(path))} imported ${Green(lines)} lines of code from ${Green(files)} files after ${Green(time)} ms using ${Green(mb)} mb${in_development}\n`);

      for (const layer of this.layers)
      {
        const name = layer.GetName();
        const lines = f.format(layer.GetLines());
        const chars = f.format(layer.GetChars());

        console.log(`Layer ${Underline(Cyan(name))} has ${Green(lines)} lines and ${Green(chars)} characters.`);
      }
    }

    console.log();
  }

  UpdateSize(chars, lines)
  {
    this.chars += chars;
    this.lines += lines;
  }

  GetHeapTotal()
  {
    const {heapTotal} = global.process.memoryUsage();
    return Math.round(heapTotal / (1024 * 1024));
  }

  GetHeapUsed()
  {
    const {heapUsed} = globalThis.process.memoryUsage();
    return Math.round(heapUsed / (1024 * 1024));
  }

  Stop()
  {
    // if (this.instance === 1)
    // {
    //   this.stop = performance.now();
    //   this.LogLoaded();
    // }

    console.log(performance.now() - this.start);

    return this;
  }

  Done()
  {
    // TODO: Inform the parent process that we're done initializing and are safe to reboot on death
    this.done = true;

    this.Send("ALLOW_AUTO_RESTART", true, 5000);
  }

  FireEvent(name, {
    window = global.window,
    bubbles = false,
    cancelable = true,
    ...rest
  } = {})
  {
    if (window === undefined) return false; // The event's default was NOT cancelled
    if (window.CustomEvent === undefined) return false; // The event's default was NOT cancelled

    // if (!window) throw new Error(`Loader.FireEvent failed because the DOM window is not defined`);

    const event = new window.CustomEvent(name, { bubbles, cancelable });

    // Copy each extra value over to the event
    for (const key in rest)
    {
      event[key] = rest[key];
    }

    window.dispatchEvent(event);

    // return event.cancelable && event.defaultPrevented;

    // True if the default HAS been prevented
    return event.defaultPrevented === true;

    // if (event.cancelable && event.defaultPrevented)
    // {
    //   return false;
    // }
    // else
    // {
    //   return true;
    // }
  }

  FireEvent(name, ...args)
  {
    // console.log("Disabling FireEvent", name);
  }

  PrintMemory()
  {
    const {heapTotal, heapUsed} = process.memoryUsage();
    // console.log("Heap total:", Math.round(heapTotal / (1024 * 1024)), "mb");
    console.log("Heap used:", Math.round(heapUsed / (1024 * 1024)), "mb");
  }

  Send(action, ...args)
  {
    const json = JSON.stringify([action, args], undefined, 2);
    global.process.send(json);
    return this;
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "REFRESH": return this.OnRefresh(...args);
      case "HARD_REFRESH": return this.OnHardRefresh(...args);
      case "PING": return this.OnPing(...args);
      case "MEMORY": return this.OnMemory(...args);
      case "DEVELOPMENT": return this.OnDevelopment(...args);
      case "PRINT": return this.OnPrint(...args);
      case "THROW": return this.OnThrow(...args);
      case "TIMEOUT_REASON": return this.OnTimeoutReason(...args);
      default: console.warn("Unknown process message", message);
    }
  }

  OnTimeoutReason(timeout, name)
  {
    console.log("Starting up after previously timing out because", name, "ran for more than", timeout);
    this.timeout_reason = {
      timeout,
      name,
    };
  }

  OnMessage(message)
  {
    try
    {
      const actions = JSON.parse(message);
      this.Apply.apply(this, actions);
    }
    catch (error)
    {
      console.error("Master message", message, "could not be parsed into JSON");
    }
  }

  OnUncaughtException(error, origin)
  {
    // console.error("Uncaught exception", error);

    // if (!this.FireEvent("OnUncaughtException", { cancelable: true, bubbles: true }))
    // {
    // }

    this.Send("ERROR", origin, error.message, error.stack);
  }

  OnRefresh(){ return this.Reload(true, false); }
  OnHardRefresh(){ return this.Reload(true, false, true); }
  OnPing(){ return this.Send("PONG"); }
  OnMemory(){ return this.PrintMemory(); }

  OnPrint()
  {
    // this.FireEvent("OnPrint", { cancelable: true });

    const {heapTotal, heapUsed} = process.memoryUsage();
    const heap_growth = (heapUsed - this.start_heap) / (1024 * 1024);
    const heap_change = heap_growth - this.last_heap_growth;
    this.last_heap_growth = heap_growth;
    this.total = Math.round(heapTotal / (1024 * 1024));
    this.used = Math.round(heapUsed / (1024 * 1024));
    // this.growth = Math.round(heap_growth);
    this.change = Math.round(heap_change);
    this.remaining = Math.round(this.max_heap_growth - heap_growth);

    this.time = Math.round(this.stop - this.start);

    console.log(`Version:  ${C.Green(`${this.version}`)}`);
    console.log(`Instance: ${C.Green(`${this.instance}`)}`);
    console.log(`Total:    ${C.Green(`${this.total} mb`)}`);
    console.log(`Used:     ${C.Green(`${this.used} mb`)}`);
    // console.log(`Growth:   ${C.Green(`${this.growth} mb`)}`);
    console.log(`Change:   ${C.Green(`${this.change} mb`)}`);
    console.log(`Time:     ${C.Green(`${this.time} ms`)}`);

    const chars = this.GetChars();
    if (chars > 0)
    {
      console.log(`Size:     ${C.Green(`${Math.round(chars * 2 / 1024)} kb`)}`);
    }

    const lines = this.GetLines();
    if (lines > 0)
    {
      console.log(`Lines:    ${C.Green(`${lines}`)}`);
    }

    return this;
  }

  OnThrow()
  {
    throw new Error(`Forced loader error`);
  }

  OnDevelopment()
  {
    this.development = !this.development;
    console.log("OnDevelopment", this.development);

    // if (this.root.searchParams.has("development"))
    // {
    //   // If we are already in development mode, then exit it
    //   this.root.searchParams.delete("development");
    // }
    // else
    // {
    //   // Not in development mode, so enter it
    //   this.root.searchParams.set("development", "true");
    // }

    // Force a hard reload
    this.Reload(true, undefined, true);
  }

  OnKey(raw, key)
  {
    key.alt = key.meta;
    key.raw = raw;

    switch (key.name)
    {
      case "backspace": return this.OnKeyBackspace(key);
      case "space": return this.OnKeySpace(key);
      case "tab": return this.OnKeyTab(key);
      case "enter": return this.OnKeyEnter(key);
      case "shift": return this.OnKeyShift(key);
      case "ctrl": return this.OnKeyCtrl(key);
      case "alt": return this.OnKeyAlt(key);
      case "pause": return this.OnKeyPause(key);
      case "capslock": return this.OnKeyCapsLock(key);
      case "escape": return this.OnKeyEscape(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pagedown": return this.OnKeyPageDown(key);
      case "end": return this.OnKeyEnd(key);
      case "home": return this.OnKeyHome(key);
      case "left": return this.OnKeyLeftArrow(key);
      case "up": return this.OnKeyUpArrow(key);
      case "right": return this.OnKeyRightArrow(key);
      case "down": return this.OnKeyDownArrow(key);
      case "insert": return this.OnKeyInsert(key);
      case "delete": return this.OnKeyDelete(key);
      case "0": return this.OnKey0(key);
      case "1": return this.OnKey1(key);
      case "2": return this.OnKey2(key);
      case "3": return this.OnKey3(key);
      case "4": return this.OnKey4(key);
      case "5": return this.OnKey5(key);
      case "6": return this.OnKey6(key);
      case "7": return this.OnKey7(key);
      case "8": return this.OnKey8(key);
      case "9": return this.OnKey9(key);
      case "a": return this.OnKeyA(key);
      case "b": return this.OnKeyB(key);
      case "c": return this.OnKeyC(key);
      case "d": return this.OnKeyD(key);
      case "e": return this.OnKeyE(key);
      case "f": return this.OnKeyF(key);
      case "g": return this.OnKeyG(key);
      case "h": return this.OnKeyH(key);
      case "i": return this.OnKeyI(key);
      case "j": return this.OnKeyJ(key);
      case "k": return this.OnKeyK(key);
      case "l": return this.OnKeyL(key);
      case "m": return this.OnKeyM(key);
      case "n": return this.OnKeyN(key);
      case "o": return this.OnKeyO(key);
      case "p": return this.OnKeyP(key);
      case "q": return this.OnKeyQ(key);
      case "r": return this.OnKeyR(key);
      case "s": return this.OnKeyS(key);
      case "t": return this.OnKeyT(key);
      case "u": return this.OnKeyU(key);
      case "v": return this.OnKeyV(key);
      case "w": return this.OnKeyW(key);
      case "x": return this.OnKeyX(key);
      case "y": return this.OnKeyY(key);
      case "z": return this.OnKeyZ(key);
      case "leftwindowkey": return this.OnKeyLeftWindowKey(key);
      case "rightwindowkey": return this.OnKeyRightWindowKey(key);
      case "selectkey": return this.OnKeySelectKey(key);
      case "numpad0": return this.OnKeyNumpad0(key);
      case "numpad1": return this.OnKeyNumpad1(key);
      case "numpad2": return this.OnKeyNumpad2(key);
      case "numpad3": return this.OnKeyNumpad3(key);
      case "numpad4": return this.OnKeyNumpad4(key);
      case "numpad5": return this.OnKeyNumpad5(key);
      case "numpad6": return this.OnKeyNumpad6(key);
      case "numpad7": return this.OnKeyNumpad7(key);
      case "numpad8": return this.OnKeyNumpad8(key);
      case "numpad9": return this.OnKeyNumpad9(key);
      case "multiply": return this.OnKeyMultiply(key);
      case "add": return this.OnKeyAdd(key);
      case "subtract": return this.OnKeySubtract(key);
      case "decimalpoint": return this.OnKeyDecimalPoint(key);
      case "divide": return this.OnKeyDivide(key);
      case "f1": return this.OnKeyF1(key);
      case "f2": return this.OnKeyF2(key);
      case "f3": return this.OnKeyF3(key);
      case "f4": return this.OnKeyF4(key);
      case "f5": return this.OnKeyF5(key);
      case "f6": return this.OnKeyF6(key);
      case "f7": return this.OnKeyF7(key);
      case "f8": return this.OnKeyF8(key);
      case "f9": return this.OnKeyF9(key);
      case "f10": return this.OnKeyF10(key);
      case "f11": return this.OnKeyF11(key);
      case "f12": return this.OnKeyF12(key);
      case "numlock": return this.OnKeyNumLock(key);
      case "scrolllock": return this.OnKeyScrollLock(key);
      case "volumemute": return this.OnAudioVolumeMute(key);
      case "volumedown": return this.OnAudioVolumeDown(key);
      case "volumeup": return this.OnAudioVolumeUp(key);
      case "mediaplayer": return this.OnLaunchMediaPlayer(key);
      case "application1": return this.OnLaunchApplication1(key);
      case "application2": return this.OnLaunchApplication2(key);
      case "semicolon": return this.OnKeySemiColon(key);
      case "colon": return this.OnKeyColon(key);
      case "equalsign": return this.OnKeyEqualSign(key);
      case "comma": return this.OnKeyComma(key);
      case "dash": return this.OnKeyDash(key);
      case "period": return this.OnKeyPeriod(key);
      case "forwardslash": return this.OnKeyForwardSlash(key);
      case "graveaccent": return this.OnKeyGraveAccent(key);
      case "openbracket": return this.OnKeyOpenBracket(key);
      case "backslash": return this.OnKeyBackSlash(key);
      case "closebraket": return this.OnKeyCloseBraket(key);
      case "singlequote": return this.OnKeySingleQuote(key);
      case "doublequote": return this.OnKeyDoubleQuote(key);
      case "backquote": return this.OnKeyBackQuote(key);
      default:
      {
        switch (key.sequence)
        {
          case "'": return this.Remap(key, "singlequote");
          case "\"": return this.Remap(key, "doublequote");
          case "\`": return this.Remap(key, "backquote");
          case ",": return this.Remap(key, "comma");
          case ".": return this.Remap(key, "period");
          case "/": return this.Remap(key, "forwardslash");
          case "\\": return this.Remap(key, "backslash");
          case ";": return this.Remap(key, "semicolon");
          case ":": return this.Remap(key, "colon");
          default: return this.OnKeyUnknown(key);
        }
      }
    }
  }

  Remap(key, name)
  {
    key.name = name;
    return this.OnKey(key.raw, key);
  }

  Import(specifier)
  {
    return import(specifier);
  }

  Update(entry, imports = false, updated = new WeakSet())
  {
    if (updated.has(entry)) return;
    else updated.add(entry);

    // console.log("Checking", entry.href);
    let result = false;

    // If it isn't already scheduled to be reloaded
    if (!this.updated_entries.has(entry))
    {
      result = entry.Update();
      this.updated_entries.add(entry);
    }

    // Iterate forward through imports or backwards through references
    // Forwards is used in hard reloading, backwards is used in soft reloading
    const entries = imports === true ? entry.GetImports() : entry.GetReferences();

    // console.log(entry.GetReferences(), entry.GetImports());

    for (const e of entries)
    {
      this.Update(e, imports, updated);
    }

    // if (result === true)
    // {
    //   entry.NewReload();
    // }

    return result;
  }

  async Reload(force = false, throws = false, hard = false)
  {
    if (force !== true && this.GetReloadable() !== true)
    {
      return false;
    }

    const old_promise = this[RELOAD_PROMISE];
    return this[RELOAD_PROMISE] = new Promise(async (resolve, reject) =>
    {
      this.SetReloadable(false); // This should happen ASAP so that we don't reload multiple times

      this.start = performance.now();

      // Inform the parent process that if this worker dies, it should NOT be
      // auto restarted, because it died to a startup error
      // If it restarted, it would just hit the same error all over again
      this.Send("ALLOW_AUTO_RESTART", false);

      await old_promise;

      this.parents.clear();
      this.instance += 1;

      this.chars = 0;
      this.lines = 0;
      this.files = 0;
      this.updated_entries.clear();

      if (hard === true)
      {
        this.Update(this.root, true);
      }

      try
      {
        if (this.last_result)
        {
          this.last_result.destructor();
          delete this.last_result;
        }

        const result = await import(this.root.HRef());
        this.last_result = await result.default();

        return resolve(true);
      }
      catch (error)
      {
        const parts = [];
        parts.push(C.Error("\nCompilation error:"));
        parts.push("\n\n   ", error);
        parts.push("\n");

        console.error(...parts);

        if (throws === true)
        {
          return reject(error);
        }
        else
        {
          return resolve(false); // Should this always reject?
        }
      }
      finally
      {
        this.stop = performance.now();

        // Log details as if the default was NOT prevented
        this.LogLoaded();
      }
    });
  }

  GetReloadPromise(){ return this[RELOAD_PROMISE]; }

  async Query(query, domains, state = {})
  {
    if (typeof(domains) !== "object") throw new Error(`Expected domains to be an object`);
    if (!(domains instanceof Array)) throw new Error(`Expected domains to be an array`);

    if (typeof(query) === "string")
    {
      query = new Query(query);
    }

    if (this.parents.has(query.specifier))
    {
      return this.parents.get(query.specifier);
    }

    if (query.parameters?.has("host"))
    {
      const host = query.parameters?.get("host");
      return new Remote(query.specifier, host);
    }

    const result = await super.Query(query, domains, state);
    if (result) return result;

    // Iterate each layer
    const layers = this.GetLayers();
    for (let i = 0; i < layers.length; i++)
    {
      const result = await layers[i].Query(query, domains, state);
      if (result) return result;
    }
  }

  QuerySync(query, domains)
  {
    if (typeof(domains) !== "object") throw new Error(`Expected domains to be an object, but got "${typeof(domains)}"`);
    if (!(domains instanceof Array)) throw new Error(`Expected domains to be an array`);

    if (typeof(query) === "string")
    {
      query = new Query(query);
    }

    if (this.parents.has(query.specifier))
    {
      return this.parents.get(query.specifier);
    }

    const state = {};

    // Iterate each layer
    const layers = this.GetLayers();
    for (let i = 0; i < layers.length; i++)
    {
      const result = layers[i].QuerySync(query, domains, state);
      if (result) return result;
    }
  }

  async Search(importer, specifier, domains = ["public"], extra_parameters)
  {
    const original = specifier;

    let search;
    let parameters;

    const index = specifier.lastIndexOf("?");
    if (index !== -1)
    {
      search = specifier.substring(index); // Extract the search string
      specifier = specifier.substring(0, index); // Get the rest without the search string
      parameters = new URLSearchParams(search);

      if (extra_parameters)
      {
        // Copy them over
        for (const [key, value] of extra_parameters)
        {
          parameters.set(key, value);
        }
      }
    }
    else
    {
      parameters = extra_parameters;
    }

    for (let i = 0; i < this.layers.length; i++)
    {
      const layer = this.layers[i];

      const entry = await layer.Search(importer, parameters, domains, specifier);

      if (entry)
      {
        return entry;
      }
    }

    if (parameters?.has("optional"))
    {
      return OPTIONAL;
    }
  }

  async Resolve(specifier, context, default_resolver)
  {
    if (context.conditions && (context.conditions[0] !== "node" || context.conditions[1] !== "import"))
    {
      console.warn("Unexpected import conditions", context.conditions, "on import", specifier);
    }

    if (RESOLVE_SKIPS.has(specifier))
    {
      return default_resolver(specifier, context, default_resolver);
    }

    if (this.redirects.has(specifier))
    {
      console.log("Redirecting", specifier, "to", this.redirects.get(specifier));

      return {
        format: "module",
        url: this.redirects.get(specifier).href,
      };
    }

    const original = specifier;
    const parent_url = context.parentURL;
    const parent_query = new Query(parent_url);
    const query = new Query(specifier);

    let parent;
    let entry;
    if ((typeof(parent_url) === "string"))
    {
      // If a file was imported from this file, bypass the parent search for performance
      if (parent_url === SELF_URL.href)
      {
        parent = this.root;
      }
      else if (parent_url.startsWith("https://"))
      {
        // This is essentially getting the parent of the parent file
        // In other words, the layer file that began the remote import process
        parent = this.parents.get(parent_url);
      }
      else if (this.parents.has(parent_url))
      {
        parent = this.parents.get(parent_url);
      }
      else
      {
        parent = await this.Query(parent_query, this.GetDomains());
      }

      if (!parent)
      {
        // The reason for this is that the parent can be used to check if
        // a certain import is allowed.
        // If there isn't a parent, we can't do that.
        // Also, AFAIK there is always a parent, so if there isn't,
        // something weird is happening
        throw new Error(`Parent "${parent_url}" cannot import "${specifier}" because it is not in the layer heirarchy. For security, layer files can only be imported by other layer files.`);
      }

      if (specifier === "loader:static" || specifier === "/loader.static")
      {
        parent.SetStatic(true);
        this.static_entries.set(parent, parent_url);

        return {
          format: "module",
          url: NULL_URL,
        };
      }
      // Absolute path, or node/browser style relative path
      else if (specifier.startsWith("/") || specifier.startsWith(".") || specifier.startsWith("file:///"))
      {
        const domains = parent.GetDomains() ?? this.GetDomains();
        entry = await this.Query(query, domains);

        if (!entry)
        {
          throw new Error(`Failed to import a file or directory for specifier "${specifier}" from "${parent?.href ?? "UNKNOWN PARENT"}"`);
        }
      }
      else if (specifier.startsWith("https://"))
      {
        console.log("Got HTTPs request", specifier);
        this.parents.set(specifier, parent);
        return {
          url: specifier,
        };
      }
    }
    else
    {
      // This is necessary because of how the nodejs process encodes the query string in the command line
      const start_url = new URL(decodeURIComponent(this.GetPackage().start_url));

      this.root = await this.Query(start_url.href, this.GetDomains());
      if (!this.root) throw new Error(`Failed to find a root from start_url "${start_url}"`);

      entry = this.root;

      this.root.SetVersion(this.version);
      // this.root.searchParams.set("version", this.version);

      if (typeof(this.instance) === "number")
      {
        this.root.SetInstance(this.instance);
        // this.root.searchParams.set("instance", this.instance);
      }

      if (this.development === true)
      {
        this.root.SetDevelopment(this.development);
        // this.root.searchParams.set("development", true);
      }

      this.instance -= 1;

      // QUESTION: Should this await? I think so, because otherwise errors might not be handled, right?
      await this.Reload(true, false);
    }

    if (entry)
    {
      entry.SetSpecifier(query);

      const old_specifier = this.specifiers.get(entry);
      const parameters = query.GetParameters();
      const search = query.GetSearch();
      // const sandbox = parameters?.get("sandbox");

      if (this.static_entries.has(entry))
      {
        // specifier = this.static_entries.get(entry) ?? entry.href;
        specifier = entry.HRef(parameters, parent_query.GetParameters());
      }
      else if (parameters?.has("static"))
      {
        entry.SetStatic(true);
        specifier = entry.HRef(parameters, parent_query.GetParameters());
        // specifier = entry.href;

        this.static_entries.set(entry, specifier);
      }
      // else if (parameters?.has("sandbox"))
      // {
      //   specifier = entry.HRef(parameters, parent_query.GetParameters());
      //   // specifier = entry.href;
      //
      //   this.static_entries.set(entry, specifier);
      // }
      else
      {
        // specifier = entry.href + this.root.search;
        // entry.UpdateFrom(parent);
        specifier = entry.HRef(parameters, parent_query.GetParameters());
        // console.log("Default import", specifier);
      }

      // if (parameters?.has("sandbox") || parent_query.GetParameters()?.has("sandbox"))
      // {
      //   console.log("Assigning sandbox", parameters.get("sandbox"), "to", entry.href);
      //   // entry.SetSandbox(parameters.get("sandbox"));
      // }

      if (old_specifier === undefined)
      {
        this.files += 1;
        // console.log("No old_specifier for", entry.href);
      }
      else if (old_specifier && old_specifier !== specifier)
      {
        this.files += 1;

        if (this.destructors.has(old_specifier))
        {
          const callbacks = this.destructors.get(old_specifier);
          this.destructors.delete(old_specifier);

          try
          {
            for (const callback of callbacks)
            {
              callback(this);
            }
          }
          catch (error)
          {
            console.error(`Destructor callback error`, error);
          }
        }

        // TODO: I think files are getting reloaded multiple times
        await entry.Reload();
      }

      if (parent)
      {
        parent.AddSpecifier(original, entry);
        parent.AddImport(entry);
        entry.AddReference(parent);
      }

      this.parents.set(specifier, entry);
      this.specifiers.set(entry, specifier);

      return {
        format: "module",
        url: specifier,
      };
    }

    return default_resolver(specifier, context, default_resolver);
  }

  async Load(specifier, context, default_loader)
  {
    console.log("~~Loading", specifier);

    return default_loader(specifier, context, default_loader);
  }

  // NOTE: Not sure if this is right for node_modules? Some node_modules may be ES6 modules
  async GetFormat(url, context, default_get_format)
  {
    if (url.startsWith("node:"))
    {
      return {
        format: "builtin",
      };
    }
    else if (url.includes("/node_modules/"))
    {
      return {
        format: "commonjs",
      };
    }
    else
    {
      return {
        format: "module",
      };
    }

    return default_get_format(url, context, default_get_format);
  }

  Encode(c)
  {
    const code = c.charCodeAt();
    const hex = code.toString(16);

    // If the code is small enough, use the more compact hexadecimal
    // escape sequence. Otherwise use a unicode escape sequence.
    if      (16 > code) return "\\x0" + hex;
    else if (256 > code) return "\\x" + hex;
    else if (4096 > code) return "\\u0" + hex;
    else if (65536 > code) return "\\u" + hex;
    else return `\\u{${hex}}`;
  }

  Escape(c)
  {
    switch (c)
    {
      // As far as I know, these should be all of the reserved characters in a JavaScript string
      case "\0":
      case "\b":
      case "\f":
      case "\n":
      case "\r":
      case "\t":
      case "\v":
      case "\'":
      case "\`":
      case "\"":
      case "\\": return this.Encode(c);
      default: return c; // No need to encode it
    }
  }

  GetHTTPS(url)
  {
    return new Promise((resolve, reject) =>
    {
      https.get(url, res =>
      {
        let data = "";
        res.on("data", chunk =>
        {
          data += chunk;
        });

        res.on("end", () =>
        {
          resolve(data);
        });
      })
      .on("error", error => reject(error));
    });
  }

  async GetSource(url, context, default_get_source)
  {
    if (url === NULL_URL)
    {
      return {
        source: "",
      };
    }
    else if (this.allow_https === true && url.startsWith("https://"))
    {
      let source = await this.GetHTTPS(url);
      console.log("Get source for HTTPs request", url, source.length);

      return {
        source,
      };
    }

    const entry = await this.Query(url, this.GetDomains());

    if (entry)
    {
      // if (!url.includes("/js/Loader/GetSource.js"))
      // {
      //   this.get_source_handler ??= await import("/js/Loader/GetSource.js");
      //   const source = await this.get_source_handler.default(entry);
      //
      //   if (source)
      //   {
      //     return {
      //       source,
      //     };
      //   }
      // }

      if (entry.IsFile())
      {
        const extension = entry.GetPathExtension();

        // For non-JS files, embed the file data as a default export string
        if (extension !== ".js" && extension !== ".cjs" && extension !== ".mjs")
        {
          const text = await entry.Read();

          let source = "export default \"";
          for (let i = 0; i < text.length; i++)
          {
            source += this.Escape(text[i]);
          }
          source += "\";";

          return {
            format: "module",
            source,
          };
        }
      }

      // let source = await entry.GetCustomSource(url, this, this.GetDomains());
      let source = await entry.GetSource();

      if (source)
      {
        if (typeof(source) === "string")
        {
          source = Buffer.from(source, "utf8");
        }

        return {
          source,
        };
      }
    }

    const result = await default_get_source(url, context, default_get_source);

    if (entry)
    {
      entry.SetSource(result.source);
    }

    return result;
  }

  async TransformSource(source, context, default_transform_source)
  {
    const {url, format} = context;

    const entry = await this.Query(url, this.GetDomains());
    source = await entry?.TransformSource(url, source, format) ?? source;

    return {
      source,
    };

    // return default_transform_source(source, context, default_transform_source);
  }

  DynamicInstantiate(url)
  {
    console.log("DynamicInstantiate:", url);

    // return default_transform_source(source, context, default_transform_source);

    return {
      exports: ["customExportName"],
      execute: (exports) =>
      {
        console.log("EXECUTE:", exports);

        // Get and set functions provided for pre-allocated export names
        exports.customExportName.set("value");
      },
    };
  }

  SetChars(chars){ this.chars = chars; return this; }
  SetLines(lines){ this.lines = lines; return this; }
  AddChars(chars){ this.chars += chars; return this; }
  AddLines(lines){ this.lines += lines; return this; }
  GetChars(){ return this.chars; }
  GetLines(){ return this.lines; }

  GetRoot(){ return this.root; }
  GetVersion(){ return this.version; }
  GetTotal(){ return this.total; }
  GetUsed(){ return this.used; }
  GetGrowth(){ return this.growth; }
  GetChange(){ return this.change; }
  GetRemaining(){ return this.remaining; }
  GetStart(){ return this.start; }
  GetStop(){ return this.stop; }
  GetTime(){ return this.time; }
  GetLayers(){ return this.layers; }

  GetEnvironment(){ return this.environment; }
  HasEnvironment(){ return this.GetEnvironment() !== undefined; }
  SetEnvironment(environment){ this.environment = environment; return this; }

  GetSelfURL(){ return SELF_URL; }
  GetEntryClass(){ return Entry; }
  GetDirectoryClass(){ return Directory; }
  GetLayerClass(){ return Layer; }
  GetFileClass(){ return File; }
  GetQueryClass(){ return Query; }
  GetConsoleColorsClass(){ return ConsoleColors; }
  GetDomains(){ return this.GetPackage().domains; }
  GetReloadable(){ return this.reloadable; }
  GetDevelopment(){ return this.development; }
  GetInstance(){ return this.instance; }
  GetVersionMajor(){ return this.version_major; }
  GetVersionMinor(){ return this.version_minor; }
  GetVersionPatch(){ return this.version_patch; }
  GetMode(){ return "server"; }

  IsRestricted(){ return this.GetPackage().Read("restricted") === true; }

  GetWindowURL(){ return this.GetPackage().Read("window_url"); }
  GetContentType(){ return this.GetPackage().Read("content_type"); }
  GetStorageQuota(){ return this.GetPackage().Read("storage_quota"); }

  SetReloadable(reloadable){ this.reloadable = reloadable; return this; }

  GetErrorParser(){ return this.error_parser ??= import("/js/External/ErrorParser.js").then(m => m.default); }
  GetLoaderHTML(){ return this.loader_html ??= import("/js/Loader/HTML.js").then(m => m.default); }
  GetLoaderCSS(){ return this.loader_css ??= import("/js/Loader/CSS.js").then(m => m.default); }

  async IsTrustedStack()
  {
    const {default: ErrorParser} = await import("/js/External/ErrorParser.js?static=true");

    try
    {
      throw new Error();
    }
    catch (error)
    {
      const stack = ErrorParser(error);
      // stack.pop(); // Get rid of the Loader.IsTrustedStack call
      console.log("Checking stack", stack);
      const layers = this.GetLayers();
      const layer = layers[layers.length - 1];
      const domains = this.GetDomains();

      // for (let i = 0; i < stack.length; i++)
      // {
      //   const {name, file} = stack[i];
      //   const entry = await layer.Query(file, domains);
      // }
    }
  }

  async IsTrustedStack()
  {
    try
    {
      throw new Error();
    }
    catch (error)
    {
      const {default: ErrorParser} = await import("/js/External/ErrorParser.js");

      const stack = ErrorParser(error);
      stack.shift(); // Get rid of the Loader.IsTrustedStack call

      const layers = this.GetLayers();
      const layer = layers[layers.length - 1];
      const domains = this.GetDomains();

      let trusted = true;
      for (let i = 0; i < stack.length; i++)
      {
        const {name, file} = stack[i];
        const entry = await layer.Query(file, domains);

        if (!entry)
        {
          trusted = false;
        }
      }

      return trusted;
    }
  }
}

const taggly_loader = Symbol.for("taggly_loader");
const loader = new Loader();

let accessed = false;
Object.defineProperty(global, taggly_loader, {
  enumerable: false,
  configurable: false,

  // We only allow the loader to be accessed globaly one time
  // Since the private/js/Loader.js file always accesses the loader,
  // if anything ELSE tries to, it should cause an error
  get()
  {
    if (accessed !== true)
    {
      accessed = true;
      return loader;
    }
    else
    {
      throw new Error(`The Loader global has already been accessed and may only be accessed once for security`);
    }
  },
});

Object.defineProperty(globalThis, Symbol.for("global.taggly.internal"), {
  value: {
    // We only allow the loader to be accessed globaly one time
    // Since the /js/Loader.js file always accesses the loader,
    // if anything ELSE tries to, it should cause an error
    Loader()
    {
      if (accessed !== true)
      {
        accessed = true;
        return loader;
      }
      else
      {
        throw new Error(`The Loader global has already been accessed and may only be accessed once for security`);

        // console.error("Temporarily allowing loader to be accessed many times...");
        // return loader;
      }
    },

    // Expose these as a standalone function so it can be used by importing /js/Loader/File.js
    // Which is not protected, unlike /js/Loader.js
    Static(...args){ return Promise.resolve(loader.MakeStatic(...args)).then(() => undefined); },
    Destructor(...args){ return Promise.resolve(loader.Destructor(...args)).then(() => undefined); },
  },
  enumerable: false,
  configurable: false,
  writable: false,
});

export function resolve(...args){ return loader.Resolve.apply(loader, args); }
export function load(...args){ return loader.Load.apply(loader, args); }
export function getFormat(...args){ return loader.GetFormat.apply(loader, args); }
export function getSource(...args){ return loader.GetSource.apply(loader, args); }
// export function transformSource(...args){ return loader.TransformSource.apply(loader, args); }

global.process.on("message", (...args) =>
{
  loader.OnMessage.apply(loader, args);
});

global.process.on("uncaughtExceptionMonitor", (...args) =>
{
  loader.OnUncaughtException.apply(loader, args);
});

if (import.meta.resolve)
{
  console.warn("import.meta.resolve is defined. This may break security when running untrusted code! I'm not sure if it actually does or not. It would depend on if import.meta.resolve bypasses the normal loader system. What makes it different from a dynamic import?");
}

// const sites = [];
// const taggly = new Layer("");
// const layers = [];
//
// export async function resolve(specifier, context, default_resolver)
// {
//   console.log("Resolve", specifier, context);
//   for (const layer of layers)
//   {
//     const result = await layer.Resolve(specifier, context, default_resolver);
//     if (result)
//     {
//       return result;
//     }
//   }
//
//   return default_resolver(specifier, context, default_resolver);
//   // return loader.Resolve.apply(loader, args);
// }
//
// // export function load(...args){ return loader.Load.apply(loader, args); }
// export function getFormat(url, context, default_get_format)
// {
//   return default_get_format(url, context, default_get_format);
// }

// let get_source_handler;
// export async function getSource(url, context, default_get_source)
// {
//   if (!url.includes("/js/Loader/GetSource.js"))
//   {
//     get_source_handler ??= await import("/js/Loader/GetSource.js");
//     const source = await get_source_handler.default(url, context, default_get_source);
//
//     if (source)
//     {
//       return {
//         source,
//       };
//     }
//   }
//
//   return loader.GetSource(url, context, default_get_source)
//   // return default_get_source(url, context, default_get_source);
// }

// global.process.on("internalMessage", (message) =>
// {
//   console.log("Internal message:", message);
// });

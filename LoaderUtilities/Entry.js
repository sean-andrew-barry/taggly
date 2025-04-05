import fs, {promises as fsp} from "fs";
import node_path from "path";
import {fileURLToPath} from "url";

const STATE = Symbol("state");
const LAYER = Symbol("layer");
const DOMAIN = Symbol("domain");
const LAYER_INDEX = Symbol("layer_index");
const STATS = Symbol("stats");
const PREV_STATS = Symbol("prev_stats");
const CHILDREN = Symbol("children");
const NAME = Symbol("name");
const SPECIFIER = Symbol("specifier");
const CACHE = Symbol("cache");
const CHECK_ACCESS = Symbol("check_access");
const PATH = Symbol("path");
const VERSION = Symbol("version");
const INSTANCE = Symbol("instance");
const DEVELOPMENT = Symbol("development");
const SANDBOX = Symbol("sandbox");
const PARTS = Symbol("parts");
const HREF_PARTS = Symbol("href_parts");
const IMPORTS = Symbol("imports");
const REFERENCES = Symbol("references");
const SPECIFIERS = Symbol("specifiers");
const SOURCE = Symbol("source");
const FORMAT = Symbol("format");
const PARENT = Symbol("parent");
const IMPORTER = Symbol("importer");
const CHARS = Symbol("chars");
const LINES = Symbol("lines");
const CHANGED = Symbol("changed");
const STATIC = Symbol("static");
const SEARCH = Symbol("search");

const BASE = new globalThis.URL(import.meta.url);
const SANDBOXES = new WeakMap();

export class Entry extends globalThis.URL
{
  static GetLayerIndexSymbol(){ return LAYER_INDEX; }
  static GetStatsSymbol(){ return STATS; }
  static GetPrevStatsSymbol(){ return PREV_STATS; }
  static GetChildrenSymbol(){ return CHILDREN; }
  static GetNameSymbol(){ return NAME; }
  static GetSpecifierSymbol(){ return SPECIFIER; }
  static GetCacheSymbol(){ return CACHE; }
  static GetCheckAccessSymbol(){ return CHECK_ACCESS; }
  static GetPathSymbol(){ return PATH; }
  static GetVersionSymbol(){ return VERSION; }
  static GetPartsSymbol(){ return PARTS; }
  static GetHrefPartsSymbol(){ return HREF_PARTS; }
  static GetImportsSymbol(){ return IMPORTS; }

  // Create a new entry in the same location as the source
  static From(source, stats = source.GetStats())
  {
    const entry = new this(source.href);

    entry.SetStats(stats);
    entry.SetName(source.GetName());
    entry.SetLayer(source.GetLayer());
    entry.SetDomain(source.GetDomain());
    entry.SetLayerIndex(source.GetLayerIndex());
    entry.SetParent(source.GetParent());

    return entry;
  }

  constructor(url, base = BASE)
  {
    super(url, base);
  }

  // NOTE: Credit to SO user Emil Vikström at https://stackoverflow.com/a/41439945
  // for this handly bit of code
  // Thank you!
  CountBufferLines(buffer)
  {
    let index = -1;
    let line_count = -1;

    do
    {
      index = buffer.indexOf(10, index + 1);
      line_count++;
    }
    while (index !== -1);

    return line_count;
  }

  Reload()
  {
    // console.log("Reloading", this.href, new Error().stack);
    // console.log("Entry.Reload", this.href);

    this.SetChars(0);
    this.SetLines(0);

    this.GetImports().clear();
    this.GetReferences().clear();
    this.GetSpecifiers().clear();

    delete this[STATS];
    delete this[PREV_STATS];
    delete this[CACHE];
    delete this[PARTS];
    delete this[HREF_PARTS];
    delete this[SPECIFIER];
    delete this[CHANGED];
  }

  Update()
  {
    // Static files don't update
    // TODO: Should they if their contents were actually modified?
    if (this.IsStatic()) return false;

    const instance = this.GetInstance() + 1;
    // console.log("Updating", this.href, "to", instance);
    this.SetInstance(instance);

    return true; // Updated
  }

  async TransformSource(specifier, source, format)
  {
    // this.SetSource(source);
    this.SetFormat(format);

    this.SetChars(0);
    this.SetLines(0);

    const chars = source.length;
    const lines = this.CountBufferLines(source);

    this.UpdateSize(chars, lines);

    return source;
  }

  UpdateSize(chars, lines)
  {
    this[CHARS] += chars;
    this[LINES] += lines;

    this.GetParent()?.UpdateSize(chars, lines);
  }

  SetChars(chars){ this[CHARS] = chars; return this; }
  SetLines(lines){ this[LINES] = lines; return this; }

  GetChars(){ return this[CHARS]; }
  GetLines(){ return this[LINES]; }

  SetSource(source){ this[SOURCE] = source; return this; }
  GetSource(){ return this[SOURCE]; }

  SetFormat(format){ this[FORMAT] = format; return this; }
  GetFormat(){ return this[FORMAT]; }

  SetChanged(changed){ this[CHANGED] = changed; return this; }
  GetChanged(){ return this[CHANGED]; }

  SetStatic(_static){ this[STATIC] = _static; return this; }
  GetStatic(){ return this[STATIC]; }

  // SetName(name){ this.#name = name; return this; }
  // GetName(){ return this.#name; }

  GetCustomSource(specifier, loader, domains)
  {
    return this.GetSource();
  }

  SetParent(parent){ this[PARENT] = parent; return this; }
  GetParent(){ return this[PARENT]; }

  GetSearch()
  {
    // if (this.hasOwnProperty(SEARCH)) return this[SEARCH];
    const params = new URLSearchParams();

    const version = this.GetVersion();
    if (version !== undefined)
    {
      params.set("version", version);
    }

    const instance = this.GetInstance();
    if (instance !== undefined)
    {
      params.set("instance", instance);
    }

    const development = this.GetDevelopment();
    if (development !== undefined)
    {
      params.set("development", development);
    }

    // console.log("GetSearch", this.href, this.GetInstance(), this.GetVersion());
    // return this[SEARCH] = params.toString();
    return params.toString();
  }

  IsStatic(){ return this.hasOwnProperty(STATIC); }

  UpdateFrom(entry)
  {
    if (!entry) return;
    if (this.IsStatic()) return;

    const version = entry.GetVersion();
    const instance = entry.GetInstance();
    const development = entry.GetDevelopment();

    this.SetVersion(version);
    this.SetInstance(instance);
    this.SetDevelopment(development);
  }

  // #sandboxes = new Map();
  //
  // GetSandboxFor(name)
  // {
  //   let sandboxes = SANDBOXES.get(this);
  //
  //   if (!sandboxes)
  //   {
  //     sandboxes = new Map();
  //     SANDBOXES.set(this, sandboxes);
  //   }
  //
  //   let sandbox = sandboxes.get(name);
  //   if (!sandbox)
  //   {
  //     sandbox = {
  //       version: "1.0.0",
  //       instance: 0,
  //     };
  //     sandboxes.set(name, sandbox);
  //   }
  //
  //   return sandbox;
  // }
  //
  // GetSandboxFor(name)
  // {
  //   let sandbox = this.#sandboxes.get(name);
  //
  //   if (!sandbox)
  //   {
  //     sandbox = new URLSearchParams({
  //       version: 0,
  //     });
  //
  //     sandboxes.set(name, sandbox);
  //   }
  //
  //   return sandbox;
  // }

  // GetSearchParams(sandbox_name = "global")
  GetSearchParams()
  {
    const params = new URLSearchParams();

    const version = this.GetVersion();
    if (version !== undefined)
    {
      params.set("version", version);
    }

    const instance = this.GetInstance();
    if (instance !== undefined)
    {
      params.set("instance", instance);
    }

    const development = this.GetDevelopment();
    if (development !== undefined)
    {
      params.set("development", development);
    }

    // const sandbox = this.GetSandbox();
    // if (sandbox)
    // {
    //   params.set("sandbox", sandbox);
    // }

    return params;
  }

  PopulateParams(params = new URLSearchParams())
  {

  }

  HRef(query_params, parent_query_params)
  {
    // if (parent)
    // {
    //   const sandbox = parent.GetSandbox();
    //   if (sandbox)
    //   {
    //     console.log("Copying sandbox", sandbox, "to", this.href);
    //     this.SetSandbox(sandbox);
    //   }
    // }

    const params = new URLSearchParams();

    const version = this.GetVersion();
    if (version !== undefined)
    {
      params.set("version", version);
    }

    const instance = this.GetInstance();
    if (instance !== undefined)
    {
      params.set("instance", instance);
    }

    const development = this.GetDevelopment();
    if (development !== undefined)
    {
      params.set("development", development);
    }

    if (query_params?.has("sandbox"))
    {
      const sandbox = query_params.get("sandbox");
      console.log("Copying sandbox", sandbox, "to", this.href);
      params.set("sandbox", sandbox);
    }
    else if (parent_query_params?.has("sandbox"))
    {
      const sandbox = parent_query_params.get("sandbox");
      console.log("Copying parent sandbox", sandbox, "to", this.href);
      params.set("sandbox", sandbox);
    }

    return this.href + "?" + params.toString();
  }

  async RemoveChild(child)
  {
    const children = this.GetChildren();
    for (const key in children)
    {
      const current = await children[key]; // Children are stored as promises
      if (current === child)
      {
        delete children[key];
        return;
      }
    }

    throw new Error(`Failed to remove child "${child.href}" from parent "${this.href}"`);
  }

  async RemoveChild(child)
  {
    const children = this.GetChildren();
    const name = child.GetName();

    if (children.has(name))
    {
      const promise = children.get(name);
      if (!promise) throw new Error(`Cannot remove child "${child}" because there is no promise registered for its name "${name}"`);

      const entry = children.get(promise);
      if (!entry) throw new Error(`Cannot remove child "${child}" because it has no entry registered for its promise`);

      children.delete(name);
      children.delete(promise);
      return;
    }

    throw new Error(`Failed to remove child "${child}" from parent "${this}"`);
  }

  async ReplaceChild(child, replacement)
  {
    await this.RemoveChild(child);

    const children = this.GetChildren();

    const name = replacement.GetName();
    const promise = Promise.resolve(replacement);
    children.set(name, promise);
    children.set(promise, replacement);
  }

  async Validate()
  {
    try
    {
      const stats = await fsp.stat(this);
      this.SetStats(stats);
      return true;
    }
    catch (error)
    {
      await this.GetParent()?.RemoveChild(this);
      return false;
    }
  }

  async Search(importer, parameters, domains, specifier, validate, parts, index)
  {
    if (validate === true && (await this.Validate()) !== true)
    {
      return; // Couldn't validate the file, so refuse to match it in the search
    }

    if (importer && parameters?.has("next"))
    {
      // If the importer href matches this href, then it means we want the NEXT one in the heirarchy
      if (importer.href === this.href)
      {
        // So delete the next parameter so it can actually match the next one
        parameters.delete("next");
      }

      // Refuse to match if there is a next parameter. The next must be deleted first
      return;
    }

    // Does this serve any purpose? Should I remove it?
    if (parameters?.has("skip"))
    {
      const skip = Number(parameters.get("skip"));
      if (index === skip) return;
    }

    if (parameters?.has("include"))
    {
      const include = parameters.get("include");
      if (!this.pathname.includes(include)) return;
    }

    if (parameters?.has("exclude"))
    {
      const exclude = parameters.get("exclude");
      if (this.pathname.includes(exclude)) return;
    }

    this[IMPORTER]  = importer;
    this[SPECIFIER] = specifier;

    return this;
  }

  Query(query, index, state)
  {
    const prev = state.prev;
    state.prev = this;

    // If there is a next parameter, this Entry will be skipped if the
    // previously checked entry does not include the next value
    if (query.HasNext())
    {
      const next = query.GetNext();
      if (prev?.pathname.includes(next) !== true)
      {
        return;
      }
    }

    if (query.HasInclude())
    {
      const include = query.GetInclude();
      if (!this.pathname.includes(include)) return;
    }

    if (query.HasExclude())
    {
      const exclude = query.GetExclude();
      if (this.pathname.includes(exclude)) return;
    }

    return this;
  }

  QuerySync(query, index, state)
  {
    const prev = state.prev;
    state.prev = this;

    if (query.HasNext())
    {
      const next = query.GetNext();
      if (prev?.pathname.includes(next) !== true)
      {
        return;
      }
    }

    if (query.HasInclude())
    {
      const include = query.GetInclude();
      if (!this.pathname.includes(include)) return;
    }

    if (query.HasExclude())
    {
      const exclude = query.GetExclude();
      if (this.pathname.includes(exclude)) return;
    }

    return this;
  }

  IsTrusted(){ return this.trusted === true; }
  GetTrusted(){ return this.trusted; }
  SetTrusted(trusted){ return this.trusted = trusted; }

  async Refresh()
  {
    const stats = await this.GetStats();
    this.SetPrevStats(stats);
    delete this[STATS];

    const new_stats = await this.GetStats();

    if (new_stats.mtime > stats.mtime)
    {
      console.log("Refreshing entry", this.href);
      delete this[CACHE];
      return true;
    }
    else
    {
      return false;
    }
  }

  // TODO: This probably isn't actually working, need to fix the url/filepath mix
  Rename(filepath)
  {
    return new Promise((resolve, reject) =>
    {
      fs.rename(this, filepath, (error) =>
      {
        if (error) return reject(error);
        return resolve(this);
      });
    });
  }

  Split(string){ return string.replace(/^\/|\/$/g, "").split("/"); }

  Access(flags)
  {
    return new Promise((resolve, reject) =>
    {
      fs.access(this, flags, (error) =>
      {
        if (error) return resolve(false);
        else return resolve(true);
      });
    });
  }

  AccessSync(flags)
  {
    try
    {
      const access = fs.accessSync(this, flags);
      return true;
    }
    catch (error)
    {
      return false;
    }
  }

  SetStats(stats){ return this[STATS] = stats; }

  GetStats(force = false)
  {
    if (force === true)
    {
      this[STATS] = undefined;
    }
    else if (this.hasOwnProperty(STATS))
    {
      return this[STATS];
    }

    return this.SetStats(new Promise((resolve, reject) =>
    {
      fs.stat(this, (error, stats) =>
      {
        if (error) return reject(error);
        else return resolve(stats);
      });
    }));
  }

  AddImport(entry)
  {
    const imports = this.GetImports();
    imports.add(entry);

    return this;
  }

  AddSpecifier(specifier, entry)
  {
    const specifiers = this.GetSpecifiers();
    specifiers.set(specifier, entry);

    return this;
  }

  AddReference(entry)
  {
    const references = this.GetReferences();
    references.add(entry);

    return this;
  }

  GetState(){ return this[STATE] ?? this.SetState({}); }
  SetState(state){ return this[STATE] = state; }

  GetImports(){ return this[IMPORTS] || this.SetImports(new Set()); }
  SetImports(imports){ return this[IMPORTS] = imports; }

  GetReferences(){ return this[REFERENCES] || this.SetReferences(new Set()); }
  SetReferences(references){ return this[REFERENCES] = references; }

  GetSpecifiers(){ return this[SPECIFIERS] || this.SetSpecifiers(new Map()); }
  SetSpecifiers(specifiers){ return this[SPECIFIERS] = specifiers; }

  GetLayer(){ return this[LAYER]; }
  SetLayer(layer){ return this[LAYER] = layer; }

  GetDomain(){ return this[DOMAIN]; }
  SetDomain(domain){ return this[DOMAIN] = domain; }

  GetLayerIndex(){ return this[LAYER_INDEX]; }
  SetLayerIndex(layer_index){ return this[LAYER_INDEX] = layer_index; }

  SetPrevStats(prev_stats){ return this[PREV_STATS] = prev_stats; }
  GetPrevStats(){ return this[PREV_STATS]; }

  SetChildren(children){ return this[CHILDREN] = children; }
  GetChildren(){ return this[CHILDREN] || this.SetChildren(new Map()); }

  SetName(name){ return this[NAME] = name; }
  GetName(){ return this[NAME]; }

  SetVersion(version){ return this[VERSION] = version; }
  GetVersion(){ return this[VERSION]; }

  SetInstance(instance){ return this[INSTANCE] = instance; }
  GetInstance(){ return this[INSTANCE] ?? 0; }

  SetDevelopment(development){ return this[DEVELOPMENT] = development; }
  GetDevelopment(){ return this[DEVELOPMENT]; }

  SetSandbox(sandbox){ return this[SANDBOX] = sandbox; }
  GetSandbox(){ return this[SANDBOX]; }

  SetCache(cache){ return this[CACHE] = cache; }
  GetCache(){ return this[CACHE] || this.SetCache({}); }

  SetPath(path){ return this[PATH] = path; }
  GetPath(){ return this[PATH] || this.SetPath(fileURLToPath(this)); }

  SetSpecifier(specifier){ return this[SPECIFIER] = specifier; }
  GetSpecifier(){ return this[SPECIFIER]; }

  SetParts(parts){ return this[PARTS] = parts; }
  GetParts(){ return this[PARTS] || this.SetParts(this.Split(this.pathname)); }

  GetRawHRef(){ return `${this.protocol}//${this.host}${this.pathname}`; }
  SetHRefParts(href_parts){ return this[HREF_PARTS] = href_parts; }
  GetHRefParts(){ return this[HREF_PARTS] || this.SetHRefParts(this.Split(this.href)); }
  // GetHRefParts(){ return this[HREF_PARTS] || this.SetHRefParts(this.Split(this.GetRawHRef())); }
  GetHRefPartsCopy(){ return this.GetHRefParts().slice(); }

  GetDirName(){ return node_path.dirname(this.GetPath()); }

  GetPathName(){ return node_path.win32.basename(this.GetPath(), node_path.extname(this.GetPath())); }
  GetFullName(){ return node_path.win32.basename(this.GetPath()); }
  GetPathExtension(){ return node_path.extname(this.GetPath()); }
  GetExtension(){ return this.GetPathExtension(); }
  GetPathParent(){ return node_path.dirname(this.GetPath()); }
  GetPathNormalized(){ return node_path.normalize(this.GetPath()); }
  GetSize(){ return this.GetStats().then(stats => stats.size); }
  GetLastModified(){ return this.GetStats().then(stats => stats.mtime.getTime()); }
  async GetLastModified(){ return (await this.GetStats()).mtime; }
  GetAge(){ return this.GetLastModified().then(time => Date.now() - time); }

  GetMimeType(){ return "text/plain"; } // Fallback for non-files
  GetCharSet(){ return "utf-8"; }

  IsReal      (){ return this.Access(fs.constants.F_OK); }
  IsReadable  (){ return this.Access(fs.constants.F_OK | fs.constants.R_OK); }
  IsWritable  (){ return this.Access(fs.constants.F_OK | fs.constants.W_OK); }
  IsAccessible(){ return this.Access(fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK); }

  IsRealSync      (){ return this.AccessSync(fs.constants.F_OK); }
  IsReadableSync  (){ return this.AccessSync(fs.constants.F_OK | fs.constants.R_OK); }
  IsWritableSync  (){ return this.AccessSync(fs.constants.F_OK | fs.constants.W_OK); }
  IsAccessibleSync(){ return this.AccessSync(fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK); }

  IsAbsolute(){ return node_path.isAbsolute(this.GetPath()); }
  IsFile(){ return false; }
  IsDirectory(){ return false; }
  IsOptional(){ return false; }
  IsUndefined(){ return false; }

  GetDomains()
  {
    const layer = this.GetLayer();

    if (layer) return layer.GetDomains();
    else throw new Error(`Entry "${this.href}" cannot GetDomains because it has no layer.`);
  }

  OnUpdated(state){ delete this[SOURCE]; }
  OnRemoved(state){ delete this[SOURCE]; }
  OnCreated(state){ delete this[SOURCE]; }

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
}

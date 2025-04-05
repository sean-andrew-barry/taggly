import "/flag#dangerous";
// import "/flag#frozen";

import FS from "node:fs";
import node_path from "node:path";
import {fileURLToPath} from "node:url";
import * as Entries from "/js/FileSystem/Entries.js";
// import {Directory, File, Layer, Domain, Placeholder} from "/js/FileSystem/Entries.js";
import {BitSet} from "/js/BitSet.js";
import {Getter} from "/js/Loader/Getter.js";
import {CountBufferLines} from "/js/External/CountBufferLines.js";

// import {File as F} from "/js/FileSystem/Entry/File.js";

// console.log(Entries);

const REBUILT = new WeakMap();
const BASE = new globalThis.URL(import.meta.url);

let unique = 0;

export class Entry extends globalThis.URL
{
  static Rebuild(entry, parent)
  {
    if (entry.IsFile())
    {
      if (entry instanceof Entries.File) return entry;
      else return new Entries.File(entry, parent);
    }
    else if (entry.IsLayer())
    {
      if (entry instanceof Entries.Layer) return entry;
      else return new Entries.Layer(entry, parent);
    }
    else if (entry.IsDomain())
    {
      if (entry instanceof Entries.Domain) return entry;
      else return new Entries.Domain(entry, parent);
    }
    else if (entry.IsDirectory())
    {
      if (entry instanceof Entries.Directory) return entry;
      else return new Entries.Directory(entry, parent);
    }
    else if (entry.IsPlaceholder())
    {
      if (entry instanceof Entries.Placeholder) return entry;
      else return new Entries.Placeholder(entry, parent);
    }
    else
    {
      throw new Error(`Unknown entry type "${entry.constructor.name}"`);
    }
  }

  constructor(source, parent)
  {
    super(source, BASE);

    // if (parent)
    // {
    //   this.#parent = parent;
    //   this.#domain = parent.GetDomain();
    //   this.#layer = parent.GetLayer();
    //   this.#trusted = parent.GetTrusted();
    // }
    // else
    // {
    //   console.warn("No parent for", this.href);
    // }

    if (parent)
    {
      this.SetParent(parent);
    }

    if (source.IsEntry?.())
    {
      // console.log("Cloning entry from", source.GetNormalized());
      REBUILT.set(source, this);

      this.#flags.Copy(source.GetFlags());
      this.#stats = source.GetStats();
      this.#trusted = source.GetTrusted();
      this.#resolved = source.GetResolved();
      this.#instance = source.GetInstance();
      this.#imported = source.GetImported();
      this.#name = source.GetName();
      this.#destructors = source.GetDestructors();
      
      for (const value of source.GetImports())
      {
        this.GetImports().add(this.Rebuild(value));
      }
      
      for (const value of source.GetReferences())
      {
        this.GetReferences().add(this.Rebuild(value));
      }
      
      // this.#domain ??= source.GetDomain();
      // this.#parent ??= this.Rebuild(source.GetParent());
      // this.#layer ??= this.Rebuild(source.GetLayer());
    }
  }

  destructor()
  {
    this.#destructed = true;
  }

  #destructed;
  Assert()
  {
    if (this.#destructed)
    {
      throw new Error(`Entry "${this.href}" is destructed, and cannot be used`);
    }
  }

  #stats;
  GetStats(){ this.Assert(); return this.#stats; }
  SetStats(stats){ this.Assert(); return this.#stats = stats; }

  #trusted = false;
  IsTrusted(){ this.Assert(); return this.#trusted === true; }
  GetTrusted(){ this.Assert(); return this.#trusted; }
  SetTrusted(trusted){ this.Assert(); return this.#trusted = trusted; }

  #resolved = false;
  IsResolved(){ this.Assert(); return this.#resolved === true; }
  GetResolved(){ this.Assert(); return this.#resolved; }
  SetResolved(resolved){ this.Assert(); return this.#resolved = resolved; }

  #instance = 0;
  GetInstance(){ this.Assert(); return this.#instance; }
  SetInstance(instance){ this.Assert(); return this.#instance = instance; }

  #imported = 0;
  SetImported(imported){ this.Assert(); return this.#imported = imported; }
  GetImported(){ this.Assert(); return this.#imported; }
  IsIncremented(){ this.Assert(); return this.GetInstance() > this.GetImported(); }

  #flags = new BitSet();
  GetFlags(){ this.Assert(); return this.#flags; }
  IsStatic(){ this.Assert(); return this.#flags.Has(0); }
  IsFrozen(){ this.Assert(); return this.#flags.Has(1); }
  IsVolatile(){ this.Assert(); return this.#flags.Has(2); }
  IsDangerous(){ this.Assert(); return this.#flags.Has(3); }
  IsFlaggedDangerous(){ this.Assert(); return this.#flags.Has(3); }
  IsSafe(){ this.Assert(); return this.#flags.Has(4); }
  IsInternal(){ this.Assert(); return this.#flags.Has(5); }
  IsFlaggedInternal(){ this.Assert(); return this.#flags.Has(5); }
  IsUnique(){ this.Assert(); return this.#flags.Has(6); }
  IsSpecial(){ this.Assert(); return this.#flags.Has(7); }
  IsFlaggedLayer(){ this.Assert(); return this.#flags.Has(11); }
  IsFlaggedDomain(){ this.Assert(); return this.#flags.Has(12); }
  IsFlaggedParent(){ this.Assert(); return this.#flags.Has(13); }
  IsFlaggedAncestor(){ this.Assert(); return this.#flags.Has(14); }
  IsFlaggedOnce(){ this.Assert(); return this.#flags.Has(15); }
  IsFlaggedResolved(){ this.Assert(); return this.#flags.Has(16); }
  IsFlaggedAggregate(){ this.Assert(); return this.#flags.Has(17); }

  Flag(flag)
  {
    switch (flag.toLowerCase())
    {
      case "static": return this.#flags.Add(0);
      case "frozen": return this.#flags.Add(1);
      case "volatile": return this.#flags.Add(2);
      case "dangerous": return this.#flags.Add(3);
      case "safe": return this.#flags.Add(4);
      case "internal": return this.#flags.Add(5);
      case "unique": return this.#flags.Add(6);
      case "special": return this.#flags.Add(7);
      case "public": return this.#flags.Add(8);
      case "private": return this.#flags.Add(9);
      case "local": return this.#flags.Add(10);
      case "layer": return this.#flags.Add(11);
      case "domain": return this.#flags.Add(12);
      case "parent": return this.#flags.Add(13);
      case "ancestor": return this.#flags.Add(14);
      case "once": return this.#flags.Add(15);
      case "resolved": return this.#flags.Add(16);
      case "aggregate": return this.#flags.Add(17);

      default: throw new Error(`Unknown flag "${flag}"`);
    }
  }

  #name;
  GetName(){ this.Assert(); return this.#name; }
  SetName(name){ this.Assert(); return this.#name = name; }

  #parts;
  GetParts(){ this.Assert(); return this.#parts ??= this.Split(this.pathname); }

  #path;
  GetPath(){ this.Assert(); return this.#path ??= fileURLToPath(this); }

  #destructors;
  HasDestructors(){ this.Assert(); return this.#destructors !== undefined && this.#destructors.length > 0; }
  GetDestructors(){ this.Assert(); return this.#destructors; }
  AddDestructor(destructor){ this.Assert(); (this.#destructors ??= []).push(destructor); }

  #constructors;
  HasConstructors(){ this.Assert(); return this.#constructors !== undefined && this.#constructors.length > 0; }
  GetConstructors(){ this.Assert(); return this.#constructors; }
  AddConstructor(ctor){ this.Assert(); (this.#constructors ??= []).push(ctor); }

  #imports;
  HasImports(){ this.Assert(); return this.#imports !== undefined; }
  GetImports(){ this.Assert(); return this.#imports ??= new Set(); }
  AddImport(entry){ this.Assert(); this.GetImports().add(entry); return this; }
  
  #references;
  HasReferences(){ this.Assert(); return this.#references !== undefined; }
  GetReferences(){ this.Assert(); return this.#references ??= new Set(); }
  AddReference(entry){ this.Assert(); this.GetReferences().add(entry); return this; }

  #resolver;
  #rejecter;
  #promise;
  Await()
  {
    return this.#promise;
  }

  GetPromise(){ return this.#promise; }

  async _Await(seen = new WeakSet())
  {
    for (const entry of this.GetImports())
    {
      if (seen.has(entry)) continue;
      else seen.add(entry);

      if (entry === this) continue;
      // if (entry === parent) continue;

      console.log("Waiting for", entry.GetNormalized());
      await entry.Await(seen);
    }

    await this.#promise;
  }

  async Resolved(seen = new WeakSet())
  {
    if (!this.#resolver) return;

    for (const entry of this.GetImports())
    {
      if (seen.has(entry)) continue;
      else seen.add(entry);

      if (entry === this) continue;

      // console.log("Waiting for", entry.GetNormalized());
      // await entry.Await();
      await entry.Resolved(seen);
    }

    this.#resolver(this);
  }

  Rejected(error)
  {
    this.Await();
    this.#rejecter(error);
  }

  Load()
  {
    // console.log("Load", this.GetNormalized());

    this.#promise ??= new Promise((resolve, reject) =>
    {
      this.#resolver = resolve;
      this.#rejecter = reject;
    })
    .then((result) =>
    {
      // for (const entry of this.GetImports())
      // {
      //   // console.log("Waiting for", entry.GetNormalized());
      //   await entry.Await();
      // }

      // console.log("Resolved", this.GetNormalized());

      return result;
    });
  }

  ValidateImportFrom(entry)
  {
    this.Assert();

    const references = this.GetReferences();

    if (this.IsFlaggedOnce() && references.size > 0)
    {
      const value = references.values().next().value;
      throw new Error(`Module "${entry.GetNormalized()}" tried to import "${this.GetNormalized()}", but the requested module has the "once" flag, meaning it can only be imported once, and it is already imported by "${value.GetNormalized()}"`);
    }

    if (this.IsFlaggedLayer() && entry.GetLayer() !== this.GetLayer())
    {
      throw new Error(`Module "${entry.GetNormalized()}" tried to import "${this.GetNormalized()}", but the requested module has the "layer" flag, meaning it can only be imported from within its own layer of "${this.GetLayer().GetNormalized()}"`);
    }

    if (this.IsFlaggedDomain() && entry.GetDomain() !== this.GetDomain())
    {
      throw new Error(`Module "${entry.GetNormalized()}" tried to import "${this.GetNormalized()}", but the requested module has the "domain" flag, meaning it can only be imported from within its own domain of "${this.GetDomain().GetNormalized()}"`);
    }

    if (this.IsFlaggedParent() && entry.GetParent() !== this.GetParent())
    {
      throw new Error(`Module "${entry.GetNormalized()}" tried to import "${this.GetNormalized()}", but the requested module has the "parent" flag, meaning it can only be imported from within its own parent directory of "${this.GetParent().GetNormalized()}"`);
    }

    if (this.IsFlaggedAncestor())
    {
      const parent = this.GetParent();
      let current = entry.GetParent();

      while (current !== parent)
      {
        current = current.GetParent();
        if (!current)
        {
          throw new Error(`Module "${entry.GetNormalized()}" tried to import "${this.GetNormalized()}", but the requested module has the "ancestor" flag, meaning it can only be imported from within its own parent directory of "${this.GetParent().GetNormalized()}", or any of its subdirectories`);
        }
      }
    }

    if (this.IsFlaggedInternal() && entry.GetLayer() !== this.GetLayer())
    {
      throw new Error(`Module "${this.GetNormalized()}" is flagged as internal, so it can only be imported from within its own layer, not from layer "${entry.GetLayer().GetNormalized()}"`);
    }

    if (!entry.IsTrusted() && this.IsFlaggedDangerous())
    {
      throw new Error(`Module "${this.GetNormalized()}" is flagged as dangerous, so it cannot be imported from untrusted module "${entry.GetNormalized()}"`);
    }
  }

  #parent;
  // SetParent(parent){ this.Assert(); return this.#parent = parent; }
  GetParent(){ this.Assert(); return this.#parent; }

  SetParent(parent)
  {
    this.Assert();

    if (parent)
    {
      this.#parent = parent;
      // this.#domain = parent.GetDomain();
      // this.#layer = parent.GetLayer();
      this.#trusted = parent.GetTrusted();
    }
    else
    {
      console.warn("No parent for", this.href);
    }
  }

  GetLayer(){ return this.GetParent()?.GetLayer(); }
  GetDomain(){ return this.GetParent()?.GetDomain(); }

  Rebuild(entry, parent)
  {
    if (entry === undefined) return undefined;
    if (entry instanceof Entry) return entry;
    if (REBUILT.has(entry)) return REBUILT.get(entry);

    const rebuilt = this.constructor.Rebuild(entry, parent);

    // REBUILT.set(entry, rebuilt);

    return rebuilt;
  }

  CountBufferLines(buffer){ return CountBufferLines(buffer); }

  async Reload()
  {
    // Save the new instance it will be imported at
    this.SetImported(this.GetInstance());

    // console.log("Reloading", this.GetNormalized());

    this.#promise = undefined;

    if (this.HasImports())
    {
      const imports = this.GetImports();

      if (imports.size > 0)
      {
        // This entry is about to get imported, so remove it as a reference
        // From each entry it had previously imported
        // This is because it may have stopped importing an entry it did previously
        for (const entry of imports)
        {
          if (entry.HasReferences())
          {
            const refs = entry.GetReferences();
            if (refs.has(this))
            {
              refs.delete(this);
              continue;
            }
          }

          throw new Error(`Entry "${this.GetNormalized()}" imports "${entry.GetNormalized()}", but it isn't set as a reference`);
        }

        // Completely clear the imports, because they will be rebuilt when the entry
        // gets imported again
        imports.clear();
      }
    }

    // Reset the flags, because they will be set again after the import
    this.#flags.Clear();
    this.#resolved = false;

    while (this.#destructors && this.#destructors.length > 0)
    {
      const destructor = this.#destructors.pop();

      try
      {
        await destructor();
      }
      catch (error)
      {
        console.error(`Error while running destructor for "${this.GetNormalized()}"`, error);
      }
    }
  }

  Increment()
  {
    if (this.IsFrozen()) return;

    if (!this.IsIncremented())
    {
      const instance = this.GetInstance() + 1;
      this.SetInstance(instance);
      // console.log("Incrementing", this.GetNormalized(), instance);
    }
  }

  Reimport(checked = new WeakSet())
  {
    if (checked.has(this)) return;
    checked.add(this);

    if (!this.IsStatic())
    {
      this.Increment(checked);
    }

    for (const entry of this.GetImports())
    {
      entry.Reimport(checked);
    }
  }

  Rereference(checked = new WeakSet())
  {
    if (checked.has(this)) return;
    checked.add(this);

    // QUESTION: Should this respect static or not?
    if (this.IsStatic()) return;
    if (this.IsFrozen()) return;

    this.Increment(checked);

    for (const entry of this.GetReferences())
    {
      entry.Rereference(checked);
    }
  }

  Starting()
  {
    // if (this.href.includes("/js/Console.js"))
    // {
    //   console.log("Starting", this.GetNormalized());
    // }
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

  GetData(){ console.warn("Called GetData on Entry"); return; }

  HRef(wrapper)
  {
    const params = new URLSearchParams();

    const instance = this.GetInstance();
    if (instance !== undefined)
    {
      params.set("instance", instance);
    }

    // const development = this.GetDevelopment();
    // if (development !== undefined)
    // {
    //   params.set("development", development); // TODO: Should this use the value?
    // }

    if (wrapper === true)
    {
      params.set("wrapper", "true");
    }

    return this.href + "?" + params.toString();
  }

  Resolve(parent, resolved)
  {
    const url = new URL(this.href);

    const instance = this.GetInstance();
    if (instance !== undefined)
    {
      url.searchParams.set("instance", instance);
    }

    // if (this.IsDevelopment())
    // {
    //   url.searchParams.set("development", "true");
    // }

    if (this.IsWrapping() && this !== parent)
    {
      url.searchParams.set("wrapper", "true");
    }

    if (resolved === true)
    {
      url.searchParams.set("resolved", unique++);
    }

    return url;
  }

  Refresh()
  {
    return this;
  }

  Query(query, domains, state, index)
  {
    const {prev, parent} = state;
    state.prev = this;

    // Don't check most parameters on absolute paths, since an absolute path always means a specific file
    if (query.IsAbsolute()) return this.Test(query, prev, parent);

    // If there is a next parameter, this Entry will be skipped if the
    // previously checked entry does not include the next value
    if (query.HasNext())
    {
      const next = query.GetNext();
      if (!prev?.pathname.toLowerCase().includes(next))
      {
        return;
      }
    }

    // If there is an after parameter, this Entry will be skipped if the
    // previously checked Entry does not include the after string
    if (query.HasAfter())
    {
      const after = query.GetAfter();
      if (!prev?.pathname.toLowerCase().includes(after))
      {
        return;
      }
    }

    if (query.HasBefore())
    {
      const before = query.GetBefore();
      if (this.pathname.toLowerCase().includes(before))
      {
        return prev.Test(query, this, parent);
      }
    }

    if (query.HasInclude())
    {
      const include = query.GetInclude();
      if (!this.pathname.toLowerCase().includes(include)) return;
    }

    if (query.HasExclude())
    {
      const exclude = query.GetExclude();
      if (this.pathname.toLowerCase().includes(exclude)) return;
    }

    return this.Test(query, prev, parent);
  }

  Test(query, prev, parent)
  {
    if (parent && !parent.IsTrusted() && this.IsFlaggedDangerous())
    {
      throw new Error(`File "${this.GetNormalized()}" is flagged as dangerous, so it cannot be imported from untrusted file "${parent.GetNormalized()}"`);
    }

    if (parent && prev && !parent.IsTrusted() && prev !== parent)
    {
      throw new Error(`Untrusted file "${parent.GetNormalized()}" cannot skip importing "${prev.GetNormalized()}" using query string "${query.GetSearch()}". Untrusted files must import in order.`);
    }

    return this;
  }

  // TODO: This probably isn't actually working, need to fix the url/filepath mix
  Rename(filepath)
  {
    return new Promise((resolve, reject) =>
    {
      FS.rename(this, filepath, (error) =>
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
      FS.access(this, flags, (error) =>
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
      const access = FS.accessSync(this, flags);
      return true;
    }
    catch (error)
    {
      return false;
    }
  }

  GetRawHRef(){ return `${this.protocol}//${this.host}${this.pathname}`; }

  GetDirName(){ return node_path.dirname(this.GetPath()); }
  GetLayerName(){ return this.GetLayer()?.GetName(); }
  GetDomainName(){ return this.GetDomain()?.GetName(); }
  GetNormalized(){ return this.href.replace(this.GetLayer()?.href, this.GetLayer()?.GetFullName()); }
  GetSpecifier(){ return this.href.replace(this.GetDomain()?.href, ""); }
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

  IsPrivate(){ return this.GetDomain()?.IsPrivate(); }
  IsPublic(){ return this.GetDomain()?.IsPublic(); }
  IsWrapping(){ return Getter()?.IsWrapping(); }
  IsDevelopment(){ return Getter()?.IsDevelopment(); }

  GetMimeType(){ return "text/plain"; } // Fallback for non-files
  GetCharSet(){ return "utf-8"; }

  IsReal      (){ return this.Access(FS.constants.F_OK); }
  IsReadable  (){ return this.Access(FS.constants.F_OK | FS.constants.R_OK); }
  IsWritable  (){ return this.Access(FS.constants.F_OK | FS.constants.W_OK); }
  IsAccessible(){ return this.Access(FS.constants.F_OK | FS.constants.R_OK | FS.constants.W_OK); }

  IsRealSync      (){ return this.AccessSync(FS.constants.F_OK); }
  IsReadableSync  (){ return this.AccessSync(FS.constants.F_OK | FS.constants.R_OK); }
  IsWritableSync  (){ return this.AccessSync(FS.constants.F_OK | FS.constants.W_OK); }
  IsAccessibleSync(){ return this.AccessSync(FS.constants.F_OK | FS.constants.R_OK | FS.constants.W_OK); }

  IsAbsolute(){ return node_path.isAbsolute(this.GetPath()); }

  IsEntry(){ return true; }
  IsFile(){ return false; }
  IsDirectory(){ return false; }
  IsLayer(){ return false; }
  IsDomain(){ return false; }
  IsPlaceholder(){ return false; }

  GetDomains()
  {
    const layer = this.GetLayer();

    if (layer) return layer.GetDomains();
    else throw new Error(`Entry "${this.href}" cannot GetDomains because it has no layer.`);
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
      case "\u2028": // line separator
      case "\u2029": // paragraph separator
      {
        return Encode(c);
      }
      case "\\":
      {
        return "\\\\"; // Handle backslash explicitly
      }
      default:
      {
        return c; // No need to encode it
      }
    }
  }

  BinaryEncode(code)
  {
    const hex = code.toString(16);

    // If the code is small enough, use the more compact hexadecimal
    // escape sequence. Otherwise use a unicode escape sequence.
    if      (16 > code) return "\\x0" + hex;
    else if (256 > code) return "\\x" + hex;
    else if (4096 > code) return "\\u0" + hex;
    else if (65536 > code) return "\\u" + hex;
    else return `\\u{${hex}}`;
  }

  BinaryEscape(code)
  {
    switch (code)
    {
      case 0: // "\0"
      case 8: // "\b"
      case 9: // "\t"
      case 10: // "\n"
      case 11: // "\v"
      case 12: // "\f"
      case 13: // "\r"
      case 34: // "\""
      case 39: // "\'"
      case 92: // "\\"
      case 96: // "\`"
      {
        return this.BinaryEncode(code);
      }
      default:
      {
        return String.fromCharCode(code);
      }
    }
  }

  // toString(){ return this.GetNormalized(); }
}


// function normalizeIndentation(str) {
//   // Get the leading whitespace of the first non-empty line
//   const match = str.match(/^[ \t]*(?=\S)/gm);
//   if (!match) {
//     // No indentation found
//     return str;
//   }

//   // Compute the minimum indentation
//   const indent = Math.min(...match.map((x) => x.length));

//   // Replace the leading whitespace of each line
//   return str.replace(new RegExp(`^[ \\t]{${indent}}`, "gm"), "");
// }

// function generateHTML() {
//   return (`
//     <a class="button" href="/">
//       <span class="is-hidden-mobile">Longer text</span>
//       <span class="is-hidden-tablet">Short</span>
//     </a>
//   `.dedent());
// }

// // function generateHTML() {
// //   return normalizeIndentation(`
// //     <a class="button" href="/">
// //       <span class="is-hidden-mobile">Longer text</span>
// //       <span class="is-hidden-tablet">Short</span>
// //     </a>
// //   `);
// // }

// const text = `<a class="button" href="/">
//   <span class="is-hidden-mobile">Longer text</span>
//   <span class="is-hidden-tablet">Short</span>
// </a>`;

// console.log(text);
// console.log(generateHTML());
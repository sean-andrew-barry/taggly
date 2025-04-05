import fs, {promises as FSP} from "fs";
import node_path from "path";
import zlib from "zlib";
import vm from "vm";
import {Entry} from "./Entry.js";
import {Directory} from "./Directory.js";
import {Placeholder} from "./Placeholder.js";

export class File extends Entry
{
  #data;
  #gzip;
  #deflate;

  async Validate()
  {
    let stats;
    try
    {
      stats = await FSP.stat(this);
    }
    catch (error)
    {
      // No longer exists, so return a placeholder
      return Placeholder.From(this);
    }

    this.SetStats(stats);

    if (stats.isFile())
    {
      // Still a file, so no change
      return this;
    }
    else if (stats.isDirectory())
    {
      // The file was changed into a directory
      return Directory.From(this, stats);
    }
  }

  async Module()
  {
    this.mod = await import(this);

    // for (const key in mod)
    // {
    //   const value = mod[key];
    // }
  }

  Erase()
  {
    return new Promise((resolve, reject) =>
    {
      fs.writeFile(this, "", (error) =>
      {
        if (error) return reject(error);
        return resolve(this);
      });
    });
  }

  Delete()
  {
    return new Promise((resolve, reject) =>
    {
      fs.unlink(this, (error) =>
      {
        if (error) return reject(error);
        return resolve(this);
      });
    });
  }

  GetDirectory()
  {
    const parent = this.GetParent();
    if (parent) return parent;

    const url = pathToFileURL(this.GetPathParent());
    return new Directory(url);
  }

  Read(encoding = "utf-8")
  {
    return new Promise((resolve, reject) =>
    {
      fs.readFile(this, { encoding }, (error, data) =>
      {
        if (error) return reject(error);
        else return resolve(data);
      });
    });
  }

  ReadSync(encoding = "utf-8")
  {
    return fs.readFileSync(this, encoding);
  }

  Write(content)
  {
    return new Promise((resolve, reject) =>
    {
      fs.writeFile(this, content, (error) =>
      {
        if (error) return reject(error);
        else return resolve(this);
      });
    });
  }

  async *[Symbol.asyncIterator]()
  {
    for await (const chunk of fs.createReadStream(this))
    {
      yield chunk;
    }
  }

  CreateData()
  {
    return new Promise((resolve, reject) =>
    {
      const stream = fs.createReadStream(this);

      const chunks = [];
      stream.on("data", data => chunks.push(data));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", error => reject(error));
    });
  }

  CreateGZip()
  {
    return new Promise(async (resolve, reject) =>
    {
      const data = await this.GetData();

      zlib.gzip(data, (error, result) =>
      {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  CreateDeflate()
  {
    return new Promise(async (resolve, reject) =>
    {
      const data = await this.GetData();

      zlib.deflate(data, (error, result) =>
      {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  GetData(){ return this.#data ??= this.CreateData(); }
  GetGZip(){ return this.#gzip ??= this.CreateGZip(); }
  GetDeflate(){ return this.#deflate ??= this.CreateDeflate(); }

  // Taken from: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  // Thank you!
  GetMimeType()
  {
    switch (this.GetExtension())
    {
      case ".aac": return "audio/aac";
      case ".abw": return "application/x-abiword";
      case ".arc": return "application/x-freearc";
      case ".avi": return "video/x-msvideo";
      case ".azw": return "application/vnd.amazon.ebook";
      case ".bin": return "application/octet-stream";
      case ".bmp": return "image/bmp";
      case ".bz": return "application/x-bzip";
      case ".bz2": return "application/x-bzip2";
      case ".cda": return "application/x-cdf";
      case ".csh": return "application/x-csh";
      case ".css": return "text/css";
      case ".csv": return "text/csv";
      case ".cjs": return "text/javascript";
      case ".doc": return "application/msword";
      case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case ".eot": return "application/vnd.ms-fontobject";
      case ".epub": return "application/epub+zip";
      case ".gz": return "application/gzip";
      case ".gif": return "image/gif";
      case ".htm": return "text/html";
      case ".html": return "text/html";
      case ".ico": return "image/vnd.microsoft.icon";
      case ".ics": return "text/calendar";
      case ".jar": return "application/java-archive";
      case ".jpeg": return "image/jpeg";
      case ".jpg": return "image/jpeg";
      case ".js": return "text/javascript";
      case ".json": return "application/json";
      case ".jsonld": return "application/ld+json";
      case ".mid": return "audio/midi"; // Also audio/x-midi?
      case ".midi": return "audio/midi";
      case ".mjs": return "text/javascript";
      case ".mp3": return "audio/mpeg";
      case ".mp4": return "video/mp4";
      case ".mpeg": return "video/mpeg";
      case ".mpkg": return "application/vnd.apple.installer+xml";
      case ".odp": return "application/vnd.oasis.opendocument.presentation";
      case ".ods": return "application/vnd.oasis.opendocument.spreadsheet";
      case ".odt": return "application/vnd.oasis.opendocument.text";
      case ".oga": return "audio/ogg";
      case ".ogv": return "video/ogg";
      case ".ogx": return "application/ogg";
      case ".opus": return "audio/opus";
      case ".otf": return "font/otf";
      case ".png": return "image/png";
      case ".pdf": return "application/pdf";
      case ".php": return "application/x-httpd-php";
      case ".ppt": return "application/vnd.ms-powerpoint";
      case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case ".rar": return "application/vnd.rar";
      case ".rtf": return "application/rtf";
      case ".sh": return "application/x-sh";
      case ".svg": return "image/svg+xml";
      case ".swf": return "application/x-shockwave-flash";
      case ".tar": return "application/x-tar";
      case ".tif": return "image/tiff";
      case ".tiff": return "image/tiff";
      case ".ts": return "video/mp2t";
      case ".ttf": return "font/ttf";
      case ".txt": return "text/plain";
      case ".vsd": return "application/vnd.visio";
      case ".wav": return "audio/wav";
      case ".weba": return "audio/webm";
      case ".webm": return "video/webm";
      case ".webp": return "image/webp";
      case ".woff": return "font/woff";
      case ".woff2": return "font/woff2";
      case ".xhtml": return "application/xhtml+xml";
      case ".xls": return "application/vnd.ms-excel";
      case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case ".xml": return "application/xml";
      case ".xul": return "application/vnd.mozilla.xul+xml";
      case ".zip": return "application/zip";
      case ".3gp": return "video/3gpp"; // Or audio/3gpp if it doesn't contain video, but I can't know which
      case ".3g2": return "video/3gpp2"; // Same note as above
      case ".7z": return "application/x-7z-compressed";
      default: return undefined;
    }
  }

  Reload(...args)
  {
    this.#data = undefined;
    this.#gzip = undefined;
    this.#deflate = undefined;

    return super.Reload(...args);
  }

  IsFile(){ return true; }

  async GetSourceEscaped()
  {
    const text = await this.Read(); // super.GetSource instead?

    let source = "";
    for (let i = 0; i < text.length; i++)
    {
      source += this.Escape(text[i]);
    }

    return source;
  }

  async GetSource()
  {
    switch (this.GetMimeType())
    {
      case "text/javascript":
      {
        return super.GetSource();
      }
      case "text/html":
      {
        // TODO: What about using Template instead of Fragment?
        return `import {Fragment} from "/js/Tags/Fragment.js";\n\nexport default new Fragment().InnerHTML("${await this.GetSourceEscaped()}");`;
      }
      case "text/css":
      {
        return `import {Style} from "/js/Tags/Style.js";\n\nexport default new Style().Text("${await this.GetSourceEscaped()}");`;
      }
      default:
      {
        return `export default "${await this.GetSourceEscaped()}";`;
      }
    }
  }
}

class OptionalFile extends File
{
  IsOptional(){ return true; }
}

const OPTIONAL = new OptionalFile("./Optional.js");
export {OPTIONAL};

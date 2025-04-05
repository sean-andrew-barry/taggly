import {window} from "/js/Window.js";

// If window is undefined and self IS defined, we're probably in a browser worker thread
if (typeof(window) === "undefined" && typeof(self) !== "undefined")
{
  self.window = self;
}

// If global is undefined, we're probably in a browser (not Node)
if (typeof(global) === "undefined")
{
  window.global = window;
}

const DATA = Symbol("data");

const domains = ["public"];

export class Environment
{
  static GetDataID(){ return "__taggly_environment_data"; }

  // QUESTION: Should we remove the script for cleanup purposes? Or is it better
  // left in for clarity?
  static CreateData()
  {
    const id = this.GetDataID();
    const script = window.document.getElementById(id);

    // script.remove(); // Should we remove it for clean up?

    return JSON.parse(script?.textContent ?? "{}");
  }

  static GetIP(){ throw new Error(`Environment.GetIP is only valid on the server, not the client`); }

  // The server side Index page adds an application/json script that
  // describes the environment data
  static GetData(){ return this[DATA] ??= this.CreateData(); }

  static IsServer(){ return false; }
  static IsClient(){ return true; }
  static IsMaster(){ return true; }
  static IsWorker(){ return false; }
  static GetLoader(){ return undefined; }
  static IsInlineFrame(){ return !!window.frameElement; }
  static GetCached(name){ throw new Error(`GetCached is not valid on the client`); }
  static SetCached(name, value){ throw new Error(`SetCached is not valid on the client`); }
  static GetCWD(){ throw new Error(`GetCWD is not valid on the client`); }
  static IsSecure(){ return window.location.protocol === "https:"; }
  static IsDevelopment(){ return this.GetDevelopment() === true; }
  static IsDebug(){ return this.IsDevelopment() ? undefined : ""; }
  static GetDomains(){ return domains; }

  static Normalize(url)
  {
    if (typeof(url) === "string")
    {
      url = new URL(url);
    }

    url.search = "";

    return url.href.replace(url.origin, "");
  }

  static Reload(){ throw new Error(`Environment.Reload is only valid on the server, not the client`); }
  static Search(){ throw new Error(`Environment.Search is only valid on the server, not the client`); }

  static DepreciateFile(url, replacement)
  {
    const parts = [`The file at "${this.Normalize(url)}" has been depreciated.`];

    if (replacement) parts.push(`Use "${replacement}" instead.`);

    return console.warn(...parts);
  }

  static GetDevelopment(){ return this.GetData()?.development; }
  static GetInstance(){ return this.GetData()?.instance; }
  static GetVersion(){ return this.GetData()?.version; }
  static GetVersionMajor(){ return this.GetData()?.version_major; }
  static GetVersionMinor(){ return this.GetData()?.version_minor; }
  static GetVersionPatch(){ return this.GetData()?.version_patch; }

  // static GetElement(){ return this.element ??= window.document.createElement("div"); }
  // static GetStyles(){ return this.styles ??= this.GetElement().style; }
  //
  // static HasGlobal(name){ return window.hasOwnProperty(name); }
  // static HasStyle(name){ return this.styles.hasOwnProperty(name); }
  //
  // static HasFlex(){ return this.HasStyle("flex"); }
  // static HasFlexFlow(){ return this.HasStyle("flex-flow"); }
  // static HasGrid(){ return this.HasStyle("grid"); }
  //
  // static HasElement(name)
  // {
  //   if (this.HasGlobal(name) && global[name] instanceof global.HTMLElement)
  //   {
  //
  //   }
  // }
  //
  // static HasVideoElement(){ return this.HasGlobal("HTMLVideoElement"); }
  // static HasAudioElement(){ return this.HasGlobal("HTMLAudioElement"); }
}

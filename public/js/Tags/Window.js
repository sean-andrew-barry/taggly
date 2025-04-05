import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Utility/Environment.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {MutationObserver} from "/js/Utility/Observer/MutationObserver.js";
import {EventObserver} from "/js/Utility/Observer/EventObserver.js";
import {SizeObserver} from "/js/Utility/Observer/SizeObserver.js";
import {ViewObserver} from "/js/Utility/Observer/ViewObserver.js";
import {Config} from "/js/Tags/Config.js";
import {Cache} from "/js/Tags/Cache.js";
import {Database} from "/js/Tags/Database.js";
import {Server} from "/js/Tags/Server.js";
import {Socket} from "/js/Tags/Socket.js";
import {History} from "/js/Tags/History.js";
import {DynamicImporter} from "/js/Tags/DynamicImporter.js";
import {Webpack} from "/js/Tags/Webpack.js";
import {Mailer} from "/js/Tags/Mailer.js";

const TRUSTED = Tag.GetTrustedSymbol();

const MUTATION_OBSERVER = Symbol("mutation_observer");
const EVENT_OBSERVER = Symbol("event_observer");
const SIZE_OBSERVER = Symbol("size_observer");
const VIEW_OBSERVER = Symbol("view_observer");
const CONFIG = Symbol("config");
const CACHE = Symbol("cache");
const DYNAMIC_IMPORTER = Symbol("dynamic_importer");
const HISTORY = Symbol("history");
const DATABASE = Symbol("database");
const SERVER = Symbol("server");
const SOCKET = Symbol("socket");
const WEBPACK = Symbol("webpack");
const MAILER = Symbol("mailer");

// This is the base program. It gets auto initialized by Initialize.js
export class Window extends Singleton
{
  static GetMutationObserverSymbol(){ return MUTATION_OBSERVER; }
  static GetEventObserverSymbol(){ return EVENT_OBSERVER; }
  static GetSizeObserverSymbol(){ return SIZE_OBSERVER; }
  static GetViewObserverSymbol(){ return VIEW_OBSERVER; }
  static GetConfigSymbol(){ return CONFIG; }
  static GetCacheSymbol(){ return CACHE; }
  static GetDynamicImporterSymbol(){ return DYNAMIC_IMPORTER; }
  static GetHistorySymbol(){ return HISTORY; }
  static GetDatabaseSymbol(){ return DATABASE; }
  static GetServerSymbol(){ return SERVER; }
  static GetSocketSymbol(){ return SOCKET; }
  static GetWebpackSymbol(){ return WEBPACK; }
  static GetMailerSymbol(){ return MAILER; }

  // constructor(...args)
  // {
  //   super(...args);
  //
  //   // Initialize the node right away
  //   const node = this.GetNode();
  //   // console.log(node);
  //   // console.log(window.document.tag === this);
  //
  //   // this.mutation_observer = new MutationObserver();
  //   // this.event_observer = new EventObserver();
  //   // this.size_observer = new SizeObserver();
  //   // this.view_observer = new ViewObserver();
  //
  //   // console.log("Constructing Document singleton");
  //   this.Trust(window.document.documentElement);
  //
  //   // this.config = Config.Get();
  //   // this.cache = this.CreateCache(this.config);
  //   // this.dynamic_importer = this.CreateDynamicImporter(this.config);
  //   // this.history = this.CreateHistory(this.config);
  //   // this.database = this.CreateDatabase(this.config);
  //   // this.server = this.CreateServer(this.config);
  //   // this.socket = this.CreateSocket(this.config);
  //   // this.webpack = this.CreateWebpack(this.config);
  //   // this.mailer = this.CreateMailer(this.config);
  //
  //   this.SetMutationObserver();
  //   this.SetEventObserver();
  //   this.SetSizeObserver();
  //   this.SetViewObserver();
  //   // this.SetConfig();
  //   // this.SetCache();
  //   // this.SetDynamicImporter();
  //   // this.SetHistory();
  //   // this.SetDatabase();
  //   // this.SetServer();
  //   // this.SetSocket();
  //   // this.SetWebpack();
  //   // this.SetMailer();
  //
  //   // cSyntaxError;
  //
  //   this.Initialize();
  // }

  constructor(...args)
  {
    super(...args);
    // console.log("Initializing Window Tag", window.document instanceof window.Node, window instanceof window.Node);
    // this.SetNode();
  }

  // SetNode(node = window){ console.log("Set window node"); return super.SetNode(node); }
}

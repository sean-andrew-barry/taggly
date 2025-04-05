import {EventTarget} from "/js/Utility/DOM/EventTarget.js";
import {Node} from "/js/Utility/DOM/Node.js";
import {Element} from "/js/Utility/DOM/Element.js";
import {DOMQuad} from "/js/Utility/DOM/DOMQuad.js";
import {DOMRect} from "/js/Utility/DOM/DOMRect.js";
import {Attr} from "/js/Utility/DOM/Attr.js";
import {Event} from "/js/Utility/DOM/Event.js";

export class Window
{
  constructor()
  {
    this.global = globalThis;
    // globalThis.window = this;

    this.Symbol = globalThis.Symbol;
    this.String = globalThis.String;
    this.Number = globalThis.Number;
    this.BigInt = globalThis.BigInt;
    this.Object = globalThis.Object;
    this.Array = globalThis.Array;
    this.URL = globalThis.URL;
    this.Map = globalThis.Map;
    this.WeakMap = globalThis.WeakMap;
    this.Set = globalThis.Set;
    this.WeakSet = globalThis.WeakSet;

    this.Node = Node;
    this.Element = Element;
    this.DOMQuad = DOMQuad;
    this.DOMRect = DOMRect;
    this.Attr = Attr;
    this.EventTarget = EventTarget;

    // this.internals = new Map();

    this.crypto = webcrypto;
    this.performance = performance;
    this.PerformanceObserver = PerformanceObserver;
    this.MutationObserver = MutationObserver;

    // this.window = this;
    this.document = new Document();
    this.history = new History();
    this.location = new Location();
    this.customElements = new CustomElementRegistry();
    this.localStorage = new LocalStorage();
    this.sessionStorage = new SessionStorage();
    this.console = globalThis.console;
    this.fullScreen = false;
    this.innerHeight = 0;
    this.innerWidth = 0;
    this.name = "";
    this.fetch = fetch;
  }

  ThrowNotImplemented(name)
  {
    throw new Error(`window.${name} is not implemented`);
  }

  get closed(){ return false; }
  get console(){ return global.console; }
  get clientInformation(){ return this.ThrowNotImplemented("clientInformation"); }
  get frameElement(){ return null; }
  get frames(){ return this.ThrowNotImplemented("frames"); }
  get innerHeight(){ return 0; }
  get innerWidth(){ return 0; }
  get outerHeight(){ return 0; }
  get outerWidth(){ return 0; }
  get pageXOffset(){ return 0; }
  get pageYOffset(){ return 0; }
  get screenX(){ return 0; }
  get screenLeft(){ return this.screenX; }
  get screenY(){ return 0; }
  get screenTop(){ return this.screenY; }
  get parent(){ return undefined; }
  get scrollX(){ return 0; }
  get scrollY(){ return 0; }
  get top(){ return 0; }
  get isSecureContext(){ return true; }

  get navigator(){ return this.ThrowNotImplemented("navigator"); }
  get screen(){ return this.ThrowNotImplemented("screen"); }
  get speechSynthesis(){ return this.ThrowNotImplemented("speechSynthesis"); }
  get visualViewport(){ return this.ThrowNotImplemented("visualViewport"); }

  get personalbar(){ return this.ThrowNotImplemented("personalbar"); }
  get scrollbars(){ return this.ThrowNotImplemented("scrollbars"); }
  get statusbar(){ return this.ThrowNotImplemented("statusbar"); }
  get toolbar(){ return this.ThrowNotImplemented("toolbar"); }
  get caches(){ return this.ThrowNotImplemented("caches"); }
  get indexedDB(){ return this.ThrowNotImplemented("indexedDB"); }
  get origin(){ return this.ThrowNotImplemented("origin"); }

  alert(){ return this.ThrowNotImplemented("alert"); }
  blur(){ return this.ThrowNotImplemented("blur"); }
  close(){ return this.ThrowNotImplemented("close"); }
  confirm(){ return this.ThrowNotImplemented("confirm"); }
  find(){ return this.ThrowNotImplemented("find"); }
  focus(){ return this.ThrowNotImplemented("focus"); }
  getComputedStyle(){ return this.ThrowNotImplemented("getComputedStyle"); }
  getSelection(){ return this.ThrowNotImplemented("getSelection"); }
  matchMedia(){ return this.ThrowNotImplemented("matchMedia"); }
  moveBy(){ return this.ThrowNotImplemented("moveBy"); }
  open(){ return this.ThrowNotImplemented("open"); }
  postMessage(){ return this.ThrowNotImplemented("postMessage"); }
  print(){ return this.ThrowNotImplemented("print"); }
  prompt(){ return this.ThrowNotImplemented("prompt"); }

  resizeBy(){ return this.ThrowNotImplemented("resizeBy"); }
  resizeTo(){ return this.ThrowNotImplemented("resizeTo"); }
  scroll(){ return this.ThrowNotImplemented("scroll"); }
  scrollBy(){ return this.ThrowNotImplemented("scrollBy"); }
  scrollTo(){ return this.ThrowNotImplemented("scrollTo"); }

  shopOpenFilePicker(){ return this.ThrowNotImplemented("shopOpenFilePicker"); }
  showSaveFilePicker(){ return this.ThrowNotImplemented("showSaveFilePicker"); }
  showDirectoryPicker(){ return this.ThrowNotImplemented("showDirectoryPicker"); }

  stop(){ return this.ThrowNotImplemented("stop"); }

  addEventListener(){ return this.ThrowNotImplemented("addEventListener"); }
  dispatchEvent(){ return this.ThrowNotImplemented("dispatchEvent"); }
  removeEventListener(){ return this.ThrowNotImplemented("removeEventListener"); }

  createImageBitmap(){ return this.ThrowNotImplemented("createImageBitmap"); }

  requestAnimationFrame(){ return this.ThrowNotImplemented("requestAnimationFrame"); }
  requestIdleCallback(){ return this.ThrowNotImplemented("requestIdleCallback"); }
  cancelAnimationFrame(){ return this.ThrowNotImplemented("cancelAnimationFrame"); }
  cancelIdleCallback(){ return this.ThrowNotImplemented("cancelIdleCallback"); }

  setImmediate(...args){ return globalThis.setImmediate(...args); }
  setInterval(...args){ return globalThis.setInterval(...args); }
  setTimeout(...args){ return globalThis.setTimeout(...args); }
  clearImmediate(...args){ return globalThis.clearImmediate(...args); }
  clearInterval(...args){ return globalThis.clearInterval(...args); }
  clearTimeout(...args){ return globalThis.clearTimeout(...args); }

  atob(...args){ return globalThis.atob(...args); }
  btoa(...args){ return globalThis.btoa(...args); }

  get window(){ return this; }

  // Events
  set abort(value){ return this.Listen("abort", value); }
  set autocompleteerror(value){ return this.Listen("autocompleteerror", value); }
  set cancel(value){ return this.Listen("cancel", value); }
  set change(value){ return this.Listen("change", value); }
  set close(value){ return this.Listen("close", value); }
  set cuechange(value){ return this.Listen("cuechange", value); }
  set drag(value){ return this.Listen("drag", value); }
  set dragenter(value){ return this.Listen("dragenter", value); }
  set dragleave(value){ return this.Listen("dragleave", value); }
  set dragstart(value){ return this.Listen("dragstart", value); }
  set durationchange(value){ return this.Listen("durationchange", value); }
  set ended(value){ return this.Listen("ended", value); }
  set input(value){ return this.Listen("input", value); }
  set keydown(value){ return this.Listen("keydown", value); }
  set keyup(value){ return this.Listen("keyup", value); }
  set loadedmetadata(value){ return this.Listen("loadedmetadata", value); }
  set mousedown(value){ return this.Listen("mousedown", value); }
  set mouseleave(value){ return this.Listen("mouseleave", value); }
  set mouseout(value){ return this.Listen("mouseout", value); }
  set mouseup(value){ return this.Listen("mouseup", value); }
  set pause(value){ return this.Listen("pause", value); }
  set playing(value){ return this.Listen("playing", value); }
  set ratechange(value){ return this.Listen("ratechange", value); }
  set resize(value){ return this.Listen("resize", value); }
  set securitypolicyviolation(value){ return this.Listen("securitypolicyviolation", value); }
  set seeked(value){ return this.Listen("seeked", value); }
  set select(value){ return this.Listen("select", value); }
  set submit(value){ return this.Listen("submit", value); }
  set timeupdate(value){ return this.Listen("timeupdate"); }
  set volumechange(value){ return this.Listen("volumechange"); }
  set stalled(value){ return this.Listen("stalled", value); }
  set canplaythrough(value){ return this.Listen("canplaythrough", value); }
  set loadeddata(value){ return this.Listen("loadeddata", value); }
  set autocomplete(value){ return this.Listen("autocomplete", value); }
  set blur(value){ return this.Listen("blur", value); }
  set canplay(value){ return this.Listen("canplay", value); }
  set click(value){ return this.Listen("click", value); }
  set contextmenu(value){ return this.Listen("contextmenu", value); }
  set dblclick(value){ return this.Listen("dblclick", value); }
  set dragend(value){ return this.Listen("dragend", value); }
  set set(value){ return this.Listen("set", value); }
  set dragover(value){ return this.Listen("dragover", value); }
  set drop(value){ return this.Listen("drop", value); }
  set emptied(value){ return this.Listen("emptied", value); }
  set focus(value){ return this.Listen("focus", value); }
  set invalid(value){ return this.Listen("invalid", value); }
  set keypress(value){ return this.Listen("keypress", value); }
  set load(value){ return this.Listen("load", value); }
  set loadstart(value){ return this.Listen("loadstart", value); }
  set mouseenter(value){ return this.Listen("mouseenter", value); }
  set mousemove(value){ return this.Listen("mousemove", value); }
  set mouseover(value){ return this.Listen("mouseover", value); }
  set wheel(value){ return this.Listen("wheel", value); }
  set play(value){ return this.Listen("play", value); }
  set progress(value){ return this.Listen("progress", value); }
  set reset(value){ return this.Listen("reset", value); }
  set scroll(value){ return this.Listen("scroll", value); }
  set set(value){ return this.Listen("set", value); }
  set seeking(value){ return this.Listen("seeking", value); }
  set sort(value){ return this.Listen("sort", value); }
  set suspend(value){ return this.Listen("suspend", value); }
  set toggle(value){ return this.Listen("toggle", value); }
  set waiting(value){ return this.Listen("waiting", value); }
  set afterprint(value){ return this.Listen("afterprint", value); }
  set beforeprint(value){ return this.Listen("beforeprint", value); }
  set hashchange(value){ return this.Listen("hashchange", value); }
  set languagechange(value){ return this.Listen("languagechange", value); }
  set message(value){ return this.Listen("message", value); }
  set messageerror(value){ return this.Listen("messageerror", value); }
  set offline(value){ return this.Listen("offline", value); }
  set online(value){ return this.Listen("online", value); }
  set pagehide(value){ return this.Listen("pagehide", value); }
  set pageshow(value){ return this.Listen("pageshow", value); }
  set popstate(value){ return this.Listen("popstate", value); }
  set rejectionhandled(value){ return this.Listen("rejectionhandled", value); }
  set storage(value){ return this.Listen("storage", value); }
  set unhandledrejection(value){ return this.Listen("unhandledrejection", value); }
  set unload(value){ return this.Listen("unload", value); }
}

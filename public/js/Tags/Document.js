import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";
import {Destructor} from "/js/Loader/Destructor.js";

import {HistoryObserver} from "/js/Observer/HistoryObserver.js";
import {PerformanceObserver} from "/js/Observer/PerformanceObserver.js";
import {MutationObserver} from "/js/Observer/MutationObserver.js";
import {EventObserver} from "/js/Observer/EventObserver.js";
import {ViewObserver} from "/js/Observer/ViewObserver.js";
import {SizeObserver} from "/js/Observer/SizeObserver.js";
import {IntersectionObserver} from "/js/Observer/IntersectionObserver.js";
// import {FileSystemObserver} from "/js/Observer/FileSystemObserver.js";
import {ResizeObserver} from "/js/Observer/ResizeObserver.js";

import {Database} from "/js/Tags/Database.js";
import {Bundler} from "/js/Tags/Bundler.js";
import {Server} from "/js/Tags/Server.js";
import {Socket} from "/js/Tags/Socket.js";
import {URL} from "/js/Tags/URL.js";
import {Meta} from "/js/Tags/Meta.js";
import {Style} from "/js/Tags/Style.js";

import * as Tags from "/js/Tags.js";
Tag.SetTags(Tags);

export class Document extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "#document"; }
  static Get(){ return this.GetDocument(); }

  SetDesignMode(v = true){ this.GetNode().designMode = v ? "on" : "off"; return this; }
  GetDesignMode(){ return this.GetNode().designMode === "on" ? true : false; }

  SetDesignMode(v){ this.GetNode().designMode = v; return this; }
  GetReferrer(){ return this.GetNode().referrer; }
  GetLocation(){ return this.GetNode().location; }
  GetURL(){ return this.GetNode().URL; }
  HasFocus(){ return this.GetNode().hasFocus(); }
  GetTitle(){ return this.GetNode().title; }

  constructor(...args)
  {
    super(...args);

    // console.log("Constructing Document");

    // this.has_scrolled = false; // Has any scroll event happened yet
    // this.SetScrollRestorationDefault();
    // this.current = new URL(window.location.href, window.location.origin);
    //
    // this.state = {
    //   // url: new URL(window.location.href, window.location.origin),
    //   url: this.current.href,
    // };
    //
    // window.addEventListener("scroll", this.OnScroll.bind(this));
    //
    // // Tell the browser to remember the initial state
    // window.history.replaceState(this.state, "", this.state.url);
    //
    // // Fires when back and forward browser back/forward buttons are pressed or history.go() is called
    // window.addEventListener("popstate", this.OnPopState.bind(this), false);

    // window.addEventListener("unload", event =>
    // {
    //   console.log("Unloading, calling document destructor");
    //   this.destructor(this);
    // }, { once: true });

    // Destructor(import.meta.url, () =>
    // {
    //   // console.log("Hi from Document Destructor!");
    //   this.destructor();
    // });

    this.Initialize();
  }

  destructor()
  {
    // console.log("Destructing document");

    const before_unload_event = new window.CustomEvent("beforeunload", { bubbles: false, cancelable: false });
    window.dispatchEvent(before_unload_event);

    const unload_event = new window.CustomEvent("unload", { bubbles: false, cancelable: false });
    window.dispatchEvent(unload_event);

    const history_observer = this.GetHistoryObserver();
    if (history_observer) history_observer.destructor();

    const performance_observer = this.GetPerformanceObserver();
    if (performance_observer) performance_observer.destructor();

    const mutation_observer = this.GetMutationObserver();
    if (mutation_observer) mutation_observer.destructor();

    const event_observer = this.GetEventObserver();
    if (event_observer) event_observer.destructor();

    const view_observer = this.GetViewObserver();
    if (view_observer) view_observer.destructor();

    const size_observer = this.GetSizeObserver();
    if (size_observer) size_observer.destructor();

    const intersection_observer = this.GetIntersectionObserver();
    if (intersection_observer) intersection_observer.destructor();

    const file_system_observer = this.GetFileSystemObserver();
    if (file_system_observer) file_system_observer.destructor();

    const resize_observer = this.GetResizeObserver();
    if (resize_observer) resize_observer.destructor();

    this.GetHTML().destructor();
    this.GetHead().destructor();
    this.GetBody().destructor();

    return super.destructor();
  }

  destructor()
  {
    console.log("Destructing document");

    const before_unload_event = new window.CustomEvent("beforeunload", { bubbles: false, cancelable: false });
    window.dispatchEvent(before_unload_event);

    const unload_event = new window.CustomEvent("unload", { bubbles: false, cancelable: false });
    window.dispatchEvent(unload_event);

    this.GetHTML().destructor();
    this.GetHead().destructor();
    this.GetBody().destructor();

    return super.destructor();
  }

  Trust(node)
  {
    // if (node === window.document)
    // {
    //   console.log("Trusting Document");
    //
    //   const attributes = node.attributes;
    //   if (attributes)
    //   {
    //     for (let i = 0; i < attributes.length; i++)
    //     {
    //       this.Trust(attributes[i]); // Trust the node
    //     }
    //   }
    //
    //   const children = node.childNodes;
    //   for (let i = 0; i < children.length; i++)
    //   {
    //     const child = children[i];
    //
    //     // Skip past any doctype nodes, because they are confused for additional HTML tags
    //     if (child.nodeType === 10)
    //     {
    //       continue;
    //     }
    //
    //     this.Trust(child); // Trust the node and its children
    //   }
    // }

    return node;
  }

  CreateHistoryObserver(){ return new HistoryObserver(this); }
  CreatePerformanceObserver(){ return new PerformanceObserver(this); }
  CreateMutationObserver(){ return new MutationObserver(this); }
  CreateEventObserver(){ return new EventObserver(this); }
  CreateViewObserver(){ return new ViewObserver(this); }
  CreateSizeObserver(){ return new SizeObserver(this); }
  CreateIntersectionObserver(){ return new IntersectionObserver(this); }
  // CreateFileSystemObserver(){ return new FileSystemObserver(this); }
  CreateResizeObserver(){ return new ResizeObserver(this); }
  CreateServer(){ return new Server(); }
  CreateDatabase(){ return new Database(); }
  CreateBundler(){ return new Bundler(); }
  CreateSocket(){ return new Socket(); }
  CreateURL(){ return new URL().Value(window.location.href).Dynamic(true); }
  CreateCSP()
  {
    return new Meta()
    .SetAttribute("http-equiv", "Content-Security-Policy")
    .SetAttribute("content", "default-src *; style-src 'unsafe-inline'")
    // .SetAttribute("content", "default-src 'self'; script-src 'self'; img-src *; media-src *;")
    // .SetAttribute("content", "default-src 'self'; img-src https://*; child-src 'none';")
    ;
  }

  CreateStyle(){ return new Style(); }

  CreateCSP(){ return; }
  CreatePerformanceObserver(){ return; }
  CreateViewObserver(){ return; }
  CreateSizeObserver(){ return; }

  #history_observer;
  #performance_observer;
  #mutation_observer;
  #event_observer;
  #view_observer;
  #size_observer;
  #intersection_observer;
  // #file_system_observer;
  #resize_observer;
  #server;
  #database;
  #bundler;
  #socket;
  #url;
  #csp;
  #style;

  GetHistoryObserver(){ return this.#history_observer ??= this.CreateHistoryObserver(); }
  GetPerformanceObserver(){ return this.#performance_observer ??= this.CreatePerformanceObserver(); }
  GetMutationObserver(){ return this.#mutation_observer ??= this.CreateMutationObserver(); }
  GetEventObserver(){ return this.#event_observer ??= this.CreateEventObserver(); }
  GetViewObserver(){ return this.#view_observer ??= this.CreateViewObserver(); }
  GetSizeObserver(){ return this.#size_observer ??= this.CreateSizeObserver(); }
  GetIntersectionObserver(){ return this.#intersection_observer ??= this.CreateIntersectionObserver(); }
  // GetFileSystemObserver(){ return this.#file_system_observer ??= this.CreateFileSystemObserver(); }
  GetResizeObserver(){ return this.#resize_observer ??= this.CreateResizeObserver(); }
  GetServer(){ return this.#server ??= this.CreateServer(); }
  GetDatabase(){ return this.#database ??= this.CreateDatabase(); }
  GetBundler(){ return this.#bundler ??= this.CreateBundler(); }
  GetSocket(){ return this.#socket ??= this.CreateSocket(); }
  GetURL(){ return this.#url ??= this.CreateURL(); }
  GetCSP(){ return this.#csp ??= this.CreateCSP(); }
  GetStyle(){ return this.#style ??= this.CreateStyle(); }

  Initialize()
  {
    // Initialize each observer by triggering their getters
    this.GetHistoryObserver();
    this.GetPerformanceObserver();
    this.GetMutationObserver();
    this.GetEventObserver();
    this.GetViewObserver();
    this.GetSizeObserver();
    this.GetIntersectionObserver();
    // this.GetFileSystemObserver();
    this.GetResizeObserver();

    this.GetHead().Add(
      this.GetCSP(),
      this.GetStyle(),

      this.GetDatabase(),
      this.GetBundler(),
      this.GetServer()?.Add(
        this.GetSocket(),
      ),
    );

    this.GetBody().ReplaceChildren(
      this.GetURL(),
    );
  }

  SetNode(node)
  {
    const result = super.SetNode(node);

    // this.Initialize();

    return result;
  }

  Title(title, site_name)
  {
    if (Environment.IsDevelopment())
    {
      this.GetNode().title = `[DEV] ${title} - ${site_name}`;
    }
    else
    {
      this.GetNode().title = `${title} - ${site_name}`;
    }

    // this.SetSessionTitle(this.GetNode().title);

    return this;
  }

  async ScrollToHash(hash, attempts = 10)
  {
    let matches = 0;
    while (attempts > 0)
    {
      if (this.has_scrolled === true)
      {
        return;
      }

      await PromiseUtilities.AwaitAnimationFrame();
      attempts -= 1;

      const target = Tag.Query(hash);
      if (target)
      {
        target.ScrollToTop();

        const rect = target.GetBoundingClientRect();

        if (10 >= rect.top)
        {
          console.log("Matched...", matches);
          matches += 1;
          if (matches >= 3)
          {
            console.log(matches, "matches in a row, returning");
            return;
          }
        }
        else
        {
          console.log("Resetting matches to 0");
          matches = 0;
        }
      }
    }
  }

  async ScrollToPosition(x = 0, y = 0, attempts = 10)
  {
    while (attempts > 0)
    {
      await PromiseUtilities.AwaitAnimationFrame();
      attempts -= 1;

      window.scrollTo(x, y);

      if (x === window.scrollX && y === window.scrollY)
      {
        return true;
      }

      console.log("ScrollToPosition failed, trying again", attempts, x, window.scrollX, y, window.scrollY);
    }

    return false;
  }

  async ScrollToPosition(x = 0, y = 0, attempts = 10)
  {
    const start = Date.now();

    while (attempts > 0)
    {
      await PromiseUtilities.AwaitAnimationFrame();

      const promise = this.Query("promise.pending");
      if (promise)
      {
        console.log("There is a promise in the DOM...");
        await promise.GetValue();
      }

      attempts -= 1;

      window.scrollTo(x, y);

      if (x === window.scrollX && y === window.scrollY)
      {
        return true;
      }

      // console.log("ScrollToPosition failed, trying again", {
      //   attempts,
      //   target_x: x,
      //   target_y: y,
      //   current_x: window.scrollX,
      //   current_y: window.scrollY,
      // });
    }

    return false;
  }

  async RestoreScroll(url, attempts)
  {
    if (url.hash)
    {
      return this.ScrollToHash(url.hash);
    }
    else
    {
      const scroll_x = this.GetSessionScrollX();
      const scroll_y = this.GetSessionScrollY();

      return this.ScrollToPosition(scroll_x, scroll_y, attempts);
    }
  }

  GetHTML(){ return this.constructor.For(this.GetNode().documentElement); }
  GetBody(){ return this.constructor.For(this.GetNode().body); }
  GetHead(){ return this.constructor.For(this.GetNode().head); }

  QueryPoint(x, y)
  {
    const element = this.GetNode().elementFromPoint(x, y);
    return this.constructor.For(element);
  }

  GetElementByID(id)
  {
    const element = this.GetNode().getElementById(id);
    return this.constructor.For(element);
  }
}

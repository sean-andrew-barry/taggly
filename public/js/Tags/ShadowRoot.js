import {Tag} from "/js/Tag.js";
import {Document} from "/js/Tags/Document.js";

import {HistoryObserver} from "/js/Observer/HistoryObserver.js";
import {PerformanceObserver} from "/js/Observer/PerformanceObserver.js";
import {MutationObserver} from "/js/Observer/MutationObserver.js";
import {EventObserver} from "/js/Observer/EventObserver.js";
import {ViewObserver} from "/js/Observer/ViewObserver.js";
import {SizeObserver} from "/js/Observer/SizeObserver.js";
import {IntersectionObserver} from "/js/Observer/IntersectionObserver.js";
import {FileSystemObserver} from "/js/Observer/FileSystemObserver.js";
import {ResizeObserver} from "/js/Observer/ResizeObserver.js";

// import {EventObserver} from "/js/Utility/Observer/EventObserver.js";

export class ShadowRoot extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "#shadow-root"; }

  GetHost(){ return this.constructor.For(this.GetNode().host); }

  // By default, a shadow-root's root is itself, but we want the host's root
  GetRoot(){ return this.GetHost()?.GetRoot(); }

  CreateMutationObserver(){ return new MutationObserver(this); }
  CreateEventObserver(){ return new EventObserver(this); }
  CreateViewObserver(){ return new ViewObserver(this); }
  CreateSizeObserver(){ return new SizeObserver(this); }
  CreateIntersectionObserver(){ return new IntersectionObserver(this); }
  CreateFileSystemObserver(){ return new FileSystemObserver(this); }
  CreateResizeObserver(){ return new ResizeObserver(this); }

  GetMutationObserver(){ return this.mutation_observer ??= this.CreateMutationObserver(); }
  GetEventObserver(){ return this.event_observer ??= this.CreateEventObserver(); }
  GetIntersectionObserver(){ return this.intersection_observer ??= this.CreateIntersectionObserver(); }
  GetResizeObserver(){ return this.resize_observer ??= this.CreateResizeObserver(); }

  GetSizeObserver(){ return this.GetRoot()?.GetSizeObserver(); }
  GetViewObserver(){ return this.GetRoot()?.GetViewObserver(); }
  GetFileSystemObserver(){ return this.GetRoot()?.GetFileSystemObserver(); }

  constructor(...args)
  {
    super(...args);

    // console.log("Constructing ShadowRoot and its observers");

    this.GetMutationObserver();
    this.GetEventObserver();
    this.GetIntersectionObserver();
    this.GetResizeObserver();
  }

  // constructor(mode = "closed")
  // {
  //   super();
  //
  //   const shadow = this.CreateShadow(mode);
  //   const wrapper = new Shadow().SetNode(shadow);
  //
  //   this.mutation_observer = new MutationObserver(shadow);
  //
  //   SHADOWS.set(this, wrapper); // Store the shadow tag as a private value
  // }
  //
  // // GetTargetNode(){ return this.shadow; }
  //
  // // Forward each of these functions on to the shadow
  // AppendText(...args){ return SHADOWS.get(this).AppendText(...args); }
  // PrependChild(...args){ return SHADOWS.get(this).PrependChild(...args); }
  // AppendChild(...args){ return SHADOWS.get(this).AppendChild(...args); }
  // InsertBefore(...args){ return SHADOWS.get(this).InsertBefore(...args); }
  // InsertAt(...args){ return SHADOWS.get(this).InsertAt(...args); }
  // ReplaceChild(...args){ return SHADOWS.get(this).ReplaceChild(...args); }
  // RemoveChild(...args){ return SHADOWS.get(this).RemoveChild(...args); }
  // AppendChild(...args){ return SHADOWS.get(this).AppendChild(...args); }
  // InsertBefore(...args){ return SHADOWS.get(this).InsertBefore(...args); }
  // InsertAt(...args){ return SHADOWS.get(this).InsertAt(...args); }
  // ReplaceChild(...args){ return SHADOWS.get(this).ReplaceChild(...args); }
  // RemoveChild(...args){ return SHADOWS.get(this).RemoveChild(...args); }
  // Swap(...args){ return SHADOWS.get(this).Swap(...args); }
  // Adopt(...args){ return SHADOWS.get(this).Adopt(...args); }
  // Unadopt(...args){ return SHADOWS.get(this).Unadopt(...args); }
  // AddBeforeFirst(...args){ return SHADOWS.get(this).AddBeforeFirst(...args); }
  // AddBeforeLast(...args){ return SHADOWS.get(this).AddBeforeLast(...args); }
  // Replace(...args){ return SHADOWS.get(this).Replace(...args); }
  // Before(...args){ return SHADOWS.get(this).Before(...args); }
  // After(...args){ return SHADOWS.get(this).After(...args); }
  // InsertAfter(...args){ return SHADOWS.get(this).InsertAfter(...args); }
  // Remove(...args){ return SHADOWS.get(this).Remove(...args); }
  // Clear(...args){ return SHADOWS.get(this).Clear(...args); }
}

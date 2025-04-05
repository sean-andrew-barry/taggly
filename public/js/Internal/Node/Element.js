// import "/flag#static";
import "/flag#internal";

import {Node} from "/js/Internal/Node.js";
import {Environment} from "/js/Environment.js";
import {Event} from "/js/Event.js";
import {Array as ArrayHelper} from "/js/Array.js";
import {IsNodeVisible} from "/js/External/IsNodeVisible.js";
import {window} from "/js/Window.js";
import {Freeze} from "/js/Utility/Freeze.js";

const COMPUTED_STYLE = Symbol("computed_style");
const ANIMATION = Symbol("animation");
const FRAMES = Symbol("frames");
const FORMATTER = new Intl.NumberFormat();
const EVENT_HANDLERS = new WeakMap();

export class Element extends Node
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "element"; }
  static GetComputedStyleSymbol(){ return COMPUTED_STYLE; }
  static GetFormatterObject(){ return FORMATTER; }

  static Text(...args){ return new this().Text(...args); }
  static ID(...args){ return new this().ID(...args); }
  static Class(...args){ return new this().Class(...args); }
  static Name(...args){ return new this().Name(...args); }
  static HRef(...args){ return new this().HRef(...args); }
  static Src(...args){ return new this().Src(...args); }
  static Type(...args){ return new this().Type(...args); }

  static ConvertNodesToTagArray(nodes, selector)
  {
    const tags = [];
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      if (node?.tag) tags.push(node.tag);
      else if (selector) this.WarnQueryHasNoTag(selector, node);
    }

    return tags;
  }

  static GetDefaultQueryNode(){ return window.document; }

  static QuerySelectorHelper(selector, node = this.GetDefaultQueryNode())
  {
    return node.querySelector(selector);
  }

  static QuerySelectorAllHelper(selector, node = this.GetDefaultQueryNode())
  {
    return node.querySelectorAll(selector);
  }

  static WarnQueryHasNoTag(selector, element)
  {
    console.warn(`Selector "${selector}" matched an element that does not have a tag`, element);
  }

  static Query(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`Query must be given a node to query`);

    const element = this.QuerySelectorHelper(selector, node);
    if (element)
    {
      return element?.tag ?? this.WarnQueryHasNoTag(selector, element);
    }
  }

  static QueryAll(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryAll must be given a node to query`);

    const elements = this.QuerySelectorAllHelper(selector, node);
    return this.ConvertNodesToTagArray(elements, selector);
  }

  static QuerySort(selector, sorter, node = this.GetDefaultQueryNode(), sorted)
  {
    if (!node) throw new Error(`QuerySort must be given a node to query`);

    const unsorted = this.QueryAll(selector, node);
    sorted ??= unsorted.slice().sort(sorter);

    for (let i = 0; i < unsorted.length; i++)
    {
      const a = unsorted[i];
      const b = sorted[i];

      if (a !== b)
      {
        a.Swap(b);
        return this.QuerySort(selector, sorter, node, sorted);
      }
    }
  }

  static QueryEach(selector, callback, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryEach must be given a node to query`);

    const tags = this.QueryAll(selector, node);
    tags.forEach(callback);
    // for (let i = 0; i < tags.length; i++)
    // {
    //   callback(tags[i]);
    // }
  }

  static QueryDeepest(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryDeepest must be given a node to query`);

    const children = node.children;
    if (!children) return;

    for (let i = 0; i < children.length; i++)
    {
      const child = children[i];
      if (child && child.tag)
      {
        // Found a match
        if (child.tag.IsMatch(selector))
        {
          // Check if any of its children are better matches
          const result = this.QueryDeepest(selector, child);

          if (result) return result; // Found a deeper match, return it
          else return child; // Return the original match
        }
        else
        {
          // No match yet, so recursively search its children
          return this.QueryDeepest(selector, child);
        }
      }
    }
  }

  static QueryLast(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryLast must be given a node to query`);

    const children = node.children;
    if (!children) return;

    for (let i = children.length - 1; i >= 0; i--)
    {
      const child = children[i];
      if (child && child.tag)
      {
        if (child.tag.IsMatch(selector)) return child; // Found a match, return it
        else return this.QueryDeepest(selector, child);
      }
    }
  }

  static QueryClosest(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryClosest must be given a node to query`);
    return node.closest(selector)?.tag;
  }

  static QueryPoint(x, y, node = this.GetDefaultQueryNode())
  {
    return window.document.elementFromPoint(x, y)?.tag;
  }

  static QueryAdd(selector, ...args)
  {
    const node = this.GetDefaultQueryNode();
    const target = this.Query(selector, node);

    if (target) target.Add(...args);
    else throw new Error(`Tag ${this.GetLocalName()} failed to query a tag matching "${selector}"`);

    return this;
  }

  static FindByID(id)
  {
    const element = window.document.getElementById(id);
    if (element) return element?.tag ?? this.WarnQueryHasNoTag(`#${id}`, element);
  }

  static GetByID(id)
  {
    const tag = this.FindByID(id);

    if (tag) return tag;
    else throw new Error(`Failed to find a tag for id "${id}"`);
  }

  // Each of these have a ?? null fallback because they should not fall back to the static GetDefaultQueryNode function
  // Instead they should error, since the query was *suppose* to be limited in its scope
  QuerySort(selector, sorter){ return this.constructor.QuerySort(selector, sorter, this.GetNode() ?? null); }
  QueryEach(selector, callback){ return this.constructor.QueryEach(selector, callback, this.GetNode() ?? null); }
  QueryDeepest(selector){ return this.constructor.QueryDeepest(selector, this.GetNode() ?? null); }
  QueryLast(selector){ return this.constructor.QueryLast(selector, this.GetNode() ?? null); }

  QueryScope(selector)
  {
    const prev = this.GetPrevSibling();
    if (prev)
    {
      if (prev.IsMatch(selector)) return prev;

      const result = prev.Query(selector);
      if (result) return result;

      return prev.QueryScope(selector);
    }
    else
    {
      // If it's a parent, we don't perform a query on its children,
      // that only happens with older siblings
      const parent = this.GetParent();

      if (!parent) return null;
      else if (parent.IsMatch(selector)) return parent;
      else return parent.QueryScope(selector);
    }
  }

  // QueryAncestor(selector){ return this.GetParent()?.QueryClosest(selector); }

  // TODO: Possibly make this an OnMutation instead of OnConnect?
  // Or maybe just depreciate it entirely?
  QueryAsync(selector)
  {
    const tag = this.Query(selector);
    if (tag) return tag;

    return new Promise((resolve, reject) =>
    {
      this.OnConnect(event =>
      {
        if (event.tag.IsMatch(selector))
        {
          this.RemoveEventListener(event);
          return resolve(event.tag);
        }
      }, { capture: true });
    });
  }

  constructor(value)
  {
    super(value);

    if (typeof(value) === "string")
    {
      this.Class(value);
    }
  }

  _destructor()
  {
    let child = this.GetFirstChildNode();
    while (child)
    {
      const tag = this.constructor.GetTag(child);

      if (tag)
      {
        tag.destructor();
      }

      if (tag) this.RemoveChild(child);
      else this.GetNode().removeChild(child);

      child = this.GetFirstChildNode();
    }

    return super.destructor();
  }

  ConvertAllToNodesHelper(array)
  {
    if (array.length === 0)
    {
      return array;
    }
    else if (ArrayHelper.IsTemplateObject(array[0]))
    {
      const strings = array[0];
      // const values = array.slice(1);
      const length = Math.max(strings.length, array.length - 1);
      const results = [];

      for (let i = 0; i < length; i++)
      {
        const string = this.Convert(strings[i]);
        const value  = this.Convert(array[i + 1]);

        if (string !== undefined) results.push(string);
        if (value  !== undefined) results.push(value );
      }

      return results;
    }
    else
    {
      const results = [];

      for (let i = 0; i < array.length; i++)
      {
        const value = this.Convert(array[i]);
        if (value !== undefined) results.push(value);
      }

      return results;
    }
  }

  static Prepend(...args){ return new this().Prepend(...args); }
  static Append(...args){ return new this().Append(...args); }

  Prepend(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().prepend(...nodes);
    return this;
  }

  Append(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().append(...nodes);
    return this;
  }

  Append(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);

    const node = this.GetNode();
    for (let i = 0; i < nodes.length; i++)
    {
      node.appendChild(nodes[i]);
    }

    return this;
  }

  ShadowAppend(...values)
  {
    this.GetShadow().Append(...values);
    return this;
  }

  ShadowPrepend(...values)
  {
    this.GetShadow().Prepend(...values);
    return this;
  }

  // Aliases for Append, might depreciate
  Add(...values){ return this.Append(...values); }
  TL(...values){ return this.Append(...values); }

  Before(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().before(...nodes);
    return this;
  }

  After(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().after(...nodes);
    return this;
  }

  ReplaceChildren(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().replaceChildren(...nodes);
    return this;
  }

  // Replace this element with the values
  ReplaceWith(...values)
  {
    const nodes = this.ConvertAllToNodesHelper(values);
    this.GetNode().replaceWith(...nodes);
    return this;
  }

  // TODO: Test the performance of manually clearing vs. using replaceChildren()
  Clear()
  {
    this.GetNode().replaceChildren();
    return this;
  }

  Remove()
  {
    this.GetNode().remove();
    return this;
  }

  GetValue(){ return super.GetValue() ?? this.GetAttribute("value"); }
  GetLocalName(){ return this.GetNode()?.localName ?? super.GetLocalName(); }

  GetParent(){ return this.constructor.For(this.GetParentNode()); }
  GetOffsetParent(){ return this.constructor.For(this.GetOffsetParentNode()); }
  GetFirstChild(){ return this.constructor.For(this.GetFirstChildNode()); }
  GetLastChild(){ return this.constructor.For(this.GetLastChildNode()); }
  GetPrevSibling(){ return this.constructor.For(this.GetPrevSiblingNode()); }
  GetNextSibling(){ return this.constructor.For(this.GetNextSiblingNode()); }
  GetChild(i = 0){ return this.constructor.For(this.GetChildNode(i)); }

  GetChildren()
  {
    const children = [];
    const nodes = this.GetChildNodes();
    for (let i = 0; i < nodes.length; i++)
    {
      const child = this.constructor.For(nodes[i]);
      if (child) children.push(child);
    }

    return children;
  }

  HTML(html)
  {
    // console.warn("Element.HTML is not fully implemented and may be depreciated");

    const inactive_document = window.document.implementation.createHTMLDocument();

    const context = inactive_document.createElement(this.GetLocalName());
    context.innerHTML = html;

    this.ReplaceChildren(...context.children);

    return this;
  }

  ForEachChild(fn, self)
  {
    const node = this.GetNode();
    for (let i = 0; i < node.children.length; i++)
    {
      const child = node.children[i];
      if (child.tag) fn.call(self, child.tag, i);
    }
  }

  FindParent(fn, self)
  {
    const tag = this.GetParent();
    if (tag)
    {
      if (fn.call(self, tag) === true) return tag;
      else return tag.FindParent(fn, self);
    }
  }

  FindPrevSibling(fn, self)
  {
    const tag = this.GetPrevSibling();
    if (tag)
    {
      if (fn.call(self, tag) === true) return tag;
      else return tag.FindPrevSibling(fn, self);
    }
  }

  FindNextSibling(fn, self)
  {
    const tag = this.GetNextSibling();
    if (tag)
    {
      if (fn.call(self, tag) === true) return tag;
      else return tag.FindNextSibling(fn, self);
    }
  }

  FindFirstChild(fn, self)
  {
    const tag = this.GetFirstChild();
    if (tag)
    {
      if (fn.call(self, tag) === true) return tag;
      else return tag.FindFirstChild(fn, self);
    }
  }

  FindLastChild(fn, self)
  {
    const tag = this.GetLastChild();
    if (tag)
    {
      if (fn.call(self, tag) === true) return tag;
      else return tag.FindLastChild(fn, self);
    }
  }

  FindChild(fn, self)
  {
    const node = this.GetNode();
    for (let i = 0; i < node.children.length; i++)
    {
      const child = node.children[i];
      if (child.tag && fn.call(self, child.tag) === true) return child.tag;
    }
  }

  HasShadow(){ return !!this.GetShadowNode(); }
  GetShadow(){ return this.constructor.For(this.GetShadowNode()); }
  CreateShadow(mode = "open")
  {
    const node = this.GetNode();
    const fn = node.attachShadow;

    if (Environment.IsClient())
    {
      // If the mode is closed, make sure the function hasn't been tampered with
      if ((mode === "closed") && (fn.toString() !== "function attachShadow() { [native code] }"))
      {
        throw new Error("The Element.prototype.attachShadow function has been tampered with, meaning a closed shadow is not truly closed");
      }
    }

    const shadow = fn.call(node, { mode });
    return this.constructor.For(shadow);
  }

  GetFirstClass(){ return this.GetClassList()[0]; }
  GetLastClass(){ const list = this.GetClassList(); return list[list.length - 1]; }

  GetClasses(){ return this.GetNode().className; }
  GetClassList(){ return this.GetNode().classList; }
  GetClassCount(){ return this.GetClassList().length; }
  HasClass(value){ return this.GetClassList().contains(value); }
  SetClass(value){ this.GetClassList().add(value); return this; }
  AddClass(...values){ this.GetClassList().add(...values); return this; }
  RemoveClass(...values){ this.GetClassList().remove(...values); return this; }
  ReplaceClass(old, value){ this.GetClassList().replace(old, value); return this; }
  ToggleClass(value, force){ this.GetClassList().toggle(value, force); return this; }
  ForEachClass(fn, self = this){ this.GetClassList().forEach(fn, self); return this; }
  GetClassKeys(){ return this.GetClassList().keys(); }
  GetClassValues(){ return this.GetClassList().values(); }
  GetClassEntries(){ return this.GetClassList().entries(); }
  GetClassCount(){ return this.GetClassList().length; }
  GetClass(i = 0){ return this.GetClassList().item(i); }

  GetAttributes(){ return this.GetNode().attributes; }
  HasAttribute(name){ return this.GetNode().hasAttribute(name); }
  GetAttributeString(name){ return this.GetNode().getAttribute(name); }
  GetAttributeDisplay(name){ return this.GetNode().getAttribute(name); }
  GetAttributeNode(name){ return this.GetNode().getAttributeNode(name); }
  RemoveAttribute(name){ this.GetNode().removeAttribute(name); return this; }
  SetAttributeNode(node){ this.GetNode().setAttributeNode(node); return this; }
  SetAttributeNodeNS(name, node, ns){ this.GetNode().setAttributeNodeNS(name, node, ns); return this; }
  SetAttributeNS(name, value = "", ns = null){ this.GetNode().setAttributeNS(ns, name, value); return this; }

  // Set a node's attribute value and store the original value as its [NODE_VALUE] to preserve the type
  SetAttribute(name, value, display, unit)
  {
    // console.log("SetAttribute", name, value, display);

    // If it's a number and no display override was provided, auto format it
    if (typeof(value) === "number" && display === undefined)
    {
      display = FORMATTER.format(value);
      if (unit !== undefined)
      {
        display += unit;
      }
    }

    let attribute = this.GetAttributeNode(name);
    if (attribute)
    {
      attribute.value = display ?? value?.toString(); // Set the attribute's value
    }
    else
    {
      attribute = this.constructor.CreateNodeAttribute(name); // Construct a TRUSTED attribute
      attribute.value = display ?? value?.toString(); // The attribute.value must be applied before calling setAttributeNode

      this.GetNode().setAttributeNode(attribute); // Apply the new attribute to the node
    }

    // Store the original value, which may or may not be a string
    this.constructor.SetNodeValue(attribute, value);

    // console.log("Result:", attribute);

    return this;
  }

  // Get an attribute's [NODE_VALUE], .value property, or .nodeValue property
  GetAttribute(name)
  {
    const attribute = this.GetAttributeNode(name);

    if (!attribute)
    {
      return undefined;
    }
    else
    {
      return this.constructor.GetNodeValue(attribute)
          ?? attribute.value
          ?? attribute.nodeValue
          ?? undefined;
    }
  }

  SetMissingAttribute(name, value, display)
  {
    if (this.HasAttribute(name)) return this;
    else return this.SetAttribute(name, value, display);
  }

  ClearAttributes()
  {
    const attributes = this.GetAttributes();
    if (attributes)
    {
      for (let i = attributes.length - 1; i >= 0; i--)
      {
        const {name, value} = attributes[i];
        this.RemoveAttribute(name);
      }
    }

    return this;
  }

  ForEachAttribute(fn, self = this)
  {
    const attributes = this.GetAttributes();
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        const attribute = attributes[i];
        fn.call(self, attribute.name, attribute.value, attribute);
      }
    }

    return this;
  }

  ToggleAttribute(name, force)
  {
    if (force === true || !this.HasAttribute(name))
    {
      return this.SetAttribute(name, "");
    }
    else
    {
      return this.RemoveAttribute(name);
    }
  }

  ToggleAttribute(name, force)
  {
    this.GetNode().toggleAttribute(name, force);
    return this;
  }

  GetDataSet(){ return this.GetNode().dataset; }
  GetData(name){ return this.GetDataSet()[name]; }
  AddData(name, value)
  {
    this.GetDataSet()[name] = value;
    return this;
  }

  RemoveData(name)
  {
    delete this.GetDataSet()[name];
    return this;
  }

  GetClientHeight(){ return this.GetNode().clientHeight; }
  GetClientLeft(){ return this.GetNode().clientLeft; }
  GetClientTop(){ return this.GetNode().clientTop; }
  GetClientWidth(){ return this.GetNode().clientWidth; }
  GetOffsetWidth(){ return this.GetNode().offsetWidth; }
  GetOffsetHeight(){ return this.GetNode().offsetHeight; }
  GetAssignedSlot(){ return this.GetNode().assignedSlot; }
  GetChildElementCount(){ return this.GetNode().childElementCount; }
  GetNamespaceURI(){ return this.GetNode().namespaceURI; }
  GetPrefix(){ return this.GetNode().prefix; } // With <x:div> returns "x";
  GetBoundingClientRect(){ return this.GetNode().getBoundingClientRect(); }
  GetClientRects(){ return this.GetNode().getClientRects(); }

  InnerHTML(v){ return this.SetProperty("innerHTML", v); }
  OuterHTML(v){ return this.SetProperty("outerHTML", v); }
  InnerText(v){ return this.SetProperty("innerText", v); }
  OuterText(v){ return this.SetProperty("outerText", v); }

  GetOuterHTML(){ return this.GetNode().outerHTML; }
  GetInnerHTML(){ return this.GetNode().innerHTML; }
  GetOwnHTML(){ return this.GetNode().cloneNode(false).outerHTML; }

  GetAbsoluteBoundingClientRect()
  {
    const box = this.GetBoundingClientRect();

    const top = box.top + window.pageYOffset;
    const right = box.right + window.pageXOffset;
    const bottom = box.bottom + window.pageYOffset;
    const left = box.left + window.pageXOffset;

    box.x = left;
    box.y = top;
    box.width = right - left;
    box.height = bottom - top;

    return box;
  }

  GetAbsoluteBoundingClientRect(rect = this.GetBoundingClientRect())
  {
    const top = rect.top + window.pageYOffset;
    const right = rect.right + window.pageXOffset;
    const bottom = rect.bottom + window.pageYOffset;
    const left = rect.left + window.pageXOffset;

    return {
      top,
      right,
      bottom,
      left,
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };
  }

  GetRectHash(rect)
  {
    return String.fromCharCode(
      Math.floor(rect.x),
      Math.floor(rect.y),
      Math.floor(rect.width),
      Math.floor(rect.height),
    );
  }

  GetStyles()
  {
    if (this.HasAttribute("stylesheet"))
    {
      const sheet = this.GetAttribute("stylesheet");
      return sheet.GetRule(this).style;
    }
    else
    {
      return this.GetNode().style;
    }
  }

  GetStylesText(){ return this.GetStyles().cssText; }
  ClearStyles(){ return this.RemoveAttribute("style"); }

  _CreateComputedStyle()
  {
    return window.getComputedStyle(this.GetNode());
  }

  _ClearComputedStyle()
  {
    this[COMPUTED_STYLE] = undefined;
    return this;
  }

  // GetComputedStyle(){ return this[COMPUTED_STYLE] ??= this.CreateComputedStyle(); }
  // GetComputedStyle(){ return this.CreateComputedStyle(); }
  GetComputedStyle(){ return window.getComputedStyle(this.GetNode()); }

  ShouldSetStyleClear(name, value, important, styles){ return Environment.IsClient(); }
  ShouldSetStyleWarn(name, value, important, styles){ return Environment.IsClient() && !styles.getPropertyValue(name); }

  GetFrames(){ return this[FRAMES] ??= []; }
  ClearFrames(){ this[FRAMES] = undefined; return this; }

  AppendFrames(key, values)
  {
    const frames = this.GetFrames();
    if (values.length === 1)
    {
      values.push(values[0]);
    }

    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      if (value === undefined || value === null) continue;

      // console.log("Adding", { [key]: value }, "to frame", i);

      if (i >= frames.length)
      {
        frames.push({
          [key]: value,
        });
      }
      else if (frames[i][key])
      {
        frames[i][key] += " " + value;
      }
      else
      {
        frames[i][key] = value;
      }
    }

    return this;
  }

  ParseNumberCSS(string)
  {
    if (string === "infinite")
    {
      return Infinity;
    }
    else
    {
      const number = window.Number(string);
      if (!window.Number.isNaN(number))
      {
        return number;
      }
    }
  }

  ParseTimeCSS(string)
  {
    if (string.endsWith("ms"))
    {
      const number = window.Number(string.slice(0, -2));
      if (!window.Number.isNaN(number)) return number;
    }
    else if (string.endsWith("s"))
    {
      const number = window.Number(string.slice(0, -1));
      if (!window.Number.isNaN(number)) return number;
    }
  }

  GetAnimations(){ return this.GetNode().getAnimations(); }

  GetAnimationOptions()
  {
    let iterations = 1;
    let delay = 0;
    let duration = 0;

    const iteration_style = this.GetStyle("animation-iteration-count");
    if (iteration_style)
    {
      const number = this.ParseNumberCSS(iteration_style);
      if (number !== undefined) iterations = number;
    }

    const delay_style = this.GetStyle("animation-delay");
    if (delay_style)
    {
      const number = this.ParseTimeCSS(delay_style);
      if (number !== undefined) delay = number;
    }

    const duration_style = this.GetStyle("animation-duration");
    if (duration_style)
    {
      const number = this.ParseTimeCSS(duration_style);
      if (number !== undefined) duration = number;
    }

    const direction = this.GetStyle("animation-direction") || undefined;
    const easing = this.GetStyle("animation-timing-function") || undefined;
    const fill = this.GetStyle("animation-fill-mode") || undefined;

    return {
      duration,
      iterations,
      direction,
      easing,
      delay,
      fill,
    };
  }

  Animate()
  {
    const options = this.GetAnimationOptions();

    // console.log("Animation options:", options);
    const frames = this.GetFrames();
    // console.log("Playing", frames);

    const animation = this.GetNode().animate(frames, options);

    const state = this.GetStyle("animation-play-state") || undefined;
    if (state === "paused")
    {
      animation.pause();
    }

    return this;
  }

  Stylesheet(stylesheet)
  {
    if (stylesheet)
    {
      return this.SetAttribute("stylesheet", stylesheet, stylesheet.GetSelector());
    }
    else
    {
      return this.RemoveAttribute("stylesheet");
    }
  }

  SetStyle(name, value, important = false)
  {
    if (value === undefined || value === null)
    {
      this.RemoveStyle(name);
    }
    else
    {
      const styles = this.GetStyles();

      // If the style should be cleared before setting it
      if (this.ShouldSetStyleClear(name, value, important, styles))
      {
        styles.removeProperty(name);
      }

      if (typeof(value) === "object" && value instanceof globalThis.Array)
      {
        // console.log("Animation", name, "is", value);

        this.AppendFrames(name, value);

        // Default to the first value
        value = value[0];
      }

      styles.setProperty(name, value, (important === true) ? "important" : undefined);

      if (this.ShouldSetStyleWarn(name, value, important, styles))
      {
        console.warn(`Failed to set style "${name}" to "${value}"`);
      }

      // console.log("SetStyle", name, value, styles.constructor.name);
    }

    return this;
  }

  SetStyle(name, value, important = false)
  {
    if (value === undefined || value === null)
    {
      this.RemoveStyle(name);
    }
    else
    {
      const styles = this.GetStyles();

      // I'm curious if this is a performance improvement?
      // It may stop the browser from doing a reflow at times
      if (styles.getPropertyValue(name) === value)
      {
        return this;
      }

      // If the style should be cleared before setting it
      if (this.ShouldSetStyleClear(name, value, important, styles))
      {
        styles.removeProperty(name);
      }

      if (typeof(value) === "object" && value instanceof global.Array)
      {
        this.AppendFrames(name, value);

        // Default to the first value
        value = value[0];
      }

      styles.setProperty(name, value, (important === true) ? "important" : undefined);

      if (this.ShouldSetStyleWarn(name, value, important, styles))
      {
        console.warn(`Failed to set style "${name}" to "${value}"`);
      }
    }

    return this;
  }

  // TODO: Possibly depreciate AppendStyle
  AppendStyle(name, value, important, original)
  {
    if (typeof(original) === "object" && original instanceof window.Array)
    {
      console.log("Animation", name, "is", original);
    }

    const styles = this.GetStyles();

    const values = [];

    const current = styles.getPropertyValue(name);
    if (current) values.push.apply(values, current.split(" "));

    // console.log({current, values});

    values.push(value);
    styles.setProperty(name, values.join(" "), (important === true) ? "important" : undefined);

    // if (Environment.IsClient() && !styles.getPropertyValue(name))
    // {
    //   console.warn(`Failed to append "${value}" to style "${name}"`);
    // }

    return this;
  }

  ToggleStyle(name, value, important = false)
  {
    const style = this.GetStyles();
    const current = style.getPropertyValue(name);

    style.setProperty(name, value, (important === true) ? "important" : undefined);

    // If the computed style did not change, it's the same, so toggle it off
    if (style.getPropertyValue(name) === current)
    {
      style.removeProperty(name);
    }

    return this;
  }

  GetStyle(name)
  {
    const styles = this.GetStyles();
    return styles.getPropertyValue(name);
  }

  RemoveStyle(name)
  {
    this.GetStyles().removeProperty(name);
    return this;
  }

  HasStyle(name)
  {
    return !!this.GetStyles().getPropertyValue(name);
  }

  IsMatch(query){ return this.GetNode().matches(query); }
  IsHovered(){ return this.IsMatch(":hover"); }
  IsActive(){ return this.IsMatch(":active"); }
  IsFocused(){ return this.IsMatch(":focus"); }
  IsFocusedWithin(){ return this.IsMatch(":focus-within"); }
  IsUnvisited(){ return this.IsMatch(":link"); }
  IsChecked(){ return this.IsMatch(":checked"); }
  IsDisabled(){ return this.IsMatch(":disabled"); }
  IsEnabled(){ return this.IsMatch(":enabled"); }
  IsFirst(){ return this.IsMatch(":first"); }
  IsFirstChild(){ return this.IsMatch(":first-child"); }
  IsLast(){ return this.IsMatch(":last"); }
  IsLastChild(){ return this.IsMatch(":last-child"); }
  IsOnlyChild(){ return this.IsMatch(":only-child"); }
  IsOptional(){ return this.IsMatch(":optional"); }
  IsReadOnly(){ return this.IsMatch(":read-only"); }
  IsRequired(){ return this.IsMatch(":required"); }
  IsValid(){ return this.IsMatch(":valid"); }
  IsVisited(){ return this.IsMatch(":visited"); }
  IsInvalid(){ return this.IsMatch(":invalid"); }

  IsInDocument(){ return window.document.documentElement.contains(this.GetNode()); }
  IsInHead(){ return window.document.head.contains(this.GetNode()); }
  IsInBody(){ return window.document.body.contains(this.GetNode()); }

  // Return true if the center point of the tag is below the screen height percentage
  IsBelow(multiplier)
  {
    const {y, height} = this.GetRect();
    return !((window.innerHeight * multiplier) >= (y + (height / 2)));
  }

  IsVisible(){ return IsNodeVisible(this.GetNode()); }

  IsInView(bounding = this.GetBoundingClientRect(), width = this.GetWindowWidth(), height = this.GetWindowHeight())
  {
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= width &&
      bounding.bottom <= height
    );
  }

  GetWidth(rect = this.GetBoundingClientRect()){ return rect.width; }
  GetHeight(rect = this.GetBoundingClientRect()){ return rect.height; }

  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }
  GetViewWidth(){ return Math.max(document.documentElement.clientWidth, window.innerWidth); }
  GetViewHeight(){ return Math.max(document.documentElement.clientHeight, window.innerHeight); }

  IsPartiallyOnScreen(bounding = this.GetBoundingClientRect(), width = this.GetWindowWidth(), height = this.GetWindowHeight())
  {
    return bounding.top >= 0
        || bounding.left >= 0
        || bounding.right <= width
        || bounding.bottom <= height;
  }

  IsFullyOnScreen(bounding = this.GetBoundingClientRect(), width = this.GetWindowWidth(), height = this.GetWindowHeight())
  {
    return bounding.top >= 0
        && bounding.left >= 0
        && bounding.right <= width
        && bounding.bottom <= height;
  }

  IsFullyOffScreen(bounding = this.GetBoundingClientRect(), width = this.GetViewWidth(), height = this.GetViewHeight())
  {
    return (
      ((bounding.x + bounding.width ) < 0) ||
      ((bounding.y + bounding.height) < 0) ||
      ((bounding.x > width) || (bounding.y > height))
    );
  }

  IsPointInside(x, y)
  {
    const {top, bottom, left, right} = this.GetBoundingClientRect();
    return (x >= left && right >= x) && (y >= top && bottom >= y);
  }

  Contains(tag){ return this.GetNode().contains(tag.GetNode()); }
  Normalize(){ return this.GetNode().normalize(); }
  GetDocument(){ return this.constructor.For(this.GetDocumentNode()); }
  GetRoot(){ return this.constructor.For(this.GetRootNode()); }

  static GetDocument(){ return this.For(window.document); }

  Scroll(x, y){ this.GetNode().scroll(x, y); return this; }
  ScrollBy(x, y){ this.GetNode().scrollBy(x, y); return this; }
  ScrollTo(options){ this.GetNode().scrollIntoView(options); return this; }
  ScrollToSmooth(){ return this.ScrollTo({ behavior: "smooth" }); }
  ScrollToCenter(){ return this.ScrollTo({ block: "center", inline: "nearest", }); }
  ScrollToTop(){ return this.ScrollTo({ block: "start", inline: "nearest", }); }
  ScrollToBottom(){ return this.ScrollTo({ block: "end", inline: "nearest", }); }

  DispatchEvent(event)
  {
    this.GetNode().dispatchEvent(event);
    return this;
  }

  On(name, handler, options)
  {
    if (typeof(name) === "function" && name.prototype instanceof Event)
    {
      name = name.GetLocalName();
    }

    const handler_wrapper = event =>
    {
      try
      {
        const result = handler.call(this, event, this);
        if (result instanceof window.Promise)
        {
          result.catch(error => this.Throw(error));
        }
      }
      catch (error)
      {
        this.Throw(error);
      }
    };

    // Map the internal wrapper to the external handler so it can stop listening later
    EVENT_HANDLERS.set(handler, handler_wrapper);

    this.GetNode().addEventListener(name, handler_wrapper, options);

    return this;
  }

  Off(name, handler, options)
  {
    if (typeof(name) === "function" && name.prototype instanceof Event)
    {
      name = name.GetLocalName();
    }

    const handler_wrapper = EVENT_HANDLERS.get(handler);

    this.GetNode().removeEventListener(name, handler_wrapper, options);

    return this;
  }

  Once(name, handler)
  {
    return this.On(name, handler, { once: true });
  }

  Capture(name, handler)
  {
    return this.On(name, handler, { capture: true });
  }

  Await(name, timeout)
  {
    if (typeof(name) === "function" && name.prototype instanceof Event)
    {
      name = name.GetLocalName();
    }

    let resolve;
    const handler = event =>
    {
      resolve(event);
    };

    let timeout_id;
    if (typeof(timeout) === "number")
    {
      timeout_id = window.setTimeout(() =>
      {
        this.GetNode().removeEventListener(name, handler);
      }, timeout);
    }

    return new Promise((res) =>
    {
      resolve = res;

      this.GetNode().addEventListener(name, handler, { once: true });
    });
  }

  Click(){ this.GetNode().click(); return this; }
  Focus(){ this.GetNode().focus(); return this; }

  //---------------------------------
  // Queries
  //---------------------------------
  Query(selector)
  {
    const node = this.GetNode().querySelector(selector);
    return this.constructor.For(node);
  }

  QueryAll(selector)
  {
    const nodes = this.GetNode().querySelectorAll(selector);
    return Array.from(nodes, n => this.constructor.For(n));
  }

  QueryAdd(selector, ...args)
  {
    const target = this.Query(selector);

    if (target) target.Add(...args);
    else throw new Error(`Tag ${this.GetLocalName()} failed to query a tag matching "${selector}"`);

    // NOTE: Returning `this`, rather than the target, is intentional
    // It is so you can add tags to nested children inline
    return this;
  }

  QueryClosest(selector)
  {
    const node = this.GetNode().closest(selector);
    return this.constructor.For(node);
  }

  QueryAncestor(selector){ return this.GetParent()?.QueryClosest(selector); }

  // Uses Document's elementFromPoint, but constrains it to children of this tag
  QueryPoint(x, y)
  {
    const tag = this.GetDocument()?.QueryPoint(x, y);
    if (tag && this.Contains(tag)) return tag;
  }

  GetElementByID(id)
  {
    const tag = this.GetDocument()?.GetElementByID(id);
    if (tag && this.Contains(tag)) return tag;
  }

  GetElementsByName(name)
  {
    const elements = this.GetNode().getElementsByName(name);
    return Array.from(elements, e => this.constructor.For(e));
  }

  GetElementsByClass(names)
  {
    const elements = this.GetNode().getElementsByClassName(names);
    return Array.from(elements, e => this.constructor.For(e));
  }

  GetElementsByTag(names)
  {
    const elements = this.GetNode().getElementsByTagName(names);
    return Array.from(elements, e => this.constructor.For(e));
  }

  GetByID(id)
  {
    const tag = this.GetDocument()?.GetElementByID(id);
    if (tag && this.Contains(tag)) return tag;
  }

  QueryByName(name)
  {
    const elements = this.GetNode().getElementsByName(name);
    return Array.from(elements, e => this.constructor.For(e));
  }

  QueryByClass(names)
  {
    const elements = this.GetNode().getElementsByClassName(names);
    return Array.from(elements, e => this.constructor.For(e));
  }

  QueryByTag(names)
  {
    const elements = this.GetNode().getElementsByTagName(names);
    return Array.from(elements, e => this.constructor.For(e));
  }

  //---------------------------------
  // Iterators
  //---------------------------------
  *[Symbol.iterator]()
  {
    let child = this.GetFirstChild();
    while (child)
    {
      yield child;
      child = child.GetNextSibling();
    }
  }

  *EachChild()
  {
    let child = this.GetFirstChild();
    while (child)
    {
      yield child;
      child = child.GetNextSibling();
    }
  }

  *EachOlderSibling()
  {
    let sibling = this.GetPrevSibling();
    while (sibling)
    {
      yield sibling;
      sibling = sibling.GetPrevSibling();
    }
  }

  *EachYoungerSibling()
  {
    let sibling = this.GetNextSibling();
    while (sibling)
    {
      yield sibling;
      sibling = sibling.GetNextSibling();
    }
  }

  *EachParent()
  {
    let parent = this.GetParent();
    while (parent)
    {
      yield parent;
      parent = parent.GetParent();
    }
  }

  *EachDescendant()
  {
    const stack = [this.GetFirstChild()];

    while (stack.length > 0)
    {
      const top = stack.pop();
      yield top;

      const child = top.GetFirstChild();
      if (child) stack.push(child);

      const sibling = top.GetNextSibling();
      if (sibling) stack.push(sibling);
    }
  }

  *EachAttributeNode(fn, self = this)
  {
    const attributes = this.GetAttributes();
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        yield attributes[i];
      }
    }
  }

  *EachAttribute(fn, self = this)
  {
    const attributes = this.GetAttributes();
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        const attribute = attributes[i];
        yield {
          name: attribute.name,
          value: this.constructor.GetNodeValue(attribute) ?? attribute.value ?? attribute.nodeValue,
        };
      }
    }
  }
}

Freeze(Element);

import "/flag#internal";

import {Element} from "/js/Internal/Node/Element.js";
import {Promise as PromiseHelper} from "/js/Promise.js";
import {Environment} from "/js/Environment.js";
import {NodeSwap} from "/js/External/NodeSwap.js";
import {window} from "/js/Window.js";
import {Sanitize} from "/js/Tag/Sanitize.js";
import {Freeze} from "/js/Utility/Freeze.js";
import * as E from "/js/Events.js";
// import * as Self from "/js/Tag.js#delay";
// import * as Tags from "/js/Tags.js";
// import {Constants} from "/js/Tags/Constants.js";
import {Expectation} from "/js/Debug/Expectation.js";

// import "/js/Tags.js";
// import "/js/TagsTest.js";

// import * as BaseTag from "/js/Tag.js";
// import {Tag as BaseTag} from "/js/Tag.js";
// console.log(BaseTag);

// globalThis.setTimeout(() =>
// {
//   console.log("Timeout", Tags);
// }, 100);

// console.log(AllTags);
let Tags;
// import("/js/Tags.js").then(mod =>
// {
//   console.log("Imported", Tags);
// });

const SELECTOR = Symbol("selector");

// From Base
const EVENT = Symbol("event");
const NODE_VALUE = Symbol("node_value");
const COMPUTED_STYLE = Symbol("computed_style");
const ACTIONS = Symbol("actions");
const RECORD = Symbol("record");
const CODE = Symbol("code");
const HASH = Symbol("hash");

export class Tag extends Element
{
  static SetTags(tags){ Tags = tags; }

  // constructor(...args)
  // {
  //   super(...args);
    
  //   // if (!Tags)
  //   // {
  //   //   console.log("No tags...", this.constructor.name);
  //   // }
  // }

  static EncodeAttribute(buffer, tag, attribute)
  {
    const name = attribute.name;
    const value = this.GetNodeValue(attribute) ?? attribute.value ?? attribute.nodeValue ?? undefined;

    buffer.Write(name);
    buffer.Write(value);
  }

  static EncodeAttributes(buffer, tag)
  {
    const start = buffer.GetOffset();

    // We don't know the size yet, so simply put a 0 for now
    buffer.WriteU32(0);

    const node = tag.GetNode();
    if (node.attributes)
    {
      for (let i = 0; i < node.attributes.length; i++)
      {
        this.EncodeAttribute(buffer, tag, node.attributes[i]);
      }
    }

    // Now that we know the size, overwrite that 0 with the end offset
    buffer.WriteU32(buffer.GetOffset(), start, 0);
  }

  static EncodeChildren(buffer, tag)
  {
    const start = buffer.GetOffset();

    // We don't know the size yet, so simply put a 0 for now
    buffer.WriteU32(0);

    const node = tag.GetNode();
    if (node.children)
    {
      for (let i = 0; i < node.children.length; i++)
      {
        const child = node.children[i];
        buffer.Write(child.tag ?? child);
      }
    }

    // Now that we know the size, overwrite that 0 with the end offset
    buffer.WriteU32(buffer.GetOffset(), start, 0); // 0 means don't advance the index
  }

  static Encode(buffer, tag)
  {
    console.log("Encoding", this.name);

    this.EncodeAttributes(buffer, tag);
    this.EncodeChildren(buffer, tag);
  }

  static DecodeAttribute(buffer, tag)
  {
    const name = buffer.Read();
    const value = buffer.Read();

    // Apply each attribute
    tag.Apply(name, [value]);
  }

  static DecodeAttributes(buffer, tag)
  {
    const end = buffer.ReadU32();
    while (end > buffer.GetOffset())
    {
      this.DecodeAttribute(buffer, tag);
    }
  }

  static DecodeChildren(buffer, tag)
  {
    const end = buffer.ReadU32();
    while (end > buffer.GetOffset())
    {
      const child = buffer.Read();
      tag.Apply("append_child", child);
    }
  }

  static Decode(buffer)
  {
    console.log("Decoding", this.name);
    const tag = new this();

    this.DecodeAttributes(buffer, tag);
    this.DecodeChildren(buffer, tag);

    return tag;
  }

  static GetMetaURL(){ return import.meta.url; }
  static GetSelectorSymbol(){ return SELECTOR; }

  static New(){ console.warn("Depreciate"); return new this(); }

  static get [Symbol.species](){ console.warn("Depreciate Symbol.species"); return this; }

  static [Symbol.toPrimitive](hint)
  {
    switch (hint)
    {
      case "string": return this.GetSymbol();
      default: return Object[Symbol.toPrimitive](hint);
    }
  }

  static CreateCode()
  {
    const url = new URL(this.GetMetaURL());

    const normalized = Environment.Normalize(url);

    return StringUtilities.HashCyrb32(normalized);
  }

  static CreateHash()
  {
    return "h" + this.CreateCode().toString(16);
  }

  static GetCode(){ return this[CODE] ??= this.CreateCode(); }
  static GetHash(){ return this[HASH] ??= this.CreateHash(); }

  CreatePositionHash(hashes = [], recursing)
  {
    hashes.push(this.constructor.GetHash());

    (this.GetPrevSibling() ?? this.GetParent())?.CreatePositionHash(hashes, true);
    return recursing ?? StringUtilities.HashCyrb32(hashes.join("")).toString(16);
  }

  GetHash(){ return this.constructor.GetHash(); }

  static UID(id = "")
  {
    const hash = this.GetHash();
    return `${id}_${hash}`;
  }

  UID(id){ return this.constructor.UID(id); }

  static GetNodeValueSymbol(){ return NODE_VALUE; }
  static GetEventSymbol(){ return EVENT; }
  static GetComputedStyleSymbol(){ return COMPUTED_STYLE; }
  static GetRecordSymbol(){ return RECORD; }

  static SetNodeValue(node, value){ node[NODE_VALUE] = value; return node; }
  static GetNodeValue(node){ return node[NODE_VALUE]; }

  static EscapeCharacter(c)
  {
    switch (c)
    {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "\"": return "&quot;";
      case "'": return "&#x27;";
      case "/": return "&#x2F;";
      default: return c;
    }
  }

  static Escape(string)
  {
    string = string.toString();

    let escaped = "";
    for (let i = 0; i < string.length; i++)
    {
      escaped += this.EscapeCharacter(string[i]);
    }

    return escaped;
  }

  static ToPixel(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}px`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToPercent(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}%`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToDegree(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}deg`;
      case "string": return v;
      case "undefined": return "";
      case "object": return this.ToDegree(v[0]);
    }
  }

  static ToTurn(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}turn`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToColor(v)
  {
    switch (typeof(v))
    {
      case "string": return v;
      case "object":
      {
        if (v.a) return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
        else return `rgb(${v.r}, ${v.g}, ${v.b})`;
      }
      case "undefined": return "";
    }
  }

  static ToScale(v)
  {
    switch (typeof(v))
    {
      case "number": return `scale(${v / 100})`;
      case "string": return `scale(${v})`;
      case "object": return `scale(${v.x}, ${v.y})`;
    }
  }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for most of these size values
  static GetSize(size)
  {
    switch (size)
    {
      case 0: return "0";
      case 1: return "0.25rem";
      case 2: return "0.5rem";
      case 3: return "0.75rem";
      case 4: return "1rem";
      case 5: return "1.25rem";
      case 6: return "1.5rem";
      case 7: return "1.75rem";
      case 8: return "2rem";
      case 9: return "2.25rem";
      case 10: return "2.5rem";
      case 11: return "2.75rem";
      case 12: return "3rem";
      case 13: return "3.25rem";
      case 14: return "3.5rem";
      case 15: return "3.75rem";
      case 16: return "4rem";
      case 17: return "4.25rem";
      case 18: return "4.5rem";
      case 19: return "4.75rem";
      case 20: return "5rem";
      case 21: return "5.25rem";
      case 22: return "5.5rem";
      case 23: return "5.75rem";
      case 24: return "6rem";
      case 25: return "6.25rem";
      case 26: return "6.5rem";
      case 27: return "6.75rem";
      case 28: return "7rem";
      case 29: return "7.25rem";
      case 30: return "7.5rem";
      case 31: return "7.75rem";
      case 32: return "8rem";
      case 33: return "8.25rem";
      case 34: return "8.5rem";
      case 35: return "8.75rem";
      case 36: return "9rem";
      case 37: return "9.25rem";
      case 38: return "9.5rem";
      case 39: return "9.75rem";
      case 40: return "10rem";
      case 41: return "10.25rem";
      case 42: return "10.5rem";
      case 43: return "10.75rem";
      case 44: return "11rem";
      case 45: return "11.25rem";
      case 46: return "11.5rem";
      case 47: return "11.75rem";
      case 48: return "12rem";
      case 49: return "12.25rem";
      case 50: return "12.5rem";
      case 51: return "12.75rem";
      case 52: return "13rem";
      case 53: return "13.25rem";
      case 54: return "13.5rem";
      case 55: return "13.75rem";
      case 56: return "14rem";
      case 57: return "14.25rem";
      case 58: return "14.5rem";
      case 59: return "14.75rem";
      case 60: return "15rem";
      case 61: return "15.25rem";
      case 62: return "15.5rem";
      case 63: return "15.75rem";
      case 64: return "16rem";
      case 65: return "16.25rem";
      case 66: return "16.5rem";
      case 67: return "16.75rem";
      case 68: return "17rem";
      case 69: return "17.25rem";
      case 70: return "17.5rem";
      case 71: return "17.75rem";
      case 72: return "18rem";
      case 73: return "18.25rem";
      case 74: return "18.5rem";
      case 75: return "18.75rem";
      case 76: return "19rem";
      case 77: return "19.25rem";
      case 78: return "19.5rem";
      case 79: return "19.75rem";
      case 80: return "20rem";
      case 81: return "20.25rem";
      case 82: return "20.5rem";
      case 83: return "20.75rem";
      case 84: return "21rem";
      case 85: return "21.25rem";
      case 86: return "21.5rem";
      case 87: return "21.75rem";
      case 88: return "22rem";
      case 89: return "22.25rem";
      case 90: return "22.5rem";
      case 91: return "22.75rem";
      case 92: return "23rem";
      case 93: return "23.25rem";
      case 94: return "23.5rem";
      case 95: return "23.75rem";
      case 96: return "24rem";
      case 1.2: return "50%";
      case 1.3: return "33.333333%";
      case 2.3: return "66.666667%";
      case 1.4: return "25%";
      case 2.4: return "50%";
      case 3.4: return "75%";
      case 1.5: return "20%";
      case 2.5: return "40%";
      case 3.5: return "60%";
      case 4.5: return "80%";
      case 1.6: return "16.666667%";
      case 2.6: return "33.333333%";
      case 3.6: return "50%";
      case 4.6: return "66.666667%";
      case 5.6: return "83.333333%";
      case 1.12: return "8.333333%";
      case 2.12: return "16.666667%";
      case 3.12: return "25%";
      case 4.12: return "33.333333%";
      case 5.12: return "41.666667%";
      case 6.12: return "50%";
      case 7.12: return "58.333333%";
      case 8.12: return "66.666667%";
      case 9.12: return "75%";
      case 10.12: return "83.333333%";
      case 11.12: return "91.666667%";
      case "half": return "50%";
      case "full": return "100%";
      case "auto": return "auto";
      case "xs": return "0.75rem";
      case "sm": return "0.875rem";
      case "base": return "1rem";
      case "lg": return "1.125rem";
      case "xl": return "1.25rem";
      case "xl2": return "1.5rem";
      case "xl3": return "1.875rem";
      case "xl4": return "2.25rem";
      case "xl5": return "3rem";
      case "xl6": return "4rem";
      default: return size;
    }
  }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for these shadows
  static GetShadowBase(){ return "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"; }
  static GetShadowMD(){ return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"; }
  static GetShadowLG(){ return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"; }
  static GetShadowXL(){ return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"; }
  static GetShadowXL2(){ return "0 25px 50px -12px rgba(0, 0, 0, 0.25)"; }
  static GetShadowInner(){ return "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"; }
  static GetShadowOutline(){ return "0 0 0 3px rgba(66, 153, 225, 0.5)"; }

  // NOTE: Credit to Bulma (https://bulma.io/) for these colors
  static GetWhite(){ return "white"; }
  static GetBlack(){ return "#0a0a0a"; }
  static GetLight(){ return "whitesmoke"; }
  static GetDark(){ return "#363636"; }
  static GetPrimary(){ return "#00d1b2"; }
  static GetInfo(){ return "#209cee"; }
  static GetLink(){ return "#344f79"; }
  static GetSuccess(){ return "#23d160"; }
  static GetWarning(){ return "#ffdd57"; }
  static GetDanger(){ return "#ff3860"; }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for these colors
  static GetGrey(){ return "#718096"; }
  static GetRed(){ return "#E53E3E"; }
  static GetOrange(){ return "#DD6B20"; }
  static GetYellow(){ return "#D69E2E"; }
  static GetGreen(){ return "#38A169"; }
  static GetTeal(){ return "#319795"; }
  static GetBlue(){ return "#3182CE"; }
  static GetIndigo(){ return "#5A67D8"; }
  static GetPurple(){ return "#805AD5"; }
  static GetPink(){ return "#D53F8C"; }

  static GetName(){ return this.name; }

  static GetElementNameSpace(){ return undefined; }
  static GetAttributeNameSpace(){ return undefined; }

  static CreateLocalName()
  {
    const name = StringUtilities.ToKebabCase(this.name);
    console.warn("Creating local name for", this.name, name);
    return name;
  }

  static GetLocalName(){ return NODE_NAMES[this.name] ??= this.CreateLocalName(); }

  Wait(timeout)
  {
    if (this.IsConnected())
    {
      // return Promise.resolve(this).catch(error =>
      // {
      //   console.warn("Wait error", error);
      // });
      return Promise.resolve(this);
    }
    else
    {
      return this.OnConnect(timeout);
      // .then((r) => r || this)
      // .catch(e => this.Error(e));
      // .catch(error =>
      // {
      //   console.warn("Wait error", error);
      // });
    }
  }

  CopyStyle(target)
  {
    const self_styles = this.GetStyles();
    const target_styles = target.GetStyles();
    for (let i = 0; i < target_styles.length; i++)
    {
      const key = target_styles[i];
      const value = target_styles.getPropertyValue(key);
      self_styles.setProperty(key, value);
    }

    return this;
  }

  CopyStyleText(target)
  {
    this.GetStyles().cssText = target.GetStylesText();

    return this;
  }

  CopyStyleText(target)
  {
    // this.GetStyles().cssText = target.GetStylesText();
    this.GetNode().style = target.GetStylesText();

    return this;
  }

  // get node(){ console.warn("Tag.node is depreciated. Use Tag.GetNode() instead."); return this.GetNode(); }

  toJSON()
  {
    const args = [];

    const value = this.Deconvert();
    if (value instanceof Base)
    {
      const node = this.GetNode();

      if (node.children.length > 0)
      {
        const children = [];
        for (let i = 0; i < node.children.length; i++)
        {
          const tag = this.Convert(node.children[i]);
          if (tag) children.push.apply(children, tag.toJSON());
        }

        args.push("children", children);
      }

      if (node.attributes)
      {
        for (let i = 0; i < node.attributes.length; i++)
        {
          const {name, call, value} = node.attributes[i];

          const array = call || [value];

          args.push(name, array);
        }
      }
    }
    else
    {
      args.push(value);
    }

    const json = [
      this.constructor.GetNodeName(),
      args,
    ];

    return json;
  }

  ToActions()
  {
    const actions = [];

    const node = this.GetNode();

    const attributes = node.attributes;
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        const attribute = attributes[i];
        const name = attribute.name;
        const value = this.constructor.GetNodeValue(attribute) ?? attribute.value ?? attribute.nodeValue;

        actions.push(name, [value]);
      }
    }

    if (node.children.length > 0)
    {
      const children = [];
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i])?.tag;
        if (tag) children.push.apply(children, tag.ToActions());
      }

      actions.push("children", children);
    }

    // return [
    //   this.GetLocalName(),
    //   actions,
    // ];

    return [
      "construct",
      [
        this.GetLocalName(),
        actions,
      ],
    ];
  }

  GenerateActions()
  {
    const actions = [];

    if (this.IsElementNode())
    {
      const attributes = this.GetAttributes();
      if (attributes)
      {
        for (let i = 0; i < attributes.length; i++)
        {
          const attribute = attributes[i];
          const value = this.constructor.GetNodeValue(attribute) ?? attribute.value ?? undefined;

          if (value !== undefined)
          {
            actions.push(attribute.name, [value]);
          }
          else
          {
            actions.push(attribute.name, []);
          }
        }
      }
    }

    const node = this.GetNode();
    for (let i = 0; i < node.childNodes.length; i++)
    {
      // const tag = this.GetChild(i);
      const child = node.childNodes[i].tag;
      if (child)
      {
        if (child.IsTextNode())
        {
          actions.push("text", [
            child.GetText(),
          ]);
        }
        else
        {
          actions.push("child", [
            child.GetLocalName() || child.GetNodeName(),
            child.GenerateActions(),
          ]);
        }
      }
      else
      {
        // actions.push("child", [
        //   child.localName || child.nodeName,
        //   [],
        // ]);
      }
    }

    return actions;
  }

  GenerateActions(node = this.GetNode())
  {
    const actions = [];

    if (node instanceof window.Text)
    {
      actions.push("text", [node.textContent]);
    }
    else
    {
      const attributes = node.attributes;
      if (attributes)
      {
        for (let i = 0; i < attributes.length; i++)
        {
          const attribute = attributes[i];
          const value = this.constructor.GetNodeValue(attribute) ?? attribute.value ?? undefined;

          if (value !== undefined)
          {
            actions.push(attribute.name, [value]);
          }
          else
          {
            actions.push(attribute.name, []);
          }
        }
      }

      for (let i = 0; i < node.childNodes.length; i++)
      {
        const child = node.childNodes[i];

        if (child instanceof window.Text)
        {
          actions.push("text", [child.textContent]);
        }
        else
        {
          actions.push("child", [
            child.localName || child.nodeName,
            this.GenerateActions(child),
          ]);
        }
      }
    }

    return actions;
  }

  Set(key, value)
  {
    this[key] = value;
    return this;
  }

  toString(){ return this.GetOuterHTML(); }
  valueOf(){ return this.GetNode(); } // TODO: valueOf instead of Tag.Deconvert?

  FireEvent(event, value, default_fn, bubbles = false, cancelable = true)
  {
    // const name = event;
    if (typeof(event) === "string")
    {
      event = new window.Event(event, { bubbles, cancelable, });
    }
    else if (event instanceof Base)
    {
      event = event.GetEvent();
      // console.log("Firing event", event);
    }
    // else if (event instanceof window.Event)
    // {
    //   // event = event.GetEvent();
    // }

    if (!event.hasOwnProperty("value"))
    {
      event.value = value;
    }

    if (!event.hasOwnProperty("tag"))
    {
      event.tag = this;
    }

    try
    {
      this.GetNode().dispatchEvent(event);
      // console.log("Dispatching event", event);
      // console.log("Done dispatching event", event.defaultPrevented);

      if (!event.defaultPrevented && typeof(default_fn) === "function")
      {
        default_fn.call(this, event);
      }
    }
    catch (error)
    {
      console.error("Event error!", error);
    }

    return event;
  }

  AddEventListener(name, fn, options, node = this.GetNode())
  {
    switch (typeof(fn))
    {
      case "function": // A regular event listener
      {
        if (!options) options = {};

        let timeout_id;
        const handler = (event) =>
        {
          if (options && options.pd) event.preventDefault();

          if (timeout_id)
          {
            clearTimeout(timeout_id);
            timeout_id = undefined;
          }

          try
          {
            if (options.capture !== true)
            {
              fn.call(this, event);
            }
            else
            {
              fn.call(this, event);
            }
          }
          catch (error)
          {
            console.error(`Error in ${name} event handler:`, error);
          }
        }

        if (typeof(options.timeout) === "number")
        {
          timeout_id = setTimeout(() =>
          {
            node.removeEventListener(name, handler);
            throw new Error(`Event "${name}" timed out after ${options.timeout} milliseconds`);
          }, options.timeout);
        }

        node.addEventListener(name, handler, options);
        return this;
      }
      case "number": // Treat the fn as a timeout in milliseconds for a promise listener
      {
        if (options) options.timeout = fn;
        else options = { timeout: fn };

        return this.AddEventListener(name, undefined, options, node);
      }
      case "object": // Treat the fn as the options object for a promise listener
      {
        return this.AddEventListener(name, undefined, fn, node);
      }
      default: // A one time promise listener
      {
        if (!options) options = {};
        options.once = true; // Should always be one time use

        // Promise events prevent default as their normal behavior, which
        // can be disabled by passing { pd: false }
        if (!options.hasOwnProperty("pd"))
        {
          options.pd = true;
        }

        return new Promise((resolve, reject) =>
        {
          this.GetNode().addEventListener(name, event =>
          {
            resolve(this);
          }, options);

          // this.AddEventListener(name, function(event)
          // {
          //   // const wrapper = this.ConvertEvent(event);
          //   const wrapper = event[EVENT];
          //   wrapper.Wait().then(resolve).catch(reject);
          // }, options, node);
        });
      }
    }
  }

  RemoveEventListener(name, handler, options)
  {
    if (name instanceof window.Event)
    {
      const wrapper = this.ConvertEvent(name);

      name = name.type;
      handler = wrapper.GetHandler();
      options = wrapper.GetOptions();
    }

    this.GetNode().removeEventListener(name, handler, options);
    return this;
  }

  OnKey(code, fn, opts)
  {
    const handler = (event) =>
    {
      if (!this.IsInDocument())
      {
        document.removeEventListener("keydown", handler);
        return;
      }

      if (code === event.keyCode)
      {
        event.tag = this;
        return fn(event);
      }
    };

    return this.AddEventListener("keydown", handler, opts, document);
  }

  OnKeyDown(code, fn, opts)
  {
    const handler = (event) =>
    {
      if (!this.IsInDocument())
      {
        document.removeEventListener("keydown", handler);
        return;
      }

      if (code === event.keyCode)
      {
        event.tag = this;
        return fn(event);
      }
    };

    return this.AddEventListener("keydown", handler, opts, document);
  }

  OnKeyPress(code, fn, opts)
  {
    const handler = (event) =>
    {
      if (!this.IsInDocument())
      {
        document.removeEventListener("keypress", handler);
        return;
      }

      if (code === event.keyCode)
      {
        event.tag = this;
        return fn(event);
      }
    };

    return this.AddEventListener("keypress", handler, opts, document);
  }

  OnKeyUp(code, fn, opts)
  {
    const handler = (event) =>
    {
      if (!this.IsInDocument())
      {
        document.removeEventListener("keyup", handler);
        return;
      }

      if (code === event.keyCode)
      {
        event.tag = this;
        return fn(event);
      }
    };

    return this.AddEventListener("keyup", handler, opts, document);
  }

  // Called by the "children" instruction
  Children(...children)
  {
    for (let i = 0; i < children.length; i += 2)
    {
      const action = children[i + 0];
      const args   = children[i + 1];

      const child = this.Apply(action, args);
      if (child) this.Add(child);
    }

    return this;
  }

  Expiration(date)
  {
    if (typeof(date) === "number")
    {
      date = new global.Date(global.Date.now() + date);
    }

    global.setTimeout(() =>
    {
      if (this.HasAttribute("expiration") && this.IsInDocument())
      {
        const expiration = global.Number(this.GetAttribute("expiration"));
        if (expiration === date.getTime())
        {
          this.RemoveAttribute("expiration");
          this.Remove();
        }
      }
    }, date.getTime() - global.Date.now());

    return this.SetAttribute("expiration", date.getTime());
  }

  // WARNING: May be dangerous, don't let this live without testing...
  UntrustedStyle(value)
  {
    // console.log("~~Untrusted Style", value);
    const temp = window.document.createElement("div");
    temp.style = value;

    const styles = temp.style;
    for (let i = 0; i < styles.length; i++)
    {
      const name = styles.item(i);
      const value = styles.getPropertyValue(name);
      const priority = styles.getPropertyPriority(name);
      const fn = this.constructor.prototype[StringUtilities.FromKebabCase(name)];

      if (typeof(fn) === "function")
      {
        // console.log("Applying style", name, value, fn);
        fn.call(this, value, !!priority);
      }
      else
      {
        // this.Warn("Unknown style", name);
        console.warn("Unknown style", name);
      }
    }

    return this;
  }

  UntrustedStyle(value, error)
  {
    console.log("~~Untrusted Style", value);

    const temp = window.document.createElement("div");
    temp.style = value;

    const styles = temp.style;
    for (let i = 0; i < styles.length; i++)
    {
      const name = styles.item(i);
      const value = styles.getPropertyValue(name);
      const priority = styles.getPropertyPriority(name);

      this.Apply(name, [value, !!priority], error);
    }

    return this;
  }

  ApplyEach(actions)
  {
    let result = this;

    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const args   = actions[i + 1];

      result = result.Apply(action, args);
    }

    return result;
  }

  async ApplyEachAsync(actions)
  {
    let result = this;
    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const args   = actions[i + 1];

      result = await result.Apply(action, args);
    }

    return result;
  }

  Construct(type, args)
  {
    // console.log("Calling Tag.Construct", type);
    const ctor = this.constructor.GetType(type);
    if (!ctor) throw new Error(`Unknown constructor for type "${type}"`);

    return new ctor(args);
  }

  Target(selector, args)
  {
    let target;
    if (typeof(selector) === "string")
    {
      target = this.Query(selector);
      if (!target) throw new Error(`Failed to target a child of the owner with selector "${selector}"`);

      // This check should never actually pass, because of how querySelector works
      // but it's here for redundancy since it could be a security risk if a non-child were selected
      if (!this.Contains(target)) throw new Error(`Target is not a child of the tag`);
    }

    return target.Apply.apply(target, args);
  }

  async TargetAsync(selector, args)
  {
    let target;
    if (typeof(selector) === "string")
    {
      target = await this.QueryAsync(selector);
      if (!target) throw new Error(`Failed to target a child of the owner with selector "${selector}"`);

      // This check should never actually pass, because of how querySelector works
      // but it's here for redundancy since it would be a security risk if a non-child were selected
      if (!this.Contains(target)) throw new Error(`Target is not a child of the tag`);
    }

    console.log("TargetAsync", selector, target);
    return target.Apply.apply(target, args);
  }

  ["+"](right){ return this.GetValue() + right.GetValue(); }
  ["-"](right){ return this.GetValue() - right.GetValue(); }
  ["*"](right){ return this.GetValue() * right.GetValue(); }
  ["/"](right){ return this.GetValue() / right.GetValue(); }
  ["%"](right){ return this.GetValue() % right.GetValue(); }
  ["**"](right){ return this.GetValue() ** right.GetValue(); }

  ["+="](right){ return this.SetValue(this.GetValue() + right.GetValue()); }
  ["-="](right){ return this.SetValue(this.GetValue() - right.GetValue()); }
  ["*="](right){ return this.SetValue(this.GetValue() * right.GetValue()); }
  ["/="](right){ return this.SetValue(this.GetValue() / right.GetValue()); }
  ["%="](right){ return this.SetValue(this.GetValue() % right.GetValue()); }
  ["**="](right){ return this.SetValue(this.GetValue() ** right.GetValue()); }
  ["&&="](right){ return this.SetValue(this.GetValue() && right.GetValue()); }
  ["||="](right){ return this.SetValue(this.GetValue() || right.GetValue()); }
  ["??="](right){ return this.SetValue(this.GetValue() ?? right.GetValue()); }

  // ["++"](){ return this.SetValue(this.GetValue()++); }
  // ["--"](){ return this.SetValue(this.GetValue()--); }
  ["!"](){ return !this.GetValue(); }
  ["!!"](){ return !!this.GetValue(); }
  ["typeof"](){ return typeof(this.GetValue()); }

  [">"](right){ return this.GetValue() > right.GetValue(); }
  ["<"](right){ return this.GetValue() < right.GetValue(); }
  ["==="](right){ return this.GetValue() === right.GetValue(); }
  ["=="](right){ return this.GetValue() == right.GetValue(); }
  ["!="](right){ return this.GetValue() != right.GetValue(); }
  ["!=="](right){ return this.GetValue() !== right.GetValue(); }
  [">="](right){ return this.GetValue() >= right.GetValue(); }
  ["<="](right){ return this.GetValue() <= right.GetValue(); }
  ["?"](middle, right){ return this.GetValue() ? middle.GetValue() : right.GetValue(); }

  Child(name, actions)
  {
    if (typeof(name) !== "string")
    {
      throw new Error(`Tag.Child expected its first parameter to be a string`);
    }

    if (!(actions instanceof global.Array))
    {
      throw new Error(`Tag.Child expected its second parameter to be an array`);
    }

    // Create a node that has the actions array as its NODE_VALUE
    const node = this.constructor.CreateElement(name, undefined, undefined);
    node[ACTIONS] = actions;

    // Add it as a child
    this.AppendChild(node);

    return this;
  }

  Apply(action, args, error = true)
  {
    switch (action)
    {
      case "append_child": return this.AppendChild.apply(this, args);
      // case "add": return this.Add.apply(this, args);
      case "child": return this.Child(...args);
      case "clear": return this.Clear(...args);
      case "add_class": return this.AddClass(...args);
      case "remove_class": return this.RemoveClass(...args);
      case "toggle_class": return this.ToggleClass(...args);

      case "+": return this["+"].apply(this, args);
      case "-": return this["-"].apply(this, args);
      case "*": return this["*"].apply(this, args);
      case "/": return this["/"].apply(this, args);
      case "%": return this["%"].apply(this, args);
      case "**": return this["**"].apply(this, args);

      case "+=": return this["+="].apply(this, args);
      case "-=": return this["-="].apply(this, args);
      case "*=": return this["*="].apply(this, args);
      case "/=": return this["/="].apply(this, args);
      case "%=": return this["%="].apply(this, args);
      case "**=": return this["**="].apply(this, args);
      case "&&=": return this["&&="].apply(this, args);
      case "||=": return this["||="].apply(this, args);
      case "??=": return this["??="].apply(this, args);

      case ">": return this[">"].apply(this, args);
      case "<": return this["<"].apply(this, args);
      case "===": return this["==="].apply(this, args);
      case "==": return this["=="].apply(this, args);
      case "!=": return this["!="].apply(this, args);
      case "!==": return this["!=="].apply(this, args);
      case ">=": return this[">="].apply(this, args);
      case "<=": return this["<="].apply(this, args);
      case "?": return this["?"].apply(this, args);

      case "++": return this["++"].apply(this, args);
      case "--": return this["--"].apply(this, args);
      case "!": return this["!"].apply(this, args);
      case "!!": return this["!!"].apply(this, args);
      case "typeof": return this["typeof"].apply(this, args);

      case "data-name": return this.SetAttribute("data-name", ...args);
      case "xmlns:xlink": return this.SetAttribute("xmlns:xlink", ...args);
      case "xlink:href": return this.SetAttribute("xlink:href", ...args);
      case "fill": return this.SetAttribute("fill", ...args);
      case "r": return this.SetAttribute("r", ...args);
      case "cy": return this.SetAttribute("cy", ...args);
      case "cx": return this.SetAttribute("cx", ...args);
      case "ry": return this.SetAttribute("ry", ...args);
      case "rx": return this.SetAttribute("rx", ...args);
      case "y": return this.SetAttribute("y", ...args);
      case "y1": return this.SetAttribute("y1", ...args);
      case "y2": return this.SetAttribute("y2", ...args);
      case "x": return this.SetAttribute("x", ...args);
      case "x1": return this.SetAttribute("x1", ...args);
      case "x2": return this.SetAttribute("x2", ...args);
      case "opacity": return this.Opacity.apply(this, args);
      // case "opacity": return this.SetAttribute("opacity", ...args);
      case "points": return this.SetAttribute("points", ...args);
      case "transform": return this.SetAttribute("transform", ...args);
      case "stroke-width": return this.SetAttribute("stroke-width", ...args);
      case "stroke-miterlimit": return this.SetAttribute("stroke-miterlimit", ...args);
      case "stroke": return this.SetAttribute("stroke", ...args);
      case "gradientTransform": return this.SetAttribute("gradientTransform", ...args);
      case "gradientUnits": return this.SetAttribute("gradientUnits", ...args);
      case "stop-opacity": return this.SetAttribute("stop-opacity", ...args);
      case "stop-color": return this.SetAttribute("stop-color", ...args);
      case "stop-offset": return this.SetAttribute("stop-offset", ...args);
      case "offset": return this.SetAttribute("offset", ...args);
      case "override": return this.Override.apply(this, args);
      case "construct": return this.Construct.apply(this, args);
      case "slot": return this.Slot.apply(this, args);
      case "target": return this.Target.apply(this, args);
      case "target_async": return this.TargetAsync.apply(this, args);
      case "children": return this.Children.apply(this, args);
      case "text": return this.Text.apply(this, args);
      case "expiration": return this.Expiration.apply(this, args);
      case "style": return this.Style.apply(this, args);
      // case "style": return this.UntrustedStyle(...args, error);
      case "class": return this.Class.apply(this, args);
      case "is": return this.Is.apply(this, args);
      case "id": return this.ID.apply(this, args);
      case "lang": return this.Lang.apply(this, args);
      case "charset": return this.CharSet.apply(this, args);
      case "name": return this.Name.apply(this, args);
      case "placeholder": return this.Placeholder.apply(this, args);
      // case "place": return this.Place.apply(this, args);
      // case "mode": return this.Mode.apply(this, args);
      case "value": return this.Value.apply(this, args);
      case "href": return this.HRef.apply(this, args);
      case "xmlns": return this.XMLNS.apply(this, args);
      case "viewBox": return this.ViewBox.apply(this, args);
      case "d": return this.D.apply(this, args);
      case "src": return this.Src.apply(this, args);
      case "rel": return this.Rel.apply(this, args);
      case "step": return this.Step.apply(this, args);
      case "sizes": return this.Sizes.apply(this, args);
      case "color": return this.Color.apply(this, args);
      case "role": return this.Role.apply(this, args);
      case "type": return this.Type.apply(this, args);
      case "alt": return this.Alt.apply(this, args);
      case "min": return this.Min.apply(this, args);
      case "max": return this.Max.apply(this, args);
      case "for": return this.For.apply(this, args);
      case "tabindex": return this.TabIndex.apply(this, args);
      case "part": return this.Part.apply(this, args);
      case "download": return this.Download.apply(this, args);
      case "method": return this.Method.apply(this, args);
      case "action": return this.Action.apply(this, args);
      case "width": return this.WidthAtt.apply(this, args);
      case "height": return this.HeightAtt.apply(this, args);
      case "title": return this.Title.apply(this, args);
      case "crossorigin": return this.CrossOrigin.apply(this, args);
      case "preload": return this.Preload.apply(this, args);
      case "playsinline": return this.PlaysInline.apply(this, args);
      case "autoplay": return this.AutoPlay.apply(this, args);
      case "muted": return this.Muted.apply(this, args);
      case "loop": return this.Loop.apply(this, args);
      case "poster": return this.Poster.apply(this, args);
      case "frameborder": return this.FrameBorder.apply(this, args);
      case "allow": return this.Allow.apply(this, args);
      case "allowfullscreen": return this.AllowFullScreen.apply(this, args);
      case "allowtransparency": return this.AllowTransparency.apply(this, args);
      case "rows": return this.Rows.apply(this, args);
      case "cols": return this.Cols.apply(this, args);
      case "integrity": return this.Integrity.apply(this, args);
      case "content": return this.Content.apply(this, args);
      case "all": return this.All.apply(this, args);
      case "contenteditable": return this.ContentEditable.apply(this, args);
      case "checked": return this.Checked.apply(this, args);
      case "disabled": return this.Disabled.apply(this, args);
      case "draggable": return this.Draggable.apply(this, args);
      case "controls": return this.Controls.apply(this, args);
      case "readonly": return this.ReadOnly.apply(this, args);
      case "autocomplete": return this.AutoComplete.apply(this, args);
      case "selected": return this.Selected.apply(this, args);
      case "required": return this.Required.apply(this, args);
      case "novalidate": return this.NoValidate.apply(this, args);
      case "nomodule": return this.NoModule.apply(this, args);
      case "multiple": return this.Multiple.apply(this, args);
      case "code": return this.Code.apply(this, args);
      case "aria-atomic": return this.AriaAtomic.apply(this, args);
      case "aria-busy": return this.AriaBusy.apply(this, args);
      case "aria-controls": return this.AriaControls.apply(this, args);
      case "aria-current": return this.AriaCurrent.apply(this, args);
      case "aria-describedby": return this.AriaDescribedBy.apply(this, args);
      case "aria-details": return this.AriaDetails.apply(this, args);
      case "aria-disabled": return this.AriaDisabled.apply(this, args);
      case "aria-dropeffect": return this.AriaDropEffect.apply(this, args);
      case "aria-errormessage": return this.AriaErrorMessage.apply(this, args);
      case "aria-expanded": return this.AriaExpanded.apply(this, args);
      case "aria-flowto": return this.AriaFlowto.apply(this, args);
      case "aria-grabbed": return this.AriaGrabbed.apply(this, args);
      case "aria-haspopup": return this.AriaHasPopUp.apply(this, args);
      case "aria-hidden": return this.AriaHidden.apply(this, args);
      case "aria-invalid": return this.AriaInvalid.apply(this, args);
      case "aria-keyshortcuts": return this.AriaKeyShortcuts.apply(this, args);
      case "aria-label": return this.AriaLabel.apply(this, args);
      case "aria-labelledby": return this.AriaLabelledBy.apply(this, args);
      case "aria-level": return this.AriaLevel.apply(this, args);
      case "aria-live": return this.AriaLive.apply(this, args);
      case "aria-owns": return this.AriaOwns.apply(this, args);
      case "aria-pressed": return this.AriaPressed.apply(this, args);
      case "aria-relevant": return this.AriaRelevant.apply(this, args);
      case "aria-roledescription": return this.AriaRoleDescription.apply(this, args);
      case "aria-treeitem": return this.AriaTreeItem.apply(this, args);
      case "aria-valuemin": return this.AriaValueMin.apply(this, args);
      case "aria-valuenow": return this.AriaValueNow.apply(this, args);
      case "aria-valuemax": return this.AriaValueMax.apply(this, args);

      case "animation": return this.Animation.apply(this, args);
      case "appearance": return this.AppearanceDefault.apply(this, args);
      case "-webkit-appearance": return this.AppearanceWebkit.apply(this, args);
      case "-moz-appearance": return this.AppearanceMoz.apply(this, args);
      case "color": return this.Color.apply(this, args);
      case "align-items": return this.AlignItems.apply(this, args);
      case "align-self": return this.AlignSelf.apply(this, args);
      case "place-self": return this.PlaceSelf.apply(this, args);
      case "align-content": return this.AlignContent.apply(this, args);
      case "justify-content": return this.JustifyContent.apply(this, args);
      case "place-content": return this.PlaceContent.apply(this, args);
      case "justify-items": return this.JustifyItems.apply(this, args);
      case "place-items": return this.PlaceItems.apply(this, args);
      case "justify-self": return this.JustifySelf.apply(this, args);
      case "background": return this.Background.apply(this, args);
      case "background-attachment": return this.BackgroundAttachment.apply(this, args);
      case "background-image": return this.BackgroundClip.apply(this, args);
      case "background-color": return this.BackgroundColor.apply(this, args);
      case "background-image": return this.BackgroundImage.apply(this, args);
      case "background-position": return this.BackgroundPosition.apply(this, args);
      case "background-repeat": return this.BackgroundRepeat.apply(this, args);
      case "background-origin": return this.BackgroundOrigin.apply(this, args);
      case "background-size": return this.BackgroundSize.apply(this, args);
      case "box-shadow": return this.BackgroundShadow.apply(this, args);
      case "box-sizing": return this.BoxSizing.apply(this, args);
      case "box-shadow": return this.BoxShadow.apply(this, args);
      case "border": return this.Border.apply(this, args);
      case "border-width": return this.BorderWidth.apply(this, args);
      case "border-style": return this.BorderStyle.apply(this, args);
      case "border-color": return this.BorderColor.apply(this, args);
      case "border-image": return this.BorderImage.apply(this, args);
      case "border-radius": return this.BorderRadius.apply(this, args);
      case "border-top-left-radius": return this.BorderTopLeftRadius.apply(this, args);
      case "border-top-right-radius": return this.BorderTopRightRadius.apply(this, args);
      case "border-bottom-left-radius": return this.BorderBottomLeftRadius.apply(this, args);
      case "border-bottom-right-radius": return this.BorderBottomRightRadius.apply(this, args);
      case "border-width": return this.BorderWidth.apply(this, args);
      case "border-left-width": return this.BorderLeftWidth.apply(this, args);
      case "border-right-width": return this.BorderRightWidth.apply(this, args);
      case "border-top-width": return this.BorderTopWidth.apply(this, args);
      case "border-bottom-width": return this.BorderBottomWidth.apply(this, args);
      case "border-left": return this.BorderLeft.apply(this, args);
      case "border-right": return this.BorderRight.apply(this, args);
      case "border-top": return this.BorderTop.apply(this, args);
      case "border-bottom": return this.BorderBottom.apply(this, args);
      case "border-bottom-style": return this.BorderBottomStyle.apply(this, args);
      case "border-bottom-color": return this.BorderBottomColor.apply(this, args);
      case "border-top-style": return this.BorderTopStyle.apply(this, args);
      case "border-top-color": return this.BorderTopColor.apply(this, args);
      case "border-right-style": return this.BorderRightStyle.apply(this, args);
      case "border-right-color": return this.BorderRightColor.apply(this, args);
      case "border-left-style": return this.BorderLeftStyle.apply(this, args);
      case "border-left-color": return this.BorderLeftColor.apply(this, args);
      case "cursor": return this.Cursor.apply(this, args);
      case "display": return this.Display.apply(this, args);
      case "flex": return this.Flex.apply(this, args);
      case "flex-basis": return this.FlexBasis.apply(this, args);
      case "flex-direction": return this.FlexDirection.apply(this, args);
      case "flex-flow": return this.FlexFlow.apply(this, args);
      case "flex-grow": return this.FlexGrow.apply(this, args);
      case "flex-shrink": return this.FlexShrink.apply(this, args);
      case "flex-wrap": return this.FlexWrap.apply(this, args);
      case "float": return this.Float.apply(this, args);
      case "grid": return this.Grid.apply(this, args);
      case "grid-area": return this.GridArea.apply(this, args);
      case "grid-auto-columns": return this.GridAutoColumns.apply(this, args);
      case "grid-auto-flow": return this.GridAutoFlow.apply(this, args);
      case "grid-auto-rows": return this.GridAutoRows.apply(this, args);
      case "grid-column": return this.GridColumn.apply(this, args);
      case "grid-column-start": return this.GridColumnStart.apply(this, args);
      case "grid-column-end": return this.GridColumnEnd.apply(this, args);
      case "grid-row": return this.GridRow.apply(this, args);
      case "grid-row-start": return this.GridRowStart.apply(this, args);
      case "grid-row-end": return this.GridRowEnd.apply(this, args);
      case "grid-template": return this.GridTemplate.apply(this, args);
      case "grid-template-columns": return this.GridTemplateColumns.apply(this, args);
      case "grid-template-rows": return this.GridTemplateRows.apply(this, args);
      case "grid-column-gap": return this.GridColumnGap.apply(this, args);
      case "grid-row-gap": return this.GridRowGap.apply(this, args);
      case "grid-template-areas": return this.GridTemplateAreas.apply(this, args);
      case "image-orientation": return this.ImageOrientation.apply(this, args);
      case "image-rendering": return this.ImageRendering.apply(this, args);
      case "margin": return this.Margin.apply(this, args);
      case "margin-left": return this.MarginLeft.apply(this, args);
      case "margin-right": return this.MarginRight.apply(this, args);
      case "margin-top": return this.MarginTop.apply(this, args);
      case "margin-bottom": return this.MarginBottom.apply(this, args);
      case "width": return this.Width.apply(this, args);
      case "height": return this.Height.apply(this, args);
      case "max-width": return this.MaxWidth.apply(this, args);
      case "max-height": return this.MaxHeight.apply(this, args);
      case "min-width": return this.MinWidth.apply(this, args);
      case "min-height": return this.MinHeight.apply(this, args);
      case "top": return this.Top.apply(this, args);
      case "bottom": return this.Bottom.apply(this, args);
      case "left": return this.Left.apply(this, args);
      case "right": return this.Right.apply(this, args);
      case "fill": return this.Fill.apply(this, args);
      case "stroke": return this.Stroke.apply(this, args);
      case "stroke-width": return this.StrokeWidth.apply(this, args);
      case "order": return this.Order.apply(this, args);
      case "outline": return this.Outline.apply(this, args);
      case "outline-color": return this.OutlineColor.apply(this, args);
      case "outline-offset": return this.OutlineOffset.apply(this, args);
      case "outline-style": return this.OutlineStyle.apply(this, args);
      case "outline-width": return this.OutlineWidth.apply(this, args);
      case "overflow": return this.Overflow.apply(this, args);
      case "overflow-wrap": return this.OverflowWrap.apply(this, args);
      case "overflow-x": return this.OverflowX.apply(this, args);
      case "overflow-y": return this.OverflowY.apply(this, args);
      case "opacity": return this.Opacity.apply(this, args);
      case "object-fit": return this.ObjectFit.apply(this, args);
      case "padding": return this.Padding.apply(this, args);
      case "padding-left": return this.PaddingLeft.apply(this, args);
      case "padding-right": return this.PaddingRight.apply(this, args);
      case "padding-top": return this.PaddingTop.apply(this, args);
      case "padding-bottom": return this.PaddingBottom.apply(this, args);
      case "position": return this.Position.apply(this, args);
      case "pointer-events": return this.PointerEvents.apply(this, args);
      case "tab-size": return this.TabSize.apply(this, args);
      case "table-layout": return this.TableLayout.apply(this, args);
      case "text-size-adjust": return this.TextSizeAdjust.apply(this, args);
      case "font-family": return this.FontFamily.apply(this, args);
      case "font-weight": return this.FontWeight.apply(this, args);
      case "font-variant-ligatures": return this.FontVariantLigatures.apply(this, args);
      case "font-variant-caps": return this.FontVariantCaps.apply(this, args);
      case "font-variant-numeric": return this.FontVariantNumeric.apply(this, args);
      case "font-variant-east-asian": return this.FontVariantEastAsian.apply(this, args);
      case "font-stretch": return this.FontStretch.apply(this, args);
      case "vertical-align": return this.VerticalAlign.apply(this, args);
      case "-webkit-appearance": return this.WebkitAppearance.apply(this, args);
      case "user-select": return this.UserSelect.apply(this, args);
      case "border-image-source": return this.BorderImageSource.apply(this, args);
      case "border-image-slice": return this.BorderImageSlice.apply(this, args);
      case "border-image-outset": return this.BorderImageOutset.apply(this, args);
      case "border-image-width": return this.BorderImageWidth.apply(this, args);
      case "border-image-repeat": return this.BorderImageRepeat.apply(this, args);
      case "animation-duration": return this.AnimationDuration.apply(this, args);
      case "animation-timing-function": return this.AnimationTimingFunction.apply(this, args);
      case "animation-delay": return this.AnimationDelay.apply(this, args);
      case "animation-iteration-count": return this.AnimationIterationCount.apply(this, args);
      case "animation-direction": return this.AnimationDirection.apply(this, args);
      case "animation-fill-mode": return this.AnimationFillMode.apply(this, args);
      case "animation-play-state": return this.AnimationPlayState.apply(this, args);
      case "animation-name": return this.AnimationName.apply(this, args);
      case "list-style-property": return this.ListStyleProperty.apply(this, args);
      case "list-style-position": return this.ListStylePosition.apply(this, args);
      case "list-style-image": return this.ListStyleImage.apply(this, args);
      case "list-style-type": return this.ListStyleType.apply(this, args);
      case "border-collapse": return this.BorderCollapse.apply(this, args);
      case "-webkit-border-horizontal-spacing": return this.WebkitBorderHorizontalSpacing.apply(this, args);
      case "-webkit-border-vertical-spacing": return this.WebkitBorderVerticalSpacing.apply(this, args);
      case "-webkit-font-smoothing": return this.WebkitFontSmoothing.apply(this, args);
      case "clip": return this.Clip.apply(this, args);
      case "--columnGap": return this.ColumnGap.apply(this, args);
      case "column-gap": return this.ColumnGap.apply(this, args);
      case "background-position-x": return this.BackgroundPositionX.apply(this, args);
      case "background-position-y": return this.BackgroundPositionY.apply(this, args);
      case "background-repeat-x": return this.BackgroundRepeatX.apply(this, args);
      case "background-repeat-y": return this.BackgroundRepeatY.apply(this, args);
      case "transition": return this.Transition.apply(this, args);
      case "transition-delay": return this.TransitionDelay.apply(this, args);
      case "transition-duration": return this.TransitionDuration.apply(this, args);
      case "transition-property": return this.TransitionProperty.apply(this, args);
      case "transition-timing-function": return this.TransitionTimingFunction.apply(this, args);
      case "transform": return this.Transform.apply(this, args);
      case "transform-origin": return this.TransformOrigin.apply(this, args);
      case "transform-origin-left": return this.TransformOriginLeft.apply(this, args);
      case "transform-origin-right": return this.TransformOriginRight.apply(this, args);
      case "translate": return this.Translate.apply(this, args);
      case "turn": return this.Turn.apply(this, args);
      case "rotate": return this.Rotate.apply(this, args);
      case "scale": return this.Scale.apply(this, args);
      case "will-change": return this.WillChange.apply(this, args);
      case "visibility": return this.Visibility.apply(this, args);
      case "white-space": return this.WhiteSpace.apply(this, args);
      case "word-break": return this.WordBreak.apply(this, args);
      case "word-spacing": return this.WordSpacing.apply(this, args);
      case "word-wrap": return this.WordWrap.apply(this, args);
      case "z-index": return this.ZIndex.apply(this, args);
      case "font": return this.Font.apply(this, args);
      case "font-stretch": return this.FontStretch.apply(this, args);
      case "font-variant": return this.FontVariant.apply(this, args);
      case "letter-spacing": return this.LetterSpacing.apply(this, args);
      case "text-decoration": return this.TextDecoration.apply(this, args);
      case "text-decoration-color": return this.TextDecorationColor.apply(this, args);
      case "text-decoration-thickness": return this.TextDecorationThickness.apply(this, args);
      case "text-decoration-line": return this.TextDecorationLine.apply(this, args);
      case "text-decoration-style": return this.TextDecorationStyle.apply(this, args);
      case "text-emphasis": return this.TextEmphasis.apply(this, args);
      case "text-emphasis-color": return this.TextEmphasisColor.apply(this, args);
      case "text-emphasis-position": return this.TextEmphasisPosition.apply(this, args);
      case "text-emphasis-style": return this.TextEmphasisStyle.apply(this, args);
      case "text-indent": return this.TextIndent.apply(this, args);
      case "text-justify": return this.TextJustify.apply(this, args);
      case "text-orientation": return this.TextOrientation.apply(this, args);
      case "text-overflow": return this.TextOverflow.apply(this, args);
      case "text-rendering": return this.TextRendering.apply(this, args);
      case "text-shadow": return this.TextShadow.apply(this, args);
      case "text-underline-offset": return this.TextUnderlineOffset.apply(this, args);
      case "text-underline-position": return this.TextUnderlinePosition.apply(this, args);
      case "text-smoothing": return this.TextSmoothing.apply(this, args);
      case "font-size": return this.FontSize.apply(this, args);
      case "line-break": return this.LineBreak.apply(this, args);
      case "line-height": return this.LineHeight.apply(this, args);
      case "user-select": return this.UserSelect.apply(this, args);
      case "text-align": return this.TextAlign.apply(this, args);
      case "text-transform": return this.TextTransform.apply(this, args);
      case "font-style": return this.FontStyle.apply(this, args);
      case "color": return this.Color.apply(this, args);
      case "resize": return this.Resize.apply(this, args);
      case "list-style-type": return this.ListStyleType.apply(this, args);
      case "content": return this.Content.apply(this, args);

      default:
      {
        if (error === true)
        {
          throw new Error(`Tag "${this.constructor.name}" failed to apply unknown action "${action}"`);
        }
        else
        {
          console.warn(`Unknown ${this.constructor.name}.Apply`, action, args);
          return undefined;
        }
      }
    }
  }

  ApplyAttribute(name, value)
  {
    return this.Apply(name, [value]);
  }

  ApplyChildNode(child)
  {
    return this.ApplyNode(child);
  }

  Inject(selector)
  {
    PromiseHelper.Loaded().then(() =>
    {
      const target = this.constructor.Query(selector);
      if (target)
      {
        target.AppendChild(this);
      }
      else
      {
        this.Throw(new Error(`Tag ${this.constructor.name}.Inject failed to select "${selector}"`));
      }
    });

    return this;
  }

  [Symbol.toPrimitive](hint)
  {
    const value = this.GetValue();
    switch (hint)
    {
      case "number": return Number(value);
      case "string": return String(value);
      case "default": return value;
      default: return value;
    }
  }

  New(classes)
  {
    console.warn("Depreciate?");
    return this.constructor.New(classes);
  }

  GenerateSelector(path = [], recursing)
  {
    if (!this.IsElement()) return;

    // Recursively call for each parent
    this.GetParent()?.GenerateSelector(path, true);

    if (this.HasID())
    {
      path.push(`#${this.GetID()}`);
    }
    else
    {
      const name = this.GetNodeName();

      let matches = 1;
      let index = 0;
      let sibling = this.GetPrevSibling();
      while (sibling)
      {
        index++;
        if (sibling.GetNodeName() === name) matches += 1;

        sibling = sibling.GetPrevSibling();
      }

      if (matches === 1) path.push(name.toLowerCase());
      else path.push(`${name.toLowerCase()}:nth-child(${1 + index})`);
    }

    // The recursing value is here so that the path is only joined once
    return recursing ?? path.join(" > ");
  }

  FindChildAtTextOffset(offset, index = 0)
  {
    const count = this.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = this.GetChild(i);
      if (child)
      {

      }
    }
  }

  SetCaretOffset(offset, index = 0, node = this.GetNode(), range = this.constructor.CreateRange())
  {
    // console.log("SetCaretOffset", offset, node);

    // const count = this.GetChildCount();
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++)
    {
      const child = children[i];

      if (child.nodeType === window.Node.TEXT_NODE)
      {
        const text = child.textContent;

        if (text.length > offset) // It must be in this node
        {
          console.log("Found text child", text);
          range.selectNode(node);
          range.setStart(node, 0);
          range.setEnd(child, offset);

          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          return true;
        }
        else // It's beyond this node
        {
          console.log("Subtracting", text.length, "from offset", offset);
          offset -= text.length;
        }
      }
      else
      {
        const result = this.SetCaretOffset(offset, child, range);
        if (result) return result;
      }
    }

    return false;
  }

  SetCaretOffset(offset, state = { offset }, range = this.constructor.CreateRange())
  {
    const node = this.GetNode();
    range.selectNode(node);
    range.setStart(node, 0);

    if (0 >= state.offset)
    {
      console.log("Hit a zero offset");

      range.setEnd(node, 0);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      return true;
    }
    else if (this.IsText())
    {
      const string = node.textContent;

      if (string.length > state.offset) // It must be in this node
      {
        console.log("Found text child", string, "at offset", state.offset);


        range.setEnd(node, state.offset);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        return true;
      }
      else
      {
        console.log("Subtracting", string.length, "from", state.offset);
        state.offset -= string.length;
        return false;
      }
    }
    else
    {
      const count = this.GetChildCount();
      for (let i = 0; i < count; i++)
      {
        const child = this.GetChild(i);
        if (child)
        {
          const result = child.SetCaretOffset(offset, state, range);
          if (result) return result;
          // else if (0 >= state.offset) return false;
        }
      }
    }

    return false;
  }

  SetCaretOffset(offset, state = { offset }, range)
  {
    const node = this.GetNode();

    if (!range)
    {
      range = this.constructor.CreateRange()
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (0 >= state.offset)
    {
      console.log("Hit a zero offset");

      range.setEnd(node, 0);
      return range;
    }
    else if (this.IsText())
    {
      const string = node.textContent;

      if (string.length > state.offset) // It must be in this node
      {
        console.log("Found text child", string, "at offset", state.offset);

        range.setEnd(node, state.offset);
        return range;
      }
      else
      {
        console.log("Subtracting", string.length, "from", state.offset);
        state.offset -= string.length;
      }
    }
    else
    {
      const count = this.GetChildCount();
      for (let i = 0; i < count; i++)
      {
        const child = this.GetChild(i);
        if (child)
        {
          const result = child.SetCaretOffset(offset, state, range);
          if (result) return result;
          // else if (0 >= state.offset) return false;
        }
      }
    }

    return false;
  }

  // This is one of those functions where I carelessly lost the original source
  // and cannot find it again...
  // I know it came from stackoverflow, but I don't know who wrote it
  // I'm very sorry to whoever I am failing to credit here!
  CreateRangeHelper(chars, node = this.GetNode(), range)
  {
    if (!range)
    {
      range = window.document.createRange();
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0)
    {
      range.setEnd(node, chars.count);
    }
    else if (node && chars.count > 0)
    {
      if (node.nodeType === window.Node.TEXT_NODE)
      {
        if (node.textContent.length < chars.count)
        {
          chars.count -= node.textContent.length;
        }
        else
        {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      }
      else
      {
        for (let lp = 0; lp < node.childNodes.length; lp++)
        {
          const child = node.childNodes[lp];
          range = this.CreateRangeHelper(chars, child, range);

          if (chars.count === 0)
          {
            break;
          }
        }
      }
    }

    return range;
  }

  AppendText(text, ctor)
  {
    const last = this.GetLastChild();
    if (last && last.IsText())
    {
      // console.log("Appending", text, "to", last.GetNode().nodeValue);
      last.GetTargetNode().nodeValue += text;
    }
    else
    {
      const last_node = this.GetLastChildNode();
      if (last_node && last_node instanceof window.Text)
      {
        last_node.nodeValue += text;
      }
      else
      {
        let node;
        if (ctor)
        {
          const tag = new ctor(text);
          node = tag.GetNode();
        }
        else
        {
          node = this.constructor.CreateText(text);
        }

        this.AppendChild(node);
      }
    }

    return this;
  }

  Wait()
  {
    if (this.IsConnected())
    {
      return Promise.resolve(this);
    }
    else
    {
      return new Promise(resolve =>
      {
        this.OnConnect(event =>
        {
          resolve(this);
        }, { once: true });
      });
    }
  }

  Throw(error)
  {
    console.error("Tag error", error);
    return this.Add(error);
  }

  static AddFirst(...args){ return new this().AddFirst(...args); }
  static Add(...args){ return new this().Add(...args); }
  static TL(...args){ return new this().TL(...args); }

  // Invoke static TL or static Add depending on function arguments
  static TLA(strings, ...rest)
  {
    // All these checks are probably not really necessary
    // This isn't a security feature or anything, it's just a convenience helper
    // TODO: Test the performance. Do these checks cause a problem?
    if (typeof(strings) === "object" && typeof(strings.raw) === "object")
    {
      if (Array.isArray(strings) && Array.isArray(strings.raw))
      {
        if (Object.isFrozen(strings) && Object.isFrozen(strings.raw))
        {
          return this.TL(strings, ...rest);
        }
      }
    }

    return this.Add(strings, ...rest);
  }

  // Move the children from this to tag and then replace this
  Swap(target){ return NodeSwap(this, target); }

  Clone(deep = true)
  {
    const node = this.GetNode().cloneNode(false);

    if (this.IsTrusted())
    {
      this.constructor.Trust(node);
    }

    const clone = new this.constructor(node);

    if (deep === true)
    {
      const children = this.GetChildNodes();

      for (let i = 0; i < children.length; i++)
      {
        const child = this.constructor.For(children[i]);

        if (child)
        {
          const tag = child.Clone(deep);
          clone.AppendChild(tag);
        }
      }
    }

    return clone;
  }

  _HRef(url, origin = window.location.origin)
  {
    const result = super.HRef(url, origin);

    if (Environment.IsClient())
    {
      url = this.GetAttribute("href");

      if (!(url instanceof URL))
      {
        url = new URL(url, origin);
      }

      // If it's an internal URL
      if (url.origin === location.origin)
      {
        // let page;
        // this.GetNode().addEventListener("mouseover", event =>
        // {
        //   // const parent = this.QueryClosest("url");
        //   // if (parent)
        //   // {
        //   //   event.preventDefault();
        //   //   parent.Navigate(url);
        //   // }
        // });
        //
        // this.GetNode().addEventListener("mouseout", event =>
        // {
        //   // const parent = this.QueryClosest("url");
        //   // if (parent)
        //   // {
        //   //   event.preventDefault();
        //   //   parent.Navigate(url);
        //   // }
        // });

        this.GetNode().addEventListener("click", event =>
        {
          const parent = this.QueryClosest("url");
          if (parent)
          {
            event.preventDefault();
            parent.Navigate(url);
          }
        });
      }
    }

    return result;
  }

  Log(...args){ return this.GetParent()?.Log(...args); }
  Warn(...args){ return this.GetParent()?.Warn(...args); }
  Error(...args){ return this.GetParent()?.Error(...args); }
  Debug(...args){ return this.GetParent()?.Debug(...args); }

  Expect(value){ return new Expectation(this, value); }
  // Selector(){ return new Selector(this); }

  GetSelector()
  {
    if (this[SELECTOR]) return this[SELECTOR];

    let selector = "";
    // const parent = this.GetParent();
    // if (parent && parent.GetLocalName() !== "style")
    // {
    //   const parent_selector = parent.GetSelector();
    //   if (parent.HasAttribute("combinator"))
    //   {
    //     selector += parent_selector + " " + parent.GetAttribute("combinator") + " ";
    //   }
    //   else
    //   {
    //     selector += parent_selector + " ";
    //   }
    // }

    const selector_name = this.GetLocalName();
    if (this.HasAttribute("group"))
    {
      selector += this.GetAttribute("group");
      if (selector_name)
      {
        selector += ", ";
      }
    }

    selector += selector_name;

    const id = this.GetAttribute("id");
    if (id) selector += "#" + id;

    const classes = this.GetClass();
    if (classes) selector += "." + classes.split(" ").join(".");

    if (this.HasAttribute("pseudo"))
    {
      selector = selector.trim() + this.GetAttribute("pseudo");
    }

    // Cache the selector for performance
    // This matters since it will often be called multiple times by child tags
    return this[SELECTOR] = selector;
  }

  Shadow(...args)
  {
    console.warn("Depreciate?");
    // const node = this.GetNode();
    const shadow = this.GetShadow() ?? this.constructor.Shadow(this);
    shadow.Add.apply(shadow, args);

    return this;
  }

  toJSON()
  {
    const actions = [];

    const node = this.GetNode();
    if (node.childNodes.length > 0)
    {
      const children = [];
      for (let i = 0; i < node.childNodes.length; i++)
      {
        const tag = this.Convert(node.childNodes[i]);
        if (tag) children.push.apply(children, tag.toJSON());
      }

      actions.push("children", children);
    }

    if (node.attributes)
    {
      for (let i = 0; i < node.attributes.length; i++)
      {
        const {name, value} = node.attributes[i];
        actions.push(name, [value]);
      }
    }

    return [
      "construct",
      [
        this.GetLocalName(),
        actions,
      ],
    ];
  }

  ToPrettyHTML(indent = "")
  {
    const node = this.GetNode();
    const name = this.GetLocalName();
    // const name = node.nodeName;
    // const name = this.constructor.name;

    let string = "";
    string += `${indent}<${name}`;
    if (node.attributes)
    {
      for (let i = 0; i < node.attributes.length; i++)
      {
        const {name, value} = node.attributes[i];
        string += ` ${name}="${value}"`;
      }
    }

    string += ">";

    if (node.childNodes.length > 0)
    {
      for (let i = 0; i < node.childNodes.length; i++)
      {
        const tag = node.childNodes[i].tag;
        if (tag)
        {
          string += "\n";
          string += tag.ToPrettyHTML(indent + "  ");
        }
      }

      string += `\n${indent}</${name}>`;
    }
    else
    {
      string += `</${name}>`;
    }

    return string;
  }

  // ConvertObject(v, ctor)
  // {
  //   if (ctor === Tag)
  //   {
  //     return v.GetNode();
  //   }
  //   else
  //   {
  //     return super.ConvertObject(v, ctor);
  //   }
  // }

  //---------------------------------
  // Attributes
  //---------------------------------
  Style(value)
  {
    if (this.IsTrusted())
    {
      this.GetNode().style.cssText = value;
    }
    else
    {
      const temp = window.document.createElement("div");
      temp.style.cssText = value;

      const styles = temp.style;
      for (let i = 0; i < styles.length; i++)
      {
        const key = styles.item(i);
        const val = styles.getPropertyValue(key);
        const priority = styles.getPropertyPriority(key);

        this.Apply(key, [val, !!priority]);
      }
    }

    return this;
  }

  // EncodeText       (v){ return this.SetProperty("textContent", Encoder.Encode(v)); }
  // DecodeText       (v){ return this.SetProperty("textContent", Encoder.Decode(v)); }
  // EscapeHTML       (v){ return this.SetProperty("innerHTML", this.constructor.Escape(v)); }
  // InnerHTML        (v){ return this.SetProperty("innerHTML",           v); }
  // OuterHTML        (v){ return this.SetProperty("outerHTML",           v); }
  // InnerText        (v){ return this.SetProperty("innerText",           v); }
  // OuterText        (v){ return this.SetProperty("outerText",           v); }
  Class            (v, d){ return this.SetAttribute("class",              v, d); }
  Is               (v, d){ return this.SetAttribute("is",                 v, d); }
  ID               (v, d){ return this.SetAttribute("id",                 v, d); }
  Name             (v, d){ return this.SetAttribute("name",               v, d); }
  Part             (v, d){ return this.SetAttribute("part",               v, d); }
  Lang             (v, d){ return this.SetAttribute("lang",               v, d); }
  Slot             (v, d){ return this.SetAttribute("slot",               v, d); }
  Override         (v, d){ return this.SetAttribute("override",           v, d); }
  CharSet          (v, d){ return this.SetAttribute("charset",            v, d); }
  Placeholder      (v, d){ return this.SetAttribute("placeholder",        v, d); }
  Place            (v, d){ return this.SetAttribute("place",              v, d); }
  Mode             (v, d){ return this.SetAttribute("mode",               v, d); }
  Value            (v, d){ return this.SetAttribute("value",              v, d); }
  XMLNS            (v, d){ return this.SetAttribute("xmlns",              v, d); }
  NS               (v, d){ return this.SetAttribute("ns",                 v, d); }
  ViewBox          (v, d){ return this.SetAttribute("viewBox",            v, d); }
  D                (v, d){ return this.SetAttribute("d",                  v, d); }
  Rel              (v, d){ return this.SetAttribute("rel",                v, d); }
  Step             (v, d){ return this.SetAttribute("step",               v, d); }
  Sizes            (v, d){ return this.SetAttribute("sizes",              v, d); }
  ColorAttribute   (v, d){ return this.SetAttribute("color",              v, d); }
  Role             (v, d){ return this.SetAttribute("role",               v, d); }
  Type             (v, d){ return this.SetAttribute("type",               v, d); }
  Alt              (v, d){ return this.SetAttribute("alt",                v, d); }
  Min              (v, d){ return this.SetAttribute("min",                v, d); }
  Max              (v, d){ return this.SetAttribute("max",                v, d); }
  For              (v, d){ return this.SetAttribute("for",                v, d); }
  TabIndex         (v, d){ return this.SetAttribute("tabindex",           v, d); }
  Download         (v, d){ return this.SetAttribute("download",           v, d); }
  Method           (v, d){ return this.SetAttribute("method",             v, d); }
  Action           (v, d){ return this.SetAttribute("action",             v, d); }
  WidthAtt         (v, d){ return this.SetAttribute("width",              v, d); }
  HeightAtt        (v, d){ return this.SetAttribute("height",             v, d); }
  Title            (v, d){ return this.SetAttribute("title",              v, d); }
  CrossOrigin      (v, d){ return this.SetAttribute("crossorigin",        v, d); }
  Preload          (v, d){ return this.SetAttribute("preload",            v, d); }
  PlaysInline      (v, d){ return this.SetAttribute("playsinline",        v, d); }
  AutoPlay         (v, d){ return this.SetAttribute("autoplay",           v, d); }
  Muted            (v, d){ return this.SetAttribute("muted",              v, d); }
  Loop             (v, d){ return this.SetAttribute("loop",               v, d); }
  Poster           (v, d){ return this.SetAttribute("poster",             v, d); }
  FrameBorder      (v, d){ return this.SetAttribute("frameborder",        v, d); }
  Allow            (v, d){ return this.SetAttribute("allow",              v, d); }
  AllowFullScreen  (v, d){ return this.SetAttribute("allowfullscreen",    v, d); }
  AllowTransparency(v, d){ return this.SetAttribute("allowtransparency",  v, d); }
  Rows             (v, d){ return this.SetAttribute("rows",               v, d); }
  Cols             (v, d){ return this.SetAttribute("cols",               v, d); }
  Integrity        (v, d){ return this.SetAttribute("integrity",          v, d); }
  ContentAtt       (v, d){ return this.SetAttribute("content",            v, d); }
  Draggable        (v, d){ return this.SetAttribute("draggable",          v, d); }
  Multiple         (v, d){ return this.SetAttribute("multiple",           v, d); }
  Code             (v, d){ return this.SetAttribute("code",               v, d); }
  Group    (...values){ return this.SetAttribute("group", values.join(", ")); }
  RawHRef          (v, d){ return this.SetAttribute("href", v, d); }
  RawSrc           (v, d){ return this.SetAttribute("src" , v, d); }
  All              (v){ return this.ToggleAttribute("all",             v); }
  ContentEditable  (v){ return this.ToggleAttribute("contenteditable", v); }
  Checked          (v){ return this.ToggleAttribute("checked",         v); }
  Disabled         (v){ return this.ToggleAttribute("disabled",        v); }
  Controls         (v){ return this.ToggleAttribute("controls",        v); }
  ReadOnly         (v){ return this.ToggleAttribute("readonly",        v); }
  AutoComplete     (v){ return this.ToggleAttribute("autocomplete",    v); }
  Selected         (v){ return this.ToggleAttribute("selected",        v); }
  Required         (v){ return this.ToggleAttribute("required",        v); }
  NoValidate       (v){ return this.ToggleAttribute("novalidate",      v); }
  NoModule         (v){ return this.ToggleAttribute("nomodule",        v); }

  Src(url, origin = window.location.origin)
  {
    if (Environment.IsClient())
    {
      if (!(url instanceof globalThis.URL))
      {
        url = new globalThis.URL(url, origin);
      }

      if (!this.IsTrusted())
      {
        url = Sanitize.URL(url, origin);
      }

      return this.SetAttribute("src", url);
    }
    else
    {
      return this.SetAttribute("src", url);
    }
  }

  HRef(url, origin = window.location.origin)
  {
    if (Environment.IsClient())
    {
      if (!this.IsTrusted())
      {
        url = Sanitize.URL(url, origin);
      }

      if (!(url instanceof globalThis.URL))
      {
        url = new globalThis.URL(url, origin);
      }

      this.SetAttribute("href", url);

      // If it's an internal URL
      if (url.origin === window.location.origin)
      {
        this.GetNode().addEventListener("click", event =>
        {
          const parent = this.QueryClosest("url");
          if (parent)
          {
            event.preventDefault();
            parent.Navigate(url);
          }
        });
      }
    }
    else
    {
      this.SetAttribute("href", url);
    }

    return this;
  }

  ItemID(v){ return this.SetAttribute("itemid", v); }
  ItemProp(v){ return this.SetAttribute("itemprop", v); }
  ItemRef(v){ return this.SetAttribute("itemref", v); }
  ItemScope(v){ return this.ToggleAttribute("itemscope", v); }
  ItemType(v){ return this.SetAttribute("itemtype", v); }

  Type(v, d){ return this.SetAttribute("type", v, d); }
  TypeDate(){ return this.Type("date"); }
  TypeColor(){ return this.Type("color"); }
  TypeButton(){ return this.Type("button"); }
  TypeEmail(){ return this.Type("email"); }
  TypeDateTimeLocal(){ return this.Type("datetime-local"); }
  TypeFile(){ return this.Type("file"); }
  TypeHidden(){ return this.Type("hidden"); }
  TypeImage(){ return this.Type("image"); }
  TypeMonth(){ return this.Type("month"); }
  TypeNumber(){ return this.Type("number"); }
  TypePassword(){ return this.Type("password"); }
  TypeRadio(){ return this.Type("radio"); }
  TypeRange(){ return this.Type("range"); }
  TypeReset(){ return this.Type("reset"); }
  TypeSearch(){ return this.Type("search"); }
  TypeSubmit(){ return this.Type("submit"); }
  TypeTel(){ return this.Type("tel"); }
  TypeText(){ return this.Type("text"); }
  TypeTime(){ return this.Type("time"); }
  TypeURL(){ return this.Type("url"); }
  TypeWeek(){ return this.Type("week"); }

  Expiration(date)
  {
    if (typeof(date) === "number")
    {
      date = new Date(Date.now() + date);
    }

    globalThis.setTimeout(() =>
    {
      if (this.HasAttribute("expiration") && this.IsInDocument())
      {
        const expiration = Number(this.GetAttribute("expiration"));
        if (expiration === date.getTime())
        {
          this.RemoveAttribute("expiration");
          this.Remove();
        }
      }
    }, date.getTime() - Date.now());

    return this.SetAttribute("expiration", date.getTime());
  }

  RoleNone(){ return this.Role("none"); }
  RoleAlert(){ return this.Role("alert"); }
  RoleAlertDialog(){ return this.Role("alertdialog"); }
  RoleApplication(){ return this.Role("application"); }
  RoleBanner(){ return this.Role("banner"); }
  RoleButton(){ return this.Role("button"); }
  RoleCell(){ return this.Role("cell"); }
  RoleCheckbox(){ return this.Role("checkbox"); }
  RoleComplementary(){ return this.Role("complementary"); }
  RoleComboBox(){ return this.Role("combobox"); }
  RoleContentInfo(){ return this.Role("contentinfo"); }
  RoleDialog(){ return this.Role("dialog"); }
  RoleDocument(){ return this.Role("document"); }
  RoleFeed(){ return this.Role("feed"); }
  RoleFigure(){ return this.Role("figure"); }
  RoleForm(){ return this.Role("form"); }
  RoleGrid(){ return this.Role("grid"); }
  RoleGridCell(){ return this.Role("gridcell"); }
  RoleHeading(){ return this.Role("heading"); }
  RoleImg(){ return this.Role("img"); }
  RoleList(){ return this.Role("list"); }
  RoleListBox(){ return this.Role("listbox"); }
  RoleListItem(){ return this.Role("listitem"); }
  RoleMain(){ return this.Role("main"); }
  RoleNavigation(){ return this.Role("navigation"); }
  RolePresentation(){ return this.Role("presentation"); }
  RoleProgressBar(){ return this.Role("progressbar"); }
  RoleRegion(){ return this.Role("region"); }
  RoleRow(){ return this.Role("row"); }
  RoleRowGroup(){ return this.Role("rowgroup"); }
  RoleSearch(){ return this.Role("search"); }
  RoleSwitch(){ return this.Role("switch"); }
  RoleTab(){ return this.Role("tab"); }
  RoleTable(){ return this.Role("table"); }
  RoleTabPanel(){ return this.Role("tabpanel"); }
  RoleTextBox(){ return this.Role("textbox"); }
  RoleTimer(){ return this.Role("timer"); }
  RoleColumnHeader(){ return this.Role("columnheader"); }
  RoleMenu(){ return this.Role("menu"); }
  RoleMenuItem(){ return this.Role("menuitem"); }

  AriaAtomic         (v){ return this.SetAttribute("aria-atomic",          v); }
  AriaAtomicTrue     (){ return this.AriaAtomic("true"); }
  AriaAtomicFalse    (){ return this.AriaAtomic("false"); }
  AriaBusy           (v){ return this.SetAttribute("aria-busy",            v); }
  AriaControls       (v){ return this.SetAttribute("aria-controls",        v); }
  AriaCurrent        (v){ return this.SetAttribute("aria-current",         v); }
  AriaDescribedBy    (v){ return this.SetAttribute("aria-describedby",     v); }
  AriaDetails        (v){ return this.SetAttribute("aria-details",         v); }
  AriaDisabled       (v){ return this.SetAttribute("aria-disabled",        v); }
  AriaDropEffect     (v){ return this.SetAttribute("aria-dropeffect",      v); }
  AriaErrorMessage   (v){ return this.SetAttribute("aria-errormessage",    v); }
  AriaExpanded       (v){ return this.SetAttribute("aria-expanded",        v); }
  AriaFlowto         (v){ return this.SetAttribute("aria-flowto",          v); }
  AriaGrabbed        (v){ return this.SetAttribute("aria-grabbed",         v); }
  AriaHasPopUp       (v){ return this.SetAttribute("aria-haspopup",        v); }
  AriaHidden         (v){ return this.SetAttribute("aria-hidden",          v); }
  AriaHiddenTrue     (){ return this.AriaHidden("true"); }
  AriaHiddenFalse    (){ return this.AriaHidden("false"); }
  AriaInvalid        (v){ return this.SetAttribute("aria-invalid",         v); }
  AriaKeyShortcuts   (v){ return this.SetAttribute("aria-keyshortcuts",    v); }
  AriaLabel          (v){ return this.SetAttribute("aria-label",           v); }
  AriaLabelledBy     (v){ return this.SetAttribute("aria-labelledby",      v); }
  AriaLevel          (v){ return this.SetAttribute("aria-level",           v); }
  AriaLive           (v){ return this.SetAttribute("aria-live",            v); }
  AriaLiveOff        (){ return this.AriaLive("off"); } // Ignore updates
  AriaLivePolite     (){ return this.AriaLive("polite"); } // Updates should be queued
  AriaLiveAssertive  (){ return this.AriaLive("assertive"); }
  AriaLiveRude       (){ return this.AriaLive("rude"); } // Updates to this should interrupt, INVASIVE
  AriaModal          (v){ return this.SetAttribute("aria-modal",           v); }
  AriaOwns           (v){ return this.SetAttribute("aria-owns",            v); }
  AriaPressed        (v){ return this.SetAttribute("aria-pressed",         v); }
  AriaRelevant       (v){ return this.SetAttribute("aria-relevant",        v); }
  AriaRoleDescription(v){ return this.SetAttribute("aria-roledescription", v); }
  AriaTreeItem       (v){ return this.SetAttribute("aria-treeitem",        v); }
  AriaOrientation    (v){ return this.SetAttribute("aria-orientation",     v); }
  AriaValueMin       (v){ return this.SetAttribute("aria-valuemin",        v); }
  AriaValueNow       (v){ return this.SetAttribute("aria-valuenow",        v); }
  AriaValueMax       (v){ return this.SetAttribute("aria-valuemax",        v); }

  //---------------------------------
  // Events
  //---------------------------------
  OnMutation(fn, o){ return this.On(E.Mutation, fn, o); }
  OnRender(fn, o){ return this.On(E.Render, fn, o); }
  OnConnect(fn, o){ return this.On(E.Connect, fn, o); }
  OnDisconnect(fn, o){ return this.On(E.Disconnect, fn, o); }
  OnMobile(fn, o){ return this.On(E.Mobile, fn, o); }
  OnTablet(fn, o){ return this.On(E.Tablet, fn, o); }
  OnTouch(fn, o){ return this.On(E.Touch, fn, o); }
  OnDesktop(fn, o){ return this.On(E.Desktop, fn, o); }
  OnWidescreen(fn, o){ return this.On(E.Widescreen, fn, o); }
  OnFullHD(fn, o){ return this.On(E.FullHD, fn, o); }
  OnNotMobile(fn, o){ return this.On(E.NotMobile, fn, o); }
  OnNotTablet(fn, o){ return this.On(E.NotTablet, fn, o); }
  OnNotDesktop(fn, o){ return this.On(E.NotDesktop, fn, o); }
  OnNotWidescreen(fn, o){ return this.On(E.NotWidescreen, fn, o); }
  OnNotFullHD(fn, o){ return this.On(E.NotFullHD, fn, o); }
  OnFullViewEnter(fn, o){ return this.On(E.FullViewEnter, fn, o); }
  OnFullViewLeave(fn, o){ return this.On(E.FullViewLeave, fn, o); }
  OnViewEnter(fn, o){ return this.On(E.ViewEnter, fn, o); }
  OnViewLeave(fn, o){ return this.On(E.ViewLeave, fn, o); }
  OnAnimationPlay(fn, o){ return this.On(E.AnimationPlay, fn, o); }
  OnAnimationCancel(fn, o){ return this.On(E.AnimationCancel, fn, o); }
  OnAnimationFinish(fn, o){ return this.On(E.AnimationFinish, fn, o); }
  OnAnimationReverse(fn, o){ return this.On(E.AnimationReverse, fn, o); }
  OnAnimationPause(fn, o){ return this.On(E.AnimationPause, fn, o); }

  OnAnimationStart(fn, o){ return this.On(E.Animationstart, fn, o); }
  OnAnimationEnd(fn, o){ return this.On(E.Animationend, fn, o); }
  OnAnimationIteration(fn, o){ return this.On(E.Animationiteration, fn, o); }

  OnLoad(fn, o){ return this.On(E.Load, fn, o); }

  OnInput(fn, o){ return this.On(E.Input, fn, o); }
  OnFocus(fn, o){ return this.On(E.Focus, fn, o); }
  OnBlur(fn, o){ return this.On(E.Blur, fn, o); }
  OnChange(fn, o){ return this.On(E.Change, fn, o); }
  OnSubmit(fn, o){ return this.On(E.Submit, fn, o); }

  // Mouse Events
  OnClick(fn, o){ return this.On(E.Click, fn, o); }
  OnContextMenu(fn, o){ return this.On(E.Contextmenu, fn, o); }
  OnDoubleClick(fn, o){ return this.On(E.Dblclick, fn, o); }
  OnMouseDown(fn, o){ return this.On(E.Mousedown, fn, o); }
  OnMouseUp(fn, o){ return this.On(E.Mouseup, fn, o); }
  OnMouseOver(fn, o){ return this.On(E.Mouseover, fn, o); }
  OnMouseOut(fn, o){ return this.On(E.Mouseout, fn, o); }
  OnMouseMove(fn, o){ return this.On(E.Mousemove, fn, o); }
  OnTouchMove(fn, o){ return this.On(E.Touchmove, fn, o); }
  OnTouchStart(fn, o){ return this.On(E.Touchstart, fn, o); }
  OnWheel(fn, o){ return this.On(E.Wheel, fn, o); }

  OnPointerOver(fn, o){ return this.On(E.Pointerover, fn, o); }
  OnPointerEnter(fn, o){ return this.On(E.Pointerenter, fn, o); }
  OnPointerDown(fn, o){ return this.On(E.Pointerdown, fn, o); }
  OnPointerMove(fn, o){ return this.On(E.Pointermove, fn, o); }
  OnPointerUp(fn, o){ return this.On(E.Pointerup, fn, o); }
  OnPointerCancel(fn, o){ return this.On(E.Pointercancel, fn, o); }
  OnPointerOut(fn, o){ return this.On(E.Pointerout, fn, o); }
  OnPointerLeave(fn, o){ return this.On(E.Pointerleave, fn, o); }
  OnGotPointerCapture(fn, o){ return this.On(E.Gotpointercapture, fn, o); }
  OnLostPointerCapture(fn, o){ return this.On(E.Lostpointercapture, fn, o); }

  OnVisibilityChange(fn, o){ return this.On(E.Visibilitychange, fn, o); }
  OnTimeUpdate(fn, o){ return this.On(E.Timeupdate, fn, o); }
  OnPlay(fn, o){ return this.On(E.Play, fn, o); }
  OnPause(fn, o){ return this.On(E.Pause, fn, o); }
  OnVolumeChange(fn, o){ return this.On(E.Volumechange, fn, o); }
  OnDrop(fn, o){ return this.On(E.Drop, fn, o); }
  OnDragOver(fn, o){ return this.On(E.Dragover, fn, o); }
  OnDragStart(fn, o){ return this.On(E.Dragstart, fn, o); }
  OnDragEnd(fn, o){ return this.On(E.Dragend, fn, o); }
  OnDragEnter(fn, o){ return this.On(E.Dragenter, fn, o); }
  OnDragExit(fn, o){ return this.On(E.Dragexit, fn, o); }
  OnDragLeave(fn, o){ return this.On(E.Dragleave, fn, o); }

  OnMutation(fn, o){ return this.On(E.Mutation, fn, o); }
  OnRender(fn, o){ return this.On(E.Render, fn, o); }
  OnConnect(fn, o){ return this.On(E.Connect, fn, o); }
  OnDisconnect(fn, o){ return this.On(E.Disconnect, fn, o); }
  OnFirstConnect(fn, o){ return this.On(E.FirstConnect, fn, o); }
  OnFirstDisconnect(fn, o){ return this.On(E.FirstDisconnect, fn, o); }
  OnReflow(fn, o){ return this.On(E.Reflow, fn, o); }
  OnLog(fn, o){ return this.On(E.Log, fn, o); }
  OnWarn(fn, o){ return this.On(E.Warn, fn, o); }
  OnError(fn, o){ return this.On(E.Error, fn, o); }
  OnDebug(fn, o){ return this.On(E.Debug, fn, o); }
  OnMobile(fn, o){ return this.On(E.Mobile, fn, o); }
  OnTablet(fn, o){ return this.On(E.Tablet, fn, o); }
  OnTouch(fn, o){ return this.On(E.Touch, fn, o); }
  OnDesktop(fn, o){ return this.On(E.Desktop, fn, o); }
  OnWidescreen(fn, o){ return this.On(E.Widescreen, fn, o); }
  OnFullHD(fn, o){ return this.On(E.FullHD, fn, o); }
  OnNotMobile(fn, o){ return this.On(E.NotMobile, fn, o); }
  OnNotTablet(fn, o){ return this.On(E.NotTablet, fn, o); }
  OnNotDesktop(fn, o){ return this.On(E.NotDesktop, fn, o); }
  OnNotWidescreen(fn, o){ return this.On(E.NotWidescreen, fn, o); }
  OnNotFullHD(fn, o){ return this.On(E.NotFullHD, fn, o); }
  OnFullViewEnter(fn, o){ return this.On(E.FullViewEnter, fn, o); }
  OnFullViewLeave(fn, o){ return this.On(E.FullViewLeave, fn, o); }
  OnViewEnter(fn, o){ return this.On(E.ViewEnter, fn, o); }
  OnViewLeave(fn, o){ return this.On(E.ViewLeave, fn, o); }
  OnAnimationPlay(fn, o){ return this.On(E.AnimationPlay, fn, o); }
  OnAnimationCancel(fn, o){ return this.On(E.AnimationCancel, fn, o); }
  OnAnimationFinish(fn, o){ return this.On(E.AnimationFinish, fn, o); }
  OnAnimationReverse(fn, o){ return this.On(E.AnimationReverse, fn, o); }
  OnAnimationPause(fn, o){ return this.On(E.AnimationPause, fn, o); }
  OnAnimationStart(fn, o){ return this.On(E.Animationstart, fn, o); }
  OnAnimationEnd(fn, o){ return this.On(E.Animationend, fn, o); }
  OnAnimationIteration(fn, o){ return this.On(E.Animationiteration, fn, o); }
  OnLoad(fn, o){ return this.On(E.Load, fn, o); }
  OnInput(fn, o){ return this.On(E.Input, fn, o); }
  OnFocus(fn, o){ return this.On(E.Focus, fn, o); }
  OnBlur(fn, o){ return this.On(E.Blur, fn, o); }
  OnChange(fn, o){ return this.On(E.Change, fn, o); }
  OnSubmit(fn, o){ return this.On(E.Submit, fn, o); }

  // Mouse Events
  OnClick(fn, o){ return this.On(E.Click, fn, o); }
  OnContextMenu(fn, o){ return this.On(E.Contextmenu, fn, o); }
  OnDoubleClick(fn, o){ return this.On(E.Dblclick, fn, o); }
  OnMouseDown(fn, o){ return this.On(E.Mousedown, fn, o); }
  OnMouseUp(fn, o){ return this.On(E.Mouseup, fn, o); }
  OnMouseOver(fn, o){ return this.On(E.Mouseover, fn, o); }
  OnMouseOut(fn, o){ return this.On(E.Mouseout, fn, o); }
  OnMouseMove(fn, o){ return this.On(E.Mousemove, fn, o); }
  OnTouchMove(fn, o){ return this.On(E.Touchmove, fn, o); }
  OnTouchStart(fn, o){ return this.On(E.Touchstart, fn, o); }
  OnWheel(fn, o){ return this.On(E.Wheel, fn, o); }

  OnPointerOver(fn, o){ return this.On(E.Pointerover, fn, o); }
  OnPointerEnter(fn, o){ return this.On(E.Pointerenter, fn, o); }
  OnPointerDown(fn, o){ return this.On(E.Pointerdown, fn, o); }
  OnPointerMove(fn, o){ return this.On(E.Pointermove, fn, o); }
  OnPointerUp(fn, o){ return this.On(E.Pointerup, fn, o); }
  OnPointerCancel(fn, o){ return this.On(E.Pointercancel, fn, o); }
  OnPointerOut(fn, o){ return this.On(E.Pointerout, fn, o); }
  OnPointerLeave(fn, o){ return this.On(E.Pointerleave, fn, o); }
  OnGotPointerCapture(fn, o){ return this.On(E.Gotpointercapture, fn, o); }
  OnLostPointerCapture(fn, o){ return this.On(E.Lostpointercapture, fn, o); }

  OnVisibilityChange(fn, o){ return this.On(E.Visibilitychange, fn, o); }

  // Video events
  OnTimeUpdate(fn, o){ return this.On(E.Timeupdate, fn, o); }
  OnPlay(fn, o){ return this.On(E.Play, fn, o); }
  OnPause(fn, o){ return this.On(E.Pause, fn, o); }
  OnVolumeChange(fn, o){ return this.On(E.Volumechange, fn, o); }

  // Drag and drop events
  OnDrop(fn, o){ return this.On(E.Drop, fn, o); }
  OnDragOver(fn, o){ return this.On(E.Dragover, fn, o); }
  OnDragStart(fn, o){ return this.On(E.Dragstart, fn, o); }
  OnDragEnd(fn, o){ return this.On(E.Dragend, fn, o); }
  OnDragEnter(fn, o){ return this.On(E.Dragenter, fn, o); }
  OnDragExit(fn, o){ return this.On(E.Dragexit, fn, o); }
  OnDragLeave(fn, o){ return this.On(E.Dragleave, fn, o); }

  // OnKeyPress(fn, o){ return this.On(E.Keypress, fn, o); }
  // OnKeyDown(fn, o){ return this.On(E.Keydown, fn, o); }
  // OnKeyUp(fn, o){ return this.On(E.Keyup, fn, o); }

  // Keyboard events
  OnKeyBackspace(fn, o){ return this.OnKey(8, fn, o); }
  OnKeyTab(fn, o){ return this.OnKey(9, fn, o); }
  OnKeyEnter(fn, o){ return this.OnKey(13, fn, o); }
  OnKeyShift(fn, o){ return this.OnKey(16, fn, o); }
  OnKeyCtrl(fn, o){ return this.OnKey(17, fn, o); }
  OnKeyAlt(fn, o){ return this.OnKey(18, fn, o); }
  OnKeyPause(fn, o){ return this.OnKey(19, fn, o); }
  OnKeyCapsLock(fn, o){ return this.OnKey(20, fn, o); }
  OnKeyEscape(fn, o){ return this.OnKey(27, fn, o); }
  OnKeySpaceBar(fn, o){ return this.OnKey(32, fn, o); }
  OnKeyPageUp(fn, o){ return this.OnKey(33, fn, o); }
  OnKeyPageDown(fn, o){ return this.OnKey(34, fn, o); }
  OnKeyEnd(fn, o){ return this.OnKey(35, fn, o); }
  OnKeyHome(fn, o){ return this.OnKey(36, fn, o); }
  OnKeyLeftArrow(fn, o){ return this.OnKey(37, fn, o); }
  OnKeyUpArrow(fn, o){ return this.OnKey(38, fn, o); }
  OnKeyRightArrow(fn, o){ return this.OnKey(39, fn, o); }
  OnKeyDownArrow(fn, o){ return this.OnKey(40, fn, o); }
  OnKeyInsert(fn, o){ return this.OnKey(45, fn, o); }
  OnKeyDelete(fn, o){ return this.OnKey(46, fn, o); }
  OnKey0(fn, o){ return this.OnKey(48, fn, o); }
  OnKey1(fn, o){ return this.OnKey(49, fn, o); }
  OnKey2(fn, o){ return this.OnKey(50, fn, o); }
  OnKey3(fn, o){ return this.OnKey(51, fn, o); }
  OnKey4(fn, o){ return this.OnKey(52, fn, o); }
  OnKey5(fn, o){ return this.OnKey(53, fn, o); }
  OnKey6(fn, o){ return this.OnKey(54, fn, o); }
  OnKey7(fn, o){ return this.OnKey(55, fn, o); }
  OnKey8(fn, o){ return this.OnKey(56, fn, o); }
  OnKey9(fn, o){ return this.OnKey(57, fn, o); }
  OnKeyA(fn, o){ return this.OnKey(65, fn, o); }
  OnKeyB(fn, o){ return this.OnKey(66, fn, o); }
  OnKeyC(fn, o){ return this.OnKey(67, fn, o); }
  OnKeyD(fn, o){ return this.OnKey(68, fn, o); }
  OnKeyE(fn, o){ return this.OnKey(69, fn, o); }
  OnKeyF(fn, o){ return this.OnKey(70, fn, o); }
  OnKeyG(fn, o){ return this.OnKey(71, fn, o); }
  OnKeyH(fn, o){ return this.OnKey(72, fn, o); }
  OnKeyI(fn, o){ return this.OnKey(73, fn, o); }
  OnKeyJ(fn, o){ return this.OnKey(74, fn, o); }
  OnKeyK(fn, o){ return this.OnKey(75, fn, o); }
  OnKeyL(fn, o){ return this.OnKey(76, fn, o); }
  OnKeyM(fn, o){ return this.OnKey(77, fn, o); }
  OnKeyN(fn, o){ return this.OnKey(78, fn, o); }
  OnKeyO(fn, o){ return this.OnKey(79, fn, o); }
  OnKeyP(fn, o){ return this.OnKey(80, fn, o); }
  OnKeyQ(fn, o){ return this.OnKey(81, fn, o); }
  OnKeyR(fn, o){ return this.OnKey(82, fn, o); }
  OnKeyS(fn, o){ return this.OnKey(83, fn, o); }
  OnKeyT(fn, o){ return this.OnKey(84, fn, o); }
  OnKeyU(fn, o){ return this.OnKey(85, fn, o); }
  OnKeyV(fn, o){ return this.OnKey(86, fn, o); }
  OnKeyW(fn, o){ return this.OnKey(87, fn, o); }
  OnKeyX(fn, o){ return this.OnKey(88, fn, o); }
  OnKeyY(fn, o){ return this.OnKey(89, fn, o); }
  OnKeyZ(fn, o){ return this.OnKey(90, fn, o); }
  OnKeyLeftWindowKey(fn, o){ return this.OnKey(91, fn, o); }
  OnKeyRightWindowKey(fn, o){ return this.OnKey(92, fn, o); }
  OnKeySelectKey(fn, o){ return this.OnKey(93, fn, o); }
  OnKeyNumpad0(fn, o){ return this.OnKey(96, fn, o); }
  OnKeyNumpad1(fn, o){ return this.OnKey(97, fn, o); }
  OnKeyNumpad2(fn, o){ return this.OnKey(98, fn, o); }
  OnKeyNumpad3(fn, o){ return this.OnKey(99, fn, o); }
  OnKeyNumpad4(fn, o){ return this.OnKey(100, fn, o); }
  OnKeyNumpad5(fn, o){ return this.OnKey(101, fn, o); }
  OnKeyNumpad6(fn, o){ return this.OnKey(102, fn, o); }
  OnKeyNumpad7(fn, o){ return this.OnKey(103, fn, o); }
  OnKeyNumpad8(fn, o){ return this.OnKey(104, fn, o); }
  OnKeyNumpad9(fn, o){ return this.OnKey(105, fn, o); }
  OnKeyMultiply(fn, o){ return this.OnKey(106, fn, o); }
  OnKeyAdd(fn, o){ return this.OnKey(107, fn, o); }
  OnKeySubtract(fn, o){ return this.OnKey(109, fn, o); }
  OnKeyDecimalPoint(fn, o){ return this.OnKey(110, fn, o); }
  OnKeyDivide(fn, o){ return this.OnKey(111, fn, o); }
  OnKeyF1(fn, o){ return this.OnKey(112, fn, o); }
  OnKeyF2(fn, o){ return this.OnKey(113, fn, o); }
  OnKeyF3(fn, o){ return this.OnKey(114, fn, o); }
  OnKeyF4(fn, o){ return this.OnKey(115, fn, o); }
  OnKeyF5(fn, o){ return this.OnKey(116, fn, o); }
  OnKeyF6(fn, o){ return this.OnKey(117, fn, o); }
  OnKeyF7(fn, o){ return this.OnKey(118, fn, o); }
  OnKeyF8(fn, o){ return this.OnKey(119, fn, o); }
  OnKeyF9(fn, o){ return this.OnKey(120, fn, o); }
  OnKeyF10(fn, o){ return this.OnKey(121, fn, o); }
  OnKeyF11(fn, o){ return this.OnKey(122, fn, o); }
  OnKeyF12(fn, o){ return this.OnKey(123, fn, o); }
  OnKeyNumLock(fn, o){ return this.OnKey(144, fn, o); }
  OnKeyScrollLock(fn, o){ return this.OnKey(145, fn, o); }
  OnAudioVolumeMute(fn, o){ return this.OnKey(173, fn, o); }
  OnAudioVolumeDown(fn, o){ return this.OnKey(174, fn, o); }
  OnAudioVolumeUp(fn, o){ return this.OnKey(175, fn, o); }
  OnLaunchMediaPlayer(fn, o){ return this.OnKey(181, fn, o); }
  OnLaunchApplication1(fn, o){ return this.OnKey(182, fn, o); }
  OnLaunchApplication2(fn, o){ return this.OnKey(183, fn, o); }
  OnKeySemiColon(fn, o){ return this.OnKey(186, fn, o); }
  OnKeyEqualSign(fn, o){ return this.OnKey(187, fn, o); }
  OnKeyComma(fn, o){ return this.OnKey(188, fn, o); }
  OnKeyDash(fn, o){ return this.OnKey(189, fn, o); }
  OnKeyPeriod(fn, o){ return this.OnKey(190, fn, o); }
  OnKeyForwardSlash(fn, o){ return this.OnKey(191, fn, o); }
  OnKeyGraveAccent(fn, o){ return this.OnKey(192, fn, o); }
  OnKeyOpenBracket(fn, o){ return this.OnKey(219, fn, o); }
  OnKeyBackSlash(fn, o){ return this.OnKey(220, fn, o); }
  OnKeyCloseBraket(fn, o){ return this.OnKey(221, fn, o); }
  OnKeySingleQuote(fn, o){ return this.OnKey(222, fn, o); }

  //---------------------------------
  // Styles
  //---------------------------------
  // Helpers
  TimeCSS(a){ return a; }
  SizeCSS(a){ return a; }
  CubicBezierCSS(a, b = "end"){ return `steps(${a}, ${b})`; }
  CubicBezierCSS(a, b, c, d){ return `cubic-bezier(${a}, ${b}, ${c}, ${d})`; }

  WhiteCSS(){ return; }
  BlackCSS(){ return; }
  LightCSS(){ return; }
  DarkCSS(){ return; }
  PrimaryCSS(){ return; }
  SecondaryCSS(){ return; }
  InfoCSS(){ return; }
  LinkCSS(){ return; }
  SuccessCSS(){ return; }
  WarningCSS(){ return; }
  DangerCSS(){ return; }
  GreyCSS(){ return; }
  RedCSS(){ return; }
  OrangeCSS(){ return; }
  YellowCSS(){ return; }
  GreenCSS(){ return; }
  TealCSS(){ return; }
  BlueCSS(){ return; }
  IndigoCSS(){ return; }
  PurpleCSS(){ return; }
  PinkCSS(){ return; }

  Apply(action, args)
  {
    switch (action)
    {
      case "animation": return this.Animation.apply(this, args);
      case "appearance": return this.AppearanceDefault.apply(this, args);
      case "-webkit-appearance": return this.AppearanceWebkit.apply(this, args);
      case "-moz-appearance": return this.AppearanceMoz.apply(this, args);
      case "color": return this.Color.apply(this, args);
      case "align-items": return this.AlignItems.apply(this, args);
      case "align-self": return this.AlignSelf.apply(this, args);
      case "place-self": return this.PlaceSelf.apply(this, args);
      case "align-content": return this.AlignContent.apply(this, args);
      case "justify-content": return this.JustifyContent.apply(this, args);
      case "place-content": return this.PlaceContent.apply(this, args);
      case "justify-items": return this.JustifyItems.apply(this, args);
      case "place-items": return this.PlaceItems.apply(this, args);
      case "justify-self": return this.JustifySelf.apply(this, args);
      case "background": return this.Background.apply(this, args);
      case "background-attachment": return this.BackgroundAttachment.apply(this, args);
      case "background-clip": return this.BackgroundClip.apply(this, args);
      case "background-color": return this.BackgroundColor.apply(this, args);
      case "background-image": return this.BackgroundImage.apply(this, args);
      case "background-position": return this.BackgroundPosition.apply(this, args);
      case "background-repeat": return this.BackgroundRepeat.apply(this, args);
      case "background-origin": return this.BackgroundOrigin.apply(this, args);
      case "background-size": return this.BackgroundSize.apply(this, args);
      case "box-shadow": return this.BackgroundShadow.apply(this, args);
      case "box-sizing": return this.BoxSizing.apply(this, args);
      case "box-shadow": return this.BoxShadow.apply(this, args);
      case "border": return this.Border.apply(this, args);
      case "border-width": return this.BorderWidth.apply(this, args);
      case "border-style": return this.BorderStyle.apply(this, args);
      case "border-color": return this.BorderColor.apply(this, args);
      case "border-image": return this.BorderImage.apply(this, args);
      case "border-radius": return this.BorderRadius.apply(this, args);
      case "border-top-left-radius": return this.BorderTopLeftRadius.apply(this, args);
      case "border-top-right-radius": return this.BorderTopRightRadius.apply(this, args);
      case "border-bottom-left-radius": return this.BorderBottomLeftRadius.apply(this, args);
      case "border-bottom-right-radius": return this.BorderBottomRightRadius.apply(this, args);
      case "border-width": return this.BorderWidth.apply(this, args);
      case "border-left-width": return this.BorderLeftWidth.apply(this, args);
      case "border-right-width": return this.BorderRightWidth.apply(this, args);
      case "border-top-width": return this.BorderTopWidth.apply(this, args);
      case "border-bottom-width": return this.BorderBottomWidth.apply(this, args);
      case "border-left": return this.BorderLeft.apply(this, args);
      case "border-right": return this.BorderRight.apply(this, args);
      case "border-top": return this.BorderTop.apply(this, args);
      case "border-bottom": return this.BorderBottom.apply(this, args);
      case "border-bottom-style": return this.BorderBottomStyle.apply(this, args);
      case "border-bottom-color": return this.BorderBottomColor.apply(this, args);
      case "border-top-style": return this.BorderTopStyle.apply(this, args);
      case "border-top-color": return this.BorderTopColor.apply(this, args);
      case "border-right-style": return this.BorderRightStyle.apply(this, args);
      case "border-right-color": return this.BorderRightColor.apply(this, args);
      case "border-left-style": return this.BorderLeftStyle.apply(this, args);
      case "border-left-color": return this.BorderLeftColor.apply(this, args);
      case "cursor": return this.Cursor.apply(this, args);
      case "display": return this.Display.apply(this, args);
      case "flex": return this.Flex.apply(this, args);
      case "flex-basis": return this.FlexBasis.apply(this, args);
      case "flex-direction": return this.FlexDirection.apply(this, args);
      case "flex-flow": return this.FlexFlow.apply(this, args);
      case "flex-grow": return this.FlexGrow.apply(this, args);
      case "flex-shrink": return this.FlexShrink.apply(this, args);
      case "flex-wrap": return this.FlexWrap.apply(this, args);
      case "float": return this.Float.apply(this, args);
      case "grid": return this.Grid.apply(this, args);
      case "grid-area": return this.GridArea.apply(this, args);
      case "grid-auto-columns": return this.GridAutoColumns.apply(this, args);
      case "grid-auto-flow": return this.GridAutoFlow.apply(this, args);
      case "grid-auto-rows": return this.GridAutoRows.apply(this, args);
      case "grid-column": return this.GridColumn.apply(this, args);
      case "grid-column-start": return this.GridColumnStart.apply(this, args);
      case "grid-column-end": return this.GridColumnEnd.apply(this, args);
      case "grid-row": return this.GridRow.apply(this, args);
      case "grid-row-start": return this.GridRowStart.apply(this, args);
      case "grid-row-end": return this.GridRowEnd.apply(this, args);
      case "grid-template": return this.GridTemplate.apply(this, args);
      case "grid-template-columns": return this.GridTemplateColumns.apply(this, args);
      case "grid-template-rows": return this.GridTemplateRows.apply(this, args);
      case "grid-template-areas": return this.GridTemplateAreas.apply(this, args);
      case "image-orientation": return this.ImageOrientation.apply(this, args);
      case "image-rendering": return this.ImageRendering.apply(this, args);
      case "margin": return this.Margin.apply(this, args);
      case "margin-left": return this.MarginLeft.apply(this, args);
      case "margin-right": return this.MarginRight.apply(this, args);
      case "margin-top": return this.MarginTop.apply(this, args);
      case "margin-bottom": return this.MarginBottom.apply(this, args);
      case "width": return this.Width.apply(this, args);
      case "height": return this.Height.apply(this, args);
      case "max-width": return this.MaxWidth.apply(this, args);
      case "max-height": return this.MaxHeight.apply(this, args);
      case "min-width": return this.MinWidth.apply(this, args);
      case "min-height": return this.MinHeight.apply(this, args);
      case "top": return this.Top.apply(this, args);
      case "bottom": return this.Bottom.apply(this, args);
      case "left": return this.Left.apply(this, args);
      case "right": return this.Right.apply(this, args);
      case "fill": return this.Fill.apply(this, args);
      case "stroke": return this.Stroke.apply(this, args);
      case "stroke-width": return this.StrokeWidth.apply(this, args);
      case "order": return this.Order.apply(this, args);
      case "outline": return this.Outline.apply(this, args);
      case "outline-color": return this.OutlineColor.apply(this, args);
      case "outline-offset": return this.OutlineOffset.apply(this, args);
      case "outline-style": return this.OutlineStyle.apply(this, args);
      case "outline-width": return this.OutlineWidth.apply(this, args);
      case "overflow": return this.Overflow.apply(this, args);
      case "overflow-wrap": return this.OverflowWrap.apply(this, args);
      case "overflow-x": return this.OverflowX.apply(this, args);
      case "overflow-y": return this.OverflowY.apply(this, args);
      case "opacity": return this.Opacity.apply(this, args);
      case "object-fit": return this.ObjectFit.apply(this, args);
      case "padding": return this.Padding.apply(this, args);
      case "padding-left": return this.PaddingLeft.apply(this, args);
      case "padding-right": return this.PaddingRight.apply(this, args);
      case "padding-top": return this.PaddingTop.apply(this, args);
      case "padding-bottom": return this.PaddingBottom.apply(this, args);
      case "position": return this.Position.apply(this, args);
      case "pointer-events": return this.PointerEvents.apply(this, args);
      case "tab-size": return this.TabSize.apply(this, args);
      case "table-layout": return this.TableLayout.apply(this, args);
      case "text-size-adjust": return this.TextSizeAdjust.apply(this, args);
      case "font-family": return this.FontFamily.apply(this, args);
      case "font-weight": return this.FontWeight.apply(this, args);
      case "font-variant-ligatures": return this.FontVariantLigatures.apply(this, args);
      case "font-variant-caps": return this.FontVariantCaps.apply(this, args);
      case "font-variant-numeric": return this.FontVariantNumeric.apply(this, args);
      case "font-variant-east-asian": return this.FontVariantEastAsian.apply(this, args);
      case "font-stretch": return this.FontStretch.apply(this, args);
      case "vertical-align": return this.VerticalAlign.apply(this, args);
      case "-webkit-appearance": return this.WebkitAppearance.apply(this, args);
      case "user-select": return this.UserSelect.apply(this, args);
      case "border-image-source": return this.BorderImageSource.apply(this, args);
      case "border-image-slice": return this.BorderImageSlice.apply(this, args);
      case "border-image-outset": return this.BorderImageOutset.apply(this, args);
      case "border-image-width": return this.BorderImageWidth.apply(this, args);
      case "border-image-repeat": return this.BorderImageRepeat.apply(this, args);
      case "animation-duration": return this.AnimationDuration.apply(this, args);
      case "animation-timing-function": return this.AnimationTimingFunction.apply(this, args);
      case "animation-delay": return this.AnimationDelay.apply(this, args);
      case "animation-iteration-count": return this.AnimationIterationCount.apply(this, args);
      case "animation-direction": return this.AnimationDirection.apply(this, args);
      case "animation-fill-mode": return this.AnimationFillMode.apply(this, args);
      case "animation-play-state": return this.AnimationPlayState.apply(this, args);
      case "animation-name": return this.AnimationName.apply(this, args);
      case "list-style-property": return this.ListStyleProperty.apply(this, args);
      case "list-style-position": return this.ListStylePosition.apply(this, args);
      case "list-style-image": return this.ListStyleImage.apply(this, args);
      case "list-style-type": return this.ListStyleType.apply(this, args);
      case "border-collapse": return this.BorderCollapse.apply(this, args);
      case "-webkit-border-horizontal-spacing": return this.WebkitBorderHorizontalSpacing.apply(this, args);
      case "-webkit-border-vertical-spacing": return this.WebkitBorderVerticalSpacing.apply(this, args);
      case "-webkit-font-smoothing": return this.WebkitFontSmoothing.apply(this, args);
      case "clip": return this.Clip.apply(this, args);
      case "--columnGap": return this.ColumnGap.apply(this, args);
      case "column-gap": return this.ColumnGap.apply(this, args);
      case "background-position-x": return this.BackgroundPositionX.apply(this, args);
      case "background-position-y": return this.BackgroundPositionY.apply(this, args);
      case "background-repeat-x": return this.BackgroundRepeatX.apply(this, args);
      case "background-repeat-y": return this.BackgroundRepeatY.apply(this, args);
      case "transition": return this.Transition.apply(this, args);
      case "transition-delay": return this.TransitionDelay.apply(this, args);
      case "transition-duration": return this.TransitionDuration.apply(this, args);
      case "transition-property": return this.TransitionProperty.apply(this, args);
      case "transition-timing-function": return this.TransitionTimingFunction.apply(this, args);
      case "transform": return this.Transform.apply(this, args);
      case "transform-origin": return this.TransformOrigin.apply(this, args);
      case "transform-origin-left": return this.TransformOriginLeft.apply(this, args);
      case "transform-origin-right": return this.TransformOriginRight.apply(this, args);
      case "translate": return this.Translate.apply(this, args);
      case "turn": return this.Turn.apply(this, args);
      case "rotate": return this.Rotate.apply(this, args);
      case "scale": return this.Scale.apply(this, args);
      case "will-change": return this.WillChange.apply(this, args);
      case "visibility": return this.Visibility.apply(this, args);
      case "white-space": return this.WhiteSpace.apply(this, args);
      case "word-break": return this.WordBreak.apply(this, args);
      case "word-spacing": return this.WordSpacing.apply(this, args);
      case "word-wrap": return this.WordWrap.apply(this, args);
      case "z-index": return this.ZIndex.apply(this, args);
      case "font": return this.Font.apply(this, args);
      case "font-stretch": return this.FontStretch.apply(this, args);
      case "font-variant": return this.FontVariant.apply(this, args);
      case "letter-spacing": return this.LetterSpacing.apply(this, args);
      case "text-decoration": return this.TextDecoration.apply(this, args);
      case "text-decoration-color": return this.TextDecorationColor.apply(this, args);
      case "text-decoration-thickness": return this.TextDecorationThickness.apply(this, args);
      case "text-decoration-line": return this.TextDecorationLine.apply(this, args);
      case "text-decoration-style": return this.TextDecorationStyle.apply(this, args);
      case "text-emphasis": return this.TextEmphasis.apply(this, args);
      case "text-emphasis-color": return this.TextEmphasisColor.apply(this, args);
      case "text-emphasis-position": return this.TextEmphasisPosition.apply(this, args);
      case "text-emphasis-style": return this.TextEmphasisStyle.apply(this, args);
      case "text-indent": return this.TextIndent.apply(this, args);
      case "text-justify": return this.TextJustify.apply(this, args);
      case "text-orientation": return this.TextOrientation.apply(this, args);
      case "text-overflow": return this.TextOverflow.apply(this, args);
      case "text-rendering": return this.TextRendering.apply(this, args);
      case "text-shadow": return this.TextShadow.apply(this, args);
      case "text-underline-offset": return this.TextUnderlineOffset.apply(this, args);
      case "text-underline-position": return this.TextUnderlinePosition.apply(this, args);
      case "text-smoothing": return this.TextSmoothing.apply(this, args);
      case "font-size": return this.FontSize.apply(this, args);
      case "line-break": return this.LineBreak.apply(this, args);
      case "line-height": return this.LineHeight.apply(this, args);
      case "user-select": return this.UserSelect.apply(this, args);
      case "text-align": return this.TextAlign.apply(this, args);
      case "text-transform": return this.TextTransform.apply(this, args);
      case "font-style": return this.FontStyle.apply(this, args);
      case "color": return this.Color.apply(this, args);
      case "resize": return this.Resize.apply(this, args);
      case "list-style-type": return this.ListStyleType.apply(this, args);
      case "content": return this.Content.apply(this, args);
      default: return super.Apply(action, args);
    }
  }

  ApplyEach(actions)
  {
    let result = this;

    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const args   = actions[i + 1];

      result = result.Apply(action, args);
    }

    return result;
  }

  ApplyArray(array)
  {
    let result = this;

    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const value  = actions[i + 1];

      let args;
      if (value instanceof Array) // Or Array.isArray?
      {
        args = value;
      }
      else
      {
        args = [value];
      }

      result = result.Apply(action, args);
    }

    return result;
  }

  ApplyObject(object)
  {
    const actions = Object.keys(object);

    let result = this;

    for (let i = 0; i < actions.length; i++)
    {
      const action = actions[i + 0];
      const value  = object[action];

      let args;
      if (value instanceof Array) // Or Array.isArray?
      {
        args = value;
      }
      else
      {
        args = [value];
      }

      result = result.Apply(action, args);
    }

    return result;
  }

  // CSS properties
  Animation(v, i){ return this.SetStyle("animation", v, i); }
  Appearance(v, i){ return this.SetStyle("appearance", v, i); }
  AppearanceNone(i){ return this.Appearance("none", i); }

  Color(v, i){ return this.SetStyle("color", v, i); }
  ColorWhite(i){ return this.Color(this.constructor.GetWhite(), i); }
  ColorBlack(i){ return this.Color(this.constructor.GetBlack(), i); }
  ColorLight(i){ return this.Color(this.constructor.GetLight(), i); }
  ColorDark(i){ return this.Color(this.constructor.GetDark(), i); }
  ColorPrimary(i){ return this.Color(this.constructor.GetPrimary(), i); }
  ColorInfo(i){ return this.Color(this.constructor.GetInfo(), i); }
  ColorLink(i){ return this.Color(this.constructor.GetLink(), i); }
  ColorSuccess(i){ return this.Color(this.constructor.GetSuccess(), i); }
  ColorWarning(i){ return this.Color(this.constructor.GetWarning(), i); }
  ColorDanger(i){ return this.Color(this.constructor.GetDanger(), i); }
  ColorGrey(i){ return this.Color(this.constructor.GetGrey(), i); }
  ColorRed(i){ return this.Color(this.constructor.GetRed(), i); }
  ColorOrange(i){ return this.Color(this.constructor.GetOrange(), i); }
  ColorYellow(i){ return this.Color(this.constructor.GetYellow(), i); }
  ColorGreen(i){ return this.Color(this.constructor.GetGreen(), i); }
  ColorTeal(i){ return this.Color(this.constructor.GetTeal(), i); }
  ColorBlue(i){ return this.Color(this.constructor.GetBlue(), i); }
  ColorIndigo(i){ return this.Color(this.constructor.GetIndigo(), i); }
  ColorPurple(i){ return this.Color(this.constructor.GetPurple(), i); }
  ColorPink(i){ return this.Color(this.constructor.GetPink(), i); }

  AlignItems(v, i){ return this.SetStyle("align-items", v, i); }
  AlignItemsStretch(i){ return this.AlignItems("stretch", i); }
  AlignItemsCenter(i){ return this.AlignItems("center", i); }
  AlignItemsFlexStart(i){ return this.AlignItems("flex-start", i); }
  AlignItemsFlexEnd(i){ return this.AlignItems("flex-end", i); }
  AlignItemsStretch(i){ return this.AlignItems("stretch", i); }
  AlignItemsStart(i){ return this.AlignItems("flex-start", i); }
  AlignItemsCenter(i){ return this.AlignItems("center", i); }
  AlignItemsEnd(i){ return this.AlignItems("flex-end", i); }
  AlignItemsBaseline(i){ return this.AlignItems("baseline", i); }

  AlignSelf(v, i){ return this.SetStyle("align-self", v, i); }
  AlignSelfAuto(i){ return this.AlignSelf("auto", i); }
  AlignSelfStretch(i){ return this.AlignSelf("stretch", i); }
  AlignSelfStart(i){ return this.AlignSelf("flex-start", i); }
  AlignSelfCenter(i){ return this.AlignSelf("center", i); }
  AlignSelfEnd(i){ return this.AlignSelf("flex-end", i); }
  PlaceSelf(v, i){ return this.SetStyle("place-self", v, i); }

  AlignContent(v, i){ return this.SetStyle("align-content", v, i); }
  AlignContentStart(i){ return this.AlignContent("flex-start", i); }
  AlignContentCenter(i){ return this.AlignContent("center", i); }
  AlignContentEnd(i){ return this.AlignContent("flex-end", i); }
  AlignContentSpaceBetween(i){ return this.AlignContent("space-between", i); }
  AlignContentSpaceAround(i){ return this.AlignContent("space-around", i); }
  AlignContentStretch(i){ return this.AlignContent("stretch", i); }

  JustifyContent(v, i){ return this.SetStyle("justify-content", v, i); }
  JustifyContentStart(i){ return this.JustifyContent("flex-start", i); }
  JustifyContentCenter(i){ return this.JustifyContent("center", i); }
  JustifyContentEnd(i){ return this.JustifyContent("flex-end", i); }
  JustifyContentSpaceBetween(i){ return this.JustifyContent("space-between", i); }
  JustifyContentSpaceAround(i){ return this.JustifyContent("space-around", i); }
  JustifyContentStretch(i){ return this.JustifyContent("stretch", i); }

  PlaceContent(v, i){ return this.SetStyle("place-content", v, i); }
  PlaceContentStart(i){ return this.PlaceContent("start", i); }
  PlaceContentCenter(i){ return this.PlaceContent("center", i); }
  PlaceContentEnd(i){ return this.PlaceContent("end", i); }
  PlaceContentLeft(i){ return this.PlaceContent("left", i); }
  PlaceContentRight(i){ return this.PlaceContent("right", i); }

  JustifyItems(v, i){ return this.SetStyle("justify-items", v, i); }
  JustifyItemsStart(i){ return this.JustifyItems("start", i); }
  JustifyItemsCenter(i){ return this.JustifyItems("center", i); }
  JustifyItemsEnd(i){ return this.JustifyItems("end", i); }
  JustifyItemsLeft(i){ return this.JustifyItems("left", i); }
  JustifyItemsRight(i){ return this.JustifyItems("right", i); }

  PlaceItems(v, i){ return this.SetStyle("place-items", v, i); }
  PlaceItemsStart(i){ return this.PlaceItems("start", i); }
  PlaceItemsCenter(i){ return this.PlaceItems("center", i); }
  PlaceItemsEnd(i){ return this.PlaceItems("end", i); }
  PlaceItemsLeft(i){ return this.PlaceItems("left", i); }
  PlaceItemsRight(i){ return this.PlaceItems("right", i); }

  JustifySelf(v, i){ return this.SetStyle("justify-self", v, i); }
  JustifySelfStart(i){ return this.JustifySelf("start", i); }
  JustifySelfCenter(i){ return this.JustifySelf("center", i); }
  JustifySelfEnd(i){ return this.JustifySelf("end", i); }
  JustifySelfLeft(i){ return this.JustifySelf("left", i); }
  JustifySelfRight(i){ return this.JustifySelf("right", i); }

  Background(v, i){ return this.SetStyle("background", v, i); }
  BackgroundAttachment(v, i){ return this.SetStyle("background-attachment", v, i); }
  BackgroundFixed(v, i){ return this.BackgroundAttachment("fixed", i); }
  BackgroundLocal(v, i){ return this.BackgroundAttachment("local", i); }
  BackgroundScroll(v, i){ return this.BackgroundAttachment("scroll", i); }
  BackgroundClip(v, i){ return this.SetStyle("background-image", v, i); }

  BackgroundImage(v, i)
  {
    if (this.IsTrusted())
    {
      return this.SetStyle("background-image", v, i);
    }
    else
    {
      // Attempt to extract the text inside "url(...)" and sanitize it
      const inner = v.replace(/url\(["'`](.*)["'`]\)/ig, "$1");

      if (inner)
      {
        this.SetStyle("background-image", `url("${Sanitize.URL(inner)}")`, i);
      }

      return this;
    }
  }

  BackgroundImageURL(v, i){ return this.BackgroundImage(`url("${v}")`, i); }

  BackgroundPosition(v, i){ return this.SetStyle("background-position", v, i); }
  BackgroundPositionTop(i){ return this.BackgroundPosition("top", i); }
  BackgroundPositionBottom(i){ return this.BackgroundPosition("bottom", i); }
  BackgroundPositionLeft(i){ return this.BackgroundPosition("left", i); }
  BackgroundPositionRight(i){ return this.BackgroundPosition("right", i); }
  BackgroundPositionCenter(i){ return this.BackgroundPosition("center", i); }

  BackgroundRepeat(v, i){ return this.SetStyle("background-repeat", v, i); }
  BackgroundRepeatNoRepeat(i){ return this.BackgroundRepeat("no-repeat", i); }

  BackgroundOrigin(v, i){ return this.SetStyle("background-origin", v, i); }
  BackgroundOriginBorderBox(i){ return this.BackgroundOrigin("border-box", i); }
  BackgroundOriginPaddingBox(i){ return this.BackgroundOrigin("padding-box", i); }
  BackgroundOriginContentBox(i){ return this.BackgroundOrigin("content-box", i); }

  BackgroundSize(v, i){ return this.SetStyle("background-size", v, i); }

  BackgroundColor(v, i){ return this.SetStyle("background-color", v, i); }
  BackgroundColorWhite(i){ return this.BackgroundColor(this.constructor.GetWhite(), i); }
  BackgroundColorBlack(i){ return this.BackgroundColor(this.constructor.GetBlack(), i); }
  BackgroundColorLight(i){ return this.BackgroundColor(this.constructor.GetLight(), i); }
  BackgroundColorDark(i){ return this.BackgroundColor(this.constructor.GetDark(), i); }
  BackgroundColorPrimary(i){ return this.BackgroundColor(this.constructor.GetPrimary(), i); }
  BackgroundColorInfo(i){ return this.BackgroundColor(this.constructor.GetInfo(), i); }
  BackgroundColorLink(i){ return this.BackgroundColor(this.constructor.GetLink(), i); }
  BackgroundColorSuccess(i){ return this.BackgroundColor(this.constructor.GetSuccess(), i); }
  BackgroundColorWarning(i){ return this.BackgroundColor(this.constructor.GetWarning(), i); }
  BackgroundColorDanger(i){ return this.BackgroundColor(this.constructor.GetDanger(), i); }
  BackgroundColorGrey(i){ return this.BackgroundColor(this.constructor.GetGrey(), i); }
  BackgroundColorRed(i){ return this.BackgroundColor(this.constructor.GetRed(), i); }
  BackgroundColorOrange(i){ return this.BackgroundColor(this.constructor.GetOrange(), i); }
  BackgroundColorYellow(i){ return this.BackgroundColor(this.constructor.GetYellow(), i); }
  BackgroundColorGreen(i){ return this.BackgroundColor(this.constructor.GetGreen(), i); }
  BackgroundColorTeal(i){ return this.BackgroundColor(this.constructor.GetTeal(), i); }
  BackgroundColorBlue(i){ return this.BackgroundColor(this.constructor.GetBlue(), i); }
  BackgroundColorIndigo(i){ return this.BackgroundColor(this.constructor.GetIndigo(), i); }
  BackgroundColorPurple(i){ return this.BackgroundColor(this.constructor.GetPurple(), i); }
  BackgroundColorPink(i){ return this.BackgroundColor(this.constructor.GetPink(), i); }
  BackgroundColorTransparent(i){ return this.BackgroundColor("transparent", i); }
  BackgroundColorNone(i){ return this.BackgroundColor("none", i); }

  BackgroundShadow(v, i){ return this.SetStyle("box-shadow", v, i); }
  BackgroundShadowBase(i){ return this.BackgroundShadow(this.constructor.GetShadowBase(), i); }
  BackgroundShadowMD(i){ return this.BackgroundShadow(this.constructor.GetShadowMD(), i); }
  BackgroundShadowLG(i){ return this.BackgroundShadow(this.constructor.GetShadowLG(), i); }
  BackgroundShadowXL(i){ return this.BackgroundShadow(this.constructor.GetShadowXL(), i); }
  BackgroundShadowXL2(i){ return this.BackgroundShadow(this.constructor.GetShadowXL2(), i); }
  BackgroundShadowInner(i){ return this.BackgroundShadow(this.constructor.GetShadowInner(), i); }
  BackgroundShadowOutline(i){ return this.BackgroundShadow(this.constructor.GetShadowOutline(), i); }
  BackgroundShadowTransparent(i){ return this.BackgroundShadow("transparent", i); }
  BackgroundShadowNone(i){ return this.BackgroundShadow("none", i); }

  BoxSizing(v, i){ return this.SetStyle("box-sizing", v, i); }
  BoxSizingContentBox(i){ return this.BoxSizing("content-box", i); }
  BoxSizingBorderBox(i){ return this.BoxSizing("border-box", i); }
  BoxShadow(v, i){ return this.SetStyle("box-shadow", v, i); }

  Border(v, i){ return this.SetStyle("border", v, i); }
  BorderWidth(v, i){ return this.SetStyle("border-width", v, i); }
  BorderStyle(v, i){ return this.SetStyle("border-style", v, i); }

  BorderColor(v, i){ return this.SetStyle("border-color", v, i); }
  BorderColorWhite(i){ return this.BorderColor(this.constructor.GetWhite(), i); }
  BorderColorBlack(i){ return this.BorderColor(this.constructor.GetBlack(), i); }
  BorderColorLight(i){ return this.BorderColor(this.constructor.GetLight(), i); }
  BorderColorDark(i){ return this.BorderColor(this.constructor.GetDark(), i); }
  BorderColorPrimary(i){ return this.BorderColor(this.constructor.GetPrimary(), i); }
  BorderColorInfo(i){ return this.BorderColor(this.constructor.GetInfo(), i); }
  BorderColorLink(i){ return this.BorderColor(this.constructor.GetLink(), i); }
  BorderColorSuccess(i){ return this.BorderColor(this.constructor.GetSuccess(), i); }
  BorderColorWarning(i){ return this.BorderColor(this.constructor.GetWarning(), i); }
  BorderColorDanger(i){ return this.BorderColor(this.constructor.GetDanger(), i); }
  BorderColorGrey(i){ return this.BorderColor(this.constructor.GetGrey(), i); }
  BorderColorRed(i){ return this.BorderColor(this.constructor.GetRed(), i); }
  BorderColorOrange(i){ return this.BorderColor(this.constructor.GetOrange(), i); }
  BorderColorYellow(i){ return this.BorderColor(this.constructor.GetYellow(), i); }
  BorderColorGreen(i){ return this.BorderColor(this.constructor.GetGreen(), i); }
  BorderColorTeal(i){ return this.BorderColor(this.constructor.GetTeal(), i); }
  BorderColorBlue(i){ return this.BorderColor(this.constructor.GetBlue(), i); }
  BorderColorIndigo(i){ return this.BorderColor(this.constructor.GetIndigo(), i); }
  BorderColorPurple(i){ return this.BorderColor(this.constructor.GetPurple(), i); }
  BorderColorPink(i){ return this.BorderColor(this.constructor.GetPink(), i); }

  BorderImage(v, i){ return this.SetStyle("border-image", v, i); }
  BorderRadius(v, i){ return this.SetStyle("border-radius", this.constructor.GetSize(v), i); }
  BorderTopLeftRadius(v, i){ return this.SetStyle("border-top-left-radius", v, i); }
  BorderTopRightRadius(v, i){ return this.SetStyle("border-top-right-radius", v, i); }
  BorderBottomLeftRadius(v, i){ return this.SetStyle("border-bottom-left-radius", v, i); }
  BorderBottomRightRadius(v, i){ return this.SetStyle("border-bottom-right-radius", v, i); }
  BorderLeftRadius(v, i){ return this.BorderTopLeftRadius(v, i).BorderBottomLeftRadius(v, i); }
  BorderRightRadius(v, i){ return this.BorderTopRightRadius(v, i).BorderBottomRightRadius(v, i); }
  BorderTopRadius(v, i){ return this.BorderTopLeftRadius(v, i).BorderTopRightRadius(v, i); }
  BorderBottomRadius(v, i){ return this.BorderBottomLeftRadius(v, i).BorderBottomRightRadius(v, i); }
  BorderWidth(v, i){ return this.SetStyle("border-width", v, i); }
  BorderLeftWidth(v, i){ return this.SetStyle("border-left-width", v, i); }
  BorderRightWidth(v, i){ return this.SetStyle("border-right-width", v, i); }
  BorderTopWidth(v, i){ return this.SetStyle("border-top-width", v, i); }
  BorderBottomWidth(v, i){ return this.SetStyle("border-bottom-width", v, i); }
  BorderLeft(v, i){ return this.SetStyle("border-left", v, i); }
  BorderRight(v, i){ return this.SetStyle("border-right", v, i); }
  BorderTop(v, i){ return this.SetStyle("border-top", v, i); }
  BorderBottom(v, i){ return this.SetStyle("border-bottom", v, i); }
  BorderBottomStyle(v, i){ return this.SetStyle("border-bottom-style", v, i); }
  BorderBottomColor(v, i){ return this.SetStyle("border-bottom-color", v, i); }
  BorderTopStyle(v, i){ return this.SetStyle("border-top-style", v, i); }
  BorderTopColor(v, i){ return this.SetStyle("border-top-color", v, i); }
  BorderRightStyle(v, i){ return this.SetStyle("border-right-style", v, i); }
  BorderRightColor(v, i){ return this.SetStyle("border-right-color", v, i); }
  BorderLeftStyle(v, i){ return this.SetStyle("border-left-style", v, i); }
  BorderLeftColor(v, i){ return this.SetStyle("border-left-color", v, i); }
  BorderStyleNone  (i){ return this.BorderStyle("none"  , i); }
  BorderStyleHidden(i){ return this.BorderStyle("hidden", i); }
  BorderStyleDotted(i){ return this.BorderStyle("dotted", i); }
  BorderStyleDashed(i){ return this.BorderStyle("dashed", i); }
  BorderStyleSolid (i){ return this.BorderStyle("solid" , i); }
  BorderStyleDouble(i){ return this.BorderStyle("double", i); }
  BorderStyleGroove(i){ return this.BorderStyle("groove", i); }
  BorderStyleRidge (i){ return this.BorderStyle("ridge" , i); }
  BorderStyleInset (i){ return this.BorderStyle("inset" , i); }
  BorderStyleOutset(i){ return this.BorderStyle("outset", i); }

  Cursor(v, i){ return this.SetStyle("cursor", v, i); }
  CursorPointer(v, i){ return this.Cursor("pointer", i); }
  CursorHelp(i){ return this.Cursor("help", i); }
  CursorWait(i){ return this.Cursor("wait", i); }
  CursorCrosshair(i){ return this.Cursor("crosshair", i); }
  CursorNotAllowed(i){ return this.Cursor("not-allowed", i); }
  CursorZoomIn(i){ return this.Cursor("zoom-in", i); }
  CursorGrab(i){ return this.Cursor("grab", i); }

  Display(v, i){ return this.SetStyle("display", v, i); }
  DisplayNone(i){ return this.Display("none", i); }
  DisplayBlock(i){ return this.Display("block", i); }
  DisplayInline(i){ return this.Display("inline", i); }
  DisplayInlineBlock(i){ return this.Display("inline-block", i); }
  DisplayTable(i){ return this.Display("table", i); }
  DisplayInlineTable(i){ return this.Display("inline-table", i); }
  DisplayFlex(i){ return this.Display("flex", i); }
  DisplayInlineFlex(i){ return this.Display("inline-flex", i); }
  DisplayGrid(i){ return this.Display("grid", i); }
  DisplayInlineGrid(i){ return this.Display("inline-grid", i); }
  DisplayInitial(i){ return this.Display("initial", i); }

  Flex(v, i){ return this.SetStyle("flex", v, i); }
  FlexBasis(v, i){ return this.SetStyle("flex-basis", v, i); }
  FlexDirection(v, i){ return this.SetStyle("flex-direction", v, i); }
  FlexFlow(v, i){ return this.SetStyle("flex-flow", v, i); }
  FlexGrow(v, i){ return this.SetStyle("flex-grow", v, i); }
  FlexGrow0(i){ return this.FlexGrow("0", i); } // Don't grow
  FlexGrow1(i){ return this.FlexGrow("1", i); } // Grow to fill available space
  FlexShrink(v, i){ return this.SetStyle("flex-shrink", v, i); }
  FlexShrink0(i){ return this.FlexShrink("0", i); } // Don't shrink
  FlexShrink1(i){ return this.FlexShrink("1", i); } // Shrink if needed
  FlexWrap(v, i){ return this.SetStyle("flex-wrap", v, i); }
  FlexWrapNoWrap(i){ return this.FlexWrap("nowrap", i); }
  FlexWrapWrap(i){ return this.FlexWrap("wrap", i); }
  FlexWrapWrapReverse(i){ return this.FlexWrap("wrap-reverse", i); }
  FlexDirectionRow(i){ return this.FlexDirection("row", i); }
  FlexDirectionRowReverse(i){ return this.FlexDirection("row-reverse", i); }
  FlexDirectionColumn(i){ return this.FlexDirection("column", i); }
  FlexDirectionColumnReverse(i){ return this.FlexDirection("column-reverse", i); }
  FlexInitital(i){ return this.Flex("0 1 auto", i); } // Allow a flex item to shrink but not grow
  Flex1(i){ return this.Flex("1 1 0%", i); } // Grow and shrink as needed
  FlexAuto(i){ return this.Flex("1 1 auto", i); } // Grow and shrink as needed, incuding initial size
  FlexNone(i){ return this.Flex("none", i); } // Can't grow/shrink
  FlexCenter(i)
  {
    return this.DisplayFlex(i)
               .JustifyContentCenter(i)
               .AlignItemsCenter(i)
               .AlignContentCenter(i);
  }

  Float(v, i){ return this.SetStyle("float", v, i); }
  FloatNone(i){ return this.Float("none", i); }
  FloatLeft(i){ return this.Float("left", i); }
  FloatRight(i){ return this.Float("right", i); }
  FloatInlineStart(i){ return this.Float("inline-start", i); }
  FloatInlineEnd(i){ return this.Float("inline-end", i); }

  Grid(v, i){ return this.SetStyle("grid", v, i); }
  Gap(v, i){ return this.SetStyle("gap", v, i); }
  GridArea(v, i){ return this.SetStyle("grid-area", v, i); }
  GridAutoColumns(v, i){ return this.SetStyle("grid-auto-columns", v, i); }
  GridAutoFlow(v, i){ return this.SetStyle("grid-auto-flow", v, i); }
  GridAutoRows(v, i){ return this.SetStyle("grid-auto-rows", v, i); }
  GridColumn(v, i){ return this.SetStyle("grid-column", v, i); }
  GridColumnStart(v, i){ return this.SetStyle("grid-column-start", v, i); }
  GridColumnEnd(v, i){ return this.SetStyle("grid-column-end", v, i); }
  GridRow(v, i){ return this.SetStyle("grid-row", v, i); }
  GridRowStart(v, i){ return this.SetStyle("grid-row-start", v, i); }
  GridRowEnd(v, i){ return this.SetStyle("grid-row-end", v, i); }
  GridTemplate(v, i){ return this.SetStyle("grid-template", v, i); }
  GridTemplateColumns(v, i){ return this.SetStyle("grid-template-columns", v, i); }
  GridTemplateRows(v, i){ return this.SetStyle("grid-template-rows", v, i); }
  ColumnGap(v, i){ return this.SetStyle("column-gap", this.constructor.GetSize(v), i); }
  RowGap(v, i){ return this.SetStyle("row-gap", this.constructor.GetSize(v), i); }

  GridTemplateAreas(v, i)
  {
    if (v instanceof window.Array)
    {
      v = `${v.map(row => `"${row}"`).join("\n")}`;
    }

    return this.SetStyle("grid-template-areas", v, i);
  }

  // GridItem(v, i){ return this.SetStyle("grid-item", v, i); }

  ImageOrientation(v, i){ return this.SetStyle("image-orientation", v, i); }
  ImageRendering(v, i){ return this.SetStyle("image-rendering", v, i); }

  Margin(v, i){ return this.SetStyle("margin", this.constructor.GetSize(v), i); }
  MarginLeft(v, i){ return this.SetStyle("margin-left", this.constructor.GetSize(v), i); }
  MarginRight(v, i){ return this.SetStyle("margin-right", this.constructor.GetSize(v), i); }
  MarginTop(v, i){ return this.SetStyle("margin-top", this.constructor.GetSize(v), i); }
  MarginBottom(v, i){ return this.SetStyle("margin-bottom", this.constructor.GetSize(v), i); }
  MarginX(v, i){ return this.MarginLeft(v, i).MarginRight(v, i); }
  MarginY(v, i){ return this.MarginTop(v, i).MarginBottom(v, i); }
  MarginXY(x, y = x, i){ return this.MarginX(x, i).MarginY(y, i); }

  Width(v, i){ return this.SetStyle("width", this.constructor.GetSize(v), i); }
  Height(v, i){ return this.SetStyle("height", this.constructor.GetSize(v), i); }
  Size(a, b, i){ return this.Width(a, i).Height(b, i); }
  MaxWidth(v, i){ return this.SetStyle("max-width", this.constructor.GetSize(v), i); }
  MaxHeight(v, i){ return this.SetStyle("max-height", this.constructor.GetSize(v), i); }
  MaxSize(a, b, i){ return this.MaxWidth(a, i).MaxHeight(b, i); }
  MinWidth(v, i){ return this.SetStyle("min-width", this.constructor.GetSize(v), i); }
  MinHeight(v, i){ return this.SetStyle("min-height", this.constructor.GetSize(v), i); }
  MinSize(a, b, i){ return this.MinWidth(a, i).MinHeight(b, i); }

  Top(v, i){ return this.SetStyle("top", v, i); }
  Bottom(v, i){ return this.SetStyle("bottom", v, i); }
  Left(v, i){ return this.SetStyle("left", v, i); }
  Right(v, i){ return this.SetStyle("right", v, i); }

  // SVG styling
  Fill(v, i){ return this.SetStyle("fill", v, i); }
  Stroke(v, i){ return this.SetStyle("stroke", v, i); }
  StrokeWidth(v, i){ return this.SetStyle("stroke-width", v, i); }

  Order(v, i){ return this.SetStyle("order", v, i); }
  Outline(v, i){ return this.SetStyle("outline", v, i); }

  OutlineColor(v, i){ return this.SetStyle("outline-color", v, i); }
  OutlineColorWhite(i){ return this.OutlineColor(this.constructor.GetWhite(), i); }
  OutlineColorBlack(i){ return this.OutlineColor(this.constructor.GetBlack(), i); }
  OutlineColorLight(i){ return this.OutlineColor(this.constructor.GetLight(), i); }
  OutlineColorDark(i){ return this.OutlineColor(this.constructor.GetDark(), i); }
  OutlineColorPrimary(i){ return this.OutlineColor(this.constructor.GetPrimary(), i); }
  OutlineColorInfo(i){ return this.OutlineColor(this.constructor.GetInfo(), i); }
  OutlineColorLink(i){ return this.OutlineColor(this.constructor.GetLink(), i); }
  OutlineColorSuccess(i){ return this.OutlineColor(this.constructor.GetSuccess(), i); }
  OutlineColorWarning(i){ return this.OutlineColor(this.constructor.GetWarning(), i); }
  OutlineColorDanger(i){ return this.OutlineColor(this.constructor.GetDanger(), i); }
  OutlineColorGrey(i){ return this.OutlineColor(this.constructor.GetGrey(), i); }
  OutlineColorRed(i){ return this.OutlineColor(this.constructor.GetRed(), i); }
  OutlineColorOrange(i){ return this.OutlineColor(this.constructor.GetOrange(), i); }
  OutlineColorYellow(i){ return this.OutlineColor(this.constructor.GetYellow(), i); }
  OutlineColorGreen(i){ return this.OutlineColor(this.constructor.GetGreen(), i); }
  OutlineColorTeal(i){ return this.OutlineColor(this.constructor.GetTeal(), i); }
  OutlineColorBlue(i){ return this.OutlineColor(this.constructor.GetBlue(), i); }
  OutlineColorIndigo(i){ return this.OutlineColor(this.constructor.GetIndigo(), i); }
  OutlineColorPurple(i){ return this.OutlineColor(this.constructor.GetPurple(), i); }
  OutlineColorPink(i){ return this.OutlineColor(this.constructor.GetPink(), i); }

  OutlineOffset(v, i){ return this.SetStyle("outline-offset", v, i); }
  OutlineStyle(v, i){ return this.SetStyle("outline-style", v, i); }
  OutlineStyleNone(i){ return this.OutlineStyle("none", i); }
  OutlineStyleDotted(i){ return this.OutlineStyle("dotted", i); }
  OutlineStyleSolid(i){ return this.OutlineStyle("solid", i); }
  OutlineStyleDashed(i){ return this.OutlineStyle("dashed", i); }
  OutlineStyleDouble(i){ return this.OutlineStyle("double", i); }
  OutlineStyleGroove(i){ return this.OutlineStyle("groove", i); }
  OutlineStyleRidge(i){ return this.OutlineStyle("ridge", i); }
  OutlineStyleInset(i){ return this.OutlineStyle("inset", i); }
  OutlineStyleOutset(i){ return this.OutlineStyle("outset", i); }
  OutlineWidth(v, i){ return this.SetStyle("outline-width", v, i); }
  OutlineNone(i){ return this.Outline("0", i); }

  Overflow(v, i){ return this.SetStyle("overflow", v, i); }
  OverflowAuto(i){ return this.Overflow("auto", i); }
  OverflowScroll(i){ return this.Overflow("scroll", i); }
  OverflowHidden(i){ return this.Overflow("hidden", i); }
  OverflowOverlay(i){ return this.Overflow("overlay", i); }
  OverflowWrap(v, i){ return this.SetStyle("overflow-wrap", v, i); }
  OverflowWrapBreakWord(i){ return this.OverflowWrap("break-word", i); }
  OverflowX(v, i){ return this.SetStyle("overflow-x", v, i); }
  OverflowY(v, i){ return this.SetStyle("overflow-y", v, i); }

  Opacity(v, i){ return this.SetStyle("opacity", v, i); }
  Opacity0 (i){ return this.Opacity(".00", i); }
  Opacity25(i){ return this.Opacity(".25", i); }
  Opacity50(i){ return this.Opacity(".50", i); }
  Opacity75(i){ return this.Opacity(".75", i); }
  Opacity100(i){ return this.Opacity("1", i); }

  ObjectFit(v, i){ return this.SetStyle("object-fit", v, i); }
  ObjectContain(i){ return this.ObjectFit("contain", i); }
  ObjectCover(i){ return this.ObjectFit("cover", i); }
  ObjectFill(i){ return this.ObjectFit("fill", i); }
  ObjectNone(i){ return this.ObjectFit("none", i); }
  ObjectScaleDown(i){ return this.ObjectFit("scale-down", i); }

  Padding(v, i){ return this.SetStyle("padding", this.constructor.GetSize(v), i); }
  PaddingLeft(v, i){ return this.SetStyle("padding-left", this.constructor.GetSize(v), i); }
  PaddingRight(v, i){ return this.SetStyle("padding-right", this.constructor.GetSize(v), i); }
  PaddingTop(v, i){ return this.SetStyle("padding-top", this.constructor.GetSize(v), i); }
  PaddingBottom(v, i){ return this.SetStyle("padding-bottom", this.constructor.GetSize(v), i); }
  PaddingX(v, i){ return this.PaddingLeft(v, i).PaddingRight(v, i); }
  PaddingY(v, i){ return this.PaddingTop(v, i).PaddingBottom(v, i); }
  PaddingXY(x, y = x, i){ return this.PaddingX(x, i).PaddingY(y, i); }

  Position(v, i){ return this.SetStyle("position", v, i); }
  PositionAbsolute(i){ return this.Position("absolute", i); }
  PositionRelative(i){ return this.Position("relative", i); }
  PositionStatic(i){ return this.Position("static", i); }
  PositionFixed(i){ return this.Position("fixed", i); }
  PositionSticky(i){ return this.Position("sticky", i); }

  PointerEvents(v, i){ return this.SetStyle("pointer-events", v, i); }
  PointerEventsAuto(i){ return this.PointerEvents("auto", i); }
  PointerEventsNone(i){ return this.PointerEvents("none", i); }
  PointerEventsVisiblePainted(i){ return this.PointerEvents("visiblePainted", i); } // SVG only
  PointerEventsVisibleFill(i){ return this.PointerEvents("visibleFill", i); } // SVG only
  PointerEventsVisibleStroke(i){ return this.PointerEvents("visibleStroke", i); } // SVG only
  PointerEventsVisible(i){ return this.PointerEvents("visible", i); } // SVG only
  PointerEventsPainted(i){ return this.PointerEvents("painted", i); } // SVG only
  PointerEventsFill(i){ return this.PointerEvents("fill", i); } // SVG only
  PointerEventsStroke(i){ return this.PointerEvents("stroke", i); } // SVG only
  PointerEventsAll(i){ return this.PointerEvents("all", i); } // SVG only

  TabSize(v, i){ return this.SetStyle("tab-size", v, i); }
  TableLayout(v, i){ return this.SetStyle("table-layout", v, i); }
  TextSizeAdjust(v, i){ return this.SetStyle("text-size-adjust", v, i); }
  FontFamily(v, i){ return this.SetStyle("font-family", v, i); }
  FontWeight(v, i){ return this.SetStyle("font-weight", v, i); }
  FontFeatureSettings(v, i){ return this.SetStyle("font-feature-settings", v, i); }
  FontVariantLigatures(v, i){ return this.SetStyle("font-variant-ligatures", v, i); }
  FontVariantCaps(v, i){ return this.SetStyle("font-variant-caps", v, i); }
  FontVariantNumeric(v, i){ return this.SetStyle("font-variant-numeric", v, i); }
  FontVariantEastAsian(v, i){ return this.SetStyle("font-variant-east-asian", v, i); }
  FontStretch(v, i){ return this.SetStyle("font-stretch", v, i); }
  VerticalAlign(v, i){ return this.SetStyle("vertical-align", v, i); }
  WebkitAppearance(v, i){ return this.SetStyle("-webkit-appearance", v, i); }
  UserSelect(v, i){ return this.SetStyle("user-select", v, i); }
  BorderImageSource(v, i){ return this.SetStyle("border-image-source", v, i); }
  BorderImageSlice(v, i){ return this.SetStyle("border-image-slice", v, i); }
  BorderImageOutset(v, i){ return this.SetStyle("border-image-outset", v, i); }
  BorderImageWidth(v, i){ return this.SetStyle("border-image-width", v, i); }
  BorderImageRepeat(v, i){ return this.SetStyle("border-image-repeat", v, i); }

  AnimationDuration(v, i){ return this.SetStyle("animation-duration", v, i); }
  AnimationTimingFunction(v, i){ return this.SetStyle("animation-timing-function", v, i); }
  AnimationDelay(v, i){ return this.SetStyle("animation-delay", v, i); }
  AnimationIterationCount(v, i){ return this.SetStyle("animation-iteration-count", v, i); }
  AnimationIterationCountInfinite(i){ return this.AnimationIterationCount("infinite", i); }
  AnimationDirection(v, i){ return this.SetStyle("animation-direction", v, i); }
  AnimationDirectionNormal(i){ return this.AnimationDirection("normal", i); }
  AnimationDirectionReverse(i){ return this.AnimationDirection("reverse", i); }
  AnimationDirectionAlternate(i){ return this.AnimationDirection("alternate", i); }
  AnimationDirectionAlternateReverse(i){ return this.AnimationDirection("alternate-reverse", i); }
  AnimationFillMode(v, i){ return this.SetStyle("animation-fill-mode", v, i); }
  AnimationPlayState(v, i){ return this.SetStyle("animation-play-state", v, i); }
  AnimationName(v, i){ return this.SetStyle("animation-name", v, i); }

  AnimationPlayState(v, i)
  {
    const result = this.SetStyle("animation-play-state", v, i);

    const animations = this.GetAnimations();
    for (let i = 0; i < animations.length; i++)
    {
      const animation = animations[i];

      if (v === "paused")
      {
        animation.pause();
      }
      else if (v === "running")
      {
        animation.play(); // Does play restart it if it's running?
      }
    }

    return result;
  }

  ListStyleProperty(v, i){ return this.SetStyle("list-style-property", v, i); }
  ListStylePosition(v, i){ return this.SetStyle("list-style-position", v, i); }
  ListStyleImage(v, i){ return this.SetStyle("list-style-image", v, i); }
  ListStyleType(v, i){ return this.SetStyle("list-style-type", v, i); }
  BorderCollapse(v, i){ return this.SetStyle("border-collapse", v, i); }

  WebkitBorderHorizontalSpacing(v, i){ return this.SetStyle("-webkit-border-horizontal-spacing", v, i); }
  WebkitBorderVerticalSpacing(v, i){ return this.SetStyle("-webkit-border-vertical-spacing", v, i); }
  WebkitFontSmoothing(v, i){ return this.SetStyle("-webkit-font-smoothing", v, i); }
  Clip(v, i){ return this.SetStyle("clip", v, i); }
  // ColumnGap(v, i){ return this.SetStyle("--columnGap", v, i); }
  BackgroundPositionX(v, i){ return this.SetStyle("background-position-x", v, i); }
  BackgroundPositionY(v, i){ return this.SetStyle("background-position-y", v, i); }
  BackgroundRepeatX(v, i){ return this.SetStyle("background-repeat-x", v, i); }
  BackgroundRepeatY(v, i){ return this.SetStyle("background-repeat-y", v, i); }

  Transition(v, i){ return this.SetStyle("transition", v, i); }
  TransitionProperty(v, i){ return this.SetStyle("transition-property", v, i); }
  TransitionDuration(v, i){ return this.SetStyle("transition-duration", this.TimeCSS(v), i); }
  TransitionTimingFunction(v, i){ return this.SetStyle("transition-timing-function", v, i); }
  TransitionTimingFunctionLinear(i){ return this.TransitionTimingFunction("linear", i); }
  TransitionTimingFunctionEaseIn(i){ return this.TransitionTimingFunction("ease-in", i); }
  TransitionTimingFunctionEaseOut(i){ return this.TransitionTimingFunction("ease-out", i); }
  TransitionTimingFunctionEaseInOut(i){ return this.TransitionTimingFunction("ease-in-out", i); }
  TransitionTimingFunctionSteps(a, b, i){ return this.TransitionTimingFunction(this.StepsCSS(a, b), i); }
  TransitionTimingFunctionCubicBezier(a, b, c, d, i){ return this.TransitionTimingFunction(this.CubicBezierCSS(a, b, c, d), i); }
  TransitionDelay(v, i){ return this.SetStyle("transition-delay", v, i); }

  Transform(v, i){ return this.SetStyle("transform", v, i); }
  TransformMatrix(m, i){ return this.AppendStyle("transform", `matrix(${m.join(", ")}`, i); }
  TransformMatrix3D(m, i){ return this.AppendStyle("transform", `matrix3d(${m.join(", ")}`, i); }
  TransformPerspective(v, i){ return this.AppendStyle("transform", `perspective(${this.constructor.ToPixel(v)}`, i); }
  TransformTranslate(x, y, z, i){ return this.AppendStyle("transform", `translate(${this.constructor.ToPixel(x)}, ${this.constructor.ToPixel(y)}, ${this.constructor.ToPixel(z)})`, i); }
  TransformTranslateX(v, i){ return this.AppendStyle("transform", `translateX(${this.constructor.ToPixel(v)})`, i); }
  TransformTranslateY(v, i){ return this.AppendStyle("transform", `translateY(${this.constructor.ToPixel(v)})`, i); }
  TransformTranslateZ(v, i){ return this.AppendStyle("transform", `translateZ(${this.constructor.ToPixel(v)})`, i); }
  TransformTranslate3D(x, y, z, i){ return this.AppendStyle("transform", `translate3d(${x}, ${y}, ${z})`, i); }
  TransformScale(x, y, i){ return this.AppendStyle("transform", `scale(${x}, ${y})`, i); }
  TransformScale3D(x, y, z, i){ return this.AppendStyle("transform", `scale3d(${x}, ${y}, ${z})`, i); }
  TransformScaleX(v, i){ return this.AppendStyle("transform", `scaleX(${v})`, i); }
  TransformScaleY(v, i){ return this.AppendStyle("transform", `scaleY(${v})`, i); }
  TransformScaleZ(v, i){ return this.AppendStyle("transform", `scaleZ(${v})`, i); }
  TransformSkew(x, y, i){ return this.AppendStyle("transform", `skew(${this.constructor.ToDegree(x)}, ${this.constructor.ToDegree(y)})`, i); }
  TransformSkewX(v, i){ return this.AppendStyle("transform", `skewX(${this.constructor.ToDegree(v)})`, i); }
  TransformSkewY(v, i){ return this.AppendStyle("transform", `skewY(${this.constructor.ToDegree(v)})`, i); }
  TransformRotate(v, i){ return this.AppendStyle("transform", `rotate(${this.constructor.ToDegree(v)})`, i, v); }
  TransformRotateX(v, i){ return this.AppendStyle("transform", `rotateX(${this.constructor.ToDegree(v)})`, i); }
  TransformRotateY(v, i){ return this.AppendStyle("transform", `rotateY(${this.constructor.ToDegree(v)})`, i); }
  TransformRotateZ(v, i){ return this.AppendStyle("transform", `rotateZ(${this.constructor.ToDegree(v)})`, i); }
  TransformOrigin(v, i){ return this.SetStyle("transform-origin", v, i); }
  TransformOriginLeft(v, i){ return this.SetStyle("transform-origin-left", v, i); }
  TransformOriginRight(v, i){ return this.SetStyle("transform-origin-right", v, i); }
  Translate(v, i){ return this.SetStyle("translate", v, i); }
  Turn(v, i){ return this.SetStyle("turn", v, i); }
  Rotate(v, i){ return this.SetStyle("rotate", v, i); }
  Scale(v, i){ return this.SetStyle("scale", v, i); }
  WillChange(v, i){ return this.SetStyle("will-change", v, i); }

  Visibility(v, i){ return this.SetStyle("visibility", v, i); }
  VisibilityVisible(i){ return this.Visibility("visible", i); }
  VisibilityHidden(i){ return this.Visibility("hidden", i); }
  VisibilityCollapse(i){ return this.Visibility("collapse", i); }

  WhiteSpace(v, i){ return this.SetStyle("white-space", v, i); }
  WhiteSpaceNormal(i){ return this.WhiteSpace("normal", i); }
  WhiteSpaceNoWrap(i){ return this.WhiteSpace("nowrap", i); }
  WhiteSpacePre(i){ return this.WhiteSpace("pre", i); }
  WhiteSpacePreWrap(i){ return this.WhiteSpace("pre-wrap", i); }
  WhiteSpacePreLine(i){ return this.WhiteSpace("pre-line", i); }
  WhiteSpaceBreakSpaces(i){ return this.WhiteSpace("break-spaces", i); }

  WordBreak(v, i){ return this.SetStyle("word-break", v, i); }
  WordSpacing(v, i){ return this.SetStyle("word-spacing", v, i); }
  WordWrap(v, i){ return this.SetStyle("word-wrap", v, i); }
  WordWrapNormal(i){ return this.WordWrap("normal", i); }

  ZIndex(v, i){ return this.SetStyle("z-index", v, i); }

  BorderTransparent(i){ return this.BorderColor("transparent", i); }

  Font(v, i){ return this.SetStyle("font", v, i); }
  FontStretch(v, i){ return this.SetStyle("font-stretch", v, i); }
  FontVariant(v, i){ return this.SetStyle("font-variant", v, i); }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for these spacings
  LetterSpacing(v, i){ return this.SetStyle("letter-spacing", v, i); }
  LetterSpacingTighter(i){ return this.LetterSpacing("-0.05em", i); }
  LetterSpacingTight(i){ return this.LetterSpacing("-0.025em", i); }
  LetterSpacingNormal(i){ return this.LetterSpacing("0", i); }
  LetterSpacingWide(i){ return this.LetterSpacing("0.025em", i); }
  LetterSpacingWider(i){ return this.LetterSpacing("0.05em", i); }
  LetterSpacingWidest(i){ return this.LetterSpacing("0.1em", i); }

  TextDecoration(v, i){ return this.SetStyle("text-decoration", v, i); }
  TextDecorationNone(i){ return this.TextDecoration("none", i); }

  TextDecorationColor(v, i){ return this.SetStyle("text-decoration-color", v, i); }
  TextDecorationThickness(v, i){ return this.SetStyle("text-decoration-thickness", v, i); }

  TextDecorationLine(v, i){ return this.SetStyle("text-decoration-line", v, i); }
  TextDecorationLineNone(i){ return this.TextDecorationLine("none", i); }
  TextDecorationLineUnderline(i){ return this.TextDecorationLine("underline", i); }
  TextDecorationLineOverline(i){ return this.TextDecorationLine("overline", i); }
  TextDecorationLineLineThrough(i){ return this.TextDecorationLine("line-through", i); }
  TextDecorationLineBlink(i){ return this.TextDecorationLine("blink", i); }

  TextDecorationStyle(v, i){ return this.SetStyle("text-decoration-style", v, i); }
  TextDecorationStyleSolid(i){ return this.TextDecorationStyle("solid", i); }
  TextDecorationStyleDouble(i){ return this.TextDecorationStyle("double", i); }
  TextDecorationStyleDotted(i){ return this.TextDecorationStyle("dotted", i); }
  TextDecorationStyleDashed(i){ return this.TextDecorationStyle("dashed", i); }
  TextDecorationStyleWavy(i){ return this.TextDecorationStyle("wavy", i); }

  TextEmphasis(v, i){ return this.SetStyle("text-emphasis", v, i); }
  TextEmphasisColor(v, i){ return this.SetStyle("text-emphasis-color", v, i); }
  TextEmphasisPosition(v, i){ return this.SetStyle("text-emphasis-position", v, i); }
  TextEmphasisStyle(v, i){ return this.SetStyle("text-emphasis-style", v, i); }
  TextIndent(v, i){ return this.SetStyle("text-indent", v, i); }
  TextJustify(v, i){ return this.SetStyle("text-justify", v, i); }
  TextOrientation(v, i){ return this.SetStyle("text-orientation", v, i); }
  TextOverflow(v, i){ return this.SetStyle("text-overflow", v, i); }
  TextOverflowEllipses(i){ return this.TextOverflow("ellipsis", i); }
  TextRendering(v, i){ return this.SetStyle("text-rendering", v, i); }
  TextShadow(v, i){ return this.SetStyle("text-shadow", v, i); }
  TextUnderlineOffset(v, i){ return this.SetStyle("text-underline-offset", v, i); }
  TextUnderlinePosition(v, i){ return this.SetStyle("text-underline-position", v, i); }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for these weights
  FontWeightHairline(i){ return this.FontWeight("100", i); }
  FontWeightThin(i){ return this.FontWeight("200", i); }
  FontWeightLight(i){ return this.FontWeight("300", i); }
  FontWeightNormal(i){ return this.FontWeight("400", i); }
  FontWeightMedium(i){ return this.FontWeight("500", i); }
  FontWeightSemibold(i){ return this.FontWeight("600", i); }
  FontWeightBold(i){ return this.FontWeight("700", i); }
  FontWeightExtrabold(i){ return this.FontWeight("800", i); }
  FontWeightBlack(i){ return this.FontWeight("900", i); }

  // NOTE: Credit to tailwind (https://tailwindcss.com/) for these sizes
  FontSize(v, i){ return this.SetStyle("font-size", this.constructor.GetSize(v), i); }
  FontSizeXS  (i){ return this.FontSize("0.75rem", i); }
  FontSizeSM  (i){ return this.FontSize("0.875rem", i); }
  FontSizeBase(i){ return this.FontSize("1rem", i); }
  FontSizeLG  (i){ return this.FontSize("1.125rem", i); }
  FontSizeXL  (i){ return this.FontSize("1.25rem", i); }
  FontSizeXL2 (i){ return this.FontSize("1.5rem", i); }
  FontSizeXL3 (i){ return this.FontSize("1.875rem", i); }
  FontSizeXL4 (i){ return this.FontSize("2.25rem", i); }
  FontSizeXL5 (i){ return this.FontSize("3rem", i); }
  FontSizeXL6 (i){ return this.FontSize("4rem", i); }

  LineBreak(v, i){ return this.SetStyle("line-break", v, i); }
  LineBreakAuto(i){ return this.LineBreak("auto", i); }
  LineBreakLoose(i){ return this.LineBreak("loose", i); }
  LineBreakNormal(i){ return this.LineBreak("normal", i); }
  LineBreakStrict(i){ return this.LineBreak("strict", i); }
  LineBreakAnywhere(i){ return this.LineBreak("anywhere", i); }

  LineHeight(v, i){ return this.SetStyle("line-height", v, i); }
  LineHeightNone(i){ return this.LineHeight("1", i); }
  LineHeightTight(i){ return this.LineHeight("1.25", i); }
  LineHeightSnug(i){ return this.LineHeight("1.375", i); }
  LineHeightNormal(i){ return this.LineHeight("1.5", i); }
  LineHeightRelaxed(i){ return this.LineHeight("1.625", i); }
  LineHeightLoose(i){ return this.LineHeight("2", i); }

  UserSelect(v, i){ return this.SetStyle("user-select", v, i); }
  UserSelectNone(i){ return this.UserSelect("none", i); }
  UserSelectText(i){ return this.UserSelect("text", i); }
  UserSelectAll(i){ return this.UserSelect("all", i); }
  UserSelectAuto(i){ return this.UserSelect("auto", i); }

  TextAlign(v, i){ return this.SetStyle("text-align", v, i); }
  TextAlignCenter(i){ return this.TextAlign("center", i); }
  TextAlignJustify(i){ return this.TextAlign("justify", i); }
  TextAlignLeft(i){ return this.TextAlign("left", i); }
  TextAlignRight(i){ return this.TextAlign("left", i); }

  TextTransform(v, i){ return this.SetStyle("text-transform", v, i); }
  TextTransformCapitalize(i){ return this.TextTransform("capitalize", i); }
  TextTransformLowercase(i){ return this.TextTransform("lowercase", i); }
  TextTransformUppercase(i){ return this.TextTransform("uppercase", i); }
  TextTransformNone(i){ return this.TextTransform("none", i); }
  TextTransformFullWidth(i){ return this.TextTransform("full-width", i); }
  TextTransformFullSizeKana(i){ return this.TextTransform("full-size-kana", i); }

  FontStyle(v, i){ return this.SetStyle("font-style", v, i); }
  FontStyleItalic(i){ return this.FontStyle("italic", i); }
  FontStyleNormal(i){ return this.FontStyle("normal", i); }
  FontStyleOblique(i){ return this.FontStyle("oblique", i); }

  TextTruncate(i){ return this.OverflowHidden(i).TextOverflowEllipses(i).WhiteSpaceNoWrap(i); }

  // NOTE: Credit to Bulma (https://bulma.io/) for these font settings
  FontFamilyPrimary(i){ return this.FontFamilySansSerif(i); }
  FontFamilySecondary(i){ return this.FontFamilySansSerif(i); }
  FontFamilyCode(i){ return this.FontFamilyMonoSpace(i); }
  FontFamilySansSerif(i){ return this.FontFamily(`BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;`, i); }
  FontFamilyMonoSpace(i){ return this.FontFamily("monospace", i); }

  Resize(v, i){ return this.SetStyle("resize", v, i); }
  ResizeNone(i){ return this.Resize("none", i); }
  ResizeBoth(i){ return this.Resize("both", i); }
  ResizeVertical(i){ return this.Resize("vertical", i); }
  ResizeHorizontal(i){ return this.Resize("horizontal", i); }
  ResizeY(i){ return this.ResizeVertical(i); }
  ResizeX(i){ return this.ResizeHorizontal(i); }

  ListStyleType(v, i){ return this.SetStyle("list-style-type", v, i); }
  ListStyleTypeSpaceCounter(i){ return this.ListStyleType("space-counter", i); }
  ListStyleTypeDisc(i){ return this.ListStyleType("disc", i); }
  ListStyleTypeCircle(i){ return this.ListStyleType("circle", i); }
  ListStyleTypeSquare(i){ return this.ListStyleType("square", i); }
  ListStyleTypeDecimal(i){ return this.ListStyleType("decimal", i); }
  ListStyleTypeGeorgian(i){ return this.ListStyleType("georgian", i); }
  ListStyleTypeTradChineseInformal(i){ return this.ListStyleType("trad-chinese-informal", i); }
  ListStyleTypeKannada(i){ return this.ListStyleType("kannada", i); }
  ListStyleTypeNone(i){ return this.ListStyleType("none", i); }
  ListStyleTypeInherit(i){ return this.ListStyleType("inherit", i); }
  ListStyleTypeInitial(i){ return this.ListStyleType("initial", i); }
  ListStyleTypeUnset(i){ return this.ListStyleType("unset", i); }
  ListStyleTypeLowerAlpha(i){ return this.ListStyleType("lower-alpha", i); }
  ListStyleTypeUpperAlpha(i){ return this.ListStyleType("upper-alpha", i); }
  ListStyleTypeLowerLatin(i){ return this.ListStyleType("lower-latin", i); }
  ListStyleTypeUpperLatin(i){ return this.ListStyleType("upper-latin", i); }
  ListStyleTypeLowerRoman(i){ return this.ListStyleType("lower-roman", i); }
  ListStyleTypeUpperRoman(i){ return this.ListStyleType("upper-roman", i); }

  Overlayed(i){ return this.PositionAbsolute(i).Left(0, i).Right(0, i).Top(0, i).Bottom(0, i); }
  Flexible(i){ return this.DisplayFlex(i).AlignItemsCenter(i); }
  Antialiased(i){ return this.TextSmoothing("antialiased", "grayscale", i); }
  SubpixelAntialiased(i){ return this.TextSmoothing("auto", "auto", i); }
  Bordered(i){ return this.BorderWidth("1px", i); }
  Rounded(i){ return this.BorderRadius("0.25rem", i); }
  RoundedFull(i){ return this.BorderRadius("9999px", i); }
  Circular(i){ return this.BorderRadius("290486px", i); }
  Wide(i){ return this.Width("100%", i); }
  Tall(i){ return this.Height("100%", i); }

  Contain(v, i){ return this.SetStyle("contain", v, i); }

  Content(v){ return this.SetStyle("content", `"${v}"`); }

  Inset(v, i){ return this.SetStyle("inset", v, i); }

  p(...args){ return new Tags.P().Append(...args); }
  a(...args){ return new Tags.A().Append(...args); }
  div(...args){ return new Tags.Div().Append(...args); }
}

Freeze(Tag);
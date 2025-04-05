import {window} from "/js/Window.js";
import {StringUtilities} from "/js/Utility/String.js";
import {Environment} from "/js/Environment.js";
import {Event} from "/js/Event.js";
import {Queries} from "/js/Tag/Queries.js";
import Freeze from "/js/Utility/Freeze.js";
import loader from "/js/Loader.js";

loader.DepreciateFile(import.meta.url);

const EVENT = Symbol("event");
const NODE = Symbol("node");
const NODE_NAME = Symbol("node_name");
const NODE_VALUE = Symbol("node_value");
const COMPUTED_STYLE = Symbol("computed_style");
const ACTIONS = Symbol("actions");
const RECORD = Symbol("record");
const CODE = Symbol("code");
const HASH = Symbol("hash");

const NODE_NAMES = {};

export class Base extends Queries
{
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

  static GetMetaURL(){ return import.meta.url; }
  static GetNodeNameSymbol(){ return NODE_NAME; }
  static GetNodeValueSymbol(){ return NODE_VALUE; }
  static GetNodeSymbol(){ return NODE; }
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
}

Freeze(Base);

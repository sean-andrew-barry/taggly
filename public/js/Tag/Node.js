import * as Tags from "/js/Tags.js";
import {window} from "/js/Window.js";
import {Symbol as SymbolUtilities} from "/js/Symbol.js";
import Freeze from "/js/Utility/Freeze.js";

const NODE = Symbol("node");
const TAG = Symbol("tag");
const LOCAL_NAME = Symbol("local_name");
const TRUSTED = Symbol("trusted");
const ACTIONS = Symbol("actions");
const DANGEROUS = Symbol("dangerous");
const NODES = new WeakMap(); // TODO: Use this instead of setting node.tag
const CONSTRUCTOR_CACHE = {};
const NODE_VALUES = new WeakMap();
const TRUSTED_SET = new WeakSet();

const TO_NODE = SymbolUtilities.toNode;
const TO_TAG = SymbolUtilities.toTag;

const WindowNode = window.Node;
const WindowEvent = window.Event;
const WindowAttr = window.Attr;
const WindowText = window.Text;
const WindowElement = window.Element;
const WindowHTMLElement = window.HTMLElement;
const WindowHTMLCollection = window.HTMLCollection;

const {
  DOCUMENT_POSITION_DISCONNECTED,
  DOCUMENT_POSITION_PRECEDING,
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_CONTAINS,
  DOCUMENT_POSITION_CONTAINED_BY,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,

  ATTRIBUTE_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE,
  CDATA_SECTION_NODE,
  PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE,
  TEXT_NODE,
} = WindowNode;

let tags_module;
export class Node
{
  static SetTagsModule(value){ tags_module = value; }
  static GetTagsModule(){ return tags_module; }
  static GetModules(){ return tags_module; }
  static GetModule(name){ return this.GetModules()?.[name]; }
  static GetModule(name){ return Tags[name]; }

  static NewModule(name, ...args)
  {
    const mod = this.GetModule(name);
    if (!mod) throw new Error(`No Tag module found for "${name}". It needs to be exported from "/js/Tags.js"`);

    return new mod(...args);
  }

  static GetNodeSymbol(){ return NODE; }
  static GetLocalNameSymbol(){ return LOCAL_NAME; }
  static GetTrustedSymbol(){ return TRUSTED; }
  static GetDangerousSymbol(){ return DANGEROUS; }
  static GetTrustedWeakSet(){ return TRUSTED_SET; }
  static GetActionsSymbol(){ return ACTIONS; }
  static GetNodesWeakMap(){ return NODES; }
  static GetConstructorCacheObject(){ return CONSTRUCTOR_CACHE; }

  static GetTag(node){ return node[TAG]; } // Get the tag for a window.Node
  static HasTag(node){ return node.hasOwnProperty(TAG); }

  // static IsTrusted(node){ return node.hasOwnProperty(TRUSTED); }
  static IsDangerous(node){ return node[this.GetDangerousSymbol()] === true; }
  static IsTrusted(node){ return node[this.GetTrustedSymbol()] === true; }
  static Trust(node){ node[this.GetTrustedSymbol()] = true; return node; }

  // Get/Create the Tag for a DOM Node
  static For(node)
  {
    if (node === undefined || node === null) return node;
    else return this.GetTag(node) ?? this.Wrap(node);
  }

  static CreateLocalName()
  {
    const name = StringUtilities.ToKebabCase(this.name);
    console.warn("Creating local name for", this.name, name);
    return name;
  }

  static GetLocalName(){ return this[this.GetLocalNameSymbol()] ??= this.CreateLocalName(); }
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "node"; }

  static GetNodeValueWeakMap(){ return NODE_VALUE; }
  static SetNodeValue(node, value){ this.GetNodeValueWeakMap().add(node, value); }
  static GetNodeValue(node){ return this.GetNodeValueWeakMap().get(node); }
  static HasNodeValue(node){ return this.GetNodeValueWeakMap().has(node); }

  static IsNodeDangerous(node)
  {
    switch (node.localName ?? node.nodeName)
    {
      case "SCRIPT":
      case "STYLE":
      case "IFRAME":
      case "EMBED":
      case "OBJECT":

      case "script":
      case "style":
      case "iframe":
      case "embed":
      case "object": return true;
      default: return false;
    }
  }

  static CreateNodeText(text)
  {
    const node = window.document.createTextNode(text);

    this.Trust(node);
    node[this.GetTrustedSymbol()] = true;

    return node;
  }

  static Custom(name)
  {
    const node = this.CreateNode(name);

    const tag = new this();

    tag.SetNode(node);

    return tag;
  }

  static CreateNodeComment(text){ return this.Trust(window.document.createComment(text)); }
  static CreateNodeDocument(){ return this.Trust(window.document.createDocument()); }
  static CreateNodeFragment(){ return this.Trust(window.document.createDocumentFragment()); }
  static CreateNodeAttribute(name){ return this.Trust(window.document.createAttribute(name)); }
  static CreateNodeAttributeNS(name, ns){ return this.Trust(window.document.createAttributeNS(ns, name)); }
  static CreateNodeElement(name){ return this.Trust(window.document.createElement(name)); }
  static CreateNodeElementNS(name, ns){ return this.Trust(window.document.createElementNS(ns, name)); }

  static CreateNode(name, ...actions)
  {
    let node;

    switch (name)
    {
      case "#text":
      {
        // NOTE: While this makes some sense from a simplicity/design perspective,
        // it really sucks for performance

        node = window.document.createTextNode("");
      }
      case "#document-fragment":
      {
        node = this.CreateNodeFragment();
        break;
      }
      case "#document":
      {
        node = this.CreateNodeDocument();
        break;
      }
      case "#comment":
      {
        node = this.CreateNodeComment();
        break;
      }
      // They aren't actually called this in the spec,
      // I'm just doing it for design consistency
      case "#attr":
      {
        node = this.CreateNodeAttribute(name);
        break;
      }
      default:
      {
        node = this.CreateNodeElement(name);
        break;
      }
    }

    node[this.GetTrustedSymbol()] = true;
    node[this.GetActionsSymbol()] = actions;

    this.Trust(node);

    return node;
  }

  static TrustAll(node)
  {
    const attributes = node.attributes;
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        this.TrustAll(attributes[i]);
      }
    }

    const children = node.childNodes;
    if (children)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = children[i];

        // Skip past any doctype nodes, because they are confused for additional HTML tags
        if (child.nodeType === 10) continue;

        this.TrustAll(child);
      }
    }

    this.Trust(node);
    return node;
  }

  static GetNameFor(node)
  {
    switch (node.nodeType)
    {
      case ATTRIBUTE_NODE: return "Attr";
      case DOCUMENT_TYPE_NODE: return "DocumentType";
      case COMMENT_NODE: return "Comment";
      case TEXT_NODE: return "Text";
      case DOCUMENT_NODE: return "Document";
      case DOCUMENT_FRAGMENT_NODE:
      {
        // TODO: I don't know if this is actually reliable
        if (node.constructor.name === "ShadowRoot") return "ShadowRoot";
        else return "Fragment";
      }
      default: return node.nodeName;
    }
  }

  static Wrap(node, parent_tag)
  {
    // If it's already wrapped, return the tag
    if (this.HasTag(node)) return this.GetTag(node);

    const name = this.GetNameFor(node);

    const tag_ctor = this.GetModule(name);
    if (!tag_ctor) throw new Error(`Failed to wrap node "${name}" in a tag`);

    // Wrap a new tag around the node
    const tag = new tag_ctor(node);

    const attributes = node.attributes;
    if (attributes)
    {
      for (let i = 0; i < attributes.length; i++)
      {
        this.Wrap(attributes[i], tag);
      }
    }

    const children = node.childNodes;
    if (children)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = children[i];

        this.Wrap(child, tag);
      }
    }

    return tag;
  }

  static Wrap(node, dangerous = true)
  {
    // If it's already wrapped, return the tag
    if (this.HasTag(node)) return this.GetTag(node);

    const name = this.GetNameFor(node);

    const tag_ctor = this.GetModule(name);
    if (!tag_ctor) throw new Error(`Failed to wrap node "${name}" in a tag`);

    const actions = [];

    const attributes = node.attributes;

    // const actions = new Array(attributes?.length ?? 0);
    if (attributes)
    {
      while (attributes.length > 0)
      {
        const attribute = attributes[0];

        actions.push(attribute.name ?? attribute.localName, [attribute.value]);
        node.removeAttributeNode(attribute);
      }

      // for (let i = attributes.length - 1; i >= 0; i--)
      // {
      //   const attribute = attributes[i];
      //   actions.push(attribute.name ?? attribute.localName, [attribute.value]);
      //
      //   node.removeAttributeNode(attribute);
      // }
    }

    const children = node.childNodes;
    if (children)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = children[i];

        this.Wrap(child);
      }
    }

    // return tag_ctor.From(actions, node);

    // node[this.GetTrustedSymbol()] = false;
    node[this.GetActionsSymbol()] = actions;

    // Wrap a new tag around the node
    const tag = new tag_ctor(node);

    // for (let i = 0; i < actions.length; i += 2)
    // {
    //   const action = actions[i];
    //   const args = actions[i + 1];
    //
    //   tag.Apply(action, args);
    // }

    return tag;
  }

  static Wrap(node, is_dangerous = true)
  {
    // If it's already wrapped, return the tag
    if (this.HasTag(node)) return this.GetTag(node);

    const name = this.GetNameFor(node);

    const tag_ctor = this.GetModule(name);
    if (!tag_ctor) throw new Error(`Failed to wrap node "${name}" in a tag`);

    const actions = [];
    // const actions = new Array(attributes?.length ?? 0);

    node[this.GetTrustedSymbol()] = false;
    node[this.GetDangerousSymbol()] = is_dangerous;
    node[this.GetActionsSymbol()] = actions;

    if (is_dangerous !== true)
    {
      const attributes = node.attributes;
      if (attributes)
      {
        while (attributes.length > 0)
        {
          const attribute = attributes[0];

          actions.push(attribute.name ?? attribute.localName, [attribute.value]);
          node.removeAttributeNode(attribute);
        }

        // for (let i = attributes.length - 1; i >= 0; i--)
        // {
        //   const attribute = attributes[i];
        //   actions.push(attribute.name ?? attribute.localName, [attribute.value]);
        //
        //   node.removeAttributeNode(attribute);
        // }
      }
    }

    const children = node.childNodes;
    if (children)
    {
      for (let i = 0; i < children.length; i++)
      {
        const child = children[i];

        this.Wrap(child, is_dangerous);
      }
    }

    // Wrap a new tag around the node
    return new tag_ctor(node);
  }

  static From(actions, node)
  {
    const tag = new this(node);

    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i];
      const args = actions[i + 1];

      tag.Apply(action, args);
    }

    return tag;
  }

  // static CSS(selector)
  // {
  //   const css = new tags_module.CSS(selector);
  //
  //   this.GetDocument().GetStyle().AppendChild(css);
  //   // const global_style = tags_module.Style.GetGlobalStyle();
  //   // global_style.AppendChild(css);
  //
  //   return css;
  // }
  //
  // static CSS(...args)
  // {
  //   return new tags_module.CSS(...args);
  // }

  #node;

  constructor(node)
  {
    // Freeze(this);

    if (node && node instanceof WindowNode)
    {
      this.SetNode(node);
    }
  }

  destructor()
  {
    // console.log("Destructed node", this.GetLocalName());

    // const node = this.GetNode();
    //
    // NODES.delete(node);
    //
    // delete this[NODE];
  }

  CreateNode(name = this.constructor.GetLocalName())
  {
    const node = this.constructor.CreateNode(name);

    this.SetNode(node);

    return node;
  }

  // When you create a Tag, all of its attributes and children MUST also become tags
  SetNode(node)
  {
    if (!node.hasOwnProperty("tag"))
    {
      node.tag = this; // TODO: Set this with a descriptor and warn on its use
    }

    // NODES.set(node, this);
    // NODES.set(this, node); // QUESTION: Double map it and use it for tag.GetNode()?

    this.#node = node; // Or use double mapping like above?
    node[TAG] = this;

    if (node.hasOwnProperty(ACTIONS))
    {
      const actions = node[ACTIONS];
      this.ApplyEach(actions);
    }

    // if (!this.constructor.IsTrusted(node))
    // {
    //   if (this.Trust(node) === true)
    //   {
    //     this.constructor.Trust(node);
    //   }
    //   else
    //   {
    //     // Create a trusted fragment and assign it to this tag
    //     return this.SetNode(this.constructor.CreateNodeFragment());
    //   }
    // }

    return this;
  }

  // HasNode(){ return this[NODE] !== undefined; }
  HasNode(){ return this.#node !== undefined; }

  Node(node)
  {
    this.SetNode(node);
    return this;
  }

  // GetNode(){ return this[NODE] ??= this.CreateNode(); }
  GetNode(){ return this.#node ??= this.CreateNode(); }

  [TO_NODE](){ return this.GetNode(); }

  InsertBefore(child, node)
  {
    node = this.Convert(node);

    if (child)
    {
      this.GetNode().insertBefore(node, this.Convert(child));
    }
    else
    {
      this.GetNode().insertBefore(node, null);
    }

    return this;
  }

  ReplaceChild(child, replacement)
  {
    this.GetNode().replaceChild(this.Convert(replacement), this.Convert(child));
    return this;
  }

  RemoveChild(child)
  {
    if (child !== undefined) this.GetNode().removeChild(this.Convert(child));
    return this;
  }

  AppendChild(child)
  {
    child = this.Convert(child);
    if (child !== undefined) this.GetNode().appendChild(child);
    return this;
  }

  Clear()
  {
    let child = this.GetFirstChildNode();

    while (child)
    {
      if (child.tag) this.RemoveChild(child);
      else this.GetNode().removeChild(child);

      child = this.GetFirstChildNode();
    }

    return this;
  }

  Text(text)
  {
    if (typeof(text) === "string")
    {
      text = this.constructor.CreateNodeText(text);
      // this.GetNode().textContent = text;
    }

    this.Clear().AppendChild(text);

    return this;
  }

  CreateNode(node)
  {
    if (!node)
    {
      const name = this.constructor.GetLocalName();
      node = this.constructor.CreateNode(name);
    }

    this.SetNode(node);

    return node;
  }

  Trust(node)
  {
    return this.constructor.IsNodeDangerous(node) === false;

    // console.log("Untrusted node", this.constructor.name, node.localName || node.nodeName, node);
    // return this.constructor.Trust(node);
    // return true;
  }

  GetTargetNode(){ return this.GetNode(); }
  GetNodeName(){ return this.GetNode().nodeName; }
  GetLocalName(){ return this.constructor.GetLocalName(); }

  GetValue(){ return this.GetNode()?.value; }

  GetParentNode(){ return this.GetNode().parentNode; }
  GetOffsetParentNode(){ return this.GetNode().offsetParent; }
  GetFirstChildNode(){ return this.GetNode().firstChild; }
  GetLastChildNode(){ return this.GetNode().lastChild; }
  GetPrevSiblingNode(){ return this.GetNode().previousSibling; }
  GetNextSiblingNode(){ return this.GetNode().nextSibling; }
  GetChildCount(){ return this.GetNode().childNodes.length; }
  GetChildNodes(){ return this.GetNode().childNodes; }
  GetChildrenCount(){ return this.GetNode().children.length; }
  GetChildNode(i = 0){ return this.GetChildNodes()[i]; }
  GetShadowNode(){ return this.GetNode().shadowRoot; }
  GetNodeType(){ return this.GetNode().nodeType; }

  GetDepth()
  {
    let depth = 0;

    let parent = this.GetParentNode();
    while (parent)
    {
      depth += 1;
      parent = parent.GetParentNode();
    }

    return depth;
  }

  GetIndex()
  {
    let count = -1;

    let node = this.GetNode();
    while (node)
    {
      count += 1;
      node = node.previousSibling;
    }

    return count;
  }

  IsText(){ return (this.GetNode() instanceof window.Text); }
  IsNode(){ return (this.GetNode() instanceof window.Node); }
  IsElement(){ return (this.GetNode() instanceof window.HTMLElement); }
  IsCustom(){ return (this.GetNode() instanceof window.HTMLUnknownElement); }
  IsChecked(){ return this.GetNode().checked === true; }
  IsDisabled(){ return this.GetNode().disabled === true; }

  IsElementNode(){ return this.GetNodeType() === 1; }
  IsAttributeNode(){ return this.GetNodeType() === 2; } // Depreciated
  IsTextNode(){ return this.GetNodeType() === 3; }
  IsCdataSectionNode(){ return this.GetNodeType() === 4; }
  IsEntityReferenceNode(){ return this.GetNodeType() === 5; } // Depreciated
  IsEntityNode(){ return this.GetNodeType() === 6; } // Depreciated
  IsProcessingInstructionNode(){ return this.GetNodeType() === 7; }
  IsCommentNode(){ return this.GetNodeType() === 8; }
  IsDocumentNode(){ return this.GetNodeType() === 9; }
  IsDocumentTypeNode(){ return this.GetNodeType() === 10; }
  IsDocumentFragmentNode(){ return this.GetNodeType() === 11; }
  IsNotationNode(){ return this.GetNodeType() === 12; } // Depreciated

  ComparePosition(tag, mask){ return this.GetNode().compareDocumentPosition(tag.GetNode()) & mask; }
  IsDisconnected(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_DISCONNECTED); }
  IsPreceding(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_PRECEDING); }
  IsFollowing(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_FOLLOWING); }
  IsContained(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_CONTAINS); }
  IsContainedBy(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_CONTAINED_BY); }
  IsImplementationSpecific(tag){ return this.ComparePosition(tag, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC); }

  IsSame(tag){ return this.GetNode().isSameNode(tag.GetNode()); }
  IsEqual(tag){ return this.GetNode().isEqualNode(tag.GetNode()); }
  HasChildNodes(){ return this.GetNode().hasChildNodes(); }
  HasChildren(){ return this.GetNode().hasChildNodes(); }
  IsParent(){ return this.GetNode().hasChildNodes() === true; }
  IsConnected(v){ return this.GetNode().isConnected === true; }

  GetDocumentNode(){ return this.GetNode().ownerDocument; }
  GetRootNode(){ return this.GetNode().getRootNode(); } // QUESTION: Use { composed: true }?

  [TO_TAG](){ return this; }

  ConvertUndefined(v){ return undefined; }
  ConvertString(v){ return this.ConvertNode(this.constructor.CreateNodeText(v)); }
  ConvertNumber(v){ return this.ConvertNode(this.constructor.CreateNode("number", "value", [v])); }
  ConvertBoolean(v){ return this.ConvertNode(this.constructor.CreateNode("boolean", "value", [v])); }
  ConvertSymbol(v){ return this.ConvertNode(this.constructor.CreateNode("symbol", "value", [v])); }
  ConvertFunction(v){ return this.ConvertNode(this.constructor.CreateNode("function", "value", [v])); }
  ConvertPromise(v){ return this.ConvertNode(this.constructor.CreateNode("promise", "value", [v])); }
  ConvertArray(v){ return this.ConvertNode(this.constructor.CreateNode("array", "value", [v])); }
  ConvertDate(v){ return this.ConvertNode(this.constructor.CreateNode("date", "value", [v])); }
  ConvertRecord(v){ return this.ConvertNode(this.constructor.CreateNode("record", "value", [v])); }
  ConvertTuple(v){ return this.ConvertNode(this.constructor.CreateNode("tuple", "value", [v])); }
  ConvertNull(v){ return this.ConvertNode(this.constructor.CreateNode("null")); }
  ConvertEvent(v){ return this.ConvertNode(this.constructor.CreateNode("event", "value", [v])); }
  ConvertURL(v){ return this.ConvertNode(this.constructor.CreateNode("url", "value", [v])); }
  ConvertPrimitive(v){ return this.Convert(v[Symbol.toPrimitive]()); }
  ConvertCollection(v){ return this.ConvertNode(this.constructor.CreateNode("collection", "value", [v])); }
  ConvertIterable(v){ return this.ConvertNode(this.constructor.CreateNode("iterable", "value", [v])); }
  ConvertAsyncIterable(v){ return this.ConvertNode(this.constructor.CreateNode("async-iterator", "value", [v])); }

  ConvertFunction(v)
  {
    if (v !== Object && v.prototype instanceof Object)
    {
      return this.ConvertClass(v);
    }
    else
    {
      return this.constructor.NewModule("Function", v).GetNode();

      // return this.ConvertNode(this.constructor.CreateNode("function", "value", [v]));
    }
  }

  ConvertFunction(v)
  {
    return this.constructor.NewModule("Function", v).GetNode();
  }

  ConvertError(v){ return this.constructor.CreateNode("error", "value", [v]); }
  ConvertRangeError(v){ return this.ConvertError(v); }
  ConvertEvalError(v){ return this.ConvertError(v); }
  ConvertReferenceError(v){ return this.ConvertError(v); }
  ConvertSyntaxError(v){ return this.ConvertError(v); }
  ConvertTypeError(v){ return this.ConvertError(v); }
  ConvertURIError(v){ return this.ConvertError(v); }

  ConvertNull(v){ return this.constructor.NewModule("Null", v).GetNode(); }
  ConvertBoolean(v){ return this.constructor.NewModule("Boolean", v).GetNode(); }
  ConvertURL(v){ return this.constructor.NewModule("URL", v).GetNode(); }
  ConvertCollection(v){ return this.constructor.NewModule("Collection", v).GetNode(); }
  ConvertIterable(v){ return this.constructor.NewModule("Iterable", v).GetNode(); }
  ConvertAsyncIterable(v){ return this.constructor.NewModule("AsyncIterable", v).GetNode(); }
  ConvertTuple(v){ return this.constructor.NewModule("Tuple", v).GetNode(); }
  ConvertRecord(v){ return this.constructor.NewModule("Record", v).GetNode(); }
  ConvertSymbol(v){ return this.constructor.NewModule("Symbol", v).GetNode(); }
  ConvertDate(v){ return this.constructor.NewModule("Date", v).GetNode(); }
  ConvertPromise(v){ return this.constructor.NewModule("Promise", v).GetNode(); }
  ConvertEvent(v){ return this.constructor.NewModule("Event", v).GetNode(); }
  ConvertClass(v){ return this.constructor.NewModule("Class", v).GetNode(); }
  ConvertNumber(v){ return this.constructor.NewModule("Number", v).GetNode(); }
  ConvertError(v){ return this.constructor.NewModule("Error", v).GetNode(); }

  ConvertNumber(v){ return new tags_module.Number(v).GetNode(); }
  ConvertString(value){ return new tags_module.Text(value).GetNode(); }

  // ConvertNode(v){ return v; }
  ConvertElement(v){ return this.ConvertNode(v); }
  ConvertComment(v){ return this.ConvertNode(v); }
  ConvertText(v){ return this.ConvertNode(v); }
  ConvertDocument(v){ return this.ConvertNode(v); }
  ConvertFragment(v){ return this.ConvertNode(v); }

  ConvertNode(node)
  {
    return this.constructor.For(node).GetNode();
  }

  ConvertAttr(v){ return this.ConvertNode(v); }

  ConvertTag(v)
  {
    const name = v.GetLocalName() ?? v.GetNodeName();

    // If we haven't seen this name before
    if (!CONSTRUCTOR_CACHE.hasOwnProperty(name))
    {
      // Then cache its constructor, so we can auto-construct it again later
      CONSTRUCTOR_CACHE[name] = v.constructor;
    }

    return v.GetNode();
  }

  ConvertUnknownObject(v){ return this.ConvertNode(this.constructor.CreateNode("plain-object", "value", [v])); }
  ConvertUnknown(v){ return this.ConvertNode(this.constructor.CreateNode("unknown", "value", [v])); }
  ConvertModule(v)
  {
    if (v.default)
    {
      return this.Convert(v.default);
    }
    else
    {
      throw new Error("No default for module", v);
    }
  }

  static Convert()
  {
    return new this().GetNode();
  }

  ConvertClass(v)
  {
    if (v.prototype instanceof Node)
    {
      return v.Convert();
    }

    return this.ConvertNode(this.constructor.CreateNode("class", "value", [v]));
  }

  ConvertObject(v)
  {
    if (v === null) return this.ConvertNull(v);
    // const fn = v[TO_NODE];
    // if (typeof(fn) === "function")
    // {
    //   return fn.call(v);
    // }

    switch (v.constructor)
    {
      case globalThis.Object: return this.ConvertPlainObject(v);
      case globalThis.Date: return this.ConvertDate(v);
      case globalThis.String: return this.ConvertString(v);
      case globalThis.Boolean: return this.ConvertBoolean(v);
      case globalThis.Symbol: return this.ConvertSymbol(v);
      case globalThis.Array: return this.ConvertArray(v);
      case globalThis.Promise: return this.ConvertPromise(v);
      case globalThis.Error: return this.ConvertError(v);
      case globalThis.RangeError: return this.ConvertRangeError(v);
      case globalThis.EvalError: return this.ConvertEvalError(v);
      case globalThis.ReferenceError: return this.ConvertReferenceError(v);
      case globalThis.SyntaxError: return this.ConvertSyntaxError(v);
      case globalThis.TypeError: return this.ConvertTypeError(v);
      case globalThis.URIError: return this.ConvertURIError(v);
      case globalThis.URL: return this.ConvertURL(v);
      case WindowEvent: return this.ConvertEvent(v);
      case WindowAttr: return this.ConvertAttr(v);
      case WindowNode: return this.ConvertNode(v);
      case WindowText: return this.ConvertText(v);
      case WindowElement: return this.ConvertElement(v);
      case WindowHTMLElement: return this.ConvertElement(v);
      case WindowHTMLCollection: return this.ConvertCollection(v);
      // case Node: return this.ConvertTag(v);
    }

    if      (v instanceof Node) return this.ConvertTag(v); // Instance of this Node class, not a DOM Node
    else if (v instanceof globalThis.Array) return this.ConvertArray(v);
    else if (v instanceof globalThis.Promise) return this.ConvertPromise(v);
    else if (v instanceof globalThis.Error) return this.ConvertError(v);
    else if (v instanceof globalThis.Date) return this.ConvertDate(v);
    else if (v instanceof globalThis.URL) return this.ConvertURL(v);
    else if (v instanceof WindowAttr) return this.ConvertAttr(v);
    else if (v instanceof WindowNode) return this.ConvertNode(v);
    else if (v instanceof WindowEvent) return this.ConvertEvent(v);
    else if (v instanceof WindowHTMLCollection) return this.ConvertCollection(v);
    else if (v[Symbol.toStringTag] === "Module") return this.ConvertModule(v);
    else if (typeof(v[Symbol.iterator]) === "function") return this.ConvertIterable(v);
    else if (typeof(v[Symbol.asyncIterator]) === "function") return this.ConvertAsyncIterable(v);
    else if (typeof(v[Symbol.toPrimitive]) === "function") return this.ConvertPrimitive(v);
    else return this.ConvertUnknownObject(v);
  }

  ConvertObject(v, ctor)
  {
    if (v === null) return this.ConvertNull(v);

    if (v.hasOwnProperty(NODE))
    {
      return v[NODE];
    }
    else if (v.hasOwnProperty(TAG))
    {
      return v[TAG].GetNode();
    }
    else
    {
      const toTag = v[TO_TAG];
      if (typeof(toTag) === "function")
      {
        const tag = toTag.call(v, this.constructor.GetTagsModule(), this);
        return this.ConvertTag(tag);
      }
    }

    // if (v[Symbol.toStringTag] === "Module") return this.ConvertModule(v);
    // if (typeof(v[Symbol.iterator]) === "function") return this.ConvertIterable(v);
    // if (typeof(v[Symbol.asyncIterator]) === "function") return this.ConvertAsyncIterable(v);
    // if (typeof(v[Symbol.toPrimitive]) === "function") return this.ConvertPrimitive(v);

    ctor ??= v.constructor;

    switch (ctor)
    {
      case Node: return this.ConvertTag(v);
      case globalThis.Object: return this.ConvertPlainObject(v);
      case globalThis.Date: return this.ConvertDate(v);
      case globalThis.String: return this.ConvertString(v);
      case globalThis.Boolean: return this.ConvertBoolean(v);
      case globalThis.Symbol: return this.ConvertSymbol(v);
      case globalThis.Array: return this.ConvertArray(v);
      case globalThis.Promise: return this.ConvertPromise(v);
      case globalThis.Error: return this.ConvertError(v);
      case globalThis.RangeError: return this.ConvertRangeError(v);
      case globalThis.EvalError: return this.ConvertEvalError(v);
      case globalThis.ReferenceError: return this.ConvertReferenceError(v);
      case globalThis.SyntaxError: return this.ConvertSyntaxError(v);
      case globalThis.TypeError: return this.ConvertTypeError(v);
      case globalThis.URIError: return this.ConvertURIError(v);
      case globalThis.URL: return this.ConvertURL(v);
      case WindowEvent: return this.ConvertEvent(v);
      case WindowAttr: return this.ConvertAttr(v);
      case WindowNode: return this.ConvertNode(v);
      case WindowText: return this.ConvertText(v);
      case WindowElement: return this.ConvertElement(v);
      case WindowHTMLElement: return this.ConvertElement(v);
      case WindowHTMLCollection: return this.ConvertCollection(v);
      default:
      {
        if (v[TO_TAG])
        return this.ConvertObject(v, globalThis.Object.getPrototypeOf(ctor));
      }
    }

    if      (v instanceof Node) return this.ConvertTag(v); // Instance of this Node class, not a DOM Node
    else if (v instanceof globalThis.Array) return this.ConvertArray(v);
    else if (v instanceof globalThis.Promise) return this.ConvertPromise(v);
    else if (v instanceof globalThis.Error) return this.ConvertError(v);
    else if (v instanceof globalThis.Date) return this.ConvertDate(v);
    else if (v instanceof globalThis.URL) return this.ConvertURL(v);
    else if (v instanceof WindowAttr) return this.ConvertAttr(v);
    else if (v instanceof WindowNode) return this.ConvertNode(v);
    else if (v instanceof WindowEvent) return this.ConvertEvent(v);
    else if (v instanceof WindowHTMLCollection) return this.ConvertCollection(v);
    else if (v[Symbol.toStringTag] === "Module") return this.ConvertModule(v);
    else if (typeof(v[Symbol.iterator]) === "function") return this.ConvertIterable(v);
    else if (typeof(v[Symbol.asyncIterator]) === "function") return this.ConvertAsyncIterable(v);
    else if (typeof(v[Symbol.toPrimitive]) === "function") return this.ConvertPrimitive(v);
    else return this.ConvertUnknownObject(v);
  }

  Convert(v)
  {
    switch (typeof(v))
    {
      case "function": return this.ConvertFunction(v);
      case "string": return this.ConvertString(v);
      case "number": return this.ConvertNumber(v);
      case "boolean": return this.ConvertBoolean(v);
      case "symbol": return this.ConvertSymbol(v);
      case "undefined": return this.ConvertUndefined(v);
      case "record": return this.ConvertRecord(v); // Not added to JS yet, but likely will be
      case "tuple": return this.ConvertTuple(v); // Not added to JS yet, but likely will be
      case "object": return this.ConvertObject(v);
      default: return this.ConvertUnknown(v);
    }
  }

  Deconvert(){ return this.GetNode(); }

  GetText(){ return this.GetNode().textContent; }
  IsTrusted(){ return this.constructor.IsTrusted(this.GetNode()); }
  IsDangerous(){ return this.constructor.IsDangerous(this.GetNode()); }

  // This has the default because Edge will render an undefined as "undefined"
  SetProperty(key, value = "")
  {
    this.GetNode()[key] = value;
    return this;
  }
}

Freeze(Node);

import {Node} from "/js/Utility/DOM/Node.js";
import {Attr} from "/js/Utility/DOM/Node/Attr.js";
import {Text} from "/js/Utility/DOM/Node/CharacterData/Text.js";
import {NamedNodeMap} from "/js/Utility/DOM/NamedNodeMap.js";
import {HTMLCollection} from "/js/Utility/DOM/HTMLCollection.js";
import {DOMTokenList} from "/js/Utility/DOM/DOMTokenList.js";
import {DOMRect} from "/js/Utility/DOM/DOMRect.js";
import {Data} from "/js/Utility/DOM/Data.js";
import {MutationObserver} from "/js/Utility/DOM/Observer/MutationObserver.js";

export class Element extends Node
{
  get ariaAtomic() { return this.getAttribute("aria-atomic"); }
  set ariaAtomic(value) { this.setAttribute("aria-atomic", value); }

  get ariaAutoComplete() { return this.getAttribute("aria-autocomplete"); }
  set ariaAutoComplete(value) { this.setAttribute("aria-autocomplete", value); }
  
  get ariaBusy() { return this.getAttribute("aria-busy"); }
  set ariaBusy(value) { this.setAttribute("aria-busy", value); }
  
  get ariaChecked() { return this.getAttribute("aria-checked"); }
  set ariaChecked(value) { this.setAttribute("aria-checked", value); }
  
  get ariaColCount() { return this.getAttribute("aria-colcount"); }
  set ariaColCount(value) { this.setAttribute("aria-colcount", value); }
  
  get ariaColIndex() { return this.getAttribute("aria-colindex"); }
  set ariaColIndex(value) { this.setAttribute("aria-colindex", value); }
  
  get ariaColSpan() { return this.getAttribute("aria-colspan"); }
  set ariaColSpan(value) { this.setAttribute("aria-colspan", value); }
  
  get ariaCurrent() { return this.getAttribute("aria-current"); }
  set ariaCurrent(value) { this.setAttribute("aria-current", value); }
  
  get ariaDescription() { return this.getAttribute("aria-description"); }
  set ariaDescription(value) { this.setAttribute("aria-description", value); }
  
  get ariaDisabled() { return this.getAttribute("aria-disabled"); }
  set ariaDisabled(value) { this.setAttribute("aria-disabled", value); }
  
  get ariaExpanded() { return this.getAttribute("aria-expanded"); }
  set ariaExpanded(value) { this.setAttribute("aria-expanded", value); }
  
  get ariaHasPopup() { return this.getAttribute("aria-haspopup"); }
  set ariaHasPopup(value) { this.setAttribute("aria-haspopup", value); }
  
  get ariaHidden() { return this.getAttribute("aria-hidden"); }
  set ariaHidden(value) { this.setAttribute("aria-hidden", value); }
  
  get ariaKeyShortcuts() { return this.getAttribute("aria-keyshortcuts"); }
  set ariaKeyShortcuts(value) { this.setAttribute("aria-keyshortcuts", value); }
  
  get ariaLabel() { return this.getAttribute("aria-label"); }
  set ariaLabel(value) { this.setAttribute("aria-label", value); }
  
  get ariaLevel() { return this.getAttribute("aria-level"); }
  set ariaLevel(value) { this.setAttribute("aria-level", value); }
  
  get ariaLive() { return this.getAttribute("aria-live"); }
  set ariaLive(value) { this.setAttribute("aria-live", value); }
  
  get ariaModal() { return this.getAttribute("aria-modal"); }
  set ariaModal(value) { this.setAttribute("aria-modal", value); }
  
  get ariaMultiLine() { return this.getAttribute("aria-multiline"); }
  set ariaMultiLine(value) { this.setAttribute("aria-multiline", value); }
  
  get ariaMultiSelectable() { return this.getAttribute("aria-multiselectable"); }
  set ariaMultiSelectable(value) { this.setAttribute("aria-multiselectable", value); }
  
  get ariaOrientation() { return this.getAttribute("aria-orientation"); }
  set ariaOrientation(value) { this.setAttribute("aria-orientation", value); }
  
  get ariaPlaceholder() { return this.getAttribute("aria-placeholder"); }
  set ariaPlaceholder(value) { this.setAttribute("aria-placeholder", value); }
  
  get ariaPosInSet() { return this.getAttribute("aria-posinset"); }
  set ariaPosInSet(value) { this.setAttribute("aria-posinset", value); }
  
  get ariaPressed() { return this.getAttribute("aria-pressed"); }
  set ariaPressed(value) { this.setAttribute("aria-pressed", value); }
  
  get ariaReadOnly() { return this.getAttribute("aria-readonly"); }
  set ariaReadOnly(value) { this.setAttribute("aria-readonly", value); }
  
  get ariaRelevant() { return this.getAttribute("aria-relevant"); }
  set ariaRelevant(value) { this.setAttribute("aria-relevant", value); }
  
  get ariaRequired() { return this.getAttribute("aria-required"); }
  set ariaRequired(value) { this.setAttribute("aria-required", value); }
  
  get ariaRoleDescription() { return this.getAttribute("aria-roledescription"); }
  set ariaRoleDescription(value) { this.setAttribute("aria-roledescription", value); }

  get ariaRowCount() { return this.getAttribute("aria-rowcount"); }
  set ariaRowCount(value) { this.setAttribute("aria-rowcount", value); }

  get ariaRowIndex() { return this.getAttribute("aria-rowindex"); }
  set ariaRowIndex(value) { this.setAttribute("aria-rowindex", value); }

  get ariaRowSpan() { return this.getAttribute("aria-rowspan"); }
  set ariaRowSpan(value) { this.setAttribute("aria-rowspan", value); }

  get ariaSelected() { return this.getAttribute("aria-selected"); }
  set ariaSelected(value) { this.setAttribute("aria-selected", value); }

  get ariaSetSize() { return this.getAttribute("aria-setsize"); }
  set ariaSetSize(value) { this.setAttribute("aria-setsize", value); }

  get ariaSort() { return this.getAttribute("aria-sort"); }
  set ariaSort(value) { this.setAttribute("aria-sort", value); }

  get ariaValueMax() { return this.getAttribute("aria-valuemax"); }
  set ariaValueMax(value) { this.setAttribute("aria-valuemax", value); }

  get ariaValueMin() { return this.getAttribute("aria-valuemin"); }
  set ariaValueMin(value) { this.setAttribute("aria-valuemin", value); }

  get ariaValueNow() { return this.getAttribute("aria-valuenow"); }
  set ariaValueNow(value) { this.setAttribute("aria-valuenow", value); }

  get ariaValueText() { return this.getAttribute("aria-valuetext"); }
  set ariaValueText(value) { this.setAttribute("aria-valuetext", value); }

  get assignedSlot(){ return this.ThrowNotImplemented("assignedSlot"); }
  #attributes = new NamedNodeMap();
  get attributes(){ return this.#attributes; }
  get childElementCount() { return this.#children.length; }
  #children = new HTMLCollection();
  #classList = new DOMTokenList();
  get classList() { return this.#classList; }
  get className() { return this.getAttribute("class") || ""; }
  set className(value) { this.setAttribute("class", value); }
  get clientHeight(){ return 0; }
  get clientLeft(){ return 0; }
  get clientTop(){ return 0; }
  get clientWidth(){ return 0; }
  #elementTiming;

  get firstElementChild() {
    let child = this.firstChild;
    while (child) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        return child;
      }
      child = child.nextSibling;
    }

    return null;
  }

  #id = "";
  get id() { return this.#id; }
  set id(value) { /* ... */ }
  #innerHTML;

  // TODO: Double check the validity of this
  get lastElementChild() {
    let child = this.lastChild;
    while (child) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        return child;
      }
      child = child.previousSibling;
    }
    
    return null;
  }

  #localName;
  #namespaceURI = null;
  get namespaceURI(){ return this.#namespaceURI; }

  get nextElementSibling() {
    let sibling = this.nextSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        return sibling;
      }
      sibling = sibling.nextSibling;
    }
    
    return null;
  }

  #outerHTML;
  get outerHTML() { return this.#outerHTML; }
  set outerHTML(value) { /* ... */ }
  #part;
  #prefix;
  get prefix(){ return null; }

  get previousElementSibling() {
    let sibling = this.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        return sibling;
      }
      sibling = sibling.previousSibling;
    }
  
    return null;
  }

  get scrollHeight(){ return 0; }
  get scrollLeft(){ return 0; }
  get scrollLeftMax(){ return 0; }
  get scrollTop(){ return 0; }
  get scrollTopMax(){ return 0; }
  get scrollWidth(){ return 0; }
  #shadowRoot = null;
  get shadowRoot(){ return this.#shadowRoot; }
  #slot;
  #tagName;
  get tagName(){ return this.#tagName; }

  constructor(tagName, namespaceURI) {
    super();

    this.#tagName = tagName;
    this.#namespaceURI = namespaceURI;
  }

  get nodeType() { return Node.ELEMENT_NODE; }
  get nodeName() { throw new Error(`Element.nodeName should be overridden by its subclasses`); }

  // TODO: Don't think this handles strings properly
  after(...nodes) {
    const parent = this.parentNode;
    if (!parent) return;

    let referenceNode = this.nextSibling;
    for (const node of nodes) {
      // TODO: This should be an internal call
      parent.insertBefore(node, referenceNode, false);
    }

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(parent, {
      type: "childList",
      target: parent,
      addedNodes: nodes,
      removedNodes: [],
    });
  }

  animate(){ return this.ThrowNotImplemented("animate"); }

  append(...nodesOrStrings) {
    for (const nodeOrString of nodesOrStrings) {
      if (typeof nodeOrString === "string") {
        // Create a Text node
        const textNode = new Text(nodeOrString);
        this.appendChild(textNode);
      } else if (nodeOrString instanceof Node) {
        // Append Node
        this.appendChild(nodeOrString);
      } else {
        throw new TypeError("Argument must be a Node or a string");
      }
    }
  }

  attachShadow(){ return this.ThrowNotImplemented("attachShadow"); }

  // TODO: Don't think this handles strings properly
  before(...nodes) {
    const parent = this.parentNode;
    if (!parent) return;

    for (const node of nodes) {
      // TODO: This should be an internal call
      parent.insertBefore(node, this, false);
    }

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(parent, {
      type: "childList",
      target: parent,
      addedNodes: nodes,
      removedNodes: [],
    });
  }

  closest(){ return this.ThrowNotImplemented("closest"); }
  computedStyleMap(){ return this.ThrowNotImplemented("computedStyleMap"); }
  getAnimations(){ return this.ThrowNotImplemented("getAnimations"); }

  getAttribute(name) {
    const attribute = this.#attributes.getNamedItem(name);
    return attribute ? attribute.value : null;
  }

  getAttributeNames() { return [...this.#attributes._keys()]; }
  getAttributeNode(name) { return this.#attributes.getNamedItem(name); }
  getAttributeNodeNS() { return this.ThrowNotImplemented("getAttributeNodeNS"); }
  getAttributeNS() { return this.ThrowNotImplemented("getAttributeNS"); }
  getBoundingClientRect() { return new DOMRect(); }
  getClientRects() { return []; }
  getElementsByClassName() { return this.ThrowNotImplemented("getElementsByClassName"); }
  getElementsByTagName() { return this.ThrowNotImplemented("getElementsByTagName"); }
  getElementsByTagNameNS() { return this.ThrowNotImplemented("getElementsByTagNameNS"); }
  hasAttribute(name) { return !!this.#attributes.getNamedItem(name); }
  hasAttributeNS() { return this.ThrowNotImplemented("hasAttributeNS"); }
  hasAttributes() { return this.#attributes.length > 0; }
  hasPointerCapture() { return this.ThrowNotImplemented("hasPointerCapture"); }

  #insertAtPosition(position, node) {
    switch (position.toLowerCase()) {
      case "beforebegin":
      {
        if (this.parentNode) {
          this.parentNode.insertBefore(node, this);
        }
        break;
      }
      case "afterbegin":
      {
        this.insertBefore(node, this.firstChild);
        break;
      }
      case "beforeend":
      {
        this.appendChild(node);
        break;
      }
      case "afterend":
      {
        if (this.parentNode) {
          this.parentNode.insertBefore(node, this.nextSibling);
        }
        break;
      }
      default:
      {
        throw new SyntaxError(`The value provided ("${position}") is not one of "beforebegin", "afterbegin", "beforeend", or "afterend".`);
      }
    }
  }

  insertAdjacentElement(position, element) {
    if (!(element instanceof Element)) {
      throw new TypeError('Parameter 2 is not of type "Element".');
    }
  
    this.#insertAtPosition(position, element);
  
    return element;
  }

  insertAdjacentHTML(){ return this.ThrowNotImplemented("insertAdjacentHTML"); }

  insertAdjacentText(position, text) {
    const textNode = new Text(text);

    this.#insertAtPosition(position, textNode);
  }

  matches(){ return this.ThrowNotImplemented("matches"); }

  prepend(...nodes) {
    // We reverse the nodes to keep the original order
    // because insertBefore would insert each node at the beginning.
    for (let node of nodes.reverse()) {
      if (typeof node === 'string') {
        // Create a new Text node for each string
        node = new Text(node);
      }
  
      // Insert the node at the beginning of this node's childNodes
      this.insertBefore(node, this.firstChild);
    }
  }

  querySelector(){ return this.ThrowNotImplemented("querySelector"); }
  querySelectorAll(){ return this.ThrowNotImplemented("querySelectorAll"); }
  prepend(){ return this.ThrowNotImplemented("prepend"); }
  releasePointerCapture(){ return this.ThrowNotImplemented("releasePointerCapture"); }

  remove()
  {
    const parent = this.parentNode;
    parent.removeChild(this);
  }

  setAttributeNS() { return this.ThrowNotImplemented("setAttributeNS"); }
  setAttributeNodeNS() { return this.ThrowNotImplemented("setAttributeNodeNS"); }
  removeAttributeNS() { return this.ThrowNotImplemented("removeAttributeNS"); }
  removeAttributeNodeNS() { return this.ThrowNotImplemented("removeAttributeNodeNS"); }

  removeAttributeNode(attribute) { this.#attributes.removeNamedItem(attribute.name); }
  setAttributeNode(attribute) { this.#attributes.setNamedItem(attribute.name, attribute); }

  setAttribute(name, value) {
    let attribute = this.#attributes.getNamedItem(name);
    if (attribute) {
      attribute.value = value;
    } else {
      attribute = new Attr({ name, value, ownerElement: this });
      this.#attributes.setNamedItem(name, attribute);
    }

    // Notify MutationObservers for attribute modification
    Data.get(MutationObserver).Notify(this, {
      type: "attributes",
      target: this,
      attributeName: name,
    });
  }

  removeAttribute(name) {
    this.#attributes.removeNamedItem(name);

    // Notify MutationObservers for attribute removal
    Data.get(MutationObserver).Notify(this, {
      type: "attributes",
      target: this,
      attributeName: name,
    });
  }

  toggleAttribute(name, value = "") {
    let result;
    if (this.hasAttribute(name)) {
      this.removeAttribute(name);
      result = false;
    } else {
      this.setAttribute(name, value);
      result = true;
    }

    // Notify MutationObservers for attribute toggling
    Data.get(MutationObserver).Notify(this, {
      type: "attributes",
      target: this,
      attributeName: name,
    });

    return result;
  }

  setPointerCapture(){ return this.ThrowNotImplemented("setPointerCapture"); }
  scroll(){ return this.ThrowNotImplemented("scroll"); }
  scrollBy(){ return this.ThrowNotImplemented("scrollBy"); }
  scrollTo(){ return this.ThrowNotImplemented("scrollTo"); }
}
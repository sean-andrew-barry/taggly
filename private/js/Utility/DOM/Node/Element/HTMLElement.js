import {DOMStringMap} from "/js/Utility/DOM/DOMStringMap.js";
import {CSSStyleDeclaration} from "/js/Utility/CSSOM/CSSStyleDeclaration.js";

export class HTMLElement extends Element {
  constructor(tagName, namespaceURI = "http://www.w3.org/1999/xhtml") {
    super(tagName, namespaceURI);
  }

  accessKey = "";
  accessKeyLabel;
  contentEditable = "inherit";
  #dataset = new DOMStringMap();
  get dataset() { return this.#dataset; }
  dir = "";
  enterKeyHint;
  hidden = true;
  inert;
  #innerText;
  get innerText() { return this.#innerText; }
  set innerText(value) { /* ... */ }
  inputMode;
  isContentEditable;
  lang;
  nonce;
  get offsetHeight(){ return 0; }
  get offsetLeft(){ return 0; }
  offsetParent = null;
  get offsetTop(){ return 0; }
  get offsetWidth(){ return 0; }
  outerText;
  popover;
  #style = new CSSStyleDeclaration();
  get style() { return this.#style; }
  tabIndex = 0;
  #title = "";
  get title() { return this.#title; }
  set title(value) { /* ... */ }

  // Event handlers
  onclick() { /* ... */ }
  ondblclick() { /* ... */ }
  onmousedown() { /* ... */ }
  // ... other event handlers

  // Methods
  click() { /* ... */ }
  focus() { /* ... */ }
  blur() { /* ... */ }

  // Additional Methods and Properties (Placeholder)
  getBoundingClientRect(){}
  getClientRects(){}
  insertAdjacentElement(){}
  insertAdjacentHTML(){}
  insertAdjacentText(){}
  closest(){}
  matches(){}
  querySelector(){}
  querySelectorAll(){}

  get innerHTML()
  {
    let html = "";

    let child = this.firstChild;
    while (child)
    {
      html += child.outerHTML();
      child = child.nextSibling;
    }

    return html;
  }

  set innerHTML(html){ return this.ThrowNotImplemented("innerHTML"); }

  get outerHTML()
  {
    const name = this.localName;
    let html = "<" + name;

    let attribute = FIRST_ATTRIBUTE_NODES.get(this);
    while (attribute)
    {
      html += `${attribute.name}="${attribute.value}"`;
      attribute = attribute.nextAttribute;
    }

    html += ">";

    let child = this.firstChild;
    while (child)
    {
      html += child.outerHTML();
      child = child.nextSibling;
    }

    html += `<${name}>`;
    return html;
  }

  set outerHTML(html){ return this.ThrowNotImplemented("outerHTML"); }

  // Additional methods and properties would be included in a more complete implementation.
}

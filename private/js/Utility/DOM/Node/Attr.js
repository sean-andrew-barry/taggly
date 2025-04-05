import {Node} from "/js/Utility/DOM/Node.js";

export class Attr extends Node
{
  #value;
  #localName;
  #namespaceURI;
  #ownerElement;
  #prefix;

  constructor({
    value,
    localName,
    ownerElement,
    prefix,
    namespaceURI,
  })
  {
    let nodeName;
    if (prefix === null || prefix === undefined)
    {
      nodeName = localName;
    }
    else
    {
      nodeName = prefix + ":" + localName;
    }

    super({
      nodeType: Node.ATTRIBUTE_NODE,
      nodeName,
    });

    this.#value = value;
    this.#localName = localName;
    this.#prefix = prefix;
    this.#namespaceURI = namespaceURI;
    this.#ownerElement = ownerElement;
  }

  get name(){ return this.nodeName; }

  get value(){ return this.#value; }
  set value(value)
  {
    // TODO: MutationObserver record
    // See: https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/attributes.js#L29
    this.#value = value;
  }

  get prefix(){ return this.#prefix; }
  get localName(){ return this.#localName; }
  get namespaceURI(){ return this.#namespaceURI; }
  get ownerElement(){ return this.#ownerElement; }
  get specified(){ return true; }

  get getRootNode(){ return null; }
  get parentNode(){ return null; }
  get firstChild(){ return null; }
  get lastChild(){ return null; }
  get nextSibling(){ return null; }
  get previousSibling(){ return null; }
}

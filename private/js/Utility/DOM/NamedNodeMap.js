import {Attr} from "/js/Utility/DOM/Node/Attr.js";

// The NamedNodeMap interface represents a collection of Attr objects. Objects inside a NamedNodeMap are not in any particular order, unlike NodeList, although they may be accessed by an index as in an array.

// A NamedNodeMap object is live and will thus be auto-updated if changes are made to its contents internally or elsewhere.

export class NamedNodeMap
{
  #attributes = new Map();
  #orderedAttrs = [];  // For quicker index-based access

  get length() {
    return this.#attributes.size;
  }

  #validateAttribute(attribute) {
    if (!(attribute instanceof Attr)) {
      throw new Error("Invalid attribute");
    }
  }

  item(index) {
    return this.#orderedAttrs[index] || null;
  }

  getNamedItem(name) {
    return this.#attributes.get(name) || null;
  }

  setNamedItem(attribute) {
    this.#validateAttribute(attribute);
    const name = attribute.name;

    // Handle duplicate or existing attributes here if needed

    this.#attributes.set(name, attribute);
    this.#orderedAttrs.push(attribute);
  }

  removeNamedItem(name) {
    const attribute = this.#attributes.get(name);
    if (attribute) {
      this.#attributes.delete(name);
      const index = this.#orderedAttrs.indexOf(attribute);
      if (index > -1) {
        this.#orderedAttrs.splice(index, 1);
      }
    }
  }

  _keys() { return this.#attributes.keys(); }
  _values() { return this.#attributes.values(); }

  // Not part of the spec
  [Symbol.iterator](){ return this.#attributes[Symbol.iterator](); }

  getNamedItemNS(){ return this.ThrowNotImplemented("getNamedItemNS"); }
  setNamedItemNS(){ return this.ThrowNotImplemented("setNamedItemNS"); }
  removeNamedItemNS(){ return this.ThrowNotImplemented("removeNamedItemNS"); }
}

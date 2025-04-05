// The DOMStringMap interface is used for the HTMLElement.dataset/SVGElement.dataset attribute, to represent data for custom attributes added to elements.
export class DOMStringMap {
  #data = new Map();

  // Convert camelCase to dashed-names
  static toDashed(name) {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Convert dashed-names to camelCase
  static toCamelCase(name) {
    return name.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
  }

  setItem(name, value) {
    const dashedName = DOMStringMap.toDashed(name);
    this.#data.set(dashedName, value);
  }

  getItem(name) {
    const dashedName = DOMStringMap.toDashed(name);
    return this.#data.get(dashedName) || null;
  }

  removeItem(name) {
    const dashedName = DOMStringMap.toDashed(name);
    this.#data.delete(dashedName);
  }

  hasItem(name) {
    const dashedName = DOMStringMap.toDashed(name);
    return this.#data.has(dashedName);
  }
  
  // This enables you to loop through all key/value pairs in a DOMStringMap
  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }
}
// The HTMLCollection interface represents a generic collection (array-like object similar to arguments) of elements (in document order) and offers methods and properties for selecting from the list.

export class HTMLCollection {
  #elements = []; // The internal list of elements

  constructor(elements = []) {
    this.#elements = elements;
  }

  // Read-only length property
  get length() {
    return this.#elements.length;
  }

  // Retrieves the element at the specified index
  item(index) {
    return this.#elements[index] || null;
  }

  // Retrieves the element with the specified name or id
  namedItem(name) {
    for (const element of this.#elements) {
      if (element.id === name || element.name === name) {
        return element;
      }
    }
    return null;
  }

  // Iterable
  *[Symbol.iterator]() {
    for (const element of this.#elements) {
      yield element;
    }
  }
}

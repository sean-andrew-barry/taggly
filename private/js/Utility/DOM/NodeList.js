export class NodeList {
  #nodes = [];
  #isLive = false; // By default, make it static

  constructor(initialNodes = [], isLive = false) {
    this.#nodes = initialNodes;
    this.#isLive = isLive;
  }

  // Length is a read-only property
  get length() {
    return this.#nodes.length;
  }

  // Method to return item at index
  item(index) {
    return this.#nodes[index] || null;
  }

  // Array-like access
  get(index) {
    return this.#nodes[index] || null;
  }

  // Iterable
  [Symbol.iterator]() {
    let index = 0;
    const nodes = this.#nodes;

    return {
      next: function () {
        if (index < nodes.length) {
          return { value: nodes[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }

  // forEach method
  forEach(callback, thisArg) {
    this.#nodes.forEach((value, index, array) => {
      callback.call(thisArg, value, index, array);
    });
  }

  // Internal method to update the internal nodes, typically for live NodeLists
  _updateNodes(newNodes) {
    if (this.#isLive) {
      this.#nodes = newNodes;
    }
  }

  _appendNode(node) {
    if (this.#isLive) {
      this.#nodes.push(node);
    }
  }

  _insertNode(node, index) {
    if (this.#isLive) {
      this.#nodes.splice(index, 0, node);
    }
  }

  _indexOf(node) {
    return this.#nodes.indexOf(node);
  }

  _removeAt(index) {
    if (this.#isLive) {
      this.#nodes.splice(index, 1);
    }
  }

  _replaceAt(index, newNode) {
    if (this.#isLive) {
      this.#nodes[index] = newNode;
    }
  }
}

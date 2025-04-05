import {Node} from "/js/Utility/DOM/Node.js";
import {Data} from "/js/Utility/DOM/Data.js";
import {MutationObserver} from "/js/Utility/DOM/Observer/MutationObserver.js";

export class _CharacterData extends Node
{
  #data;

  constructor(globalObject, args, privateData)
  {
    super(globalObject, args, privateData);

    this.#data = privateData.data;
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-data
  get data()
  {
    return this.#data;
  }

  set data(data)
  {
    this.replaceData(0, this.length, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-length
  get length()
  {
    return this.#data.length;
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-substringdata
  // https://dom.spec.whatwg.org/#concept-cd-substring
  substringData(offset, count)
  {
    const { length } = this;

    if (offset > length) {
      throw DOMException.create(this._globalObject, ["The index is not in the allowed range.", "IndexSizeError"]);
    }

    if (offset + count > length) {
      return this.#data.slice(offset);
    }

    return this.#data.slice(offset, offset + count);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-appenddata
  appendData(data)
  {
    this.replaceData(this.length, 0, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-insertdata
  insertData(offset, data)
  {
    this.replaceData(offset, 0, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-deletedata
  deleteData(offset, count)
  {
    this.replaceData(offset, count, "");
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-replacedata
  // https://dom.spec.whatwg.org/#concept-cd-replace
  replaceData(offset, count, data)
  {
    const { length } = this;

    if (offset > length) {
      throw DOMException.create(this._globalObject, [
        "The index is not in the allowed range.",
        "IndexSizeError"
      ]);
    }

    if (offset + count > length) {
      count = length - offset;
    }

    queueMutationRecord(MUTATION_TYPE.CHARACTER_DATA, this, null, null, this.#data, [], [], null, null);

    const start = this.#data.slice(0, offset);
    const end = this.#data.slice(offset + count);
    this.#data = start + data + end;

    for (const range of this._referencedRanges) {
      const { _start, _end } = range;

      if (_start.offset > offset && _start.offset <= offset + count) {
        range._setLiveRangeStart(this, offset);
      }

      if (_end.offset > offset && _end.offset <= offset + count) {
        range._setLiveRangeEnd(this, offset);
      }

      if (_start.offset > offset + count) {
        range._setLiveRangeStart(this, _start.offset + data.length - count);
      }

      if (_end.offset > offset + count) {
        range._setLiveRangeEnd(this, _end.offset + data.length - count);
      }
    }

    if (this.nodeType === TEXT_NODE && this.parentNode) {
      this.parentNode._childTextContentChangeSteps();
    }
  }
}

export class CharacterData extends Node {
  #data;

  constructor(data = "")
  {
    if (new.target === CharacterData) {
      throw new Error(`CharacterData is an abstract class and should not be directly constructed`);
    }
    
    super();

    this.#data = data;
  }

  get nodeType() { throw new Error(`CharacterData.nodeType must be overridden`); }
  get nodeName() { throw new Error(`CharacterData.nodeName must be overridden`); }

  get nodeValue(){ return this.data; }

  // Getters and setters
  get data() { return this.#data; }

  set data(newData) {
    const oldData = this.#data;
    this.#data = newData;

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: oldData,
    });
  }

  get length(){ return this.#data.length; }

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

  // Methods
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

  appendData(data) {
    const oldData = this.#data;
    this.#data += data;

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: oldData
    });
  }

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

  deleteData(offset, count) {
    const oldData = this.#data;
    this.#data = this.#data.substring(0, offset) + this.#data.substring(offset + count);

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: oldData
    });
  }

  insertData(offset, data) {
    const oldData = this.#data;
    this.#data = this.#data.substring(0, offset) + data + this.#data.substring(offset);

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: oldData
    });
  }

  remove() {
    const parent = this.parentNode;
    if (parent) {
      parent.removeChild(this);
    }
  }

    // https://dom.spec.whatwg.org/#dom-characterdata-replacedata
  // https://dom.spec.whatwg.org/#concept-cd-replace
  replaceData(offset, count, data) {
    const oldData = this.#data;

    if (offset > oldData.length) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }

    this.#data = this.#data.substring(0, offset) + data + this.#data.substring(offset + count);

    // Notify MutationObservers
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: oldData
    });
  }

  replaceWith(...nodes) {
    const parent = this.parentNode;
    if (parent) {
      const refNode = this.nextSibling;

      // Remove this node
      this.remove(); // This will trigger its own MutationObserver notification
      
      // Insert new nodes
      for (const node of nodes) {
        parent.insertBefore(node, refNode); // Also triggers the observers
      }
    }
  }

  substringData(offset, count) {
    // No mutation record required here, as it's a read-only operation.
    return this.#data.substring(offset, offset + count);
  }
}
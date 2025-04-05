import {EventTarget} from "/js/Utility/DOM/EventTarget.js";

const NODE_TYPE = Object.freeze({
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4, // Depreciated
  ENTITY_REFERENCE_NODE: 5, // Depreciated
  ENTITY_NODE: 6, // Depreciated
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12 // Depreciated
});

const ROOT_NODE = Symbol("root_node");
const PARENT_NODE = Symbol("parent_node");
const FIRST_CHILD = Symbol("first_child");
const LAST_CHILD = Symbol("last_child");
const NEXT_SIBLING = Symbol("next_sibling");
const PREVIOUS_SIBLING = Symbol("previous_sibling");

const ROOT_NODES = new WeakMap();
const PARENT_NODES = new WeakMap();
const FIRST_CHILD_NODES = new WeakMap();
const LAST_CHILD_NODES = new WeakMap();
const NEXT_SIBLING_NODES = new WeakMap();
const PREVIOUS_SIBLING_NODES = new WeakMap();

export class Node extends EventTarget
{
  static GetParentNodeSymbol(){ return PARENT_NODE; }
  static GetFirstChildSymbol(){ return FIRST_CHILD; }
  static GetLastChildSymbol(){ return LAST_CHILD; }
  static GetNextSiblingSymbol(){ return NEXT_SIBLING; }
  static GetPreviousSiblingSymbol(){ return PREVIOUS_SIBLING; }

  constructor({
    nodeType,
    nodeName,
  })
  {
    super();
    // this.nodeType = nodeType;
    // this.nodeName = nodeName;

    Object.defineProperty(this, "nodeType", {
      value: nodeType,
      writable: false,
    });

    Object.defineProperty(this, "nodeName", {
      value: nodeName,
      writable: false,
    });
  }

  get parentNode(){ return domSymbolTree.parent(this); }
  get firstChild(){ return domSymbolTree.firstChild(this); }
  get lastChild(){ return domSymbolTree.lastChild(this); }
  get nextSibling(){ return domSymbolTree.nextSibling(this); }
  get previousSibling(){ return domSymbolTree.previousSibling(this); }
  get hasChildNodes(){ return FIRST_CHILD_NODES.has(this); }
  get ownerDocument(){ return this.ThrowNotImplemented("ownerDocument"); }

  get getRootNode(){ return ROOT_NODES.get(this); }
  get parentNode(){ return PARENT_NODES.get(this); }
  get firstChild(){ return FIRST_CHILD_NODES.get(this); }
  get lastChild(){ return LAST_CHILD_NODES.get(this); }
  get nextSibling(){ return NEXT_SIBLING_NODES.get(this); }
  get previousSibling(){ return PREVIOUS_SIBLING_NODES.get(this); }

  // https://dom.spec.whatwg.org/#dom-node-appendchild
  appendChild(node)
  {
    PARENT_NODES.set(node, this); // This is now node's parentNode

    // If this has a root node (in other words, if it's connected)
    if (ROOT_NODES.has(this))
    {
      // Then give its children the same root node
      ROOT_NODES.set(node, this.getRootNode);
    }

    const last = this.lastChild;

    // If we already had one or more node nodes
    if (last)
    {
      // Make the old last node point to the new last node
      PREVIOUS_SIBLING_NODES.set(node, last);
      NEXT_SIBLING_NODES.set(last, node);
    }
    else
    {
      // If we didn't already have a node, this one is both the firstChild and the lastChild
      FIRST_CHILD_NODES.set(this, node);
    }

    // Since we're appending, node is always the new lastChild
    LAST_CHILD_NODES.set(this, node);

    return node;
  }

  insertBefore(node, reference)
  {
    if (reference === null || reference === undefined)
    {
      this.appendChild(node);
    }
    else
    {
      PARENT_NODES.set(node, this); // This is now node's parentNode

      // If this has a root node (in other words, if it's connected)
      if (ROOT_NODES.has(this))
      {
        // Then give its children the same root node
        ROOT_NODES.set(node, this.getRootNode);
      }

      const prev = reference.previousSibling;

      PREVIOUS_SIBLING_NODES.set(node, reference); // reference's previousSibling is node
      NEXT_SIBLING_NODES.set(node, reference_node); // node's nextSibling is the reference

      if (prev)
      {
        PREVIOUS_SIBLING_NODES.set(node, prev); // node's previousSibling is reference's old previous
        NEXT_SIBLING_NODES.set(prev, node); // prev's nextSibling is node
      }
      else
      {
        // reference didn't have a previousSibling, so it was the firstChild
        // Now node is the firstChild
        FIRST_CHILD_NODES.set(this, node);
      }
    }

    return node;
  }

  // https://dom.spec.whatwg.org/#dom-node-removechild
  removeChild(node)
  {
    if (node.parentNode !== this)
    {
      throw new Error(`Not a parent`);
    }

    ROOT_NODES.delete(node);
    PARENT_NODES.delete(node);

    const next = node.nextSibling;
    const prev = node.previousSibling;

    if (prev && next)
    {
      PREVIOUS_SIBLING_NODES.set(next, prev); // Prev is now next's previousSibling
      NEXT_SIBLING_NODES.set(prev, next); // Next is now prev's nextSibling
    }
    else if (prev)
    {
      LAST_CHILD_NODES.set(this, prev); // No next, making prev the new lastChild
      NEXT_SIBLING_NODES.delete(prev); // No next, so delete prev's nextSibling
    }
    else if (next)
    {
      FIRST_CHILD_NODES.set(this, next); // No prev, making next the new firstChild
      PREVIOUS_SIBLING_NODES.delete(next); // No prev, so delete next's previousSibling
    }
    else
    {
      // No prev or next, meaning this has no remaining children
      FIRST_CHILD_NODES.delete(this);
      LAST_CHILD_NODES.delete(this);
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-normalize
  normalize()
  {
    // It is important to use a treeToArray instead of a treeToIterator here, because the
    // treeToIterator doesn't support tree mutation in the middle of the traversal.
    for (const node of domSymbolTree.treeToArray(this)) {
      const parentNode = domSymbolTree.parent(node);
      if (parentNode === null || node.nodeType !== NODE_TYPE.TEXT_NODE) {
        continue;
      }

      let length = nodeLength(node);

      if (length === 0) {
        parentNode._remove(node);
        continue;
      }

      const continuousExclusiveTextNodes = [];

      for (const currentNode of domSymbolTree.previousSiblingsIterator(node)) {
        if (currentNode.nodeType !== NODE_TYPE.TEXT_NODE) {
          break;
        }

        continuousExclusiveTextNodes.unshift(currentNode);
      }
      for (const currentNode of domSymbolTree.nextSiblingsIterator(node)) {
        if (currentNode.nodeType !== NODE_TYPE.TEXT_NODE) {
          break;
        }

        continuousExclusiveTextNodes.push(currentNode);
      }

      const data = continuousExclusiveTextNodes.reduce((d, n) => d + n._data, "");
      node.replaceData(length, 0, data);

      let currentNode = domSymbolTree.nextSibling(node);
      while (currentNode && currentNode.nodeType !== NODE_TYPE.TEXT_NODE) {
        const currentNodeParent = domSymbolTree.parent(currentNode);
        const currentNodeIndex = domSymbolTree.index(currentNode);

        for (const range of node._referencedRanges) {
          const { _start, _end } = range;

          if (_start.node === currentNode) {
            range._setLiveRangeStart(node, _start.offset + length);
          }
          if (_end.node === currentNode) {
            range._setLiveRangeEnd(node, _end.offset + length);
          }
          if (_start.node === currentNodeParent && _start.offset === currentNodeIndex) {
            range._setLiveRangeStart(node, length);
          }
          if (_end.node === currentNodeParent && _end.offset === currentNodeIndex) {
            range._setLiveRangeStart(node, length);
          }
        }

        length += nodeLength(currentNode);
        currentNode = domSymbolTree.nextSibling(currentNode);
      }

      for (const continuousExclusiveTextNode of continuousExclusiveTextNodes) {
        parentNode._remove(continuousExclusiveTextNode);
      }
    }
  }

  compareDocumentPosition(){ return this.ThrowNotImplemented("compareDocumentPosition"); }
  contains(){ return this.ThrowNotImplemented("contains"); }
  isDefaultNamespace(){ return this.ThrowNotImplemented("isDefaultNamespace"); }
  isEqualNode(){ return this.ThrowNotImplemented("isEqualNode"); }
  isSameNode(){ return this.ThrowNotImplemented("isSameNode"); }
  cloneNode(){ return this.ThrowNotImplemented("cloneNode"); }

  get nodeValue()
  {
    switch (this.nodeType)
    {
      case NODE_TYPE.ATTRIBUTE_NODE: return this._value;
      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: return this._data;
      default: return null;
    }
  }

  set nodeValue(value)
  {
    if (value === null)
    {
      value = "";
    }

    switch (this.nodeType)
    {
      case NODE_TYPE.ATTRIBUTE_NODE:
      {
        setAnExistingAttributeValue(this, value);
        break;
      }
      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE:
      {
        this.replaceData(0, this.length, value);
        break;
      }
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  get textContent()
  {
    switch (this.nodeType) {
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      case NODE_TYPE.ELEMENT_NODE: {
        let text = "";
        for (const child of domSymbolTree.treeIterator(this)) {
          if (child.nodeType === NODE_TYPE.TEXT_NODE || child.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
            text += child.nodeValue;
          }
        }
        return text;
      }

      case NODE_TYPE.ATTRIBUTE_NODE: {
        return this._value;
      }

      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        return this._data;
      }

      default: {
        return null;
      }
    }
  }

  set textContent(value)
  {
    if (value === null) {
      value = "";
    }

    switch (this.nodeType) {
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      case NODE_TYPE.ELEMENT_NODE: {
        // https://dom.spec.whatwg.org/#string-replace-all
        let nodeImpl = null;

        if (value !== "") {
          nodeImpl = this._ownerDocument.createTextNode(value);
        }

        this._replaceAll(nodeImpl);
        break;
      }

      case NODE_TYPE.ATTRIBUTE_NODE: {
        setAnExistingAttributeValue(this, value);
        break;
      }

      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        this.replaceData(0, this.length, value);
        break;
      }
    }
  }

  get nodeName()
  {
    switch (this.nodeType)
    {
      case NODE_TYPE.ELEMENT_NODE: return this.tagName;
      case NODE_TYPE.ATTRIBUTE_NODE: return this._qualifiedName;
      case NODE_TYPE.TEXT_NODE: return "#text";
      case NODE_TYPE.CDATA_SECTION_NODE: return "#cdata-section";
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE: return this.target;
      case NODE_TYPE.COMMENT_NODE: return "#comment";
      case NODE_TYPE.DOCUMENT_NODE: return "#document";
      case NODE_TYPE.DOCUMENT_TYPE_NODE: return this.name;
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE: return "#document-fragment";
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-insertbefore
  insertBefore(nodeImpl, childImpl) {
    return this._preInsert(nodeImpl, childImpl);
  }


  appendChild(nodeImpl) {
    return this._append(nodeImpl);
  }

  // https://dom.spec.whatwg.org/#dom-node-replacechild
  replaceChild(nodeImpl, childImpl) {
    return this._replace(nodeImpl, childImpl);
  }


  removeChild(oldChildImpl) {
    return this._preRemove(oldChildImpl);
  }
}

Node.ELEMENT_NODE = 1;
Node.ATTRIBUTE_NODE = 2;
Node.TEXT_NODE = 3;
Node.CDATA_SECTION_NODE = 4; // Depreciated
Node.ENTITY_REFERENCE_NODE = 5; // Depreciated
Node.ENTITY_NODE = 6; // Depreciated
Node.PROCESSING_INSTRUCTION_NODE = 7;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_TYPE_NODE = 10;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.NOTATION_NODE = 12; // Depreciated

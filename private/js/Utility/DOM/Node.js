import {EventTarget} from "/js/Utility/DOM/EventTarget.js";
import {Event} from "/js/Utility/DOM/Event.js";
import {Data} from "/js/Utility/DOM/Data.js";
import {NodeList} from "/js/Utility/DOM/NodeList.js";
import {MutationObserver} from "/js/Utility/DOM/Observer/MutationObserver.js";

let constructor_token;

export class Node extends EventTarget
{
  #nodeName; // Currently not implemented
  #nodeType;
  #rootNode = this;
  #parentNode = null;
  #firstChild = null;
  #lastChild = null;
  #nextSibling = null;
  #previousSibling = null;
  #ownerDocument = null;
  #childNodes = new NodeList(undefined, true);
  #baseURI = ""; // Could be initialized based on document or parent node

  constructor({
    token,
    nodeType,
    nodeName,
    ownerDocument = null,
  })
  {
    if (token !== constructor_token) {
      throw new Error("Illegal constructor. Use document.createElement() instead.");
    }
    
    constructor_token = undefined;

    super();

    this.#nodeType = nodeType;
    this.#nodeName = nodeName;
    this.#ownerDocument = ownerDocument;
  }

  static createElementExample()
  {
    // This mechanism guarantees that the constructor can only be called by something that sets the token
    constructor_token = Symbol("ConstructorToken");
    return new this(constructor_token);
  }

  get nodeType(){ return this.#nodeType; }
  get getRootNode(){ return this.#rootNode; }
  get parentNode(){ return this.#parentNode; }
  get firstChild(){ return this.#firstChild; }
  get lastChild(){ return this.#lastChild; }
  get nextSibling(){ return this.#nextSibling; }
  get previousSibling(){ return this.#previousSibling; }
  get ownerDocument(){ return this.#ownerDocument; }
  get childNodes(){ return this.#childNodes; }
  get baseURI(){ return this.#baseURI; }

  get parentElement() {
    // The parentElement property returns null if the node either has no parent,
    // or its parent is not an Element object.
    return this.parentNode && this.parentNode.nodeType === Node.ELEMENT_NODE ? this.parentNode : null;
  }

  // Computed property example for nodeName
  get nodeName()
  {
    switch (this.#nodeType)
    {
      case Node.ELEMENT_NODE: return this.tagName; // This would be defined in the Element subclass
      case Node.TEXT_NODE: return "#text";
      case Node.CDATA_SECTION_NODE: return "#cdata-section";
      case Node.COMMENT_NODE: return "#comment";
      case Node.DOCUMENT_NODE: return "#document";
      case Node.DOCUMENT_FRAGMENT_NODE: return "#document-fragment";

      // Not sure what would be returned for any of these, but we can probably deal with that when we implement their individual subclasses
      case Node.PROCESSING_INSTRUCTION_NODE: return;
      case Node.ATTRIBUTE_NODE: return; 
      case Node.DOCUMENT_TYPE_NODE: return;
      default: return null;
    }
  }

  get nodeValue() {
    switch (this.nodeType) {
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
        return this.data; // Assuming you have a 'data' property to store the textual content
      default:
        return null;
    }
  }
  
  set nodeValue(value) {
    switch (this.nodeType) {
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
        this.data = value;
        // Trigger MutationObservers, if applicable
        break;
      default:
        // Do nothing, or potentially throw a readonly error if strict adherence to the spec is desired
        break;
    }
  }

  // https://dom.spec.whatwg.org/#concept-tree-index
  get #index()
  {
    let index = 0;
    let current = this.#previousSibling;
    while (current)
    {
      index += 1;
      current = current.previousSibling;
    }

    return index;
  }

  // https://dom.spec.whatwg.org/#dom-node-appendchild
  appendChild(node, use_mutations = true) {
    // Type checks (simplified)
    if (node === this) {
      throw new DOMException("Cannot append a node as a child of itself.", "HierarchyRequestError");
    }
  
    // Remove the node from its current parent if it's already in the tree.
    if (node.#parentNode) {
      node.#parentNode.removeChild(node);
    }
  
    // Set the parent and owner document
    node.#parentNode = this;
  
    // If this has a root node (in other words, if it's connected)
    if (this.#rootNode !== null) {
      // Then give its children the same root node
      node.#rootNode = this.getRootNode;
    }
  
    const last = this.#lastChild;
  
    // If we already had one or more child nodes
    if (last) {
      // Make the old last node point to the new last node
      node.#previousSibling = last;
      last.#nextSibling = node;
    } else {
      // If we didn't already have a child, this one is both the firstChild and the lastChild
      this.#firstChild = node;
    }
  
    // Since we're appending, node is always the new lastChild
    this.#lastChild = node;
  
    // Update the NodeList
    this.#childNodes._appendNode(node);

    if (use_mutations)
    {
      // Notify MutationObservers
      Data.get(MutationObserver).Notify(this, {
        type: "childList",
        target: this,
        addedNodes: [newChild],
        removedNodes: [],
      });
    }
  
    return node;
  }

  // https://dom.spec.whatwg.org/#dom-node-insertbefore
  insertBefore(node, reference, use_mutations = true){ return this.#insertBefore(node, reference, use_mutations); }

  #insertBefore(node, reference, use_mutations = true)
  {
    // Case when reference is null or undefined
    if (!reference)
    {
      return this.#appendChild(node, use_mutations);
    }
  
    if (reference.parentNode !== this) 
    {
      throw new DOMException('The node before which the new node is to be inserted is not a child of this node.');
    }
  
    // This is now node's parentNode
    node.#parentNode = this;
  
    // If this has a root node (in other words, if it's connected)
    if (this.#rootNode !== null)
    {
      // Then give its children the same root node
      node.#rootNode = this.getRootNode;
    }
  
    const prev = reference.previousSibling;
  
    // Updating the previousSibling and nextSibling for the surrounding nodes
    if (prev)
    {
      prev.#nextSibling = node;
      node.#previousSibling = prev;
    }
    else
    {
      // If reference didn't have a previousSibling, it means it was the firstChild.
      // Now node will be the new firstChild.
      this.#firstChild = node;
    }
  
    reference.#previousSibling = node;
  
    // Update the NodeList
    const referenceIndex = this.#childNodes._indexOf(reference);
    if (referenceIndex !== -1)
    {
      this.#childNodes._insertNode(node, referenceIndex);
    }
  
    if (use_mutations)
    {
      // Notify MutationObservers for insertion
      Data.get(MutationObserver).Notify(this, {
        type: "childList",
        target: this,
        addedNodes: [node],
        removedNodes: [],
      });

      // If a reference node is specified, also notify observers for it
      if (reference) {
        Data.get(MutationObserver).Notify(reference, {
          type: "childList",
          target: this,
          addedNodes: [node],
          removedNodes: [],
        });
      }
    }
  
    return node;
  }

  // https://dom.spec.whatwg.org/#dom-node-removechild
  removeChild(node, use_mutations = true){ return this.#removeChild(node, use_mutations); }
  
  #removeChild(node, use_mutations = true) {
    if (node.parentNode !== this) {
      throw new DOMException("The node to be removed is not a child of this node.", "NotFoundError");
    }
  
    // Remove node's link to the parent
    node.#parentNode = null;
    node.#rootNode = null;  // Assuming that null is your way of signifying no rootNode
    
    const next = node.nextSibling;
    const prev = node.previousSibling;
    
    // Fix links for siblings
    if (prev && next) {
      prev.#nextSibling = next;
      next.#previousSibling = prev;
    } else if (prev) {
      this.#lastChild = prev;
      prev.#nextSibling = null;
    } else if (next) {
      this.#firstChild = next;
      next.#previousSibling = null;
    } else {
      this.#firstChild = null;
      this.#lastChild = null;
    }
  
    // Remove node from NodeList
    const index = this.#childNodes._indexOf(node);
    if (index !== -1) {
      this.#childNodes._removeAt(index);
    }
  
    if (use_mutations)
    {
      // Notify MutationObservers for removal
      Data.get(MutationObserver).Notify(this, {
        type: "childList",
        target: this,
        addedNodes: [],
        removedNodes: [node],
      });
    }

    return node; // According to spec, return the removed node
  }

  // https://dom.spec.whatwg.org/#dom-node-replacechild
  replaceChild(newNode, oldNode, use_mutations = true) {
    // Check if oldNode is actually a child of this node
    if (oldNode.parentNode !== this) {
      throw new DOMException("The node to be replaced is not a child of this node.", "NotFoundError");
    }
  
    // Check if newNode is the same as oldNode. If so, do nothing.
    if (newNode === oldNode) {
      return newNode;
    }
  
    // Remove newNode from its current parent if it already has one
    if (newNode.parentNode) {
      newNode.parentNode.removeChild(newNode);
    }
  
    // Find the index of the old node in the NodeList
    const index = this.#childNodes._indexOf(oldNode);
  
    // If found, replace in the NodeList
    if (index !== -1) {
      this.#childNodes._replaceAt(index, newNode);
    }
  
    // Update parent, root node, and sibling references
    newNode.#parentNode = this;
    if (this.#rootNode !== undefined) {
      newNode.#rootNode = this.getRootNode();
    }
  
    const next = oldNode.nextSibling;
    const prev = oldNode.previousSibling;
  
    if (prev) {
      prev.#nextSibling = newNode;
      newNode.#previousSibling = prev;
    } else {
      this.#firstChild = newNode;
    }
  
    if (next) {
      next.#previousSibling = newNode;
      newNode.#nextSibling = next;
    } else {
      this.#lastChild = newNode;
    }
  
    // Disconnect the oldNode from the tree
    oldNode.#parentNode = null;
    oldNode.#rootNode = null;
    oldNode.#nextSibling = null;
    oldNode.#previousSibling = null;
  
    if (use_mutations)
    {
      // Notify MutationObservers for replacement
      Data.get(MutationObserver).Notify(this, {
        type: "childList",
        target: this,
        addedNodes: [newNode],
        removedNodes: [oldNode],
      });
    }
  
    return oldNode;
  }

  cloneNode(deep = false) {
    // Create a new instance of the same type as this node
    const clone = new this.constructor();
  
    // Copy over all properties that should be cloned
    clone.#nodeName = this.#nodeName;
    clone.#nodeValue = this.#nodeValue;
    clone.#nodeType = this.#nodeType;
    // TODO: Add any other properties that should be cloned
  
    // If deep cloning is requested, recursively clone all child nodes as well
    if (deep) {
      let currentChild = this.#firstChild;
      while (currentChild) {
        const childClone = currentChild.cloneNode(true);
        clone.appendChild(childClone);
        currentChild = currentChild.nextSibling;
      }
    }
  
    return clone;
  }

  hasChildNodes(){ return this.#firstChild !== null; }

  // https://dom.spec.whatwg.org/#concept-node-length
  get length()
  {
    switch (this.nodeType)
    {
      case Node.DOCUMENT_TYPE_NODE:
      case Node.ATTRIBUTE_NODE: return 0;

      // If it's a CharacterData type
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
      case Node.PROCESSING_INSTRUCTION_NODE:
      default: return this.children.length;
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-normalize
  normalize()
  {
    let currentNode = this.#firstChild;
  
    while (currentNode)
    {
      // If the node is a Text node
      if (currentNode.nodeType === Node.TEXT_NODE)
      {
        let nextNode = currentNode.nextSibling;
  
        // Merge adjacent Text nodes
        while (nextNode && nextNode.nodeType === Node.TEXT_NODE)
        {
          currentNode.nodeValue += nextNode.nodeValue;
          this.removeChild(nextNode);
          nextNode = currentNode.nextSibling;
        }
      }
      else
      {
        // Recursively normalize non-Text child nodes
        currentNode.normalize();
      }
  
      currentNode = currentNode.nextSibling;
    }
  }

  contains(otherNode)
  {
    // A node can't contain itself, per the spec.
    if (this === otherNode)
    {
      return false;
    }
  
    let currentNode = this.#firstChild;
  
    while (currentNode)
    {
      if (currentNode === otherNode)
      {
        return true;
      }
      
      // Recursively check within this child for `otherNode`.
      if (currentNode.contains(otherNode))
      {
        return true;
      }
  
      currentNode = currentNode.nextSibling;
    }
  
    return false;
  }

  compareDocumentPosition(otherNode) {
    if (this === otherNode) {
      return 0;
    }
  
    // TODO: Add more comprehensive checks based on your DOM tree's specifics.
    // This is a very simplified example.
    
    let node = this;
    while (node) {
      if (node === otherNode) {
        return 4;  // Node contains the otherNode
      }
      node = node.parentNode;
    }
    
    node = otherNode;
    while (node) {
      if (node === this) {
        return 8; // Node is contained by otherNode
      }
      node = node.parentNode;
    }
    
    return 1;  // Nodes are disconnected
  }

  isSameNode(otherNode){ return this === otherNode; }

  // Assuming you'd store the default namespace in #namespaceURI
  isDefaultNamespace(namespaceURI){ return this.#namespaceURI === namespaceURI; }

  isEqualNode(otherNode) {
    if (this.nodeType !== otherNode.nodeType ||
        this.nodeName !== otherNode.nodeName ||
        this.nodeValue !== otherNode.nodeValue) {
      return false;
    }
  
    // Check attributes if this is an Element node (nodeType === 1)
    // Assuming you have a method getAttributes() that returns all attributes as an array of objects
    if (this.nodeType === Node.ELEMENT_NODE) {
      const thisAttributes = this.getAttributes();
      const otherAttributes = otherNode.getAttributes();
  
      if (thisAttributes.length !== otherAttributes.length) {
        return false;
      }
  
      for (let i = 0; i < thisAttributes.length; i++) {
        if (thisAttributes[i].name !== otherAttributes[i].name ||
            thisAttributes[i].value !== otherAttributes[i].value) {
          return false;
        }
      }
    }
  
    // Check children
    // Assuming you have childNodes as an array
    if (this.childNodes.length !== otherNode.childNodes.length) {
      return false;
    }
  
    for (let i = 0; i < this.childNodes.length; i++) {
      if (!this.childNodes[i].isEqualNode(otherNode.childNodes[i])) {
        return false;
      }
    }
  
    return true;
  }

  // TODO: Simplified; you'd normally traverse up the DOM tree
  lookupNamespaceURI(prefix){ return this.#namespaces ? this.#namespaces[prefix] : null; }

  lookupPrefix(namespaceURI) {
    // TODO: Simplified; normally you'd traverse up the DOM tree
    for (let prefix in this.#namespaces) {
      if (this.#namespaces[prefix] === namespaceURI) {
        return prefix;
      }
    }
    return null;
  }

  #visitNodes(callback) {
    let stack = [this];  // Start with the current node
    
    while (stack.length > 0) {
      let current = stack.pop();
      
      // Apply the callback to the current node
      callback(current);
  
      // Add child nodes to the stack
      let child = current.lastChild;
      while (child) {
        stack.push(child);
        child = child.previousSibling;
      }
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  get textContent() {
    let content = '';
    this.#visitNodes((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        content += node.data;  // Assuming 'data' is the text content for Text nodes
      }
    });
    return content;
  }
  
  set textContent(newContent) {
    // Remove all existing children
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  
    // If newContent is null or undefined, no new text node will be created
    if (newContent != null && newContent !== '') {
      // Append a new text node with the given content
      this.appendChild(document.createTextNode(newContent));
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-replace
  #replace(node, child)
  {
    const parent = this;

    // 1. Must be one of these node types to use #replace
    switch (this.nodeType)
    {
      case Node.DOCUMENT_NODE: break;
      case Node.DOCUMENT_FRAGMENT_NODE: break;
      case Node.ELEMENT_NODE: break;
      default: throw new HierarchyRequestError();
    }

    // 2. TODO

    // 3. Child's parent must be this
    if (child.#parentNode !== this)
    {
      throw new NotFoundError();
    }

    // 4. Node must be one of these types to use #replace
    switch (node.nodeType)
    {
      case Node.DOCUMENT_FRAGMENT_NODE: break;
      case Node.DOCUMENT_TYPE_NODE: break;
      case Node.ELEMENT_NODE: break;
      case Node.TEXT_NODE: break;
      case Node.COMMENT_NODE: break;
      case Node.PROCESSING_INSTRUCTION_NODE: break;
      default: throw new HierarchyRequestError();
    }

    // 5. If child or node is a Text node and the parent is a document
    if ((node.nodeType === Node.TEXT_NODE || child.nodeType === Node.TEXT_NODE) && this.nodeType === Node.DOCUMENT_NODE)
    {
      throw new HierarchyRequestError();
    }
    else if (node.nodeType === Node.DOCUMENT_TYPE_NODE && this.nodeType !== Node.DOCUMENT_NODE)
    {
      throw new HierarchyRequestError();
    }

    // 6. TODO
    if (this.nodeType === Node.DOCUMENT_NODE)
    {
      switch (node.nodeType)
      {
        case Node.DOCUMENT_FRAGMENT_NODE:
        {
          break;
        }
        default:
        {
        }
      }
    }

    let referenceChild = child.#nextSibling; // 7
    if (referenceChild === node) referenceChild = node.#nextSibling; // 8

    const previousSibling = child.#previousSibling; // 9

    const removedNodes = []; // 10

    node.#previousSibling = child.#previousSibling; // 9

    // 11
    if (child.#parentNode !== null)
    {
      removedNodes.push(child);
      child.#remove(true);
    }

    // 12
    let nodes;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    {
      nodes = node.children;
    }
    else
    {
      nodes = [node];
    }

    parent.#insert(node, referenceChild, true); // 13

    // 14: TODO

    return child; // 15
  }

  // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  #preInsertValidity(node, child)
  {
    // 1. Must be one of these node types to use #replace
    switch (this.nodeType)
    {
      case Node.DOCUMENT_NODE: break;
      case Node.DOCUMENT_FRAGMENT_NODE: break;
      case Node.ELEMENT_NODE: break;
      default: throw new HierarchyRequestError();
    }

    // 2. TODO

    // 3. Child's parent must be this
    if (child.#parentNode !== this)
    {
      throw new NotFoundError();
    }

    // 4. Node must be one of these types to use #replace
    switch (node.nodeType)
    {
      case Node.DOCUMENT_FRAGMENT_NODE: break;
      case Node.DOCUMENT_TYPE_NODE: break;
      case Node.ELEMENT_NODE: break;
      case Node.TEXT_NODE: break;
      case Node.COMMENT_NODE: break;
      case Node.PROCESSING_INSTRUCTION_NODE: break;
      default: throw new HierarchyRequestError();
    }

    // 5. If child or node is a Text node and the parent is a document
    if ((node.nodeType === Node.TEXT_NODE || child.nodeType === Node.TEXT_NODE) && this.nodeType === Node.DOCUMENT_NODE)
    {
      throw new HierarchyRequestError();
    }
    else if (node.nodeType === Node.DOCUMENT_TYPE_NODE && this.nodeType !== Node.DOCUMENT_NODE)
    {
      throw new HierarchyRequestError();
    }

    // 6. TODO
    if (this.nodeType === Node.DOCUMENT_NODE)
    {
      switch (node.nodeType)
      {
        case Node.DOCUMENT_FRAGMENT_NODE:
        {
          break;
        }
        default:
        {
        }
      }
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-pre-insert
  #preInsert(node, child)
  {
    this.#preInsertValidity(node, child);

    let referenceChild = child;

    if (referenceChild === node)
    {
      node.#nextSibling = referenceChild;
    }

    this.#insert(node, referenceChild);

    return node;
  }

  #removeAllChildren(suppress_observers)
  {
    let child = this.#firstChild;
    while (child)
    {
      const next = child.#nextSibling;
      child.#remove(suppress_observers);
      child = next;
    }
  }

  // TODO
  #adopt(node)
  {
    let oldDocument = node.document;
  }

  adoptNode(node)
  {
    if (node.nodeType === Node.DOCUMENT_NODE) throw new DOMException("NotSupportedError");
    if (node.nodeType === Node.SHADOW_ROOT_NODE) throw new DOMException("HierrarchyRequestError");
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node.host !== null) return;

    this.#adopt(node);

    return node;
  }

  #GetEventInterface(interface)
  {
    switch (interface.toLowerCase())
    {
      case "beforeunloadevent": return BeforeUnloadEvent;
      case "compositionevent": return CompositionEvent;
      case "customevent": return CustomEvent;
      case "devicemotionevent": return DeviceMotionEvent;
      case "deviceorientationevent": return DeviceOrientationEvent;
      case "dragevent": return DragEvent;
      case "event":
      case "events": return Event;
      case "focusevent": return FocusEvent;
      case "hashchangeevent": return HashChangeEvent;
      case "htmlevents": return Event;
      case "keyboardevent": return KeyboardEvent;
      case "messageevent": return MessageEvent;
      case "mouseevent":
      case "mouseevents": return MouseEvent;
      case "storageevent": return StorageEvent;
      case "svgevents": return Event;
      case "textevent": return CompositionEvent;
      case "touchevent": return TouchEvent;
      case "uievent":
      case "uievents": return UIEvent;
      default: return null;
    }
  }

  createEvent(interface)
  {
    let ctor = null;
    if (typeof(interface) === "string")
    {
      ctor = this.#GetEventInterface(interface);
    }

    const window = this.#relevantGlobalObject;

    if (ctor === null) throw new DOMException("NotSupportedError");
    if (window[ctor.name] !== ctor) throw new DOMException("NotSupportedError");

    // const realm = undefined;
    // const event = new ctor(realm);
    // event.type = "";
    // event.timeStamp = window.performance.now();
    // event.isTrusted = false;
    // event.initialized = undefined;
    // return event;

    return Data.get(Event).Create(window, window.performance.now(), {});
  }

  // https://dom.spec.whatwg.org/#concept-node-insert
  #insert(node, child, suppress_observers)
  {
    let nodes;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    {
      nodes = node.children;
    }
    else if (node !== null)
    {
      nodes = [node];
    }

    let count = nodes.length;
    if (count === 0) return; // 3

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    {
      // Remove all of node's children with suppress_observers set
      node.#removeAllChildren(true);
      MutationObserver.Queue([], nodes, null, null);
    }

    if (child !== null) // 5: TODO
    {
    }

    // 6
    let previousSibling;
    if (child !== null) previousSibling = child.#previousSibling;
    else previousSibling = this.#lastChild;

    for (let i = 0; i < nodes.length; i++) // 7
    {
      const node = nodes[i];

      this.#adopt(node); // 7.1

      // TODO

      // if (child === null) // 7.2
      // {
      //   this.#append(node);
      // }
      // else // 7.3
      // {
      //
      // }
    }

    if (!suppress_observers)
    {
      this.#queueTreeMutationRecord(nodes, [], previousSibling, child);
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-replace-all
  #replaceAll(node)
  {
    let removedNodes = this.children;

    let addedNodes;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    {
      addedNodes = node.children; // 3
    }
    else if (node !== null)
    {
      addedNodes = [node]; // 4
    }

    // 5: Remove all of the parent's children
    let child = this.#firstChild;
    while (child)
    {
      const next = child.#nextSibling;
      child.#remove(true);
      child = next;
    }

    if (node !== null) this.#insert(node, null, true); // 6

    // 7
    if (addedNodes.length > 0 || removedNodes.length > 0)
    {
      this.#queueTreeMutationRecord(addedNodes, removedNodes, null, null);
    }
  }

  #remove(suppress_observers)
  {
    const parent = this.#parentNode; // 1
    if (parent === null) throw new Error("Parent cannot be null"); // 2

    const index = node.#index; // 3

    // 4, 5, 6, 7 TODO

    let oldPreviousSibling = this.#previousSibling; // 9
    let oldNextSibling = this.#nextSibling; // 10

    // 11, 12, 13: TODO

    let isParentConnected = parent.connected; // 16
  }
}

Node.ELEMENT_NODE = 1;
Node.ATTRIBUTE_NODE = 2;
Node.TEXT_NODE = 3;
Node.CDATA_SECTION_NODE = 4; // Deprecated
Node.ENTITY_REFERENCE_NODE = 5; // Deprecated
Node.ENTITY_NODE = 6; // Deprecated
Node.PROCESSING_INSTRUCTION_NODE = 7;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_TYPE_NODE = 10;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.NOTATION_NODE = 12; // Deprecated

Object.freeze(Node);
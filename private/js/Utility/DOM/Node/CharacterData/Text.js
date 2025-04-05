import {Node} from "/js/Utility/DOM/Node.js";
import {CharacterData} from "/js/Utility/DOM/Node/CharacterData.js";
import {Data} from "/js/Utility/DOM/Data.js";
import {MutationObserver} from "/js/Utility/DOM/Observer/MutationObserver.js";

export class Text extends CharacterData {
  constructor(data) {
    super(data);
  }

  get nodeType() { return Node.TEXT_NODE; }
  get nodeName() { return "#text"; }

  get assignedSlot() {
    return null; // TODO: Placeholder if Shadow DOM is not implemented
  }

  // https://dom.spec.whatwg.org/#dom-text-splittext
  // https://dom.spec.whatwg.org/#concept-text-split
  splitText(offset) {
    if (offset < 0 || offset > this.length) {
      throw new DOMException('IndexSizeError');
    }
  
    const parent = this.parentNode;
    const newText = this.substringData(offset, this.length - offset);
    const newNode = new Text(newText);
  
    if (parent) {
      parent.insertBefore(newNode, this.nextSibling); // Handles observer
    }
  
    // Modify this node
    this.deleteData(offset, this.length - offset);
  
    // Notify MutationObservers for this node's data change
    Data.get(MutationObserver).Notify(this, {
      type: "characterData",
      target: this,
      oldValue: this.data,
      newValue: this.substringData(0, offset)
    });
  
    return newNode;
  }

  // https://dom.spec.whatwg.org/#dom-text-wholetext
  get wholeText() {
    let text = '';
    let node = this;
    
    // Go backwards
    while (node && node.nodeType === Node.TEXT_NODE) {
      text = node.data + text;
      node = node.previousSibling;
    }
  
    node = this.nextSibling;
    
    // Go forwards
    while (node && node.nodeType === Node.TEXT_NODE) {
      text += node.data;
      node = node.nextSibling;
    }
  
    return text;
  }
}
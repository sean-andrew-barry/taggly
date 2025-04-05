import {Node} from "/js/Utility/DOM/Node.js";
import {CharacterData} from "/js/Utility/DOM/Node/CharacterData.js";

export class Comment extends CharacterData {
  constructor(data) {
    super(data);
  }

  get nodeType() { return Node.COMMENT_NODE; }
  get nodeName() { return "#comment"; }
}

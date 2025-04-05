import {Tag} from "/js/Tag.js";

export class Instance extends Tag
{
  constructor(node)
  {
    super(node).DisplayNone();
  }

  Connect(parent)
  {
    // Don't call the super here
  }
}

Instance.Register();

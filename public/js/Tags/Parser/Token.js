import {Tag} from "/js/Tag.js";
import {Text} from "/js/Tags/Text.js";
import {Connect} from "/js/Event/Connect.js";

export class Token extends Tag
{
  static CreateText(text)
  {
    const node = super.CreateText(text);

    if (!node.tag)
    {
      new Text().SetNode(node);
    }

    return node;
  }

  Describe(){}

  [Connect](event)
  {
    this.Describe();
  }

  Parse(p)
  {
    return false;
  }
}

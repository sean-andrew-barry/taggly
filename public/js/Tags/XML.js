import {Tag} from "/js/Tag.js";

export class XML extends Tag
{
  constructor(type)
  {
    super(type);
  }

  // Since an XML tag is created differently (it uses its Render parameter as its node type),
  // it needs to be loaded from JSON differently
  static fromJSON(json)
  {
    const tag = new this();
    tag.Render(json.name);

    const keys = Object.keys(json.attributes);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = json.attributes[key];

      tag.SetAttribute(key, val);
    }

    if (json.text)
    {
      tag.Text(json.text);
    }
    else
    {
      for (let i = 0; i < json.children.length; i++)
      {
        tag.Add(Tag.fromJSON(json.children[i]));
      }
    }

    return tag;
  }
}

import {Tag, HTML_NAMES} from "/js/Tag.js";

export class Classes extends Tag
{
  constructor(node)
  {
    super(node);
    for (const key in HTML_NAMES)
    {
      if (!HTML_NAMES.hasOwnProperty(key)) continue;
      const ctor = HTML_NAMES[key];

      const cls = Tag.Class(ctor.name);
      cls.SetResult(ctor);

      const map = ctor.GetMap();
      for (const key in map)
      {
        if (!map.hasOwnProperty(key)) continue;
        const value = map[key];

        if (value)
        {
          cls.AppendChild(Tag.Attribute().Name(key).Call(value).Skip(true));
        }
      }

      this.AppendChild(cls);
    }
  }
}

Classes.Register();

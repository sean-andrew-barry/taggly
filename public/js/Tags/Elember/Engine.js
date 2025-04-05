import {Tag} from "/js/Tag.js";

export class Engine extends Tag
{
  constructor(node, code)
  {
    super(node);
    this.code = code;
    this.tag = code;
    this.stack = [];

    console.log("Engine starting with", code.GetNode());
    // this.Run(this.tag, this);
  }

  Call(tag, target)
  {
    let ctor = tag.constructor;
    while (ctor)
    {
      const fn = this[ctor.name];
      if (typeof(fn) === "function")
      {
        fn.call(this, tag, target);
        return true;
      }
      else
      {
        ctor = ctor.GetParent(); // Get the parent class
      }
    }

    return false;
  }

  Parse(tag, target, clone = true)
  {
    if (clone)
    {
      target = target.AppendClone(tag, false, false);
    }

    const count = tag.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = tag.GetChild(i);
      if (child) this.Parse();
    }
  }

  Run(tag, parent)
  {
    let ctor = tag.constructor;
    while (ctor)
    {
      const fn = this[ctor.name];
      if (typeof(fn) === "function")
      {
        fn.call(this, tag, parent);
        break;
      }
      else
      {
        ctor = ctor.GetParent();
      }
    }
  }

  Next(tag, parent)
  {
    const clone = new tag.constructor(tag.GetNode().cloneNode(false));
    parent.AppendChild(clone);

    const child = tag.GetFirstChild();
    if (child)
    {
      this.Run(child, clone);
    }
  }

  Break(tag, parent)
  {
    // console.log("Breaking at", tag.GetNode());

    const sibling = tag.GetNextSibling();
    if (sibling)
    {
      console.log("Sibling", sibling.GetNode());
      this.Run(sibling, parent);
    }
  }

  Tag(tag, parent)
  {
    console.log("Visiting", tag.GetNode());
    this.Next(tag, parent);
  }

  Button(tag)
  {
    tag.OnClick(event =>
    {
      event.preventDefault();
    });
  }

  If(tag, target)
  {
    if (false) // Pretend it passed/failed
    {
      console.log("If passed", tag.GetNode());
      this.Parse(tag, target, false);
    }
    else
    {
      console.log("If failed", tag.GetNode());
      this.Break(tag, target);
    }
  }

  ElseIf(tag, parent)
  {
    if (false) // Pretend it passed/failed
    {
      console.log("ElseIf passed", tag.GetNode());
      this.Next(tag, parent);
    }
    else
    {
      console.log("ElseIf failed", tag.GetNode());
      this.Break(tag, parent);
    }
  }

  Else(tag, parent)
  {
    console.log("Else passed", tag.GetNode());
    this.Next(tag, parent);
  }

  Model(tag)
  {
    const action = tag.GetAttribute("action");
  }

  Value(tag)
  {
    const target = tag.GetAttribute("target");
  }

  Then(tag)
  {
  }

  Catch(tag)
  {
  }
}

Engine.Register();

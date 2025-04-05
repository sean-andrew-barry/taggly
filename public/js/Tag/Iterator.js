import {Iterator} from "/js/Utility/Iterator.js";

export class IteratorOld
{
  constructor(tag, next = true, down = true)
  {
    this._tag = tag;
    this._next = next;
    this._down = down;
    this.value = tag;
    this.done = false;
  }

  Up(){ return this.value = this.value.GetParent(); }
  Down(){ return this.value = this.value.GetFirstChild(); }
  Prev(){ return this.value = this.value.GetNextSibling(); }
  Next(){ return this.value = this.value.GetPrevSibling(); }

  Move(value)
  {
    if (value !== undefined)
    {
      this.value = value;
    }
    else
    {
      this.done = true;
    }

    return this;
  }

  NextHorizontal()
  {
    console.log("Getting NextHorizontal", this._next);
    switch (this._next)
    {
      case true: return this.value.GetNextSibling();
      case false: return this.value.GetPrevSibling();
      default: return undefined;
    }
  }

  NextVertical()
  {
    console.log("Getting NextVertical", this._down);
    switch (this._down)
    {
      case true: return this.value.GetFirstChild();
      case false: return this.value.GetParent();
      default: return this.value;
    }
  }

  next()
  {
    if (this.done) return this;

    let value = this.NextHorizontal();
    if (!value) value = this.NextVertical();

    if (value)
    {
      this.value = value;
    }
    else
    {
      this.done = true;
    }

    return this;

    // if (value) return { value, done: false, }
    // else return { value: undefined, done: true, }
  }

  next()
  {
    // console.log("Calling next", this);
    if (this.done) return this;
    else return this.Move(this.NextHorizontal() || this.NextVertical());
  }

  next()
  {
    if (this.done !== true)
    {
      const value = this.NextHorizontal();

      if (value) this.value = value;
      else this.done = true;
    }

    return this;
  }

  SetValue(value){ this.value = value; return this; }

  GetTag(){ return this.tag; }
  GetValue(){ return this.value; }
  GetDone(){ return this.done; }
  IsDone(){ return this.done === true; }

  [Symbol.iterator](){ return this; }
}

export class PrevIterator extends Iterator
{
  Then()
  {
    const value = this.Pop();

    this.Push(value.GetPrevSibling() || value.GetParent());

    return value;
  }
}

export class NextIterator extends Iterator
{
  Then()
  {
    const value = this.Pop();

    this.Push(value.GetNextSibling() || value.GetFirstChild());

    return value;
  }
}

export class SiblingIterator extends Iterator
{
  Then()
  {
    const value = this.Pop();

    this.Push(value.GetNextSibling());
    this.Push(value.GetFirstChild());

    return value;
  }
}

export class BreadthFirst extends Iterator
{
  constructor(tag)
  {
    super(tag);
    this.depth = 0;
    this._next = null;

    // // simulates operations for walking through tree using iteration
    // parentElement.depth = 0;
    // parentElement.next = null;
    //
    // let children, i, len;
    // let depth;
    // current = parentElement;
    //
    // while (current)
    // {
    //   depth = current.depth;
    //   children = current.childNodes;
    //   // removes this item from the linked list
    //   current = current.next;
    //
    //   for (i = 0, len = children.length; i < len; i++)
    //   {
    //     child = children[i];
    //     child.depth = depth+1;
    //     //place new item at the head of the list
    //     child.next = current;
    //     current = child;
    //   }
    // }
  }

  next()
  {

  }
}

export class DepthIterator extends Iterator
{
  constructor(tag, parent)
  {
    super(tag, parent);
    this.tag = tag;
    this.index = 0;
    // this.stack = [tag];
  }

  next()
  {
    if (this.value)
    {
      const i = this.index++;
      const children = this.tag.node.children;
      // console.log(i, "Moving to", children);

      if (children.length >= this.index)
      {
        const node = children[i];
        // console.log(i, node);
        this.Move(node.tag);
      }
      else
      {
        this.done = true;
      }
    }

    return this;
  }

  next()
  {
    let value;
    if (this.value)
    {
      const i = this.index++;
      const children = this.tag.node.children;

      if (children.length >= this.index)
      {
        const node = children[i];
        return new DepthIterator(node.tag, this);
        // value = node.tag;
      }
    }

    return super.next(value);
  }

  next()
  {
    if (this.value)
    {
      const i = this.index++;
      const children = this.tag.node.children;

      if (children.length >= this.index)
      {
        const node = children[i];
        // return new DepthIterator(node.tag, this);
        // value = node.tag;
      }
    }

    return super.next(value);
  }

  GetTag(){ return this.tag; }
}

import {Tag} from "/js/Tag.js";
import {Code} from "/js/Tags/Code.js";
import {Strong} from "/js/Tags/Strong.js";
import {Emphasis} from "/js/Tags/Emphasis.js";
import {Text} from "/js/Tags/Text.js";
import {OnConnect} from "/js/Tags/Event/OnConnect.js";

export class Group extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "group"; }

  Codes(...args){ return this.SetAttribute("codes", args); }
  Bolds(...args){ return this.SetAttribute("bolds", args); }
  Italics(...args){ return this.SetAttribute("italics", args); }

  [OnConnect](event)
  {
    if (this.IsDisabled()) return;

    // console.log("Group OnConnect");

    // const searched = new WeakSet();

    const bolds = this.GetAttribute("bolds");
    if (bolds) this.Search(this, bolds, Strong);

    const italics = this.GetAttribute("italics");
    if (italics) this.Search(this, italics, Emphasis);

    const codes = this.GetAttribute("codes");
    if (codes) this.Search(this, codes, Code);

    console.log("Final result:", this.GetInnerHTML());
  }

  Match(tag, matches, ctor)
  {
    // if (tag.GetParent() instanceof ctor) return false;

    const string = tag.GetText();
    for (let i = 0; i < matches.length; i++)
    {
      const match = matches[i];
      const index = string.indexOf(match);
      if (index >= 0)
      {
        const text = tag.Split(index);
        // console.log("~~Matched", text instanceof Tag);
        const remainder = text.Split(match.length);
        // console.log("~~~~~Matched string", match, "at index", index, text.GetText(), remainder.GetText());
        new ctor().Adopt(text);

        return true;
      }
    }

    return false;
  }

  Search(tag, matches, ctor, searched = new WeakSet())
  {
    if (searched.has(tag))
    {
      console.log("Already searched", tag.constructor.name);
      return;
    }
    else
    {
      searched.add(tag);
    }

    console.log("Searching", tag.constructor.name);

    if (tag.IsText())
    {
      // console.log("Searching text", tag.GetText());
      this.Match(tag, matches, ctor);
    }

    const child = tag.GetFirstChild();
    if (child)
    {
      // console.log("Searching child");
      this.Search(child, matches, ctor, searched);
    }

    const sibling = tag.GetNextSibling();
    if (sibling)
    {
      // console.log("Searching sibling");
      this.Search(sibling, matches, ctor, searched);
    }

    // if (!child) return;

    // const children = tag.GetChildNodes();
    // for (let i = 0; i < children.length; i++)
    // {
    //   const child = children[i].tag;
    //
    //   if (child)
    //   {
    //     if (child.IsText())
    //     {
    //       const text = child.GetText();
    //
    //     }
    //     else
    //     {
    //       this.Search(child, matches);
    //     }
    //   }
    // }
  }

  [OnConnect](event)
  {
    if (this.IsDisabled()) return;

    // console.log("Group OnConnect");

    // const searched = new WeakSet();

    // const keywords = [];

    const bolds = this.GetAttribute("bolds");
    // if (bolds) keywords.push.apply(keywords, bolds);
    if (bolds) this.Match(bolds, Strong);

    const italics = this.GetAttribute("italics");
    // if (italics) keywords.push.apply(keywords, italics);
    if (italics) this.Match(italics, Emphasis);

    const codes = this.GetAttribute("codes");
    if (codes) this.Match(codes, Code);

    // console.log("Keywords", keywords);

    // if (bolds)
    // {
    //   while (this.Search(this, bolds, Strong))
    //   {
    //   }
    // }

    // for (let i = 0; i < keywords.length; i++)
    // {
    //   const keyword = keywords[i];
    //
    //   const tag = this.GetFirstChild();
    //   while (this.Split(tag, keyword))
    //   {
    //     console.log(i, "Matched", keyword);
    //   }
    // }

    // const italics = this.GetAttribute("italics");
    // if (italics) this.Search(this, italics, Emphasis);
    //
    // const codes = this.GetAttribute("codes");
    // if (codes) this.Search(this, codes, Code);
    //
    console.log("Final result:", this.GetInnerHTML());
    // console.log("Final result:", this.ToPrettyHTML());
  }

  Match(keywords, ctor)
  {
    for (let i = 0; i < keywords.length; i++)
    {
      const keyword = keywords[i];

      const tag = this.GetFirstChild();
      while (true)
      {
        const result = this.Split(tag, keyword);
        if (result)
        {
          console.log(i, "Matched", keyword);
          new ctor().Adopt(result);
        }
        else
        {
          break;
        }
      }
    }
  }

  Split(tag, keyword)
  {
    if (tag.IsText())
    {
      const result = tag.Extract(keyword);
      if (result)
      {
        console.log("Extracted", keyword);
        return result;
      }
    }

    const child = tag.GetFirstChild();
    if (child)
    {
      const result = this.Split(child, keyword);
      if (result) return result;
    }

    const sibling = tag.GetNextSibling();
    if (sibling)
    {
      const result = this.Split(sibling, keyword);
      if (result) return result;
    }
  }

  Search(tag, matches, ctor, searched = new WeakSet())
  {
    if (searched.has(tag))
    {
      console.log("Already searched", tag.constructor.name);
      return;
    }
    else
    {
      searched.add(tag);
    }

    console.log("Searching", tag.constructor.name);

    if (tag.IsText())
    {
      // console.log("Searching text", tag.GetText());
      if (this.Match(tag, matches, ctor)) return true;
    }

    const child = tag.GetFirstChild();
    if (child)
    {
      // console.log("Searching child");
      return this.Search(child, matches, ctor, searched);
    }

    const sibling = tag.GetNextSibling();
    if (sibling)
    {
      // console.log("Searching sibling");
      return this.Search(sibling, matches, ctor, searched);
    }
  }
}

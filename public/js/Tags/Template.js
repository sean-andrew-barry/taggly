import {Tag} from "/js/Tag.js";
import {Fragment} from "/js/Tags/Fragment.js";
// import {OnConnect} from "/js/Tags/Event/OnConnect.js";

export class Template extends Tag
{
  static GetLocalName(){ return "template"; }
  static GetMetaURL(){ return import.meta.url; }

  Clone(deep = true, trusted = false)
  {
    const clone = this.GetNode().content.cloneNode(true);
    const tag = new Fragment(clone);

    // Wrap doesn't re-apply attributes to the first tag, so we do it manually when cloning
    tag.MapAttributes(trusted);
    tag.Wrap(trusted);

    return tag;
  }

  Add(...tags)
  {
    // console.log("Template adding", tags);
    const node = this.GetNode();

    // console.log(node.content);

    // for (let i = 0; i < tags.length; i++)
    // {
    //   const node = this.Convert(tags[i]);
    //   if (node) node.content.appendChild(node);
    // }

    return this;
  }
}

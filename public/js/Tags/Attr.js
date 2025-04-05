import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";

export class Attr extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "#attr"; }

  get localName(){ return this.GetNode().localName; }
  get name(){ return this.GetNode().name; }
  get namespaceURI(){ return this.GetNode().namespaceURI; }
  get ownerElement(){ return this.GetNode().ownerElement; }
  get prefix(){ return this.GetNode().prefix; }
  get specified(){ return this.GetNode().specified; }
  get value(){ return this.GetNode().value; }

  GetParentNode(){ return this.GetNode().ownerElement; }

  _Trust()
  {
    const node = this.GetNode();
    // const parent = this.GetParentNode();
    // const parent = Tag.For(node.ownerElement);
    // // const parent = node.ownerElement;
    // console.log("Untrusted #attr", node, parent);

    const parent = this.GetParent();

    const old = node.value;
    node.value = "";

    parent.Apply(node.name, [old], false);

    // switch (node.name)
    // {
    //   // onload, etc
    //   case "src":
    //   case "href":
    //   {
    //     const value = node.value;
    //     if (!value.startsWith("http://") && !value.startsWith("https://"))
    //     {
    //       node.value = "https://" + value;
    //     }
    //
    //     break;
    //   }
    // }

    return super.Trust(node);
  }

  // SetNode(node)
  // {
  //   // console.log("Attr", node);
  //   if (!this.constructor.IsTrusted(node))
  //   {
  //     console.log("Untrusted attribute", node);
  //     // console.log("Owner is", node.ownerElement);
  //     const parent = this.GetParentNode();
  //     // console.log(parent);
  //
  //     // this.constructor.Trust(node); // NOTE: Temporarily ignore...
  //   }
  //
  //   return super.SetNode(node);
  // }
}
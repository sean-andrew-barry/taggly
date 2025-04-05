import {Tag} from "/js/Tag.js";
import {MutationObserver} from "/js/Tag/Observers/MutationObserver.js";

export class Shadow extends Tag
{
  // CreateShadowRoot(tag)
  // {
  //   // this.SetNode(shadow_root);
  //   const shadow = new Tag();
  //
  //   const shadow_root = tag.GetNode().attachShadow({
  //     mode: "open",
  //   });
  //
  //   shadow.SetNode(shadow_root);
  //   const observer = new MutationObserver(shadow_root);
  //
  //   // Copy over the children of this Shadow object to the actual #shadow-root
  //   const fragment = this.CloneChildren();
  //   shadow.AppendChild(fragment);
  //
  //   return shadow;
  // }

  // constructor(tag)
  // {
  //   super();
  //
  //   const shadow_root = tag.GetNode().attachShadow({
  //     mode: "open",
  //   });
  //
  //   this.SetNode(shadow_root);
  //   this.observer = new MutationObserver(shadow_root);
  // }

  static GetLocalName(){ return "shadow-tag"; }

  constructor()
  {
    super();
    const base = this.constructor.CreateElement("shadow-tag");
    this.SetNode(base);

    const shadow_root = this.GetNode().attachShadow({ mode: "open" });
    this.shadow = new Tag();
    this.shadow.SetNode(shadow_root);

    this.observer = new MutationObserver(shadow_root);

    // this.Wait().then(() =>
    // {
    //   console.log("Shadow added to DOM");
    //   const parent = this.GetParent();
    //   const shadow_root = parent.GetNode().attachShadow({ mode: "open" });
    //   const shadow = new Tag();
    //   shadow.SetNode(shadow_root);
    //   // shadow.
    //   console.log("Parent", parent);
    //
    //   // const fragment = this.constructor.CreateFragment();
    //   // const fragment = Tag.Fragment();
    //
    //   const node = this.GetNode();
    //   for (let i = 0; i < node.children.length; i++)
    //   {
    //     const child = node.children[i];
    //     // fragment.AppendChild(this.Convert(child));
    //     shadow.AppendChild(this.Convert(child));
    //   }
    //
    //   this.Remove();
    //
    //   // this.Replace(fragment);
    // });
  }

  AppendChild(...args){ this.shadow.AppendChild.apply(this.shadow, args); return this; }
  InsertBefore(...args){ this.shadow.InsertBefore.apply(this.shadow, args); return this; }
  InsertAt(...args){ this.shadow.InsertAt.apply(this.shadow, args); return this; }
  ReplaceChild(...args){ this.shadow.ReplaceChild.apply(this.shadow, args); return this; }
  RemoveChild(...args){ this.shadow.RemoveChild.apply(this.shadow, args); return this; }
  Add(...args){ this.shadow.Add.apply(this.shadow, args); return this; }
  AddBeforeFirst(...args){ this.shadow.AddBeforeFirst.apply(this.shadow, args); return this; }
  AddBeforeLast(...args){ this.shadow.AddBeforeLast.apply(this.shadow, args); return this; }
  Replace(...args){ this.shadow.Replace.apply(this.shadow, args); return this; }
  Before(...args){ this.shadow.Before.apply(this.shadow, args); return this; }
  After(...args){ this.shadow.After.apply(this.shadow, args); return this; }
  InsertAfter(...args){ this.shadow.InsertAfter.apply(this.shadow, args); return this; }
  Clear(...args){ this.shadow.Clear.apply(this.shadow, args); return this; }

  // async CreateShadow()
  // {
  //   await this.Wait();
  //   const tag = this.GetParent();
  //
  //   const shadow_root = tag.GetNode().attachShadow({
  //     mode: "open",
  //   });
  //
  //   this.SetNode(shadow_root);
  //   this.observer = new MutationObserver(shadow_root);
  // }
}

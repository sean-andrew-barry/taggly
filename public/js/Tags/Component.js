import {Tag} from "/js/Tag.js";
import {MutationObserver} from "/js/Tag/Observers/MutationObserver.js";

// export class Shadow extends Tag
// {
//   CreateShadowRoot(tag)
//   {
//     // this.SetNode(shadow_root);
//     const shadow = new Tag();
//
//     const shadow_root = tag.GetNode().attachShadow({
//       mode: "open",
//     });
//
//     shadow.SetNode(shadow_root);
//     const observer = new MutationObserver(shadow_root);
//
//     // Copy over the children of this Shadow object to the actual #shadow-root
//     const fragment = this.CloneChildren();
//     shadow.AppendChild(fragment);
//
//     return shadow;
//   }
//
//   // constructor(tag)
//   // {
//   //   super();
//   //
//   //   const shadow_root = tag.GetNode().attachShadow({
//   //     mode: "open",
//   //   });
//   //
//   //   this.SetNode(shadow_root);
//   //   this.observer = new MutationObserver(shadow_root);
//   // }
// }
//
// Tag.Constructor(Shadow).Bind();

export class Component extends Tag
{
  static CreateElement(name = this.GetLocalName())
  {
    const ctor = window.customElements.get(name);

    if (!ctor)
    {
      window.customElements.define(name, class extends window.HTMLElement
      {
        connectedCallback(){ this.tag.Connected(); }
        disconnectedCallback(){ this.tag.Disconnected(); }
        adoptedCallback(){ this.tag.Adopted(); }
        attributeChangedCallback(name, old, value){ this.tag.AttributeChanged(name, old, value); }
      });
    }
    else if (ctor !== this)
    {
      throw new Error(`There already is a custom element named "${name}"`);
    }

    const node = window.document.createElement(name);
    return this.SetNodeAsTrusted(node);
  }

  constructor(...args)
  {
    super(...args);
    // const node = this.GetNode();
    // const shadow_root = node.attachShadow({
    //   mode: "open",
    // });

    // this.shadow_observer =

    // this.shadow = new Shadow(this);
    //
    // // this.shadow = new Tag();
    // // this.shadow.SetNode(shadow_root);
    //
    // this.shadow.Add(
    //   Tag.Style().Add(
    //     `img { max-width: 100px; } span { color: blue; font-size: 30px; }`,
    //     `:host { display: block; }`,
    //     // `::slotted(img) { max-width: 100px; } ::slotted(span) { color: blue; font-size: 30px; }`,
    //     Tag.CSS("img").MaxWidth("50px"),
    //     Tag.CSS("span").Color("blue"),
    //   ),
    //   // Tag.Slot().Name("icon").Add(
    //   //
    //   // ),
    //   // Tag.Span().Add(
    //   //   Tag.Slot().Text("Button"),
    //   // ),
    // );
  }

  Connected()
  {
    console.log("Connected", this);
  }

  Disconnected()
  {
    console.log("Disconnected", this);
  }

  Adopted()
  {
    console.log("Adopted", this);
  }

  AttributeChanged(name, oldValue, newValue)
  {
  }

  Add(...args)
  {
    console.log("Adding to shadow");
    this.shadow.Add.apply(this.shadow, args);
    return this;
  }
}

export class MyComponent extends Component
{
  constructor()
  {
    super();
  }
}

// Tag.Constructor(MyComponent).Add(
//   Tag.Shadow().Add(
//     Tag.Style().Add(
//       `img { max-width: 100px; } span { color: blue; font-size: 30px; }`,
//       `:host { display: block; }`,
//       // `::slotted(img) { max-width: 100px; } ::slotted(span) { color: blue; font-size: 30px; }`,
//       Tag.CSS("img").MaxWidth("50px"),
//       Tag.CSS("span").Color("blue"),
//     ),
//   ),
// );

// MyComponent.RegisterElement();

export class MyOtherComponent extends Component
{
  constructor()
  {
    super();
  }
}

// MyOtherComponent.RegisterElement();

// Tag.Shadow(MyComponent).Add(
//   Tag.Style().Add(
//     Tag.CSS(),
//   ),
//   Tag.Slot().Name("icon").Add(
//
//   ),
//   Tag.Span().Add(
//     Tag.Slot().Text("Button"),
//   ),
// );

// Tag.HTML().Add(
//   Tag.Head(),
//   Tag.Body().Clear().Add(
//     Tag.Div().Add(
//
//     ),
//     new MyComponent().Add(
//       Tag.Image().Src("/img/father.svg").Slot("icon"),
//       Tag.Span().Text("Settings"),
//     ),
//     // Tag.Image().Src("/img/father.svg"),
//   ),
// );

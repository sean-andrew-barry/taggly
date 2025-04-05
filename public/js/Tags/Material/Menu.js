import {Tag, String} from "/js/Tags.js";
import {Material} from "/js/Tags/Material.js";

export class MenuItem extends Material
{
  // static GetLocalName(){}

  Render()
  {
    super.Render(
      Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
        // Tag.Span("mdc-list-item__text").Add("A menu item"),
        Tag.Span("mdc-list-item__text"),
      ),
    );
  }

  [String](tag)
  {
    this.Query(".mdc-list-item__text").Add(tag);
  }
}

MenuItem.Register();

export class Menu extends Material
{
  Render()
  {
    super.Render(
      Tag.Div("mdc-menu mdc-menu-surface").Add(
        Tag.UnorderedList("mdc-list").RoleMenu().AriaOrientation("vertical").TabIndex(-1).Add(
          // Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
          //   Tag.Span("mdc-list-item__text").Add("A menu item"),
          // ),
          // Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
          //   Tag.Span("mdc-list-item__text").Add("Another menu item"),
          // ),
        ),
      ),
    );
  }

  _Render()
  {
    super.Render(
      // Tag.UnorderedList("mdc-list").RoleMenu().AriaOrientation("vertical").TabIndex(-1).Add(
      Tag.UnorderedList("mdc-list").RoleMenu().AriaOrientation("vertical").TabIndex(-1).Add(
        // Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
        //   Tag.Span("mdc-list-item__text").Add("A menu item"),
        // ),
        // Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
        //   Tag.Span("mdc-list-item__text").Add("Another menu item"),
        // ),
      ),
    );
  }

  [MenuItem](item)
  {
    this.Query("ul.mdc-list").AppendChild(item);
  }

  [Tag.ListItem](item)
  {
    // console.log("Adding List Item");
    item.AddClass("mdc-list-item");
    item.Role("menuitem");

    this.Query("ul.mdc-list").AppendChild(item);
  }

  // Add(...tags)
  // {
  //
  // }

  // Initialize()
  // {
  //   console.log("Initializing Menu node");
  //
  //   return super.Initialize();
  // }

  // Items(...tags){ return this.AddTo("ul.mdc-list", ...tags); }

  Open(v){ this.Query(".mdc-menu").ToggleClass("mdc-menu-surface--open", v); return this; }
  // Open(v){ this.ToggleClass("open", v); return this; }
}

Menu.Register().Add(
  // Tag.Import("/js/Tags/Material/Menu.style.js").Client(),
);

// 8r9E8UlXJTK^

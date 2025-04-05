import {Tag, String, UnorderedList as BaseUnorderedList} from "/js/Tags.js";
import {Material} from "/js/Tags/Material.js";

// export class UnorderedList extends BaseUnorderedList
// {
//   Render()
//   {
//     this.AddClass("mdc-list").RoleMenu().AriaOrientation("vertical").TabIndex(-1);
//
//     super.Render();
//   }
// }
//
// UnorderedList.Register(Material);

export class List extends Material
{
  // static New(...args)
  // {
  //   return super.New(...args).Is(this.GetID());
  // }

  Render()
  {
    super.Render(
      Tag.UnorderedList("mdc-list").RoleMenu().AriaOrientation("vertical").TabIndex(-1).Add(
      ),
    );
  }

  [ListItem](item)
  {
    this.Query("ul.mdc-list").AppendChild(item);
  }
}

List.Register();

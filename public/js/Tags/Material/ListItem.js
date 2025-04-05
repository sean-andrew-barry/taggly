import {Tag, String} from "/js/Tags.js";
import {Material} from "/js/Tags/Material.js";

export class ListItem extends Material
{
  Render()
  {
    super.Render(
      Tag.ListItem("mdc-list-item").RoleMenuItem().Add(
        Tag.Span("mdc-list-item__text"),
      ),
    );
  }

  [String](tag)
  {
    this.Query(".mdc-list-item__text").Add(tag);
    // this.Query(".mdc-list-item").Add(
    //   Tag.Span("mdc-list-item__text").Add(
    //     tag,
    //   ),
    // );
  }
}

ListItem.Register();

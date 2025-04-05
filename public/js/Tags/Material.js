import {Tag} from "/js/Tag.js";
import {ToTitleCase, ToKebabCase} from "/js/Utility/String.js";

export class Material extends Tag
{
  static GetRegistrationBase(){ return Material; }
  static SetNodeName(name = this.name){ return super.SetNodeName(`material-${ToKebabCase(name)}`); }
  static GetNodePrefix(){ return "material-"; }

  // static Bind()
  // {
  //   return super.Bind(Material);
  // }
}

// Material.Register().Add(
//   // Tag.Link().Rel("stylesheet").SetAttribute("href", "/forward?url=https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css"),
//   // Tag.Link().Rel("stylesheet").SetAttribute("href", "/forward?url=https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"),
//   // Tag.Link().Rel("stylesheet").SetAttribute("href", "/forward?url=https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css"),
//   // Tag.Link().Rel("stylesheet").SetAttribute("href", "/forward?url=https://fonts.googleapis.com/icon?family=Material+Icons"),
//   Tag.Link().Rel("stylesheet").HRef("https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css"),
//   Tag.Link().Rel("stylesheet").HRef("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"),
//   Tag.Link().Rel("stylesheet").HRef("https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css"),
//   Tag.Link().Rel("stylesheet").HRef("https://fonts.googleapis.com/icon?family=Material+Icons"),
// );

// Material.Dialog()
// .Open()
// .Title("Are you sure?")
// .Content("Are you really really really sure?")
// .Actions(
//   Material.DialogButton().Cancel().Label("Cancel"),
//   Material.DialogButton().Accept().Label("Confirm"),
// ),
//
// Material.Card(),
//
// Material.DataTable().Populate(
//   ["Dessert"           , "Carbs (g)", "Protein (g)", "Comments"             ],
//   ["Frozen Yogurt"     , 24         , 4            , "Super tasty"          ],
//   ["Ice cream sandwich", 24         , 4.3333333    , "I like ice cream more"],
//   ["Eclair"            , 4          , 4.3333333    , "New filing flavor"    ],
// ),
//
// Material.Menu().Open().Add(
//   Tag.ListItem().Add("Custom menu item text!"),
//   Material.MenuItem().Add("Custom menu item text!"),
//   // Material.MenuItem().Add("Custom menu item text!").On(Event.Click, e =>
//   // {
//   //   console.log("MenuItem 1 OnClick!");
//   // }),
//   Material.MenuItem().Add("Item 2"),
//   Material.MenuItem().Add("Item 3?"),
//   Material.MenuItem().Add("Item 4..."),
// ),

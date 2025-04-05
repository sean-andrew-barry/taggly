import {Tag} from "/js/Tag.js";
import {Material} from "/js/Tags/Material.js";

export class DataTableHeader extends Material
{

}

export class DataTableRow extends Material
{
}

export class DataTable extends Material
{
  Render()
  {
    super.Render(
      Tag.Div("mdc-data-table").Add(
        Tag.Table("mdc-data-table__table").AriaLabel("Dessert calories").Add(
          Tag.TableHead(),
          Tag.TableBody("mdc-data-table__content"),
        ),
      ),
    );
  }

  Populate(headers, ...rows)
  {
    const head = this.Query("thead");

    head.Clear().Add(
      Tag.TableRow("mdc-data-table__header-row").Add(
        headers.map(header =>
        {
          return Tag.TableHeader("mdc-data-table__header-cell").RoleColumnHeader().Scope("col").Text(header);
        }),
      ),
    );

    const body = this.Query("tbody").Clear();

    for (let i = 0; i < rows.length; i++)
    {
      body.Add(
        Tag.TableRow("mdc-data-table__row").Add(
          rows[i].map(text =>
          {
            const tag = Tag.TableData("mdc-data-table__cell").Text(text);
            if (typeof(text) === "number")
            {
              tag.AddClass("mdc-data-table__cell--numeric");
            }

            return tag;
          }),
        ),
      );
    }

    return this;
  }

  Head(...tags){ return this.AddTo("thead", ...tags); }
  Body(...tags){ return this.AddTo("tbody", ...tags); }
}

DataTable.Register();

function Example()
{
  const array = [
    Material.DataTable()
    .Headers("Dessert", "Carbs (g)", "Protein (g)", "Comments")
    .Row("Frozen Yogurt", 24, 4, "Super tasty")
    .Row("Ice cream sandwich", 24, 4, "I like ice cream more")
    .Row("Eclair", 24, 4, "New filing flavor"),

    Material.DataTable()
    .Column("Dessert", "Frozen Yogurt", "Ice cream sandwich", "Eclair")
    .Headers("Dessert", "Carbs (g)", "Protein (g)", "Comments")
    .Row("Frozen Yogurt", 24, 4, "Super tasty")
    .Row("Ice cream sandwich", 24, 4, "I like ice cream more")
    .Row("Eclair", 24, 4, "New filing flavor"),

    Material.DataTable().Add(
      Material.DataColumn("Dessert").Add("Frozen Yogurt", "Ice cream sandwich", "Eclair"),
      Material.DataColumn("Carbs (g)").Numeric().Add(24, 24, 24, 24),
      Material.DataColumn("Protein (g)").Numeric().Add(4, 4, 4, 4),
      Material.DataColumn("Comments").Push("Super tasty", "I like ice cream more", "New filing flavor"),
    ),
  ];
}

import {Tag} from "/js/Tag.js";

export class Controls extends Tag
{
  constructor(node, ctor)
  {
    super(node);
    this.ctor = ctor;
  }
}

export class Block extends Tag
{
  constructor(node)
  {
    super(node)
    .DisplayFlex()
    .Margin(1)
    .Padding(2)
    // .MinHeight("100px")
    .BackgroundShadowBase()
    .Rounded()
    // .BorderStyleInset()
    // .BorderStyleSolid()
    // .BorderWidth("0px")
    // .BorderLeftWidth("4px")
    // .BorderRightWidth("1px")
    // .BorderTopWidth("0")
    // .BorderBottomWidth("0")
    // .BorderGrey(5)
    .BackgroundWhite(1)
    .FlexWrapNoWrap()
    // .FlexBasis("30px")
    .FlexShrink1()
    .FlexDirectionColumn()
    ;

    super.Add(
      this.title = Tag.Header2("Title"),
      this.instance = Tag.Div("Instance").DisplayNone(),
      this.controls = Tag.Div("Controls"),
      this.children = Tag.Div("Children"),
    );

    this.Draggable(true);
    // this.OnClick(this[Tag.OnClick].bind(this));
  }

  Connect(parent)
  {
    const target = this.GetTarget();
    const result = target.GetResult();

    this.target = target;

    this.SetResult(result);
    super.Connect(parent);

    // console.log("Block is connecting with", result);
    this.title.Text(result.name);
    this.instance.Add(
      result.New(),
    );
  }

  [Tag.OnClick](event, tag)
  {
    if (this.controls.Contains(tag)) return;

    event.preventDefault();

    if (this.controls.HasChildren())
    {
      this.controls.Clear();
    }
    else
    {
      this.target.QueryEach("attribute", attribute =>
      {
        const name = attribute.GetAttribute("name");
        const call = attribute.GetAttribute("call");

        this.controls.Add(
          Tag.Div("field has-addons").Add(
            Tag.Div("control").Add(
              Tag.Button("button is-static").Text(name),
            ),
            Tag.Div("control").Add(
              Tag.Input("input").Type("text"),
            ),
            Tag.Div("control").Add(
              Tag.Button("button is-primary").Text(call).OnClick(e =>
              {
                e.preventDefault();
                const value = this.controls.Query("input").GetValue();
                console.log("Click:", value);

                const instance = this.instance.GetFirstChild();
                instance[call](value);
              }),
            ),
          ),
        );
      });
    }
  }

  Generate(tag)
  {
    // const generated = this.result.New();
    const generated = this.instance.GetFirstChild().Clone(true, true);

    tag.AppendChild(generated);

    const count = this.children.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = this.children.GetChild(i);
      if (child) child.Generate(generated);
    }

    return tag;
  }

  Add(...tags)
  {
    this.children.Add(...tags);
    return this;
  }
}

Block.Register({
  target: "Target",
});

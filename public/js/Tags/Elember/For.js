import {Tag} from "/js/Tag.js";

export class For extends Tag
{
  Connect(parent)
  {
    const target = this.GetTarget();
    const result = target.GetResult();

    const start = Number(this.GetAttribute("start")) || 0;
    const end = Number(this.GetAttribute("end"));

    this.Expect(start).Named("start").ToBeNumber();
    this.Expect(end).Named("end").ToBeNumber();

    if (start > end)
    {
      for (let i = end; i >= start; i--)
      {
        this.SetResult(i);
        super.Connect(parent);
      }
    }
    else
    {
      for (let i = start; i < end; i++)
      {
        this.SetResult(i);
        super.Connect(parent);
      }
    }
  }

  Start(v){ return this.SetAttribute("start", v); }
  End(v){ return this.SetAttribute("end", v); }
}

For.Register({
  start: "Start",
  end: "End",
});

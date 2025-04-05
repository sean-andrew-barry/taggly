import {Tag} from "/js/Tag.js";

export class Event extends Tag
{
  // constructor(node, name)
  // {
  //   super(node);
  //   this.name = name;
  // }

  _Connect(parent)
  {
    const target = this.GetTarget();
    const name = this.GetAttribute("name");

    console.log("Connecting event", name);
    target[name](event =>
    {
      console.log("Event!", event);
      event.preventDefault();
      super.Connect(parent);
    });
  }

  Run(parent, target)
  {
    const name = this.GetAttribute("name");

    target[name](event =>
    {
      event.preventDefault();
      super.Run(parent, target, false);
    });
  }
}

Event.Register({
  name: "Name",
});

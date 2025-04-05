import {Tag} from "/js/Tag.js";
import {OnConnect} from "/js/Tags/Event/OnConnect.js";

export class Operation extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "operation"; }

  // static SetNodeName(name = "operation"){ return super.SetNodeName(name); }

  constructor(operation)
  {
    super();
    if (operation)
    {
      this.Operation(operation);
    }
  }

  Operation(operation){ return this.SetAttribute("operation", operation); }
  GetOperation(){ return this.GetAttribute("operation"); }

  // Evaluate(parent)
  // {
  //   console.log("~~Evaluating operation");
  // }

  // [OnConnect](event)
  // {
  //   const value = this.GetValue();
  //   console.log("~~Operation OnConnect", value);
  //   this.Replace(value);
  // }

  GetValue()
  {
    if (this.HasAttribute("value"))
    {
      return super.GetValue();
    }

    const operation = this.GetOperation();
    if (typeof(operation) !== "string") throw new Error(`Operation tag expected to have a string as its operation`);

    const children = this.GetChildren();

    const left = children.shift(); // Remove the first child from the array
    if (!left) throw new Error(`Operation tag expected to have a child for its left hand value`);

    const value = left.Apply(operation, children);

    this.Value(value);

    return value;
  }
}

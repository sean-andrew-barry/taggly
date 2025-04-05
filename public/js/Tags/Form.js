import {Tag} from "/js/Tag.js";

export class Form extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "form"; }

  GetValues()
  {
    const values = {};
    const inputs = this.QueryAll("input, textarea");
    for (let i = 0; i < inputs.length; i++)
    {
      const input = inputs[i];

      let value;
      switch (input.GetType())
      {
        case "checkbox":
        {
          value = input.IsChecked();
          break;
        }
        case "radio":
        {
          value = input.IsChecked();
          break;
        }
        default:
        {
          value = input.GetValue();
        }
      }

      const names = (input.GetID() || input.GetName() || "").split(".");
      const key = names.pop();
      let current = values;
      for (let i = 0; i < names.length; i++)
      {
        const name = names[i];
        const next = names[i + 1];

        if (next === "0")
        {
          current = current[name] || (current[name] = []);
        }
        else
        {
          current = current[name] || (current[name] = {});
        }
      }

      current[key] = value;
    }

    return values;
  }

  GetValues()
  {
    const values = {};
    const inputs = this.QueryAll("input, textarea");
    for (let i = 0; i < inputs.length; i++)
    {
      const input = inputs[i];

      let value;
      switch (input.GetType())
      {
        case "checkbox":
        {
          value = input.IsChecked();
          break;
        }
        case "radio":
        {
          value = input.IsChecked();
          break;
        }
        default:
        {
          value = input.GetValue();
        }
      }

      const names = (input.GetID() || input.GetName() || "").split(".");
      const key = names.pop();
      let current = values;
      for (let i = 0; i < names.length; i++)
      {
        const name = names[i];
        const next = names[i + 1];

        if (next === "0")
        {
          current = current[name] || (current[name] = []);
        }
        else
        {
          current = current[name] || (current[name] = {});
        }
      }

      current[key] = value;
    }

    return values;
  }

  SetValues(values)
  {
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = values[key];

      const tag = this.Query(`[name="${key}"]`) || this.Query(`#${key}`);
      if (tag)
      {
        tag.SetValue(val);
      }
      else
      {
        throw new Error(`Form failed to find a tag for "${key}"`);
      }
    }
  }

  Submit()
  {
    // const node = this.GetNode();
    // console.log("Submitting", node.submit, node);
    // node.submit();

    const button = this.Query(`[type="submit"]`);
    if (button)
    {
      button.Click();
    }

    return this;
  }

  NoValidate(value){ return this.SetStateAttribute("novalidate", value); }
}

export {Form as FORM};

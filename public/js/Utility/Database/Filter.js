// import {Message} from "/js/Server/Message/Message.js";

export class Filter
{
  Add(key, operator, value)
  {
    switch (operator)
    {
      case "": return;

      // Equal to value
      case "===":
      case "==":
      case "eq": return this.Add(key, "$eq", value);

      // Not equal to value
      case "!==":
      case "!=":
      case "ne": return this.Add(key, "$ne", value);

      // Matches ANY of the values specified in the value array
      case "[===]":
      case "[==]":
      case "in": return this.Add(key, "$in", value);

      // Matches NONE of the values specified in the value array
      case "[!==]":
      case "[!=]":
      case "nin": return this.Add(key, "$nin", value);

      // Basic logical operations
      case ">":
      case "gt": return this.Add(key, "$gt", value);
      case "<":
      case "lt": return this.Add(key, "$lt", value);
      case ">=":
      case "gte": return this.Add(key, "$gte", value);
      case "<=":
      case "lte": return this.Add(key, "$lte", value);
      // NOTE: Can't think of a good way to implement $and/$or

      case "$":
      case "regex":
      {
        // RegExps should be sent as their default .toString() format,
        // so we need to convert it
        value.replace(/\/(.*)\/(\w*)/, (m, p1, p2) =>
        {
          if (p1) this.Add(key, "$regex", p1);
          if (p2) this.Add(key, "$options", p2);
        });

        return true;
      }

      case "$eq":
      case "$ne":
      case "$in":
      case "$nin":
      case "$gt":
      case "$lt":
      case "$gte":
      case "$lte":
      case "$regex":
      case "$options":
      {
        break;
      }
      default:
      {
        return;
      }
    }

    // console.log("Adding Filter", key, operator, value);

    if ((typeof(value) === "object") && (value !== null) && ((value.constructor === Object) || (value instanceof Message)))
    {
      // Flatten any nested fields
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++)
      {
        const k = keys[i];
        this.Add(`${key}.${k}`, operator, value[k]);
      }
    }
    else
    {
      if (!this[key]) this[key] = {};

      if ((value !== undefined) || !this[key].hasOwnProperty(operator))
      {
        if ((operator === "$in") || (operator === "$nin"))
        {
          if (this[key][operator])
          {
            this[key][operator].push(value);
          }
          else
          {
            this[key][operator] = [value];
          }
        }
        else
        {
          this[key][operator] = value;
        }
      }
    }

    return true;
  }
}

export class Update
{
  Add(key, operator, value)
  {
    if (this[operator]) this[operator][key] = value;
    else this[operator] = { [key]: value };

    return this;
  }
}

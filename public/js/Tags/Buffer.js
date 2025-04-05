import {Tag} from "/js/Tag.js";

// const METHODS = new WeakMap();
// class Method
// {
//   constructor(parent, fn, index = 0)
//   {
//     this.parent = parent;
//     this.fn = fn;
//     this.index = index;
//     this.children = [];
//     METHODS.set(fn, this);
//   }
//
//   Add(fn)
//   {
//     const method = new Method(this, fn, this.children.length);
//     this.children.push(method);
//
//     if (fn.hasOwnProperty("prototype"))
//     {
//       const names = GetPropertyNames(fn);
//       for (let i = 0; i < names.length; i++)
//       {
//         const name = names[i];
//         if (name === "constructor") continue;
//
//         const description = Object.getOwnPropertyDescriptor(fn.prototype, name);
//
//         if (description.hasOwnProperty("get")) continue;
//         if (description.hasOwnProperty("set")) continue;
//         if (typeof(description.value) !== "function") continue;
//
//         method.Add(description.value);
//       }
//     }
//
//     return method;
//   }
// }
//
// const global_method = new Method(undefined, function(){});
// global_method.Add(String);
// global_method.Add(Boolean);
// global_method.Add(Number);
// global_method.Add(Object);
// global_method.Add(Array);
// global_method.Add(Tag);
// global_method.Add(HTML);
// global_method.Add(Head);
// global_method.Add(Body);

class Registery
{
  ToFunction(value)
  {
    switch (typeof(value))
    {
      case "string": return String;
      case "boolean": return Boolean;
      case "symbol": return Symbol;
      case "number": return Number;
      case "undefined": return Undefined;
      case "function": return value;
      case "object":
      {
        if (value === null) return Null;
        else return value.constructor;
      }
      default:
      {
        throw new Error(`ToFunction must be given an object or a function`);
      }
    }
  }

  constructor(value)
  {
    // this.fn = this.ToFunction(value);
    // this.methods = new WeakSet();

    if (this.fn.hasOwnProperty("prototype"))
    {
      const names = GetPropertyNames(fn);
      for (let i = 0; i < names.length; i++)
      {
        const name = names[i];

        if (name === "constructor")
        {
          hash ^= hasher(string, hash, stride);
        }
        else
        {
          const description = Object.getOwnPropertyDescriptor(this.fn.prototype, name);

          if (description.hasOwnProperty("get")) continue;
          if (description.hasOwnProperty("set")) continue;
          if (typeof(description.value) !== "function") continue;



          // const method = new Method(description.value, th);
          // this.methods.set(description.value, method);

          // hash ^= GetFunctionHash(fn.prototype[name], hasher, hash);
        }
      }
    }
    else
    {

    }
  }
}

let current_code = 0;
const FUNCTIONS = new WeakMap();
function Register(fn)
{
  const code = current_code++;

  FUNCTIONS.set(fn, new Registery(fn));
}

export class Buffer extends Tag
{
  Write(value)
  {
    const tag = this.Convert(value);
    if (tag)
    {
      const method = Method.Find(tag.constructor);
      if (!method) throw new Error(`No method has been registered for "${tag.constructor.name}"`);

      this.WriteU16(method.index);
      tag.toBuffer(this, method);
    }
  }

  Read()
  {
    const code = this.ReadU16();
    const cls = Class.GetByCode(code);

    const tag = cls.New();
    tag.ApplyBuffer(this);
  }
}

class User extends Tag
{
  FirstName(o, v){ return this.SetAttributeString("first_name", o, v); }
  LastName(o, v){ return this.SetAttributeString("last_name", o, v); }
  Email(o, v){ return this.SetAttributeString("email", o, v); }
  Password(v){ return this.SetAttribute("password", v); }

  Apply(tag, action, args)
  {
    switch (action)
    {
      case "first_name": return this.FirstName(...args);
      case "last_name": return this.LastName(...args);
      case "email": return this.Email(...args);
      case "password": return this.Password(...args);
      case "client.search": return this.Email("==").Project({ _id: true });
      case "client.login": return this.Email("==");
      default: super.Apply(tag, action, args);
    }
  }

  toBuffer(buffer, method)
  {
    // We don't know the size yet, so simply put a 0 for now
    const start = buffer.Write16(0);

    const node = this.GetNode();

    if (node.attributes)
    {
      // Store the number of attributes
      buffer.Write8(node.attributes.length);

      for (let i = 0; i < node.attributes.length; i++)
      {
        const {name, call, value} = node.attributes[i];
        const fn = this[FromSnakeCase(name)];

        // const index = method.GetIndexFor(name);
        const index = method.constructor.Find(fn).index;
        buffer.Write8(index);

        const args = call || [value];
        buffer.Write8(args.length);

        for (let i = 0; i < args.length; i++)
        {
          buffer.Write(args[i]);
        }
      }
    }
    else
    {
      buffer.Write8(0);
    }

    const size = buffer.GetOffset() - start;

    // Now that we know the size, overwrite that 0 with the real size
    buffer.Write16(size, start, false);
  }

  ApplyBuffer(buffer, tag = this)
  {
    // The byte length of this tag, including its children
    const size = buffer.Read16();

    // The number of attributes this tag has
    const attribute_count = buffer.Read8();
    for (let i = 0; i < attribute_count; i++)
    {
      const code = buffer.Read8();
      const name = tag.GetAttributeName(code);
      const args = [];

      // The number of arguments this tag has
      const args_count = buffer.Read8();
      for (let j = 0; j < args_count; j++)
      {
        // Extract each argument
        args.push(buffer.Read());
      }

      this.Apply(tag, name, args);
    }
  }

  Example()
  {
    return [
      1, // message_id
      "user",
      [
        // "children",
        // [
        //   "span",
        //   [
        //     "text",
        //     ["Some text content..."],
        //   ],
        // ],
        "first_name",
        ["==", "Sean"],
        "last_name",
        ["==", "Barry"],
        "email",
        ["==", "fake@example.com"],
        "project",
        [{ _id: true }],
        "login",
        ["client#CLIENT_OBJECT_ID"],
      ],
    ];
  }
}

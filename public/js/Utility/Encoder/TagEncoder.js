import {Encoder} from "/js/Utility/Encoder.js";
import {Tag} from "/js/Tag.js";

export class TagEncoder extends Encoder
{
  EncodeAttributes(buffer, tag)
  {
    // We don't know the size yet, so simply put a 0 for now
    const start = buffer.WriteU32(0);

    const node = tag.GetNode();
    if (node.attributes)
    {
      for (let i = 0; i < node.attributes.length; i++)
      {
        const {name, value} = node.attributes[i];

        buffer.WriteString(name);
        buffer.WriteString(value);
      }
    }

    // Now that we know the size, overwrite that 0 with the end offset
    buffer.WriteU32(buffer.GetOffset(), start, false);
  }

  EncodeChildren(buffer, tag)
  {
    // We don't know the size yet, so simply put a 0 for now
    const start = buffer.WriteU32(0);

    const node = tag.GetNode();
    if (node.children)
    {
      for (let i = 0; i < node.children.length; i++)
      {
        const child = this.Convert(node.children[i]);
        buffer.Write(child);
      }
    }

    // Now that we know the size, overwrite that 0 with the end offset
    buffer.WriteU32(buffer.GetOffset(), start, false);
  }

  Encode(buffer, tag)
  {
    const local_name = tag.GetLocalName();
    const type = Tag.GetType(local_name);

    if (!type)
    {
      throw new Error(`Cannot encode tag type "${local_name}" because it isn't registered`);
    }

    if (type !== tag.constructor)
    {
      throw new Error(`Cannot encode tag type "${local_name}" because it doesn't match the registered type of that name`);
    }

    buffer.WriteString(tag.GetLocalName());

    this.EncodeAttributes(buffer, tag);
    this.EncodeChildren(buffer, tag);
  }

  DecodeAttributes(buffer, tag)
  {
    const end = buffer.ReadU32();
    while (end > buffer.GetOffset())
    {
      const name = buffer.ReadString();
      const value = buffer.ReadString();

      // Apply each attribute
      tag.Apply(name, [value]);
    }
  }

  DecodeChildren(buffer, tag)
  {
    const end = buffer.ReadU32();
    while (end > buffer.GetOffset())
    {
      const child = buffer.Read();

      // Apply each child
      tag.Apply("child", [child]);
    }
  }

  Decode(buffer)
  {
    const local_name = buffer.ReadString();
    const type = Tag.GetType(local_name);

    const tag = new type();

    this.DecodeAttributes(buffer, tag);
    this.DecodeChildren(buffer, tag);

    return tag;
  }

  GetType(){ return Tag; }

  RegisterName(name)
  {
    const code = StringUtilities.Hash16(name);

    if (TAG_CODES.hasOwnProperty(name) && TAG_CODES[name] !== code)
    {
      console.warn(i, `Code for tag property`, name, "is already used by", TAG_CODES[code]);
    }

    TAG_CODES[name] = code;
    TAG_CODES[code] = name;
  }

  RegisterNames(type)
  {
    const names = Object.getOwnPropertyNames(type.prototype);
    names.push("_id");

    for (let i = 0; i < names.length; i++)
    {
      const name = StringUtilities.ToSnakeCase(names[i]);
      this.RegisterName(name);
    }
  }
}

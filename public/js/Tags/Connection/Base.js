import { Tag } from "/js/Tag.js";
import { Client } from "/js/Tags/Model/Client.js";
import { Buffer } from "/js/Buffer.js";
import { Codes } from "/js/Codes.js";

const ID = Symbol("id");

export class Base extends Tag
{
  static GetIDSymbol() { return ID; }
  static GetMetaURL() { return import.meta.url; }
  static GetLocalName() { return "connection"; }

  constructor(socket)
  {
    // console.log("Connection base got client", Client);

    super();
    this.socket = socket;
    this.sent_length = 0; // Characters sent through the connection
    this.received_length = 0; // Characters received through the connection
    this.id = 0;
    // this.parser = window.document.createElement("div");

    // this.OnAddDescendant(event =>
    // {
    //   const tag = event.tag;
    //
    //   if (tag instanceof Model)
    //   {
    //     console.log(`Connection applying ${tag.GetLocalName()}.${tag.GetAttribute("action")}`);
    //     return;
    //
    //     const wrapper = this.ConvertEvent(event);
    //
    //     try
    //     {
    //       const parent = tag.GetParent();
    //       if ((parent !== this) && (parent.GetAttribute("action") !== "login"))
    //       {
    //         throw new Error(`The parent of a model must either be the connection itself or be logged in`);
    //       }
    //       else
    //       {
    //         // Confirm that the parent will adopt this tag as a child
    //         tag = parent.Apply(`${tag.GetLocalName()}.${tag.GetAttribute("action")}`, [tag]);
    //       }
    //
    //       // const result = this.Send(tag);
    //       // const value = this.Deconvert(result);
    //
    //       // Cause the OnConnect event to resolve with the tag
    //       wrapper.Resolve(tag);
    //     }
    //     catch (error)
    //     {
    //       tag.Remove();
    //
    //       // Cause the OnConnect event to reject with the error
    //       wrapper.Reject(error);
    //     }
    //   }
    // });
  }

  // GetParent(){ throw new Error(`Cannot call GetParent() on a connection for security, use the special GetConnectionParent() instead`); }
  // GetFirstChild(){ throw new Error(`Cannot call GetFirstChild() on a connection for security, use the special GetConnectionFirstChild() instead`); }
  // GetLastChild(){ throw new Error(`Cannot call GetLastChild() on a connection for security, use the special GetConnectionLastChild() instead`); }
  // GetPrevSibling(){ throw new Error(`Cannot call GetPrevSibling() on a connection for security, use the special GetConnectionPrevSibling() instead`); }
  // GetNextSibling(){ throw new Error(`Cannot call GetNextSibling() on a connection for security, use the special GetConnectionNextSibling() instead`); }

  GetConnectionParent() { return super.GetParent(); }
  GetConnectionFirstChild() { return super.GetFirstChild(); }
  GetConnectionLastChild() { return super.GetLastChild(); }
  GetConnectionPrevSibling() { return super.GetPrevSibling(); }
  GetConnectionNextSibling() { return super.GetNextSibling(); }

  OnClose(fn, opts) { return this.AddEventListener("OnClose", fn, opts); }

  SetTagID(tag, id = this.GetNextID())
  {
    if (!tag.hasOwnProperty(ID))
    {
      tag[ID] = id;
    }

    return tag;
  }

  GetTagID(tag)
  {
    return tag[ID];
  }

  Receive(html)
  {
    this.received_length += html.length;

    this.parser.innerHTML = html;

    const id = Number(this.parser.firstChild.nodeValue);
    const node = this.parser.lastChild;

    let tag = this.Convert(node);
    if (!tag) throw new Error(`Failed to convert node "${node.localName}" to a Tag`);

    tag[ID] = id;

    // if (global.taggly.IsServer())
    // {
    //   console.log("Connection receiving", html.length, id, tag.GetOuterHTML());
    // }
    // else
    // {
    //   console.log("Connection receiving", html.length, id, tag.GetNode());
    // }

    return tag;
  }

  Receive(data)
  {
    // console.log("Receiving", data);

    if (typeof (data) === "string")
    {
      // console.log("Receiving", data);
      this.received_length += data.length;

      return JSON.parse(data);
    }
    else
    {
      this.received_length += data.byteLength;
      const buffer = new Buffer(data);
      const array = buffer.Read();
      // console.log("Receiving", array);
      return array;
    }
  }

  async Receive(data)
  {
    // console.log("Receiving", data);

    if (typeof (data) === "string")
    {
      this.received_length += data.length;

      const json = JSON.parse(data);
      // console.log("Receiving string", json);
      return json;
    }
    else
    {
      this.received_length += data.byteLength;
      const buffer = new Buffer(data);

      // const array = await buffer.Read();
      // const id = await buffer.Read();
      // array.push(id);
      const array = buffer.Read();

      // console.log("Receiving binary", array);
      return array;
    }
  }

  SendAsString(id, tag)
  {
    const array = tag.toJSON();
    array.push(id);

    const string = JSON.stringify(array);
    this.sent_length += string.length;

    // console.log(id, "sending string", JSON.parse(string));

    return this.socket.send(string);
  }

  SendAsString(array)
  {
    // array.push(id);

    const string = JSON.stringify(array);
    this.sent_length += string.length;

    // console.log("sending string", JSON.parse(string));

    return this.socket.send(string);
  }

  async SendAsBuffer(id, tag)
  {
    // console.log("Sending", id, tag);

    const array = tag.toJSON();
    // const array = JSON.parse(JSON.stringify(tag));
    // console.log(id, "Sending", array);
    array.push(id);

    const buffer = new Buffer();
    // await buffer.Write(tag);
    // await buffer.Write(id);
    await buffer.Write(array);
    buffer.Shrink();

    // console.log("Sending", tag.GetOuterHTML());

    this.sent_length += buffer.GetBuffer().byteLength;

    // console.log("Sending", array);

    return this.socket.send(buffer.GetBuffer());
  }

  Send(id, tag)
  {
    this.Expect(id).Named("id").ToBeNumber();
    this.Expect(tag).Named("tag").ToBeInstanceOf(Tag);

    // return this.SendAsString(id, tag);
    return this.SendAsBuffer(id, tag);
  }

  Send(id, array)
  {
    // console.log("Sending", id, array);
    if (array === null)
    {
      array = [
        "null",
        [],
      ];
    }
    else if (array === undefined)
    {
      array = [
        "undefined",
        [],
      ];
    }
    else if (typeof (array) === "string")
    {
      array = [
        "string",
        [array],
      ];
    }
    else
    {
      array = array.toJSON();
    }

    // this.Expect(id).Named("id").ToBeNumber();
    // this.Expect(array).Named("array").ToBeArray();

    return this.SendAsString(id, array);
    // return this.SendAsBuffer(id, tag);
  }

  Send(id, tag)
  {
    // tag = this.Convert(tag).tag;

    this.Expect(id).Named("id").ToBeNumber();
    // this.Expect(tag).Named("tag").ToBeInstanceOf(Tag);

    return this.SendAsString(id, tag.toJSON());
    // return this.SendAsBuffer(id, tag);
  }

  Send(value)
  {
    // tag = this.Convert(tag).tag;

    // this.Expect(id).Named("id").ToBeNumber();
    // this.Expect(tag).Named("tag").ToBeInstanceOf(Tag);

    // const codes = Codes();
    // console.log("Sending", value, codes);

    if (value instanceof Tag)
    {
      value = value.toJSON();
    }

    return this.SendAsString(value);
    // return this.SendAsBuffer(id, tag);
  }

  async ReceiveBuffer(data)
  {
    const buffer = new Buffer(data);
    const message_id = buffer.ReadMessageID();

    if (this.#promises.has(message_id))
    {
      const promise = this.#promises.get(message_id);
      this.#promises.delete(message_id);

      const value = buffer.Read();
      if (value instanceof globalThis.Error)
      {
        promise.reject(value);
      }
      else
      {
        promise.resolve(value);
      }

      return;
    }
    else
    {
      const value = buffer.Read();
      console.log("Received", message_id, value);

      const reply = new Buffer();
      reply.WriteMessageID(message_id);

      try
      {
        const result = await value.call(this);
        reply.Write(result);
      }
      catch (error)
      {
        reply.Write(error);
      }
      finally
      {
        this.SendBuffer(reply);
      }
    }
  }

  SendBuffer(buffer)
  {
    buffer.Shrink();
    this.socket.send(buffer.GetBuffer());
  }

  #promises = new Map();

  Call(fn, ...args)
  {
    return new Promise(async (resolve, reject) =>
    {
      await this.promise;

      const message_id = this.GetNextID();

      this.#promises.set(message_id, {
        resolve,
        reject,
        time: Date.now(),
      });

      const codes = Codes();
      if (!codes.has(fn))
      {
        throw new Error(`Cannot send function "${fn.name}" because it does not have a code and isn't registered`);
      }

      const buffer = new Buffer();

      buffer.WriteMessageID(message_id);
      buffer.Write(fn, ...args);

      this.SendBuffer(buffer);
    });
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "error": return Tag.Error().ApplyEach(args);
      case "null": return Tag.Null().ApplyEach(args);
      case "array": return Tag.Array().ApplyEach(args);
      case "number": return Tag.Number().ApplyEach(args);
      case "boolean": return Tag.Boolean().ApplyEach(args);
      case "string": return Tag.String().ApplyEach(args);

      case "client": return Client.From(args).Project({ _id: true });

      // case "client.login": return args[0].Project({ _id: true });
      // NOTE: Projecting client to just _id is critical, because otherwise it could expose session_ids
      case "client.login": return Client.From(args).Project({ _id: true }).Login(this);

      // Don't call super.Apply here, because it's illegal to modify attributes on the connection anyway, it only creates tags
      default: throw new Error(`The connection does not allow for action "${action}" to be applied`);
    }
  }

  GetID() { return this.id; }
  GetNextID() { return this.id++; }
  GetSocket() { return this.socket; }
  GetSentLength() { return this.sent_length; }
  GetReceivedLength() { return this.received_length; }
}

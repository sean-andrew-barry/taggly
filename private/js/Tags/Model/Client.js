import {Tag} from "/js/Tag.js";
import {Connection} from "/js/Tags/Connection.js";
import {Client as Base} from "/js/Tags/Model/Client.js?after=/taggly/private/";

export class Client extends Base
{
  static Get()
  {
    throw new Error(`Client.Get is only valid on the client side, as there are many different clients on the server`);
  }

  ConvertChildrenToActions(tag = this)
  {
    const children = [];

    const node = tag.GetNode();
    for (let i = 0; i < node.children.length; i++)
    {
      const child = node.children[i];
      if (child.tag)
      {
        const actions = child.tag.GetActions().slice();

        if (child.children.length > 0)
        {
          const result = this.ConvertChildrenToActions(child.tag);
          actions.push.apply(actions, result);
        }

        // actions.push();
        children.push(child.tag.GetLocalName(), actions);
      }
    }

    // if (children.length > 0)
    // {
    //   return [
    //     "children",
    //     children,
    //   ];
    // }
    // else
    // {
    //   return undefined;
    // }

    return [
      "children",
      children,
    ];
  }

  async Login(owner)
  {
    this.Expect(owner).ToBeInstanceOf(Connection);
    this.Expect(this.session_id).ToBeValidString();

    const client = await new this.constructor().SessionID("==", this.session_id).Unsert(owner);

    if (client instanceof Client)
    {
      if (client.html)
      {
        client.ApplyHTML(client.html);
      }

      owner.OnDisconnect(event =>
      {
        console.log("Connection closed!");
        client.HTML("=", client.GetInnerHTML());
        client.Update(event.tag);
      });

      owner.AppendChild(client);
    }

    return client;
  }
}

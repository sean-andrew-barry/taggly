import {Tag} from "/js/Tag.js";
import {Client} from "/js/Tags/Model/Client.js";
import {Class} from "/js/Tags/Docs/Class.js";
import {Method} from "/js/Tags/Docs/Method.js";
import {Parameter} from "/js/Tags/Docs/Parameter.js";
import {Span} from "/js/Tags/Span.js";
import {Property} from "/js/Tags/Docs/Property.js";
import {Description} from "/js/Tags/Docs/Description.js";
import {Ref} from "/js/Tags/Docs/Ref.js";

export default new Class(Client).Add(
  new Property("session_id").InstanceOf("class.String").Add(
    new Description().Add(
      new Span().Text(`The id for the client's active session. This gets generated in client side code and MUST be both unique and secret!`),
    ),
  ),

  new Property("html").InstanceOf("class.String").Add(
    new Description().Add(
      new Span().Text(`The serialization of all active logins belonging to this `),
      new Ref(".Model .Client"),
      new Span().Text(`, which get saved/loaded when the `),
      new Ref(".Model .Client"),
      new Span().Text(` disconnects/reconnects.`),
    ),
  ),

  new Method("SessionID").Add(
    new Parameter("o").Name("operator").Example("==").InstanceOf("class.String"),
    new Parameter("v").Name("value").Example("3fa2ad3d20fb753d6d46335a71240f149385f61e8da5b761").InstanceOf("class.String"),
    new Description().Add(
      `Sets the `,
      new Ref(".Model .Client.session_id"),
      ` property.`
    ),
  ),

  new Method("HTML").Add(
    new Parameter("o").Name("operator").Example("==").InstanceOf("class.String"),
    new Parameter("v").Name("value").Example(`<user email="email@example.com"></user>`).InstanceOf("class.String"),
    new Description().Add(
      `Serialization of all active logins belonging to this `,
      new Ref(".Model .Client"),
      `, which get saved/loaded when the `,
      new Ref(".Model .Client"),
      ` disconnects/reconnects.`
    ),
  ),

  new Method("Client").Add(
    new Description().Add(
      "Access to the current ",
      new Ref(".Model .Client"),
      " object. Locked to the same ",
      new Ref(".Model .Client property.session_id"),
    ),
  ),
);

import {Tag} from "/js/Tag.js";
import {Docs} from "/js/Tags.js";
import {Client} from "/js/Tags/Model/Client.js";

export default [
  new Property("session_id").TypeOf("string").InstanceOf(String).Add(
    new Description().Add(
      new Span().Text(`The id for the client's active session. This gets generated in client side code and MUST be both unique and secret!`),
    ),
  ),

  new Property("html").TypeOf("string").InstanceOf(String).Add(
    new Description().Add(
      new Span().Text(`The serialization of all active logins belonging to this `),
      new Ref("class.Client").Text("Client"),
      new Span().Text(`, which get saved/loaded when the `),
      new Ref("class.Client").Text("Client"),
      new Span().Text(` disconnects/reconnects.`),
    ),
  ),

  new Method("SessionID").Add(
    new Parameter("o").Name("operator").Example("==").InstanceOf(String),
    new Parameter("v").Name("value").Example("3fa2ad3d20fb753d6d46335a71240f149385f61e8da5b761").InstanceOf(String),
    new Description().Add(
      `Sets the `,
      new Ref("property.session_id"),
      ` property.`
    ),
  ),

  new Method("HTML").Add(
    new Parameter("o").Name("operator").Example("==").InstanceOf(String),
    new Parameter("v").Name("value").Example(`<user email="email@example.com"></user>`).InstanceOf(String),
    new Description().Add(
      `Serialization of all active logins belonging to this `,
      new Ref("class.Client"),
      `, which get saved/loaded when the `,
      new Ref("class.Client"),
      ` disconnects/reconnects.`
    ),
  ),

  new Method("Client").Add(
    new Description().Add(
      new Span().Text("Access to the current "),
      new Ref("class.Client method.Client").Text("Client"),
      new Span().Text(" object. Locked to the same "),
      new Ref("class.Client property.session_id").Text("session_id"),
    ),
  ),
];

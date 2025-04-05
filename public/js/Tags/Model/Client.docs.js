import {Tag} from "/js/Tag.js";
import {Docs} from "/js/Tags.js";
import {Client} from "/js/Tags/Model/Client.js";

export default [
  Tag.Property("session_id").TypeOf("string").InstanceOf(String).Add(
    Tag.Description().Add(
      Tag.Span().Text(`The id for the client's active session. This gets generated in client side code and MUST be both unique and secret!`),
    ),
  ),

  Tag.Property("html").TypeOf("string").InstanceOf(String).Add(
    Tag.Description().Add(
      Tag.Span().Text(`The serialization of all active logins belonging to this `),
      Tag.Ref("class.Client").Text("Client"),
      Tag.Span().Text(`, which get saved/loaded when the `),
      Tag.Ref("class.Client").Text("Client"),
      Tag.Span().Text(` disconnects/reconnects.`),
    ),
  ),

  Tag.Method("SessionID").Add(
    Tag.Parameter("o").Name("operator").Example("==").InstanceOf(String),
    Tag.Parameter("v").Name("value").Example("3fa2ad3d20fb753d6d46335a71240f149385f61e8da5b761").InstanceOf(String),
    Tag.Description().Add(
      `Sets the `,
      Tag.Ref("property.session_id"),
      ` property.`
    ),
  ),
  
  Tag.Method("HTML").Add(
    Tag.Parameter("o").Name("operator").Example("==").InstanceOf(String),
    Tag.Parameter("v").Name("value").Example(`<user email="email@example.com"></user>`).InstanceOf(String),
    Tag.Description().Add(
      `Serialization of all active logins belonging to this `,
      Tag.Ref("class.Client"),
      `, which get saved/loaded when the `,
      Tag.Ref("class.Client"),
      ` disconnects/reconnects.`
    ),
  ),

  Tag.Method("Client").Add(
    Tag.Description().Add(
      Tag.Span().Text("Access to the current "),
      Tag.Ref("class.Client method.Client").Text("Client"),
      Tag.Span().Text(" object. Locked to the same "),
      Tag.Ref("class.Client property.session_id").Text("session_id"),
    ),
  ),
];

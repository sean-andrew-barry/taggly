import {Tag} from "/js/Tag.js";
import {Client} from "/js/Tags/Model/Client.js";

export default [
  Tag.Test("Client").Name("Has ID").Should("make sure that the Body grants access to the Client").Call(async t =>
  {
    const client = await Tag.Body().GetClient();
    t.Expect(client).ToBeInstanceOf(Client).ToHaveKey("_id");
  }),
];

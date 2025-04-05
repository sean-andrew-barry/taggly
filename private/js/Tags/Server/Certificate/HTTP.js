import {Tag} from "/js/Tag.js";
import {Server} from "/js/Tags/Server.js";

export class HTTP
{
  constructor(base = "https://acme-staging-v02.api.letsencrypt.org/directory")
  {
    this.base = base;
  }

  GetProtocol(){ return "http-01"; }

  async init(config)
  {
    this.server = await Tag.GetDocument().GetServer();
  }

  async set(data)
  {
    const {challenge} = data;
    const key = `${challenge.identifier.value}#${challenge.token}`;

    this.handler = (req, res) =>
    {
      this.authorization = data.keyAuthorization;
    };

    this.server.Listen("GET", key, this.handler);
  }

  async get(data)
  {
    const {challenge} = data;
    const key = `${challenge.identifier.value}#${challenge.token}`;

    if (this.authorization)
    {
      return this.authorization;
    }
  }

  async remove(data)
  {
    const {challenge} = data;
    const key = `${challenge.identifier.value}#${challenge.token}`;

    this.server.Silence("GET", key, this.handler);

    delete this.handler;
  }
}

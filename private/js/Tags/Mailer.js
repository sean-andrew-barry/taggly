import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Environment.js";
import node_mailer from "/js/External/NodeMailer.js?static=true";

export class Mailer extends Tag
{
  // Only create the mailer if it has been overridden
  static Use(){ return this !== Mailer; }

  // constructor(config, options = {})
  // {
  //   super();
  //
  //   this.transporter = this.CreateTransporter(config, options);
  // }

  constructor(...args)
  {
    super(...args);
    this.transporter = this.CreateTransporter();
  }

  Use(){ return this.constructor !== Mailer; }
  GetHost(){ throw new Error("Mailer.GetHost must be overriden"); }
  GetPort(){ return 465; }
  GetUsername(){ throw new Error("Mailer.GetUsername must be overriden"); }
  GetPassword(){ throw new Error("Mailer.GetPassword must be overriden"); }
  GetCacheKey(){ throw new Error("Mailer.GetCacheKey must be overriden"); }

  async CreateTransporter()
  {
    if (!(await this.Use())) return;

    const host = await this.GetHost();
    const port = await this.GetPort();
    const username = await this.GetUsername();
    const password = await this.GetPassword();
    const cache = await this.GetCacheKey();

    let transporter;
    if (cache)
    {
      transporter = Environment.GetCached(cache);
    }

    if (!transporter)
    {
      transporter = node_mailer.createTransport({
        host: host,
        port: port,
        secure: port === 465 ? true : false, // true for 465 port, false for other ports
        auth: {
          user: username,
          pass: password,
        },
      });
    }

    if (cache)
    {
      // Save the transporter in the global cache for performance on hot reloads
      Environment.SetCached(cache, transporter);
    }

    return transporter;
  }

  // async CreateTransporter(config, {
  //   host = config.GetMailerHost(),
  //   port = config.GetMailerPort(),
  //   username = config.GetMailerUsername(),
  //   password = config.GetMailerPassword(),
  //   cache = config.GetMailerCacheKey(),
  // })
  // {
  //   host = await host;
  //   port = await port;
  //   username = await username;
  //   password = await password;
  //
  //   await this.Wait();
  //
  //   let transporter;
  //   if (cache)
  //   {
  //     transporter = Environment.GetCached(cache);
  //   }
  //
  //   if (!transporter)
  //   {
  //     transporter = node_mailer.createTransport({
  //       host: host,
  //       port: port,
  //       secure: port === 465 ? true : false, // true for 465 port, false for other ports
  //       auth: {
  //         user: username,
  //         pass: password,
  //       },
  //     });
  //   }
  //
  //   if (cache)
  //   {
  //     // Save the transporter in the global cache for performance on hot reloads
  //     Environment.SetCached(cache, transporter);
  //   }
  //
  //   return transporter;
  // }

  Send({
    name,
    email,
    emails,
    subject,
    text,
    html,
  })
  {
    if (!name) throw new Error(`From name is required`);
    if (!email) throw new Error(`From email is required`);
    if (!emails || emails.length === 0) throw new Error(`To emails are required`);
    if (!subject) throw new Error(`A subject is required`);
    if (!text && !html) throw new Error(`Plain text and/or html content is required`);

    const options = {};
    options.from = `"${name}" <${email}>`;
    options.to = emails.join(", ");
    options.subject = subject;
    options.text = text;
    options.html = html;

    return new Promise(async (resolve, reject) =>
    {
      const transporter = await this.GetTransporter();
      transporter.sendMail(options, (error, info) =>
      {
        if (error) reject(error);
        else resolve(info);
      });
    });
  }

  GetTransporter(){ return this.transporter; }
}

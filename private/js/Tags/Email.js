import {Tag} from "/js/Tag.js";
import node_mailer from "/js/External/NodeMailer.js?static=true";

export class Email extends Tag
{
  constructor(node)
  {
    super(node);

    this.options = {};
  }

  From({name, email}){ this.options.from = `"${name}" <${email}>`; return this; }
  To(...emails){ this.options.to = emails.join(", "); return this; }
  Subject(subject){ this.options.subject = subject; return this; }
  Text(text){ this.options.text = text; return this; }
  HTML(html){ this.options.html = html; return this; }

  Send()
  {
    if (!this.transporter) throw new Error(`No email transporter`);
    if (!this.options.from) throw new Error(`No "From" email set`);
    if (!this.options.to) throw new Error(`No "To" email set`);

    return this.transporter.Send(this.options);
  }
}

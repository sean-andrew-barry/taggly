import {Tag} from "/js/Tag.js";
import {THead} from "/js/Tags/THead.js";
import {TBody} from "/js/Tags/TBody.js";
import {TFoot} from "/js/Tags/TFoot.js";
import {TH} from "/js/Tags/TH.js";
import {TR} from "/js/Tags/TR.js";
import {TD} from "/js/Tags/TD.js";
import {Connect} from "/js/Event/Connect.js";
import {Mutation} from "/js/Event/Mutation.js";

export class Table extends Tag
{
  static GetLocalName(){ return "table"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor()
  {
    super();
  }

  Generate()
  {
    if (this.generated) return this;
    else this.generated = true;

    return this.Clear().Add(
      this.head = new THead().Add(

      ),
      this.body = new TBody().Add(

      ),
      this.foot = new TFoot().Add(

      ),
    );
  }

  Columns(...columns){ return this.SetAttribute("columns", columns); }
  Sources(...sources){ return this.SetAttribute("sources", sources); }

  [Mutation](event)
  {
    console.log("Table Mutation");
  }

  async Draw(selector, columns, fn)
  {
    const source = this.Query(selector);
    const data = [];

    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      const value = source.GetAttribute(column);
      console.log(i, column, value);
      data.push(new TD().Text(value));
    }

    return new TR().Add(
      new TH().Text(i + 1),
      ...data,
    );
  }

  [Connect](event)
  {
    if (this.IsDisabled()) return;
    // if (this.HasChildren()) return;

    const columns = this.GetAttribute("columns") ?? [];
    const sources = this.GetAttribute("sources") ?? [];

    this.Add(
      this.head = new THead().Add(
        new TR().Add(
          ...columns.map(c => new TH().Text(c)),
        ),
      ),
      this.body = new TBody().Add(
        ...sources.map((selector, i) =>
        {
          const source = this.Query(selector);
          const data = [];
          if (source)
          {
            for (let i = 0; i < columns.length; i++)
            {
              const column = columns[i];
              const value = source.GetAttribute(column);
              console.log(i, column, value);
              data.push(new TD().Text(value));
            }
          }
          else
          {
            console.warn("Failed to find a source for", selector);
          }

          return new TR().Add(
            new TH().Text(i + 1),
            ...data,
          );
        }),
      ),
      this.foot = new TFoot().Add(

      ),
    );
  }
}

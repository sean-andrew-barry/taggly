import Tag from "/js/Tag.docs.js";
import Model from "/js/Tags/Model.docs.js";
import Client from "/js/Tags/Model/Client.docs.js";

export class Global extends Tag
{
  constructor(...args)
  {
    super(...args).Add(
      new Class(global.String).Add(

      ),
      new Class(global.Number).Add(

      ),
      new Class(global.Symbol).Add(

      ),
      new Class(global.Array).Add(

      ),
      new Class(global.Object).Add(

      ),
      new Class(global.Function).Add(

      ),
      new Class(global.Node).Add(
        new Class(global.Element).Add(

        ),
      ),
      Tag.Add(
        String,
        Number,
        Symbol,
        Array,
        Object,
        Model.Add(
          Client,
        ),
      ),
    );
  }
}

import {Method} from "/js/Tags/Page/Docs/Method.js";

export class IsMatch extends Method
{
  Arguments(){ return ["query"]; }
  Return(){ return this.This; }
  Description(){ return P.Add`Tests if the ${this.Element} matches the given ${this.QuerySelectorMDN}`; }

  get element(){ return Code.Add("element", Tooltip.Add``); }
  get query(){ return Code.Add("query"); }

  Syntax()
  {
    return Div.Add(
      Pre.JavaScript`element.IsMatch(query)`,

      UL.Add(
        LI.Add`The ${Code.Strong`element`}`,
        LI.Add`A ${this.query_selector_mdn.Text`query string`} that will be matched against the element`,
      ),
    );
  }

  Example()
  {
    return Div.Add(
      Pre.JavaScript`import {Div} from "/js/Tags/Div.js";

      const result = new Div().Class("my-class").IsMatch("div.my-class");
      if (result === true)
      {
        console.log("True!");
      }`,

      P.Add`Since the ${Code.Add`Div`} has the HTML name ${Code.Add`div`} and is given the class "my-class", the query ${Code.Add`div.my-class`} will match it, and so it will return ${this.literal_true}.`,

      P.Add`If the ${this.query} were changed to ${Code.Add`a.my-class`} or ${Code.Add`div.not-my-class`} it would return ${this.literal_false}.`,
    );
  }
}

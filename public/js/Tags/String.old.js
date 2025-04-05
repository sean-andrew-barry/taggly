import {Tag} from "/js/Tag.js";
import {Parser} from "/js/Tags/Parser.js";
import {Fragment} from "/js/Tags/Fragment.js";
import {Position} from "/js/Tags/Parser/Position.js";
import {Character} from "/js/Tags/Parser/Character.js";
import {Environment} from "/js/Utility/Environment.js";

export class String extends Tag
{
  static GetNodeName(){ return "string"; }

  SetNode(node = this.constructor.CreateText(this.value)){ return super.SetNode(node); }

  constructor(value = "", raw = false)
  {
    super();

    if (value instanceof window.Text)
    {
      this.SetNode(value);
      value = value.nodeValue;
    }
    else if (value instanceof String)
    {
      this.SetNode(value.GetNode());
      value = value.value;
    }

    this.value = value;
    this.raw = raw;

    if (Environment.IsClient() && this.raw !== true)
    {
      this.Wait().then(() =>
      {
        if (this.raw === true) return;
        if (!this.IsInDocument()) return;

        const parser = new Parser(this, this.GetText());
        const fragment = new Fragment();
        parser.Push(fragment);

        while (parser.IsParsing())
        {
          const result = this.Parse(parser);
          if (result !== true)
          {
            throw new Error(`Failed to parse anything`);
          }
        }

        parser.Pop(fragment);

        if (fragment.HasNode())
        {
          if (this.GetParent())
          {
            // console.log("Replacing this", this);
            this.Replace(fragment);
          }
          else
          {
            console.warn("No parent for string", this);
          }
        }
      });
    }
  }

  GetText(){ return this.GetNode().nodeValue; }
  IsMatch(selector){ return false; }
  Query(selector){ return false; }
  QueryAll(selector){ return false; }
  QueryEach(selector){ return false; }

  Raw(raw = true){ this.raw = raw; return this; }

  Deconvert(){ return this.value; }

  Parse(parser)
  {
    if (parser.IsDone()) return false;

    const top = parser.GetTop();
    const character = parser.Take();

    top.AppendText(character, true);

    return true;
  }

  ToPrettyHTML(indent = "")
  {
    return indent + this.value;
  }
}

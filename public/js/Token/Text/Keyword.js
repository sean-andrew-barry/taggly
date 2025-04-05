import {Text} from "/js/Token/Text.js";

export class Keyword extends Text
{
  Parse()
  {
    const value = this.Value();
    const start = this.GetPosition();
    const length = value.length;
    const string = this.GetString();

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (string.length - start)) return false;

    for (let i = 0; i < length; i++)
    {
      let c = string[start + i];

      // If the sequence is at all different, return
      if (c !== value[i]) return false;
    }

    this.Walk(length);

    return true;
  }
}

export class TrueKeyword extends Keyword { Value(){ return "true"; } }
export class FalseKeyword extends Keyword { Value(){ return "false"; } }
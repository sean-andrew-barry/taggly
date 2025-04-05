import {Text} from "/js/Token/Text.js";

export class Error extends Text
{
  constructor(token)
  {
    super(token);
  }

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
export class Binary
{
  constructor(value)
  {
    this.value = value;
  }

  length(){ return this.value.length; }
  toJSON(){ return this.value; }
}

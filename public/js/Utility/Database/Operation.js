export class Operation
{
  static Encode(buffer, operation)
  {
    buffer.Write(operation.operator);
    buffer.Write(operation.value);
  }

  static Decode(buffer)
  {
    const operator = buffer.Read();
    const value = buffer.Read();
    
    return new this(operator, value);
  }

  constructor(operator, value)
  {
    this.operator = operator;
    this.value = value;
  }
}

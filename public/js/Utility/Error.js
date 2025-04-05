// const Base = window.Error;
export class Error extends window.Error
{
  Code(code){ this.code = code; return this; }
}

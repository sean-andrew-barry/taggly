export class CSS extends Tag
{
  static GetLocalName(){ return "css"; }

  Parse()
  {
    while (this.MatchStatement())
    {
    }
  }
}

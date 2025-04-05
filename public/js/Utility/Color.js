export class Color extends Uint16Array
{
  ToPixel(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}px`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  ToPercent(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}%`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  ToDegree(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}deg`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  ToTurn(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}turn`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  ToColor(v)
  {
    switch (typeof(v))
    {
      case "string": return v;
      case "object":
      {
        if (v.a) return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
        else return `rgb(${v.r}, ${v.g}, ${v.b})`;
      }
      case "undefined": return "";
    }
  }

  ToScale(v)
  {
    switch (typeof(v))
    {
      case "number": return `scale(${v / 100})`;
      case "string": return `scale(${v})`;
      case "object": return `scale(${v.x}, ${v.y})`;
    }
  }

  ToFloat(v)
  {
    switch (typeof(v))
    {
      case "number": return v;
      case "string": return v;
    }
  }

  ToInt(v)
  {
    switch (typeof(v))
    {
      case "number": return v;
      case "string": return v;
    }
  }

  constructor(x, y, z, alpha = 1.0)
  {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = alpha;
  }

  set alpha(v){ this[3] = v; }
  get alpha(){ return this[3]; }
}

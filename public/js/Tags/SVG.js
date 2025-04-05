import {Tag} from "/js/Tag.js";
// import {Path} from "/js/Tags/SVG/Path.js";
// import {Circle} from "/js/Tags/SVG/Circle.js";
// import {Rect} from "/js/Tags/SVG/Rect.js";
// import {G} from "/js/Tags/SVG/G.js";
// import {Polygon} from "/js/Tags/SVG/Polygon.js";
// import {Defs} from "/js/Tags/SVG/Defs.js";
// import {LinearGradient} from "/js/Tags/SVG/LinearGradient.js";
// import {Stop} from "/js/Tags/SVG/Stop.js";

export class SVG extends Tag
{
  // static GetBindTarget(){ return SVG; }
  static GetLocalName(){ return "svg"; }
  static GetMetaURL(){ return import.meta.url; }
  // static GetNS(){ return "http://www.w3.org/2000/svg"; }
  static GetElementNameSpace(){ return "http://www.w3.org/2000/svg"; }
  static GetAttributeNameSpace(){ return null; }
  // static GetAttributeNameSpace(){ return "http://www.w3.org/2000/svg"; }

  // static CreateElement(name = this.GetLocalName())
  // {
  //   const node = window.document.createElementNS("http://www.w3.org/2000/svg", name);
  //   return this.SetNodeAsTrusted(node);
  // }

  // SetAttribute()
  // {
  //
  // }

  static Raw(...args){ return new this().Raw(...args); }
  static Src(...args){ return new this().Src(...args); }

  Raw(str)
  {
    const xml = (new window.DOMParser()).parseFromString(str, "text/xml");

    const node = this.Convert(xml.firstChild);
    if (node)
    {
      this.SetNode(node);
    }

    return this;
  }

  Src(src)
  {
    super.Src(src);

    fetch(this.GetAttribute("src"))
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(async xml =>
    {
      const tag = this.Convert(xml.firstChild).tag;
      if (tag)
      {
        await this.Wait(); // Necessary to use Replace

        tag.Style(this.GetStylesText());
        this.Replace(tag);
        return tag;
      }
    });

    return this;
  }

  Construct(type, args)
  {
    switch (type)
    {
      case "path": return this.constructor.Path(...args);
      case "circle": return this.constructor.Circle(...args);
      case "rect": return this.constructor.Rect(...args);
      case "g": return this.constructor.G(...args);
      case "polygon": return this.constructor.Polygon(...args);
      case "defs": return this.constructor.Defs(...args);
      case "linearGradient": return this.constructor.LinearGradient(...args);
      case "stop": return this.constructor.Stop(...args);
      default: return super.Construct(type, args);
    }
  }

  DataName(v){ return this.SetAttribute("data-name", v); }
  XmlnsXlink(v){ return this.SetAttribute("xmlns:xlink", v); }
  XlinkHref(v){ return this.SetAttribute("xlink:href", v); }
  Fill(v){ return this.SetAttribute("fill", v); }
  R(v){ return this.SetAttribute("r", v); }
  CY(v){ return this.SetAttribute("cy", v); }
  CX(v){ return this.SetAttribute("cx", v); }
  RY(v){ return this.SetAttribute("ry", v); }
  RX(v){ return this.SetAttribute("rx", v); }
  Y(v){ return this.SetAttribute("y", v); }
  Y1(v){ return this.SetAttribute("y1", v); }
  Y2(v){ return this.SetAttribute("y2", v); }
  X(v){ return this.SetAttribute("x", v); }
  X1(v){ return this.SetAttribute("x1", v); }
  X2(v){ return this.SetAttribute("x2", v); }
  Opacity(v){ return this.SetAttribute("opacity", v); }
  Points(v){ return this.SetAttribute("points", v); }
  Transform(v){ return this.SetAttribute("transform", v); }
  StrokeWidth(v){ return this.SetAttribute("stroke-width", v); }
  StrokeMiterlimit(v){ return this.SetAttribute("stroke-miterlimit", v); }
  Stroke(v){ return this.SetAttribute("stroke", v); }
  GradientTransform(v){ return this.SetAttribute("gradientTransform", v); }
  GradientUnits(v){ return this.SetAttribute("gradientUnits", v); }
  StopOpacity(v){ return this.SetAttribute("stop-opacity", v); }
  StopColor(v){ return this.SetAttribute("stop-color", v); }
  StopOffset(v){ return this.SetAttribute("stop-offset", v); }
  Offset(v){ return this.SetAttribute("offset", v); }

  Apply(action, args)
  {
    switch (action)
    {
      case "data-name": return this.DataName.apply(this, args);
      case "xmlns:xlink": return this.XmlnsXlink.apply(this, args);
      case "xlink:href": return this.XlinkHref.apply(this, args);
      case "fill": return this.Fill.apply(this, args);
      case "r": return this.R.apply(this, args);
      case "cy": return this.CY.apply(this, args);
      case "cx": return this.CX.apply(this, args);
      case "ry": return this.RY.apply(this, args);
      case "rx": return this.RX.apply(this, args);
      case "y": return this.Y.apply(this, args);
      case "y1": return this.Y1.apply(this, args);
      case "y2": return this.Y2.apply(this, args);
      case "x": return this.X.apply(this, args);
      case "x1": return this.X1.apply(this, args);
      case "x2": return this.X2.apply(this, args);
      case "opacity": return this.Opacity.apply(this, args);
      case "points": return this.Points.apply(this, args);
      case "transform": return this.Transform.apply(this, args);
      case "stroke-width": return this.StrokeWidth.apply(this, args);
      case "stroke-miterlimit": return this.StrokeMiterlimit.apply(this, args);
      case "stroke": return this.Stroke.apply(this, args);
      case "gradientTransform": return this.GradientTransform.apply(this, args);
      case "gradientUnits": return this.GradientUnits.apply(this, args);
      case "stop-opacity": return this.StopOpacity.apply(this, args);
      case "stop-color": return this.StopColor.apply(this, args);
      case "stop-offset": return this.StopOffset.apply(this, args);
      case "offset": return this.Offset.apply(this, args);
      default: return super.Apply(action, args);
    }
  }
}

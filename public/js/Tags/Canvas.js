import {Tag} from "/js/Tag.js";
import {Vector2} from "/js/Utility/Math/Vector2.js";

export class Canvas extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "canvas"; }

  constructor(c)
  {
    super(c);
    this.context = this.CreateContext();
  }

  Clear()
  {
    console.log("Clearing", 0, 0, this.GetWidth(), this.GetHeight());
    // this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.clearRect(0, 0, this.GetWidth(), this.GetHeight());
    return this;
  }

  StrokeStyle(v){ this.context.strokeStyle = v; return this; }
  FillStyle(v){ this.context.fillStyle = v; return this; }
  LineJoin(v){ this.context.lineJoin = v; return this; }
  LineWidth(v){ this.context.lineWidth = v; return this; }

  BeginPath(){ this.context.beginPath(); return this; }
  ClosePath(){ this.context.closePath(); return this; }
  Stroke(){ this.context.stroke(); return this; }
  MoveTo(x, y){ this.context.moveTo(x, y); return this; }
  LineTo(x, y){ this.context.lineTo(x, y); return this; }

  DrawLine(from_x, from_y, to_x, to_y)
  {
    // console.log("Drawing Line from", from_x, from_y, "to", to_x, to_y);
    this.BeginPath();
    this.MoveTo(from_x, from_y);
    this.LineTo(to_x, to_y);
    this.ClosePath();
    this.Stroke();

    return this;
  }

  DrawLine(from_x, from_y, to_x, to_y)
  {
    // console.log("Drawing Line from", from_x, from_y, "to", to_x, to_y);
    this.context.beginPath();

    // console.log("Drawing...", to_x, to_y);
    this.context.moveTo(from_x, from_y);
    this.context.lineTo(to_x, to_y);

    this.context.closePath();
    this.context.stroke();

    return this;
  }

  DrawVertex(a, b)
  {
    this.context.beginPath();

    // console.log("Drawing...", to_x, to_y);
    this.context.moveTo(a[0], a[1]);
    this.context.lineTo(b[0], b[1]);

    this.context.closePath();
    // this.context.fill("nonzero");
    this.context.stroke();

    return this;
  }

  Drawable()
  {
    let last_x = 0;
    let last_y = 0;
    let drawing = false;
    this.points = [];

    this.OnMouseDown(e =>
    {
      const mouse_x = e.pageX - e.target.offsetLeft;
      const mouse_y = e.pageY - e.target.offsetTop;

      last_x = mouse_x;
      last_y = mouse_y;

      this.points.push(new Vector2(mouse_x, mouse_y));

      drawing = true;
    });

    this.OnMouseUp(e =>
    {
      drawing = false;

      const output = [];
      for (let i = 0; i < this.points.length; i++)
      {
        const point = this.points[i];
        output.push.apply(output, point);
      }

      console.log(JSON.stringify(output));
    });

    this.OnMouseMove(e =>
    {
      if (drawing)
      {
        this.StrokeStyle("#df4b26");
        this.LineJoin("round");
        this.LineWidth(5);

        const mouse_x = e.pageX - e.target.offsetLeft;
        const mouse_y = e.pageY - e.target.offsetTop;

        this.points.push(new Vector2(mouse_x, mouse_y));

        this.context.beginPath();

        // console.log("Drawing...", mouse_x, mouse_y);
        this.context.moveTo(last_x, last_y);
        this.context.lineTo(mouse_x, mouse_y);

        this.context.closePath();
        this.context.stroke();

        last_x = mouse_x;
        last_y = mouse_y;
      }
    });
  }

  CreateContext(type = "2d"){ return this.GetNode().getContext(type); }

  Fill(x, y, w, h){ this.context.fillRect(x, y, w, h); return this; }
  Stroke(x, y, w, h){ this.context.strokeRect(x, y, w, h); return this; }
  Clear(x = 0, y = 0, w = this.GetWidth(), h = this.GetHeight()){ this.context.clearRect(x, y, w, h); return this; }

  DrawImage(img, x, y, w = this.GetWidth(), h = this.GetHeight()){ this.context.drawImage(img.GetNode(), x, y, w, h); return this; }

  Rescale(width, height, max_width, max_height)
  {
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    const node = this.GetNode();
    node.width = width;
    node.height = height;

    return this;
  }

  GetContext(){ return this.context; }
  GetWidth(){ return this.GetNode().width; }
  GetHeight(){ return this.GetNode().height; }
  GetImageData(x = 0, y = 0, w = this.GetWidth(), h = this.GetHeight()){ return this.context.getImageData(x, y, w, h); }
  ToDataURL(type){ return this.GetNode().toDataURL(type); }
  ToArrrayBuffer(x, y, w, h){ return this.GetImageData(x, y, w, h).data; }
}

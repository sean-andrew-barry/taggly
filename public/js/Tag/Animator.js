import {Control} from "/js/Tag/Control.js";
import {Animation} from "/js/Tag/Animation.js";

export class Animator extends Control
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

  constructor(tag, args)
  {
    super(tag, args);
    // this.animation = undefined;
    this.animations = new Set();
    this.Reset();
  }

  Reset()
  {
    this.frames = [];
    this.options = {
      duration: 100,
      fill: "both",
    };
  }

  Frames(key, values)
  {
    if (values.length === 1)
    {
      values.push(values[0]);
    }

    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      if (value === undefined || value === null) continue;

      // console.log("Adding", { [key]: value }, "to frame", i);

      if (key === "transform")
      {

      }

      if (i >= this.frames.length)
      {
        this.frames.push({
          [key]: value,
        });
      }
      else
      {
        this.frames[i][key] = value;
      }
    }

    return this;
  }

  AppendFrames(key, values)
  {
    if (values.length === 1)
    {
      values.push(values[0]);
    }

    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      if (value === undefined || value === null) continue;

      // console.log("Adding", { [key]: value }, "to frame", i);

      if (i >= this.frames.length)
      {
        this.frames.push({
          [key]: value,
        });
      }
      else if (this.frames[i][key])
      {
        this.frames[i][key] += " " + value;
      }
      else
      {
        this.frames[i][key] = value;
      }
    }

    return this;
  }

  Option(key, value){ this.options[key] = value; return this; }

  // Animator options
  Duration(v){ return this.Option("duration", v); }
  Delay(v){ return this.Option("delay", v); }
  Start(v){ return this.Option("iterationStart", v); }
  Repeat(v){ return this.Option("iterations", v + 1); }
  Loop(){ return this.Option("iterations", Infinity); }

  DirectionNormal   (){ return this.Option("direction", "alternate"); }
  DirectionReverse  (){ return this.Option("direction", "normal"   ); }
  DirectionAlternate(){ return this.Option("direction", "reverse"  ); }

  FillForwards (){ return this.Option("fill", "forwards" ); }
  FillBackwards(){ return this.Option("fill", "backwards"); }
  FillBoth     (){ return this.Option("fill", "both"     ); }
  FillNone     (){ return this.Option("fill", "none"     ); }
  FillAuto     (){ return this.Option("fill", "auto"     ); }

  EaseIn   (){ return this.Option("easing", "ease-in"    ); }
  EaseOut  (){ return this.Option("easing", "ease-out"   ); }
  EaseInOut(){ return this.Option("easing", "ease-in-out"); }

  MS(v){ return this.Duration(v); }

  // Misc settings
  Color(...a){ return this.Frames("color", a); }
  Border(...a){ return this.Frames("border", a); }
  BoxShadow(...a){ return this.Frames("boxShadow", a); }
  Easing(...a){ return this.Frames("easing", a); }
  Opacity(...a){ return this.Frames("opacity", a); }
  Offset(...a){ return this.Frames("offset", a); }

  Translate  (...a){ return this.AppendFrames("transform", a.map(v => `translate(${this.ToPixel(v.x)}, ${this.ToPixel(v.y)})`)); }
  TranslateX (...a){ return this.AppendFrames("transform", a.map(v => `translateX(${this.ToPixel(v)})`)); }
  TranslateY (...a){ return this.AppendFrames("transform", a.map(v => `translateY(${this.ToPixel(v)})`)); }
  TranslateZ (...a){ return this.AppendFrames("transform", a.map(v => `translateZ(${this.ToPixel(v)})`)); }
  Translate3D(...a){ return this.AppendFrames("transform", a.map(v => `translate3d(${this.ToPixel(v.x)}, ${this.ToPixel(v.y)}, ${this.ToPixel(v.z)})`)); }

  Turn    (...a){ return this.AppendFrames("transform", a.map(v => `rotate(${this.ToTurn(v)})`)); }
  Rotate  (...a){ return this.AppendFrames("transform", a.map(v => `rotate(${this.ToDegree(v)})` )); }
  RotateX (...a){ return this.AppendFrames("transform", a.map(v => `rotateX(${v})`   )); }
  RotateY (...a){ return this.AppendFrames("transform", a.map(v => `rotateY(${v})`   )); }
  RotateZ (...a){ return this.AppendFrames("transform", a.map(v => `rotateZ(${v})`   )); }
  Rotate3D(...a){ return this.AppendFrames("transform", a.map(v => `rotate3d(${v.x}, ${v.y}, ${v.z}, ${this.ToDegree(v.r)})`)); }
  Skew    (...a){ return this.AppendFrames("transform", a.map(v => `skew(${v}deg)`   )); }
  SkewX   (...a){ return this.AppendFrames("transform", a.map(v => `skewX(${v}deg)`  )); }
  SkewY   (...a){ return this.AppendFrames("transform", a.map(v => `skewY(${v}deg)`  )); }

  Scale  (...a){ return this.AppendFrames("transform", a.map(v => `scale(${this.ToPercent(v)})`)); }
  ScaleX (...a){ return this.AppendFrames("transform", a.map(v => `scaleX(${this.ToPercent(v)})`)); }
  ScaleY (...a){ return this.AppendFrames("transform", a.map(v => `scaleY(${this.ToPercent(v)})`)); }
  ScaleZ (...a){ return this.AppendFrames("transform", a.map(v => `scaleZ(${this.ToPercent(v)})`)); }
  Scale3D(...a){ return this.AppendFrames("transform", a.map(v => `scale3d(${v[0]}, ${v[1]}, ${v[2]})`)); }

  // Filter effects
  Blur      (...a){ return this.AppendFrames("filter", a.map(v => `blur(${this.ToPixel(v)})`        )); }
  Brightness(...a){ return this.AppendFrames("filter", a.map(v => `brightness(${this.ToPercent(v)})`)); }
  Contrast  (...a){ return this.AppendFrames("filter", a.map(v => `contrast(${this.ToPercent(v)})`  )); }
  Grayscale (...a){ return this.AppendFrames("filter", a.map(v => `grayscale(${this.ToPercent(v)})` )); }
  HueRotate (...a){ return this.AppendFrames("filter", a.map(v => `hue-rotate()${this.ToDegree(v)}` )); }
  Invert    (...a){ return this.AppendFrames("filter", a.map(v => `invert(${this.ToPercent(v)})`    )); }
  Opacity   (...a){ return this.AppendFrames("filter", a.map(v => `opacity(${this.ToPercent(v)})`   )); }
  Saturate  (...a){ return this.AppendFrames("filter", a.map(v => `saturate(${this.ToPercent(v)})`  )); }
  Sepia     (...a){ return this.AppendFrames("filter", a.map(v => `sepia(${this.ToPercent(v)})`     )); }
  DropShadow(...a)
  {
    return this.AppendFrames("filter", a.map(({x, y, blur, spread, color}) =>
    {
      return `drop-shadow(${this.ToPixel(x)} ${this.ToPixel(y)}${blur ? ` ${this.ToPixel(blur)}` : ""}${spread ? ` ${this.ToPixel(spread)}` : ""}${color ? this.ToColor(color) : ""})`;
    }));
  }

  // Play()
  // {
  //   this.Cancel();
  //   this.animation = this.tag.node.animate(this.frames, this.options);
  //
  //   this.animation.oncancel = event => this.OnCancel(event);
  //   this.animation.onfinish = event => this.OnFinish(event);
  //
  //   this.Reset();
  //
  //   if (this.animation)
  //   {
  //     this.tag.Fire("animationplay");
  //   }
  //
  //   return this;
  // }
  //
  // CreateAnimation()
  // {
  //   const animation = new Animation(this.tag, this.frames, this.options);
  //   this.Reset();
  //
  //   // Store the animation
  //   this.animations.add(animation);
  //
  //   animation.then(a =>
  //   {
  //     console.log("Removing animation");
  //     this.animations.delete(animation);
  //   });
  //
  //   return animation;
  // }
  //
  // Play()
  // {
  //   const animation = new Animation(this.tag, this.frames, this.options);
  //   this.Reset();
  //
  //   // Store the animation
  //   this.animations.add(animation);
  //
  //   animation.then(a =>
  //   {
  //     console.log("Removing animation");
  //     this.animations.delete(animation);
  //   });
  //
  //   return animation;
  // }

  Play()
  {
    const animation = new Animation(this.tag, this.frames, this.options);
    this.Reset();

    // Store the animation
    this.animations.add(animation);

    animation.Wait().then(a =>
    {
      this.animations.delete(animation);
    });

    return animation;
  }

  // Reverse()
  // {
  //   if (this.animation)
  //   {
  //     this.animation.reverse();
  //     this.tag.Fire("animationreverse");
  //   }
  //
  //   return this;
  // }
  //
  // Cancel()
  // {
  //   if (this.animation)
  //   {
  //     this.animation.cancel();
  //     this.tag.Fire("animationcancel");
  //   }
  //
  //   return this;
  // }
  //
  // Finish()
  // {
  //   if (this.animation)
  //   {
  //     this.animation.finish();
  //     this.tag.Fire("animationfinish");
  //   }
  //
  //   return this;
  // }
  //
  // Pause()
  // {
  //   if (this.animation)
  //   {
  //     this.animation.pause();
  //     this.tag.Fire("animationpause");
  //   }
  //
  //   return this;
  // }

  // OnFinish(event){}
  // OnCancel(event){}
}

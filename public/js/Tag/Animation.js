export class Animation
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

  constructor(tag)
  {
    this.tag = tag;
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
  MS(v){ return this.Duration(v); }

  Delay(v){ return this.Option("delay", v); }
  Start(v){ return this.Option("iterationStart", v); }

  Iterations(v){ return this.Option("iterations", v); }
  Repeat(v){ return this.Iterations(v + 1); }
  Loop(){ return this.Iterations(Infinity); }

  Direction(v){ return this.Option("direction", v); }
  DirectionNormal   (){ return this.Direction("normal"   ); }
  DirectionReverse  (){ return this.Direction("reverse"  ); }
  DirectionAlternate(){ return this.Direction("alternate"); }

  Fill(v){ return this.Option("fill", v); }
  FillForwards (){ return this.Fill("forwards" ); }
  FillBackwards(){ return this.Fill("backwards"); }
  FillBoth     (){ return this.Fill("both"     ); }
  FillNone     (){ return this.Fill("none"     ); }
  FillAuto     (){ return this.Fill("auto"     ); }

  Ease(v){ return this.Option("easing", v); }
  EaseIn   (){ return this.Ease("ease-in"    ); }
  EaseOut  (){ return this.Ease("ease-out"   ); }
  EaseInOut(){ return this.Ease("ease-in-out"); }

  // Misc settings
  Color(...a){ return this.Frames("color", a); }
  Border(...a){ return this.Frames("border", a); }
  BoxShadow(...a){ return this.Frames("boxShadow", a); }
  Easing(...a){ return this.Frames("easing", a); }
  Opacity(...a){ return this.Frames("opacity", a); }
  Offset(...a){ return this.Frames("offset", a); }
  MaxHeight(...a){ return this.Frames("max-height", a); }

  Translate  (...a){ return this.AppendFrames("transform", a.map(v => `translate(${this.ToPixel(v.x)}, ${this.ToPixel(v.y)})`)); }
  TranslateX (...a){ return this.AppendFrames("transform", a.map(v => `translateX(${this.ToPixel(v)})`)); }
  TranslateY (...a){ return this.AppendFrames("transform", a.map(v => `translateY(${this.ToPixel(v)})`)); }
  TranslateZ (...a){ return this.AppendFrames("transform", a.map(v => `translateZ(${this.ToPixel(v)})`)); }
  Translate3D(...a){ return this.AppendFrames("transform", a.map(v => `translate3d(${this.ToPixel(v.x)}, ${this.ToPixel(v.y)}, ${this.ToPixel(v.z)})`)); }

  Turn    (...a){ return this.AppendFrames("transform", a.map(v => `rotate(${this.ToTurn(v)})`)); }
  Rotate  (...a){ return this.AppendFrames("transform", a.map(v => `rotate(${this.ToDegree(v)})`)); }
  RotateX (...a){ return this.AppendFrames("transform", a.map(v => `rotateX(${v})`   )); }
  RotateY (...a){ return this.AppendFrames("transform", a.map(v => `rotateY(${v})`   )); }
  RotateZ (...a){ return this.AppendFrames("transform", a.map(v => `rotateZ(${v})`   )); }
  Rotate3D(...a){ return this.AppendFrames("transform", a.map(v => `rotate3d(${v.x}, ${v.y}, ${v.z}, ${this.ToDegree(v.r)})`)); }
  Skew    (...a){ return this.AppendFrames("transform", a.map(v => `skew(${v}deg)`   )); }
  SkewX   (...a){ return this.AppendFrames("transform", a.map(v => `skewX(${v}deg)`  )); }
  SkewY   (...a){ return this.AppendFrames("transform", a.map(v => `skewY(${v}deg)`  )); }

  Scale  (...a){ return this.AppendFrames("transform", a.map(v => `scale(${v})`)); }
  ScaleX (...a){ return this.AppendFrames("transform", a.map(v => `scaleX(${v})`)); }
  ScaleY (...a){ return this.AppendFrames("transform", a.map(v => `scaleY(${v})`)); }
  ScaleZ (...a){ return this.AppendFrames("transform", a.map(v => `scaleZ(${v})`)); }
  Scale3D(...a){ return this.AppendFrames("transform", a.map(v => `scale3d(${v[0]}, ${v[1]}, ${v[2]})`)); }

  // // Transition effects
  // MaxHeight(...a){ return this.AppendFrames("transition", a.map(v => `max-height`)); }

  // Filter effects
  Blur      (...a){ return this.AppendFrames("filter", a.map(v => `blur(${this.ToPixel(v)})`        )); }
  Brightness(...a){ return this.AppendFrames("filter", a.map(v => `brightness(${this.ToPercent(v)})`)); }
  Contrast  (...a){ return this.AppendFrames("filter", a.map(v => `contrast(${this.ToPercent(v)})`  )); }
  Grayscale (...a){ return this.AppendFrames("filter", a.map(v => `grayscale(${this.ToPercent(v)})` )); }
  HueRotate (...a){ return this.AppendFrames("filter", a.map(v => `hue-rotate()${this.ToDegree(v)}` )); }
  Invert    (...a){ return this.AppendFrames("filter", a.map(v => `invert(${this.ToPercent(v)})`    )); }
  // Opacity   (...a){ return this.AppendFrames("filter", a.map(v => `opacity(${this.ToPercent(v)})`   )); }
  Saturate  (...a){ return this.AppendFrames("filter", a.map(v => `saturate(${this.ToPercent(v)})`  )); }
  Sepia     (...a){ return this.AppendFrames("filter", a.map(v => `sepia(${this.ToPercent(v)})`     )); }
  DropShadow(...a)
  {
    return this.AppendFrames("filter", a.map(({x, y, blur, spread, color}) =>
    {
      return `drop-shadow(${this.ToPixel(x)} ${this.ToPixel(y)}${blur ? ` ${this.ToPixel(blur)}` : ""}${spread ? ` ${this.ToPixel(spread)}` : ""}${color ? this.ToColor(color) : ""})`;
    }));
  }

  Compile()
  {
    const node = this.tag.GetNode();

    // If the browser supports animations, create it
    if (node.animate)
    {
      // console.log("Compiling", {
      //   frames : this.frames ,
      //   options: this.options,
      // });
      this.animation = node.animate(this.frames, this.options);
      // console.log(this.animation);
    }

    return this;
  }

  Play()
  {
    if (!this.animation) this.Compile();

    if (this.animation && this.animation.play)
    {
      this.animation.playbackRate = Math.abs(this.animation.playbackRate || 1);
      this.animation.play();
      this.tag.FireEvent("AnimationPlay");
    }

    return this;
  }

  Reverse()
  {
    if (!this.animation) this.Compile();

    if (this.animation && this.animation.play)
    {
      this.animation.playbackRate = -Math.abs(this.animation.playbackRate || 1);
      this.animation.play();
      this.tag.FireEvent("AnimationReverse");
    }

    return this;
  }

  Cancel()
  {
    if (this.animation && this.animation.cancel)
    {
      this.animation.cancel();
      this.tag.FireEvent("AnimationCancel");
    }

    return this;
  }

  Finish()
  {
    if (this.animation && this.animation.finish)
    {
      this.animation.finish();
      this.tag.FireEvent("AnimationFinish");
    }

    return this;
  }

  Pause()
  {
    if (this.animation && this.animation.pause)
    {
      this.animation.pause();
      this.tag.FireEvent("AnimationPause");
    }

    return this;
  }

  Wait()
  {
    return new Promise((resolve, reject) =>
    {
      if (this.animation && (this.IsRunning() || this.IsPending()))
      {
        this.animation.addEventListener("cancel", event =>
        {
          resolve(this);
        }, { once: true });

        this.animation.addEventListener("finish", event =>
        {
          resolve(this);
        }, { once: true });
      }
      else
      {
        resolve(this);
      }
    });
  }

  IsPending(){ return this.animation ? this.animation.playState === "pending" : false; }
  IsRunning(){ return this.animation ? this.animation.playState === "running" : false; }
  IsFinished(){ return this.animation ? this.animation.playState === "finished" : false; }
  IsPaused(){ return this.animation ? this.animation.playState === "paused" : false; }
  IsIdle(){ return this.animation ? this.animation.playState === "idle" : true; }
}

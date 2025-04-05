import {Color} from "/js/Utility/Color.js";

export class HSLA extends Color
{
  static Scale(value, multiplier = 0)
  {
    multiplier = multiplier / 100;

    let result;
    if (multiplier > 0.0)
    {
      result = Math.min(1.0, value * (1 + multiplier));
    }
    else if (multiplier < 0.0)
    {
      result = Math.max(0.0, value * (1 + multiplier));
    }
    else
    {
      result = value; // No change
    }

    return result * 100; // Convert to a regular percentage
  }

  static Scale(value, multiplier = 0.5)
  {
    // console.log("Multiplier", multiplier);
    // multiplier = 1 / (1 + multiplier);
    // multiplier = multiplier / 100;

    let result;
    if (multiplier > 0.5)
    {
      // (value - min) / (max - min); // normalize

      // result = Math.min(1.0, );
      // result = value + ((1 - (value / multiplier)) * 100);
      // result = value + (((value / 100) * (multiplier / 100)) * 100);
      // result = (value - min) / (max - min);
      // result = Math.pow(value, (value / multiplier));
      // result = value * (1 + multiplier);
      result = value + (value * multiplier);
      console.log("Up", {value, multiplier, result});
    }
    else if (multiplier < 0.5)
    {
      // console.log("Prev multiplier", multiplier);
      // multiplier = (multiplier - -1.0) / (1.0 - -1.0); // normalize
      // multiplier = 50 - multiplier;
      // result = Math.max(0.0, value * (1 + (multiplier / 100)));
      // result = value + (value / multiplier);
      // result = value + (((value / 100) * (multiplier / 100)) * 100);
      // result = value + ((1 - (value / multiplier)) * 100);
      // result = value * (multiplier / value);
      // result = value * (1 + multiplier);
      result = value - (value * (0.5 + multiplier));
      console.log("Down", {value, multiplier, result});
    }
    else
    {
      result = value; // No change
    }

    return result * 100; // Convert to a regular percentage
    // return resul
  }

  static Scale(value, multiplier = 0.5)
  {
    let result;
    if (multiplier > 0.5)
    {
      const difference = 1.0 - value;
      // result = value + (value * multiplier);
      result = value + (multiplier * difference);
      console.log("Up", {difference, value, multiplier, result});
    }
    else if (multiplier < 0.5)
    {
      const difference = 1.0 - multiplier;
      // result = value - (value * (0.5 + multiplier));
      // result = value - ((multiplier - 1) * difference);
      result = value + (value * difference);
      console.log("Down", {difference, value, multiplier, result});
    }
    else
    {
      result = value; // No change
    }

    return result * 100; // Convert to a regular percentage
  }

  static Scale(value, input = 50)
  {
    let result;
    if (input > 50)
    {
      result = Math.min(100, value * (1 + (input / 100)));
    }
    else if (input < 50 && input > 0)
    {
      result = Math.max(0, value * (input / 100));
    }
    else if (input <= 0)
    {
      result = 0;
    }
    else if (input === 50)
    {
      result = value;
    }
    else
    {
      result = value; // No change
    }

    console.log("Scale result", result, value, input);

    return result;
  }

  // static Scale(value, multiplier = 50)
  // {
  //   // multiplier = multiplier / 100;
  //
  //   let result;
  //   if (multiplier > 50)
  //   {
  //     // multiplier += 0.5;
  //     result = Math.min(1.0, value * ((multiplier / 100) + 0.5));
  //     console.log("Up", {value, multiplier, result});
  //   }
  //   else if (multiplier < 50)
  //   {
  //     // multiplier += 0.5;
  //     result = Math.max(0.0, value * ((multiplier / 100)));
  //     console.log("Down", {value, multiplier, result});
  //   }
  //   else
  //   {
  //     result = value; // No change
  //   }
  //
  //
  //   return result * 100; // Convert to a regular percentage
  // }

  static Red(m, a){ return new this(0, 100, this.Scale(.50, m), a); }
  static Orange(m, a){ return new this(30, 100, this.Scale(.50, m), a); }
  static Yellow(m, a){ return new this(60, 100, this.Scale(.50, m), a); }
  static LimeGreen(m, a){ return new this(90, 100, this.Scale(.50, m), a); }
  static Green(m, a){ return new this(120, 100, this.Scale(.50, m), a); }
  static BlueGreen(m, a){ return new this(150, 100, this.Scale(.50, m), a); }
  static Cyan(m, a){ return new this(180, 100, this.Scale(.50, m), a); }
  static SkyBlue(m, a){ return new this(210, 100, this.Scale(.50, m), a); }
  static Blue(m, a){ return new this(240, 100, this.Scale(.50, m), a); }
  static Purple(m, a){ return new this(270, 100, this.Scale(.50, m), a); }
  static Magenta(m, a){ return new this(300, 100, this.Scale(.50, m), a); }
  static Pink(m, a){ return new this(330, 100, this.Scale(.50, m), a); }
  static Grey(m, a){ return new this(181, 25, this.Scale(.50, m), a); }
  static Grey(m, a){ return new this(181, 25, this.Scale(.75, m), a); }
  static White(m, a){ return new this(181, 0, this.Scale(.50, m), a); }

  static Red(m, a){ return new this(0, 100, m, a); }
  static Orange(m, a){ return new this(30, 100, m, a); }
  static Yellow(m, a){ return new this(60, 100, m, a); }
  static LimeGreen(m, a){ return new this(90, 100, m, a); }
  static Green(m, a){ return new this(120, 100, m, a); }
  static BlueGreen(m, a){ return new this(150, 100, m, a); }
  static Cyan(m, a){ return new this(180, 100, m, a); }
  static SkyBlue(m, a){ return new this(210, 100, m, a); }
  static Blue(m, a){ return new this(240, 100, m, a); }
  static Purple(m, a){ return new this(270, 100, m, a); }
  static Magenta(m, a){ return new this(300, 100, m, a); }
  static Pink(m, a){ return new this(330, 100, m, a); }
  static Grey(m, a){ return new this(181, 25, m, a); }
  static Grey(m, a){ return new this(181, 25, m, a); }
  static White(m, a){ return new this(181, 0, m, a); }
  static Danger(m, a){ return new this(348, 100, 61, a); }

  set hue(v){ this[0] = v; }
  set saturation(v){ this[1] = v; }
  set lightness(v){ this[2] = v; }

  get hue(){ return this[0]; }
  get saturation(){ return this[1]; }
  get lightness(){ return this[2]; }

  toString(){ return `hsla(${this.ToDegree(this[0])}, ${this.ToPercent(this[1])}, ${this.ToPercent(this[2])}, ${this.ToFloat(this[3])})`; }
  // toString(){ return `hsla(${this[0]}, ${this.ToPercent(this[1])}, ${this.ToPercent(this[2])}, ${this.ToFloat(this[3])})`; }
}

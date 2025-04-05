const EPSILON = 0.000001;

export class Vector2 extends Float32Array
{
  static FromValues(x, y)
  {
    const out = new Vector2();
    out[0] = x;
    out[1] = y;
    return out;
  }

  static Min(a, b)
  {
    const out = new Vector2();
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  }

  static Max(a, b)
  {
    const out = new Vector2();
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  }

  constructor(x, y)
  {
    super(2);

    this[0] = x;
    this[1] = y;
  }

  set x(v){ this[0] = v; }
  set y(v){ this[1] = v; }

  get x(){ return this[0]; }
  get y(){ return this[1]; }

  Clone()
  {
    const out = new Vector2();
    out[0] = this[0];
    out[1] = this[1];
    return out;
  }

  Copy(v)
  {
    this[0] = v[0];
    this[1] = v[1];
    return this;
  }

  Set(x, y)
  {
    this[0] = x;
    this[1] = y;
    return this;
  }

  Add(v)
  {
    this[0] += v[0];
    this[1] += v[1];
    return this;
  }

  Subtract(v)
  {
    this[0] -= v[0];
    this[1] -= v[1];
    return this;
  }

  Multiply(v)
  {
    this[0] *= v[0];
    this[1] *= v[1];
    return this;
  }

  Divide(v)
  {
    this[0] /= v[0];
    this[1] /= v[1];
    return this;
  }

  Scale(scalar)
  {
    this[0] *= scalar;
    this[1] *= scalar;
    return this;
  }

  ScaleAndAdd(v, scalar)
  {
    this[0] += (v[0] * scalar);
    this[1] += (v[1] * scalar);
    return this;
  }

  Distance(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    return Math.sqrt(x * x + y * y);
  }

  DistanceSquared(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    return (x * x) + (y * y);
  }

  Length()
  {
    const x = this[0];
    const y = this[1];
    return Math.sqrt((x * x) + (y * y));
  }

  LengthSquared()
  {
    const x = this[0];
    const y = this[1];
    return (x * x) + (y * y);
  }

  Negate()
  {
    this[0] = -this[0];
    this[1] = -this[1];
    return this;
  }

  Inverse()
  {
    this[0] = 1.0 / this[0];
    this[1] = 1.0 / this[1];
    return this;
  }

  Normalize()
  {
    const x = this[0];
    const y = this[1];
    let len = (x * x) + (y * y);

    if (len > 0)
    {
      len = 1 / Math.sqrt(len);
      this[0] = this[0] * len;
      this[1] = this[1] * len;
    }

    return this;
  }

  Dot(v)
  {
    return (this[0] * v[0]) + (this[1] * v[1]);
  }

  Cross(v)
  {
    const z = this[0] * v[1] - this[1] * v[0];
    this[0] = this[1] = 0;
    this[2] = z;
    return this;
  }

  Lerp(v, t)
  {
    const ax = this[0];
    const ay = this[1];
    this[0] = ax + t * (v[0] - ax);
    this[1] = ay + t * (v[1] - ay);
    return this;
  }

  Ceil()
  {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    return this;
  }

  Floor()
  {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    return this;
  }

  Round()
  {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    return this;
  }

  TransformMatrix2(m)
  {
    const x = this[0];
    const y = this[1];
    this[0] = m[0] * x + m[2] * y;
    this[1] = m[1] * x + m[3] * y;
    return this;
  }

  TransformMatrix2D(m)
  {
    const x = this[0];
    const y = this[1];
    this[0] = m[0] * x + m[2] * y + m[4];
    this[1] = m[1] * x + m[3] * y + m[5];
    return this;
  }

  TransformMatrix3(m)
  {
    const x = this[0];
    const y = this[1];
    this[0] = m[0] * x + m[3] * y + m[6];
    this[1] = m[1] * x + m[4] * y + m[7];
    return this;
  }

  TransformMatrix4(m)
  {
    const x = this[0];
    const y = this[1];
    this[0] = m[0] * x + m[4] * y + m[12];
    this[1] = m[1] * x + m[5] * y + m[13];
    return this;
  }

  // Get the angle between two Vector2s
  Angle(v)
  {
    const temp_a = this.Clone();
    const temp_b = v.Clone();

    temp_a.Normalize();
    temp_b.Normalize();

    const cosine = temp_a.Dot(temp_b);

    if (cosine > 1.0) return 0;
    else if (cosine < -1.0) return Math.PI;
    else return Math.acos(cosine);
  }

  AngleDeg(v)
  {
    return this.Angle(v) * 180 / Math.PI;
  }

  AngleRadians(v)
  {
    return Math.atan2(v[1] - this[1], v[0] - this[0]);
  }

  AngleDegrees(v)
  {
    return Math.atan2(v[1] - this[1], v[0] - this[0]) * 180 / Math.PI;
  }

  angle(v)
  {
    const dx = v[0] - this[0];
    const dy = v[1] - this[1];

    let theta = Math.atan2(dy, dx);

    theta *= 180 / Math.PI; // rads to degs
    // if (theta < 0) theta = 360 + theta;

    return theta;
  }

  angle360(v)
  {
    const theta = this.angle(v);

    if (theta < 0) return 360 + theta;
    else return theta;
  }

  Equals(v)
  {
    return (this[0] === v[0]) && (this[1] === v[1]);
  }

  Similar(v)
  {
    const a0 = this[0];
    const a1 = this[1];
    const b0 = v[0];
    const b1 = v[1];

    const abs = Math.abs;
    const max = Math.max;

    return abs(a0 - b0) <= EPSILON * max(1.0, abs(a0), abs(b0))
        && abs(a1 - b1) <= EPSILON * max(1.0, abs(a1), abs(b1));
  }

  toString(){ return `x: ${this[0]}, y: ${this[1]}`; }
}

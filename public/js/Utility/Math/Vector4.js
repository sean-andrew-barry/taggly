import {Vector2} from "/js/Utility/Math/Vector2.js";

const EPSILON = 0.000001;

export class Vector4 extends Float32Array
{
  static FromValues(x, y, z, w)
  {
    const out = new Vector4();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  static Min(a, b)
  {
    const out = new Vector4();
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
  }

  static Max(a, b)
  {
    const out = new Vector4();
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
  }

  constructor(x, y, z, w)
  {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
  }

  set x(v){ this[0] = v; }
  set y(v){ this[1] = v; }
  set z(v){ this[2] = v; }
  set w(v){ this[3] = v; }

  get x(){ return this[0]; }
  get y(){ return this[1]; }
  get z(){ return this[2]; }
  get w(){ return this[3]; }

  Clone()
  {
    const out = new Vector4();
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    out[3] = this[3];
    return out;
  }

  Copy(v)
  {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this[3] = v[3];
    return this;
  }

  Set(x, y, z, w)
  {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;

    return this;
  }

  Add(v)
  {
    this[0] += v[0];
    this[1] += v[1];
    this[2] += v[2];
    this[3] += v[3];
    return this;
  }

  Subtract(v)
  {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    this[3] -= v[3];
    return this;
  }

  Multiply(v)
  {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    this[3] *= v[3];
    return this;
  }

  Divide(v)
  {
    this[0] /= v[0];
    this[1] /= v[1];
    this[2] /= v[2];
    this[3] /= v[3];
    return this;
  }

  Scale(n)
  {
    this[0] *= n;
    this[1] *= n;
    this[2] *= n;
    this[3] *= n;
    return this;
  }

  ScaleAndAdd(v, n)
  {
    this[0] += (v[0] * n);
    this[1] += (v[1] * n);
    this[2] += (v[2] * n);
    this[3] += (v[3] * n);
    return this;
  }

  Distance(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    const z = v[2] - this[2];
    const w = v[3] - this[3];
    return Math.sqrt((x * x) + (y * y) + (z * z) + (w * w));
  }

  DistanceSquared(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    const z = v[2] - this[2];
    const w = v[3] - this[3];
    return (x * x) + (y * y) + (z * z) + (w * w);
  }

  Length()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    return Math.sqrt((x * x) + (y * y) + (z * z) + (w * w));
  }

  LengthSquared()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    return (x * x) + (y * y) + (z * z) + (w * w);
  }

  Negate()
  {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[3] = -this[3];
    return this;
  }

  Inverse()
  {
    this[0] = 1.0 / this[0];
    this[1] = 1.0 / this[1];
    this[2] = 1.0 / this[2];
    this[3] = 1.0 / this[3];
    return this;
  }

  Normalize()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    const len = (x * x) + (y * y) + (z * z) + (w * w);

    if (len > 0)
    {
      len = 1 / Math.sqrt(len);
      this[0] = x * len;
      this[1] = y * len;
      this[2] = z * len;
      this[3] = w * len;
    }

    return this;
  }

  Dot(v)
  {
    return (this[0] * v[0])
         + (this[1] * v[1])
         + (this[2] * v[2])
         + (this[3] * v[3]);
  }

  Lerp(v, n)
  {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    this[0] = ax + n * (v[0] - ax);
    this[1] = ay + n * (v[1] - ay);
    this[2] = az + n * (v[2] - az);
    this[3] = aw + n * (v[3] - aw);
    return this;
  }

  Ceil()
  {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    this[3] = Math.ceil(this[3]);
    return this;
  }

  Floor()
  {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    this[3] = Math.floor(this[3]);
    return this;
  }

  Round()
  {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    this[2] = Math.round(this[2]);
    this[3] = Math.round(this[3]);
    return this;
  }

  TransformMatrix4(m)
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];

    this[0] = m[0] * x + m[4] * y + m[ 8] * z + m[12] * w;
    this[1] = m[1] * x + m[5] * y + m[ 9] * z + m[13] * w;
    this[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    this[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;

    return this;
  }

  ToScreen(view_size, view_offset, x, y)
  {
    // console.log(this[0], this[1]);

    // const screen_x = ((this[0] + 1.0) / 2.0) * view_size.x + view_offset.x;
    // const screen_y = ((1.0 - this[1]) / 2.0) * view_size.y + view_offset.y;
    const screen_x = ((x + 1.0) / 2.0) * view_size[0] + view_offset[0];
    const screen_y = ((1.0 - y) / 2.0) * view_size[1] + view_offset[1];
    // const screen_x = ((this[0] + 1.0) / 2.0) * view_size[0] + view_offset[0];
    // const screen_y = ((1.0 - this[1]) / 2.0) * view_size[1] + view_offset[1];

    // return new Vector2(x, y);
    return new Vector2(screen_x, screen_y);
  }

  ToScreen(view_size, view_offset)
  {
    const screen_x = ((this[0] + 1.0) / 2.0) * view_size[0] + view_offset[0];
    const screen_y = ((1.0 - this[1]) / 2.0) * view_size[1] + view_offset[1];

    return new Vector2(screen_x, screen_y);
  }

  ToScreen(view_size, view_offset = new Vector2(0, 0))
  {
    const w = this[3];
    const x = this[0] / w;
    const y = this[1] / w;

    const screen_x = ((x + 1.0) / 2.0) * view_size[0] + view_offset[0];
    const screen_y = ((1.0 - y) / 2.0) * view_size[1] + view_offset[1];

    return new Vector2(screen_x, screen_y);
  }

  TransformQuat(quat)
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const qx = quat[0];
    const qy = quat[1];
    const qz = quat[2];
    const qw = quat[3];

    // Calculate quat * vec
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // Calculate result * inverse quat
    this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    this[3] = this[3];
    return this;
  }

  Equals(v)
  {
    return (this[0] === v[0])
        && (this[1] === v[1])
        && (this[2] === v[2])
        && (this[3] === v[3]);
  }

  Similar(v)
  {
    const a0 = this[0];
    const a1 = this[1];
    const a2 = this[2];
    const a3 = this[3];
    const b0 = v[0];
    const b1 = v[1];
    const b2 = v[2];
    const b3 = v[3];

    const abs = Math.abs;
    const max = Math.max;

    return abs(a0 - b0) <= EPSILON * max(1.0, abs(a0), abs(b0))
        && abs(a1 - b1) <= EPSILON * max(1.0, abs(a1), abs(b1))
        && abs(a2 - b2) <= EPSILON * max(1.0, abs(a2), abs(b2))
        && abs(a3 - b3) <= EPSILON * max(1.0, abs(a3), abs(b3));
  }

  toString(){ return `x: ${this[0]}, y: ${this[1]}, z: ${this[2]}, w: ${this[3]}`; }
}

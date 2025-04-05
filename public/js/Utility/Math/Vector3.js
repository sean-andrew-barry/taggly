const EPSILON = 0.000001;

export class Vector3 extends Float32Array
{
  static FromValues(x, y, z)
  {
    const out = new Vector3();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }

  static Min(a, b)
  {
    const out = new Vector3();
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }

  static Max(a, b)
  {
    const out = new Vector3();
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }

  constructor(x, y, z)
  {
    super(3);

    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  get x(){ return this[0]; }
  get y(){ return this[1]; }
  get z(){ return this[2]; }

  set x(v){ this[0] = v; }
  set y(v){ this[1] = v; }
  set z(v){ this[2] = v; }

  Clone()
  {
    const out = new Vector3();
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    return out;
  }

  Length()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];

    return Math.sqrt((x * x) + (y * y) + (z * z));
  }

  Copy(v)
  {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }

  Set(x, y, z)
  {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }

  Add(v)
  {
    this[0] += v[0];
    this[1] += v[1];
    this[2] += v[2];
    return this;
  }

  Subtract(v)
  {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    return this;
  }

  Multiply(v)
  {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    return this;
  }

  Divide(v)
  {
    this[0] /= v[0];
    this[1] /= v[1];
    this[2] /= v[2];
    return this;
  }

  Scale(scalar)
  {
    this[0] *= scalar;
    this[1] *= scalar;
    this[2] *= scalar;
    return this;
  }

  ScaleAndAdd(v, scalar)
  {
    this[0] += (v[0] * scalar);
    this[1] += (v[1] * scalar);
    this[2] += (v[2] * scalar);
    return this;
  }

  // Calculates the euclidian distance between two Vector3's
  Distance(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    const z = v[2] - this[2];
    return Math.sqrt(x * x + y * y + z * z);
  }

  // Calculates the squared euclidian distance between two Vector3's
  DistanceSquared(v)
  {
    const x = v[0] - this[0];
    const y = v[1] - this[1];
    const z = v[2] - this[2];
    return (x * x) + (y * y) + (z * z);
  }

  // Calculates the squared length of a Vector3
  LengthSquared()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    return (x * x) + (y * y) + (z * z);
  }

  Negate()
  {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }

  Inverse()
  {
    this[0] = 1.0 / this[0];
    this[1] = 1.0 / this[1];
    this[2] = 1.0 / this[2];
    return this;
  }

  Normalize()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const len = (x * x) + (y * y) + (z * z);

    if (len > 0)
    {
      len = 1 / Math.sqrt(len);
      this[0] = this[0] * len;
      this[1] = this[1] * len;
      this[2] = this[2] * len;
    }

    return this;
  }

  Dot(v)
  {
    return (this[0] * v[0])
         + (this[1] * v[1])
         + (this[2] * v[2]);
  }

  Cross(v)
  {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const bx = v[0];
    const by = v[1];
    const bz = v[2];

    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;
    return this;
  }

  Lerp(v, amount)
  {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    this[0] = ax + amount * (v[0] - ax);
    this[1] = ay + amount * (v[1] - ay);
    this[2] = az + amount * (v[2] - az);
    return this;
  }

  // Performs a hermite interpolation with two control points
  Hermite(v1, v2, v3, amount)
  {
    const fsq = amount * amount;
    const f1 = fsq * (2 * amount - 3) + 1;
    const f2 = fsq * (amount - 2) + amount;
    const f3 = fsq * (amount - 1);
    const f4 = fsq * (3 - 2 * amount);

    this[0] = (this[0] * f1) + (v1[0] * f2) + (v2[0] * f3) + (v3[0] * f4);
    this[1] = (this[1] * f1) + (v1[1] * f2) + (v2[1] * f3) + (v3[1] * f4);
    this[2] = (this[2] * f1) + (v1[2] * f2) + (v2[2] * f3) + (v3[2] * f4);
    return this;
  }

  // Performs a Bezier interpolation with two control points
  Bezier(v1, v2, v3, amount)
  {
    const inverse_factor = 1 - amount;
    const ifsq = inverse_factor * inverse_factor;
    const fsq = amount * amount;
    const f1 = ifsq * inverse_factor;
    const f2 = 3 * amount * ifsq;
    const f3 = 3 * fsq * inverse_factor;
    const f4 = fsq * amount;

    this[0] = (this[0] * f1) + (v1[0] * f2) + (v2[0] * f3) + (v3[0] * f4);
    this[1] = (this[1] * f1) + (v1[1] * f2) + (v2[1] * f3) + (v3[1] * f4);
    this[2] = (this[2] * f1) + (v1[2] * f2) + (v2[2] * f3) + (v3[2] * f4);

    return this;
  }

  Ceil()
  {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    return this;
  }

  Floor()
  {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    return this;
  }

  Round()
  {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    this[2] = Math.round(this[2]);
    return this;
  }

  TransformMatrix3(m3)
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];

    this[0] = x * m3[0] + y * m3[3] + z * m3[6];
    this[1] = x * m3[1] + y * m3[4] + z * m3[7];
    this[2] = x * m3[2] + y * m3[5] + z * m3[8];

    return this;
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

    // calculate quat * vec
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }

  RotateX(v, angle)
  {
    // Translate point to the origin
    const p = [
      this[0] - v[0],
      this[1] - v[1],
      this[2] - v[2],
    ];

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // Perform rotation
    const r = [
      p[0],
      p[1] * c - p[2] * s,
      p[1] * s + p[2] * c,
    ];

    // Translate to correct position
    this[0] = r[0] + v[0];
    this[1] = r[1] + v[1];
    this[2] = r[2] + v[2];
    return this;
  }

  RotateY(v, angle)
  {
    // Translate point to the origin
    const p = [
      this[0] - v[0],
      this[1] - v[1],
      this[2] - v[2],
    ];

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // Perform rotation
    const r = [
      p[2] * c + p[0] * s,
      p[1],
      p[2] * s - p[0] * c,
    ];

    // Translate to correct position
    this[0] = r[0] + v[0];
    this[1] = r[1] + v[1];
    this[2] = r[2] + v[2];
    return this;
  }

  RotateZ(v, angle)
  {
    // Translate point to the origin
    const p = [
      this[0] - v[0],
      this[1] - v[1],
      this[2] - v[2],
    ];

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // Perform rotation
    const r = [
      p[0] * c - p[1] * s,
      p[0] * s + p[1] * c,
      p[2],
    ];

    // Translate to correct position
    this[0] = r[0] + v[0];
    this[1] = r[1] + v[1];
    this[2] = r[2] + v[2];
    return this;
  }

  // Get the angle between two vector3s
  Angle(v)
  {
    const tempA = this.Clone();
    const tempB = v.Clone();

    tempA.Normalize();
    tempB.Normalize();

    const cosine = tempA.Dot(tempB);

    if (cosine > 1.0) return 0;
    else if (cosine < -1.0) return Math.PI;
    else return Math.acos(cosine);
  }

  Equals(v)
  {
    return (this[0] === v[0])
        && (this[1] === v[1])
        && (this[2] === v[2]);
  }

  Similar(v)
  {
    const a0 = this[0];
    const a1 = this[1];
    const a2 = this[2];
    const b0 = v[0];
    const b1 = v[1];
    const b2 = v[2];

    const abs = Math.abs;
    const max = Math.max;

    return abs(a0 - b0) <= EPSILON * max(1.0, abs(a0), abs(b0))
        && abs(a1 - b1) <= EPSILON * max(1.0, abs(a1), abs(b1))
        && abs(a2 - b2) <= EPSILON * max(1.0, abs(a2), abs(b2));
  }

  toString(){ return `x: ${this[0]}, y: ${this[1]}, z: ${this[2]}`; }
}

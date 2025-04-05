import {Vector3} from "/js/Utility/Math/Vector3.js";

const EPSILON = 0.000001;

export class Matrix3 extends Float32Array
{
  // Creates a matrix from a vector translation
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.translate(dest, dest, vec);
  static FromTranslation(vector)
  {
    const out = new Matrix3();
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = vector[0];
    out[7] = vector[1];
    out[8] = 1;
    return out;
  }

  // Creates a matrix from a given angle
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.rotate(dest, dest, vec);
  static FromTranslation(radians)
  {
    const s = Math.sin(radians),
    const c = Math.cos(radians);

    const out = new Matrix3();
    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }

  // Creates a matrix from a vector scaling
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.scale(dest, dest, vec);
  static FromScaling(vector)
  {
    const out = new Matrix3();
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }

  static FromMatrix2(a)
  {
    const out = new Matrix3();
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
  }

  static FromQuat(quat)
  {
    const x = quat[0];
    const y = quat[1];
    const z = quat[2];
    const w = quat[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    const out = new Matrix3();
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }

  static Identity()
  {
    return new Matrix3([
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
    ]);
  }

  constructor(m00, m01, m02, m10, m11, m12, m20, m21, m22)
  {
    super(9);

    this[0] = m00;
    this[1] = m01;
    this[2] = m02;
    this[3] = m10;
    this[4] = m11;
    this[5] = m12;
    this[6] = m20;
    this[7] = m21;
    this[8] = m22;
  }

  set m00(v){ this[0] = v; }
  set m01(v){ this[1] = v; }
  set m02(v){ this[2] = v; }
  set m10(v){ this[3] = v; }
  set m11(v){ this[4] = v; }
  set m12(v){ this[5] = v; }
  set m20(v){ this[6] = v; }
  set m21(v){ this[7] = v; }
  set m22(v){ this[8] = v; }

  get m00(){ return this[0]; }
  get m01(){ return this[1]; }
  get m02(){ return this[2]; }
  get m10(){ return this[3]; }
  get m11(){ return this[4]; }
  get m12(){ return this[5]; }
  get m20(){ return this[6]; }
  get m21(){ return this[7]; }
  get m22(){ return this[8]; }

  // Set to the identity matrix
  Identity()
  {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 1;
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    this[8] = 1;
  }

  Clone()
  {
    const clone = new Matrix3();
    clone[0] = this[0];
    clone[1] = this[1];
    clone[2] = this[2];
    clone[3] = this[3];
    clone[4] = this[4];
    clone[5] = this[5];
    clone[6] = this[6];
    clone[7] = this[7];
    clone[8] = this[8];
    return clone;
  }

  Copy(m)
  {
    this[0] = m[0];
    this[1] = m[1];
    this[2] = m[2];
    this[3] = m[3];
    this[4] = m[4];
    this[5] = m[5];
    this[6] = m[6];
    this[7] = m[7];
    this[8] = m[8];
  }

  // Transpose the values of the matrix
  Transpose(m)
  {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!m)
    {
      const m01 = m[1];
      const m02 = m[2];
      const m12 = m[5];
      this[1] = m[3];
      this[2] = m[6];
      this[3] = m01;
      this[5] = m[7];
      this[6] = m02;
      this[7] = m12;
    }
    else
    {
      this[0] = m[0];
      this[1] = m[3];
      this[2] = m[6];
      this[3] = m[1];
      this[4] = m[4];
      this[5] = m[7];
      this[6] = m[2];
      this[7] = m[5];
      this[8] = m[8];
    }
  }

  Invert(m)
  {
    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m10 = m[3];
    const m11 = m[4];
    const m12 = m[5];
    const m20 = m[6];
    const m21 = m[7];
    const m22 = m[8];

    const b01 = m22 * m11 - m12 * m21;
    const b11 = -m22 * m10 + m12 * m20;
    const b21 = m21 * m10 - m11 * m20;

    // Calculate the determinant
    let det = m00 * b01 + m01 * b11 + m02 * b21;

    if (!det) return null;
    det = 1.0 / det;

    this[0] = b01 * det;
    this[1] = (-m22 * m01 + m02 * m21) * det;
    this[2] = (m12 * m01 - m02 * m11) * det;
    this[3] = b11 * det;
    this[4] = (m22 * m00 - m02 * m20) * det;
    this[5] = (-m12 * m00 + m02 * m10) * det;
    this[6] = b21 * det;
    this[7] = (-m21 * m00 + m01 * m20) * det;
    this[8] = (m11 * m00 - m01 * m10) * det;
  }

  Adjoint(a)
  {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];

    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];

    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];

    this[0] = a11 * a22 - a12 * a21;
    this[1] = a02 * a21 - a01 * a22;
    this[2] = a01 * a12 - a02 * a11;
    this[3] = a12 * a20 - a10 * a22;
    this[4] = a00 * a22 - a02 * a20;
    this[5] = a02 * a10 - a00 * a12;
    this[6] = a10 * a21 - a11 * a20;
    this[7] = a01 * a20 - a00 * a21;
    this[8] = a00 * a11 - a01 * a10;
  }

  Determinant()
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];

    const a10 = this[3];
    const a11 = this[4];
    const a12 = this[5];

    const a20 = this[6];
    const a21 = this[7];
    const a22 = this[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }

  Multiply(b)
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a10 = this[3];
    const a11 = this[4];
    const a12 = this[5];
    const a20 = this[6];
    const a21 = this[7];
    const a22 = this[8];

    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b10 = b[3];
    const b11 = b[4];
    const b12 = b[5];
    const b20 = b[6];
    const b21 = b[7];
    const b22 = b[8];

    this[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22;

    this[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this[5] = b10 * a02 + b11 * a12 + b12 * a22;

    this[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this[8] = b20 * a02 + b21 * a12 + b22 * a22;
  }

  // Translate the matrix by the vector
  Translate(vector)
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a10 = this[3];
    const a11 = this[4];
    const a12 = this[5];
    const a20 = this[6];
    const a21 = this[7];
    const a22 = this[8];

    const x = vector[0];
    const y = vector[1];

    // this[0] = a00;
    // this[1] = a01;
    // this[2] = a02;
    //
    // this[3] = a10;
    // this[4] = a11;
    // this[5] = a12;

    this[6] = x * a00 + y * a10 + a20;
    this[7] = x * a01 + y * a11 + a21;
    this[8] = x * a02 + y * a12 + a22;
  }

  Rotate(radians)
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a10 = this[3];
    const a11 = this[4];
    const a12 = this[5];
    const a20 = this[6];
    const a21 = this[7];
    const a22 = this[8];

    const s = Math.sin(radians),
    const c = Math.cos(radians);

    this[0] = c * a00 + s * a10;
    this[1] = c * a01 + s * a11;
    this[2] = c * a02 + s * a12;

    this[3] = c * a10 - s * a00;
    this[4] = c * a11 - s * a01;
    this[5] = c * a12 - s * a02;

    // this[6] = a20;
    // this[7] = a21;
    // this[8] = a22;
    return this;
  };

  Scale(vector)
  {
    const x = vector[0];
    const y = vector[1];

    this[0] = x * this[0];
    this[1] = x * this[1];
    this[2] = x * this[2];

    this[3] = y * this[3];
    this[4] = y * this[4];
    this[5] = y * this[5];

    // this[6] = this[6];
    // this[7] = this[7];
    // this[8] = this[8];
    return this;
  }

  normalFromMat4(a){};

  // Generates a 2D projection matrix with the given bounds
  Projection(width, height)
  {
    this[0] = 2 / width;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = -2 / height;
    this[5] = 0;
    this[6] = -1;
    this[7] = 1;
    this[8] = 1;
    return this;
  };

  Add(b)
  {
    this[0] += b[0];
    this[1] += b[1];
    this[2] += b[2];
    this[3] += b[3];
    this[4] += b[4];
    this[5] += b[5];
    this[6] += b[6];
    this[7] += b[7];
    this[8] += b[8];
    return this;
  }

  Subtract(b)
  {
    this[0] -= b[0];
    this[1] -= b[1];
    this[2] -= b[2];
    this[3] -= b[3];
    this[4] -= b[4];
    this[5] -= b[5];
    this[6] -= b[6];
    this[7] -= b[7];
    this[8] -= b[8];
    return this;
  }

  MultiplyScalar(n)
  {
    this[0] *= n;
    this[1] *= n;
    this[2] *= n;
    this[3] *= n;
    this[4] *= n;
    this[5] *= n;
    this[6] *= n;
    this[7] *= n;
    this[8] *= n;
    return this;
  }

  // Adds two mat3's after multiplying each element of the second operand by a scalar value.
  MultiplyScalarAndAdd(m, scale)
  {
    this[0] += (m[0] * scale);
    this[1] += (m[1] * scale);
    this[2] += (m[2] * scale);
    this[3] += (m[3] * scale);
    this[4] += (m[4] * scale);
    this[5] += (m[5] * scale);
    this[6] += (m[6] * scale);
    this[7] += (m[7] * scale);
    this[8] += (m[8] * scale);
    return this;
  }

  // TODO: Does this just return the first line?
  Equals(m)
  {
    return this[0] === m[0]
        && this[1] === m[1]
        && this[2] === m[2]
        && this[3] === m[3]
        && this[4] === m[4]
        && this[5] === m[5]
        && this[6] === m[6]
        && this[7] === m[7]
        && this[8] === m[8];
  }

  // Returns whether or not the matrices have approximately the same elements in the same position.
  Similar(m)
  {
    const a0 = this[0];
    const a1 = this[1];
    const a2 = this[2];
    const a3 = this[3];
    const a4 = this[4];
    const a5 = this[5];
    const a6 = this[6];
    const a7 = this[7];
    const a8 = this[8];

    const b0 = m[0];
    const b1 = m[1];
    const b2 = m[2];
    const b3 = m[3];
    const b4 = m[4];
    const b5 = m[5];
    const b6 = m[6];
    const b7 = m[7];
    const b8 = m[8];

    const abs = Math.abs;
    const max = Math.max;

    return abs(a0 - b0) <= EPSILON * max(1.0, abs(a0), abs(b0))
        && abs(a1 - b1) <= EPSILON * max(1.0, abs(a1), abs(b1))
        && abs(a2 - b2) <= EPSILON * max(1.0, abs(a2), abs(b2))
        && abs(a3 - b3) <= EPSILON * max(1.0, abs(a3), abs(b3))
        && abs(a4 - b4) <= EPSILON * max(1.0, abs(a4), abs(b4))
        && abs(a5 - b5) <= EPSILON * max(1.0, abs(a5), abs(b5))
        && abs(a6 - b6) <= EPSILON * max(1.0, abs(a6), abs(b6))
        && abs(a7 - b7) <= EPSILON * max(1.0, abs(a7), abs(b7))
        && abs(a8 - b8) <= EPSILON * max(1.0, abs(a8), abs(b8));
  }
}

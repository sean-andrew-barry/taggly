import {Vector3} from "/js/Utility/Math/Vector3.js";
import {Vector4} from "/js/Utility/Math/Vector4.js";
import {Quat} from "/js/Utility/Math/Quat.js";

const EPSILON = 0.000001;

export class Matrix4 extends Float32Array
{
  static FromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
  {
    const m = new Matrix4();
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;
    m[3] = m03;
    m[4] = m10;
    m[5] = m11;
    m[6] = m12;
    m[7] = m13;
    m[8] = m20;
    m[9] = m21;
    m[10] = m22;
    m[11] = m23;
    m[12] = m30;
    m[13] = m31;
    m[14] = m32;
    m[15] = m33;
    return m;
  }

  // Creates a matrix from a vector translation
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.translate(dest, dest, vec);
  static FromTranslation(v)
  {
    const out = new Matrix4();
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }

  // Creates a matrix from a vector scaling
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.scale(dest, dest, vec);
  static FromScaling(v)
  {
    const out = new Matrix4();
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  // Creates a matrix from a given angle
  // This is equivalent to (but much faster than):
  //
  //     mat3.identity(dest);
  //     mat3.rotate(dest, dest, vec);
  static FromRotation(radians, axis)
  {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < EPSILON) return null;

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const t = 1 - c;

    // Perform rotation-specific matrix multiplication
    const out = new Matrix4();
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  static FromQuat(q)
  {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
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

    const out = new Matrix4();
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  static Frustum(left, right, bottom, top, near, far)
  {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);

    const out = new Matrix4();
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }

  static Perspective(fovy, aspect, near, far)
  {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

    const out = new Matrix4();
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  }

  static PerspectiveFromFOV(fov, near, far)
  {
    const upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    const downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    const xScale = 2.0 / (leftTan + rightTan);
    const yScale = 2.0 / (upTan + downTan);

    const out = new Matrix4();
    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = far * near / (near - far);
    out[15] = 0.0;
    return out;
  }

  // Generates a orthogonal projection matrix with the given bounds
  static Orthogonal(left, right, bottom, top, near, far)
  {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    const out = new Matrix4();
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }

  // Generates a look-at matrix with the given eye position, focal point, and up axis
  static LookAt(eye, center, up)
  {
    if (!(eye instanceof Vector3)) throw new TypeError();
    if (!(center instanceof Vector3)) throw new TypeError();
    if (!(up instanceof Vector3)) throw new TypeError();

    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON
    &&  Math.abs(eyey - centery) < EPSILON
    &&  Math.abs(eyez - centerz) < EPSILON)
    {
      return Matrix4.Identity();
    }

    let z0 = eyex - centerx;
    let z1 = eyey - centery;
    let z2 = eyez - centerz;

    let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

    if (!len)
    {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    }
    else
    {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    let y0 = z1 * x2 - z2 * x1;
    let y1 = z2 * x0 - z0 * x2;
    let y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len)
    {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    }
    else
    {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    const out = new Matrix4();
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }

  // Generates a matrix that makes something look at something else.
  static TargetTo(eye, target, up)
  {
    if (!(eye instanceof Vector3)) throw new TypeError();
    if (!(target instanceof Vector3)) throw new TypeError();
    if (!(up instanceof Vector3)) throw new TypeError();

    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];

    let z0 = eyex - target[0];
    let z1 = eyey - target[1];
    let z2 = eyez - target[2];

    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0)
    {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }

    const x0 = upy * z2 - upz * z1;
    const x1 = upz * z0 - upx * z2;
    const x2 = upx * z1 - upy * z0;

    const out = new Matrix4();
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }

  static Identity()
  {
    return new Matrix4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  constructor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
  {
    super(16);

    this[ 0] = m00;
    this[ 1] = m01;
    this[ 2] = m02;
    this[ 3] = m03;
    this[ 4] = m10;
    this[ 5] = m11;
    this[ 6] = m12;
    this[ 7] = m13;
    this[ 8] = m20;
    this[ 9] = m21;
    this[10] = m22;
    this[11] = m23;
    this[12] = m30;
    this[13] = m31;
    this[14] = m32;
    this[15] = m33;
  }

  set m00(v){ this[ 0] = v; }
  set m01(v){ this[ 1] = v; }
  set m02(v){ this[ 2] = v; }
  set m03(v){ this[ 3] = v; }
  set m10(v){ this[ 4] = v; }
  set m11(v){ this[ 5] = v; }
  set m12(v){ this[ 6] = v; }
  set m13(v){ this[ 7] = v; }
  set m20(v){ this[ 8] = v; }
  set m21(v){ this[ 9] = v; }
  set m22(v){ this[10] = v; }
  set m23(v){ this[11] = v; }
  set m30(v){ this[12] = v; }
  set m31(v){ this[13] = v; }
  set m32(v){ this[14] = v; }
  set m33(v){ this[15] = v; }

  get m00(){ return this[ 0]; }
  get m01(){ return this[ 1]; }
  get m02(){ return this[ 2]; }
  get m03(){ return this[ 3]; }
  get m10(){ return this[ 4]; }
  get m11(){ return this[ 5]; }
  get m12(){ return this[ 6]; }
  get m13(){ return this[ 7]; }
  get m20(){ return this[ 8]; }
  get m21(){ return this[ 9]; }
  get m22(){ return this[10]; }
  get m23(){ return this[11]; }
  get m30(){ return this[12]; }
  get m31(){ return this[13]; }
  get m32(){ return this[14]; }
  get m33(){ return this[15]; }

  // Set to the identity matrix
  Identity()
  {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }

  Clone()
  {
    const clone = new Matrix4();
    clone[0] = this[0];
    clone[1] = this[1];
    clone[2] = this[2];
    clone[3] = this[3];
    clone[4] = this[4];
    clone[5] = this[5];
    clone[6] = this[6];
    clone[7] = this[7];
    clone[8] = this[8];
    clone[9] = this[9];
    clone[10] = this[10];
    clone[11] = this[11];
    clone[12] = this[12];
    clone[13] = this[13];
    clone[14] = this[14];
    clone[15] = this[15];
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
    this[9] = m[9];
    this[10] = m[10];
    this[11] = m[11];
    this[12] = m[12];
    this[13] = m[13];
    this[14] = m[14];
    this[15] = m[15];
    return this;
  }

  Set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
  {
    this[0] = m00;
    this[1] = m01;
    this[2] = m02;
    this[3] = m03;
    this[4] = m10;
    this[5] = m11;
    this[6] = m12;
    this[7] = m13;
    this[8] = m20;
    this[9] = m21;
    this[10] = m22;
    this[11] = m23;
    this[12] = m30;
    this[13] = m31;
    this[14] = m32;
    this[15] = m33;
    return this;
  }

  // Transpose the values of the matrix
  Transpose(m)
  {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!m)
    {
      const a01 = this[1];
      const a02 = this[2];
      const a03 = this[3];
      const a12 = this[6];
      const a13 = this[7];
      const a23 = this[11];

      this[1] = m[4];
      this[2] = m[8];
      this[3] = m[12];
      this[4] = a01;
      this[6] = m[9];
      this[7] = m[13];
      this[8] = a02;
      this[9] = a12;
      this[11] = m[14];
      this[12] = a03;
      this[13] = a13;
      this[14] = a23;
    }
    else
    {
      this[0] = m[0];
      this[1] = m[4];
      this[2] = m[8];
      this[3] = m[12];
      this[4] = m[1];
      this[5] = m[5];
      this[6] = m[9];
      this[7] = m[13];
      this[8] = m[2];
      this[9] = m[6];
      this[10] = m[10];
      this[11] = m[14];
      this[12] = m[3];
      this[13] = m[7];
      this[14] = m[11];
      this[15] = m[15];
    }

    return this;
  }

  MultiplyByVector4(v)
  {
    // u.x = this[0].x * v.x + this[1].x * v.y + this[2].x * v.z;
    // u.y = this[0].y * v.x + this[1].y * v.y + this[2].y * v.z;
    // u.z = this[0].z * v.x + this[1].z * v.y + this[2].z * v.z;

    const out = new Vector4();

    out[0] = this[0] * v[0] + this[4] * v[1] + this[8 ] * v[2] + this[12] * v[3];
    out[1] = this[1] * v[0] + this[5] * v[1] + this[9 ] * v[2] + this[13] * v[3];
    out[2] = this[2] * v[0] + this[6] * v[1] + this[10] * v[2] + this[14] * v[3];
    out[3] = this[3] * v[0] + this[7] * v[1] + this[11] * v[2] + this[15] * v[3];

    return out;
  }

  MultiplyByVector4(v)
  {
    // u.x = this[0].x * v.x + this[1].x * v.y + this[2].x * v.z;
    // u.y = this[0].y * v.x + this[1].y * v.y + this[2].y * v.z;
    // u.z = this[0].z * v.x + this[1].z * v.y + this[2].z * v.z;

    const out = new Vector4();

    out[0] = this[0] * v[0] + this[4] * v[1] + this[8 ] * v[2] + this[12] * v[3];
    out[1] = this[1] * v[0] + this[5] * v[1] + this[9 ] * v[2] + this[13] * v[3];
    out[2] = this[2] * v[0] + this[6] * v[1] + this[10] * v[2] + this[14] * v[3];
    // out[3] = this[3] * v[0] + this[7] * v[1] + this[11] * v[2] + this[15] * v[3];
    out[3] = v[3];

    return out;
  }

  MultiplyByVector4(v)
  {
    const out = new Vector4();

    out[0] = this[0] * v[0] + this[4] * v[1] + this[8 ] * v[2] + this[12] * v[3];
    out[1] = this[1] * v[0] + this[5] * v[1] + this[9 ] * v[2] + this[13] * v[3];
    out[2] = this[2] * v[0] + this[6] * v[1] + this[10] * v[2] + this[14] * v[3];
    out[3] = this[3] * v[0] + this[7] * v[1] + this[11] * v[2] + this[15] * v[3];

    return out;
  }

  MultiplyByVector3(v)
  {
    const out = new Vector4();

    out[0] = this[0] * v[0] + this[4] * v[1] + this[8 ] * v[2] + this[12] * v[3];
    out[1] = this[1] * v[0] + this[5] * v[1] + this[9 ] * v[2] + this[13] * v[3];
    out[2] = this[2] * v[0] + this[6] * v[1] + this[10] * v[2] + this[14] * v[3];
    out[3] = v[3];

    return out;
  }

  // Decompose()
  // {
  //   const x = new Vector3();
  //   const y = new Vector3();
  //   const z = new Vector3();
  //
  //   x.Set(this[0], this[1], this[2]);
  //   y.Set(this[4], this[5], this[6]);
  //   z.Set(this[8], this[9], this[10]);
  //
  //   let sx = x.Length();
  //   let sy = y.Length();
  //   let sz = z.Length();
  //
  //   // if determine is negative, we need to invert one scale
  //   const det = this.Determinant();
  //   if (det < 0)
  //   {
  //     sx = -sx;
  //   }
  //
  //   return {
  //     x,
  //     y,
  //     z,
  //   };
  // }

  Invert()
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) return null;
    det = 1.0 / det;

    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return this;
  }

  Adjoint()
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];

    this[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    this[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    this[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    this[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    this[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    this[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    this[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    this[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    this[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    this[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    this[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    this[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    this[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    this[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    this[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    this[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return this;
  }

  Determinant()
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  Multiply(b)
  {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];

    // Cache only the current line of the second matrix
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];

    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];

    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];

    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];

    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return this;
  }

  Translate(v)
  {
    const x = v[0];
    const y = v[1];
    const z = v[2];

    // console.log("Translating Matrix4 by", v);

    this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
    this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
    this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
    this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];

    // console.log("Result:", this);

    return this;
  }

  Scale(v)
  {
    const x = v[0];
    const y = v[1];
    const z = v[2];

    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= x;
    this[4] *= y;
    this[5] *= y;
    this[6] *= y;
    this[7] *= y;
    this[8] *= z;
    this[9] *= z;
    this[10] *= z;
    this[11] *= z;
    // this[12] = this[12];
    // this[13] = this[13];
    // this[14] = this[14];
    // this[15] = this[15];
    return this;
  }

  Rotate(radians, axis)
  {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < EPSILON) return null;

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const t = 1 - c;

    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];

    // Construct the elements of the rotation matrix
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  };

  RotateX(radians)
  {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];

    // Perform axis-specific matrix multiplication
    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;
    return this;
  }

  RotateY(radians)
  {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;
    return this;
  }

  RotateZ(radians)
  {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;
    return this;
  }

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

  // Returns Frobenius norm of a mat4
  Frob()
  {
    return Math.sqrt(
      Math.pow(this[0 ], 2) +
      Math.pow(this[1 ], 2) +
      Math.pow(this[2 ], 2) +
      Math.pow(this[3 ], 2) +
      Math.pow(this[4 ], 2) +
      Math.pow(this[5 ], 2) +
      Math.pow(this[6 ], 2) +
      Math.pow(this[7 ], 2) +
      Math.pow(this[8 ], 2) +
      Math.pow(this[9 ], 2) +
      Math.pow(this[10], 2) +
      Math.pow(this[11], 2) +
      Math.pow(this[12], 2) +
      Math.pow(this[13], 2) +
      Math.pow(this[14], 2) +
      Math.pow(this[15], 2)
    );
  }

  Add(m)
  {
    this[ 0] += m[ 0];
    this[ 1] += m[ 1];
    this[ 2] += m[ 2];
    this[ 3] += m[ 3];
    this[ 4] += m[ 4];
    this[ 5] += m[ 5];
    this[ 6] += m[ 6];
    this[ 7] += m[ 7];
    this[ 8] += m[ 8];
    this[ 9] += m[ 9];
    this[10] += m[10];
    this[11] += m[11];
    this[12] += m[12];
    this[13] += m[13];
    this[14] += m[14];
    this[15] += m[15];
    return this;
  }

  Subtract(m)
  {
    this[ 0] -= m[ 0];
    this[ 1] -= m[ 1];
    this[ 2] -= m[ 2];
    this[ 3] -= m[ 3];
    this[ 4] -= m[ 4];
    this[ 5] -= m[ 5];
    this[ 6] -= m[ 6];
    this[ 7] -= m[ 7];
    this[ 8] -= m[ 8];
    this[ 9] -= m[ 9];
    this[10] -= m[10];
    this[11] -= m[11];
    this[12] -= m[12];
    this[13] -= m[13];
    this[14] -= m[14];
    this[15] -= m[15];
    return this;
  }

  MultiplyScalar(n)
  {
    this[ 0] *= n;
    this[ 1] *= n;
    this[ 2] *= n;
    this[ 3] *= n;
    this[ 4] *= n;
    this[ 5] *= n;
    this[ 6] *= n;
    this[ 7] *= n;
    this[ 8] *= n;
    this[ 9] *= n;
    this[10] *= n;
    this[11] *= n;
    this[12] *= n;
    this[13] *= n;
    this[14] *= n;
    this[15] *= n;
    return this;
  }

  // Adds two mat3's after multiplying each element of the second operand by a scalar value.
  MultiplyScalarAndAdd(m, scale)
  {
    this[ 0] += (m[ 0] * n);
    this[ 1] += (m[ 1] * n);
    this[ 2] += (m[ 2] * n);
    this[ 3] += (m[ 3] * n);
    this[ 4] += (m[ 4] * n);
    this[ 5] += (m[ 5] * n);
    this[ 6] += (m[ 6] * n);
    this[ 7] += (m[ 7] * n);
    this[ 8] += (m[ 8] * n);
    this[ 9] += (m[ 9] * n);
    this[10] += (m[10] * n);
    this[11] += (m[11] * n);
    this[12] += (m[12] * n);
    this[13] += (m[13] * n);
    this[14] += (m[14] * n);
    this[15] += (m[15] * n);
    return this;
  }

  Equals(m)
  {
    return this[ 0] === m[ 0]
        && this[ 1] === m[ 1]
        && this[ 2] === m[ 2]
        && this[ 3] === m[ 3]
        && this[ 4] === m[ 4]
        && this[ 5] === m[ 5]
        && this[ 6] === m[ 6]
        && this[ 7] === m[ 7]
        && this[ 8] === m[ 8]
        && this[ 9] === m[ 9]
        && this[10] === m[10]
        && this[11] === m[11]
        && this[12] === m[12]
        && this[13] === m[13]
        && this[14] === m[14]
        && this[15] === m[15];
  }

  // Returns whether or not the matrices have approximately the same elements in the same position.
  Similar(m)
  {
    const a0  = a[ 0];
    const a1  = a[ 1];
    const a2  = a[ 2];
    const a3  = a[ 3];
    const a4  = a[ 4];
    const a5  = a[ 5];
    const a6  = a[ 6];
    const a7  = a[ 7];
    const a8  = a[ 8];
    const a9  = a[ 9];
    const a10 = a[10];
    const a11 = a[11];
    const a12 = a[12];
    const a13 = a[13];
    const a14 = a[14];
    const a15 = a[15];

    const b0  = b[ 0];
    const b1  = b[ 1];
    const b2  = b[ 2];
    const b3  = b[ 3];
    const b4  = b[ 4];
    const b5  = b[ 5];
    const b6  = b[ 6];
    const b7  = b[ 7];
    const b8  = b[ 8];
    const b9  = b[ 9];
    const b10 = b[10];
    const b11 = b[11];
    const b12 = b[12];
    const b13 = b[13];
    const b14 = b[14];
    const b15 = b[15];

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
        && abs(a8 - b8) <= EPSILON * max(1.0, abs(a8), abs(b8))
        && abs(a9 - b9) <= EPSILON * max(1.0, abs(a9), abs(b9))
        && abs(a10 - b10) <= EPSILON * max(1.0, abs(a10), abs(b10))
        && abs(a11 - b11) <= EPSILON * max(1.0, abs(a11), abs(b11))
        && abs(a12 - b12) <= EPSILON * max(1.0, abs(a12), abs(b12))
        && abs(a13 - b13) <= EPSILON * max(1.0, abs(a13), abs(b13))
        && abs(a14 - b14) <= EPSILON * max(1.0, abs(a14), abs(b14))
        && abs(a15 - b15) <= EPSILON * max(1.0, abs(a15), abs(b15));
  }

  GetTranslation()
  {
    const out = new Vector3();
    out[0] = this[12];
    out[1] = this[13];
    out[2] = this[14];
    return out;
  }

  GetScale()
  {
    const m11 = this[0];
    const m12 = this[1];
    const m13 = this[2];
    const m21 = this[4];
    const m22 = this[5];
    const m23 = this[6];
    const m31 = this[8];
    const m32 = this[9];
    const m33 = this[10];

    const out = new Vector3();
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }

  GetRotation()
  {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    const trace = this[0] + this[5] + this[10];
    let S = 0;

    const out = new Quat();
    if (trace > 0)
    {
      S = Math.sqrt(trace + 1.0) * 2;
      out[3] = 0.25 * S;
      out[0] = (this[6] - this[9]) / S;
      out[1] = (this[8] - this[2]) / S;
      out[2] = (this[1] - this[4]) / S;
    }
    else if (this[0] > this[5] & this[0] > this[10])
    {
      S = Math.sqrt(1.0 + this[0] - this[5] - this[10]) * 2;
      out[3] = (this[6] - this[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (this[1] + this[4]) / S;
      out[2] = (this[8] + this[2]) / S;
    }
    else if (this[5] > this[10])
    {
      S = Math.sqrt(1.0 + this[5] - this[0] - this[10]) * 2;
      out[3] = (this[8] - this[2]) / S;
      out[0] = (this[1] + this[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (this[6] + this[9]) / S;
    }
    else
    {
      S = Math.sqrt(1.0 + this[10] - this[0] - this[5]) * 2;
      out[3] = (this[1] - this[4]) / S;
      out[0] = (this[8] + this[2]) / S;
      out[1] = (this[6] + this[9]) / S;
      out[2] = 0.25 * S;
    }

    return out;
  }
}

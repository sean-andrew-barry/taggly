import {Vector3} from "/js/Utility/Math/Vector3.js";

const EPSILON = 0.000001;

export class Quat extends Float32Array
{
  static Identity()
  {
    const out = new Quat();
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }

  static FromMatrix3(m)
  {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const f_trace = m[0] + m[4] + m[8];
    let f_root;

    const out = new Quat();
    if (f_trace > 0.0)
    {
      // |w| > 1/2, may as well choose w > 1/2
      f_root = Math.sqrt(f_trace + 1.0); // 2w
      out[3] = 0.5 * f_root;
      f_root = 0.5 / f_root; // 1/(4w)
      out[0] = (m[5] - m[7]) * f_root;
      out[1] = (m[6] - m[2]) * f_root;
      out[2] = (m[1] - m[3]) * f_root;
    }
    else
    {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;

      f_root = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * f_root;
      f_root = 0.5 / f_root;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * f_root;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * f_root;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * f_root;
    }

    return out;
  }

  static FromEuler(x, y, z)
  {
    const halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    const sx = Math.sin(x);
    const cx = Math.cos(x);
    const sy = Math.sin(y);
    const cy = Math.cos(y);
    const sz = Math.sin(z);
    const cz = Math.cos(z);

    const out = new Quat();
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }

  constructor(value = 4)
  {
    super(value);
  }

  Identity()
  {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    return this;
  }

  SetAxisAngle(axis, radians)
  {
    if (!(axis instanceof Vector3)) throw new TypeError();

    radians = radians * 0.5;
    const s = Math.sin(radians);
    const c = Math.cos(radians);

    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = c;
    return out;
  }

  GetAxisAngle()
  {
    const rad = Math.acos(this[3]) * 2.0;
    const s = Math.sin(rad / 2.0);

    const axis = new Vector3();
    if (s != 0.0)
    {
      axis[0] = q[0] / s;
      axis[1] = q[1] / s;
      axis[2] = q[2] / s;
    }
    else
    {
      // If s is zero, return any axis (no rotation - axis does not matter)
      axis[0] = 1;
      axis[1] = 0;
      axis[2] = 0;
    }

    return {
      axis,
      angle: rad,
    };
  }

  Multiply(q)
  {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bx = q[0];
    const by = q[1];
    const bz = q[2];
    const bw = q[3];

    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }

  RotateX(radians)
  {
    radians *= 0.5;

    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bx = Math.sin(radians);
    const bw = Math.cos(radians);

    this[0] = ax * bw + aw * bx;
    this[1] = ay * bw + az * bx;
    this[2] = az * bw - ay * bx;
    this[3] = aw * bw - ax * bx;
    return this;
  }

  RotateY(radians)
  {
    radians *= 0.5;

    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const by = Math.sin(radians);
    const bw = Math.cos(radians);

    this[0] = ax * bw - az * by;
    this[1] = ay * bw + aw * by;
    this[2] = az * bw + ax * by;
    this[3] = aw * bw - ay * by;
    return this;
  }

  RotateZ(radians)
  {
    radians *= 0.5;

    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bz = Math.sin(radians);
    const bw = Math.cos(radians);

    this[0] = ax * bw + ay * bz;
    this[1] = ay * bw - ax * bz;
    this[2] = az * bw + aw * bz;
    this[3] = aw * bw - az * bz;
    return this;
  }

  CalculateW()
  {
    const x = this[0];
    const y = this[1];
    const z = this[2];

    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return this;
  }

  // Performs a spherical linear interpolation between two quat
  Slerp(q, t)
  {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    let bx = q[0];
    let by = q[1];
    let bz = q[2];
    let bw = q[3];

    // Calc cosine
    let cosom = ax * bx + ay * by + az * bz + aw * bw;

    // Adjust signs (if necessary)
    if (cosom < 0.0)
    {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    let scale0;
    let scale1;

    // calculate coefficients
    if (1.0 - cosom > 0.000001)
    {
      // standard case (slerp)
      let omega = Math.acos(cosom);
      let sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    }
    else
    {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }

    // calculate final values
    this[0] = scale0 * ax + scale1 * bx;
    this[1] = scale0 * ay + scale1 * by;
    this[2] = scale0 * az + scale1 * bz;
    this[3] = scale0 * aw + scale1 * bw;
    return this;
  }

  Invert()
  {
    const a0 = this[0];
    const a1 = this[1];
    const a2 = this[2];
    const a3 = this[3];
    const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    const inv_dot = dot ? 1.0 / dot : 0;

    this[0] = -a0 * inv_dot;
    this[1] = -a1 * inv_dot;
    this[2] = -a2 * inv_dot;
    this[3] =  a3 * inv_dot;
    return this;
  }

  Conjugate()
  {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[3] = this[3];
    return this;
  }
}

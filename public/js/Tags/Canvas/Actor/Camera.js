import {Actor} from "/js/Tags/Canvas/Actor.js";
import {Vector2} from "/js/Utility/Math/Vector2.js";
import {Vector3} from "/js/Utility/Math/Vector3.js";
import {Matrix4} from "/js/Utility/Math/Matrix4.js";

export class Camera extends Actor
{
  constructor({
    fov = 45 * Math.PI / 180,
    aspect_ratio,
    near = 0.1,
    far = 100.0,
  })
  {
    super("camera");

    this.fov = fov;
    this.aspect_ratio = aspect_ratio;
    this.near = near;
    this.far = far;
    this.camera_direction = new Vector3();
    this.camera_rotation = new Vector2();
    this.rotation = new Vector3();
    this.speed = 2.0;
    this.target = new Vector3();
    this.view_matrix = new Matrix4();
    this.camera_matrix = new Matrix4();

    // this.projection = new Matrix4();
    // this.projection = Matrix4.Perspective(fov, aspect_ratio, near, far);
    this.position.Perspective(fov, aspect_ratio, near, far);
  }

  RebuildAngles()
  {
    this.position.subtractToRef(this._getTargetPosition(), this._computationVector);
    this.radius = this._computationVector.length();

    if (this.radius === 0) {
        this.radius = 0.0001; // Just to avoid division by zero
    }

    // Alpha
    this.alpha = Math.acos(this._computationVector.x / Math.sqrt(Math.pow(this._computationVector.x, 2) + Math.pow(this._computationVector.z, 2)));

    if (this._computationVector.z < 0) {
        this.alpha = 2 * Math.PI - this.alpha;
    }

    // Beta
    this.beta = Math.acos(this._computationVector.y / this.radius);
  }

  ComputeViewMatrix(position, target, up)
  {

  }

  SetTarget(point)
  {
    this.target = point;
    console.log("Camera targeting", point);
    // this.position = Matrix4.TargetTo(this.position.GetTranslation(), point, Vector3.FromValues(0, 1, 0));
  }

  GetTarget(){ return this.target; }

  Update(dt)
  {
    super.Update(dt);
  }

  UpdatePerspective()
  {
    this.position.Perspective(this.fov, this.aspect_ratio, this.near, this.far);
  }

  SetAspectRatio(v){ this.aspect_ratio = v; return this; }

  GetProjection(){ return this.position; }
}

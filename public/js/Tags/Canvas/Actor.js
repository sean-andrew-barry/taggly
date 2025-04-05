import {Tag} from "/js/Tag.js";
import {Vector2} from "/js/Utility/Math/Vector2.js";
import {Vector3} from "/js/Utility/Math/Vector3.js";
import {Matrix4} from "/js/Utility/Math/Matrix4.js";

export class Actor extends Tag
{
  constructor(...args)
  {
    super(...args);

    this.position = Matrix4.Identity();
    this.hidden = false;
    this.dependencies = [];
    this.parent = null;
    this.children = [];
    // this.world_matrix = Matrix4.Identity();

    // if (program)
    // {
    //   this.program = program;
    //   this.loader = loader;
    //   program.AddNode(this);
    // }
  }

  Hide(){ this.hidden = true ; }
  Show(){ this.hidden = false; }

  Scale(v){ this.position.Scale(v); return this; }
  Translate(v){ this.position.Translate(v); return this; }
  Rotate(r, v){ this.position.Rotate(r, v); return this; }
  RotateX(r){ this.position.RotateX(r); return this; }
  RotateY(r){ this.position.RotateY(r); return this; }
  RotateZ(r){ this.position.RotateZ(r); return this; }

  GetPosition(){ return this.position; }
  GetTranslation(){ return this.position.GetTranslation(); }
  GetScale(){ return this.position.GetScale(); }
  GetRotation(){ return this.position.GetRotation(); }
  GetVertexResource(){ return this.loader.resources.vertices; }
  GetNormalResource(){ return this.loader.resources.indices; }
  GetIndexResource(){ return this.loader.resources.normals; }
  GetIndexResource(){ return this.loader.resources.uvs; }

  IsHidden(){ return this.hidden; }
}

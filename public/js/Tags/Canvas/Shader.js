import {Tag} from "/js/Tag.js";
import {Canvas3D} from "/js/Tags/Canvas/Canvas3D.js";

export class Shader extends Tag
{
  constructor(...args)
  {
    super(...args);
    this.shader = this.CreateShader();
  }

  Type(v){ return this.SetAttribute("type", v); }
  TypeVertex(){ return this.Type("vertex"); }
  TypeFragment(){ return this.Type("fragment"); }

  GetType(){ return this.GetAttribute("type"); }
  IsVertex(){ return this.GetType() === "vertex"; }
  IsFragment(){ return this.GetType() === "fragment"; }

  GetShader(){ return this.shader; }

  async CreateShader()
  {
    await this.Wait();

    const canvas = this.QueryAncestor("canvas");
    if (!canvas || !(canvas instanceof Canvas3D)) throw new Error(`Shader tag must be a child of a Canvas3D`);

    const context = await canvas.GetContext();

    let type;
    if (this.IsVertex()) type = context.VERTEX_SHADER;
    else if (this.IsFragment()) type = context.FRAGMENT_SHADER;
    else throw new Error(`Invalid shader type, must be either "vertex" or "fragment"`);

    const shader = context.createShader(type);
    context.shaderSource(shader, this.GetText()); // Send the source to the shader object
    context.compileShader(shader); // Compile the shader program

    // See if it compiled successfully
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS))
    {
      const log = context.getShaderInfoLog(shader);
      context.deleteShader(shader);

      throw new Error(`An error occured compiling a ${this.GetType()} shader: ${log}`);
    }

    return shader;
  }
}

Tag.Constructor(Shader);

import {Tag} from "/js/Tag.js";
import {Canvas} from "/js/Tags/Canvas.js";
import {Shader} from "/js/Tags/Canvas/Shader.js";

export class Canvas3D extends Canvas
{
  // static GetContextName(){ return "webgl"; }

  constructor(...args)
  {
    super(...args);
    this.shader_program = this.CreateShaderProgram();
  }

  CreateContext(){ return super.CreateContext("webgl"); }

  LoadShader(type, source)
  {
    console.log("Loading shader", type, source);
    const shader = this.context.createShader(type);
    console.log(shader);

    // Send the source to the shader object
    this.context.shaderSource(shader, source);

    // Compile the shader program
    this.context.compileShader(shader);

    // See if it compiled successfully
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS))
    {
      const log = this.context.getShaderInfoLog(shader);
      // console.log("LOG", log, this.context.COMPILE_STATUS);
      this.context.deleteShader(shader);

      throw new Error(`An error occured compiling the shaders: ${log}`);
    }

    return shader;
  }

  Vertex(v){ this.vertex = v; return this.SetAttribute("vertex", v); }
  Fragment(v){ this.fragment = v; return this.SetAttribute("fragment", v); }

  async CreateShaderProgram()
  {
    await this.Wait();

    // this.context = this.GetNode().getContext("webgl");

    const canvas = this.GetNode();
    // this.context.viewport(0, 0, canvas.width, canvas.height);
    // this.context.clearColor(1.0, 1.0, 1.0, 1.0);
    // this.context.enable(this.context.DEPTH_TEST);
    //
    // this.context.viewport(0, 0, canvas.width, canvas.height);
    // this.context.clearColor(1.0, 0.5, 0.5, 1.0);

    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(this.context.COLOR_BUFFER_BIT);

    console.log("Creating shader program", this);

    this.vertex_shader = this.LoadShader(this.context.VERTEX_SHADER, this.vertex || this.GetAttribute("vertex"));
    this.fragment_shader = this.LoadShader(this.context.FRAGMENT_SHADER, this.fragment || this.GetAttribute("fragment"));

    console.log("Done loading shaders");

    // Create the shader program
    const shader_program = this.context.createProgram();
    this.context.attachShader(shader_program, this.vertex_shader);
    this.context.attachShader(shader_program, this.fragment_shader);
    this.context.linkProgram(shader_program);

    // If creating the shader program failed, throw
    if (!this.context.getProgramParameter(shader_program, this.context.LINK_STATUS))
    {
      throw new Error(`Unable to initialize the shader program: ${this.context.getProgramInfoLog(shader_program)}`);
    }

    return shader_program;
  }

  async CreateShaderProgram()
  {
    await this.Wait();

    // this.context = this.GetNode().getContext("webgl");

    const canvas = this.GetNode();
    // this.context.viewport(0, 0, canvas.width, canvas.height);
    // this.context.clearColor(1.0, 1.0, 1.0, 1.0);
    // this.context.enable(this.context.DEPTH_TEST);
    //
    // this.context.viewport(0, 0, canvas.width, canvas.height);
    // this.context.clearColor(1.0, 0.5, 0.5, 1.0);

    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(this.context.COLOR_BUFFER_BIT);

    const vertex_shader = this.Query(`shader[type="vertex"]`);
    if (!vertex_shader) throw new Error(`Canvas3D must have a vertex shader tag as a child`);

    const fragment_shader = this.Query(`shader[type="fragment"]`);
    if (!fragment_shader) throw new Error(`Canvas3D must have a fragment shader tag as a child`);

    // Create the shader program
    const shader_program = this.context.createProgram();
    this.context.attachShader(shader_program, await vertex_shader.GetShader());
    this.context.attachShader(shader_program, await fragment_shader.GetShader());
    this.context.linkProgram(shader_program);

    // If creating the shader program failed, throw
    if (!this.context.getProgramParameter(shader_program, this.context.LINK_STATUS))
    {
      throw new Error(`Unable to initialize the shader program: ${this.context.getProgramInfoLog(shader_program)}`);
    }

    return shader_program;
  }

  GetContext(){ return this.context; }
  GetShaderProgram(){ return this.shader_program; }
  GetWidth(){ return this.GetNode().width; }
  GetHeight(){ return this.GetNode().height; }
}

Tag.Constructor(Canvas3D);

function Example()
{
  return [
    Tag.Canvas3D()
    .SetAttribute("height", "600")
    .SetAttribute("width", "768").Add(
      Tag.Shader().TypeVertex().Text(`
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
      `),
      Tag.Shader().TypeFragment().Text(`
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `),
    ),
  ];
}

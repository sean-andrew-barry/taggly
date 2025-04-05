import {Tag} from "/js/Tag.js";

export class Engine extends Tag
{
  constructor(...args)
  {
    super(...args);

    this.AppendChild(
      this.canvas = Tag.Canvas().Context("webgl"),
    );

    this.running = true;
    let then = 0;

    // Draw the scene repeatedly
    const Render = (now) =>
    {
      if (this.running)
      {
        now *= 0.001;  // convert to seconds
        const dt = now - then;
        then = now;

        this.Draw(dt);
        requestAnimationFrame(Render);
      }
    };

    requestAnimationFrame(Render);
  }

  GetGL(){ return this.canvas.GetContext(); }

  ClearColor(r, g, b, a){ this.GetGL().clearColor(r, g, b, a); return this; }
  ClearColor(depth){ this.GetGL().clearDepth(depth); return this; }
  DepthFunc(value){ this.GetGL().depthFunc(value); return this; }
  DepthFuncLEqual(){ return this.DepthFunc(this.GetGL().LEQUAL); }

  Enable(value){ this.GetGL().enable(value); return this; }
  EnableCullFace(){ return this.Enable(this.GetGL().CULL_FACE); }
  EnableDepthTest(){ return this.Enable(this.GetGL().DEPTH_TEST); }

  Draw(delta_time)
  {
    const gl = this.canvas.GetContext();

    // gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    // 0.36470588235294116 0.5333333333333333 0.8
    // gl.clearColor(0.364, 0.533, 0.8, 1.0); // Clear to black, fully opaque
    gl.clearColor(0.243, 0.247, 0.254, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // for (let i = 0; i < this.controllers.length; i++)
    // {
    //   const controller = this.controllers[i];
    //   controller.Update(delta_time);
    // }
    //
    // for (const key in this.programs)
    // {
    //   const value = this.programs[key];
    //   this.scene.Render(value, delta_time);
    // }
  }
}

function Example()
{
  Tag.Body().Add(
    new Engine().Add(
      new Canvas().Context("webgl"),
      new Shader().Type("vertex").Text(``),
      new Shader().Type("fragment").Text(``),
      new Scene().Add(
        new Camera(),
        new Model(),
      ),
    ),
  );
}

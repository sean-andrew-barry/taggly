export class DisableOutputWebpackPlugin
{
  constructor()
  {
    this.assets = {};
    this.code = "";
  }

  apply(compiler)
  {
    compiler.hooks.compilation.tap("DisableOutputWebpackPlugin", (compilation) =>
    {
      const options = {
        name: "DisableOutputWebpackPlugin",
        stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONAL,
      };

      compilation.hooks.processAssets.tapPromise(options, async (...args) =>
      {
        Object.keys(compilation.assets).forEach(asset =>
        {
          const value = compilation.assets[asset];

          // console.log("Deleting asset", asset, value.source());
          const code = value.source();
          this.assets[asset] = code;
          this.code += code;
          delete compilation.assets[asset];
        });
      });
  	});
	}

  apply(compiler)
  {
    const name = this.constructor.name;

    compiler.hooks.compilation.tap(name, (compilation) =>
    {
      const options = {
        name: name,
        // stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        stage: compilation.constructor.PROCESS_ASSETS_STAGE_SUMMARIZE,
      };

      compilation.hooks.processAssets.tapPromise(options, async (...args) =>
      {
        Object.keys(compilation.assets).forEach(asset =>
        {
          const value = compilation.assets[asset];

          // console.log("Deleting asset", asset, value.source());
          const code = value.source();
          this.assets[asset] = code;
          this.code += code;
          delete compilation.assets[asset];
        });
      });
  	});
  }
}

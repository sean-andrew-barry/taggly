export class AsyncModuleReplacementPlugin
{
  constructor(resource_reg_exp, new_resource)
  {
    this.resource_reg_exp = resource_reg_exp;
    this.new_resource = new_resource;
  }

	apply(compiler)
  {
		compiler.hooks.normalModuleFactory.tap("AsyncModuleReplacementPlugin", plugin =>
    {
			plugin.hooks.beforeResolve.tapAsync("AsyncModuleReplacementPlugin", async (result, callback) =>
      {
        if (this.resource_reg_exp.test(result.request))
        {
          if (typeof(this.new_resource) === "function")
          {
            await this.new_resource(result);
          }
          else
          {
            result.request = this.new_resource;
          }
        }

        callback();
			});
		});
	}
}

export default function(meta, module)
{
  import.meta.codes ??= 0;

  // console.log("registering", meta.url);

  for (const name of Object.getOwnPropertyNames(module))
  {
    try
    {
      const value = module[name];
      // console.log("registering", entry.GetNormalized(), name, hash);
      const code = import.meta.codes++;

      console.log(code, name);
    }
    catch (error)
    {
      if (!(error instanceof ReferenceError))
      {
        throw error;
      }
      else
      {
        console.log("~~~~~~~Invalid", name);
        // pending.unshift(module, name);
      }
    }
  }
}
import {Getter} from "/js/Loader/Getter.js";

export async function Resolver(meta)
{
  const entry = Getter().Query(meta.url);

  // for (const imported of entry.GetImports())
  // {
  //   // console.log("Waiting for", imported.GetNormalized());
  //   await imported.Await();
  // }

  await entry.Resolved();
  // console.log("Auto resolving", entry.GetNormalized(), meta.module);
}
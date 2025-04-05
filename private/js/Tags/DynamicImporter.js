import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class DynamicImporter extends Singleton
{
  constructor(...args)
  {
    super(...args);

    this.map = {};
    this.importer = this.CreateImporter();
  }

  async CreateImporter()
  {
    try
    {
      // Test if the server supports dynamic imports
      this.importer = new Function("path", "return import(path)");
    }
    catch (error)
    {
      throw new Error(`DynamicImports are not supported in this version of node. You will need to update your node version.`);
    }
  }

  Import(path)
  {
    // return this.importer(path);
    return this.GetImporter().then(importer => importer(path));
  }

  Require(path, name)
  {
    throw new Error(`Server DynamicImporter.Require is not supported`);
  }

  GetImporter(){ return this.importer; }
}

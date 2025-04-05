export class Module
{
  #module;
  #callback;

  constructor(module, callback)
  {
    console.log("Constructing a module");
    this.#module = module;
    this.#callback = callback;
  }

  AddType(type)
  {
    
  }

  AddValue(value, type)
  {

  }
}
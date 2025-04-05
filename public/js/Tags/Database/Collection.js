import {Tag} from "/js/Tag.js";

// Dummy class for client side
export class Collection extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "collection"; }

  static Apply(action, args)
  {
    switch (action)
    {
      default: return super.Apply(action, args);
    }
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "insert_one": return this.InsertOne(...args);
      case "insert_all": return this.InsertAll(...args);
      case "find_one": return this.FindOne(...args);
      case "find_all": return this.FindAll(...args);
      default: return super.Apply(action, args);
    }
  }

  InsertOne(model)
  {
  }

  InsertAll(models)
  {
  }

  // Update Insert: Find OR create a model, then update it
  UpsertOne(model)
  {
  }

  // Replace Insert: Find OR create a model, then replace it
  ResertOne(model)
  {
  }

  // Unique Insert: Find OR insert a model
  UnsertOne(model)
  {
  }

  DeleteOne(model)
  {
  }

  UpdateOne(model)
  {
  }

  FindOne(model)
  {
  }

  FindAll(model)
  {
  }

  CountOne(model)
  {
  }

  CountAll(model)
  {
  }

  ExplainAll(model)
  {
  }
}

import {Tag} from "/js/Tag.js";
import {Collection as Base} from "/js/Tags/Database/Collection.js?next=taggly";

const COLLECTION = Symbol("collection");

export class Collection extends Base
{
  GetCollection(){ return this[COLLECTION]; }
  SetCollection(v){ return this[COLLECTION] = v; }

  #collection;

  constructor(name, collection)
  {
    super();
    this.name = name;
    this.SetCollection(collection);

    // Tag.Database().AppendChild(this);
    // this.Render();
    // const database = Tag.Head().GetDatabase();
    // database.GetMongoCollection(name).then(collection =>
    // {
    //   console.log("Creating collection", name);
    //
    //   this.SetCollection(collection);
    // });
  }

  InsertOne(model)
  {
    // if (model.GetTest())
    // {
    //   console.log("fake InsertOne in test mode");
    //   return model.New(model);
    // }

    return this.GetCollection().insertOne(model).then(result =>
    {
      model.ID(undefined, result.insertedId);
      return model;
    });
  }

  InsertAll(models)
  {
    // TODO: Test if this is how the .insertedIds array (map?) works
    return this.GetCollection().insertMany(models).then(result =>
    {
      for (let i = 0; i < result.insertedIds.length; i++)
      {
        models[i].ID("", result.insertedIds[i]);
      }

      return models;
    });
  }

  // Update Insert: Find OR create a model, then update it
  UpsertOne(model)
  {
    const filter = model.GetFilter();
    const update = model.GetUpdate();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();

    // console.log("UpsertOne", filter, update);

    if (!filter) throw new Error("UpsertOne requires a filter");
    if (!update) throw new Error("UpsertOne requires an update");

    return this.GetCollection().findOneAndUpdate(filter, update, {
      projection,
      sort,
      maxTimeMS,
      upsert: true,
      // returnOriginal: false,
    })
    .then(result => result ? model.New().SetAttributes(result.value) : null);
  }

  // Replace Insert: Find OR create a model, then replace it
  ResertOne(model)
  {
    const filter = model.GetFilter();
    const insert = model.GetInsert();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();

    // console.log("ResertOne", model, filter);
    // console.log("ResertOne", filter);

    if (!filter) throw new Error("ResertOne requires a filter");

    // if (model.GetTest())
    // {
    //   console.log("fake ResertOne in test mode");
    //   return model.New(model);
    // }

    return this.GetCollection().findOneAndReplace(filter, insert, {
      projection,
      sort,
      maxTimeMS,
      upsert: false,
      // returnOriginal: false,
    }).then(result => result ? model.New().SetAttributes(result.value) : null);
  }

  // Unique Insert: Find OR insert a model
  UnsertOne(model)
  {
    const filter = model.GetFilter();
    const insert = model.GetInsert();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();

    // console.log("UnsertOne", filter);

    if (!filter) throw new Error("UnsertOne requires a filter");

    // if (model.GetTest())
    // {
    //   console.log("fake UnsertOne in test mode");
    //   return model.New(model);
    // }

    return this.GetCollection().findOneAndUpdate(filter, { $setOnInsert: insert }, {
      projection,
      sort,
      maxTimeMS,
      upsert: true,
      // returnOriginal: false,
    })
    .then(result => result ? model.New().SetAttributes(result.value) : null);
    // .then(result => result ? result.value : null);
  }

  DeleteOne(model)
  {
    const filter = model.GetFilter();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();

    if (!filter) throw new Error("DeleteOne requires a filter");

    // if (model.GetTest())
    // {
    //   console.log("fake DeleteOne in test mode");
    //   return model.New(model);
    // }

    return this.GetCollection().findOneAndDelete(filter, {
      projection,
      sort,
      maxTimeMS,
    }).then(result => result ? model.New().SetAttributes(result.value) : null);
  }

  UpdateOne(model)
  {
    const filter = model.GetFilter();
    const update = model.GetUpdate();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();

    // console.log("UpdateOne:", filter, update);

    if (!filter) throw new Error("UpdateOne requires a filter");
    if (!update) throw new Error("UpdateOne requires an update");

    // if (model.GetTest())
    // {
    //   console.log("fake UpdateOne in test mode");
    //   return model.New(model);
    // }

    return this.GetCollection().findOneAndUpdate(filter, update, {
      projection,
      sort,
      maxTimeMS,
      upsert: false,
      // returnOriginal: false,
    }).then(result => result ? model.New().SetAttributes(result.value) : null);
  }

  FindOne(model)
  {
    const filter = model.GetFilter();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();
    const skip = model.GetSkip();

    // console.log("FindOne", filter, projection, sort, skip);

    if (!filter) throw new Error("FindOne requires a filter");

    return new Promise((resolve, reject) =>
    {
      const cursor = this.GetCollection().find(filter);

      if (typeof(projection) === "object" && projection !== null) cursor.project(projection);
      if (typeof(sort      ) === "object" && sort       !== null) cursor.sort(sort);
      if (typeof(maxTimeMS ) === "number" && maxTimeMS  >      0) cursor.maxTimeMS(maxTimeMS);
      if (typeof(skip      ) === "number") cursor.skip(skip);

      cursor.limit(1); // Just find one

      cursor.toArray((error, result) =>
      {
        if (error) return reject(error);

        // console.log("Found", result);

        try
        {
          if (result.length === 0) return resolve(null);
          else return resolve(model.New().SetAttributes(result[0]));
          // else return resolve(result[0]);
        }
        catch (error)
        {
          reject(error);
        }
      });
    });
  }

  FindAll(model)
  {
    const filter = model.GetFilter();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();
    const skip = model.GetSkip();
    const limit = model.GetLimit();

    // console.log("FindAll", filter);

    if (!filter) throw new Error("FindAll requires a filter");

    return new Promise((resolve, reject) =>
    {
      const cursor = this.GetCollection().find(filter);

      if (typeof(projection) === "object" && projection !== null) cursor.project(projection);
      if (typeof(sort      ) === "object" && sort       !== null) cursor.sort(sort);
      if (typeof(maxTimeMS ) === "number" && maxTimeMS  >      0) cursor.maxTimeMS(maxTimeMS);
      if (typeof(skip      ) === "number") cursor.skip(skip);
      if (typeof(limit     ) === "number") cursor.limit(limit);

      cursor.toArray((error, result) =>
      {
        if (error) return reject(error);

        // For each result, create a new model of the filter type and load the result
        const models = [];
        for (let i = 0; i < result.length; i++)
        {
          try
          {
            models.push(model.constructor.New().SetAttributes(result[i]));
          }
          catch (error)
          {
            return reject(error);
          }
        }

        return resolve(models);
      });
    });
  }

  CountOne(model)
  {
    const filter = model.GetFilter();
    const maxTimeMS = model.GetTimeout();

    // console.log("CountOne", filter);

    if (!filter) throw new Error("CountOne requires a filter");

    return this.GetCollection().countDocuments(
      filter,
      {
        skip: 0,
        limit: 1,
        maxTimeMS,
      },
    ).then(count => count > 0 ? true : false);
  }

  CountAll(model)
  {
    const filter = model.GetFilter();
    const skip = model.GetSkip();
    const limit = model.GetLimit();
    const maxTimeMS = model.GetTimeout();

    if (!filter) throw new Error("CountAll requires a filter");

    return this.GetCollection().countDocuments(
      filter,
      {
        skip,
        limit,
        maxTimeMS,
      },
    );
  }

  ExplainAll(model)
  {
    const filter = model.GetFilter();
    const projection = model.GetProject();
    const sort = model.GetSort();
    const maxTimeMS = model.GetTimeout();
    const skip = model.GetSkip();
    const limit = model.GetLimit();

    if (!filter) throw new Error("ExplainAll requires a filter");

    const cursor = this.GetCollection().find(filter);

    if (typeof(projection) === "object" && projection !== null) cursor.project(projection);
    if (typeof(sort      ) === "object" && sort       !== null) cursor.sort(sort);
    if (typeof(maxTimeMS ) === "number" && maxTimeMS  >      0) cursor.maxTimeMS(maxTimeMS);
    if (typeof(skip      ) === "number") cursor.skip(skip);
    if (typeof(limit     ) === "number") cursor.limit(limit);

    return cursor.explain().then(value =>
    {
      // console.log("Explanation", value);
      // console.log("Explanation queryPlanner:", value.queryPlanner);
      const explanation = JSON.stringify(value.executionStats, undefined, 2);

      console.log("Explanation", explanation);
      return null;
    });
  }

  CreateIndexes(indexes, options)
  {
    if (typeof(indexes) !== "object" || indexes === null)
    {
      throw new Error(`Expected indexes to be an object`);
    }

    return new Promise((resolve, reject) =>
    {
      // console.log("Creating indexes", indexes);
      this.GetCollection().createIndex(indexes, options, (error, result) =>
      {
        if (error) return reject(error);
        else return resolve(result);
      });
    });
  }

  CreateUniqueIndexes(indexes){ return this.CreateIndexes(indexes, { unique: true }); }
  CreateExpirationIndexes(indexes, seconds = 0){ return this.CreateIndexes(indexes, { expireAfterSeconds: seconds }); }

  DeleteIndex(index, options)
  {
    return new Promise((resolve, reject) =>
    {
      this.GetCollection().dropIndex(index, options, (error, result) =>
      {
        if (error) return reject(error);
        else return resolve(this);
      });
    });
  }

  DeleteAllIndexes(options)
  {
    return new Promise((resolve, reject) =>
    {
      this.GetCollection().dropIndexes(options, (error, result) =>
      {
        if (error) return reject(error);
        else return resolve(this);
      });
    });
  }
}

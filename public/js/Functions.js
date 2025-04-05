export async function Ping()
{

}

// export async function ModelSearch(owner_id, model)
// {
//   const owner = this.QueryOwner(owner_id);
//   return model.Search(owner);
// }

export async function ModelInsert(owner_id, model)
{
  console.log("Called ModelInsert", owner_id, model);
}

export async function ModelUpsert(owner_id, model)
{
  console.log("Called ModelUpsert", owner_id, model);
}

export async function ModelResert(owner_id, model)
{
  console.log("Called ModelResert", owner_id, model);
}

export async function ModelUnsert(owner_id, model)
{
  console.log("Called ModelUnsert", owner_id, model);
}

export async function ModelDelete(owner_id, model)
{
  console.log("Called ModelDelete", owner_id, model);
}

export async function ModelUpdate(owner_id, model)
{
  console.log("Called ModelUpdate", owner_id, model);
}

export async function ModelModify(owner_id, model)
{
  console.log("Called ModelModify", owner_id, model);
}

export async function ModelSearch(owner_id, model)
{
  console.log("Called ModelSearch", owner_id, model);
}

export async function ModelFilter(owner_id, model)
{
  console.log("Called ModelFilter", owner_id, model);
}

export async function ModelExists(owner_id, model)
{
  console.log("Called ModelExists", owner_id, model);
}

export async function ModelCount(owner_id, model)
{
  console.log("Called ModelCount", owner_id, model);
}

export async function ModelExplain(owner_id, model)
{
  console.log("Called ModelExplain", owner_id, model);
}

export async function ModelLogin(owner_id, model)
{
  const owner = await this.QueryOwner(owner_id);

  console.log("Called ModelLogin", owner, model);
  return model.Login(owner);
}

export async function ModelLogout(owner_id, model)
{
  console.log("Called ModelLogout", owner_id, model);
}

export async function ModelTest(owner_id, model)
{
  // console.log(Object.hasOwn(model.constructor.prototype, "Search"), model.constructor.prototype.Search);
  // console.log(Object.hasOwn(model.constructor.prototype, "_Search"));
  const result = await model.Search();

  console.log("Called ModelTest", owner_id, result);

  return result;
}

export async function MyFunction(...args)
{
}
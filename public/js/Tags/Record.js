import {Tag} from "/js/Tag.js";

class Filter
{
  Assign(key, operator, value)
  {
    switch (operator)
    {
      case "==":
      case "===": return this.Set("$eq");

      default: throw new Error(`Unknown operator`);
    }
  }
}

class Update
{

}

export class Record extends Tag
{
  #filter;
  #update;

  #owner;
  #action;
  #login;
  #logout;

  SetOperator(key, operator, value)
  {
    switch (operator)
    {
      case "==":
      case "===": return this.#SetFilter(key, "$eq", value);

      default: throw new Error(`Unknown operator`);
    }
  }

  Login(v = true){ this.#login = v; return this.Record("login", v); }
  Logout(v = true){ this.#logout = v; return this.Record("logout", v); }

  Search(owner){ return Error.Throw`Model T${this} and owner T${owner} do not grant access to the action Search`; }

  $Search(owner)
  {
    // On the client, throw an error
    // On the server, perform the database action
  }

  Apply(action, args)
  {
    switch (key)
    {
      case "login": return this.Login(...args);
      case "logout": return this.Logout(...args);
      case "search": return this.Search(...args);
      default: return super.Apply(action, args);
    }
  }
}

export class Connection extends Tag
{
}

export class Client extends Record
{
  
}

export class User extends Record
{
  Email(o, v){ return this.SetString("email", o, v, 1, 100); }
  First(o, v){ return this.SetString("first", o, v, 1, 100); }
  Last(o, v){ return this.SetString("last", o, v, 1, 100); }

  Apply(action, args)
  {
    switch (key)
    {
      case "email": return this.Email(...args);
      case "first": return this.First(...args);
      case "last": return this.Last(...args);
      default: return super.Apply(action, args);
    }
  }

  Search(owner)
  {
    if (owner instanceof Client)
    {
      return this.SetOperator("email", "==").$Search(owner);
    }

    return super.Search(owner);
  }

  async Example()
  {
    const user = await new User().Email("==", "fake@email.com").Search(connection);
  }
}
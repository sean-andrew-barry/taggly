import {Expectation} from "/js/Debug/Expectation.js";

export const tests = [];
export class Test
{
  static Add(url, ...args)
  {
    new Expectation(this, url).Named("url").ToBeValidString();
    tests.push(url, args);
  }

  static AddIfServer(...args){ if ( global.IsServer()) return this.Add.apply(this, args); }
  static AddIfClient(...args){ if (!global.IsServer()) return this.Add.apply(this, args); }

  constructor(url, args = [])
  {
    this.url = url;
    this.args = args;
    this.passed = [];
    this.failed = [];
    this.skips = new Set(["constructor", "Initialize", "Run", "Expect"]);
  }

  Skip(...names)
  {
    for (let i = 0; i < names.length; i++)
    {
      const name = names[i];
      this.skips.add(name);
    }

    return this;
  }

  async Initialize(config)
  {
    return this;
  }

  Expect(value)
  {
    return new Expectation(this, value);
  }

  async Run(config, delay)
  {
    // console.log("Running test", this.constructor.name, delay);
    const names = Object.getOwnPropertyNames(this.constructor.prototype);

    const args = this.args;

    try
    {
      await this.Initialize(config, ...args);
    }
    catch (error)
    {
      this.failed.push(error);
      console.error(`Test "Initialize" failed:`, error);
    }

    for (let i = 0; i < names.length; i++)
    {
      const name = names[i];

      if (this.skips.has(name)) continue;

      const fn = this[name];
      if (typeof(fn) === "function")
      {
        await global.Sleep(delay); // Wait to allow other priority code to run before each test

        try
        {
          this.SetName(`${this.constructor.name}.${name}`);

          // Wait for the test to finish
          await fn.apply(this, args);
          this.passed.push(fn);
        }
        catch (error)
        {
          this.failed.push(error);
          console.error(`Test "${this.GetName()}" failed:`, error);
        }
      }
    }
  }

  GetUrl(){ return this.url; }
  GetArgs(){ return this.args; }

  SetName(name){ this.name = name; }
  GetName(){ return this.name || this.constructor.name; }
}

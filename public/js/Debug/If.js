const STACK = [];

export class Passed
{
  static get Or() { return undefined; } // If it passed there's no need to continue
  static get And() { return And; }
}

export class Failed
{
  static get Or() { return Or; }
  static get And() { return undefined; } // If it failed there's no need to continue
}

export class If
{
  static Push(v) { STACK.push(v); }
  static get Not() { return Not; }
  static Undefined(v) { return v === undefined ? Passed : Failed; }
}

export class Not extends If
{
  static Undefined(v) { return v === undefined ? Failed : Passed; }
}

export class Or extends If
{
}

export class PassedOr extends Or
{
}

export class FailedOr extends Or
{
}

export class And extends If
{
}

// export function If(value)
// {
//   if (value === true)
//   {

//   }
//   else
//   {

//   }
// }

// Expect.IsUndefined(v)

// If.Undefined(v).Or ?? If.String(v).Then ?? If.Throw``;

// If.String(v) ?? And.LongerThan(v, 42) ?? Then.Throw();

// If.String(v).And?.LongerThan(v, 42) ?? Then.Throw();

// If.Undefined(v) ?? If.String(v) ?? Then.Throw``;

// If.Not.Undefined(v).And?.Not.String(v) ?? Then.Throw();

const v = null;

Assert.True(Is.Undefined(v) || Is.String(v)); // Expected value ${v} to be a string or undefined
Assert.True(v, Is.Undefined, Is.String); // Expected value ${v} to be a string or undefined

// if (Is.NotUndefined(v) && Is.NotString(v)) throw new Expectation();
if (v !== undefined && typeof v !== "string") throw new Error();
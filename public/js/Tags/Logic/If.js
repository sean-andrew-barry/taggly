import {Tag} from "/js/Tag.js";
import {Logic} from "/js/Tags/Logic.js";
import {OnConnect} from "/js/Tags/Events.js";

class Logic extends Tag
{
  Evaluate()
  {

  }
}

export class Program extends Logic
{

}

export class Statement extends Logic
{

}

export class If extends Statement
{

}

export class IfElse extends Statement
{

}

export class Else extends Statement
{
  [OnConnect]
  {

  }
}

export class String extends Tag
{
  Evaluate(func)
  {
    return func.Push(this.GetName(), this.GetValue());
  }

  Compile(builder)
  {
    if (this.IsConstant())
    {
      builder.Line("const").CWS();
    }
    else
    {
      builder.Line("let").CWS();
    }

    builder.Write(this.GetName());

    if (this.HasValue())
    {
      builder.WS().Write("=").WS();
      builder.Write(this.GetValue());
    }

    builder.ExpressionEnd();
  }
}

export class Number extends Tag
{
  Evaluate(func)
  {
    return func.Push(this.GetName(), this.GetValue());
  }
}

export class Context
{
  constructor(func)
  {
    this.func = func;
    this.stack = [];
  }

  Return()
  {
  }

  Continue()
  {
  }

  Run()
  {
    this.current = this.func.GetFirstChild();
  }
}

export class Function extends Tag
{
  constructor(...args)
  {
    super(...args);
  }

  Evaluate(func)
  {
    // this.stack ??= [];
    // const context = new Context(this);
    // context.Run();

    // const first = this.GetFirstChild();
    // if (first)
    // {
    //   first.Evaluate(this);
    // }

    let next = this.GetFirstChild();
    while (next)
    {
      try
      {
        next.Evalute(this);
      }
      catch (error)
      {
        func.Throw(error); // Pass the error up the function chain
        return this;
      }

      next = next.GetNextSibling();
    }

    return this;
  }

  Compile(builder)
  {
    builder.Line("function");

    if (this.HasName())
    {
      builder.Write(" ");
      builder.Write(this.GetName());
    }

    builder.Write("(");
    // Write each parameter
    builder.Write(")");

    builder.Line("{");

    let next = this.GetFirstChild();
    while (next)
    {
      try
      {
        next.Compile(builder);
      }
      catch (error)
      {
        // func.Throw(error); // Pass the error up the function chain
        // return this;
        throw error;
      }

      next = next.GetNextSibling();
    }

    builder.Line("}");
  }

  Compile(fn, builder)
  {
    builder.NLO("function");

    if (this.HasName())
    {
      builder.WS().Add(this.GetName());
    }

    builder.Add("(");
    if (this.HasParameters())
    {
      builder.Add(this.GetParameters());
    }
    builder.Add(")");

    builder.NL("{").In();
    this.Iterate(fn, builder, this.GetFirstChild());
    builder.NL("}").Out();
  }

  Iterate(fn, builder, current)
  {
    if (!current) return;

    if ((current instanceof Logic) || (current instanceof Function))
    {
      current.Compile(fn, builder);
    }

    // Iterate children then siblings
    this.Iterate(fn, builder, current.GetFirstChild());
    this.Iterate(fn, builder, current.GetNextSibling());
  }

  Define(name, value)
  {

  }

  Throw(error)
  {

  }

  WS(s = " "){ return this.Write(s); }
  WSO(s = " "){ return this.WS(s); }

  NL(string)
  {
    this.Close();

    // Open a new line
    this.current = [this.indent];

    return this.Add(string);
  }

  NLO(string){ return this.NL(string); }
}

export class Operation extends Tag
{
  Evaluate(func)
  {
    // return func.Push(this.GetName(), this.GetValue());
  }

  Compile(builder)
  {
    switch (this.GetOperation())
    {
      case "===":
      case "==":
      {
        const left = this.GetChild(0);
        const right = this.GetChild(1);

        left.Compile(builder);
        builder.Write(this.GetOperation());
        right.Compile(builder);
        break;
      }
      default:
      {
      }
    }
  }

  Compile(fn, builder)
  {
    // builder.Add("(");
    // builder.Add(")");

    // Example: fn.Query("string.test").Apply("===", new Text("Hello...?"));
    builder.Add(this.GetChild(0)).Add(`.Apply("===",`).WSO(this.GetChild(1)).Add(`)`);
  }
}

export class Pointer extends Tag
{
  Compile(fn, builder)
  {
    const fn_ref = fn.GetReference();
    const ref = fn.GetUnique("t"); // Example: t1/t2/t3, etc

    // Example: const t1 = f1.Query("string.name");
    builder.NLO(`const ${ref} = ${fn_ref}.Query("${this.GetValue()}");`);
    builder.NLO(``);
  }

  Compile(fn, builder)
  {
    const fn_ref = fn.GetReference();
    const ref = fn.GetUnique("t"); // Example: t1/t2/t3, etc

    // Example: const t1 = f1.Query("string.name");
    builder.NLO(`const ${ref} = ${fn_ref}.Query("${this.GetValue()}");`);
    builder.NLO(``);
  }
}

export function Code()
{
  // A program is a special type of Function tag that auto Evaluates itself, starting the process
  return new Program().Name("example_program").Add(
    new Function().Name("my_function").Add(
      new String("Hello world!").Class("hello").Constant(true), // const hello = "Hello world!";
      new Number(42).Class("value"), // let value = 42;

      new If().Add( // if (string.hello === "Hello...?")
        new Operation("===").Add(
          new Pointer("string.hello"),
          "Hello...?",
        ),
        new Operation("=").Add( // string.hello = "HELLO!";
          new Pointer("string.hello"),
          new String("HELLO!"),
        ),
      ),
      new ElseIf().Add( // else if (number.value === 42)
        new Operation("===").Add(
          new Pointer("number.value"),
          new Number(42),
        ),

        // const hello = "Hello world!";
        // let value = 42;
        // fn.Query("number.value").Apply("+=", [new Number(1)]);
        new Operation("+=").Add( // number.value += 1; (Only applies to the function's local value)
          new Pointer("number.value"),
          new Number(1),
        ),

        // return fn.Query("string.hello");
        new Operation("return").Add( // return string.hello;
          new Pointer("string.hello"),
        ),
      ),
      new Else().Add( // else
        new Operation("return").Add( // return number.value;
          new Pointer("number.value"),
        ),
      ),
    ),

    new Operation("()").Add(
      new Pointer("function.my_function"),
    ),
  );
}

export function AST()
{
  return new AST().Add(
  );
}

export function Compiled()
{
  function example_program()
  {
    function my_function()
    {
      const hello = "Hello world!";
      let value = 42;

      if (hello === "Hello...?")
      {
        hello = "HELLO!";
      }
      else if (value === 42)
      {
        value += 1;
        return hello;
      }
      else
      {
        return value;
      }
    }

    my_function();
  }
}

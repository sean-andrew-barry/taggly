import {Console} from "/js/Utility/Console.js";

export class WorkerConsole extends Console
{
  Apply(name, args)
  {
    args.unshift(`[Worker ${global.process.pid}]`);
    return super.Apply(name, args);
  }
}

import cluster from "cluster";

let index = 0;
const requests = new Map();

if (cluster.isWorker)
{
  global.process.on("message", (...args) =>
  {
    try
    {
      const actions = JSON.parse(message);
      this.Apply.apply(this, actions);
    }
    catch (error)
    {
      console.error("Master message", message, "could not be parsed into JSON");
    }
  });
}

export class Request
{
  constructor(action, ...args)
  {
    this.index = index++;
    this.promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

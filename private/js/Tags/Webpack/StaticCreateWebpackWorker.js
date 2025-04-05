import webpack from "/js/External/WebPack.js?static=true";
import memfs from "/js/External/MemFS.js?static=true";
import {Worker, isMainThread, parentPort, workerData} from "worker_threads";
import {Environment} from "/js/Environment.js";

export function Create(options)
{
  return new Promise(async (resolve, reject) =>
  {
    // const parent = new URL(import.meta.url);
    // const file = await Environment.Search(parent, "/js/Tags/Webpack/StaticCreateWebpackCompiler.js?static=true", ["private", "public"]);
    const url = new URL(import.meta.url);
    // console.log("Found file:", url);
    console.log("Creating worker with options", options);
    const worker = new Worker(url, {
      workerData: options,
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) =>
    {
      console.log("Worker exited");
      if (code !== 0)
      {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

let worker;
export default function(options)
{
  return worker ??= Create(options);
}

if (!isMainThread)
{
  console.log("Hi from worker thread!", workerData);
  parentPort.postMessage({ hello: "from worker" })
}

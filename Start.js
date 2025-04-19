import Module from "node:module";
import { registerHooks } from "node:module";
import { MessageChannel, threadId, Worker, isMainThread, parentPort, workerData, BroadcastChannel } from "node:worker_threads";
import { resolve, load } from "./Loader.js";

registerHooks({ resolve, load });

// setInterval(() =>
// {
//   const memoryUsage = process.memoryUsage();
//   console.log(`Worker thread ${threadId} heap: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
// }, 10000);

// console.log("Start.js", threadId, process.pid);

// console.log("Start", threadId, import.meta.resolve, !!parentPort);

// console.log("~~~~~START~~~~", threadId);

// const RESOLVE_SKIPS = new Set([
//   ...Module.builtinModules,
//   ...Module.builtinModules.map(m => "node:" + m), // Add all the builtins with their node: prefix
//   "greenlock",
//   "jsdom",
//   "memfs",
//   "mongodb",
//   "node-fetch",
//   "node-forge",
//   "nodemailer",
//   "rollup",
//   "terser",
//   "webpack",
//   "webpack-virtual-modules",
//   "ws",
//   "terser-webpack-plugin",
// ]);

// let data = workerData;
// let data = JSON.parse(process.env.TAGGLY_PACKAGE);

// // Delete the TAGGLY_PACKAGE because it can hold secrets, and I do not want
// // those secrets to be exposed to every random module.
// // It IS possible for the secrets to be exposed by a module that is designed
// // to target this framework, but at least a module just designed to copy out
// // the entire process.env will not get them.
// delete process.env.TAGGLY_PACKAGE;

// 
// const { port1, port2 } = new MessageChannel();

// data.instance = 0;
// data.imported = new Date();
// // data.resolve_skips = [...RESOLVE_SKIPS];
// // data.resolve_skips = RESOLVE_SKIPS;
// data.preloads = new Map();
// data.loader_path = import.meta.url;
// data.preloader_url = import.meta.url;
// data.preloading = true;
// data.number = 1;
// // data.port = port2;
// // data.port = parentPort;
// data.loader = undefined;

// port1.on('message', (args) =>
// {
//   if (data.loader)
//   {
//     data.loader.Apply(...args);
//   }
//   else
//   {
//     console.log("START:", args);
//   }
// });

// // console.log(data);

// const array = new Int32Array(data.buffer);

// let current = Atomics.load(array, 0);
// const result = Atomics.waitAsync(array, 0, current);

// console.log("Pre preloader", current);

// console.log("Importing loader...");

// register("./Preloader.js", {
//   parentURL: import.meta.url,
//   data,
//   transferList: [port2],
// });

// const result = await import("/js/Coder.js");

// register("/js/Loader.js?optional=true", {
//   parentURL: import.meta.url,
//   // data,
//   // transferList: [port2],
// });



// current = Atomics.load(array, 0);
// console.log("Post preloader", current);

// console.log(current, result);
// if (result.async) await result.value;

// console.log("Done waiting!");

// console.log(process.memoryUsage());
// const broadcast_channel = new BroadcastChannel("test");
// console.log(process.memoryUsage());

// broadcast_channel.onmessage = (event) =>
// {
//   console.log("Worker BroadcastChannel onmessage", event);
//   // throw new Error("Test error");
// };

// broadcast_channel.onmessageerror = (event) =>
// {
//   console.log("Worker BroadcastChannel onmessageerror", event);
//   // throw new Error("Test error");
// };

// broadcast_channel.onerror = (event) =>
// {
//   console.log("Worker BroadcastChannel onerror", event);
// };

// broadcast_channel.postMessage("Hi from worker");

// const gigabyte = 1024 * 1024 * 1024;
// const bytes = gigabyte * 4; // 4 gigabytes I think
// const view = new SharedArrayBuffer(8, { maxByteLength: bytes });
// console.log(buffer, buffer.maxByteLength);
// buffer.grow(bytes);

// // Create a Uint8Array view to easily write bytes to the buffer
// const uint8View = new Uint8Array(buffer);

// // Write random bytes to the entire buffer
// // const end = uint8View.length;
// const end = 1024;
// for (let i = 0; i < end; i++)
// {
//   uint8View[i] = Math.floor(Math.random() * 256);
// }

// console.log(buffer, buffer.maxByteLength);

// const mod = await import("/js/Loader.js");
// console.log("Start imported loader", mod);




// const Coder = await import("/js/Coder.js");
// console.log(Coder);

// // console.log("~~About to import loader!~~");
// const {Loader} = await import("/js/Loader.js?optional=false");

// // await import("node:module", { assert: { custom: "value" } });
// // await import("node:module");

// data.loader = Loader.Get();
// // port1.postMessage(["start", []]);

// try
// {
//   await data.loader.Initialize(data);
//   await data.loader.Start();
// }
// catch (error)
// {
//   data.loader.OnStartError(error);
// }





// import("/js/Loader.js").then(async mod =>
// {
//   console.log("Imported the loader", mod);
//   data.loader = mod.Loader.Get();
//   // port1.postMessage(["start", []]);

//   try
//   {
//     await data.loader.Initialize(data);
//     // await data.loader.Start();
//   }
//   catch (error)
//   {
//     data.loader.OnStartError(error);
//   }
// });

// import cluster from "node:cluster";

// const broadcast_channel = new BroadcastChannel("main_channel");
// broadcast_channel.postMessage("Hi from worker");

// console.log("~~~parentPort?", !!parentPort);
// console.log("~~~worker?", !!cluster.worker);

// console.log("~~~~~~~~~~~~~Start.js");

// console.log("Resolve?", import.meta.resolve);


// #Build()
// {
//   switch (this.GetType())
//   {
//     case 0: return undefined; // 0 means unallocated
//     case 1: return new File(this);
//     case 2: return new Directory(this);
//     case 3: return new Layer(this);
//     case 4: return new Domain(this);
//     default: throw new Error(`Unknown block type code of ${this.GetType()}`);
//   }
// }
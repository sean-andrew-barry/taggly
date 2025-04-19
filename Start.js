import Module from "node:module";
import { registerHooks } from "node:module";
import { MessageChannel, threadId, Worker, isMainThread, parentPort, workerData, BroadcastChannel } from "node:worker_threads";
import { resolve, load } from "./Loader.js";

registerHooks({ resolve, load });
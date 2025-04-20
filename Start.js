import { registerHooks } from "node:module";
import { initialize, resolveSync as resolve, loadSync as load } from "./Preloader.js";

registerHooks({ resolve, load });

// const mod = await import("/js/Loader.js");

const data = JSON.parse(process.env.TAGGLY_PACKAGE);
data.preloads = new Map();

await initialize(data);

// console.log(mod);

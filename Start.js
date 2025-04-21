import { registerHooks } from "node:module";
import { initialize, resolveSync as resolve, loadSync as load } from "./Preloader.js";

registerHooks({ resolve, load });

await initialize();
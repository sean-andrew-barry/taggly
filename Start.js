import { registerHooks } from "node:module";
import { resolve, load } from "./Loader.js";

registerHooks({ resolve, load });
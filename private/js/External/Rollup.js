import "/flag#static";

// The relative pathing seems to be necessary, IDK why
// Is it because the loader imports it as a directory instead of a node_module?
// A directory import skips the default resolver function, so that's probably related
import rollup from "../node_modules/rollup";
export {rollup};

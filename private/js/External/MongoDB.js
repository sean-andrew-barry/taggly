import "/flag#static";
import "/flag#dangerous";

// // Dynamic import so that mongodb is an optional dependency
// export default await import("mongodb")
// .then(mod => mod.default)
// .catch(error => undefined);

import mongodb from "mongodb";
export {mongodb};

// export class mongodb
// {
  
// }

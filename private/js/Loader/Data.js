// import "/flag#static";
// import "/flag#frozen";
// import "/flag#dangerous";
// import "/flag#domain";
import "/flag#static;frozen;dangerous;domain";
import { workerData } from "node:worker_threads";

// console.log(workerData);

export const Data = workerData;
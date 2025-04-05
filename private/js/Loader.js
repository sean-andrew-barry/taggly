// import "/flag#static";
// import "/flag#volatile";
import "/flag#dangerous";
// import "/flag#singleton";

import {Loader} from "/js/Loader/Loader.js";

export {Loader};
// import * as RawData from "/js/Loader/TestData.js";
// import TestData1 from "/js/Loader/TestData.js" assert { type: "json" };

// console.log("~~~", RawData);
// console.log(TestData1);
// console.log(TestData1.key3, TestData2.key3, TestData3.key3);

export async function initialize(data) {
  console.log("Initializing Loader!");
}

export async function resolve(specifier, context, nextResolve) {
  const {parentURL} = context;

  // Defer to the next hook in the chain, which would be the
  // Node.js default resolve if this is the last user-specified loader.
  return nextResolve(specifier);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url);
}

// export async function resolve(specifier, context) {
//   const {parentURL} = context;
// }

// export async function load(url, context) {
// }
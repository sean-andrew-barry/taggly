// // Importing Tags here because the aggregate only works if it is loaded very early
// // in the import order.
// // I do not know why the order matters.
// import "/js/Tags.js#ignore";

import {Main} from "/js/Main.js";

// The public Start.js auto invokes the Main function,
// unlike the private Start.js
// This is because the public version is run in the browser, which has no loader

Promise.resolve(Main()).catch(error =>
{
  console.log("Error running Main:");
  console.error(error);
});

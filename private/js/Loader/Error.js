import {Data as DATA} from "/js/Loader/Data.js";

console.log("~~~ERROR~~~");

for (const error of DATA.errors)
{
  console.error(error);
}
import {Parser} from "/js/Token/Parser.js";

export class JavaScript extends Parser
{
  
}

function Sample()
{
  const a = "Hello";
}

console.log("Hi from JS");
const parser = new JavaScript(Sample.toString());
// for (const token of parser)
// {
//   console.log(token);
// }
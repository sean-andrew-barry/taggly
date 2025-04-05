// import * as AllTags from "/js/TagsTest.js";
// import * as Tags from "/js/Tags.js";
import { Document } from "/js/Tags/Document.js";
import { window } from "/js/Window.js";

// import {Code} from "/js/Internal/Code.js";
// import * as Events from "/js/Events.js";
// import * as Objects from "/js/Objects.js";
// import * as Tags from "/js/Tags.js";
// Code.Register(Events);
// Code.Register(Objects);
// Code.Register(Tags);

export async function Main()
{
  // Document.TrustAll(window.document);

  // // Trust all the nodes that already exist, as those should be from the initial load
  // const document = new Document(window.document);

  // globalThis.setInterval(() =>
  // {
  //   // console.log("Tick...");
  // }, 1000);

  return function MainDestructor()
  {
    // document.destructor();
  };
}
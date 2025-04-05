import {Document as DocumentBase} from "/js/Tags/Document.js?next=/taggly/private";
// import {Environment} from "/js/Utility/Environment.js";

// console.log(Object.getPrototypeOf(import.meta.url) instanceof Object);
// if (import.meta.test) console.log(Object.getPrototypeOf(import.meta.test) instanceof ({}.constructor));

export class Document extends DocumentBase
{
  GetFileSystemObserver(...args){ if (!import.meta.vm) return super.GetFileSystemObserver(...args); }
  GetServer(...args){ if (!import.meta.vm) return super.GetServer(...args); }
  GetDatabase(...args){ if (!import.meta.vm) return super.GetDatabase(...args); }
}

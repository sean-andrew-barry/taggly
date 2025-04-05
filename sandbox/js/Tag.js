import {Tag as Base} from "/js/Tag.js?after=/taggly/sandbox/";
import Freeze from "/js/Utility/Freeze.js";
// import {Proxy} from "/js/Utility/Proxy.js";

/*
  Okay, so it isn't possible to have classes mixed between the VM and outside
  if they inherit from each other

  That would cause very weird behavior, like `div instanceof Tag === false`

  But the base of the chain can still be outside, like Tag, Element, and Node
  can all be shared. All of their descendants, like Div, must be reimported for
  each VM.

  However, that doesn't mean all the code of the descendants must be reimported
  Large functions can be extracted out to their own file, which gets shared
  This can help reduce the size of each VM

  Though really... Most classes aren't big because of large functions, they are
  big because they have tons of functions... So maybe it doesn't actually make
  much difference in practice.

  A lot of this problem stems from having everything inherit Tag...

  I can do another optimization, which is check what files are overridden
  A file that doesn't get overridden can still be shared, as long as it isn't
  dependant on a file which is overridden
*/

// This must override the Tags import, because otherwise it would use the shared
// Tags, rather than the VM's Tags
export class Tag extends Base
{
  constructor(...args)
  {
    super(...args);
    Freeze(this);
    // return new Proxy(this);
  }
}

// Freeze(Tag);
Freeze(Base);

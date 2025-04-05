// QUESTION: Can a file be forcibly isolated via appending imports to it?
import {window, global, globalThis, String} from "/js/VM/Global.js";

// You can still access things like the string prototype like this:
const string = "my string";
console.log(string.prototype);

// But can I make it so that doesn't matter?

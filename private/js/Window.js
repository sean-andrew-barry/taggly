import "/flag#static";
import "/flag#dangerous";
import "/flag#internal";

import {webcrypto} from "node:crypto";
import {performance, PerformanceObserver} from "node:perf_hooks";

import {jsdom} from "/js/External/JSDOM.js";
// import fetch from "/js/External/NodeFetch.js";
import {Loader} from "/js/Loader.js";
import {Freeze} from "/js/Utility/Freeze.js";

const loader = Loader.Get();

const dom = new jsdom.JSDOM("<!DOCTYPE html></html>", {
  url: loader?.GetWindowURL() ?? "https://localhost/",
  contentType: loader?.GetContentType() ?? "text/html",
  pretendToBeVisual: true, // Enables requestAnimationFrame
  storageQuota: loader?.GetStorageQuota() ?? undefined,
});
// runScripts: "outside-only",

export const window = dom.window;

// console.log(Object.getOwnPropertyNames(window));

// window.fetch ??= (globalThis.fetch ?? fetch);
// window.PerformanceObserver ??= (globalThis.PerformanceObserver ?? PerformanceObserver);
// window.crypto ??= (globalThis.crypto ?? webcrypto);

// Both Node and JSDOM provide their own URL implementation, which can cause issues with
// things like (url instanceof URL) failing if the implementations are mixed
// I think it's best to just override JSDOM's URL with Node.js's URL
if (window.URL !== globalThis.URL)
{
  window.URL = globalThis.URL;
}

// NOTE: JSDOM does seem to have Range support, but I don't know how to enable it...
if (!window.document.createRange)
{
  class Range
  {
    createContextualFragment(html)
    {
      return jsdom.JSDOM.fragment(html);
    }
  }

  window.document.createRange = function()
  {
    return new Range();
  }
}

// Create a pseudo requestIdleCallback if none exists
// It's important to note that this is NOT the same behavior
window.requestIdleCallback ??= function requestIdleCallback(handler)
{
  const start = globalThis.performance.now();

  function timeRemaining()
  {
    return Math.max(0, 50.0 - (globalThis.performance.now() - start));
  }

  return globalThis.setTimeout(function()
  {
    handler({
      didTimeout: false,
      timeRemaining,
    });
  }, 1);
};

window.cancelIdleCallback ??= function cancelIdleCallback(id)
{
  globalThis.clearTimeout(id);
};

// window.

// Object.preventExtensions(window);
// Object.seal(window);
// Object.freeze(window);
//
// console.log("Is extensible", Object.isExtensible(window));
// console.log("Is sealed", Object.isSealed(window));
// console.log("Is frozen", Object.isFrozen(window));

// Freeze(window, "Node");
// // Freeze(window);
//
// window.Node.prototype.test = function()
// {
//
// }
//
// window.Node = "test";

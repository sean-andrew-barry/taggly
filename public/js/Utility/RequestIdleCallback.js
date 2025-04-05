import {SetTimeout, ClearTimeout} from "/js/Utility/SetTimeout.js";

// Create a pseudo requestIdleCallback if none exists
// It's important to note that this is NOT the same behavior
export const RequestIdleCallback = globalThis.requestIdleCallback ?? function requestIdleCallback(handler)
{
  return globalThis.setTimeout(function()
  {
    const start = globalThis.performance.now();

    handler({
      didTimeout: false,
      timeRemaining()
      {
        return Math.max(0, 50.0 - (globalThis.performance.now() - start));
      },
    });
  }, 1);
};

export const CancelIdleCallback = globalThis.cancelIdleCallback ?? function cancelIdleCallback(id)
{
  globalThis.clearTimeout(id);
};

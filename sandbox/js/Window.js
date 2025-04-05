import window from "/js/Window.js?after=/taggly/sandbox/";

// NOTE: This needs work, it would still allow bypassing
window.setTimeout = globalThis.setTimeout;
window.setInterval = globalThis.setInterval;
window.setImmediate = globalThis.setImmediate;
window.queueMicrotask = globalThis.queueMicrotask;
window.clearTimeout = globalThis.clearTimeout;
window.clearInterval = globalThis.clearInterval;
window.clearImmediate = globalThis.clearImmediate;

export {window};
export default window;

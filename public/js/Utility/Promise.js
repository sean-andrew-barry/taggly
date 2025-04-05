import {window} from "/js/Window.js";

let background_task;
let next_frame;
const animation_callbacks = new WeakSet();

const DOM_LOADED = new Promise((resolve, reject) =>
{
  window.addEventListener("DOMContentLoaded", event =>
  {
    resolve(event);
  }, { once: true });
});

const BEFORE_UNLOAD = new Promise((resolve, reject) =>
{
  window.addEventListener("beforeunload", event =>
  {
    resolve(event);
  }, { once: true });
});

export class PromiseUtilities
{
  static Sleep(ms)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static AwaitBackgroundTask(sleep)
  {
    const prev = background_task;
    return background_task = new Promise(async (resolve, reject) =>
    {
      await prev; // Wait for the previous promise to resolve

      if (typeof(sleep) === "number")
      {
        await this.Sleep(sleep); // Go idle for a number of milliseconds
      }

      resolve();
    });
  }

  static AwaitLoaded(){ return DOM_LOADED; }
  static AwaitBeforeUnload(){ return BEFORE_UNLOAD; }

  static async AddBackgroundTask(callback, sleep = 0)
  {
    await this.AwaitBackgroundTask(sleep);
    return await callback();
  }

  static QueueAnimationFrame(callback)
  {
    if (animation_callbacks.has(callback))
    {
      return; // Already queued
    }
    else
    {
      animation_callbacks.add(callback);
      window.requestAnimationFrame(dt =>
      {
        callback(dt);
        animation_callbacks.delete(callback);
      });
    }
  }

  static AwaitAnimationFrame()
  {
    return next_frame ??= new Promise((resolve, reject) =>
    {
      window.requestAnimationFrame(dt =>
      {
        // Clear the next_frame, so that when AwaitAnimationFrame is called it generates a new promise
        next_frame = undefined;
        resolve(dt);
      });
    });
  }
}

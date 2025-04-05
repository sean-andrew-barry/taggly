import {PromiseHelper} from "/js/Utility/PromiseHelper.js";

export class SchedulerOld01
{
  constructor()
  {
    this.reads = [];
    this.writes = [];
    this.scheduled = false;
    this.run = this.Run.bind(this);
  }

  Clear()
  {
    this.reads = [];
    this.writes = [];
    this.scheduled = false;
  }

  Schedule()
  {
    if (this.scheduled !== true)
    {
      this.scheduled = true;
      window.requestAnimationFrame(this.run);
    }
  }

  Read(cb)
  {
    this.reads.push(cb);
    this.Schedule();

    return cb;
  }

  Write(cb)
  {
    this.writes.push(cb);
    this.Schedule();

    return cb;
  }

  RunEach(name)
  {
    const callbacks = this[name];
    for (let i = 0; i < callbacks.length; i++)
    {
      callbacks[i]();
    }

    // Reset it
    this[name] = [];
  }

  Run()
  {
    this.scheduled = false;

    this.RunEach("reads");
    this.RunEach("writes");
  }
}

export class SchedulerOld02
{
  constructor()
  {
    // this.reads = [];
    // this.writes = [];
    // this.resolvers = [];
    this.scheduled = false;
    this.tags = new Set();
    this.run = this.Run.bind(this);
  }

  Schedule()
  {
    if (this.scheduled !== true)
    {
      this.scheduled = true;
      window.requestAnimationFrame(this.run);
    }
  }

  GetReads()
  {
    return this.reads || (this.reads = new Promise(resolve =>
    {
      window.requestAnimationFrame(() =>
      {
        resolve();
        this.reads = undefined;
      });
    }));
  }

  GetWrites()
  {
    return this.writes || (this.writes = new Promise(resolve =>
    {
      window.requestAnimationFrame(() =>
      {
        resolve();
        this.writes = undefined;
      });
    }));
  }

  GetReads(){ return this.reads || (this.reads = new PromiseHelper()); }
  GetWrites(){ return this.writes || (this.writes = new PromiseHelper()); }

  Read(tag, cb)
  {
    this.tags.add(tag);
    this.Schedule();

    return this.GetReads().then(cb);
  }

  Write(tag, cb)
  {
    this.tags.add(tag);
    this.Schedule();

    return this.GetWrites().then(cb);
  }

  Run()
  {
    const {reads, writes, tags} = this;

    this.scheduled = false;
    this.tags = new Set(); // Reset this
    this.reads = undefined;
    this.writes = undefined;

    if (reads) reads.Resolve();
    if (writes) writes.Resolve();

    tags.forEach(tag =>
    {
      tag.Reflow();
    });
  }
}

export class Scheduler
{
  constructor()
  {
    this.scheduled = false;
  }

  Schedule()
  {
    if (this.scheduled === true) return;

    this.scheduled = true;
    this.tags = new Set();
    this.reads = new PromiseHelper();
    this.writes = new PromiseHelper();

    window.requestAnimationFrame(() =>
    {
      const {reads, writes, tags} = this;

      this.scheduled = false;

      // Reads should happen first, because writes would force reads to recalculate
      reads.Resolve();
      writes.Resolve();

      tags.forEach(tag => tag.Reflow());
    });
  }

  Read(tag, cb)
  {
    this.Schedule();

    this.tags.add(tag);
    return this.reads.then(cb);
  }

  Write(tag, cb)
  {
    this.Schedule();

    this.tags.add(tag);
    return this.writes.then(cb);
  }
}

// Singleton
export const SCHEDULER = new Scheduler();

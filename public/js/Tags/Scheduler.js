import {Tag} from "/js/Tag.js";

export class Scheduler extends Tag
{
  constructor(node)
  {
    super(node).Id("scheduler");
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

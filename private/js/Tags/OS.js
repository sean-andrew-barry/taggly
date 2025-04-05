import os from "os";

import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Environment} from "/js/Environment.js";

export class OS extends Singleton
{
  constructor(...args)
  {
    super(...args).Add(
      this.Render(),
    );
  }

  GetInterfaces(){ return this.ifaces = os.networkInterfaces(); }

  LoadIPs()
  {
    this.ifaces = os.networkInterfaces();
    this.ips = [];
    this.keys = Object.keys(this.ifaces);

    for (let i = 0; i < this.keys.length; i++)
    {
      const key = this.keys[i];
      const ifaces = this.ifaces[key];

      let alias = 0;
      for (let j = 0; j < ifaces.length; j++)
      {
        const iface = ifaces[j];

        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if ("IPv4" !== iface.family || iface.internal !== false) continue;

        this.ips.push(iface.address);

        ++alias;
      }
    }
  }

  async Render()
  {
    const old = Environment.GetCached("os");
    const config = await Tag.Config().Wait();

    if (await config.UseOS())
    {
      // console.log("Initializing OS");
      this.LoadIPs();

      this.start_usage = this.GetUsage();
      this.start_time = Date.now();
      this.prev_time = this.start_time;

      if (old)
      {
        this.startTime  = old.startTime;
        this.startUsage = old.startUsage;

        if (old.interval_id)
        {
          clearInterval(old.interval_id);
        }
      }
      else
      {
        this.startTime  = process.hrtime();
        this.startUsage = process.cpuUsage();
      }

      // this.interval_id = setInterval(() =>
      // {
      //   this.GetUsagePercent();
      //   // console.log("CPU:", this.GetUsagePercent());
      // }, 1000);
    }

    Environment.SetCached("os", this);
    return super.Render();
  }

  TrackCPU()
  {
    this.interval_id = setInterval(() =>
    {
      this.GetUsagePercent();
      // console.log("CPU:", this.GetUsagePercent());
    }, 1000);
  }

  // Test if an IP address is one of the current hosted IPs
  HasIP(...ips)
  {
    for (let i = 0; i < ips.length; i++)
    {
      const ip = ips[i];

      for (let j = 0; j < this.ips.length; j++)
      {
        if (ip === this.ips[j]) return true;
      }
    }

    return false;
  }

  GetUsage(prev_usage = this.prev_usage)
  {
    const usage = process.cpuUsage(prev_usage);
    this.prev_usage = usage;
    return usage;
  }

  GetUsage(prev_usage = this.start_usage)
  {
    const usage = process.cpuUsage(prev_usage);
    this.prev_usage = usage;
    return usage;
  }

  GetUsagePercent()
  {
    // const time = Date.now();
    const result = this.GetUsage();

    const percent = 100 * (result.user + result.system) / ((Date.now() - this.start_time) * 1000);
    this.prev_time = Date.now();

    return percent;
  }

  secNSec2ms(secNSec)
  {
    return secNSec[0] * 1000 + secNSec[1] / 1000000
  }

  GetUsagePercent()
  {
    // spin the CPU for 500 milliseconds
    var now = Date.now();
    // while (Date.now() - now < 50);

    var elapTime = process.hrtime(this.startTime);
    var {user, system} = process.cpuUsage(this.startUsage);

    var elapTimeMS = elapTime[1] / 1000;
    var elapUserMS = user / 1000;
    var elapSystMS = system / 1000;

    // var elapTimeMS = this.secNSec2ms(elapTime)
    // var elapUserMS = this.secNSec2ms(elapUsage.user)
    // var elapSystMS = this.secNSec2ms(elapUsage.system)
    var cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS)

    console.log('elapsed time ms:  ', elapTimeMS)
    console.log('elapsed user ms:  ', elapUserMS)
    console.log('elapsed system ms:', elapSystMS)
    console.log('cpu percent:      ', cpuPercent)
  }

  GetTotalMemory(){ os.totalmem(); }
  GetFreeMemory(){ os.freemem(); }
  GetCPUs(){ return os.cpus(); }
}

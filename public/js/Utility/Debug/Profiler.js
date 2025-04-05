export class Profile
{
  constructor(name, fn)
  {
    this.name = name;
    this.fn = fn;
    this.time = 0.0;
    this.iterations = 0;
    this.samples = [];
  }

  Run(count, args)
  {
    const start = Date.now();
    for (let i = 0; i < count; i++)
    {
      // this.fn();
      this.fn.apply(this, args);
    }
    const time = Date.now() - start;

    this.time += time;
    this.samples.push(time);
    this.iterations += count;

    return time;
  }

  Max()
  {
    let max = 0;
    for (let i = 0; i < this.samples.length; i++)
    {
      max = Math.max(max, this.samples[i]);
    }

    return max;
  }

  Min()
  {
    let min = 0;
    for (let i = 0; i < this.samples.length; i++)
    {
      min = Math.min(min, this.samples[i]);
    }

    return min;
  }

  Sum()
  {
    let sum = 0.0;
    for (let i = 0; i < this.samples.length; i++)
    {
      sum += this.samples[i];
    }

    return sum;
  }

  Mean()
  {
    return this.Sum() / this.samples.length;
  }

  Median()
  {
    this.samples.sort((a, b) => a - b);

    let median = 0;
    if ((this.samples.length % 2) == 1)
    {
      median = this.samples[(this.samples.length + 1) / 2 - 1];
    }
    else
    {
      median = (1 * this.samples[this.samples.length / 2 - 1] + 1 * this.samples[this.samples.length / 2]) / 2;
    }

    return median
  }

  Variance()
  {
    let sum = 0;
    let mean = this.Mean();

    for (let i = 0; i < this.samples.length; i++)
    {
      sum += (this.samples[i] - mean) * (this.samples[i] - mean);
    }

    console.log("~~Variance", sum);

    return (sum / (this.samples.length - 1));
  }

  StandardDeviation(){ return Math.sqrt(this.Variance()); }
  StandardError(){ return Math.sqrt(this.Variance() / (this.samples.length - 1)); }
  Percent(total){ return this.time / total * 100; }

  GetPercent(total)
  {
    return (this.time / total * 100).toPrecision(3);
  }

  Per()
  {
    // Return time per as nanoseconds
    return (this.time / this.iterations) * 1000.0 * 1000.0;
    // return (this.time / this.iterations)
  }
}

export class Profiler
{
  constructor({
    name,
    iterations,
    sample_size = 1000,
    timeout = 10000,
    args = [],
    ...tests
  })
  {
    this.name = name;
    this.iterations = iterations;
    this.sample_size = sample_size;
    this.timeout = timeout;
    this.samples = Math.ceil(Math.max(iterations, sample_size) / sample_size);
    this.start = Date.now();
    this.timeout = this.start + timeout;
    this.profiles = [];
    this.args = args;

    for (const key in tests)
    {
      const fn = tests[key];
      if (tests.hasOwnProperty(key) && (typeof(fn) === "function"))
      {
        this.profiles.push(new Profile(key, fn));
      }
    }

    return this.Run();
  }

  shuffle(a)
	{
		let j, x, i;

		for (i = a.length - 1; i > 0; i--)
		{
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}

		return a;
	}

  commas(num, precision)
	{
    if (precision && typeof(num) === "number")
    {
      num = num.toPrecision(precision);
    }

		const parts = num.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

  Sleep(ms)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  Profile()
  {
    return new Promise((resolve, reject) =>
    {
      this.time = 0;
      this.total = 0;
      let remaining = this.iterations;
      let samples = this.samples;
      const sample = Math.round(this.iterations / this.samples);
      // let samples = Math.ceil(this.samples / remaining);

      const Tick = () =>
      {
        if (Date.now() >= this.timeout)
        {
          console.error(`Profiler timed out after ${Date.now() - this.start}ms`);
          return resolve(false);
        }

        this.shuffle(this.profiles);

        for (let i = 0; i < this.profiles.length; i++)
        {
          this.time += this.profiles[i].Run(sample);
        }

        remaining -= sample;
        this.total += sample;

        if (--samples > 0) return process.nextTick(Tick);
        else return resolve(true);
      };

      process.nextTick(Tick);
    });
  }

  async Profile()
  {
    this.time = 0;
    this.total = 0;
    let remaining = this.iterations;
    let samples = this.samples;
    const sample = Math.round(this.iterations / this.samples);
    // let samples = Math.ceil(this.samples / remaining);

    while (true)
    {
      if (Date.now() >= this.timeout)
      {
        console.error(`Profiler timed out after ${Date.now() - this.start}ms`);
        return false;
      }

      this.shuffle(this.profiles);

      for (let i = 0; i < this.profiles.length; i++)
      {
        this.time += this.profiles[i].Run(sample, this.args);
      }

      remaining -= sample;
      this.total += sample;

      if (--samples > 0) await this.Sleep(1);
      else return true;
    }
  }

  Format()
  {
    // NOTE: Must be global, not window, because jsdom doesn't have full Intl support
    const f = new global.Intl.NumberFormat();
    // const formatter.format(value);

    let lines = [];
    // lines.push(`~~ Total iterations: ${this.commas(this.total)}`);
    // lines.push(`~~ Total time:       ${this.commas(this.time, 5)}ms`);
    lines.push(`~~ Total iterations: ${f.format(this.total)}`);
    lines.push(`~~ Total time:       ${f.format(this.time)}ms`);
    // lines.push(`~~ Iterations per:   ${this.commas(this.samples * this.iterations)}`);

		this.profiles.sort((a, b) => a.time - b.time);
		for (let i = 0; i < this.profiles.length; i++)
		{
			const profile = this.profiles[i];
			const {name, time, samples} = profile;
			// const ns = ((time / this.iterations) * 1000.0 * 1000.0).toPrecision(3);

      // lines.push(`~~ [${i + 1}] ${name}: ${this.commas(time.toPrecision(3))}ms, ${this.commas(ns)}ns per, ${this.commas(average.toPrecision(3))}ms average`);
      // , ${profile.Median().toPrecision(3)} median
      lines.push(`~~ [${i + 1}] ${name}: ${f.format(profile.Per())}ns per, ${f.format(time / this.time * 100)}%`);
      // lines.push(`~~ [${i + 1}] ${name}: ${this.commas(profile.Per(), 5)}ns per, ${(time / this.time * 100).toPrecision(3)}%, ${profile.Variance().toPrecision(3)} variance`);

      // lines.push(`~~ [${i + 1}] ${name}: ${this.commas(time.toPrecision(3))}ms, ${this.commas(ns)}ns per, ${(time / this.time * 100).toPrecision(3)}%`);
		}

    let longest = 0;
    for (let i = 0; i < lines.length; i++)
    {
      if (lines[i].length > longest) longest = lines[i].length;
    }

    // Round up to nearest even number?
    longest = Math.round(longest / 2.0) * 2.0;

    // longest += 3;
    // for (let i = 0; i < lines.length; i++)
    // {
    //   lines[i] += " " + "~".repeat(longest - lines[i].length - 1);
    // }

    let title;
    if (this.name) title = ` Profile ${this.name} Complete `;
    else           title = ` Profile Complete `;

    const padding = "~".repeat(Math.round((longest - title.length) / 2.0));
    lines.unshift(`${padding}${title}${padding}`);
    lines.push("~".repeat(lines[0].length));

    return lines.join("\n");
  }

  Run()
  {
    return this.Profile().then(result =>
    {
      if (result)
      {
        console.log(this.Format());
      }

      return this;
    });
  }
}

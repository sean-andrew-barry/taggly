import {Tag} from "/js/Tag.js";

const STYLE = Symbol("style");

export class Profile extends Tag
{
  constructor(name)
  {
    super();

    if (name)
    {
      this.Name(name);
    }

    this.time = 0.0;
    this.iterations = 0;
    this.samples = [];

    this.Add(
      this.name_tag ??= new Header2().Text(name),
      new Paragraph().Add(
        new Span().Text("Total time: "),
        this.total_time_tag ??= new Number(0),
      ),
      new Paragraph().Add(
        new Span().Text("Nanoseconds per: "),
        this.nanoseconds_per_tag ??= new Number(0),
      ),
      new Paragraph().Add(
        new Span().Text("Percent: "),
        this.percent_tag ??= new Number(0),
        // new Span().Text("%"),
      ),
    );
  }

  RenderProgress()
  {

  }

  Test(fn, ...args)
  {
    this.fn = fn;
    this.args = args;

    return this;
  }

  Tick(count)
  {
    const start = Date.now();

    for (let i = 0; i < count; i++)
    {
      this.fn.apply(this, this.args);
    }

    const elapsed = Date.now() - start;

    this.time += elapsed;
    this.iterations += count;
    this.samples.push(elapsed);

    return elapsed;
  }

  Render(time)
  {
    // lines.push(`~~ [${i + 1}] ${name}: ${f.format(profile.Per())}ns per, ${f.format(time / this.time * 100)}%`);

    this.name_tag.Text(this.name);
    // this.total_time_tag.Value();
    this.nanoseconds_per_tag.Value(this.GetNanosecondsPer());
    this.percent_tag.Percent(time / this.time * 100);
  }

  // Return time per as nanoseconds
  GetNanosecondsPer(){ return (this.time / this.iterations) * 1000.0 * 1000.0; }
}

export class Profiler extends Tag
{
  constructor(...args)
  {
    super(...args).Add(
      this.constructor[STYLE] ??= new Style().Add(

      ),

      new Paragraph().Add(
        new Span().Text("Iterations: "),
        this.iterations_tag = new Number(0),
      ),
      new Paragraph().Add(
        new Span().Text("Total time: "),
        this.time_tag = new Number(0),
      ),
    );
  }

  Iterations(iterations){ return this.SetAttribute("iterations", iterations); }
  Timeout(timeout){ return this.SetAttribute("timeout", timeout); }
  Samples(samples){ return this.SetAttribute("samples", samples); }

  GetIterations(){ return this.GetAttributeNumber("iterations"); }
  GetTimeout(){ return this.GetAttributeNumber("timeout"); }
  GetSamples(){ return this.GetAttributeNumber("samples"); }
  GetProfiles(){ return this.QueryAll("profile"); }

  Cycle()
  {
  }

  Shuffle(array)
	{
		for (let i = array.length - 1; i > 0; i--)
		{
			const j = Math.floor(Math.random() * (i + 1));
			const x = array[i];

			array[i] = array[j];
			array[j] = x;
		}

		return array;
	}

  Sleep(ms)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async Run()
  {
    let time = 0;
    let total = 0;
    let iterations = this.GetIterations();
    let remaining = iterations;
    let samples = this.GetSamples();
    const timeout = this.GetTimeout();
    const start = Date.now();
    const sample = Math.round(iterations / samples);
    const profiles = this.GetProfiles();

    while (true)
    {
      // Make sure the test doesn't take longer than `timeout` milliseconds in total
      if (Date.now() >= timeout)
      {
        console.error(`Profiler timed out after ${Date.now() - this.start}ms`);
        return false;
      }

      // Shuffle the order of the profiles so that it isn't biased by execution order
      this.Shuffle(profiles);

      // Run each profile for `sample` times
      for (let i = 0; i < profiles.length; i++)
      {
        time += profiles[i].Tick(sample);
      }

      remaining -= sample;
      total += sample;

      if (--samples > 0) await this.Sleep(1);
      else return true;
    }
  }
}

Body.Get().Add(
  new Profiler().Add(
    new Profile().Name("Test 1").Test(() => document.createElement("div")),
    new Profile().Name("Test 2").Test(() => document.createTextNode("text")),
  ),
);

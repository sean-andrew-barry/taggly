export class Console
{
  constructor(console = global.console || window.console)
  {
    this.console = console;
    this.Activate();
  }

  Activate()
  {
    global.console = this;
    window.console = this;
    return this;
  }

  Deactivate()
  {
    global.console = this.console;
    window.console = this.console;
    return this;
  }

  Apply(name, args)
  {
    return this.console[name].apply(this.console, args);
  }

  assert(...args){ return this.Apply("assert", args); }
  clear(...args){ return this.Apply("clear", args); }
  count(...args){ return this.Apply("count", args); }
  countReset(...args){ return this.Apply("countReset", args); }
  debug(...args){ return this.Apply("debug", args); }
  dir(...args){ return this.Apply("dir", args); }
  dirxml(...args){ return this.Apply("dirxml", args); }
  error(...args){ return this.Apply("error", args); }
  group(...args){ return this.Apply("group", args); }
  groupCollapsed(...args){ return this.Apply("groupCollapsed", args); }
  groupEnd(...args){ return this.Apply("groupEnd", args); }
  info(...args){ return this.Apply("info", args); }
  log(...args){ return this.Apply("log", args); }
  table(...args){ return this.Apply("table", args); }
  time(...args){ return this.Apply("time", args); }
  timeEnd(...args){ return this.Apply("timeEnd", args); }
  trace(...args){ return this.Apply("trace", args); }
  warn(...args){ return this.Apply("warn", args); }
}

import "/flag#static";

/*
NOTE: Much of the following code is adapted from the error-stack-parser library
It can be found at: https://github.com/stacktracejs/error-stack-parser
I simply made some minor tweaks and adjusted it into the programming style of this framework

Thank you!

---------

Copyright (c) 2017 Eric Wendelin and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

// Separate line and column numbers from a string of the form: (URI:Line:Column)
function ExtractLocation(url_like)
{
  // Fail-fast but return locations like "(native)"
  if (url_like.indexOf(":") === -1)
  {
    return [url_like];
  }

  const reg_exp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  const parts = reg_exp.exec(url_like.replace(/[()]/g, ""));

  return [parts[1], parts[2] || undefined, parts[3] || undefined];
}

export function ParseV8OrIE(error)
{
  const extra = [];
  const filtered = error.stack.split("\n").filter(line =>
  {
    if (!!line.match(CHROME_IE_STACK_REGEXP))
    {
      return true;
    }
    else
    {
      if (!line.startsWith(error.name) && !line.includes(error.message))
      {
        extra.push(line);
      }

      return false;
    }
  });

  return filtered.map(line =>
  {
    if (line.indexOf("(eval ") > -1)
    {
      // Throw away eval information until we implement stacktrace.js/stackframe#8
      line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(\),.*$)/g, "");
    }

    let sanitized_line = line.replace(/^\s+/, "").replace(/\(eval code/g, "(");

    // capture and preserve the parenthesized location "(/foo/my bar.js:12:87)" in
    // case it has spaces in it, as the string is split on \s+ later on
    const location = sanitized_line.match(/ (\((.+):(\d+):(\d+)\)$)/);

    // remove the parenthesized location from the line, if it was matched
    sanitized_line = location ? sanitized_line.replace(location[0], '') : sanitized_line;

    const tokens = sanitized_line.split(/\s+/).slice(1);

    // if a location was matched, pass it to ExtractLocation() otherwise pop the last token
    const location_parts = ExtractLocation(location ? location[1] : tokens.pop());
    const name = tokens.join(" ") || undefined;
    const file = ["eval", "<anonymous>"].indexOf(location_parts[0]) > -1 ? undefined : location_parts[0];

    return {
      extra,
      name,
      file,
      line: Number(location_parts[1]),
      column: Number(location_parts[2]),
      source: line,
    };
  });
}

export function ParseFFOrSafari(error)
{
  const filtered = error.stack.split("\n").filter(line =>
  {
    return !line.match(SAFARI_NATIVE_CODE_REGEXP);
  });

  return filtered.map(line =>
  {
    // Throw away eval information until we implement stacktrace.js/stackframe#8
    if (line.indexOf(" > eval") > -1)
    {
      line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
    }

    if (line.indexOf("@") === -1 && line.indexOf(":") === -1)
    {
      // Safari eval frames only have function names and nothing else
      return {
        name: line,
      };
    }
    else
    {
      const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
      const matches = line.match(functionNameRegex);
      const name = matches && matches[1] ? matches[1] : undefined;
      const location_parts = ExtractLocation(line.replace(functionNameRegex, ''));

      return {
        name,
        file: location_parts[0],
        line: location_parts[1],
        column: location_parts[2],
        source: line,
      };
    }
  });
}

export function ParseOpera9(error)
{
  const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
  const lines = error.message.split("\n");
  const result = [];

  for (let i = 2, len = lines.length; i < len; i += 2)
  {
    const match = lineRE.exec(lines[i]);

    if (match)
    {
      result.push({
        file: match[2],
        line: match[1],
        source: lines[i],
      });
    }
  }

  return result;
}

export function ParseOpera10(error)
{
  const filtered = error.stack.split("\n").filter(line =>
  {
    return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
  });

  return filtered.map(line =>
  {
    const tokens = line.split("@");
    const location_parts = ExtractLocation(tokens.pop());
    const function_call = (tokens.shift() || "");
    const name = function_call.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || undefined;

    let args_raw;
    if (function_call.match(/\(([^)]*)\)/))
    {
      args_raw = function_call.replace(/^[^(]+\(([^)]*)\)$/, "$1");
    }

    const args = (args_raw === undefined || args_raw === "[arguments not available]") ? undefined : args_raw.split(",");

    return {
      name,
      args,
      file: location_parts[0],
      line: location_parts[1],
      column: location_parts[2],
      source: line,
    };
  });
}

export function ParseOpera(error)
{
  if (!error.stacktrace || (error.message.indexOf("\n") > -1 && error.message.split("\n").length > error.stacktrace.split("\n").length))
  {
    return ParseOpera9(error);
  }
  else if (!error.stack)
  {
    return ParseOpera10(error);
  }
  else
  {
    return ParseOpera11(error);
  }
}

export function ErrorParser(error)
{
  if (error.hasOwnProperty("stacktrace") || error.hasOwnProperty("opera#sourceloc"))
  {
    return ParseOpera(error);
  }
  else if (error.hasOwnProperty("stack") && error.stack.match(CHROME_IE_STACK_REGEXP))
  {
    return ParseV8OrIE(error);
  }
  else if (error.stack)
  {
    return ParseFFOrSafari(error);
  }
  else
  {
    return undefined;
  }
}

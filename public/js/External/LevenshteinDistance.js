/*
This function comes from github user: https://gist.github.com/kigiri
It can be found at: https://gist.github.com/andrei-m/982927#gistcomment-1931258

Kigiri's version does not include a license, but it is written and shared as an
optimization of a function by github user: https://gist.github.com/andrei-m
Which can be found at: https://gist.github.com/andrei-m/982927#file-levenshtein-js

Because of this I assume that Andrei's MIT licence still applies to Kigiri's
version, which I have included below.

Thank you everyone that contributed to that thread!

-----------

MIT License

Copyright (c) 2011 Andrei Mackenzie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

export function LevenshteinDistance(a, b)
{
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length)
  {
    let temp = a;
    a = b;
    b = temp;
  }

  const row = Array(a.length + 1);

  // Initialize the row
  for (let i = 0; i <= a.length; i++)
  {
    row[i] = i;
  }

  // Fill in the rest
  for (let i = 1; i <= b.length; i++)
  {
    let prev = i;
    for (let j = 1; j <= a.length; j++)
    {
      let val;
      if (b[i - 1] === a[j - 1])
      {
        val = row[j - 1]; // Match
      }
      else
      {
        val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
      }

      row[j - 1] = prev;
      prev = val;
    }

    row[a.length] = prev;
  }

  return row[a.length];
}

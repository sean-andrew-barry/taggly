import "/flag#static";

/*
This function comes from github user: https://github.com/aceakash
It can be found at: https://github.com/aceakash/string-similarity

Thank you!

-----------

MIT License

Copyright (c) 2018 Akash Kurdekar

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

export function DiceCoefficient(first, second)
{
  first = first.replace(/\s+/g, "");
  second = second.replace(/\s+/g, "");

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

  let first_bigrams = new Map();
  for (let i = 0; i < first.length - 1; i++)
  {
    const bigram = first.substring(i, i + 2);
    const count = first_bigrams.has(bigram) ? first_bigrams.get(bigram) + 1 : 1;

    first_bigrams.set(bigram, count);
  };

  let intersection_size = 0;
  for (let i = 0; i < second.length - 1; i++)
  {
    const bigram = second.substring(i, i + 2);
    const count = first_bigrams.has(bigram) ? first_bigrams.get(bigram) : 0;

    if (count > 0)
    {
      first_bigrams.set(bigram, count - 1);
      intersection_size++;
    }
  }

  return (2.0 * intersection_size) / (first.length + second.length - 2);
}

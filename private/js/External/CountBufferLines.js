  // NOTE: Credit to SO user Emil Vikström at https://stackoverflow.com/a/41439945
  // for this handly bit of code
  // Thank you!
  export function CountBufferLines(buffer)
  {
    let index = -1;
    let line_count = -1;

    do
    {
      index = buffer.indexOf(10, index + 1);
      line_count++;
    }
    while (index !== -1);

    return line_count;
  }
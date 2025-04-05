// NOTE: Credit for this function goes to:
// https://stackoverflow.com/a/9458996
// Thank you!
export function ToBase64(buffer)
{
  const bytes = new Uint8Array(buffer);
  const length = bytes.byteLength;

  let binary = "";
  for (let i = 0; i < length; i++)
  {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}

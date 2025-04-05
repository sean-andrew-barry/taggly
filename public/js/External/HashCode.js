// NOTE: Credit for this function to:
// https://stackoverflow.com/a/7616484
// who got it from:
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// Thank you!
export function HashCode(string)
{
  if (string.length === 0) return 0;

  let hash = 0;
  for (let i = 0; i < string.length; i++)
  {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

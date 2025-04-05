// NOTE: Credit for this function goes to:
// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-123.php
// Thank you!
export function ToSlug(string, cache)
{
  if (string.length === 0) return string;

  return cache[string] ??= string
  .replace(/\'/g, "")
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map(x => x.toLowerCase())
  .join("-");
}

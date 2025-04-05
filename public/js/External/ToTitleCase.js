// NOTE: Credit for this function goes to:
// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-123.php
// Thank you!

export function ToTitleCase(string, cache)
{
  return cache[string] ??= string.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).join(" ");
}

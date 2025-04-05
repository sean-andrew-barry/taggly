import {Shuffle} from "/js/Utility/Array.js";
import {RandomInt} from "/js/Utility/Random.js";

export function QueryRandom(selector, root = window.document)
{
  const elements = root.querySelectorAll(selector);
  if (elements.length === 0) return undefined;

  const index = RandomInt(0, elements.length);
  const {tag} = elements[index];

  if (tag) return tag;
  else console.warn(selector, `randomly queried element`, index, elements[index], "does not have a tag");
}

export function QueryAllRandom(selector, limit, root = window.document)
{
  const tags = this.QueryAll(selector, limit, root);
  const array = Shuffle(tags);

  return array;
}

export function QueryEachRandom(selector, limit, callback, root = window.document)
{
  if (typeof(limit) === "function")
  {
    callback = limit;
    limit = undefined;
  }

  const elements = this.QueryAllRandom(selector, root, limit);

  for (let i = 0; i < elements.length; i++)
  {
    const {tag} = elements[i];
    if (tag) callback(tag);
    else console.warn(selector, `queried element`, i, elements[i], "does not have a tag");
  }
}

import {Styles} from "/js/Tag/Styles.js";
import Freeze from "/js/Utility/Freeze.js";

const QUERY_SYMBOL_CACHE = {};

const USE_DEFAULT_NODE = Symbol("use_default_node");

export class Queries extends Styles
{
  static ConvertNodesToTagArray(nodes, selector)
  {
    const tags = [];
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      if (node?.tag) tags.push(node.tag);
      else if (selector) this.WarnQueryHasNoTag(selector, node);
    }

    return tags;
  }

  static GetDefaultQueryNode(){ return window.document; }

  static QuerySelectorHelper(selector, node = this.GetDefaultQueryNode())
  {
    if (typeof(selector) === "symbol")
    {
      if (QUERY_SYMBOL_CACHE.hasOwnProperty(selector))
      {
        return QUERY_SYMBOL_CACHE[selector];
      }
      else
      {
        return QUERY_SYMBOL_CACHE[selector] = node.querySelector(selector.description);
      }
    }

    return node.querySelector(selector);
  }

  static QuerySelectorAllHelper(selector, node = this.GetDefaultQueryNode())
  {
    if (typeof(selector) === "symbol")
    {
      if (QUERY_SYMBOL_CACHE.hasOwnProperty(selector))
      {
        return QUERY_SYMBOL_CACHE[selector];
      }
      else
      {
        return QUERY_SYMBOL_CACHE[selector] = node.querySelectorAll(selector.description);
      }
    }

    return node.querySelectorAll(selector);
  }

  static WarnQueryHasNoTag(selector, element)
  {
    console.warn(`Selector "${selector}" matched an element that does not have a tag`, element);
  }

  static Query(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`Query must be given a node to query`);

    const element = this.QuerySelectorHelper(selector, node);
    if (element)
    {
      return element?.tag ?? this.WarnQueryHasNoTag(selector, element);
    }
  }

  static QueryAll(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryAll must be given a node to query`);

    const elements = this.QuerySelectorAllHelper(selector, node);
    return this.ConvertNodesToTagArray(elements, selector);
  }

  static QuerySort(selector, sorter, node = this.GetDefaultQueryNode(), sorted)
  {
    if (!node) throw new Error(`QuerySort must be given a node to query`);

    const unsorted = this.QueryAll(selector, node);
    sorted ??= unsorted.slice().sort(sorter);

    for (let i = 0; i < unsorted.length; i++)
    {
      const a = unsorted[i];
      const b = sorted[i];

      if (a !== b)
      {
        a.Swap(b);
        return this.QuerySort(selector, sorter, node, sorted);
      }
    }
  }

  static QueryEach(selector, callback, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryEach must be given a node to query`);

    const tags = this.QueryAll(selector, node);
    tags.forEach(callback);
    // for (let i = 0; i < tags.length; i++)
    // {
    //   callback(tags[i]);
    // }
  }

  static QueryDeepest(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryDeepest must be given a node to query`);

    const children = node.children;
    if (!children) return;

    for (let i = 0; i < children.length; i++)
    {
      const child = children[i];
      if (child && child.tag)
      {
        // Found a match
        if (child.tag.IsMatch(selector))
        {
          // Check if any of its children are better matches
          const result = this.QueryDeepest(selector, child);

          if (result) return result; // Found a deeper match, return it
          else return child; // Return the original match
        }
        else
        {
          // No match yet, so recursively search its children
          return this.QueryDeepest(selector, child);
        }
      }
    }
  }

  static QueryLast(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryLast must be given a node to query`);

    const children = node.children;
    if (!children) return;

    for (let i = children.length - 1; i >= 0; i--)
    {
      const child = children[i];
      if (child && child.tag)
      {
        if (child.tag.IsMatch(selector)) return child; // Found a match, return it
        else return this.QueryDeepest(selector, child);
      }
    }
  }

  static QueryClosest(selector, node = this.GetDefaultQueryNode())
  {
    if (!node) throw new Error(`QueryClosest must be given a node to query`);
    return node.closest(selector)?.tag;
  }

  static QueryPoint(x, y, node = this.GetDefaultQueryNode())
  {
    return window.document.elementFromPoint(x, y)?.tag;
  }

  static QueryAdd(selector, ...args)
  {
    const node = this.GetDefaultQueryNode();
    const target = this.Query(selector, node);

    if (target) target.Add(...args);
    else throw new Error(`Tag ${this.GetLocalName()} failed to query a tag matching "${selector}"`);

    return this;
  }

  static FindByID(id)
  {
    const element = window.document.getElementById(id);
    if (element) return element?.tag ?? this.WarnQueryHasNoTag(`#${id}`, element);
  }

  static GetByID(id)
  {
    const tag = this.FindByID(id);

    if (tag) return tag;
    else throw new Error(`Failed to find a tag for id "${id}"`);
  }

  // Each of these have a ?? null fallback because they should not fall back to the static GetDefaultQueryNode function
  // Instead they should error, since the query was *suppose* to be limited in its scope
  QuerySort(selector, sorter){ return this.constructor.QuerySort(selector, sorter, this.GetNode() ?? null); }
  QueryEach(selector, callback){ return this.constructor.QueryEach(selector, callback, this.GetNode() ?? null); }
  QueryDeepest(selector){ return this.constructor.QueryDeepest(selector, this.GetNode() ?? null); }
  QueryLast(selector){ return this.constructor.QueryLast(selector, this.GetNode() ?? null); }

  QueryScope(selector)
  {
    const prev = this.GetPrevSibling();
    if (prev)
    {
      if (prev.IsMatch(selector)) return prev;

      const result = prev.Query(selector);
      if (result) return result;

      return prev.QueryScope(selector);
    }
    else
    {
      // If it's a parent, we don't perform a query on its children,
      // that only happens with older siblings
      const parent = this.GetParent();

      if (!parent) return null;
      else if (parent.IsMatch(selector)) return parent;
      else return parent.QueryScope(selector);
    }
  }

  // QueryAncestor(selector){ return this.GetParent()?.QueryClosest(selector); }

  // TODO: Possibly make this an OnMutation instead of OnConnect?
  // Or maybe just depreciate it entirely?
  QueryAsync(selector)
  {
    const tag = this.Query(selector);
    if (tag) return tag;

    return new Promise((resolve, reject) =>
    {
      this.OnConnect(event =>
      {
        if (event.tag.IsMatch(selector))
        {
          this.RemoveEventListener(event);
          return resolve(event.tag);
        }
      }, { capture: true });
    });
  }
}

Freeze(Queries);

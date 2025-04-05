import {window} from "/js/Window.js";
import {Observer} from "/js/Observer.js";
import {Tag} from "/js/Tag.js";
import * as Tags from "/js/Tags.js";

Tag.SetTagsModule(Tags);

import {Mutation} from "/js/Event/Mutation.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";
import {Moved} from "/js/Event/Moved.js";
import {Attribute} from "/js/Event/Attribute.js";
import {Render} from "/js/Event/Render.js";
import {CharacterData} from "/js/Event/CharacterData.js";

const RENDERED = new WeakSet();

export class MutationObserver extends Observer
{
  GetObserverClass()
  {
    const WindowMutationObserver = window.MutationObserver;
    if (!WindowMutationObserver)
    {
      throw new Error(`MutationObserver support is required for security`);
    }

    return WindowMutationObserver;
  }

  UseAttributes(){ return true; }
  UseChildList(){ return true; }
  UseSubtree(){ return true; }
  UseAttributeOldValue(){ return true; }
  UseCharacterData(){ return true; }
  UseCharacterDataOldValue(){ return true; }

  GetOptions()
  {
    return {
      attributes: this.UseAttributes(),
      childList: this.UseChildList(),
      subtree: this.UseSubtree(), // Omit or set to false to observe only changes to the parent node
      attributeOldValue: this.UseAttributeOldValue(),
      characterData: this.UseCharacterData(),
      characterDataOldValue: this.UseCharacterDataOldValue(),
    };
  }

  // GetIntersectionObserver(){ return this.GetTag().GetIntersectionObserver(); }
  // GetResizeObserver(){ return this.GetTag().GetResizeObserver(); }

  constructor(tag)
  {
    super(tag);

    const options = this.GetOptions();
    const observer_class = this.GetObserverClass();

    this.observer = new observer_class((mutations, observer) =>
    {
      try
      {
        // console.log(mutations);

        const added = new Set();
        const removed = new Set();
        const moved = new Set();

        this.OnMutation(mutations, observer, tag, added, removed, moved);
      }
      catch (error)
      {
        console.error(error);
        // console.log("Mutations that caused the error", mutations);
      }
    });

    this.Observe(tag, options);
  }

  destructor()
  {
    if (!this.observer)
    {
      console.warn("MutationObserver is destructing but it doesn't have an observer. Already destructed?", this.already_destructed);
    }
    else
    {
      this.observer.disconnect();
    }

    this.already_destructed = true;

    delete this.observer;
  }

  Observe(tag, options, viewed = new Set())
  {
    if (tag === this.GetTag())
    {
      // console.log("~~~MutationObserver observing...");
      this.observer.observe(tag.GetNode(), options);
    }

    const children = tag.GetChildNodes();
    for (let i = 0; i < children.length; i++)
    {
      const child = Tag.For(children[i]);
      if (child) this.Observe(child, options, viewed);
    }

    this.OnAddedNode(tag.GetNode(), viewed);

    return this;
  }

  UnknownNode(node)
  {
    // console.warn("MutationObserver failed to wrap node", node.localName || node.nodeName);
    console.warn("MutationObserver failed to wrap node", node.localName || node.nodeName);
  }

  Destroy(node)
  {
    if (node.tag)
    {
      node.tag.Destroy();
    }

    const children = node.childNodes;
    for (let i = 0; i < children.length; i++)
    {
      const child = children[i];

      // Skip past any doctype nodes, because they are confused for additional HTML tags
      if (child.nodeType === 10)
      {
        continue;
      }

      this.Destroy(child); // Destroy the node and its children
    }
  }

  OnMutation(mutations, observer, tag, added, removed, moved)
  {
    const moved_nodes = [];
    for (let i = 0; i < mutations.length; i++)
    {
      const mutation = mutations[i];

      if (mutation.type === "childList")
      {
        const removed_length = mutation.removedNodes?.length ?? 0;
        for (let j = 0; j < removed_length; j++)
        {
          const node = mutation.removedNodes[j];
          if (!moved.has(node))
          {
            moved.add(node);
          }
          else
          {
            removed.add(node);
            added.add(node);
            moved_nodes.push(node);
          }
        }

        const added_length = mutation.addedNodes?.length ?? 0;
        for (let j = 0; j < added_length; j++)
        {
          const node = mutation.addedNodes[j];
          if (!moved.has(node))
          {
            moved.add(node);
          }
          else
          {
            removed.add(node);
            added.add(node);
            moved_nodes.push(node);
          }
        }
      }
    }

    if (moved_nodes.length > 0)
    {
      for (let i = 0; i < moved_nodes.length; i++)
      {
        const node = moved_nodes[i];
        this.OnMovedNode(node, moved);
      }
    }

    for (let i = 0; i < mutations.length; i++)
    {
      const mutation = mutations[i];

      const target = mutation.target?.tag;
      if (target)
      {
        const event = Mutation.CreateEvent();
        event.mutation = mutation;
        event.observer = observer;

        new Mutation(target, event);
      }

      switch (mutation.type)
      {
        // Child node(s) have been added or removed
        case "childList":
        {
          if (mutation.removedNodes.length > 0)
          {
            this.OnRemovedNodes(mutation.removedNodes, removed, tag);
          }

          if (mutation.addedNodes.length > 0)
          {
            this.OnAddedNodes(mutation.addedNodes, added, tag);
          }

          break;
        }
        case "attributes":
        {
          this.OnAttribute(mutation.target, mutation.attributeName, mutation.oldValue, tag);
          break;
        }
        case "characterData":
        {
          this.OnCharacterData(mutation);
          break;
        }
        default:
        {
          console.warn("Unknown mutation", mutation.type);
        }
      }
    }

    // It's possible for running the mutations to generate new mutations with the same added/removed sets
    const records = observer.takeRecords();
    if (records.length > 0)
    {
      return this.OnMutation(records, observer, tag, added, removed, moved);
    }
  }

  // TODO: Maybe break up the Attribute event into different events,
  // like AttributeRemoved, AttributeAdded, AttributeUpdated
  OnAttribute(node, name, old_value)
  {
    const tag = Tag.For(node);

    if (tag)
    {
      // console.log("OnAttribute", node, name, old_value);
      // tag.ClearComputedStyle();
      const value = tag.GetAttribute(name);

      const event = Attribute.CreateEvent();

      event.attribute = name;
      event.value = {
        name,
        value,
        old: old_value,
      };

      if (old_value === null) // New attribute added
      {
        event.change = "new";
        // console.log("New attribute", name, value);
      }
      else if (value === null) // Removed attribute
      {
        event.change = "removed";
        // console.log("Removed attribute", name);
      }
      else if (value === old_value) // Unchanged
      {
        event.change = "unchanged";
        // console.log("Unchanged attribute", name, value);
      }
      else
      {
        event.change = "changed";
        // console.log("Changed attribute", name, "from", old_value, "to", value);
      }

      // if (name === "style" && event.change !== "unchanged")
      // {
      //   console.log("Style attribute changed", event);
      //   this.GetIntersectionObserver().TestRedraw(tag, {
      //     boundingClientRect: tag.GetBoundingClientRect(),
      //   });
      // }

      new Attribute(node.tag, event);
    }
  }

  OnCharacterData(mutation)
  {
    const target = mutation.target.parentNode;
    if (target && target.tag)
    {
      const event = CharacterData.CreateEvent();

      event.old_value = mutation.oldValue;
      event.new_value = mutation.target.nodeValue;

      new CharacterData(target.tag, event);
    }
  }

  OnAddedNodes(nodes, viewed)
  {
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      this.OnAddedNode(node, viewed);

      const children = node.childNodes;
      if (children && children.length > 0) this.OnAddedNodes(children, viewed);
    }
  }

  OnRemovedNodes(nodes, viewed)
  {
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      this.OnRemovedNode(node, viewed);

      const children = node.childNodes;
      if (children && children.length > 0) this.OnRemovedNodes(children, viewed);
    }
  }

  OnAddedNode(node, viewed)
  {
    if (viewed.has(node)) return;
    else viewed.add(node);

    // if (node.shadowRoot)
    // {
    //   console.warn("Node has a ShadowRoot, need to handle this probably", node);
    // }

    const tag = Tag.For(node);

    if (tag)
    {
      if (tag.IsElement() && tag.IsConnected())
      {
        const root = tag.GetRoot();

        root.GetIntersectionObserver().Observe(tag);
        root.GetResizeObserver().Observe(tag);
      }

      // It's possible for a tag to disconnect during its Connect event
      // In that case its root will not be a document
      this.OnConnect(tag);
    }

    return tag;
  }

  OnMovedNode(node, viewed)
  {
    if (viewed.has(node)) return;
    else viewed.add(node);

    const tag = Tag.For(node);
    if (tag) this.OnMoved(tag);

    return tag;
  }

  OnRemovedNode(node, viewed)
  {
    if (viewed.has(node)) return;
    else viewed.add(node);

    const tag = Tag.For(node);

    if (tag)
    {
      if (tag.IsElement() && tag.IsConnected())
      {
        const root = tag.GetRoot();

        root.GetIntersectionObserver().Unobserve(tag);
        root.GetResizeObserver().Unobserve(tag);
      }

      this.OnDisconnect(tag);
    }

    return tag;
  }

  OnStaticRender(tag)
  {
    // // If the tag's CSS function has been overridden
    // if (tag.constructor.CSS !== Tag.CSS)
    // {
    //   const css = tag.constructor.CSS();
    //   const style = this.GetTag().GetStyle();
    //   style.AppendChild(css);
    // }
  }

  OnRender(tag)
  {
    new Render(tag);
  }

  OnConnect(tag)
  {
    new Connect(tag);

    if (!RENDERED.has(tag))
    {
      RENDERED.add(tag);

      if (!RENDERED.has(tag.constructor))
      {
        RENDERED.add(tag.constructor);
        this.OnStaticRender(tag);
      }

      this.OnRender(tag);
    }
  }

  OnMoved(tag)
  {
    new Moved(tag);
  }

  OnDisconnect(tag)
  {
    new Disconnect(tag);
  }
}

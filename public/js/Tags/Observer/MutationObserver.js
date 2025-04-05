import {Tag} from "/js/Tag.js";
import {Observer} from "/js/Tags/Observer.js";

export class MutationObserver extends Observer
{
  constructor(root = window.document.documentElement)
  {
    super();

    this.observer = new window.MutationObserver((mutations, observer) =>
    {
      return this.OnMutation(mutations, observer);
    });

    this.root = root;

    this.observer.observe(root, {
      attributes: true,
      childList: true,
      subtree: true, // Omit or set to false to observe only changes to the parent node
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }

  OnMutation(mutations, observer)
  {
    // const timer = new OnMutation();

    const removed = new WeakSet();
    const added = new WeakSet();

    for (let i = 0; i < mutations.length; i++)
    {
      const mutation = mutations[i];

      switch (mutation.type)
      {
        // Child node(s) have been added or removed
        case "childList":
        {
          // if (window.document.documentElement)
          // {
          //   console.log("OnReflow");
          //   const event = new window.Event("OnReflow", { bubbles: false, cancelable: false, });
          //   window.document.documentElement.dispatchEvent(event);
          // }
          // Tag.HTML().FireEvent("OnConnect");

          if (mutation.removedNodes.length > 0)
          {
            this.OnRemovedNodes(mutation.removedNodes, removed);
          }

          if (mutation.addedNodes.length > 0)
          {
            this.OnAddedNodes(mutation.addedNodes, added);
            this.OnMutatedNodes(mutation.addedNodes, added);
          }

          break;
        }
        case "attributes":
        {
          this.OnAttribute(mutation.target, mutation.attributeName, mutation.oldValue);
          break;
        }
        case "characterData":
        {
          this.OnCharacterData(mutation);
          break;
        }
        default:
        {
          console.log("Unknown mutation", mutation.type);
        }
      }
    }

    // const event = new window.Event("OnMutation", { bubbles: false, cancelable: false, });
    // window.dispatchEvent(event);

    // timer.Stop();
  }

  OnAttribute(node, name, old_value)
  {
    if (node.tag)
    {
      const value = node.tag.GetAttribute(name);

      const event = new window.Event("OnAttribute", { bubbles: false, cancelable: true, });
      // event.tag = node.tag;
      // event.attribute = name;
      // event.value = {
      //   name,
      //   value,
      //   old: old_value,
      // };
      // event.old_value = old_value;
      // event.change = "new";

      // if (old_value === null) // New attribute added
      // {
      //   console.log("New attribute", name, value);
      // }
      // else if (value === null) // Removed attribute
      // {
      //   console.log("Removed attribute", name);
      // }
      // else if (value === old_value) // Unchanged
      // {
      //   console.log("Unchanged attribute", name, value);
      // }
      // else
      // {
      //   console.log("Changed attribute", name, "from", old_value, "to", value);
      // }

      node.tag.FireEvent(event, {
        name,
        value,
        old: old_value,
      });
    }
  }

  OnCharacterData(mutation)
  {
    // console.log(mutation);
    const target = mutation.target.parentNode;
    if (target && target.tag)
    {
      const old_value = mutation.oldValue;
      const new_value = mutation.target.nodeValue;
      // console.log("Target", target.tag.GetLocalName(), old_value, new_value);
    }
  }

  OnAddedNode(node, viewed)
  {
    try
    {
      // NOTE: While this is a security feature, it should not be blindly relied upon,
      // because it can be pretty easily bypassed. It is simply one more safety net.
      if (!node[TRUSTED])
      {
        // console.log("Untrusted", node[TRUSTED], node);
        if (Tag.IsNodeDangerous(node))
        {
          console.warn("Invalid child type", node.localName, node);
          node.remove();
          return;
        }
        else
        {
          Body.Get().ConvertNode(node);
          // console.log("Adding untrusted node", node[TRUSTED], node);
        }
      }
    }
    catch (error)
    {
      // If there is an error in the validation process, immediately wipe all attributes
      // this should (in theory) stop things like img's onerror event from trigger
      const attributes = node.attributes;
      if (attributes)
      {
        for (let i = attributes.length - 1; i >= 0; i--)
        {
          const attribute = attributes[i];
          node.removeAttribute(attribute.name);
        }
      }

      node.remove();
      Body.Get().Error(error);
      return;
    }

    if (node.tag)
    {
      node.tag.FireEvent("OnConnect");

      // if (!RENDERED_TAGS.has(node.tag))
      // {
      //   // console.log("OnRender of", node);
      //   node.tag.FireEvent("OnRender");
      //   RENDERED_TAGS.add(node.tag);
      // }
    }
  }

  OnRemovedNode(node, viewed)
  {
     // && node.tag.IsElement()
    if (node.tag)
    {
      node.tag.FireEvent("OnDisconnect");

      // if (!FIRST_DISCONNECTED_TAGS.has(node.tag))
      // {
      //   node.tag.FireEvent("OnFirstDisconnect");
      //   FIRST_DISCONNECTED_TAGS.add(node.tag);
      // }
    }
  }

  OnMutatedNode(node, viewed)
  {
    if (node.tag && node.tag.IsElement())
    {
      // console.log("OnMutation", node);
      node.tag.FireEvent("OnMutation");
    }
  }

  OnMutatedNodes(nodes, viewed)
  {
    // console.log("Added", [...nodes].map(node => node.nodeName));

    // // Find the nearest common ancestor of all the nodes
    // const ancestor = Tag.GetCommonAncestor.apply(Tag, nodes);
    // console.log("Result:", ancestor);

    // let ancestor;
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];
      this.OnMutatedNode(node, viewed);
    }
  }

  OnAddedNodes(nodes, viewed)
  {
    // console.log("Added", [...nodes].map(node => node.nodeName));
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      if (!viewed.has(node))
      {
        viewed.add(node);
        this.OnAddedNode(node, viewed);
      }

      const children = node.childNodes;
      if (children && children.length > 0) this.OnAddedNodes(children, viewed);
    }
  }

  OnRemovedNodes(nodes, viewed)
  {
    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];

      if (!viewed.has(node))
      {
        viewed.add(node);
        this.OnRemovedNode(node, viewed);
      }

      const children = node.childNodes;
      if (children) this.OnRemovedNodes(children, viewed);
    }
  }
}

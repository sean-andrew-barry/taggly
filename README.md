# Welcome to taggly

This is a massive project I have been developing for a couple years now. It is a framework for developing Single Page Applications in JavaScript. It is designed to be a complete solution, running both the client program in the browser and the server program in Node.js.

## The goals
1. **Developing websites should be easy.** I wanted to make something that greatly reduces the complexity of web development by unifying all the different systems into a common design.
2. **The client's computer should do most of the computational work.** Even most Single Page Application servers *still* do way more work than is necessary. Nearly everything can be and should be handled in the browser.
3. **Websites should be *fast*.** Rendering static content should happen in under 30ms.
4. For **Dynamic content**, we should fetch exactly the data we want to display to the user with as little overhead as possible. Most websites waste tons of data, with each request to the server containing tons of text that never actually gets rendered for the user to see. *If some data isn't going to be rendered on screen and isn't absolutely necessary, it should not be fetched!*

## Features
- No weird complicated build tools necessary. 100% native standard JavaScript
- Layer system that allows for near unlimited customization of the framework and makes development far easier
- Very powerful Tag system for creating and manipulating DOM nodes
- Automatic conversion of any standard JavaScript types to Tags so they can appear in the DOM
  - Add strings, functions, promises, dates, errors, etc as children of Tags and they are automatically converted to Tags
- Excellent performance
  - Nearly all computation can be done by the client, resulting in a much better user experience
  - That also means that the server barely has to do anything! Hosting can be *extremely* cheap!
  - A typical page load time is about 10ms
- Hot reloading for easy development
  - Press `ctrl-r` to do a *partial reload*. Taggly will look at all the files that have been edited since the last reload, and reload them (usually takes between 10ms - 40ms)
  - Press `ctrl-e` to *fully reload* all the files, regardless of whether they have been edited (usually takes around 200ms)
  - Press `ctrl-q` to *hard reload* the Node.js process, which restarts the worker thread (usually takes a couple seconds)
- Client and server use the same code files
  - This reduces redundancy. Write it once, use it anywhere
  - It makes the program much easier to reason about and develop
  - Enables a very powerful data compression system
- Dynamic client side database queries system - No need to write an API function for each query you want to do. You just write the query, and the server handles it.
- Uses a WebSocket by default for client side queries for extremely high performance.
  - HTTP is **extremely** inefficient for the kind of small packets that modern websites tend to send tons of.
  - WebSockets can increase the server's throughput by around **100 times**.
- Bundles with Rollup by default, but also has builtin support for Webpack.
- Built in support for clusters - run many instances of the program for better performance on multi-core systems
- A unique binary data format as an alternative to JSON
  - Just as fast as JSON to encode/decode
  - Extremely compressed, saving tons of bandwidth
  - Can encode/decode instances of classes, which is far more convenient than simplifying everything down to a plain object like in JSON
- **And so much more!** As I mentioned, this is a *huge* project.

## Work in progress features
Most of these are like 95% implemented, they are just haven't been fully tested or integrated.

- Automatically reboot on crashes to help ensure uptime
- Built in HTTP proxy system for easily running multiple sites on the same server
- Auto SSL management
  - Automatically generates self signed certificates for use in development
  - Normally managing SSL certs is unnecessarily complicated and involves installing additional 3rd party programs.
  - Taggly is designed to just handle it for you with minimal effort.

## Using Tags
The most important concept in taggly is the `Tag`. A `Tag` is a wrapper around a HTML node, like a `<div>`, `<a>` or a `#text` node.

The following code creates a `Div` Tag, and appends it to the current document's `Body`.
```js
import {Body} from "/js/Tags/Body.js";
import {Div} from "/js/Tags/Div.js";
import {A} from "/js/Tags/A.js";

Body.Get().Append(
  new Div().Class("my-class").ID("my-id").Append(
    new A().HRef("/my-page").Append("Click me!"),
  ),
);
```
Now our HTML will look like this:
```html
<body>
  <div class="my-class" id="my-id">
    <a href="/my-page">Click me!</a>
  </div>
</body>
```
`Append` is the most common way to add children to a tag, but there are many other functions for adding tags, such as `Prepend`, which adds the tags before the first element, as opposed to after the last element.

Each of these functions can also be called as a template literal. This is extremely useful when dealing with strings that have tags embedded in them. For example:
```js
import {Body} from "/js/Tags/Body.js";
import {P} from "/js/Tags/P.js";
import {Strong} from "/js/Tags/Strong.js";
import {Em} from "/js/Tags/Em.js";

Body.Get().Append(
  new P().Append`Here's some ${new Strong().Append`strong text`}, and ${new Em().Append`this text is emphasized`}.`,
);
```
```html
<body>
  <p>
    Here's some <strong>strong text</strong>, and <em>this text is emphasized</em>.
  </p>
</body>
```
Sometimes, having the `new` keywords can clutter up the code a bit, especially when using lots of tags in one line like above. That's where static methods can be quite useful. Just like `Tag`s have the `Append` method on their prototype, they also have a `static Append` method. This simply constructs a new instance of the tag, and calls `Append` on it. Using this, the above example can be shortened to:
```js
Body.Get().Append(
  P.Append`Here's some ${Strong.Append`strong text`}, and ${Em.Append`this text is emphasized`}.`,
);
```
The result will be exactly the same, it's just a bit cleaner looking.

Many commonly used `Tag` methods also have a static version for convenience. For example:
```js
// Both of these lines have the same result
Div.Class("my-class");
new Div().Class("my-class");

// Both of these lines have the same result
A.HRef("/my-page");
new A().HRef("/my-page");
```

# Layers
One of the most powerful features of Taggly is its layer system. This allows you to fully customize *almost anything* about the framework.

A `layer` is just a directory in your file system. When you create a directory to hold all the files for your website, that's a layer. And the Taggly framework, which you install in your directory, is also a layer.

Each layer directory has subdirectories. These subdirectories are called `domains`. There are two main domains: `private` and `public`. The public domain holds files that your HTTP server can send to users, and that's where the vast majority of your code will go.

Layers and domains are used to resolve `import` statements, like this one:
```js
import {Div} from "/js/Tags/Div.js";
```
This tells the framework to find a file called `Div.js` in the folders `/js/Tags` and load it as JavaScript code.

In order to find that `Div.js` file, the framework will search each of its layers in order. By default, it will begin with *your* layer (your project directory root), and end with the Taggly layer (usually installed at `your-project/node_modules/taggly`).

When the framework checks a layer, it will check each domain. So, when resolving the above `Div.js` import, the framework will check if your framework has a subdirectory called `private`. If it does, it will check if that private directory has a subdirectory called `js`. If yes, it will check for `Tags` and then finally for a file called `Div.js`. If it gets to the file, then that file is what will be imported by
```js
import {Div} from "/js/Tags/Div.js";
```
However, if any of those checks fail, it will move back up to the layer and check for the *next* domain. In this case, the next domain is `public`, so it will check if your layer has a subdirectory called `public`, then check if that has `js`, then `Tags`, then `Div.js`. Again, if it reaches a file that satisfies the import statement, it's done. That is the file that gets loaded. But if it doesn't, then it will move on to the next layer. In this case, the next layer is the Taggly framework, so it will check `taggly` for `private/js/Tags/Div.js`, which doesn't exist, then it will check it for `public/js/Tags/Div.js`, which *does* exist.

I know that's a lot to take in, but it's very important for understanding how Taggly works.

The layer system means that if you create a file at `public/js/Tags/Div.js`, **any** `import` statement that imports `/js/Tags/Div.js` will get **your** file. And when I say "any", I mean the Taggly framework code as well. There are many files in Taggly that import the `Div` tag. If you create your own `Div` file, my code will use *your* custom `Div`.
```js
import {Tag} from "/js/Tag.js";

// This custom Div class will now be what is imported by
// import {Div} from "/js/Tags/Div.js";
export class Div extends Tag
{
}
```
Now this code:
```js
import {Div} from "/js/Tags/Div.js";
```
Will import the above Div class, instead of the Div class I created for the framework.

It is possible to give the framework some more detailed instructions about exactly which file you want using URL query string parameters:
```js
import {Div} from "/js/Tags/Div.js?include=/taggly/";
```
In the above example, the framework will handle the import in the same way, except it will only allow a file if its path url includes the string `/taggly/`. Since your path does *not* include that string, this import will pass over your custom `Div.js` file and reach Taggly's original `Div.js` file, which does include the string.

There is also an `exclude` parameter, which is simply the inverse of `include`.

Usually you should not need to use `include` or `exclude`. However, there is another query parameter that is very important and that's called `next`.

`next` works like an `include`, except that when the parameter value is found in the path, it doesn't resolve to *that* file, it resolves to the *next* file along the search sequence. Take a look at this example:
```js
import {Div} from "/js/Tags/Div.js?next=/your-project-name/";
```
Where `your-project-name` is the name of your project's root directory.

Here, the framework will search for a `Div.js` file, and the first one it will find is the one you defined in `public/js/Tags/Div.js`. However, the `next` parameter will then be checked. Your `Div.js` file *does* include the string `/your-project-name/` in its file url, so the `next` condition is satisfied. This means the framework will move on to the `next` file that matches `/js/Tags/Div.js`, and now ignore the `next` parameter. The file it will find is the framework's original `Div.js` file.

In your custom `Div.js` file, instead of exporting a `Div` class that inherits from `Tag`, do this:
```js
import {Div as Base} from "/js/Tags/Div.js?next=/your-project-name/";

export class Div extends Base
{
}
```
Let's go through the process of how the above code works.

Some random file, doesn't matter which one, imports `/js/Tags/Div.js`. The framework starts searching through its layers, starting with your root project. It checks the `private` domain, but doesn't find it. It checks the `public` domain, and *does* find a file that fits the import, so it executes that file.

When your `Div.js` file is parsed, the framework discovers that it imports `/js/Tags/Div.js?next=/your-project-name/`, so it starts searching for that. Again, same process as before, it checks `private`, but doesn't find it. Checks `public`, and does find a file (yours). Then it checks the `next` parameter against that file. `next` passes, so instead of stopping there, it carries on. It checks Taggly's `private`, but doesn't find anything, so it checks `public` and *does* find file that meets the requirements, so it resolves to that file.

The end result is that *two* `/js/Tags/Div.js` files have been imported. The import that started the process gets *your* `Div` class, and your `Div` class imports Taggly's public `Div` class and inherits from it.

I really hope that all wasn't too confusing, because this is the most crucial thing to understand about Taggly. This file loader system is extremely powerful. It allows you to customize almost *anything* about the framework with ease.

In Taggly, if you want to change how something works, you don't go messing with the `prototype`s or passing confusing options objects around. You inherit from it and hook the relevant functions.

Here are some examples you could decide add to the base `Tag` class:
```js
import {Tag as Base} from "/js/Tag.js?next=/public/";

export class Tag extends Base
{
  // Want to forward A() to Append() to make it shorter to type?
  A(...args){ return this.Append(...args); }

  // Want to customize how Taggly converts a string into a text node?
  // Here we hook the ConvertString function and can do any parsing
  // on the string
  ConvertString(string)
  {
    // Parse the html non-breaking space entity into its code point
    // It's a lot easier to remember &nbsp; than to remember \u00A0!
    string = string.replace("&nbsp;", "\u00A0");
    return super.ConvertString(string);
  }

  // Give a tag a blue background and white text
  Blue(){ return this.BackgroundColor("blue").Color("white"); }
}
```
Since `Div` inherits from `Tag`, now `Div` has access to all of those functions. Here's some examples of how you can use these functions:
```js
import {Div} from "/js/Tags/Div.js";

// A() calls Append()
new Div().A(
  // Strings are passed through ConvertString to convert them in to DOM Nodes
  "Hello&nbsp;world!",

  // Give the Div a blue background and white text
  new Div().Blue(),
);
```

### Import aggregates
While it can be best to `import` each `Tag` individually, like this:
```js
import {Body} from "/js/Tags/Body.js";
import {P} from "/js/Tags/P.js";
import {Strong} from "/js/Tags/Strong.js";
import {Em} from "/js/Tags/Em.js";
```
Sometimes that can cause some clutter when you need a lot of tags. However, most tags can also be accessed via the `/js/Tags.js` aggregate file, like this:
```js
import {Body, Em, P, Strong} from "/js/Tags.js";
```

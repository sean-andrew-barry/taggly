// The DOMTokenList interface represents a set of space-separated tokens. Such a set is returned by Element.classList, HTMLLinkElement.relList, HTMLAnchorElement.relList, HTMLAreaElement.relList, HTMLIframeElement.sandbox, or HTMLOutputElement.htmlFor. It is indexed beginning with 0 as with JavaScript Array objects. DOMTokenList is always case-sensitive.

export class DOMTokenList
{
  #tokens = new Set();
  #orderedTokens = []; // For quicker index-based access

  get length(){ return this.#tokens.size; }

  get _value()
  {
    let value = "";
    for (const token of this.#tokens)
    {
      value += token.toString() + " ";
    }

    return value.trim();
  }

  get value(){ return [...this.#tokens].join(" "); }

  validateToken(token) {
    if (!token || /\s/.test(token)) {
      throw new Error("Invalid token");
    }
  }

  item(index) {
    return this.#orderedTokens[index] || null;
  }

  contains(token) {
    this.validateToken(token);
    return this.#tokens.has(token);
  }

  replace(oldToken, newToken)
  {
    if (!this.contains(oldToken))
    {
      return false;
    }

    this.#tokens.delete(oldToken);
    this.#tokens.add(newToken);

    return true;
  }

  add(...tokens) {
    for (const token of tokens) {
      this.validateToken(token);

      if (!this.#tokens.has(token)) {
        this.#tokens.add(token);
        this.#orderedTokens.push(token);
      }
    }
  }

  remove(...tokens) {
    for (const token of tokens) {
      this.validateToken(token);

      if (this.#tokens.has(token)) {
        this.#tokens.delete(token);
        
        const index = this.#orderedTokens.indexOf(token);
        if (index > -1) {
          this.#orderedTokens.splice(index, 1);
        }
      }
    }
  }

  toggle(token, force) {
    this.validateToken(token);
    const containsToken = this.contains(token);
    if (force === true || (!containsToken && force !== false)) {
      this.add(token);
      return true;
    }
    if (force === false || containsToken) {
      this.remove(token);
      return false;
    }
  }

  supports(){ return this.ThrowNotImplemented("supports"); }

  entries(){ return this.#tokens.entries(); }
  keys(){ return this.#tokens.keys(); }
  values(){ return this.#tokens.values(); }
  forEach(...args){ return this.#tokens.forEach(...args); }

  [Symbol.iterator](){ return this.#tokens[Symbol.iterator](); }
}

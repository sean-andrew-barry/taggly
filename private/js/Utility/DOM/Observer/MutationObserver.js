import {Data} from "/js/Utility/DOM/Data.js";

const ELEMENTS = new Map();

export class MutationObserver {
  static {
    // Expose controlled access to these private methods
    Data.set(this, {
      Notify: (...args) => this.#Notify(...args),
    });
  }

  static #Notify(node, mutationRecord) {
    if (ELEMENTS.has(node)) {
      for (const observer of ELEMENTS.get(node)) {
        observer.#recordMutation(mutationRecord);
      }
    }
  }

  #callback; // The callback function to execute when mutations are observed
  #options = null; // Options for the observer (optional)
  #observedElements = new Set(); // List of elements that this observer is currently observing
  #mutationRecords = [];
  
  constructor(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.#callback = callback;
  }

  // Adds a target element to observe
  observe(target, options) {
    if (!target || typeof target !== 'object' || !(target instanceof Element)) {
      throw new TypeError('Target must be an Element.');
    }
    
    // Validate options and set default values if necessary
    const defaultOptions = {
      childList: false,
      attributes: false,
      characterData: false,
      subtree: false,
      attributeOldValue: false,
      characterDataOldValue: false,
      attributeFilter: []
    };
    
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        if (!(key in defaultOptions)) {
          throw new TypeError(`Unknown option: ${key}`);
        }
      }
    }
    
    const observedOptions = {
      ...defaultOptions,
      ...options
    };
    
    // Store the options and add the target to the observed elements
    this.#options = observedOptions;
    this.#observedElements.add(target);

    if (!ELEMENTS.has(target)) {
      // Create a set to hold the MutationObservers for the Element
      ELEMENTS.set(target, new Set());
    }

    // Register this MutationObserver to the Element
    ELEMENTS.get(target).add(this);
    
    // Possibly start observing (assuming another internal method does the actual observation)
    this.#startObserving(target, observedOptions);
  }

  // Stops the MutationObserver instance from observing any mutations
  disconnect() {
    for (const element of this.#observedElements)
    {
      if (!ELEMENTS.has(element)) {
        throw new Error(`Element was not registered to this MutationObserver`)
      }

      // Unregister this MutationObserver from the Element
      ELEMENTS.get(element).delete(this);
    }

    // Clear the observed elements
    this.#observedElements.clear();
  
    // Nullify or reset other internal state if necessary
    this.#options = null;
  
    // Possibly stop the internal observing mechanism
    this.#stopObserving();
  }

  // Empties the MutationObserver instance's record queue and returns what was in there.
  takeRecords() {
    // Create a shallow copy of the current records
    const recordsCopy = [...this.#mutationRecords];
    
    // Clear the original records
    this.#mutationRecords.length = 0;
    
    return recordsCopy;
  }

  // Internal Methods

  #recordMutation(mutation) {
    // Validate that the mutation object has the necessary properties
    if (!mutation || typeof mutation !== 'object' || !('type' in mutation)) {
      throw new Error('Invalid mutation record');
    }

    // Add the mutation record to the queue
    this.#mutationRecords.push(mutation);

    // Trigger the callback, if necessary
    // The spec does this in a microtask, which can be simulated using Promise.resolve()
    Promise.resolve().then(() => {
      if (this.#mutationRecords.length > 0) {
        const recordsToDeliver = this.takeRecords();
        this.#callback(recordsToDeliver);
      }
    });
  }

  #startObserving(target, options) {
    // Set up your mechanism for observing mutations here.
    // For example, if observing attribute changes:
    if (options.attributes) {
      // Attach an event listener, or use some other method
      // target.addEventListener('DOMAttrModified', this.#recordMutation);
    }
    
    // Similarly, for other types of mutations like childList or characterData
    // if (options.childList) { ... }
    // if (options.characterData) { ... }

    // Note: The above event listeners are for demonstration and might not be fully spec-compliant.
    // You would replace them with your own spec-compliant mechanism.
  }

  #stopObserving() {
    // Tear down your mechanism for observing mutations here.
    // For example, if observing attribute changes:
    // this.#observedElements.forEach(target => {
    //   target.removeEventListener('DOMAttrModified', this.#recordMutation);
    // });
    
    // Similarly, for other types of mutations like childList or characterData
    // if (this.#options && this.#options.childList) { ... }
    // if (this.#options && this.#options.characterData) { ... }

    // Note: The above event listeners are for demonstration and might not be fully spec-compliant.
    // You would replace them with your own spec-compliant mechanism.
  }

  // Method to actually record mutations, called internally
  #recordMutations() {}

  // Another possible internal method to check if a mutation should be observed based on options
  #shouldObserve(mutation) {}
}

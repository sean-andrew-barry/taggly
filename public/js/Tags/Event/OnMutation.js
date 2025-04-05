import {Event} from "/js/Tags/Event.js";

export class OnMutation extends Event
{
  static GetLocalName(){ return "on-mutation"; }

  static OnCapture(base, mutations, observer)
  {
    const wrapper = new this(mutations, observer);
    wrapper.Fire(base);
  }

  static Capture(tag)
  {
    const name = this.GetLocalName();
    const observer = new MutationObserver((mutations, observer) =>
    {
      // const event = new window.Event(name);
      // event.mutations = mutations;
      // event.observer = observer;
      //
      // tag.GetNode().dispatchEvent(event);

      // const wrapper = new this();
      // wrapper.Fire(tag);
      this.OnCapture(tag, mutations, observer);
    });

    return super.Capture(tag);
  }

  constructor(mutations, observer)
  {
    super();
    this.mutations = mutations;
    this.observer = observer;
  }
}

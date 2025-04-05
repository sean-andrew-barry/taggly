import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Browser extends Singleton
{
  constructor()
  {
    super();
    this.styles = this.GetStyles();
  }

  HasGlobal(name){ return window.hasOwnProperty(name); }
  HasStyle(name){ return this.styles.hasOwnProperty(name); }

  HasFlex(){ return this.HasStyle("flex"); }
  HasFlexFlow(){ return this.HasStyle("flex-flow"); }
  HasGrid(){ return this.HasStyle("grid"); }

  // HasElement(name)
  // {
  //   if (window.hasOwnProperty())
  // }
}

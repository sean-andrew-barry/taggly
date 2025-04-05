import {Div} from "/js/Tags/Div.js";
import {Redraw} from "/js/Event/Redraw.js";

export class InfiniteRedrawLoop extends Div
{
  [Redraw](event)
  {
    const width = this.GetStyle("width");

    if (width === "100px")
    {
      // If the width is 100px, set it to 200px, causing Redraw to fire again in the next update
      this.Width("200px");
    }
    else
    {
      // If the width is 200px, set it to 100px, again causing Redraw to fire again in the next update
      this.Width("100px");
    }
  }
}

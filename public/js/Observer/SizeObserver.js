import {window} from "/js/Window.js";
import {Observer} from "/js/Observer.js";

import {FullHD} from "/js/Event/FullHD.js";
import {Widescreen} from "/js/Event/Widescreen.js";
import {Desktop} from "/js/Event/Desktop.js";
import {Tablet} from "/js/Event/Tablet.js";
import {Mobile} from "/js/Event/Mobile.js";
import {NotFullHD} from "/js/Event/NotFullHD.js";
import {NotWidescreen} from "/js/Event/NotWidescreen.js";
import {NotDesktop} from "/js/Event/NotDesktop.js";
import {NotTablet} from "/js/Event/NotTablet.js";
import {NotMobile} from "/js/Event/NotMobile.js";

const MOBILE = new WeakSet();
const TABLET = new WeakSet();
const DESKTOP = new WeakSet();
const WIDESCREEN = new WeakSet();
const FULL_HD = new WeakSet();

export class SizeObserver extends Observer
{
  static Get(){ return PROMISE; }
  static GetIsMobileWeakSet(){ return MOBILE; }
  static GetIsTabletWeakSet(){ return TABLET; }
  static GetIsDesktopWeakSet(){ return DESKTOP; }
  static GetIsWidescreenWeakSet(){ return WIDESCREEN; }
  static GetIsFullHDWeakSet(){ return FULL_HD; }

  constructor(tag)
  {
    super(tag);

    tag.GetNode().addEventListener("resize", this.OnResize.bind(this), { passive: true });
    this.Update();
  }

  GetBody(){ return this.GetTag().GetBody(); }
  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }

  IsFullHD(width){ return width >= FullHD.GetWidth(); }
  IsWidescreen(width){ return width >= Widescreen.GetWidth(); }
  IsDesktop(width){ return width >= Desktop.GetWidth(); }
  IsTablet(width){ return width >= Tablet.GetWidth(); }
  IsMobile(width){ return width < Mobile.GetWidth(); }

  Update(tag = this.GetBody(), width = this.GetWindowWidth())
  {
    if (this.IsFullHD(width))
    {
      if (!FULL_HD.has(tag))
      {
        FULL_HD.add(tag);
        new FullHD(tag);
      }
    }
    else if (FULL_HD.has(tag))
    {
      FULL_HD.delete(tag);
      new NotFullHD(tag);
    }

    if (this.IsWidescreen(width))
    {
      if (!WIDESCREEN.has(tag))
      {
        WIDESCREEN.add(tag);
        new Widescreen(tag);
      }
    }
    else if (WIDESCREEN.has(tag))
    {
      WIDESCREEN.delete(tag);
      new NotWidescreen(tag);
    }

    if (this.IsDesktop(width))
    {
      if (!DESKTOP.has(tag))
      {
        DESKTOP.add(tag);
        new Desktop(tag);
      }
    }
    else if (DESKTOP.has(tag))
    {
      DESKTOP.delete(tag);
      new NotDesktop(tag);
      // tag.FireEvent("OnNotDesktop");
    }

    if (this.IsTablet(width))
    {
      if (!TABLET.has(tag))
      {
        TABLET.add(tag);
        new Tablet(tag);
      }
    }
    else if (TABLET.has(tag))
    {
      TABLET.delete(tag);
      new NotTablet(tag);
      // tag.FireEvent("OnNotTablet");
    }

    if (this.IsMobile(width))
    {
      if (!MOBILE.has(tag))
      {
        MOBILE.add(tag);
        new Mobile(tag);
      }
    }
    else if (MOBILE.has(tag))
    {
      MOBILE.delete(tag);
      new NotMobile(tag);
      // tag.FireEvent("OnNotMobile");
    }

    const count = tag.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = tag.GetChild(i);
      if (child && child.IsElement()) this.Update(child, width);
    }
  }

  OnResize(event)
  {
    this.Update();
  }
}

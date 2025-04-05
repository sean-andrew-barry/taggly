import {Tag} from "/js/Tag.js";
import {Observer} from "/js/Tags/Observer.js";

const IS_MOBILE = new WeakSet();
const IS_TABLET = new WeakSet();
const IS_TOUCH = new WeakSet();
const IS_DESKTOP = new WeakSet();
const IS_WIDESCREEN = new WeakSet();
const IS_FULL_HD = new WeakSet();

export class SizeObserver extends Observer
{
  static GetIsMobileWeakSet(){ return IS_MOBILE; }
  static GetIsTabletWeakSet(){ return IS_TABLET; }
  static GetIsTouchWeakSet(){ return IS_TOUCH; }
  static GetIsDesktopWeakSet(){ return IS_DESKTOP; }
  static GetIsWidescreenWeakSet(){ return IS_WIDESCREEN; }
  static GetIsFullHDWeakSet(){ return IS_FULL_HD; }

  constructor(root = window)
  {
    super();

    this.root = root;
    this.root.addEventListener("scroll", this.OnScrollHandler.bind(this), { passive: true });
    this.root.addEventListener("resize", this.OnScrollHandler.bind(this), { passive: true });
    this.root.addEventListener("OnMutation", this.OnMutationHandler.bind(this), { passive: true });

    // this.OnScrollHandler();
  }

  GetWindowWidth(){ return window.innerWidth || window.document.clientWidth; }
  GetWindowHeight(){ return window.innerHeight || window.document.clientHeight; }

  UpdateSize(tag, width)
  {
    if (width >= 1408)
    {
      if (!IS_FULL_HD.has(tag))
      {
        IS_FULL_HD.add(tag);
        tag.FireEvent("OnFullHD");
      }
    }
    else if (IS_FULL_HD.has(tag))
    {
      IS_FULL_HD.delete(tag);
      // tag.FireEvent("OnNotFullHD");
    }

    if (width >= 1216)
    {
      if (!IS_WIDESCREEN.has(tag))
      {
        IS_WIDESCREEN.add(tag);
        tag.FireEvent("OnWidescreen");
      }
    }
    else if (IS_WIDESCREEN.has(tag))
    {
      IS_WIDESCREEN.delete(tag);
      // tag.FireEvent("OnNotWidescreen");
    }

    if (width >= 1024)
    {
      if (!IS_DESKTOP.has(tag))
      {
        IS_DESKTOP.add(tag);
        tag.FireEvent("OnDesktop");
      }
    }
    else if (IS_DESKTOP.has(tag))
    {
      IS_DESKTOP.delete(tag);
      // tag.FireEvent("OnNotDesktop");
    }

    if (width >= 768 && width < 1024)
    {
      if (!IS_TOUCH.has(tag))
      {
        IS_TOUCH.add(tag);
        tag.FireEvent("OnTouch");
      }
    }
    else if (IS_TOUCH.has(tag))
    {
      IS_TOUCH.delete(tag);
      // tag.FireEvent("OnNotTouch");
    }

    if (width >= 768)
    {
      if (!IS_TABLET.has(tag))
      {
        IS_TABLET.add(tag);
        tag.FireEvent("OnTablet");
      }
    }
    else if (IS_TABLET.has(tag))
    {
      IS_TABLET.delete(tag);
      // tag.FireEvent("OnNotTablet");
    }

    if (width < 768)
    {
      if (!IS_MOBILE.has(tag))
      {
        IS_MOBILE.add(tag);
        tag.FireEvent("OnMobile");
      }
    }
    else if (IS_MOBILE.has(tag))
    {
      IS_MOBILE.delete(tag);
      // tag.FireEvent("OnNotMobile");
    }

    const count = tag.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = tag.GetChild(i);
      if (child && child.IsElement()) this.UpdateSize(child, width);
    }
  }

  OnScrollHandler(event)
  {
    // document.documentElement.dataset.scroll = Math.floor(window.scrollY);
    // window.document.documentElement.setAttribute("scroll-y", Math.floor(window.scrollY));
    // window.document.documentElement.setAttribute("scroll-x", Math.floor(window.scrollX));
    this.UpdateSize(Tag.Body(), this.GetWindowWidth());
  }

  OnResizeHandler(event)
  {
    this.UpdateSize(Tag.Body(), this.GetWindowWidth());
  }

  OnMutationHandler(event)
  {
    this.UpdateSize(Tag.Body(), this.GetWindowWidth());
  }
}

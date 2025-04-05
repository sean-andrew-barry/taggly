import {Tag} from "/js/Tag.js";
import {Event} from "/js/Tags/Event.js";

export class Custom extends Event
{
}

Custom.Register();

export class OnConnect extends Custom {}
export class OnDisconnect extends Custom {}
export class OnInitialize extends Custom {}
export class OnReady extends Custom {}
export class OnRender extends Custom {}
export class OnReflow extends Custom {}
export class OnUpdate extends Custom {}
export class OnLog extends Custom {}
export class OnWarn extends Custom {}
export class OnError extends Custom {}

export class OnDebug extends Custom
{
  async Call(tag)
  {
    const config = await Tag.Config().Wait();
    if (await config.IsDevelopment())
    {
      return super.Call(tag);
    }
  }
}

export class OnResolve extends Custom {}
export class OnReject extends Custom {}

export class OnVisibilityUpdate extends Custom {}
export class OnTick extends Custom {}
export class OnMobile extends Custom {}
export class OnTablet extends Custom {}
export class OnTouch extends Custom {}
export class OnDesktop extends Custom {}
export class OnWidescreen extends Custom {}
export class OnFullHD extends Custom {}
export class OnNotMobile extends Custom {}
export class OnNotTablet extends Custom {}
export class OnNotDesktop extends Custom {}
export class OnNotWidescreen extends Custom {}
export class OnNotFullHD extends Custom {}

export class OnAddChild extends Custom {}
export class OnRemoveChild extends Custom {}
export class OnRemoving extends Custom {}
export class OnAttribute extends Custom {}
export class OnFullViewEnter extends Custom {}
export class OnFullViewLeave extends Custom {}
export class OnViewEnter extends Custom {}
export class OnViewLeave extends Custom {}
export class OnNavigationGo extends Custom {}
export class OnNavigationRedirect extends Custom {}
export class OnTagError extends Custom {}
export class OnCacheLoad extends Custom {}
export class OnCacheSave extends Custom {}
export class OnCacheClear extends Custom {}
export class OnAnimationPlay extends Custom {}
export class OnAnimationCancel extends Custom {}
export class OnAnimationFinish extends Custom {}
export class OnAnimationReverse extends Custom {}
export class OnAnimationPause extends Custom {}

OnConnect.Register();
OnDisconnect.Register();
OnInitialize.Register();
OnReady.Register();
OnRender.Register();
OnReflow.Register();
OnUpdate.Register();
OnLog.Register();
OnWarn.Register();
OnError.Register();
OnDebug.Register();
OnResolve.Register();
OnReject.Register();
OnVisibilityUpdate.Register();
OnTick.Register();
OnMobile.Register();
OnTablet.Register();
OnTouch.Register();
OnDesktop.Register();
OnWidescreen.Register();
OnFullHD.Register();
OnNotMobile.Register();
OnNotTablet.Register();
OnNotDesktop.Register();
OnNotWidescreen.Register();
OnNotFullHD.Register();
OnAddChild.Register();
OnRemoveChild.Register();
OnRemoving.Register();
OnAttribute.Register();
OnFullViewEnter.Register();
OnFullViewLeave.Register();
OnViewEnter.Register();
OnViewLeave.Register();
OnNavigationGo.Register();
OnNavigationRedirect.Register();
OnTagError.Register();
OnCacheLoad.Register();
OnCacheSave.Register();
OnCacheClear.Register();
OnAnimationPlay.Register();
OnAnimationCancel.Register();
OnAnimationFinish.Register();
OnAnimationReverse.Register();
OnAnimationPause.Register();

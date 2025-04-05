import {window} from "/js/Window.js";
import {Element} from "/js/Tag/Element.js";
import {Environment} from "/js/Environment.js";
import {Sanitize} from "/js/Tag/Sanitize.js";

export class Attributes extends Element
{
  UrlHelper(url, base, raw = false)
  {
    if (Environment.IsServer())
    {
      raw = true;
    }

    if (raw !== true)
    {
      url = new URL(url, base);

      switch (url.protocol)
      {
        case "http:":
        case "https:":
        {
          break;
        }
        default:
        {
          console.warn("Untrusted url protocol of", url.protocol, "set raw to", true, "to override this check");
          // url.origin = window.location.origin;
          // console.log(url);
          // url.pathname = "#";
          // url.protocol = "https:";
          return "#";
        }
      }
    }

    return url;
  }

  // Style            (v){ this.GetNode().style.cssText = v; return this; }
  // // EncodeText       (v){ return this.SetProperty("textContent", Encoder.Encode(v)); }
  // // DecodeText       (v){ return this.SetProperty("textContent", Encoder.Decode(v)); }
  // // EscapeHTML       (v){ return this.SetProperty("innerHTML", this.constructor.Escape(v)); }
  // // InnerHTML        (v){ return this.SetProperty("innerHTML",           v); }
  // // OuterHTML        (v){ return this.SetProperty("outerHTML",           v); }
  // // InnerText        (v){ return this.SetProperty("innerText",           v); }
  // // OuterText        (v){ return this.SetProperty("outerText",           v); }
  // Class            (v, d){ return this.SetAttribute("class",              v, d); }
  // Is               (v, d){ return this.SetAttribute("is",                 v, d); }
  // ID               (v, d){ return this.SetAttribute("id",                 v, d); }
  // Name             (v, d){ return this.SetAttribute("name",               v, d); }
  // Part             (v, d){ return this.SetAttribute("part",               v, d); }
  // Lang             (v, d){ return this.SetAttribute("lang",               v, d); }
  // Slot             (v, d){ return this.SetAttribute("slot",               v, d); }
  // Override         (v, d){ return this.SetAttribute("override",           v, d); }
  // CharSet          (v, d){ return this.SetAttribute("charset",            v, d); }
  // Placeholder      (v, d){ return this.SetAttribute("placeholder",        v, d); }
  // Place            (v, d){ return this.SetAttribute("place",              v, d); }
  // Mode             (v, d){ return this.SetAttribute("mode",               v, d); }
  // Value            (v, d){ return this.SetAttribute("value",              v, d); }
  // XMLNS            (v, d){ return this.SetAttribute("xmlns",              v, d); }
  // NS               (v, d){ return this.SetAttribute("ns",                 v, d); }
  // ViewBox          (v, d){ return this.SetAttribute("viewBox",            v, d); }
  // D                (v, d){ return this.SetAttribute("d",                  v, d); }
  // Rel              (v, d){ return this.SetAttribute("rel",                v, d); }
  // Step             (v, d){ return this.SetAttribute("step",               v, d); }
  // Sizes            (v, d){ return this.SetAttribute("sizes",              v, d); }
  // ColorAttribute   (v, d){ return this.SetAttribute("color",              v, d); }
  // Role             (v, d){ return this.SetAttribute("role",               v, d); }
  // Type             (v, d){ return this.SetAttribute("type",               v, d); }
  // Alt              (v, d){ return this.SetAttribute("alt",                v, d); }
  // Min              (v, d){ return this.SetAttribute("min",                v, d); }
  // Max              (v, d){ return this.SetAttribute("max",                v, d); }
  // For              (v, d){ return this.SetAttribute("for",                v, d); }
  // TabIndex         (v, d){ return this.SetAttribute("tabindex",           v, d); }
  // Download         (v, d){ return this.SetAttribute("download",           v, d); }
  // Method           (v, d){ return this.SetAttribute("method",             v, d); }
  // Action           (v, d){ return this.SetAttribute("action",             v, d); }
  // WidthAtt         (v, d){ return this.SetAttribute("width",              v, d); }
  // HeightAtt        (v, d){ return this.SetAttribute("height",             v, d); }
  // Title            (v, d){ return this.SetAttribute("title",              v, d); }
  // CrossOrigin      (v, d){ return this.SetAttribute("crossorigin",        v, d); }
  // Preload          (v, d){ return this.SetAttribute("preload",            v, d); }
  // PlaysInline      (v, d){ return this.SetAttribute("playsinline",        v, d); }
  // AutoPlay         (v, d){ return this.SetAttribute("autoplay",           v, d); }
  // Muted            (v, d){ return this.SetAttribute("muted",              v, d); }
  // Loop             (v, d){ return this.SetAttribute("loop",               v, d); }
  // Poster           (v, d){ return this.SetAttribute("poster",             v, d); }
  // FrameBorder      (v, d){ return this.SetAttribute("frameborder",        v, d); }
  // Allow            (v, d){ return this.SetAttribute("allow",              v, d); }
  // AllowFullScreen  (v, d){ return this.SetAttribute("allowfullscreen",    v, d); }
  // AllowTransparency(v, d){ return this.SetAttribute("allowtransparency",  v, d); }
  // Rows             (v, d){ return this.SetAttribute("rows",               v, d); }
  // Cols             (v, d){ return this.SetAttribute("cols",               v, d); }
  // Integrity        (v, d){ return this.SetAttribute("integrity",          v, d); }
  // ContentAtt       (v, d){ return this.SetAttribute("content",            v, d); }
  // Draggable        (v, d){ return this.SetAttribute("draggable",          v, d); }
  // Multiple         (v, d){ return this.SetAttribute("multiple",           v, d); }
  // Code             (v, d){ return this.SetAttribute("code",               v, d); }
  // Group    (...values){ return this.SetAttribute("group", values.join(", ")); }
  // RawHRef          (v, d){ return this.SetAttribute("href", v, d); }
  // RawSrc           (v, d){ return this.SetAttribute("src" , v, d); }
  // All              (v){ return this.ToggleAttribute("all",             v); }
  // ContentEditable  (v){ return this.ToggleAttribute("contenteditable", v); }
  // Checked          (v){ return this.ToggleAttribute("checked",         v); }
  // Disabled         (v){ return this.ToggleAttribute("disabled",        v); }
  // Controls         (v){ return this.ToggleAttribute("controls",        v); }
  // ReadOnly         (v){ return this.ToggleAttribute("readonly",        v); }
  // AutoComplete     (v){ return this.ToggleAttribute("autocomplete",    v); }
  // Selected         (v){ return this.ToggleAttribute("selected",        v); }
  // Required         (v){ return this.ToggleAttribute("required",        v); }
  // NoValidate       (v){ return this.ToggleAttribute("novalidate",      v); }
  // NoModule         (v){ return this.ToggleAttribute("nomodule",        v); }
  //
  // Data(v, b){ return this.SetAttribute("data", Sanitize.URL(v)); }
  // HRef(v, b){ return this.SetAttribute("href", Sanitize.URL(v, b)); }
  // HRef(v, b){ return this.SetAttribute("href", v); }
  // Src (v, b){ return this.SetAttribute("src" , Sanitize.URL(v, b)); }
  //
  // _HRef(url, origin = window.location.origin)
  // {
  //   if (Environment.IsClient())
  //   {
  //     if (!(url instanceof URL))
  //     {
  //       url = new URL(url, origin);
  //     }
  //
  //     // If it's an internal URL
  //     if (url.origin === location.origin)
  //     {
  //       // let page;
  //       // this.GetNode().addEventListener("mouseover", event =>
  //       // {
  //       //   // const parent = this.QueryClosest("url");
  //       //   // if (parent)
  //       //   // {
  //       //   //   event.preventDefault();
  //       //   //   parent.Navigate(url);
  //       //   // }
  //       // });
  //       //
  //       // this.GetNode().addEventListener("mouseout", event =>
  //       // {
  //       //   // const parent = this.QueryClosest("url");
  //       //   // if (parent)
  //       //   // {
  //       //   //   event.preventDefault();
  //       //   //   parent.Navigate(url);
  //       //   // }
  //       // });
  //
  //       this.GetNode().addEventListener("click", event =>
  //       {
  //         const parent = this.QueryClosest("url");
  //         if (parent)
  //         {
  //           event.preventDefault();
  //           parent.Navigate(url);
  //         }
  //       });
  //     }
  //   }
  //
  //   return this.SetAttribute("href", url);
  // }
  //
  // ItemID(v){ return this.SetAttribute("itemid", v); }
  // ItemProp(v){ return this.SetAttribute("itemprop", v); }
  // ItemRef(v){ return this.SetAttribute("itemref", v); }
  // ItemScope(v){ return this.ToggleAttribute("itemscope", v); }
  // ItemType(v){ return this.SetAttribute("itemtype", v); }
  //
  // Type(v, d){ return this.SetAttribute("type", v, d); }
  // TypeDate(){ return this.Type("date"); }
  // TypeColor(){ return this.Type("color"); }
  // TypeButton(){ return this.Type("button"); }
  // TypeEmail(){ return this.Type("email"); }
  // TypeDateTimeLocal(){ return this.Type("datetime-local"); }
  // TypeFile(){ return this.Type("file"); }
  // TypeHidden(){ return this.Type("hidden"); }
  // TypeImage(){ return this.Type("image"); }
  // TypeMonth(){ return this.Type("month"); }
  // TypeNumber(){ return this.Type("number"); }
  // TypePassword(){ return this.Type("password"); }
  // TypeRadio(){ return this.Type("radio"); }
  // TypeRange(){ return this.Type("range"); }
  // TypeReset(){ return this.Type("reset"); }
  // TypeSearch(){ return this.Type("search"); }
  // TypeSubmit(){ return this.Type("submit"); }
  // TypeTel(){ return this.Type("tel"); }
  // TypeText(){ return this.Type("text"); }
  // TypeTime(){ return this.Type("time"); }
  // TypeURL(){ return this.Type("url"); }
  // TypeWeek(){ return this.Type("week"); }
  //
  // Expiration(date)
  // {
  //   if (typeof(date) === "number")
  //   {
  //     date = new Date(Date.now() + date);
  //   }
  //
  //   globalThis.setTimeout(() =>
  //   {
  //     if (this.HasAttribute("expiration") && this.IsInDocument())
  //     {
  //       const expiration = Number(this.GetAttribute("expiration"));
  //       if (expiration === date.getTime())
  //       {
  //         this.RemoveAttribute("expiration");
  //         this.Remove();
  //       }
  //     }
  //   }, date.getTime() - Date.now());
  //
  //   return this.SetAttribute("expiration", date.getTime());
  // }
  //
  // RoleNone(){ return this.Role("none"); }
  // RoleAlert(){ return this.Role("alert"); }
  // RoleAlertDialog(){ return this.Role("alertdialog"); }
  // RoleApplication(){ return this.Role("application"); }
  // RoleBanner(){ return this.Role("banner"); }
  // RoleButton(){ return this.Role("button"); }
  // RoleCell(){ return this.Role("cell"); }
  // RoleCheckbox(){ return this.Role("checkbox"); }
  // RoleComplementary(){ return this.Role("complementary"); }
  // RoleComboBox(){ return this.Role("combobox"); }
  // RoleContentInfo(){ return this.Role("contentinfo"); }
  // RoleDialog(){ return this.Role("dialog"); }
  // RoleDocument(){ return this.Role("document"); }
  // RoleFeed(){ return this.Role("feed"); }
  // RoleFigure(){ return this.Role("figure"); }
  // RoleForm(){ return this.Role("form"); }
  // RoleGrid(){ return this.Role("grid"); }
  // RoleGridCell(){ return this.Role("gridcell"); }
  // RoleHeading(){ return this.Role("heading"); }
  // RoleImg(){ return this.Role("img"); }
  // RoleList(){ return this.Role("list"); }
  // RoleListBox(){ return this.Role("listbox"); }
  // RoleListItem(){ return this.Role("listitem"); }
  // RoleMain(){ return this.Role("main"); }
  // RoleNavigation(){ return this.Role("navigation"); }
  // RolePresentation(){ return this.Role("presentation"); }
  // RoleProgressBar(){ return this.Role("progressbar"); }
  // RoleRegion(){ return this.Role("region"); }
  // RoleRow(){ return this.Role("row"); }
  // RoleRowGroup(){ return this.Role("rowgroup"); }
  // RoleSearch(){ return this.Role("search"); }
  // RoleSwitch(){ return this.Role("switch"); }
  // RoleTab(){ return this.Role("tab"); }
  // RoleTable(){ return this.Role("table"); }
  // RoleTabPanel(){ return this.Role("tabpanel"); }
  // RoleTextBox(){ return this.Role("textbox"); }
  // RoleTimer(){ return this.Role("timer"); }
  // RoleColumnHeader(){ return this.Role("columnheader"); }
  // RoleMenu(){ return this.Role("menu"); }
  // RoleMenuItem(){ return this.Role("menuitem"); }
  //
  // AriaAtomic         (v){ return this.SetAttribute("aria-atomic",          v); }
  // AriaAtomicTrue     (){ return this.AriaAtomic("true"); }
  // AriaAtomicFalse    (){ return this.AriaAtomic("false"); }
  // AriaBusy           (v){ return this.SetAttribute("aria-busy",            v); }
  // AriaControls       (v){ return this.SetAttribute("aria-controls",        v); }
  // AriaCurrent        (v){ return this.SetAttribute("aria-current",         v); }
  // AriaDescribedBy    (v){ return this.SetAttribute("aria-describedby",     v); }
  // AriaDetails        (v){ return this.SetAttribute("aria-details",         v); }
  // AriaDisabled       (v){ return this.SetAttribute("aria-disabled",        v); }
  // AriaDropEffect     (v){ return this.SetAttribute("aria-dropeffect",      v); }
  // AriaErrorMessage   (v){ return this.SetAttribute("aria-errormessage",    v); }
  // AriaExpanded       (v){ return this.SetAttribute("aria-expanded",        v); }
  // AriaFlowto         (v){ return this.SetAttribute("aria-flowto",          v); }
  // AriaGrabbed        (v){ return this.SetAttribute("aria-grabbed",         v); }
  // AriaHasPopUp       (v){ return this.SetAttribute("aria-haspopup",        v); }
  // AriaHidden         (v){ return this.SetAttribute("aria-hidden",          v); }
  // AriaHiddenTrue     (){ return this.AriaHidden("true"); }
  // AriaHiddenFalse    (){ return this.AriaHidden("false"); }
  // AriaInvalid        (v){ return this.SetAttribute("aria-invalid",         v); }
  // AriaKeyShortcuts   (v){ return this.SetAttribute("aria-keyshortcuts",    v); }
  // AriaLabel          (v){ return this.SetAttribute("aria-label",           v); }
  // AriaLabelledBy     (v){ return this.SetAttribute("aria-labelledby",      v); }
  // AriaLevel          (v){ return this.SetAttribute("aria-level",           v); }
  // AriaLive           (v){ return this.SetAttribute("aria-live",            v); }
  // AriaLiveOff        (){ return this.AriaLive("off"); } // Ignore updates
  // AriaLivePolite     (){ return this.AriaLive("polite"); } // Updates should be queued
  // AriaLiveAssertive  (){ return this.AriaLive("assertive"); }
  // AriaLiveRude       (){ return this.AriaLive("rude"); } // Updates to this should interrupt, INVASIVE
  // AriaModal          (v){ return this.SetAttribute("aria-modal",           v); }
  // AriaOwns           (v){ return this.SetAttribute("aria-owns",            v); }
  // AriaPressed        (v){ return this.SetAttribute("aria-pressed",         v); }
  // AriaRelevant       (v){ return this.SetAttribute("aria-relevant",        v); }
  // AriaRoleDescription(v){ return this.SetAttribute("aria-roledescription", v); }
  // AriaTreeItem       (v){ return this.SetAttribute("aria-treeitem",        v); }
  // AriaOrientation    (v){ return this.SetAttribute("aria-orientation",     v); }
  // AriaValueMin       (v){ return this.SetAttribute("aria-valuemin",        v); }
  // AriaValueNow       (v){ return this.SetAttribute("aria-valuenow",        v); }
  // AriaValueMax       (v){ return this.SetAttribute("aria-valuemax",        v); }
}

import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Body} from "/js/Tags/Body.js";

export class NotificationFrame extends Singleton
{
  // static GetNodeName(){ return "notification-frame"; }
  static SetNodeName(name = "notification-frame"){ return super.SetNodeName(name); }

  constructor(...args)
  {
    super(...args);
    Body.Get().AppendChild(this);
  }
}

// Tag.Constructor(NotificationFrame).Bind().Add(
//   Tag.Style().Add(
//     Tag.CSS("notification-frame")
//     .PositionFixed()
//     .Right("0")
//     .Bottom("0")
//     .Width("100%")
//     .Height("100%")
//     .DisplayFlex()
//     .ZIndex("10")
//     .ZIndex("10000")
//     .FlexDirectionColumnReverse()
//     .AlignItemsFlexEnd()
//     .PointerEventsNone(),
//   ),
// );

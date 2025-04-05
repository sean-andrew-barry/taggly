import "/flag#static";

// NOTE: Credit for this function goes to:
// https://stackoverflow.com/a/33456469
// Who in turn got it from jquery's source code at:
// https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
// Thank you!
export function IsNodeVisible(node)
{
  return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
}

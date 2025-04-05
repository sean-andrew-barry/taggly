import "/flag#static";

// CREDIT: StackOverflow user br4nnigan
// Their original answer can be found at: https://stackoverflow.com/a/44562952
// And their account can be found at: https://stackoverflow.com/users/1744461/br4nnigan
// Thank you!
export function NodeSwap(self, target)
{
  const n1 = self.GetNode();
  const n2 = self.Convert(target);

  let p1 = n1.parentNode;
  let p2 = n2.parentNode;
  let i1;
  let i2;

  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return self;

  // Find the index of the first node
  for (let i = 0; i < p1.children.length; i++)
  {
    if (p1.children[i].isEqualNode(n1))
    {
      i1 = i;
    }
  }

  // Find the index of the second node
  for (let i = 0; i < p2.children.length; i++)
  {
    if (p2.children[i].isEqualNode(n2))
    {
      i2 = i;
    }
  }

  // If both nodes have the same parent
  if (p1.isEqualNode(p2) && i1 < i2)
  {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);

  return self;
}

import "/flag#dangerous";

import {Directory} from "/js/FileSystem/Entry/Directory.js";

export class Domain extends Directory
{
  IsDomain(){ return true; }
  GetDomain(){ return this; }

  IsPrivate(){ return true; }

  IsPublic()
  {
    switch (this.GetName()?.toLowerCase())
    {
      case "public": return true;
      default: return false;
    }
  }
}

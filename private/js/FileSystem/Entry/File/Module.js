import "/flag#dangerous";
// import "/flag#frozen";

import fs, {promises as FSP} from "node:fs";
import node_path from "node:path";
import zlib from "node:zlib";
import vm from "node:vm";
import {Entry} from "/js/FileSystem/Entry.js";
import {Directory} from "/js/FileSystem/Entry/Directory.js";
import {File} from "/js/FileSystem/Entry/File.js";
import {Placeholder} from "/js/FileSystem/Entry/Placeholder.js";

export class Module extends File
{
  // Always valid
  Validate()
  {
    return this;
  }
}

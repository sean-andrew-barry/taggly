import "/flag#static";

import Express from "express";
export {Express};

import {Environment} from "/js/Environment.js";
Environment.DepreciateFile(import.meta.url);

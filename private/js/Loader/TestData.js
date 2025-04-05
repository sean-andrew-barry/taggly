import "/flag#json";
import os from "node:os";
import pkg from "loader:package" assert { type: "json" };

export const key1 = true;
export const key2 = "Hello" + " " + "world!";
export const key3 = Math.random();
export const is_little_endian = os.endianness() === "LE";
export function MyFunction(){}
export const MyFunction2 = function(){}
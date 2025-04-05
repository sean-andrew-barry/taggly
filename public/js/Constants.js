import CONSTANTS from "/js/ConstantsJSON.js" assert { type: "json" };
import { IsLittleEndian } from "/js/External/IsLittleEndian.js";

export const VERSION_MAJOR = CONSTANTS.VERSION_MAJOR;
export const VERSION_MINOR = CONSTANTS.VERSION_MINOR;
export const VERSION_PATCH = CONSTANTS.VERSION_PATCH;

// This refers to the server's endianness.
export const SERVER_IS_LITTLE_ENDIAN = CONSTANTS.SERVER_IS_LITTLE_ENDIAN;
// This refers to the client's own endianness.
export const SYSTEM_IS_LITTLE_ENDIAN = IsLittleEndian();
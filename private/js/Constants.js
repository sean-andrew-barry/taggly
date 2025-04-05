import os from "node:os";

export const VERSION_MAJOR = 0;
export const VERSION_MINOR = 0;
export const VERSION_PATCH = 0;

// This refers to the server's own endianness.
export const SERVER_IS_LITTLE_ENDIAN = os.endianness() === "LE";
// This also refers to the server's own endianness in this context, since the system is the server
export const SYSTEM_IS_LITTLE_ENDIAN = SERVER_IS_LITTLE_ENDIAN;
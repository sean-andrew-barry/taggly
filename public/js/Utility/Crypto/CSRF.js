// function GenerateKey()
// {
//   const array = new Uint8Array(24);
//   crypto.getRandomValues(array);
// }

// const secretKey = new Uint8Array(32);
// crypto.getRandomValues(secretKey);

// const message = new Uint8Array(32);
// crypto.getRandomValues(message);

// // Generate a random 16-byte salt
// const salt = crypto.getRandomValues(new Uint8Array(16));

// // Derive a key from the secret key and salt using the HKDF algorithm
// const derivedKey = await crypto.subtle.importKey(
//   "raw",
//   secretKey,
//   { name: "HKDF" },
//   false,
//   ["deriveBits"],
// );

// const keyMaterial = await crypto.subtle.deriveBits(
//   { name: "HKDF", salt: salt, hash: "SHA-256", info: new TextEncoder().encode("token") },
//   derivedKey,
//   256,
// );

// // Generate a message authentication code using the HMAC-SHA256 algorithm
// const macKey = await crypto.subtle.importKey(
//   "raw",
//   keyMaterial,
//   { name: "HMAC", hash: "SHA-256" },
//   false,
//   ["sign"],
// );

// const verifyMacKey = await crypto.subtle.importKey(
//   "raw",
//   keyMaterial,
//   { name: "HMAC", hash: "SHA-256" },
//   false,
//   ["verify"]
// );

// // const token = new TextEncoder().encode(message);
// const mac = await crypto.subtle.sign("HMAC", macKey, message);
// const isValid = await crypto.subtle.verify("HMAC", verifyMacKey, mac, message);

// const bad_message = new Uint8Array(32);
// crypto.getRandomValues(bad_message);

// const isValid2 = await crypto.subtle.verify("HMAC", verifyMacKey, mac, bad_message);

// // const hexString = Array.from(bad_message, byte => byte.toString(16).padStart(2, '0')).join('');

// function arrayBufferToHexString(buffer) {
//   const array = new Uint32Array(buffer);

//   let hexString = '';

//   for (let i = 0; i < array.length; i++) {
//     hexString += array[i].toString(16);
//   }

//   return hexString;
// }

// function arrayBufferToBase64(buffer) {
//   const bytes = new Uint8Array(buffer);
  
//   let binary = '';

//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }

//   return globalThis.btoa(binary);
// }

// console.log(arrayBufferToHexString(mac), arrayBufferToBase64(mac), new TextDecoder().decode(mac), isValid, isValid2);

// let csrf;
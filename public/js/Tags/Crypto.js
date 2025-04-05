import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Crypto extends Singleton
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "crypto"; }

  constructor()
  {
    super();
    this.usages = [];
    this.extractable = false;
  }

  AES_CTR()
  {
    this.SetFormatRaw();
    this.AddUsageEncrypt();
    this.AddUsageDecrypt();
    this.SetAlgorithmAES_CTR();
  }

  SetAlgorithm(algorithm){ this.algorithm = algorithm; }
  SetAlgorithmAES_CTR(algorithm)
  {
    return this.SetAlgorithm({
      name: "AES-CTR",
      length: 64,
      counter: new Uint8Array(16),
    });
  }

  SetFormat(format){ this.format = format; return this; }
  SetFormatRaw(){ return this.SetFormat("raw"); }
  SetFormatPKCS8(){ return this.SetFormat("pkcs8"); }
  SetFormatSPKI(){ return this.SetFormat("spki"); }
  SetFormatJWK(){ return this.SetFormat("jwk"); }
  GetFormat(){ return this.format || "raw"; }

  AddUsage(usage){ this.usages.push(usage); return this; }
  AddUsageEncrypt(){ return this.AddUsage("encrypt"); }
  AddUsageDecrypt(){ return this.AddUsage("decrypt"); }
  AddUsageSign(){ return this.AddUsage("sign"); }
  AddUsageVerify(){ return this.AddUsage("verify"); }
  AddUsageDeriveKey(){ return this.AddUsage("deriveKey"); }
  AddUsageDeriveBits(){ return this.AddUsage("deriveBits"); }
  AddUsageWrapKey(){ return this.AddUsage("wrapKey"); }
  AddUsageUnwrapKey(){ return this.AddUsage("unwrapKey"); }

  async HashPassword(password)
  {
    const encoded = new TextEncoder().encode(password); // encode password as UTF-8
    return await window.crypto.subtle.digest("SHA-256", encoded); // Hash the password
  }

  async ImportKey(password)
  {
    const encoded = new TextEncoder().encode(password); // encode password as UTF-8
    const hash = await window.crypto.subtle.digest("SHA-256", encoded); // Hash the password

    this.key = await window.crypto.subtle.importKey(
      await this.GetFormat(),
      hash,
      this.GetAlgorithm(),
      this.IsExtractable(),
      this.GetUsages(),
    );
  }

  async Encrypt(data)
  {
    // If the data isn't already in a buffer, encode it as one
    if (!(data instanceof Buffer))
    {
      const buffer = new Buffer();
      buffer.Write(data);
      buffer.Shrink();
      data = buffer.GetBuffer();
    }

    const encrypted = await window.crypto.subtle.encrypt(
      await this.GetAlgorithm(),
      await this.GetKey(),
      data,
    );

    return new Uint8Array(encrypted);
  }

  async Decrypt(data)
  {
    const decrypted = await window.crypto.subtle.decrypt(
      await this.GetAlgorithm(),
      await this.GetKey(),
      data,
    );

    const buffer = new Buffer(decrypted);
    return buffer.Read();
  }

  GenerateRandomValues(bytes = 16){ return window.crypto.getRandomValues(new Uint8Array(bytes)); }

  IsExtractable(){ return this.extractable === true; }
  GetUsages(){ return this.usages; }
  GetKey(){ return this.key; }
  GetAlgorithm(){ return this.algorithm; }
  // GetKey(){ return this.key || (throw new Error(`${this.constructor.name} has not yet been given an encryption key`)); }
  // GetAlgorithm(){ return this.algorithm || (throw new Error(`${this.constructor.name} has not yet been given an encryption algorithm`)); }
}

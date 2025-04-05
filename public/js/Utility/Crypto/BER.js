// Parse raw data as a X.509 certificate object
export class BER
{
  static Encode(buffer, value)
  {
  }

  static Decode(buffer)
  {
  }

  SerialNumber(serial_number){ return this.SetAttribute("serial_number", serial_number); }

  GetBase64(...types)
  {
  }

  toString()
  {
    return [
      this.GetPrefix(),
      this.GetBase64(),
      this.GetPostfix(),
    ].join("\r\n");
  }

  GetPrefix(value){ return `-----${value}-----`; }
  GetPostfix(value){ return `-----${value}-----`; }
}

export class Certificate extends BER
{
  constructor()
  {
    super();
    this.tbs = new ArrayBuffer(0);
    this.version = 0;
    this.serial_number = new Integer();
    this.signature = new AlgorithmIdentifier();
    this.issuer = new RelativeDistinguishedNames();
    this.not_before = new Date();
    this.not_after = new Date();
    this.subject = new RelativeDistinguishedNames();
    this.subject_public_key_info = new PublicKeyInfo();
    this.issuer_unique_id = new ArrayBuffer();
    this.subject_unique_id = new ArrayBuffer();
    this.extensions = [];
    this.signature_algorithm = new AlgorithmIdentifier();
    this.signature_value = new BitString();
  }

  GetPrefix(){ return super.GetPrefix("BEGIN CERTIFICATE"); }
  GetPostfix(){ return super.GetPostfix("END CERTIFICATE"); }

  // Importing public key for current certificate
  GetPublicKey(parameters)
	{
		return crypto.subtle.getPublicKey(
      this.subject_public_key_info,
      this.signature_algorithm,
      parameters,
    );
	}

  // Get hash value for subject public key (default SHA-1)
  GetKeyHash(hash_algorithm = "SHA-1")
	{
		return crypto.digest(
      { name: hash_algorithm },
      new Uint8Array(this.subject_public_key_info.subjectPublicKey.valueBlock.valueHex),
    );
	}

  // Make a signature for current value from TBS section
  async Sign(private_key, hash_algorithm = "SHA-1")
  {
		if (private_key === undefined)
		{
      throw new Error("Need to provide a private key for signing");
    }

		// Get a "default parameters" for current algorithm and set correct signature algorithm
		const {
      parameters,
      signatureAlgorithm,
    } = await globalThis.crypto.subtle.getSignatureParameters(private_key, hash_algorithm)

    this.signature = signatureAlgorithm;
    this.signature_algorithm = signatureAlgorithm;

		// Create TBS data for signing
		this.tbs = this.encodeTBS().toBER(false);

		// Signing TBS data on provided private key
		const result = await globalThis.crypto.subtle.signWithPrivateKey(this.tbs, private_key, parameters);

		this.signature_value = new BitString({ valueHex: result });

		return sequence;
  }

  async Verify(issuerCertificate)
  {
    let subjectPublicKeyInfo = {};

    if (issuerCertificate)
    {
      subjectPublicKeyInfo = issuerCertificate.subjectPublicKeyInfo;
    }
    else
    {
      // Self-signed certificate
      if (this.issuer.isEqual(this.subject))
		  {
        subjectPublicKeyInfo = this.subjectPublicKeyInfo;
      }
    }

    if (!(subjectPublicKeyInfo instanceof PublicKeyInfo))
    {
      throw new Error("Please provide issuer certificate as a parameter");
    }

    return await globalThis.crypto.subtle.verifyWithPublicKey(this.tbs, this.signature_value, subjectPublicKeyInfo, this.signature_algorithm);
  }
}

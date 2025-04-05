import {URL} from "/js/URL.js";
import {window} from "/js/Window.js";

export class DigitalOcean
{
  constructor(token, base = "https://api.digitalocean.com/v2/domains")
  {
    this.base = base;

    this.headers = new window.Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", `Bearer ${token}`);
  }

  GetProtocol(){ return "dns-01"; }

  GetRecordTXT({
    zone,
    dnsPrefix,
    txt,
    type = "TXT",
  })
  {
    return URL.Get(`${this.base}/${zone}/records`).Headers(this.headers).AsJSON().then(result =>
    {
      // console.log("GetRecordTXT", result);

      return result?.domain_records?.find(r =>
      {
        // console.log("Matching", r);
        return r.type === type
            && r.name === dnsPrefix
            && r.data === txt;
      });
    });
  }

  GetZoneNames(data)
  {
    return URL.Get(`${this.base}/`).Headers(this.headers).AsJSON().then(result =>
    {
      // console.log("GetZoneNames", result);
      return result.domains.map(d => d.name);
    });
  }

  init(options)
  {
    console.log("init options:", options);
  }

  zones(data)
  {
    return this.GetZoneNames(data);
  }

  set({challenge, dnsAuthorization})
  {
    return URL
    .Post(`${this.base}/${challenge.dnsZone}/records`)
    .Headers(this.headers)
    .Body({
      type: "TXT",
      name: challenge.dnsPrefix,
      data: dnsAuthorization,
      ttl: 300,
    })
    .AsJSON()
    .then(data =>
    {
      console.log("set response:", data);
      if (data?.domain_record?.data === dnsAuthorization)
      {
        return true;
      }
      else
      {
        throw new Error('record did not set. check subdomain, api key, etc');
      }
    });
  }

  remove({challenge})
  {
    // Digital ocean provides the api to remove records by ID. So we first get the recordId and use it to remove the domain record
    return this.GetRecordTXT({
      dnsPrefix: challenge.dnsPrefix,
      zone: challenge.dnsZone,
      txt: challenge.dnsAuthorization,
    })
    .then(record =>
    {
      console.log("remove got", record);

      if (record)
      {
        return URL.Delete(`${this.base}/${challenge.dnsZone}/records/${record.id}`).AsJSON().then(result =>
        {
          return true;
        });
      }
      else
      {
        throw new Error("Txt Record not found for removal");
      }
    });
  }

  get({challenge})
  {
    return this.GetRecordTXT({
      dnsPrefix: challenge.dnsPrefix,
      zone: challenge.dnsZone,
      txt: challenge.dnsAuthorization,
    })
    .then(record =>
    {
      console.log("get got", record);

      if (record)
      {
        return {
          dnsAuthorization: record.data,
        };
      }
      else
      {
        return null;
      }
    });
  }
}

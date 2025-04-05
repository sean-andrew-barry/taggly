const domains = ["private", "public"];
const specifier = "/js/Tags/Div.js";

// Each layer is an absolute path, like "C:/Users/User/Documents/MyWebsite"
for (const layer of this.GetLayers())
{
  for (const domain of domains)
  {
    const result = layer.Resolve(`${domain}${specifier}`);
    if (result) return result;
  }
}

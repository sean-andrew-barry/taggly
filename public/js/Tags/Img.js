import {Tag} from "/js/Tag.js";
import {Load} from "/js/Event/Load.js";

export class Img extends Tag
{
  static GetLocalName(){ return "img"; }
  static GetMetaURL(){ return import.meta.url; }

  async Load(url)
  {
    this.SetAttribute("src", url);
    await this.OnLoad();
    return this;
  }

  Apply(action, args)
  {
    switch (action)
    {
      // case "src": throw new Error("Test error on src");
      case "onerror": return console.warn(`Tag.Image does not allow onerror to be automatically applied as it is a potential security risk. Use Tag.Image().OnError() instead.`);
      default: return super.Apply(action, args);
    }
  }

  Rescale(width, height, max_width, max_height)
  {
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    const node = this.GetNode();
    node.width = width;
    node.height = height;

    return this;
  }

  FullSize()
  {
    const node = this.GetNode();
    node.width = node.naturalWidth;
    node.height = node.naturalHeight;
    return this;
  }

  Blob(blob, type = "image/png")
  {
    if (!(blob instanceof Blob))
    {
      blob = new Blob([blob], { type });
    }

    const url = URL.createObjectURL(blob);
    this.object_url = url;

    return this.Src(url);
  }

  [Load](event)
  {
    if (this.object_url)
    {
      URL.revokeObjectURL(this.object_url);
      delete this.object_url;
    }
  }

  ToBase64(type = "image/png")
  {
    const img = this.GetNode();

    // Create an empty canvas element
    const canvas = Tag.Canvas();

    // let canvas = document.createElement("canvas");
    // canvas.width = img.width;
    // canvas.height = img.height;

    canvas.Rescale(0, 0, img.width, img.height);

    // canvas.width = img.naturalWidth || img.width;
    // canvas.height = img.naturalHeight || img.height;

    // Copy the image contents to the canvas
    let ctx = canvas.GetNode().getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    let dataURL = canvas.GetNode().toDataURL(type);

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  ToBase64(type = "image/png", x = 0, y = 0, w = this.GetNaturalWidth(), h = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    // Create an empty canvas element
    const canvas = Tag.Canvas();

    // let canvas = document.createElement("canvas");
    canvas.GetNode().width = img.width;
    canvas.GetNode().height = img.height;
    // canvas.GetNode().width = w;
    // canvas.GetNode().height = h;

    canvas.DrawImage(this);

    // canvas.width = img.naturalWidth || img.width;
    // canvas.height = img.naturalHeight || img.height;

    // // Copy the image contents to the canvas
    // let ctx = canvas.GetNode().getContext("2d");
    // ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    let dataURL = canvas.GetNode().toDataURL(type);

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  ToBase64(type = "image/png", x = 0, y = 0, w = this.GetNaturalWidth(), h = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    // Create an empty canvas element
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    // canvas.GetNode().width = w;
    // canvas.GetNode().height = h;

    // canvas.DrawImage(this);

    // canvas.width = img.naturalWidth || img.width;
    // canvas.height = img.naturalHeight || img.height;

    // Copy the image contents to the canvas
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, x, y);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    let dataURL = canvas.toDataURL(type);

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  ToBase64(type = "image/png", max_width = this.GetNaturalWidth(), max_height = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    let width = img.width;
    let height = img.height;
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    // Create an empty canvas element
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Copy the image contents to the canvas
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    let dataURL = canvas.toDataURL(type);

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  ToArrayBuffer(type = "image/png", max_width = this.GetNaturalWidth(), max_height = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    let width = img.width;
    let height = img.height;
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    // Create an empty canvas element
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Copy the image contents to the canvas
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, width, height).data;
  }

  ToBitmap(type = "image/png", max_width = this.GetNaturalWidth(), max_height = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    let width = img.width;
    let height = img.height;
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    return createImageBitmap(img, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "high",
    }).then(bitmap =>
    {
      // Create an empty canvas element
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // Copy the image contents to the canvas
      let ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0, width, height);

      return new Promise((resolve, reject) =>
      {
        canvas.toBlob(blob =>
        {
          console.log("Read canvas as blob");
          const reader = new FileReader();
          reader.onload = (event) =>
          {
            resolve(new Uint8Array(event.target.result));
            // const array_buffer = event.target.result;
          }

          reader.readAsArrayBuffer(blob);
        }, type);
      });
    });
  }

  ToArrayBuffer(type = "image/png", max_width = this.GetNaturalWidth(), max_height = this.GetNaturalHeight())
  {
    const img = this.GetNode();

    let width = img.width;
    let height = img.height;
    if (width > height)
    {
      if (width > max_width)
      {
        height *= max_width / width;
        width = max_width;
      }
    }
    else
    {
      if (height > max_height)
      {
        width *= max_height / height;
        height = max_height;
      }
    }

    // Create an empty canvas element
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Copy the image contents to the canvas
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) =>
    {
      canvas.toBlob(blob =>
      {
        console.log("Read canvas as blob");
        const reader = new FileReader();
        reader.onload = (event) =>
        {
          resolve(new Uint8Array(event.target.result));
          // const array_buffer = event.target.result;
        }

        reader.readAsArrayBuffer(blob);
      }, type);
    });

    // return ctx.getImageData(0, 0, width, height).data;
  }

  GetNaturalWidth(){ return this.GetNode().naturalWidth; }
  GetNaturalHeight(){ return this.GetNode().naturalHeight; }
}

export {Img as IMG};

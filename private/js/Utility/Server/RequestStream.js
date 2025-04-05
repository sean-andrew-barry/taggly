export class RequestStream
{
  #stream;

  constructor(stream, headers)
  {
    this.#stream = stream;
  }
}

export class Promise extends window.Promise
{
  static Sleep(ms)
  {
    return new window.Promise(resolve => setTimeout(resolve, ms));
  }
}

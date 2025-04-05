export class BitSet
{
  #value = 0;

  Has(index)
  {
    return (this.#value & (1 << index)) !== 0;
  }

  Add(index)
  {
    this.#value |= (1 << index);
  }

  Delete(index)
  {
    this.#value &= ~(1 << index);
  }

  Toggle(index)
  {
    this.#value ^= (1 << index);
  }

  Copy(bitset)
  {
    this.#value = bitset.GetValue();
  }

  GetValue(){ return this.#value; }
  Clear(){ this.#value = 0; }

  toString()
  {
    let value = this.#value;
    let string = "";

    for (let i = 1; i <= 32; i++)
    {
      string += value >>> 31;
      value <<= 1;

      if (i % 8 === 0) string += " ";
    }

    return string;
  }
}

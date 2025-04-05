import {Cyrb} from "/js/External/HashCyrb53.js";
import {Number} from "/js/Number.js";
import {Uint8Array} from "/js/TypedArray.js";

const SPACE = "\t\n\v\f\r ";
const DIGIT = "0123456789";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const PUNCT = "!\"#$%&'()*+,-./:;<=>?@[\\]^_|`{}~";
const ALPHA = UPPER + LOWER;
const ALNUM = ALPHA + DIGIT;
const HEX   = "abcdefABCDEF" + DIGIT;

const SPACE_SET = new Set(SPACE);
const ALPHA_SET = new Set(ALPHA);
const ALNUM_SET = new Set(ALNUM);
const UPPER_SET = new Set(UPPER);
const LOWER_SET = new Set(LOWER);
const DIGIT_SET = new Set(DIGIT);
const PUNCT_SET = new Set(PUNCT);
const HEX_SET   = new Set(HEX);

const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

const NEWLINE_CAPTURE_REGEXP = /(\n|\r\n?|\u2028|\u2029)/g;
const NEWLINE_REGEXP = /\r?\n|\u2028|\u2029/;
const DEDENT_CACHE = new WeakMap();
const DEDENT_STRING_CACHE = new Map();

export class String extends globalThis.String
{
  static HashCyrb32(...args){ return Cyrb.Hash32(...args); }
  static HashCyrb53(...args){ return Cyrb.Hash53(...args); }

  static GetSpace(){ return SPACE; }
  static GetAlpha(){ return ALPHA; }
  static GetAlnum(){ return ALNUM; }
  static GetUpper(){ return UPPER; }
  static GetLower(){ return LOWER; }
  static GetDigit(){ return DIGIT; }
  static GetPunct(){ return PUNCT; }
  static GetHex  (){ return HEX  ; }

  static GetSpaceSet(){ return SPACE_SET; }
  static GetAlphaSet(){ return ALPHA_SET; }
  static GetAlnumSet(){ return ALNUM_SET; }
  static GetUpperSet(){ return UPPER_SET; }
  static GetLowerSet(){ return LOWER_SET; }
  static GetDigitSet(){ return DIGIT_SET; }
  static GetPunctSet(){ return PUNCT_SET; }
  static GetHexSet  (){ return HEX_SET  ; }

  static IsCharSpace(c)
  {
    switch (c)
    {
      case "\t":
      case "\n":
      case "\v":
      case "\f":
      case "\r":
      case "\u2028": // line separator
      case "\u2029": // paragraph separator
      case " ": return true;
      default: return false;
    }
  }

  static IsCharLower(c)
  {
    switch (c)
    {
      case "a":
      case "b":
      case "c":
      case "d":
      case "e":
      case "f":
      case "g":
      case "h":
      case "i":
      case "j":
      case "k":
      case "l":
      case "m":
      case "n":
      case "o":
      case "p":
      case "q":
      case "r":
      case "s":
      case "t":
      case "u":
      case "v":
      case "w":
      case "x":
      case "y":
      case "z": return true;
      default: return false;
    }
  }

  static IsCharUpper(c)
  {
    switch (c)
    {
      case "A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "H":
      case "I":
      case "J":
      case "K":
      case "L":
      case "M":
      case "N":
      case "O":
      case "P":
      case "Q":
      case "R":
      case "S":
      case "T":
      case "U":
      case "V":
      case "W":
      case "X":
      case "Y":
      case "Z": return true;
      default: return false;
    }
  }

  static IsCharHex(c)
  {
    switch (c)
    {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "F":
      case "a":
      case "b":
      case "c":
      case "d":
      case "e":
      case "f": return true;
      default: return false;
    }
  }

  static IsCharAlpha(c){ return this.IsCharLower(c) || this.IsCharUpper(c); }
  static IsCharAlNum(c){ return this.IsCharAlpha(c) || this.IsCharDigit(c); }

  static IsCharBreak(c)
  {
    switch (c)
    {
      case "\u2028": // line separator
      case "\u2029": // paragraph separator
      case "\n": return true;
      default: return false;
    }
  }

  static IsCharDigit(c)
  {
    switch (c)
    {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": return true;
      default: return false;
    }
  }

  static IsCharPunct(c)
  {
    switch (c)
    {
      case "!":
      case "\"":
      case "#":
      case "$":
      case "%":
      case "&":
      case "'":
      case "(":
      case ")":
      case "*":
      case "+":
      case ",":
      case "-":
      case ".":
      case "/":
      case ":":
      case ";":
      case "<":
      case "=":
      case ">":
      case "?":
      case "@":
      case "[":
      case "\\":
      case "]":
      case "^":
      case "_":
      case "|":
      case "`":
      case "{":
      case "}":
      case "~": return true;
      default: return false;
    }
  }

  static IsCharSpace(c){ return this.GetSpaceSet().has(c); }
  static IsCharAlpha(c){ return this.GetAlphaSet().has(c); }
  static IsCharAlNum(c){ return this.GetAlnumSet().has(c); }
  static IsCharUpper(c){ return this.GetUpperSet().has(c); }
  static IsCharLower(c){ return this.GetLowerSet().has(c); }
  static IsCharDigit(c){ return this.GetDigitSet().has(c); }
  static IsCharPunct(c){ return this.GetPunctSet().has(c); }
  static IsCharHex  (c){ return this.GetHexSet  ().has(c); }

  static IsPointLower(p){ return p >= 0x0061 && p <= 0x007A; }
  static IsPointUpper(p){ return p >= 0x0041 && p <= 0x005A; }
  static IsPointDigit(p){ return p >= 0x0030 && p <= 0x0039; }
  static IsPointAlpha(p){ return this.IsPointLower(p) || this.IsPointUpper(p); }
  static IsPointAlNum(p){ return this.IsPointLower(p) || this.IsPointUpper(p) || this.IsPointDigit(p); }

  static IsPointPunct(p)
  {
    return (p >= 0x21 && p <= 0x2F)  // !"#$%&'()*+,-./
        || (p >= 0x3A && p <= 0x40)  // :;<=>?@
        || (p >= 0x5B && p <= 0x60)  // [\]^_`
        || (p >= 0x7B && p <= 0x7E); // {|}~
  }

  static IsPointHex(p)
  {
    return (p >= 0x0030 && p <= 0x0039)  // 0-9
        || (p >= 0x0041 && p <= 0x0046)  // A-F
        || (p >= 0x0061 && p <= 0x0066); // a-f
  }

  static IsPointSpace(p)
  {
    switch (p)
    {
      case 0x09:   // \t
      case 0x0A:   // \n
      case 0x0B:   // \v
      case 0x0C:   // \f
      case 0x0D:   // \r
      case 0x20:   // Space
      case 0x2028: // Line separator
      case 0x2029: // Paragraph separator
      {
        return true;
      }
      default:
      {
        return false;
      }
    }
  }

  static IsPointBreak(p)
  {
    switch (p)
    {
      case 0x2028: // line separator
      case 0x2029: // paragraph separator
      case 0x0A: return true; // \n
      default: return false;
    }
  }

  // Test if a portion of a string exclusively has characters of a Set
  static IsStringInSet(string, set, begin = 0, end = string.length)
  {
    if (typeof(string) !== "string")
    {
      throw new TypeError(`Expected parameter "string" to be type "string", but got type "${typeof(this.value)}"`);
    }

    for (const c of string)
    {
      if (!set.has(c))
      {
        return false;
      }
    }

    return true;
  }

  static IsStringAlpha(s, b, e){ return this.IsStringInSet(s, this.GetAlphaSet(), b, e); }
  static IsStringAlNum(s, b, e){ return this.IsStringInSet(s, this.GetAlNumSet(), b, e); }
  static IsStringUpper(s, b, e){ return this.IsStringInSet(s, this.GetUpperSet(), b, e); }
  static IsStringLower(s, b, e){ return this.IsStringInSet(s, this.GetLowerSet(), b, e); }
  static IsStringDigit(s, b, e){ return this.IsStringInSet(s, this.GetDigitSet(), b, e); }
  static IsStringSpace(s, b, e){ return this.IsStringInSet(s, this.GetSpaceSet(), b, e); }
  static IsStringPunct(s, b, e){ return this.IsStringInSet(s, this.GetPunctSet(), b, e); }
  static IsStringHex  (s, b, e){ return this.IsStringInSet(s, this.GetHexSet  (), b, e); }

  static SplitIntoLines(string){ return string.split(NEWLINE_REGEXP); }
  static SplitIntoLinesAndCapture(string){ return string.split(NEWLINE_CAPTURE_REGEXP); }

  static Dedent(strings, ...values)
  {
    // If it's called with a string, instead of as a template literal
    if (typeof strings === "string")
    {
      if (!DEDENT_STRING_CACHE.has(strings))
      {
        DEDENT_STRING_CACHE.set(strings, [strings]);
      }

      return this.Dedent(DEDENT_STRING_CACHE.get(strings));
    }

    if (!DEDENT_CACHE.has(strings))
    {
      const groups = strings.map(string => this.SplitIntoLinesAndCapture(string));

      const first = groups[0];
      const last = groups[groups.length - 1];

      if (first[0].length > 0)
      {
        throw new Error(`String.Dedent must begin with a new line character, but it found "${first[0]}"`);
      }

      if (!this.IsStringSpace(last[last.length - 1]))
      {
        throw new Error(`String.Dedent must not have any non-whitespace characters on its last line, but it has "${last[last.length - 1].trim()}"`);
      }

      first[1] = ""; // Wipe the leading \n character
      last[last.length - 2] = ""; // Wipe the trailing \n character
      last[last.length - 1] = ""; // Wipe any trailing whitespace

      let common_indent = "";
      for (let i = 0; i < groups.length; i++)
      {
        const parts = groups[i];

        // Start from 2, because either elements 0 and 1 are just
        // the end of the previous line and the captured newline character
        // OR because they are just a partial line, like what's between two template expressions
        // Either way, anything before 2 does not determine the shortest common indent
        for (let j = 2; j < parts.length; j += 2)
        {
          const part = parts[j];
  
          // Capture all the leading white space in the line
          let indent = "";
          for (const c of part)
          {
            if (!this.IsCharSpace(c)) break;
            
            indent += c;
          }

          // The logic here can be a little confusing, but basically since the groups
          // array is just the strings array split at new lines,
          // that means every parts array ends for 1 of 2 reasons:
          // 
          // 1. We've reached the end of the template literal string (it's the last parts array)
          // 2. That's where the strings array was split
          // 
          // So if we aren't iterating the last parts array, and we are at the end of these parts,
          // it must be because the next section has an expression
          const preceeds_template_expression = j === parts.length - 1 && parts !== last;

          // If the line doesn't contain a template expression and is only whitespace
          if (!preceeds_template_expression && indent.length === part.length)
          {
            // Then clear it
            parts[j] = "";
          }
          // If this is the first indent we've seen or it's smaller than the previous indent
          else if (common_indent === "" || indent.length < common_indent.length)
          {
            // Then store it
            common_indent = indent;
          }
        }
      }

      for (let i = 0; i < groups.length; i++)
      {
        const parts = groups[i];
        
        let merged = parts[0];
        for (let j = 1; j < parts.length; j += 2)
        {
          // Here we re-add the newline portion and remove the common indent
          merged += parts[j] + parts[j + 1].slice(common_indent.length);
        }

        groups[i] = merged;
      }

      DEDENT_CACHE.set(strings, groups);
    }

    const groups = DEDENT_CACHE.get(strings);

    let rendered = "";
    for (let i = 0; i < groups.length; i++)
    {
      rendered += groups[i];

      if (values.length > i) rendered += values[i];
    }

    return rendered;
  }

  static RandomCharacter(string = this.GetAlpha())
  {
    return Number.RandomIndex(string, string.size);
  }

  static RandomString(length = 5, string = this.GetAlpha())
  {
    let result = "";
    for (let i = 0; i < length; i++)
    {
      result += this.RandomCharacter(string);
    }

    return result;
  }

  static UseASCII(){ return true; }

  // NOTE: Should the size be encoded as an I32, or a I16? Or perhaps a I64? Doubt that's necessary
  static Encode(buffer, string)
  {
    if (this.UseASCII())
    {
      let is_ascii = true;

      for (let i = 0; i < string.length; i++)
      {
        const code = string.charCodeAt(i);
        if (code > 125)
        {
          is_ascii = false;
        }
      }

      if (is_ascii)
      {
        // If it's ASCII, simply write the length as negative
        buffer.WriteI32(-string.length);

        for (let i = 0; i < string.length; i++)
        {
          buffer.WriteU8(string.charCodeAt(i));
        }

        return;
      }
    }

    buffer.WriteI32(string.length);

    for (let i = 0; i < string.length; i++)
    {
      buffer.WriteU16(string.charCodeAt(i));
    }
  }

  static Decode(buffer)
  {
    let string = "";
    const length = buffer.ReadI32();

    if (this.UseASCII())
    {
      // A negative length means it's ASCII encoded
      if (Math.sign(length) === -1)
      {
        const l = Math.abs(length);

        for (let i = 0; i < l; i++)
        {
          string += globalThis.String.fromCharCode(buffer.ReadU8());
        }

        return string;
      }
    }

    for (let i = 0; i < length; i++)
    {
      string += globalThis.String.fromCharCode(buffer.ReadU16());
    }

    return string;
  }

  static _Encode(buffer, string)
  {
    const encoded = TEXT_ENCODER.encode(string);

    // const start = buffer.GetOffset();

    // console.log("String encoding", encoded.byteLength, encoded.length, "bytes from", encoded);

    // Write the length
    buffer.WriteU32(encoded.byteLength);

    // const start = buffer.GetOffset();

    for (let i = 0; i < encoded.length; i++)
    {
      buffer.WriteU8(encoded[i]);
    }

    // console.log("Done encoding string, offset is", buffer.GetOffset(), start);

    buffer.WriteFrom(encoded);
  }

  static _Decode(buffer)
  {
    const length = buffer.ReadU32(); // Read string size, which advances the offset
    const offset = buffer.GetOffset(); // Now save that offset as the start point

    buffer.Advance(length);

    // Read `length` characters starting from the `offset`
    const data = new globalThis.Uint8Array(buffer.GetBuffer(), offset, length);
    return TEXT_DECODER.decode(data);
  }

  static EncodeUTF8(buffer, string)
  {
    let Len = str.length;
    let resPos = -1;

    // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
    //  takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
    //  have an auto expanding length and 1.5x should be just the right balance for most uses.
    var resArr = typeof Uint8Array === "undefined" ? new Array(Len * 1.5) : new Uint8Array(Len * 3);

    for (var point = 0, nextcode = 0, i = 0; i !== Len; )
    {
        point = str.charCodeAt(i), i += 1;
        if (point >= 0xD800 && point <= 0xDBFF)
        {
            if (i === Len)
            {
                resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                resArr[resPos += 1] = 0xbd/*0b10111101*/; break;
            }
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            nextcode = str.charCodeAt(i);
            if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
                point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
                i += 1;
                if (point > 0xffff) {
                    resArr[resPos += 1] = (0x1e/*0b11110*/<<3) | (point>>>18);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                    continue;
                }
            } else {
                resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                resArr[resPos += 1] = 0xbd/*0b10111101*/; continue;
            }
        }
        if (point <= 0x007f) {
            resArr[resPos += 1] = (0x0/*0b0*/<<7) | point;
        } else if (point <= 0x07ff) {
            resArr[resPos += 1] = (0x6/*0b110*/<<5) | (point>>>6);
            resArr[resPos += 1] = (0x2/*0b10*/<<6)  | (point&0x3f/*0b00111111*/);
        } else {
            resArr[resPos += 1] = (0xe/*0b1110*/<<4) | (point>>>12);
            resArr[resPos += 1] = (0x2/*0b10*/<<6)    | ((point>>>6)&0x3f/*0b00111111*/);
            resArr[resPos += 1] = (0x2/*0b10*/<<6)    | (point&0x3f/*0b00111111*/);
        }
    }
    if (typeof Uint8Array !== "undefined") return resArr.subarray(0, resPos + 1);
    // else // IE 6-9
    resArr.length = resPos + 1; // trim off extra weight
    return resArr;
  }

  static EncodeUTF8(buffer, string)
  {
    // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
    // takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
    // have an auto expanding length and 1.5x should be just the right balance for most uses.

    const start = buffer.GetOffset();

    // Write a 0 for the length for now
    buffer.WriteU32(0);

    const length = string.length;
    for (let i = 0; i < length;)
    {
      let point = string.charCodeAt(i);
      i += 1;

      if (point >= 0b11011000_00000000 && point <= 0b11011011_11111111)
      {
        if (i === length)
        {
          buffer.WriteU8(0b11101111);
          buffer.WriteU8(0b10111111);
          buffer.WriteU8(0b10111101);

          break;
        }

        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        const next_code = string.charCodeAt(i);
        if (next_code >= 0xDC00 && next_code <= 0xDFFF)
        {
          point = (point - 0xD800) * 0x400 + next_code - 0xDC00 + 0x10000;
          i += 1;

          if (point > 0xffff)
          {
            buffer.WriteU8((0x1e << 3) | (point >>> 18));
            buffer.WriteU8((0x2  << 6) | ((point >>> 12) & 0x3f));
            buffer.WriteU8((0x2  << 6) | ((point >>> 6) & 0x3f));
            buffer.WriteU8((0x2  << 6) | (point & 0x3f));
            continue;
          }
        }
        else
        {
          // Can two of these be combined into a WriteU16?
          // buffer.WriteU16(0xef + 0xbf);
          buffer.WriteU8(0xef);
          buffer.WriteU8(0xbf);
          buffer.WriteU8(0b10111101);
          continue;
        }
      }

      if (point <= 0x007f)
      {
        buffer.WriteU8((0b0 << 7) | point);
      }
      else if (point <= 0x07ff)
      {
        buffer.WriteU8((0b110 << 5) | (point >>> 6));
        buffer.WriteU8((0b10 << 6) | (point & 0x3f));
      }
      else
      {
        buffer.WriteU8((0xe << 4) | (point >>> 12));
        buffer.WriteU8((0b10 << 6) | ((point >>> 6) & 0x3f));
        buffer.WriteU8((0b10 << 6) | (point & 0x3f));
      }
    }

    const end = buffer.GetOffset();
    buffer.WriteU32(end - start, start);
  }

  static EncodeUTF8(buffer, string)
  {
    // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
    // takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
    // have an auto expanding length and 1.5x should be just the right balance for most uses.

    const start = buffer.GetOffset();

    // Write a 0 for the length for now
    buffer.WriteU32(0);

    const length = string.length;
    for (let i = 0; i < length;)
    {
      let point = string.charCodeAt(i);
      i += 1;

      if (point >= 0xD800 && point <= 0xDBFF)
      {
        if (i === length)
        {
          buffer.WriteU8(0b11101111);
          buffer.WriteU8(0b10111111);
          buffer.WriteU8(0b10111101);

          break;
        }

        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        const next_code = string.charCodeAt(i);
        if (next_code >= 0xDC00 && next_code <= 0xDFFF)
        {
          point = (point - 0xD800) * 0x400 + next_code - 0xDC00 + 0x10000;
          i += 1;

          if (point > 0xffff)
          {
            buffer.WriteU8((0x1e << 3) | (point >>> 18));
            buffer.WriteU8((0x2  << 6) | ((point >>> 12) & 0x3f));
            buffer.WriteU8((0x2  << 6) | ((point >>> 6) & 0x3f));
            buffer.WriteU8((0x2  << 6) | (point & 0x3f));
            continue;
          }
        }
        else
        {
          // Can two of these be combined into a WriteU16?
          // buffer.WriteU16(0xef + 0xbf);
          buffer.WriteU8(0xef);
          buffer.WriteU8(0xbf);
          buffer.WriteU8(0b10111101);
          continue;
        }
      }

      if (point <= 0x007f)
      {
        buffer.WriteU8((0b0 << 7) | point);
      }
      else if (point <= 0x07ff)
      {
        buffer.WriteU8((0b110 << 5) | (point >>> 6));
        buffer.WriteU8((0b10 << 6) | (point & 0x3f));
      }
      else
      {
        buffer.WriteU8((0xe << 4) | (point >>> 12));
        buffer.WriteU8((0b10 << 6) | ((point >>> 6) & 0x3f));
        buffer.WriteU8((0b10 << 6) | (point & 0x3f));
      }
    }

    const end = buffer.GetOffset();
    buffer.WriteU32(end - start - 4, start);
  }

  static DecodeUTF8(buffer)
  {
    const data = Uint8Array.Decode(buffer);
    return TEXT_DECODER.decode(data);
  }

  static OldToUTF8(buffer, str)
  {
    const start = buffer.GetOffset();

    // Write a 0 for the length for now
    buffer.WriteU32(0);

    for (let i = 0; i < str.length; i++)
    {
      let charcode = str.charCodeAt(i);

      if (charcode < 0x80)
      {
        buffer.WriteU8(charcode);
      }
      else if (charcode < 0x800)
      {
        buffer.WriteU8(0xc0 | (charcode >> 6));
        buffer.WriteU8(0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000)
      {
        buffer.WriteU8(0xe0 | (charcode >> 12));
        buffer.WriteU8(0x80 | ((charcode >> 6) & 0x3f));
        buffer.WriteU8(0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else
      {
        i++;

        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));

        buffer.WriteU8(0xf0 | (charcode >> 18));
        buffer.WriteU8(0x80 | ((charcode >> 12) & 0x3f));
        buffer.WriteU8(0x80 | ((charcode >> 6) & 0x3f));
        buffer.WriteU8(0x80 | (charcode & 0x3f));
      }
    }

    const end = buffer.GetOffset();
    buffer.WriteU32(end - start - 4, start, 0); // Don't advance
  }

  static ToUTF8(buffer, str)
  {
    const start = buffer.GetOffset();

    // Write a 0 for the length for now
    buffer.WriteU32(0);

    for (let i = 0; i < str.length; i++)
    {
      let c = str.charCodeAt(i);
      if (c < 128)
      {
        buffer.WriteU8(c);
      }
      else if (c < 2048)
      {
        buffer.WriteU8((c >> 6) | 192);
        buffer.WriteU8((c & 63) | 128);
      }
      else if (
          ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
          ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00))
      {
        // Surrogate Pair
        c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);

        buffer.WriteU8((c >> 18) | 240);
        buffer.WriteU8(((c >> 12) & 63) | 128);
        buffer.WriteU8(((c >> 6) & 63) | 128);
        buffer.WriteU8((c & 63) | 128);
      }
      else
      {
        buffer.WriteU8((c >> 12) | 224);
        buffer.WriteU8(((c >> 6) & 63) | 128);
        buffer.WriteU8((c & 63) | 128);
      }
    }

    const end = buffer.GetOffset();
    const bytes = end - start - 4;
    buffer.WriteU32(bytes, start, 0); // Don't advance
  }

  static OldFromUTF8(buffer)
  {
    const bytes = buffer.ReadU32();

    let str = "";

    for (let i = 0; i < bytes; i++)
    {
      const p1 = buffer.ReadU8();

      if (p1 < 0x80)
      {
        str += globalThis.String.fromCharCode(p1);
      }
      else if (p1 > 0xBF && p1 < 0xE0)
      {
        const p2 = buffer.ReadU8();
        str += globalThis.String.fromCharCode((p1 & 0x1F) << 6 | p2 & 0x3F);

        i += 1;
      }
      else if (p1 > 0xDF && p1 < 0xF0)
      {
        const p2 = buffer.ReadU8();
        const p3 = buffer.ReadU8();

        str += globalThis.String.fromCharCode((p1 & 0x0F) << 12 | (p2 & 0x3F) << 6 | p3 & 0x3F);

        i += 2;
      }
      else
      {
        const p2 = buffer.ReadU8();
        const p3 = buffer.ReadU8();
        const p4 = buffer.ReadU8();

        // surrogate pair
        const code = ((p1 & 0x07) << 18 | (p2 & 0x3F) << 12 | (p3 & 0x3F) << 6 | p4 & 0x3F) - 0x010000;

        str += globalThis.String.fromCharCode(code >> 10 | 0xD800, code & 0x03FF | 0xDC00);

        i += 3;
      }
    }

    return str;
  }

  static FromUTF8(buffer)
  {
    const bytes = buffer.ReadU32();

    let string = "";
    for (let i = 0; i < bytes; i++)
    {
      const c1 = buffer.ReadU8();

      if (c1 < 128)
      {
        string += globalThis.String.fromCharCode(c1);
      }
      else if (c1 > 191 && c1 < 224)
      {
        const c2 = buffer.ReadU8();
        string += globalThis.String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      }
      else if (c1 > 239 && c1 < 365)
      {
        // Surrogate Pair
        const c2 = buffer.ReadU8();
        const c3 = buffer.ReadU8();
        const c4 = buffer.ReadU8();

        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;

        string += globalThis.String.fromCharCode(0xD800 + (u >> 10), 0xDC00 + (u & 1023));
      }
      else
      {
        const c2 = buffer.ReadU8();
        const c3 = buffer.ReadU8();

        string += globalThis.String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }

    return string;
  }

  static Native(){ return globalThis.String; }

  static Length(block)
  {
    const ref = block.GetReference();

    if (ref.IsInstance() && ref.IsTypeOf("string"))
    {
      return 0; // The content has no size
    }
    else
    {
      return Uint8Array.Length(block);
    }
  }

  static Encode(block, string)
  {
    const ref = block.GetReference();

    if (ref.IsInstance() && ref.IsTypeOf("string"))
    {
      // No need to write anything, because this is already represented by the block's code
      return;
    }
    else
    {
      const encoded = TEXT_ENCODER.encode(string);
      Uint8Array.Encode(block, encoded);
    }
  }

  static Decode(block)
  {
    const ref = block.GetReference();

    if (ref.IsInstance() && ref.IsTypeOf("string"))
    {
      return ref.GetValue();
    }
    else
    {
      const data = Uint8Array.Decode(block);
      return TEXT_DECODER.decode(data);
    }
  }
}
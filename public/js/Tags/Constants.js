// NOTE: I cannot take credit for most of the values found in this file!
// Almost all of them are either taken from Tailwind or Bulma CSS frameworks
// These excellent frameworks can be found at:
// https://tailwindcss.com/ and https://bulma.io/
// Thank you!

export class Constants
{
  static ToPixel(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}px`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToPercent(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}%`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToDegree(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}deg`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToTurn(v)
  {
    switch (typeof(v))
    {
      case "number": return `${v}turn`;
      case "string": return v;
      case "undefined": return "";
    }
  }

  static ToColor(v)
  {
    switch (typeof(v))
    {
      case "string": return v;
      case "object":
      {
        if (v.a) return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
        else return `rgb(${v.r}, ${v.g}, ${v.b})`;
      }
      case "undefined": return "";
    }
  }

  static ToScale(v)
  {
    switch (typeof(v))
    {
      case "number": return `scale(${v / 100})`;
      case "string": return `scale(${v})`;
      case "object": return `scale(${v.x}, ${v.y})`;
    }
  }

  static IsBlackListed(name)
  {
    switch (name)
    {
      case "script":
      case "style":
      case "iframe":
      case "embed":
      case "object":
      case "SCRIPT":
      case "STYLE":
      case "IFRAME":
      case "EMBED":
      case "OBJECT": return true;
      default: return false;
    }
  }

  static IsWhiteListedProtocol(protocol)
  {
    switch (protocol)
    {
      case "about:":
      case "blob:":
      case "callto:":
      case "chrome:":
      case "example:":
      case "facetime:":
      case "fax:":
      case "file:":
      case "filesystem:":
      case "ftp:":
      case "geo:":
      case "git:":
      case "http:":
      case "https:":
      case "irc:":
      case "mailto:":
      case "maps:":
      case "market:":
      case "message:":
      case "news:":
      case "notes:":
      case "resource:":
      case "sms:":
      case "ssh:":
      case "tel:":
      case "udp:":
      case "ws:":
      case "wss:": return true;
      default: return false;
    }
  }

  static GetSize(size)
  {
    switch (size)
    {
      case 0: return "0";
      case 1: return "0.25rem";
      case 2: return "0.5rem";
      case 3: return "0.75rem";
      case 4: return "1rem";
      case 5: return "1.25rem";
      case 6: return "1.5rem";
      case 7: return "1.75rem";
      case 8: return "2rem";
      case 9: return "2.25rem";
      case 10: return "2.5rem";
      case 11: return "2.75rem";
      case 12: return "3rem";
      case 13: return "3.25rem";
      case 14: return "3.5rem";
      case 15: return "3.75rem";
      case 16: return "4rem";
      case 17: return "4.25rem";
      case 18: return "4.5rem";
      case 19: return "4.75rem";
      case 20: return "5rem";
      case 21: return "5.25rem";
      case 22: return "5.5rem";
      case 23: return "5.75rem";
      case 24: return "6rem";
      case 25: return "6.25rem";
      case 26: return "6.5rem";
      case 27: return "6.75rem";
      case 28: return "7rem";
      case 29: return "7.25rem";
      case 30: return "7.5rem";
      case 31: return "7.75rem";
      case 32: return "8rem";
      case 33: return "8.25rem";
      case 34: return "8.5rem";
      case 35: return "8.75rem";
      case 36: return "9rem";
      case 37: return "9.25rem";
      case 38: return "9.5rem";
      case 39: return "9.75rem";
      case 40: return "10rem";
      case 41: return "10.25rem";
      case 42: return "10.5rem";
      case 43: return "10.75rem";
      case 44: return "11rem";
      case 45: return "11.25rem";
      case 46: return "11.5rem";
      case 47: return "11.75rem";
      case 48: return "12rem";
      case 49: return "12.25rem";
      case 50: return "12.5rem";
      case 51: return "12.75rem";
      case 52: return "13rem";
      case 53: return "13.25rem";
      case 54: return "13.5rem";
      case 55: return "13.75rem";
      case 56: return "14rem";
      case 57: return "14.25rem";
      case 58: return "14.5rem";
      case 59: return "14.75rem";
      case 60: return "15rem";
      case 61: return "15.25rem";
      case 62: return "15.5rem";
      case 63: return "15.75rem";
      case 64: return "16rem";
      case 65: return "16.25rem";
      case 66: return "16.5rem";
      case 67: return "16.75rem";
      case 68: return "17rem";
      case 69: return "17.25rem";
      case 70: return "17.5rem";
      case 71: return "17.75rem";
      case 72: return "18rem";
      case 73: return "18.25rem";
      case 74: return "18.5rem";
      case 75: return "18.75rem";
      case 76: return "19rem";
      case 77: return "19.25rem";
      case 78: return "19.5rem";
      case 79: return "19.75rem";
      case 80: return "20rem";
      case 81: return "20.25rem";
      case 82: return "20.5rem";
      case 83: return "20.75rem";
      case 84: return "21rem";
      case 85: return "21.25rem";
      case 86: return "21.5rem";
      case 87: return "21.75rem";
      case 88: return "22rem";
      case 89: return "22.25rem";
      case 90: return "22.5rem";
      case 91: return "22.75rem";
      case 92: return "23rem";
      case 93: return "23.25rem";
      case 94: return "23.5rem";
      case 95: return "23.75rem";
      case 96: return "24rem";

      case 1.2: return "50%";
      case 1.3: return "33.333333%";
      case 2.3: return "66.666667%";
      case 1.4: return "25%";
      case 2.4: return "50%";
      case 3.4: return "75%";
      case 1.5: return "20%";
      case 2.5: return "40%";
      case 3.5: return "60%";
      case 4.5: return "80%";
      case 1.6: return "16.666667%";
      case 2.6: return "33.333333%";
      case 3.6: return "50%";
      case 4.6: return "66.666667%";
      case 5.6: return "83.333333%";
      case 1.12: return "8.333333%";
      case 2.12: return "16.666667%";
      case 3.12: return "25%";
      case 4.12: return "33.333333%";
      case 5.12: return "41.666667%";
      case 6.12: return "50%";
      case 7.12: return "58.333333%";
      case 8.12: return "66.666667%";
      case 9.12: return "75%";
      case 10.12: return "83.333333%";
      case 11.12: return "91.666667%";

      case "half": return "50%";
      case "full": return "100%";
      case "auto": return "auto";
      case "xs": return "0.75rem";
      case "sm": return "0.875rem";
      case "base": return "1rem";
      case "lg": return "1.125rem";
      case "xl": return "1.25rem";
      case "xl2": return "1.5rem";
      case "xl3": return "1.875rem";
      case "xl4": return "2.25rem";
      case "xl5": return "3rem";
      case "xl6": return "4rem";
      default: return size;
    }
  }

  static GetSpacing(spacing)
  {
    switch (spacing)
    {
      case "tighter": return "-0.05em";
      case "tight": return "-0.025em";
      case "normal": return "0";
      case "wide": return "0.025em";
      case "wider": return "0.05em";
      case "widest": return "0.1em";
      default: return spacing;
    }
  }

  static GetWeight(weight)
  {
    switch (weight)
    {
      case "hairline": return "100";
      case "thin": return "200";
      case "light": return "300";
      case "normal": return "400";
      case "medium": return "500";
      case "semibold": return "600";
      case "bold": return "700";
      case "extrabold": return "800";
      case "black": return "900";
      default: return weight;
    }
  }

  static GetShadow(shadow)
  {
    switch (shadow)
    {
      case "base": return "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
      case "md": return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      case "lg": return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      case "xl": return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
      case "xl2": return "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
      case "inner": return "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
      case "outline": return "0 0 0 3px rgba(66, 153, 225, 0.5)";
      default: return shadow;
    }
  }

  static GetFont(font)
  {
    switch (font)
    {
      case "primary": return "";
      case "secondary": return "";
      case "code": return "";
      case "sans_serif": return "";
      case "mono_space": return "";
      default: return font;
    }
  }

  static GetTextHeight(height)
  {
    switch (height)
    {
      case "none": return "1";
      case "tight": return "1.25";
      case "snug": return "1.375";
      case "normal": return "1.5";
      case "relaxed": return "1.625";
      case "loose": return "2";
      default: return height;
    }
  }

  static GetColorWhite(color = "white")
  {
    switch (color)
    {
      // case 0: return "rgba(0, 0, 0, 0)";
      // case 1: return "white";
      case "white": return "white";
      case "white_hover": return "#e6e6e6";
      case "white_ter": return "whitesmoke";
      case "white_bis": return "#fafafa";
      default: return color;
    }
  }

  static GetColorBlack(color = "black")
  {
    switch (color)
    {
      case "black": return "#0a0a0a";
      case "black_hover": return "black";
      case "black_bis": return "#121212";
      case "black_ter": return "#242424";
      default: return color;
    }
  }

  static GetColorLight(color = "light")
  {
    switch (color)
    {
      case "light": return "whitesmoke";
      case "light_hover": return "#dbdbdb";
      default: return color;
    }
  }

  static GetColorDark(color = "dark")
  {
    switch (color)
    {
      case "dark": return "#363636";
      case "dark_hover": return "#1c1c1c";
      default: return color;
    }
  }

  static GetColorPrimary(color = 0)
  {
    switch (color)
    {
      case 0: return "#00d1b2";
      case "primary": return "#00d1b2";
      case "primary_hover": return "#009e86";
      default: return color;
    }
  }

  static GetColorInfo(color = "info")
  {
    switch (color)
    {
      case "info": return "#209cee";
      case "info_hover": return "#0f81cc";
      default: return color;
    }
  }

  static GetColorLink(color = "link")
  {
    switch (color)
    {
      case "link": return "#344f79";
      case "link_hover": return "#253855";
      default: return color;
    }
  }

  static GetColorSuccess(color = "success")
  {
    switch (color)
    {
      case "success": return "#23d160";
      case "success_hover": return "#1ca64c";
      default: return color;
    }
  }

  static GetColorWarning(color = "warning")
  {
    switch (color)
    {
      case "warning": return "#ffdd57";
      case "warning_hover": return "#ffd324";
      default: return color;
    }
  }

  static GetColorDanger(color = "danger")
  {
    switch (color)
    {
      case "danger": return "#ff3860";
      case "danger_hover": return "#ff0537";
      default: return color;
    }
  }

  static GetColorRed(color = 0)
  {
    switch (color)
    {
      case 0: return "#E53E3E";
      case 1: return "#FFF5F5";
      case 2: return "#FED7D7";
      case 3: return "#FEB2B2";
      case 4: return "#FC8181";
      case 5: return "#F56565";
      case 6: return "#E53E3E";
      case 7: return "#C53030";
      case 8: return "#9B2C2C";
      case 9: return "#742A2A";
      default: return color;
    }
  }

  static GetColorOrange(color = 0)
  {
    switch (color)
    {
      case 0: return "#DD6B20";
      case 1: return "#FFFAF0";
      case 2: return "#FEEBC8";
      case 3: return "#FBD38D";
      case 4: return "#F6AD55";
      case 5: return "#ED8936";
      case 6: return "#DD6B20";
      case 7: return "#C05621";
      case 8: return "#9C4221";
      case 9: return "#7B341E";
      default: return color;
    }
  }

  static GetColorYellow(color = 0)
  {
    switch (color)
    {
      case 0: return "#D69E2E";
      case 1: return "#FFFFF0";
      case 2: return "#FEFCBF";
      case 3: return "#FAF089";
      case 4: return "#F6E05E";
      case 5: return "#ECC94B";
      case 6: return "#D69E2E";
      case 7: return "#B7791F";
      case 8: return "#975A16";
      case 9: return "#744210";
      default: return color;
    }
  }

  static GetColorGreen(color = 0)
  {
    switch (color)
    {
      case 0: return "#38A169";
      case 1: return "#F0FFF4";
      case 2: return "#C6F6D5";
      case 3: return "#9AE6B4";
      case 4: return "#68D391";
      case 5: return "#48BB78";
      case 6: return "#38A169";
      case 7: return "#2F855A";
      case 8: return "#276749";
      case 9: return "#22543D";
      default: return color;
    }
  }

  static GetColorTeal(color = 0)
  {
    switch (color)
    {
      case 0: return "#319795";
      case 1: return "#E6FFFA";
      case 2: return "#B2F5EA";
      case 3: return "#81E6D9";
      case 4: return "#4FD1C5";
      case 5: return "#38B2AC";
      case 6: return "#319795";
      case 7: return "#2C7A7B";
      case 8: return "#285E61";
      case 9: return "#234E52";
      default: return color;
    }
  }

  static GetColorBlue(color = 0)
  {
    switch (color)
    {
      case 0: return "#3182CE";
      case 1: return "#EBF8FF";
      case 2: return "#BEE3F8";
      case 3: return "#90CDF4";
      case 4: return "#63B3ED";
      case 5: return "#4299E1";
      case 6: return "#3182CE";
      case 7: return "#2B6CB0";
      case 8: return "#2C5282";
      case 9: return "#2A4365";
      default: return color;
    }
  }

  static GetColorIndigo(color = 0)
  {
    switch (color)
    {
      case 0: return "#5A67D8";
      case 1: return "#EBF4FF";
      case 2: return "#C3DAFE";
      case 3: return "#A3BFFA";
      case 4: return "#7F9CF5";
      case 5: return "#667EEA";
      case 6: return "#5A67D8";
      case 7: return "#4C51BF";
      case 8: return "#434190";
      case 9: return "#3C366B";
      default: return color;
    }
  }

  static GetColorPurple(color = 0)
  {
    switch (color)
    {
      case 0: return "#805AD5";
      case 1: return "#FAF5FF";
      case 2: return "#E9D8FD";
      case 3: return "#D6BCFA";
      case 4: return "#B794F4";
      case 5: return "#9F7AEA";
      case 6: return "#805AD5";
      case 7: return "#6B46C1";
      case 8: return "#553C9A";
      case 9: return "#44337A";
      default: return color;
    }
  }

  static GetColorPink(color = 0)
  {
    switch (color)
    {
      case 0: return "#D53F8C";
      case 1: return "#FFF5F7";
      case 2: return "#FED7E2";
      case 3: return "#FBB6CE";
      case 4: return "#F687B3";
      case 5: return "#ED64A6";
      case 6: return "#D53F8C";
      case 7: return "#B83280";
      case 8: return "#97266D";
      case 9: return "#702459";
      default: return color;
    }
  }

  static GetColorGrey(color = 0)
  {
    switch (color)
    {
      case 0: return "#718096";
      case 1: return "#F7FAFC";
      case 2: return "#EDF2F7";
      case 3: return "#E2E8F0";
      case 4: return "#CBD5E0";
      case 5: return "#A0AEC0";
      case 6: return "#718096";
      case 7: return "#4A5568";
      case 8: return "#2D3748";
      case 9: return "#1A202C";
      default: return color;
    }
  }

  static GetHSL(h, s, l)
  {
    if (typeof(l) === "string")
    {
      return l;
    }

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  static GetColorRed(l = 50){ return this.GetHSL("354.9", "100", l) }
  static GetColorOrange(l = 50){ return this.GetHSL("25", "100", l) }
  static GetColorYellow(l = 50){ return this.GetHSL("50", "100", l) }
  static GetColorGreen(l = 50){ return this.GetHSL("90", "100", l) }
  static GetColorTeal(l = 50){ return this.GetHSL("175", "100", l) }
  static GetColorBlue(l = 50){ return this.GetHSL("225", "100", l) }
  static GetColorIndigo(l = 50){ return this.GetHSL("250", "100", l) }
  static GetColorPurple(l = 50){ return this.GetHSL("275", "100", l) }
  static GetColorPink(l = 50){ return this.GetHSL("315", "100", l) }
  static GetColorGrey(l = 50){ return this.GetHSL("181", "25", l) }

  static FindColor(color)
  {
    switch (color)
    {
      case "primary": return "#00d1b2";
      case "dark": return "#363636";
      case "light": return "whitesmoke";
      case "black": return "#0a0a0a";
      case "white": return "white";
      case "info": return "#209cee";
      case "link": return "#344f79";
      case "success": return "#23d160";
      case "warning": return "#ffdd57";
      case "danger": return "#ff3860";
      default: return color;
    }
  }
}

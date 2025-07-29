// export const None = 1 << 0;
// export const SM = 1 << 1;
// export const MD = 1 << 2;
// export const LG = 1 << 3;
// export const XL = 1 << 4;
// export const XL2 = 1 << 5;
// export const Hover = 1 << 0;
// export const Focus = 1 << 0;
// export const Active = 1 << 0;
// export const Visited = 1 << 0;
// export const First = 1 << 0;
// export const MotionReduced = 1 << 0;
// export const Dark = 1 << 0;
// export const Light = 1 << 0;

import {Style} from "/js/Tags.js";

// The default stylesheet
export const Default = new Style();

export const SM = new Style().ID("-sm").Media("(width >= 40rem)");
export const MD = new Style().ID("-md").Media("(width >= 48rem)");
// ...etc

export const Dark = new Style().ID("-dark").Media("(prefers-color-scheme: dark)");
export const Light = new Style().ID("-light").Media("(prefers-color-scheme: light)");
export const DarkSM = new Style().ID("-dark-sm").Media("(prefers-color-scheme: dark) and (width >= 40rem)");
export const DarkMD = new Style().ID("-dark-md").Media("(prefers-color-scheme: dark) and (width >= 48rem)");
export const LightSM = new Style().ID("-light-sm").Media("(prefers-color-scheme: light) and (width >= 40rem)");
export const LightMD = new Style().ID("-light-md").Media("(prefers-color-scheme: light) and (width >= 48rem)");
// ...etc

// I don't think these ones really have a media query
export const Hover = new Style().ID("-hover");
export const Active = new Style().ID("-active");
// ...etc

class Key {
  #key;
  #media;
  #pseudo;

  constructor(key, media = "", pseudo = "") {
    this.#key = key;
    this.#media = media;
    this.#pseudo = pseudo;
  }

  // Combine(key) {
  //   return new Key(
  //     this.#key + key.#key,
  //     this.#media ? this.#media + " and " + key.#media : "",
  //     this.#pseudo + key.#pseudo,
  //   );
  // }
};

export const Default = new Key("", "", "");

export const SM = new Key("-sm", "(width >= 40rem)", "");
export const MD = new Key("-md", "(width >= 48rem)", "");
export const LG = new Key("-lg", "(width >= 64rem)", "");
export const XL = new Key("-xl", "(width >= 80rem)", "");
export const XL2 = new Key("-xl2", "(width >= 96rem)", "");

export const Dark = new Key("-dark", "(prefers-color-scheme: dark)", "");
export const Light = new Key("-light", "(prefers-color-scheme: light)", "");

export const Focus = new Key("-focus", "", ":focus");
export const Hover = new Key("-hover", "", ":hover");
export const HoverFocus = new Key("-hover-focus", "", ":hover:focus");
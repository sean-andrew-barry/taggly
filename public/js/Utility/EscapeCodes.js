const NAMES = {
	"&nbsp;": "\xA0", // non-breaking space
	"&iexcl;": "\xA1", // ¡ inverted exclamation mark
	"&cent;": "\xA2", // ¢ cent sign
	"&pound;": "\xA3", // £ pound sign
	"&curren;": "\xA4", // ¤ currency sign
	"&yen;": "\xA5", // ¥ yen sign
	"&brvbar;": "\xA6", // ¦ broken vertical bar
	"&sect;": "\xA7", // § section sign
	"&uml;": "\xA8", // ¨ spacing diaeresis - umlaut
	"&copy;": "\xA9", // © copyright sign
	"&ordf;": "\xAA", // ª feminine ordinal indicator
	"&laquo;": "\xAB", // « left double angle quotes
	"&not;": "\xAC", // ¬ not sign
	"&shy;": "\xAD", // soft hyphen
	"&reg;": "\xAE", // ® registered trade mark sign
	"&macr;": "\xAF", // ¯ spacing macron - overline

	"&deg;": "\xB0", // ° degree sign
	"&plusmn;": "\xB1", // ± plus-or-minus sign
	"&sup2;": "\xB2", // ² superscript two - squared
	"&sup3;": "\xB3", // ³ superscript three - cubed
	"&acute;": "\xB4", // ´ acute accent - spacing acute
	"&micro;": "\xB5", // µ micro sign
	"&para;": "\xB6", // ¶ pilcrow sign - paragraph sign
	"&middot;": "\xB7", // · middle dot - Georgian comma
	"&cedil;": "\xB8", // ¸ spacing cedilla
	"&sup1;": "\xB9", // ¹ superscript one
	"&ordm;": "\xBA", // º masculine ordinal indicator
	"&raquo;": "\xBB", // » right double angle quotes
	"&frac14;": "\xBC", // ¼ fraction one quarter
	"&frac12;": "\xBD", // ½ fraction one half
	"&frac34;": "\xBE", // ¾ fraction three quarters
	"&iquest;": "\xBF", // ¿ inverted question mark

	"&Agrave;": "\xC0", // À latin capital letter A with grave
	"&Aacute;": "\xC1", // Á latin capital letter A with acute
	"&Acirc;": "\xC2", // Â latin capital letter A with circumflex
	"&Atilde;": "\xC3", // Ã latin capital letter A with tilde
	"&Auml;": "\xC4", // Ä latin capital letter A with diaeresis
	"&Aring;": "\xC5", // Å latin capital letter A with ring above
	"&AElig;": "\xC6", // Æ latin capital letter AE
	"&Ccedil;": "\xC7", // Ç latin capital letter C with cedilla
	"&Egrave;": "\xC8", // È latin capital letter E with grave
	"&Eacute;": "\xC9", // É latin capital letter E with acute
	"&Ecirc;": "\xCA", // Ê latin capital letter E with circumflex
	"&Euml;": "\xCB", // Ë latin capital letter E with diaeresis
	"&Igrave;": "\xCC", // Ì latin capital letter I with grave
	"&Iacute;": "\xCD", // Í latin capital letter I with acute
	"&Icirc;": "\xCE", // Î latin capital letter I with circumflex
	"&Iuml;": "\xCF", // Ï latin capital letter I with diaeresis

	"&ETH;": "\xD0", // Ð latin capital letter ETH
	"&Ntilde;": "\xD1", // Ñ latin capital letter N with tilde
	"&Ograve;": "\xD2", // Ò latin capital letter O with grave
	"&Oacute;": "\xD3", // Ó latin capital letter O with acute
	"&Ocirc;": "\xD4", // Ô latin capital letter O with circumflex
	"&Otilde;": "\xD5", // Õ latin capital letter O with tilde
	"&Ouml;": "\xD6", // Ö latin capital letter O with diaeresis
	"&times;": "\xD7", // × multiplication sign
	"&Oslash;": "\xD8", // Ø latin capital letter O with slash
	"&Ugrave;": "\xD9", // Ù latin capital letter U with grave
	"&Uacute;": "\xDA", // Ú latin capital letter U with acute
	"&Ucirc;": "\xDB", // Û latin capital letter U with circumflex
	"&Uuml;": "\xDC", // Ü latin capital letter U with diaeresis
	"&Yacute;": "\xDD", // Ý latin capital letter Y with acute
	"&THORN;": "\xDE", // Þ latin capital letter THORN
	"&szlig;": "\xDF", // ß latin small letter sharp s - ess-zed

	"&agrave;": "\xE0", // à
	"&aacute;": "\xE1", // á
	"&acirc;": "\xE2", // â
	"&atilde;": "\xE3", // ã
	"&auml;": "\xE4", // ä
	"&aring;": "\xE5", // å
	"&aelig;": "\xE6", // æ
	"&ccedil;": "\xE7", // ç
	"&egrave;": "\xE8", // è
	"&eacute;": "\xE9", // é
	"&ecirc;": "\xEA", // ê
	"&euml;": "\xEB", // ë
	"&igrave;": "\xEC", // ì
	"&iacute;": "\xED", // í
	"&icirc;": "\xEE", // î
	"&iuml;": "\xEF", // ï

	"&eth;": "\xF0", // ð
	"&ntilde;": "\xF1", // ñ
	"&ograve;": "\xF2", // ò
	"&oacute;": "\xF3", // ó
	"&ocirc;": "\xF4", // ô
	"&otilde;": "\xF5", // õ
	"&ouml;": "\xF6", // ö
	"&divide;": "\xF7", // ÷
	"&oslash;": "\xF8", // ø
	"&ugrave;": "\xF9", // ù
	"&uacute;": "\xFA", // ú
	"&ucirc;": "\xFB", // û
	"&uuml;": "\xFC", // ü
	"&yacute;": "\xFD", // ý
	"&thorn;": "\xFE", // þ
	"&yuml;": "\xFF", // ÿ

	"&euro;": "\u20AC", // € euro sign
};

const NUMBERS = {
	"&#338;": "\u0152", // Œ
	"&#339;": "\u0153", // œ
	"&#352;": "\u0160", // Š
	"&#353;": "\u0161", // š
	"&#376;": "\u0178", // Ÿ
	"&#402;": "\u0192", // ƒ

	"&#8211;": "\u2013", // –
	"&#8212;": "\u2014", // —
	"&#8216;": "\u2018", // ‘
	"&#8217;": "\u2019", // ’
	"&#8218;": "\u201A", // ‚
	"&#8220;": "\u201C", // “
	"&#8221;": "\u201D", // ”
	"&#8222;": "\u201E", // „
	"&#8224;": "\u2020", // †
	"&#8225;": "\u2021", // ‡
	"&#8226;": "\u2022", // •
	"&#8230;": "\u2026", // …
	"&#8240;": "\u2030", // ‰
	"&#8364;": "\u20AC", // €
	"&#8482;": "\u2122", // ™
};

export class EscapeCodes
{
	static Name  (s){ return s.replace(/&\w+;/g, (m) => NAMES[m]); }
	static Number(s){ return s.replace(/&#\d+;/g, (m) => NUMBERS[m]); }
	static Escape(s)
	{
		if (typeof(s) !== "string") return s;

		return EscapeCodes.Number(EscapeCodes.Name(s));
	}
}

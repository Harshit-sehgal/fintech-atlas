/**
 * Country → regional-indicator flag emoji (T160). Zero image assets, so the
 * directory's 150 country rows get a colour cue without shipping 150 SVGs or
 * hitting a flag CDN. Names match the research directory's cluster labels.
 *
 * Thematic GLOBAL groups (e.g. "CROSS-BORDER PAYMENTS, REMITTANCES & CRYPTO")
 * are not countries and return null, so callers render no flag for them.
 */
const ISO2: Record<string, string> = {
  Afghanistan: "AF", Albania: "AL", Algeria: "DZ", Angola: "AO", Argentina: "AR",
  Armenia: "AM", Australia: "AU", Austria: "AT", Azerbaijan: "AZ", Bahamas: "BS",
  Bahrain: "BH", Bangladesh: "BD", Barbados: "BB", Belgium: "BE", Bermuda: "BM",
  Bhutan: "BT", Bolivia: "BO", "Bosnia and Herzegovina": "BA", Botswana: "BW",
  Brazil: "BR", Brunei: "BN", Bulgaria: "BG", Cambodia: "KH", Cameroon: "CM",
  Canada: "CA", Chile: "CL", China: "CN", Colombia: "CO", "Costa Rica": "CR",
  Croatia: "HR", Czechia: "CZ", Denmark: "DK", "Dominican Republic": "DO",
  "DR Congo": "CD", Ecuador: "EC", Egypt: "EG", "El Salvador": "SV", Estonia: "EE",
  Ethiopia: "ET", Fiji: "FJ", Finland: "FI", France: "FR", Gabon: "GA",
  Georgia: "GE", Germany: "DE", Ghana: "GH", Greece: "GR", Guatemala: "GT",
  Honduras: "HN", "Hong Kong": "HK", Hungary: "HU", Iceland: "IS", Indonesia: "ID",
  Iraq: "IQ", Ireland: "IE", Israel: "IL", Italy: "IT", "Ivory Coast": "CI",
  Jamaica: "JM", Japan: "JP", Jordan: "JO", Kazakhstan: "KZ", Kenya: "KE",
  Kuwait: "KW", Kyrgyzstan: "KG", Laos: "LA", Latvia: "LV", Lebanon: "LB",
  Libya: "LY", Lithuania: "LT", Luxembourg: "LU", Macau: "MO", Madagascar: "MG",
  Malaysia: "MY", Maldives: "MV", Mali: "ML", Mauritius: "MU", Mexico: "MX",
  Moldova: "MD", Mongolia: "MN", Montenegro: "ME", Morocco: "MA", Mozambique: "MZ",
  Myanmar: "MM", Namibia: "NA", Nepal: "NP", Netherlands: "NL", "New Zealand": "NZ",
  Nicaragua: "NI", Nigeria: "NG", "North Macedonia": "MK", Norway: "NO", Oman: "OM",
  Pakistan: "PK", Panama: "PA", "Papua New Guinea": "PG", Paraguay: "PY", Peru: "PE",
  Philippines: "PH", Poland: "PL", Portugal: "PT", "Puerto Rico": "PR", Qatar: "QA",
  Romania: "RO", Rwanda: "RW", Samoa: "WS", "Saudi Arabia": "SA", Senegal: "SN",
  Serbia: "RS", Singapore: "SG", Slovakia: "SK", Slovenia: "SI",
  "Solomon Islands": "SB", "South Africa": "ZA", "South Korea": "KR", Spain: "ES",
  "Sri Lanka": "LK", Sudan: "SD", Sweden: "SE", Switzerland: "CH", Taiwan: "TW",
  Tajikistan: "TJ", Tanzania: "TZ", Thailand: "TH", Togo: "TG", Tonga: "TO",
  "Trinidad and Tobago": "TT", Tunisia: "TN", Turkey: "TR", Turkmenistan: "TM",
  Uganda: "UG", Ukraine: "UA", "United Arab Emirates": "AE", "United Kingdom": "GB",
  "United States": "US", Uruguay: "UY", Uzbekistan: "UZ", Vanuatu: "VU",
  Venezuela: "VE", Vietnam: "VN", Zambia: "ZM", Zimbabwe: "ZW",
};

/** Flag emoji for a country label, or null when it is not a country. */
export function flagEmoji(country: string): string | null {
  const code = ISO2[country];
  if (!code) return null;
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

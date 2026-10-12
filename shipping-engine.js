// ---------- SHIPPING RATES (identical copy on the website and in STRIPE.gs) ----------
// Australia Post MyPost Business, Band 1, sending from Perth.
// Sources: MyPost Business Rates and Savings Guide (July 2026) and
// Post Charges Guide (1 September 2026). Shipping stops increasing above 20kg.
var SHIP_CAP_G = 20000;

// Within Australia, up to 5kg: Band 1 prices by zone
// [Perth & WA major areas, other capital cities & major areas, rural].
var SHIP_DOM_TIERS = [250, 500, 1000, 3000, 5000];
var SHIP_DOM_TIER_NAMES = ['Extra small satchel', 'Small satchel', 'Medium satchel', 'Large satchel', 'Extra large satchel'];
var SHIP_DOM_PRICES = [[9.18, 9.69, 10.20], [10.53, 11.12, 11.70], [14.40, 15.20, 16.00], [18.23, 19.24, 20.25], [22.01, 23.23, 24.45]];
var SHIP_DOM_ZONE_NAMES = ['Perth & WA major areas', 'Capital city / major area', 'Rural'];
var SHIP_WA_MAJOR = [[6041, 6044], [6082, 6084], [6501, 6501], [6121, 6126], [6207, 6208], [6211, 6214], [6285, 6285]];

// Within Australia, over 5kg: $24.45 base plus a per-kg distance charge from Perth
// (cents, every kg or part over 5kg), then the Band 1 5% saving.
var SHIP_DOM_BASE_C = 2445;
var SHIP_PERKG_C = { N1: 385, N2: 790, V1: 385, V2: 745, Q1: 485, Q2: 790, Q3: 825, Q4: 895, S1: 385, S2: 745,
  NT1: 895, W1: 25, W2: 205, W3: 325, T1: 570, NF: 1170, W4: 305, AAT: 535 };
var SHIP_PERKG_DEFAULT_C = 895;
// Postcode -> distance zone. Where Australia Post lists two zones, the cheaper one from Perth is used.
var SHIP_PC_ZONES = [
  [200, 299, 'N2'], [1000, 2263, 'N1'], [2264, 2484, 'N2'], [2485, 2486, 'Q1'], [2487, 2499, 'N2'], [2500, 2530, 'N1'],
  [2531, 2554, 'N2'], [2555, 2574, 'N1'], [2575, 2639, 'N2'], [2640, 2641, 'V2'], [2642, 2647, 'N2'], [2648, 2648, 'V2'],
  [2649, 2714, 'N2'], [2715, 2715, 'V2'], [2716, 2716, 'N2'], [2717, 2719, 'V2'], [2720, 2730, 'N2'], [2731, 2739, 'V2'],
  [2740, 2786, 'N1'], [2787, 2879, 'N2'], [2880, 2880, 'S2'], [2881, 2889, 'N2'], [2890, 2890, 'N1'], [2891, 2898, 'N2'],
  [2899, 2899, 'NF'], [2900, 2999, 'N2'],
  [3000, 3220, 'V1'], [3221, 3334, 'V2'], [3335, 3341, 'V1'], [3342, 3424, 'V2'], [3425, 3443, 'V1'], [3444, 3688, 'V2'],
  [3689, 3690, 'V2'], [3691, 3749, 'V2'], [3750, 3811, 'V1'], [3812, 3909, 'V2'], [3910, 3920, 'V1'], [3921, 3925, 'V2'],
  [3926, 3944, 'V1'], [3945, 3971, 'V2'], [3972, 3978, 'V1'], [3979, 3979, 'V2'], [3980, 3983, 'V1'], [3984, 3999, 'V2'],
  [8000, 8999, 'V1'],
  [4000, 4224, 'Q1'], [4225, 4225, 'Q1'], [4226, 4299, 'Q1'], [4300, 4449, 'Q2'], [4450, 4499, 'Q3'], [4500, 4549, 'Q1'],
  [4550, 4699, 'Q2'], [4700, 4805, 'Q3'], [4806, 4899, 'Q4'], [9000, 9299, 'Q1'], [9400, 9596, 'Q1'], [9597, 9599, 'Q2'],
  [9700, 9799, 'Q1'], [9880, 9919, 'Q2'], [9920, 9959, 'Q3'],
  [5000, 5199, 'S1'], [5200, 5749, 'S2'], [5800, 5999, 'S1'],
  [800, 999, 'NT1'],
  [6000, 6214, 'W1'], [6215, 6699, 'W2'], [6700, 6797, 'W3'], [6798, 6799, 'W4'], [6800, 6999, 'W1'],
  [7000, 7150, 'T1'], [7151, 7154, 'AAT'], [7155, 7999, 'T1']
];

// International Standard: standard prices (cents) at 250g / 500g / 1kg / 1.5kg / 2kg,
// plus each extra 0.5kg (or part) up to 20kg, then the Band 1 5% saving.
var SHIP_INT_TIERS = [250, 500, 1000, 1500, 2000];
var SHIP_INT = {
  1: { name: 'New Zealand', c: [1790, 2160, 2900, 3640, 4380], add: 505 },
  2: { name: 'Asia Pacific', c: [2060, 2685, 3940, 5195, 6450], add: 675 },
  3: { name: 'USA & Canada', c: [2305, 2995, 4360, 5740, 7110], add: 800 },
  4: { name: 'UK & Europe', c: [2840, 3555, 4990, 6420, 7850], add: 895 },
  5: { name: 'Rest of world', c: [3445, 4380, 6250, 8115, 9980], add: 1205 }
};
// Every destination Australia Post sends parcels to, with its zone (auspost.com.au international zones).
var SHIP_COUNTRY_ZONE = {"Afghanistan":5,"Albania":4,"Algeria":5,"American Samoa":2,"Andorra":4,"Angola":5,"Anguilla":5,"Antigua and Barbuda":5,"Argentina":5,"Armenia":5,"Aruba":5,"Austria":4,"Azerbaijan":5,"Bahamas":5,"Bahrain":5,"Bangladesh":2,"Barbados":5,"Belarus":5,"Belgium":4,"Belize":5,"Benin":5,"Bermuda":5,"Bhutan":5,"Bolivia":5,"Bonaire, Eustatius and Saba":5,"Bosnia and Herzegovina":4,"Botswana":5,"Brazil":4,"British Indian Ocean Territory":5,"Brunei Darussalam":2,"Bulgaria":4,"Burkina Faso":5,"Burundi":5,"Cabo Verde (formerly Cape Verde)":2,"Cambodia":5,"Cameroon":5,"Canada":3,"Cayman Islands":5,"Central African Republic":5,"Chad":5,"Chile":5,"China":2,"Colombia":5,"Comoros":5,"Congo (Republic)":5,"Congo (Democratic Republic)":5,"Cook Islands":2,"Costa Rica":5,"Cote d'Ivoire":5,"Croatia":4,"Cuba":5,"Curaçao":4,"Cyprus":4,"Czechia (Czech Republic)":4,"Denmark":4,"Djibouti":5,"Dominica":5,"Dominican Republic":5,"Ecuador":5,"Egypt":5,"El Salvador":5,"Equatorial Guinea":5,"Eritrea":5,"Estonia":5,"Eswatini":5,"Ethiopia":5,"Falkland Islands (Malvinas)":5,"Faroe Islands":5,"Fiji":2,"Finland":4,"France":4,"French Guiana":5,"French Polynesia":2,"Gabon":5,"Gambia":5,"Georgia":5,"Germany":4,"Ghana":5,"Gibraltar":5,"Greece":4,"Greenland":5,"Grenada":5,"Guadeloupe":5,"Guam":2,"Guatemala":5,"Guinea":5,"Guinea-Bissau":5,"Guyana":5,"Haiti":5,"Holy See":5,"Honduras":5,"Hong Kong":2,"Hungary":4,"Iceland":4,"India":2,"Indonesia":2,"Iran":5,"Iraq":5,"Ireland":4,"Israel":5,"Italy":4,"Jamaica":5,"Japan":2,"Jordan":5,"Kazakhstan":5,"Kenya":5,"Kiribati":2,"Kosovo":5,"Kuwait":5,"Kyrgyzstan":5,"Laos":2,"Latvia":5,"Lebanon":5,"Lesotho":5,"Liberia":5,"Libya":5,"Liechtenstein":5,"Lithuania":5,"Luxembourg":5,"Macao":2,"Madagascar":5,"Malawi":5,"Malaysia":2,"Maldives":2,"Mali":5,"Malta":4,"Marshall Islands":2,"Martinique":5,"Mauritania":5,"Mauritius":5,"Mexico":5,"Micronesia":2,"Moldova":5,"Monaco":4,"Mongolia":5,"Montenegro":4,"Montserrat":5,"Morocco":5,"Mozambique":5,"Myanmar (Burma)":2,"Namibia":5,"Nauru":2,"Nepal":2,"Netherlands":4,"New Caledonia":2,"New Zealand":1,"Nicaragua":5,"Niger":5,"Nigeria":5,"Niue":2,"North Korea":2,"North Macedonia":4,"Northern Mariana Islands":2,"Norway":4,"Oman":5,"Pakistan":2,"Panama":5,"Papua New Guinea":2,"Paraguay":5,"Peru":5,"Philippines":2,"Pitcairn":2,"Poland":4,"Portugal":4,"Puerto Rico":5,"Qatar":5,"Reunion":5,"Romania":4,"Russian Federation":4,"Rwanda":5,"Saint Helena, Ascension and Tristan da Cunha":5,"Saint Kitts and Nevis":5,"Saint Lucia":5,"Saint Martin (French part)":5,"Saint Pierre and Miquelon":5,"Saint Vincent and the Grenadines":5,"Samoa":2,"Sao Tome and Principe":5,"Saudi Arabia":5,"Senegal":5,"Serbia":4,"Seychelles":5,"Sierra Leone":5,"Singapore":2,"Slovak Republic (Slovakia)":4,"Slovenia":4,"Solomon Islands":2,"Somalia":5,"South Africa":4,"South Korea":2,"Spain":4,"Sri Lanka":2,"Sudan":5,"Suriname":5,"Sweden":4,"Switzerland":4,"Syrian Arab Republic":5,"Taiwan":2,"Tajikistan":5,"Tanzania":5,"Thailand":2,"Timor Leste":2,"Togo":5,"Tokelau":2,"Tonga":2,"Trinidad and Tobago":5,"Tunisia":5,"Turkiye":4,"Turkmenistan":5,"Turks and Caicos Islands":5,"Tuvalu":2,"Uganda":5,"Ukraine":4,"United Arab Emirates":5,"United Kingdom (including Northern Ireland)":4,"United States":3,"United States Minor Outlying Islands":3,"Uruguay":5,"Uzbekistan":5,"Vanuatu":2,"Venezuela, Bolivarian Republic of":5,"Vietnam":2,"Virgin Islands (British)":5,"Virgin Islands (U.S.)":5,"Wallis and Futuna":2,"Yemen":5,"Zambia":5};

// Standard price in cents -> Band 1 price in dollars (5% off, rounded to the nearest cent).
function shipBand1_(cents) { return Math.floor((cents * 95 + 50) / 100) / 100; }

function shipPcZone_(pc) {
  for (var i = 0; i < SHIP_PC_ZONES.length; i++) {
    if (pc >= SHIP_PC_ZONES[i][0] && pc <= SHIP_PC_ZONES[i][1]) return SHIP_PC_ZONES[i][2];
  }
  return null;
}

// grams = parcel weight; zone3 = 0 Perth & WA major areas, 1 capital / major area, 2 rural.
function shipDomestic_(grams, pc, zone3) {
  var g = Math.min(grams, SHIP_CAP_G);
  for (var i = 0; i < SHIP_DOM_TIERS.length; i++) {
    if (g <= SHIP_DOM_TIERS[i]) {
      return { cost: SHIP_DOM_PRICES[i][zone3], label: SHIP_DOM_TIER_NAMES[i] + ', ' + SHIP_DOM_ZONE_NAMES[zone3] };
    }
  }
  var dz = shipPcZone_(pc);
  var perKg = dz ? SHIP_PERKG_C[dz] : SHIP_PERKG_DEFAULT_C;
  var extraKg = Math.ceil((g - 5000) / 1000);
  return { cost: shipBand1_(SHIP_DOM_BASE_C + perKg * extraKg),
    label: 'Parcel up to ' + Math.ceil(g / 1000) + 'kg, ' + SHIP_DOM_ZONE_NAMES[zone3] };
}

// Returns null if Australia Post does not send parcels to that country.
function shipInternational_(grams, country) {
  var zn = SHIP_COUNTRY_ZONE[country];
  if (!zn) return null;
  var t = SHIP_INT[zn];
  var g = Math.min(grams, SHIP_CAP_G);
  var c = t.c[4] + Math.max(0, Math.ceil((g - 2000) / 500)) * t.add;
  for (var i = 0; i < SHIP_INT_TIERS.length; i++) {
    if (g <= SHIP_INT_TIERS[i]) { c = t.c[i]; break; }
  }
  return { cost: shipBand1_(c), label: t.name + ' (zone ' + zn + ')' };
}

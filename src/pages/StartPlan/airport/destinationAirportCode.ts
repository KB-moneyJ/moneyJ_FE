// destinationAirportCode.ts

export const CITY_TO_IATA: Record<string, string> = {
  // 🇯🇵 Japan
  "Tokyo": "NRT",
  "Osaka": "KIX",
  "Kyoto": "KIX", // 교토는 간사이공항
  "Fukuoka": "FUK",
  "Sapporo": "CTS",
  "Nagoya": "NGO",
  "Okinawa": "OKA",
  "Hiroshima": "HIJ",

  // 🇰🇷 Korea
  "Seoul": "ICN",
  "Incheon": "ICN",
  "Busan": "PUS",
  "Daegu": "TAE",
  "Jeju": "CJU",
  "Gwangju": "KWJ",
  "Jeonju": "ICN", // 국제선 없음 → 기본 인천
  "Gangneung": "ICN",

  // 🇺🇸 USA
  "New York": "JFK",
  "Los Angeles": "LAX",
  "Las Vegas": "LAS",
  "San Francisco": "SFO",
  "Miami": "MIA",
  "Chicago": "ORD",
  "Washington D.C.": "IAD",
  "Boston": "BOS",

  // 🇫🇷 France
  "Paris": "CDG",
  "Marseille": "MRS",
  "Lyon": "LYS",
  "Nice": "NCE",
  "Bordeaux": "BOD",
  "Toulouse": "TLS",
  "Strasbourg": "SXB",
  "Lille": "LIL",

  // 🇮🇹 Italy
  "Rome": "FCO",
  "Milan": "MXP",
  "Venice": "VCE",
  "Florence": "FLR",
  "Naples": "NAP",
  "Turin": "TRN",
  "Bologna": "BLQ",
  "Genoa": "GOA",

  // 🇪🇸 Spain
  "Barcelona": "BCN",
  "Madrid": "MAD",
  "Seville": "SVQ",
  "Valencia": "VLC",
  "Malaga": "AGP",
  "Bilbao": "BIO",
  "Granada": "GRX",
  "Toledo": "MAD",

  // 🇬🇧 UK
  "London": "LHR",
  "Manchester": "MAN",
  "Liverpool": "LPL",
  "Oxford": "LHR",
  "Cambridge": "STN",
  "Edinburgh": "EDI",
  "Glasgow": "GLA",
  "Bristol": "BRS",

  // 🇩🇪 Germany
  "Berlin": "BER",
  "Munich": "MUC",
  "Frankfurt": "FRA",
  "Hamburg": "HAM",
  "Cologne": "CGN",
  "Dresden": "DRS",
  "Stuttgart": "STR",
  "Heidelberg": "FRA",

  // 🇨🇭 Switzerland
  "Zurich": "ZRH",
  "Geneva": "GVA",
  "Lucerne": "ZRH",
  "Interlaken": "BRN",
  "Bern": "BRN",
  "Basel": "BSL",
  "Zermatt": "SIR",
  "Lauterbrunnen": "BRN",

  // 🇨🇳 China
  "Beijing": "PEK",
  "Shanghai": "PVG",
  "Guangzhou": "CAN",
  "Chengdu": "CTU",
  "Xi'an": "XIY",
  "Hangzhou": "HGH",
  "Chongqing": "CKG",
  "Harbin": "HRB",

  // 🇹🇭 Thailand
  "Bangkok": "BKK",
  "Chiang Mai": "CNX",
  "Phuket": "HKT",
  "Pattaya": "UTP",
  "Koh Samui": "USM",
  "Krabi": "KBV",
  "Hua Hin": "HHQ",
  "Chiang Rai": "CEI",

  // 🇻🇳 Vietnam
  "Hanoi": "HAN",
  "Ho Chi Minh City": "SGN",
  "Da Nang": "DAD",
  "Nha Trang": "CXR",
  "Hoi An": "DAD",
  "Ha Long": "HPH",
  "Hue": "HUI",
  "Phan Thiet": "SGN",

  // 🇦🇺 Australia
  "Sydney": "SYD",
  "Melbourne": "MEL",
  "Brisbane": "BNE",
  "Perth": "PER",
  "Adelaide": "ADL",
  "Cairns": "CNS",
  "Gold Coast": "OOL",
  "Hobart": "HBA",

  // 🇨🇦 Canada
  "Vancouver": "YVR",
  "Toronto": "YYZ",
  "Montreal": "YUL",
  "Quebec City": "YQB",
  "Ottawa": "YOW",
  "Calgary": "YYC",
  "Edmonton": "YEG",
  "Niagara Falls": "BUF",

  // 🇧🇷 Brazil
  "Rio de Janeiro": "GIG",
  "São Paulo": "GRU",
  "Brasília": "BSB",
  "Salvador": "SSA",
  "Recife": "REC",
  "Curitiba": "CWB",
  "Porto Alegre": "POA",
  "Fortaleza": "FOR",

  // 🇦🇪 UAE
  "Dubai": "DXB",
  "Abu Dhabi": "AUH",
  "Sharjah": "SHJ",
  "Al Ain": "AAN",
  "Ras Al Khaimah": "RKT",
  "Fujairah": "FJR",
  "Ajman": "DXB",
  "Umm Al Quwain": "DXB",

  // 🇹🇷 Turkey
  "Istanbul": "IST",
  "Ankara": "ESB",
  "Izmir": "ADB",
  "Antalya": "AYT",
  "Cappadocia": "NAV",
  "Bursa": "YEI",
  "Konya": "KYA",
  "Trabzon": "TZX",
};


export const getDestinationAirportCode = (city: string): string => {
  return CITY_TO_IATA[city] ?? "ICN"; // 기본값 인천
};

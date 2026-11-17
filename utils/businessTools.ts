// Business & Generation Suite for ToolifyPro

export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean = false
): number[] {
  if (min > max) throw new Error("Minimum value cannot exceed maximum");
  const range = max - min + 1;
  if (!allowDuplicates && count > range) {
    throw new Error(`Cannot generate ${count} unique numbers in a range of ${range}`);
  }

  const results: number[] = [];
  const used = new Set<number>();

  const cryptoObj = typeof window !== "undefined" && window.crypto ? window.crypto : globalThis.crypto;

  while (results.length < count) {
    const arr = new Uint32Array(1);
    if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(arr);
    } else {
      arr[0] = Math.floor(Math.random() * 0xffffffff);
    }
    const num = min + (arr[0] % range);
    if (!allowDuplicates) {
      if (!used.has(num)) {
        used.add(num);
        results.push(num);
      }
    } else {
      results.push(num);
    }
  }

  return results;
}

export function generateUsernames(keyword: string = "pro", count: number = 10, category: string = "tech"): string[] {
  const prefixes = ["TheReal", "Neo", "Hyper", "Apex", "Cyber", "Vivid", "Nova", "Cosmic", "Ultra", "Alpha"];
  const suffixes = ["Craft", "Dev", "Hub", "Lab", "Flow", "Sphere", "Pulse", "Byte", "Matrix", "Elite"];
  const gamingAdjectives = ["Shadow", "Frost", "Ghost", "Blaze", "Viper", "Titan", "Phantom", "Rogue"];

  const clean = keyword.replace(/[^a-zA-Z0-9]/g, "") || "user";
  const list: string[] = [];

  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * 900) + 100;
    const p = prefixes[i % prefixes.length];
    const s = suffixes[i % suffixes.length];
    const g = gamingAdjectives[i % gamingAdjectives.length];

    if (category === "gaming") {
      list.push(`${g}_${clean}${rand}`);
    } else if (category === "tech") {
      list.push(`${clean}${s}${rand}`);
    } else {
      list.push(`${p}${clean}`);
    }
  }
  return list;
}

export function generateBusinessNames(industry: string, keyword: string = "Tech"): string[] {
  const clean = keyword.trim() || "Nova";
  const templates = [
    `${clean} Dynamics`,
    `${clean} Innovations`,
    `NextGen ${clean}`,
    `Omni${clean}`,
    `${clean}ly`,
    `Vanguard ${clean}`,
    `${clean} Stack`,
    `${clean} Flow Solutions`,
    `Aero${clean}`,
    `${clean} Prime`,
  ];
  return templates;
}

export function generateDomainIdeas(keyword: string): string[] {
  const clean = keyword.toLowerCase().replace(/[^a-z0-9]/g, "") || "tools";
  const tlds = [".com", ".io", ".co", ".app", ".dev", ".net", ".tech", ".ai"];
  const prefixes = ["get", "my", "the", "try", "use"];
  const results: string[] = [];

  tlds.forEach((tld) => {
    results.push(`${clean}${tld}`);
  });

  prefixes.forEach((p) => {
    results.push(`${p}${clean}.com`);
  });

  return results;
}

export function generateHashtags(topic: string): string[] {
  const clean = topic.toLowerCase().replace(/[^a-z0-9]/g, "") || "business";
  return [
    `#${clean}`,
    `#${clean}Life`,
    `#${clean}Tips`,
    `#${clean}Trends`,
    `#${clean}Community`,
    `#Daily${clean}`,
    `#Insta${clean}`,
    `#Best${clean}`,
    `#${clean}Inspiration`,
    `#${clean}Goals`,
  ];
}

export interface ColorSwatch {
  hex: string;
  rgb: string;
  hsl: string;
}

export function generateColorPalette(mode: "complementary" | "analogous" | "triadic" | "monochromatic" = "analogous"): ColorSwatch[] {
  const baseHue = Math.floor(Math.random() * 360);
  const hues: number[] = [];

  if (mode === "complementary") {
    hues.push(baseHue, (baseHue + 180) % 360, (baseHue + 30) % 360, (baseHue + 210) % 360, (baseHue + 60) % 360);
  } else if (mode === "triadic") {
    hues.push(baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360, (baseHue + 60) % 360, (baseHue + 180) % 360);
  } else {
    hues.push(baseHue, (baseHue + 25) % 360, (baseHue + 50) % 360, (baseHue + 75) % 360, (baseHue + 100) % 360);
  }

  return hues.map((h, idx) => {
    const s = 70;
    const l = 40 + idx * 10;
    // HSL to RGB conversion
    const c = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const R = Math.round((r + m) * 255);
    const G = Math.round((g + m) * 255);
    const B = Math.round((b + m) * 255);

    const hex = "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${R}, ${G}, ${B})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
    };
  });
}

export function buildUTMLink(params: {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}): string {
  if (!params.baseUrl) throw new Error("Base URL is required");
  let urlStr = params.baseUrl.trim();
  if (!/^https?:\/\//i.test(urlStr)) urlStr = "https://" + urlStr;

  const url = new URL(urlStr);
  if (params.source) url.searchParams.set("utm_source", params.source);
  if (params.medium) url.searchParams.set("utm_medium", params.medium);
  if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
  if (params.term) url.searchParams.set("utm_term", params.term);
  if (params.content) url.searchParams.set("utm_content", params.content);

  return url.toString();
}

export function generateCoverLetter(params: {
  fullName: string;
  role: string;
  company: string;
  yearsExperience: number;
  keySkills: string;
}): string {
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `${params.fullName}
${dateStr}

Hiring Team
${params.company}

Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${params.role} position at ${params.company}. With over ${params.yearsExperience} years of experience specializing in ${params.keySkills}, I have consistently delivered robust results, accelerated project lifecycles, and collaborated effectively across cross-functional teams.

At my previous roles, I honed my expertise by solving critical engineering challenges and driving customer value. I have long admired ${params.company}'s commitment to quality and forward-thinking innovation, and I am eager to contribute my background in ${params.keySkills} to your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my qualifications align with your current objectives.

Sincerely,
${params.fullName}`;
}

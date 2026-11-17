// Comprehensive mathematical calculators suite for ToolifyPro

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  nextBirthdayDays: number;
  dayOfWeek: string;
}

export function calculateAge(dobString: string): AgeResult {
  const dob = new Date(dobString);
  const now = new Date();

  if (isNaN(dob.getTime())) throw new Error("Invalid date of birth provided");
  if (dob > now) throw new Error("Date of birth cannot be in the future");

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Next birthday calculation
  let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < now) {
    nextBday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const nextDiffMs = nextBday.getTime() - now.getTime();
  const nextBirthdayDays = Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[dob.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    nextBirthdayDays,
    dayOfWeek,
  };
}

export interface BMIResult {
  bmi: number;
  category: "Underweight" | "Normal weight" | "Overweight" | "Obesity Class I" | "Obesity Class II" | "Obesity Class III";
  healthyWeightRange: string;
  prime: number;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  if (weightKg <= 0 || heightCm <= 0) throw new Error("Weight and height must be greater than zero");
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category: BMIResult["category"] = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else if (bmi < 35) category = "Obesity Class I";
  else if (bmi < 40) category = "Obesity Class II";
  else category = "Obesity Class III";

  const minHealthy = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const maxHealthy = parseFloat((24.9 * heightM * heightM).toFixed(1));

  return {
    bmi,
    category,
    healthyWeightRange: `${minHealthy} kg - ${maxHealthy} kg`,
    prime: parseFloat((bmi / 25).toFixed(2)),
  };
}

export function calculatePercentage(
  mode: "percentOf" | "isWhatPercent" | "percentChange",
  valA: number,
  valB: number
): { result: number; formula: string; text: string } {
  if (mode === "percentOf") {
    // What is valA% of valB?
    const res = (valA / 100) * valB;
    return {
      result: parseFloat(res.toFixed(2)),
      formula: `(${valA} / 100) * ${valB}`,
      text: `${valA}% of ${valB} is ${parseFloat(res.toFixed(2))}`,
    };
  } else if (mode === "isWhatPercent") {
    // valA is what % of valB?
    if (valB === 0) throw new Error("Cannot divide by zero");
    const res = (valA / valB) * 100;
    return {
      result: parseFloat(res.toFixed(2)),
      formula: `(${valA} / ${valB}) * 100`,
      text: `${valA} is ${parseFloat(res.toFixed(2))}% of ${valB}`,
    };
  } else {
    // % change from A to B
    if (valA === 0) throw new Error("Base value cannot be zero");
    const diff = valB - valA;
    const res = (diff / valA) * 100;
    const type = res >= 0 ? "increase" : "decrease";
    return {
      result: parseFloat(res.toFixed(2)),
      formula: `((${valB} - ${valA}) / ${valA}) * 100`,
      text: `${Math.abs(parseFloat(res.toFixed(2)))}% ${type}`,
    };
  }
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
  taxPercent: number = 0
): { savings: number; finalPrice: number; taxAmount: number } {
  if (originalPrice < 0 || discountPercent < 0) throw new Error("Values cannot be negative");
  const savings = (originalPrice * discountPercent) / 100;
  const discountedPrice = originalPrice - savings;
  const taxAmount = (discountedPrice * taxPercent) / 100;
  const finalPrice = discountedPrice + taxAmount;
  return {
    savings: parseFloat(savings.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
  };
}

export function calculateProfit(
  revenue: number,
  cost: number
): { profit: number; marginPercent: number; markupPercent: number } {
  const profit = revenue - cost;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markupPercent = cost > 0 ? (profit / cost) * 100 : 0;
  return {
    profit: parseFloat(profit.toFixed(2)),
    marginPercent: parseFloat(marginPercent.toFixed(2)),
    markupPercent: parseFloat(markupPercent.toFixed(2)),
  };
}

export function calculateProfitMargin(
  cost: number,
  targetMarginPercent: number
): { sellingPrice: number; grossProfit: number; markupPercent: number } {
  if (targetMarginPercent >= 100) throw new Error("Profit margin must be less than 100%");
  const sellingPrice = cost / (1 - targetMarginPercent / 100);
  const grossProfit = sellingPrice - cost;
  const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;
  return {
    sellingPrice: parseFloat(sellingPrice.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    markupPercent: parseFloat(markupPercent.toFixed(2)),
  };
}

export interface EMIResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  yearlySchedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): EMIResult {
  if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
    throw new Error("Invalid loan parameters");
  }
  const monthlyRate = annualRate / 12 / 100;
  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  let balance = principal;
  let totalInterest = 0;
  const yearlySchedule: EMIResult["yearlySchedule"] = [];
  const years = Math.ceil(tenureMonths / 12);

  for (let y = 1; y <= years; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, emi - interestForMonth);
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance -= principalForMonth;
    }
    totalInterest += yearInterest;
    yearlySchedule.push({
      year: y,
      principalPaid: parseFloat(yearPrincipal.toFixed(2)),
      interestPaid: parseFloat(yearInterest.toFixed(2)),
      balance: Math.max(0, parseFloat(balance.toFixed(2))),
    });
  }

  return {
    monthlyEmi: parseFloat(emi.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPayment: parseFloat((principal + totalInterest).toFixed(2)),
    yearlySchedule,
  };
}

export interface CompoundInterestResult {
  futureValue: number;
  totalPrincipal: number;
  totalInterest: number;
  growthSchedule: { year: number; deposit: number; interestEarned: number; balance: number }[];
}

export function calculateCompoundInterest(
  initialPrincipal: number,
  annualRate: number,
  years: number,
  compoundFrequency: number = 12, // 1=annual, 12=monthly
  annualAddition: number = 0
): CompoundInterestResult {
  let balance = initialPrincipal;
  let totalDeposits = initialPrincipal;
  const growthSchedule: CompoundInterestResult["growthSchedule"] = [];

  for (let y = 1; y <= years; y++) {
    balance += annualAddition;
    totalDeposits += annualAddition;
    const ratePerPeriod = annualRate / 100 / compoundFrequency;
    const startBalance = balance;
    balance = balance * Math.pow(1 + ratePerPeriod, compoundFrequency);
    const interestThisYear = balance - startBalance;

    growthSchedule.push({
      year: y,
      deposit: totalDeposits,
      interestEarned: parseFloat(interestThisYear.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  }

  return {
    futureValue: parseFloat(balance.toFixed(2)),
    totalPrincipal: totalDeposits,
    totalInterest: parseFloat((balance - totalDeposits).toFixed(2)),
    growthSchedule,
  };
}

export function calculateSalary(
  amount: number,
  period: "hourly" | "daily" | "weekly" | "monthly" | "annual",
  hoursPerWeek: number = 40
): { hourly: number; weekly: number; biweekly: number; monthly: number; annual: number } {
  let annual = 0;
  const weeksPerYear = 52;
  const hoursPerYear = hoursPerWeek * weeksPerYear;

  switch (period) {
    case "hourly":
      annual = amount * hoursPerYear;
      break;
    case "daily":
      annual = amount * (hoursPerWeek / 8) * weeksPerYear;
      break;
    case "weekly":
      annual = amount * weeksPerYear;
      break;
    case "monthly":
      annual = amount * 12;
      break;
    case "annual":
      annual = amount;
      break;
  }

  return {
    hourly: parseFloat((annual / hoursPerYear).toFixed(2)),
    weekly: parseFloat((annual / weeksPerYear).toFixed(2)),
    biweekly: parseFloat((annual / 26).toFixed(2)),
    monthly: parseFloat((annual / 12).toFixed(2)),
    annual: parseFloat(annual.toFixed(2)),
  };
}

export const CURRENCY_RATES: Record<string, { name: string; rateToUSD: number; symbol: string }> = {
  USD: { name: "US Dollar", rateToUSD: 1.0, symbol: "$" },
  EUR: { name: "Euro", rateToUSD: 0.92, symbol: "€" },
  GBP: { name: "British Pound", rateToUSD: 0.79, symbol: "£" },
  JPY: { name: "Japanese Yen", rateToUSD: 154.5, symbol: "¥" },
  CAD: { name: "Canadian Dollar", rateToUSD: 1.38, symbol: "CA$" },
  AUD: { name: "Australian Dollar", rateToUSD: 1.52, symbol: "A$" },
  CHF: { name: "Swiss Franc", rateToUSD: 0.88, symbol: "CHF" },
  CNY: { name: "Chinese Yuan", rateToUSD: 7.23, symbol: "¥" },
  INR: { name: "Indian Rupee", rateToUSD: 83.4, symbol: "₹" },
  AED: { name: "UAE Dirham", rateToUSD: 3.67, symbol: "AED" },
  SAR: { name: "Saudi Riyal", rateToUSD: 3.75, symbol: "SAR" },
  PKR: { name: "Pakistani Rupee", rateToUSD: 278.5, symbol: "Rs" },
  SGD: { name: "Singapore Dollar", rateToUSD: 1.34, symbol: "S$" },
  NZD: { name: "New Zealand Dollar", rateToUSD: 1.64, symbol: "NZ$" },
  MXN: { name: "Mexican Peso", rateToUSD: 17.1, symbol: "Mex$" },
  BRL: { name: "Brazilian Real", rateToUSD: 5.15, symbol: "R$" },
  ZAR: { name: "South African Rand", rateToUSD: 18.5, symbol: "R" },
  SEK: { name: "Swedish Krona", rateToUSD: 10.6, symbol: "kr" },
  NOK: { name: "Norwegian Krone", rateToUSD: 10.8, symbol: "kr" },
  TRY: { name: "Turkish Lira", rateToUSD: 32.2, symbol: "₺" },
};

export function convertCurrency(amount: number, from: string, to: string): { result: number; rate: number } {
  const fromData = CURRENCY_RATES[from] || { rateToUSD: 1.0 };
  const toData = CURRENCY_RATES[to] || { rateToUSD: 1.0 };
  // Convert from currency -> USD -> to currency
  const inUSD = amount / fromData.rateToUSD;
  const result = inUSD * toData.rateToUSD;
  const rate = toData.rateToUSD / fromData.rateToUSD;
  return {
    result: parseFloat(result.toFixed(2)),
    rate: parseFloat(rate.toFixed(4)),
  };
}

export function calculateDateDifference(
  startDateStr: string,
  endDateStr: string
): { totalDays: number; weeks: number; businessDays: number; weekendDays: number } {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Invalid dates");

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = parseFloat((totalDays / 7).toFixed(1));

  let businessDays = 0;
  let weekendDays = 0;
  const cur = new Date(Math.min(start.getTime(), end.getTime()));
  const finish = new Date(Math.max(start.getTime(), end.getTime()));

  while (cur < finish) {
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return { totalDays, weeks, businessDays, weekendDays };
}

export interface GpaCourse {
  name: string;
  grade: string;
  credits: number;
}

export const GPA_SCALE: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export function calculateGPA(courses: GpaCourse[]): { gpa: number; totalCredits: number; gradePoints: number } {
  if (courses.length === 0) return { gpa: 0, totalCredits: 0, gradePoints: 0 };
  let totalPoints = 0;
  let totalCredits = 0;

  for (const c of courses) {
    const pts = GPA_SCALE[c.grade.toUpperCase()] ?? 0.0;
    totalPoints += pts * c.credits;
    totalCredits += c.credits;
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return {
    gpa: parseFloat(gpa.toFixed(2)),
    totalCredits,
    gradePoints: parseFloat(totalPoints.toFixed(2)),
  };
}

export function calculateFuelCost(
  distanceKm: number,
  consumptionLPer100Km: number,
  fuelPricePerL: number,
  passengers: number = 1
): { totalLiters: number; totalCost: number; costPerPerson: number } {
  if (distanceKm <= 0 || consumptionLPer100Km <= 0 || fuelPricePerL <= 0) {
    throw new Error("Inputs must be positive");
  }
  const totalLiters = (distanceKm / 100) * consumptionLPer100Km;
  const totalCost = totalLiters * fuelPricePerL;
  const costPerPerson = totalCost / Math.max(1, passengers);
  return {
    totalLiters: parseFloat(totalLiters.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    costPerPerson: parseFloat(costPerPerson.toFixed(2)),
  };
}

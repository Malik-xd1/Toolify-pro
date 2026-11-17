"use client";

import React, { useState, useEffect } from "react";
import {
  calculateAge,
  calculateBMI,
  calculatePercentage,
  calculateDiscount,
  calculateProfit,
  calculateProfitMargin,
  calculateEMI,
  calculateCompoundInterest,
  calculateSalary,
  convertCurrency,
  calculateDateDifference,
  calculateGPA,
  calculateFuelCost,
  CURRENCY_RATES,
} from "@/utils/calculatorTools";
import { Calculator, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

interface CalculatorWorkbenchProps {
  toolId: string;
}

export default function CalculatorWorkbench({ toolId }: CalculatorWorkbenchProps) {
  // 1. Age
  const [dob, setDob] = useState("2000-01-01");
  const [ageResult, setAgeResult] = useState<ReturnType<typeof calculateAge> | null>(null);

  useEffect(() => {
    try {
      setAgeResult(calculateAge(dob));
    } catch {}
  }, []);

  // 2. BMI
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [bmiResult, setBmiResult] = useState<ReturnType<typeof calculateBMI> | null>(() => {
    try { return calculateBMI(70, 175); } catch { return null; }
  });

  // 3. Percentage
  const [pctMode, setPctMode] = useState<"percentOf" | "isWhatPercent" | "percentChange">("percentOf");
  const [pctA, setPctA] = useState(20);
  const [pctB, setPctB] = useState(150);
  const [pctResult, setPctResult] = useState<string>("20% of 150 is 30");

  // 4. Discount
  const [discPrice, setDiscPrice] = useState(100);
  const [discPercent, setDiscPercent] = useState(25);
  const [discTax, setDiscTax] = useState(5);
  const [discResult, setDiscResult] = useState(() => calculateDiscount(100, 25, 5));

  // 5. Profit & Margin
  const [revenue, setRevenue] = useState(500);
  const [cost, setCost] = useState(300);
  const [profitResult, setProfitResult] = useState(() => calculateProfit(500, 300));
  const [targetMargin, setTargetMargin] = useState(40);
  const [marginResult, setMarginResult] = useState(() => calculateProfitMargin(300, 40));

  // 6. EMI & Loan
  const [loanPrincipal, setLoanPrincipal] = useState(50000);
  const [loanRate, setLoanRate] = useState(7.5);
  const [loanMonths, setLoanMonths] = useState(36);
  const [emiResult, setEmiResult] = useState(() => calculateEMI(50000, 7.5, 36));

  // 7. Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState(10000);
  const [ciRate, setCiRate] = useState(8);
  const [ciYears, setCiYears] = useState(5);
  const [ciAddition, setCiAddition] = useState(1000);
  const [ciResult, setCiResult] = useState(() => calculateCompoundInterest(10000, 8, 5, 12, 1000));

  // 8. Salary
  const [salAmount, setSalAmount] = useState(35);
  const [salPeriod, setSalPeriod] = useState<"hourly" | "daily" | "weekly" | "monthly" | "annual">("hourly");
  const [salResult, setSalResult] = useState(() => calculateSalary(35, "hourly"));

  // 9. Currency
  const [currAmount, setCurrAmount] = useState(100);
  const [currFrom, setCurrFrom] = useState("USD");
  const [currTo, setCurrTo] = useState("EUR");
  const [currResult, setCurrResult] = useState(() => convertCurrency(100, "USD", "EUR"));

  // 10. Date Diff
  const [dateStart, setDateStart] = useState("2025-01-01");
  const [dateEnd, setDateEnd] = useState("2025-12-31");
  const [dateDiffResult, setDateDiffResult] = useState(() => calculateDateDifference("2025-01-01", "2025-12-31"));

  // 11. GPA
  const [gpaCourses, setGpaCourses] = useState([
    { name: "Computer Science", grade: "A", credits: 4 },
    { name: "Calculus II", grade: "B+", credits: 4 },
    { name: "Physics Lab", grade: "A-", credits: 3 },
  ]);
  const [gpaResult, setGpaResult] = useState(() => calculateGPA(gpaCourses));

  // 12. Scientific
  const [sciDisplay, setSciDisplay] = useState("0");
  const [sciMemory, setSciMemory] = useState(0);

  // 13. Fuel Cost
  const [fuelDist, setFuelDist] = useState(350);
  const [fuelCons, setFuelCons] = useState(7.5);
  const [fuelPrice, setFuelPrice] = useState(1.45);
  const [fuelPass, setFuelPass] = useState(2);
  const [fuelResult, setFuelResult] = useState(() => calculateFuelCost(350, 7.5, 1.45, 2));

  // Helper calculation triggers
  const handleCalcAge = () => {
    try { setAgeResult(calculateAge(dob)); } catch {}
  };

  const handleCalcBmi = () => {
    try { setBmiResult(calculateBMI(weightKg, heightCm)); } catch {}
  };

  const handleCalcPct = () => {
    try {
      const res = calculatePercentage(pctMode, pctA, pctB);
      setPctResult(res.text);
    } catch {}
  };

  const handleCalcDiscount = () => {
    try { setDiscResult(calculateDiscount(discPrice, discPercent, discTax)); } catch {}
  };

  const handleCalcProfit = () => {
    try { setProfitResult(calculateProfit(revenue, cost)); } catch {}
  };

  const handleCalcMargin = () => {
    try { setMarginResult(calculateProfitMargin(cost, targetMargin)); } catch {}
  };

  const handleCalcEmi = () => {
    try { setEmiResult(calculateEMI(loanPrincipal, loanRate, loanMonths)); } catch {}
  };

  const handleCalcCi = () => {
    try { setCiResult(calculateCompoundInterest(ciPrincipal, ciRate, ciYears, 12, ciAddition)); } catch {}
  };

  const handleCalcSalary = () => {
    try { setSalResult(calculateSalary(salAmount, salPeriod)); } catch {}
  };

  const handleCalcCurrency = () => {
    try { setCurrResult(convertCurrency(currAmount, currFrom, currTo)); } catch {}
  };

  const handleCalcDateDiff = () => {
    try { setDateDiffResult(calculateDateDifference(dateStart, dateEnd)); } catch {}
  };

  const handleCalcGpa = (updatedCourses = gpaCourses) => {
    try { setGpaResult(calculateGPA(updatedCourses)); } catch {}
  };

  const handleCalcFuel = () => {
    try { setFuelResult(calculateFuelCost(fuelDist, fuelCons, fuelPrice, fuelPass)); } catch {}
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. AGE CALCULATOR */}
      {toolId === "age-calculator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  try { setAgeResult(calculateAge(e.target.value)); } catch {}
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 font-semibold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCalcAge}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Exact Age</span>
              </button>
            </div>
          </div>

          {ageResult && (
            <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 border border-rose-500/30 rounded-2xl p-5">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-rose-500 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Age Breakdown</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{ageResult.years}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Years Old</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{ageResult.months}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Months</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{ageResult.days}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Days</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{ageResult.nextBirthdayDays}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Days to Birthday</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                Born on a <strong className="text-slate-700 dark:text-slate-200">{ageResult.dayOfWeek}</strong> • Total days lived: {ageResult.totalDays.toLocaleString()} days ({ageResult.totalHours.toLocaleString()} hours)
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. BMI CALCULATOR */}
      {toolId === "bmi-calculator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setWeightKg(val);
                  try { setBmiResult(calculateBMI(val, heightCm)); } catch {}
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setHeightCm(val);
                  try { setBmiResult(calculateBMI(weightKg, val)); } catch {}
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 font-semibold"
              />
            </div>
          </div>

          {bmiResult && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
              <span className="text-xs uppercase font-extrabold text-slate-400">Your Body Mass Index</span>
              <div className="text-4xl font-black text-rose-500 my-1">{bmiResult.bmi}</div>
              <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 mb-3">
                {bmiResult.category}
              </div>
              <p className="text-xs text-slate-500">
                Healthy weight range for your height: <strong>{bmiResult.healthyWeightRange}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. PERCENTAGE CALCULATOR */}
      {toolId === "percentage-calculator" && (
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setPctMode("percentOf")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${pctMode === "percentOf" ? "bg-rose-600 text-white" : "text-slate-500"}`}
            >
              What is X% of Y?
            </button>
            <button
              onClick={() => setPctMode("isWhatPercent")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${pctMode === "isWhatPercent" ? "bg-rose-600 text-white" : "text-slate-500"}`}
            >
              X is what % of Y?
            </button>
            <button
              onClick={() => setPctMode("percentChange")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${pctMode === "percentChange" ? "bg-rose-600 text-white" : "text-slate-500"}`}
            >
              % Increase / Decrease
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Value A</label>
              <input
                type="number"
                value={pctA}
                onChange={(e) => {
                  const a = parseFloat(e.target.value) || 0;
                  setPctA(a);
                  try { setPctResult(calculatePercentage(pctMode, a, pctB).text); } catch {}
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Value B</label>
              <input
                type="number"
                value={pctB}
                onChange={(e) => {
                  const b = parseFloat(e.target.value) || 0;
                  setPctB(b);
                  try { setPctResult(calculatePercentage(pctMode, pctA, b).text); } catch {}
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-center">
            <span className="text-xs text-slate-500 block mb-1">Result</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">{pctResult}</span>
          </div>
        </div>
      )}

      {/* 4. DISCOUNT & PROFIT CALCULATORS */}
      {(toolId === "discount-calculator" || toolId === "profit-calculator" || toolId === "profit-margin-calculator") && (
        <div className="space-y-6">
          {toolId === "discount-calculator" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={discPrice}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value) || 0;
                      setDiscPrice(p);
                      setDiscResult(calculateDiscount(p, discPercent, discTax));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={discPercent}
                    onChange={(e) => {
                      const d = parseFloat(e.target.value) || 0;
                      setDiscPercent(d);
                      setDiscResult(calculateDiscount(discPrice, d, discTax));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tax (%)</label>
                  <input
                    type="number"
                    value={discTax}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value) || 0;
                      setDiscTax(t);
                      setDiscResult(calculateDiscount(discPrice, discPercent, t));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900/50 rounded-2xl text-center">
                  <span className="text-xs text-emerald-600 font-bold block mb-1">Total Savings</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${discResult.savings}</span>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/50 rounded-2xl text-center">
                  <span className="text-xs text-rose-600 font-bold block mb-1">Final Price</span>
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400">${discResult.finalPrice}</span>
                </div>
              </div>
            </>
          )}

          {toolId === "profit-calculator" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total Revenue ($)</label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => {
                      const r = parseFloat(e.target.value) || 0;
                      setRevenue(r);
                      setProfitResult(calculateProfit(r, cost));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => {
                      const c = parseFloat(e.target.value) || 0;
                      setCost(c);
                      setProfitResult(calculateProfit(revenue, c));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Net Profit</span>
                  <span className="text-xl font-black text-emerald-500">${profitResult.profit}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Profit Margin</span>
                  <span className="text-xl font-black text-blue-500">{profitResult.marginPercent}%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Markup</span>
                  <span className="text-xl font-black text-purple-500">{profitResult.markupPercent}%</span>
                </div>
              </div>
            </>
          )}

          {toolId === "profit-margin-calculator" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Cost of Goods ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => {
                      const c = parseFloat(e.target.value) || 0;
                      setCost(c);
                      setMarginResult(calculateProfitMargin(c, targetMargin));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Profit Margin (%)</label>
                  <input
                    type="number"
                    value={targetMargin}
                    onChange={(e) => {
                      const m = parseFloat(e.target.value) || 0;
                      setTargetMargin(m);
                      setMarginResult(calculateProfitMargin(cost, m));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-center">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Recommended Selling Price</span>
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400">${marginResult.sellingPrice}</span>
                <p className="text-xs text-slate-500 mt-2">
                  Gross Profit: ${marginResult.grossProfit} • Markup: {marginResult.markupPercent}%
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. EMI & LOAN CALCULATOR */}
      {(toolId === "emi-calculator" || toolId === "loan-calculator") && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Principal Amount ($)</label>
              <input
                type="number"
                value={loanPrincipal}
                onChange={(e) => {
                  const p = parseFloat(e.target.value) || 0;
                  setLoanPrincipal(p);
                  setEmiResult(calculateEMI(p, loanRate, loanMonths));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={loanRate}
                onChange={(e) => {
                  const r = parseFloat(e.target.value) || 0;
                  setLoanRate(r);
                  setEmiResult(calculateEMI(loanPrincipal, r, loanMonths));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tenure (Months)</label>
              <input
                type="number"
                value={loanMonths}
                onChange={(e) => {
                  const m = parseInt(e.target.value) || 1;
                  setLoanMonths(m);
                  setEmiResult(calculateEMI(loanPrincipal, loanRate, m));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold block mb-1">Monthly EMI</span>
              <span className="text-2xl font-black text-blue-700 dark:text-blue-300">${emiResult.monthlyEmi}</span>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block mb-1">Total Interest</span>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">${emiResult.totalInterest}</span>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mb-1">Total Payment</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">${emiResult.totalPayment}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPOUND INTEREST */}
      {toolId === "compound-interest-calculator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Initial Deposit ($)</label>
              <input
                type="number"
                value={ciPrincipal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCiPrincipal(val);
                  setCiResult(calculateCompoundInterest(val, ciRate, ciYears, 12, ciAddition));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Annual Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={ciRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCiRate(val);
                  setCiResult(calculateCompoundInterest(ciPrincipal, val, ciYears, 12, ciAddition));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Years</label>
              <input
                type="number"
                value={ciYears}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCiYears(val);
                  setCiResult(calculateCompoundInterest(ciPrincipal, ciRate, val, 12, ciAddition));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Annual Add ($)</label>
              <input
                type="number"
                value={ciAddition}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCiAddition(val);
                  setCiResult(calculateCompoundInterest(ciPrincipal, ciRate, ciYears, 12, val));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Future Balance</span>
              <span className="text-3xl font-black text-cyan-400">${ciResult.futureValue.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Interest Earned</span>
              <span className="text-xl font-bold text-emerald-400">+${ciResult.totalInterest.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. CURRENCY CONVERTER */}
      {toolId === "currency-converter" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Amount</label>
              <input
                type="number"
                value={currAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCurrAmount(val);
                  setCurrResult(convertCurrency(val, currFrom, currTo));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
              <select
                value={currFrom}
                onChange={(e) => {
                  setCurrFrom(e.target.value);
                  setCurrResult(convertCurrency(currAmount, e.target.value, currTo));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              >
                {Object.keys(CURRENCY_RATES).map((c) => (
                  <option key={c} value={c}>{c} - {CURRENCY_RATES[c].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
              <select
                value={currTo}
                onChange={(e) => {
                  setCurrTo(e.target.value);
                  setCurrResult(convertCurrency(currAmount, currFrom, e.target.value));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              >
                {Object.keys(CURRENCY_RATES).map((c) => (
                  <option key={c} value={c}>{c} - {CURRENCY_RATES[c].name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-center">
            <span className="text-xs text-slate-500 block mb-1">Converted Amount</span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {CURRENCY_RATES[currTo]?.symbol} {currResult.result.toLocaleString()} {currTo}
            </span>
            <span className="block text-xs text-slate-500 mt-1">1 {currFrom} = {currResult.rate} {currTo}</span>
          </div>
        </div>
      )}

      {/* 8. GPA & SCIENTIFIC & FUEL COST */}
      {toolId === "scientific-calculator" && (
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-right text-3xl font-mono overflow-x-auto">
            {sciDisplay}
          </div>
          <div className="grid grid-cols-4 gap-2 text-sm font-bold">
            {["C", "sin", "cos", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "sqrt", "="].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === "C") setSciDisplay("0");
                  else if (btn === "=") {
                    try {
                      // Safe math eval
                      const res = Function(`"use strict"; return (${sciDisplay.replace(/sqrt/g, "Math.sqrt")})`)();
                      setSciDisplay(String(res));
                    } catch {
                      setSciDisplay("Error");
                    }
                  } else if (btn === "sin") {
                    setSciDisplay(String(Math.sin(parseFloat(sciDisplay) || 0).toFixed(4)));
                  } else if (btn === "cos") {
                    setSciDisplay(String(Math.cos(parseFloat(sciDisplay) || 0).toFixed(4)));
                  } else if (btn === "sqrt") {
                    setSciDisplay(String(Math.sqrt(parseFloat(sciDisplay) || 0).toFixed(4)));
                  } else {
                    setSciDisplay(sciDisplay === "0" ? btn : sciDisplay + btn);
                  }
                }}
                className={`p-3 rounded-xl transition-colors ${btn === "=" ? "bg-rose-600 text-white col-span-1" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"}`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {toolId === "fuel-cost-calculator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Distance (km)</label>
              <input
                type="number"
                value={fuelDist}
                onChange={(e) => {
                  const d = parseFloat(e.target.value) || 0;
                  setFuelDist(d);
                  setFuelResult(calculateFuelCost(d, fuelCons, fuelPrice, fuelPass));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">L/100km</label>
              <input
                type="number"
                step="0.1"
                value={fuelCons}
                onChange={(e) => {
                  const c = parseFloat(e.target.value) || 0;
                  setFuelCons(c);
                  setFuelResult(calculateFuelCost(fuelDist, c, fuelPrice, fuelPass));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Fuel Price ($/L)</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => {
                  const p = parseFloat(e.target.value) || 0;
                  setFuelPrice(p);
                  setFuelResult(calculateFuelCost(fuelDist, fuelCons, p, fuelPass));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Passengers</label>
              <input
                type="number"
                value={fuelPass}
                onChange={(e) => {
                  const p = parseInt(e.target.value) || 1;
                  setFuelPass(p);
                  setFuelResult(calculateFuelCost(fuelDist, fuelCons, fuelPrice, p));
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">Fuel Needed</span>
              <span className="text-xl font-bold">{fuelResult.totalLiters} L</span>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/40">
              <span className="text-xs text-rose-500 block">Total Cost</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">${fuelResult.totalCost}</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">Per Person</span>
              <span className="text-xl font-bold">${fuelResult.costPerPerson}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

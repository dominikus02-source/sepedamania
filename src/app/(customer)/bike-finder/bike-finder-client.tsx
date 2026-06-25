'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/customer/product-card';
import { getAllProductsFromApi } from '@/lib/catalog-data';
import { findBikes, type BikeFinderOptions, type BikeMatch } from '@/lib/bike-finder';
import {
  USAGE_LABELS,
  USAGE_DESCRIPTIONS,
  ROAD_LABELS,
  ROAD_DESCRIPTIONS,
  PREF_LABELS,
  PREF_DESCRIPTIONS,
} from '@/lib/bike-finder';

import {
  Mountain,
  Route,
  Building2,
  Zap,
  Sun,
  Compass,
  Shuffle,
  Heart,
  Shield,
  Sparkles,
  Star,
  RefreshCw,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  MoveVertical,
  Wallet,
  Bike,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 4;

const USAGE_ITEMS = [
  { key: 'trail', icon: Mountain },
  { key: 'road', icon: Route },
  { key: 'city', icon: Building2 },
  { key: 'freestyle', icon: Zap },
  { key: 'daily', icon: Sun },
] as const;

const ROAD_ITEMS = [
  { key: 'offroad', icon: Mountain },
  { key: 'asphalt', icon: Route },
  { key: 'mixed', icon: Shuffle },
  { key: 'paved', icon: Compass },
] as const;

const PREF_ITEMS = [
  { key: 'speed', icon: Zap },
  { key: 'comfort', icon: Heart },
  { key: 'durability', icon: Shield },
  { key: 'style', icon: Sparkles },
  { key: 'allround', icon: Star },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBudgetLabel(value: number): string {
  if (value >= 1_000_000) {
    const juta = value / 1_000_000;
    return `Rp ${Number.isInteger(juta) ? juta : juta.toFixed(1)} jt`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
}

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>Langkah {step} dari {TOTAL_STEPS}</span>
        <span className="font-semibold text-[#F5A623]">
          {step === TOTAL_STEPS ? 'Selesai' : `${Math.round(pct)}%`}
        </span>
      </div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F5A623] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step label */}
      <p className="text-sm font-semibold text-[#0F172A]">
        {step === 1 && 'Tinggi Badan & Budget'}
        {step === 2 && 'Tujuan Penggunaan'}
        {step === 3 && 'Medan & Preferensi'}
        {step === 4 && 'Hasil Rekomendasi'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Height & Budget
// ---------------------------------------------------------------------------

function StepHeightBudget({
  height,
  budget,
  onChange,
}: {
  height: number;
  budget: number;
  onChange: (patch: Partial<{ height: number; budget: number }>) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Height */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MoveVertical className="w-4 h-4 text-[#F5A623]" />
            <label className="text-sm font-medium text-[#0F172A]">Tinggi Badan</label>
          </div>
          <span className="text-lg font-bold text-[#F5A623]">{height} cm</span>
        </div>
        <input
          type="range"
          min={140}
          max={220}
          value={height}
          onChange={(e) => onChange({ height: Number(e.target.value) })}
          className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer
                     accent-[#F5A623]
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:h-6
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-[#F5A623]
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-6
                     [&::-moz-range-thumb]:h-6
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-[#F5A623]
                     [&::-moz-range-thumb]:shadow-md
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1">
          <span>140 cm</span>
          <span>220 cm</span>
        </div>
      </div>

      {/* Budget */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#F5A623]" />
            <label className="text-sm font-medium text-[#0F172A]">Budget Maksimal</label>
          </div>
          <span className="text-lg font-bold text-[#F5A623]">{formatBudgetLabel(budget)}</span>
        </div>
        <input
          type="range"
          min={1_000_000}
          max={15_000_000}
          step={500_000}
          value={budget}
          onChange={(e) => onChange({ budget: Number(e.target.value) })}
          className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer
                     accent-[#F5A623]
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:h-6
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-[#F5A623]
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-6
                     [&::-moz-range-thumb]:h-6
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-[#F5A623]
                     [&::-moz-range-thumb]:shadow-md
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1">
          <span>Rp 1 jt</span>
          <span>Rp 15 jt</span>
        </div>
      </div>

      {/* Quick tips */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3">
        <p className="text-xs text-[#92400E] leading-relaxed">
          💡 <span className="font-medium">Tips:</span> Jika kamu bingung dengan budget, 
          sepeda entry-level biasanya di kisaran Rp 2-5 jt. Untuk yang lebih serius, 
          siapkan budget Rp 5 jt ke atas.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Usage
// ---------------------------------------------------------------------------

function StepUsage({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
        Untuk apa kamu akan menggunakan sepeda ini? Pilih yang paling sesuai dengan aktivitasmu.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {USAGE_ITEMS.map(({ key, icon: Icon }) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 text-center',
                selected
                  ? 'border-[#F5A623] bg-[#FFFBEB] shadow-md'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  selected ? 'bg-[#F5A623] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={cn(
                  'text-sm font-semibold',
                  selected ? 'text-[#92400E]' : 'text-[#0F172A]'
                )}
              >
                {USAGE_LABELS[key]}
              </span>
              <span
                className={cn(
                  'text-[10px] leading-tight',
                  selected ? 'text-[#92400E]/80' : 'text-[#94A3B8]'
                )}
              >
                {USAGE_DESCRIPTIONS[key]}
              </span>

              {/* Check mark */}
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Road Type & Preference
// ---------------------------------------------------------------------------

function StepRoadPref({
  roadType,
  preference,
  onChange,
}: {
  roadType: string | null;
  preference: string | null;
  onChange: (patch: Partial<{ roadType: string; preference: string }>) => void;
}) {
  return (
    <div className="space-y-7">
      {/* Road type */}
      <div>
        <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Tipe Jalan yang Dilalui</h3>
        <p className="text-xs text-[#64748B] mb-3">Di medan apa kamu paling sering bersepeda?</p>
        <div className="grid grid-cols-2 gap-2">
          {ROAD_ITEMS.map(({ key, icon: Icon }) => {
            const selected = roadType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ roadType: key })}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border-2 p-3 transition-all duration-200',
                  selected
                    ? 'border-[#F5A623] bg-[#FFFBEB]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    selected ? 'text-[#F5A623]' : 'text-[#64748B]'
                  )}
                />
                <div className="text-left">
                  <span
                    className={cn(
                      'text-sm font-medium block',
                      selected ? 'text-[#92400E]' : 'text-[#0F172A]'
                    )}
                  >
                    {ROAD_LABELS[key]}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">{ROAD_DESCRIPTIONS[key]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preference */}
      <div>
        <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Preferensi Bersepeda</h3>
        <p className="text-xs text-[#64748B] mb-3">Apa yang paling kamu prioritaskan?</p>
        <div className="grid grid-cols-2 gap-2">
          {PREF_ITEMS.map(({ key, icon: Icon }) => {
            const selected = preference === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ preference: key })}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border-2 p-3 transition-all duration-200',
                  selected
                    ? 'border-[#F5A623] bg-[#FFFBEB]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    selected ? 'text-[#F5A623]' : 'text-[#64748B]'
                  )}
                />
                <div className="text-left">
                  <span
                    className={cn(
                      'text-sm font-medium block',
                      selected ? 'text-[#92400E]' : 'text-[#0F172A]'
                    )}
                  >
                    {PREF_LABELS[key]}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">{PREF_DESCRIPTIONS[key]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Results
// ---------------------------------------------------------------------------

function StepResults({
  results,
  onReset,
  options,
}: {
  results: BikeMatch[];
  onReset: () => void;
  options: BikeFinderOptions;
}) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Bike className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Tidak Ada Hasil</h3>
        <p className="text-sm text-[#64748B] mb-6">
          Maaf, tidak ada sepeda yang cocok dengan kriteria kamu. Coba ubah budget atau preferensi.
        </p>
        <Button variant="accent" onClick={onReset}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hero summary */}
      <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4 text-center">
        <Star className="w-8 h-8 text-[#F5A623] mx-auto mb-2 fill-[#F5A623]" />
        <h3 className="text-base font-bold text-[#1A1A1A]">
          {results.length === 1
            ? 'Rekomendasi Terbaik untukmu'
            : `Top ${results.length} Rekomendasi untukmu`}
        </h3>
        <p className="text-xs text-[#92400E] mt-1">
          Tinggi {options.height} cm &bull; Budget {formatBudgetLabel(options.budget)} &bull;{' '}
          {USAGE_LABELS[options.usage]}
        </p>
      </div>

      {/* Result cards */}
      {results.map((match, index) => (
        <div key={match.product.id} className="relative">
          {/* Rank badge */}
          <div
            className={cn(
              'absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md',
              index === 0 && 'bg-[#F5A623]',
              index === 1 && 'bg-[#94A3B8]',
              index === 2 && 'bg-[#CD7F32]'
            )}
          >
            {index === 0 ? (
              <Star className="w-4 h-4 fill-white" />
            ) : (
              index + 1
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 pt-4">
            {/* Product card */}
            <ProductCard product={match.product} />

            {/* Score */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#64748B]">Skor Kecocokan</span>
                <span className="text-sm font-bold text-[#F5A623]">{match.score}/100</span>
              </div>

              {/* Score bar */}
              <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[#F5A623] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(match.score, 100)}%` }}
                />
              </div>

              {/* Reasons */}
              <div className="space-y-1">
                {match.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-[#64748B]">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href={`https://wa.me/6281318986320?text=${encodeURIComponent(`Halo, saya butuh bantuan memilih sepeda. Tinggi ${options.height}cm, budget ${formatBudgetLabel(options.budget)}, untuk ${USAGE_LABELS[options.usage]}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="accent" size="lg" className="w-full gap-2">
            <MessageCircle className="w-5 h-5" />
            Konsultasi via WhatsApp
          </Button>
        </Link>

        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2"
          onClick={onReset}
        >
          <RefreshCw className="w-4 h-4" />
          Mulai Ulang
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function BikeFinderClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    height: 170,
    budget: 5_000_000,
    usage: null as string | null,
    roadType: null as string | null,
    preference: null as string | null,
  });
  const [results, setResults] = useState<BikeMatch[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = useCallback(
    (patch: Partial<typeof form>) => {
      setForm((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  // Merge partial data into a full BikeFinderOptions for the rule engine.
  const buildOptions = useCallback((): BikeFinderOptions => {
    return {
      height: form.height,
      budget: form.budget,
      usage: (form.usage ?? 'daily') as BikeFinderOptions['usage'],
      roadType: (form.roadType ?? 'paved') as BikeFinderOptions['roadType'],
      preference: (form.preference ?? 'allround') as BikeFinderOptions['preference'],
    };
  }, [form]);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      // Re-run results if going back from results step
      if (step === TOTAL_STEPS && results) {
        setResults(null);
      }
    }
  }, [step, results]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    const opts = buildOptions();
    const all = await getAllProductsFromApi();
    const products = all.filter((p) => p.isActive);
    const matches = findBikes(opts, products);
    setResults(matches);
    setIsLoading(false);
    setStep(TOTAL_STEPS);
  }, [buildOptions]);

  const handleReset = useCallback(() => {
    setStep(1);
    setForm({ height: 170, budget: 5_000_000, usage: null, roadType: null, preference: null });
    setResults(null);
    setIsLoading(false);
  }, []);

  // Determine if the "Next" button should be disabled
  const nextDisabled =
    (step === 2 && !form.usage) || isLoading;

  const isLastStep = step === TOTAL_STEPS;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {step > 1 && step < TOTAL_STEPS && (
              <button
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
                aria-label="Kembali"
              >
                <ChevronLeft className="w-5 h-5 text-[#64748B]" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#F5A623]" />
              <h1 className="text-base font-bold text-[#0F172A]">Bike Finder</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <ProgressBar step={step} />

        {/* Loading overlay for search */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-[#F5A623] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#64748B]">Mencari sepeda terbaik untukmu...</p>
          </div>
        ) : step === 1 ? (
          <StepHeightBudget
            height={form.height}
            budget={form.budget}
            onChange={updateForm}
          />
        ) : step === 2 ? (
          <StepUsage value={form.usage} onChange={(v) => updateForm({ usage: v })} />
        ) : step === 3 ? (
          <StepRoadPref
            roadType={form.roadType}
            preference={form.preference}
            onChange={updateForm}
          />
        ) : step === TOTAL_STEPS && results ? (
          <StepResults
            results={results}
            onReset={handleReset}
            options={buildOptions()}
          />
        ) : null}

        {/* Navigation buttons (not shown on results page) */}
        {!isLastStep && !isLoading && (
          <div
            className={cn(
              'flex items-center gap-3 mt-8',
              step === 1 ? 'justify-end' : 'justify-between'
            )}
          >
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </Button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button
                variant="accent"
                onClick={handleNext}
                disabled={nextDisabled}
                className="gap-1.5 ml-auto"
              >
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSearch}
                disabled={nextDisabled}
                size="lg"
                className="gap-2 ml-auto"
              >
                <Bike className="w-4 h-4" />
                Cari Sepeda
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// src/app/configure/ConfiguratorClient.tsx
'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Theme, Size, Product, ProductType } from '@/types';
import { useConfigState } from '@/hooks/useConfigState';
import { ARABESQUE_BG, getSlotsForSize, getThemesForType, getSizesForType, PRODUCT_TYPE_CONFIG, BOUQUET_OPTIONS } from '@/lib/data';
import StepTheme from '@/components/configurator/StepTheme';
import StepBouquetSelect from '@/components/configurator/StepBouquetSelect';
import StepProducts from '@/components/configurator/StepProducts';
import StepSummary from '@/components/configurator/StepSummary';
import SidePreview from '@/components/configurator/SidePreview';
import Logo from '@/components/ui/Logo';

interface ConfiguratorClientProps {
  themes: Record<string, Theme>;
  sizes: Size[];
  products: Product[];
  initialTheme?: string;
  initialType?: ProductType;
  cancelled?: boolean;
}

export default function ConfiguratorClient({
  themes,
  sizes,
  products,
  initialTheme,
  initialType = 'panier',
  cancelled,
}: ConfiguratorClientProps) {
  const {
    state,
    setProductType,
    setTheme,
    setSize,
    toggleItem,
    nextStep,
    prevStep,
    goToStep,
  } = useConfigState({ initialTheme, initialType });

  const { productType, theme, size, items, step } = state;

  // Get type-specific configuration
  const typeConfig = PRODUCT_TYPE_CONFIG[productType];

  // Get themes and sizes for the current product type
  const typeThemes = useMemo(() => getThemesForType(productType), [productType]);
  const typeSizes = useMemo(() => getSizesForType(productType), [productType]);

  // Filter products by type and allowed categories
  const filteredProducts = useMemo(() => {
    const allowedCats = typeConfig.categories as readonly string[];
    return products.filter(p =>
      (p.types?.includes(productType) ?? true) &&
      allowedCats.includes(p.cat)
    );
  }, [products, productType, typeConfig.categories]);

  // For bouquets, build themeData from the bouquet option (theme = bouquet id)
  const bouquetOption = productType === 'bouquet'
    ? BOUQUET_OPTIONS.find(b => b.id === theme)
    : null;

  const themeData = productType === 'bouquet' && bouquetOption
    ? { name: bouquetOption.name, p: bouquetOption.color, s: bouquetOption.color, a: '#C9921A', l: bouquetOption.color + '15' }
    : theme ? (typeThemes[theme] || themes[theme]) : null;
  const sizeData = typeSizes.find(s => s.id === size) || null;
  const maxSlots = getSlotsForSize(typeSizes, size);

  useEffect(() => {
    if (cancelled) {
      console.log('Paiement annulé');
    }
  }, [cancelled]);

  // Type-specific step titles
  const steps = [
    { num: 1, title: typeConfig.stepTitles[1], short: typeConfig.stepTitles[1].split(' ')[0] },
    { num: 2, title: typeConfig.stepTitles[2], short: typeConfig.stepTitles[2].split(' ')[0] },
    { num: 3, title: typeConfig.stepTitles[3], short: typeConfig.stepTitles[3].split(' ')[0] },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header - Sticky */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5"
        style={{ backgroundImage: `${ARABESQUE_BG}, linear-gradient(to right, #0D0608, #1A0A00, #0D0608)` }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>

            {/* Step indicator - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {steps.map((s, index) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                const isClickable = s.num < step;

                const stepIcons = [
                  // Step 1: palette
                  <svg key="1" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" /></svg>,
                  // Step 2: grid
                  <svg key="2" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
                  // Step 3: check
                  <svg key="3" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                ];

                return (
                  <div key={s.num} className="flex items-center">
                    <button
                      onClick={() => isClickable && goToStep(s.num as 1 | 2 | 3)}
                      disabled={!isClickable}
                      className={`
                        flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300
                        ${isClickable ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                        ${isActive ? 'bg-white/5' : ''}
                      `}
                    >
                      <span
                        className={`
                          w-9 h-9 rounded-xl flex items-center justify-center
                          transition-all duration-300
                          ${isActive
                            ? 'bg-gradient-to-br from-gold to-gold-light text-dark shadow-lg shadow-gold/30'
                            : isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-white/5 text-cream/30'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : stepIcons[s.num - 1]}
                      </span>
                      <span className={`text-sm tracking-wide font-medium ${isActive ? 'text-cream' : isCompleted ? 'text-cream/60' : 'text-cream/30'}`}>
                        {s.title}
                      </span>
                    </button>

                    {index < steps.length - 1 && (
                      <div className={`w-6 h-px mx-1 transition-colors ${isCompleted ? 'bg-emerald-500/30' : 'bg-white/10'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step indicator - Mobile */}
            <div className="flex md:hidden items-center gap-2">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${step === s.num ? 'bg-gold w-6' : step > s.num ? 'bg-emerald-500/50 w-3' : 'bg-white/20 w-3'}
                  `}
                />
              ))}
            </div>

            {/* Close button */}
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-cream/50 hover:text-cream transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 ease-spring"
            style={{ width: `${(step / 3) * 100}%`, boxShadow: '0 0 12px rgba(201, 146, 26, 0.4)' }}
          />
        </div>
      </header>

      {/* Product type & Mobile step title */}
      <div className="bg-cream border-b border-dark/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Product type badge */}
          <div className="flex items-center gap-3">
            <span className="badge-gold">
              <span className="text-lg">{typeConfig.icon}</span>
              {typeConfig.title}
            </span>
            <span className="font-cormorant text-dark/40 text-xs hidden md:inline">{typeConfig.subtitle}</span>
            <Link
              href="/"
              className="text-dark/30 hover:text-gold text-xs underline ml-2 transition-colors font-cormorant"
            >
              Changer
            </Link>
          </div>
          {/* Mobile step info */}
          <div className="md:hidden text-right">
            <span className="badge-gold text-[10px]">
              Étape {step}/3
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Cancelled notification */}
        {cancelled && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 animate-fade-up">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-800 font-medium">Paiement annulé</p>
              <p className="text-amber-600 text-sm">Vous pouvez modifier votre commande ou réessayer.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Steps content */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-dark/5 p-6 md:p-8">
              {step === 1 && productType === 'bouquet' && (
                <StepBouquetSelect
                  bouquets={BOUQUET_OPTIONS as unknown as { id: string; name: string; description: string; video: string; color: string; price: number; flowers: string[] }[]}
                  sizes={typeSizes}
                  selectedBouquet={theme}
                  selectedSize={size}
                  onBouquetSelect={setTheme}
                  onSizeSelect={setSize}
                  onNext={nextStep}
                />
              )}

              {step === 1 && productType !== 'bouquet' && (
                <StepTheme
                  themes={typeThemes}
                  sizes={typeSizes}
                  selectedTheme={theme}
                  selectedSize={size}
                  onThemeSelect={setTheme}
                  onSizeSelect={setSize}
                  onNext={nextStep}
                  productType={productType}
                />
              )}

              {step === 2 && (
                <StepProducts
                  products={filteredProducts}
                  selectedTheme={theme}
                  selectedItems={items}
                  maxSlots={maxSlots}
                  onToggleItem={toggleItem}
                  onNext={nextStep}
                  onPrev={prevStep}
                  productType={productType}
                />
              )}

              {step === 3 && themeData && sizeData && (
                <StepSummary
                  theme={theme}
                  themeData={themeData}
                  size={size}
                  sizeData={sizeData}
                  selectedItems={items}
                  products={filteredProducts}
                  productType={productType}
                  onPrev={prevStep}
                />
              )}
            </div>
          </div>

          {/* Side preview */}
          <div className="hidden lg:block">
            <SidePreview
              theme={theme}
              themeData={themeData}
              size={size}
              sizeData={sizeData}
              selectedItems={items}
              products={filteredProducts}
              productType={productType}
            />
          </div>
        </div>
      </div>

      {/* Mobile preview bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-dark/90 backdrop-blur-md border-t border-gold/10 p-4 safe-area-bottom">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-cream/40 text-xs font-cormorant tracking-wider uppercase block">Total estimé</span>
            <span className="font-amiri text-gold text-2xl">
              {(sizeData?.price || 0) + filteredProducts.filter(p => items.includes(p.id)).reduce((sum, p) => sum + p.price, 0)}€
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {Array.from({ length: maxSlots || 0 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < items.length
                      ? 'bg-gold shadow-[0_0_6px_rgba(201,146,26,0.4)]'
                      : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
            <span className="text-cream/50 text-xs font-cormorant">
              {items.length}/{maxSlots || '–'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

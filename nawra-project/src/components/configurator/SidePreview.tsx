// src/components/configurator/SidePreview.tsx
'use client';

import type { Theme, Size, LegacyProduct, ProductType } from '@/types';
import { PRODUCT_TYPE_CONFIG, BOUQUET_OPTIONS } from '@/lib/data';

const CATEGORY_ICONS: Record<string, string> = {
  parfum: '🧴',
  makeup: '💄',
  soin: '🌿',
  bijou: '💎',
  fleur: '🌹',
  chocolat: '🍫',
  accessoire: '👜',
};

interface SidePreviewProps {
  theme: string;
  themeData: Theme | null;
  size: string;
  sizeData: Size | null;
  selectedItems: string[];
  products: LegacyProduct[];
  productType?: ProductType;
}

export default function SidePreview({
  theme,
  themeData,
  size,
  sizeData,
  selectedItems,
  products,
  productType = 'panier',
}: SidePreviewProps) {
  const typeConfig = PRODUCT_TYPE_CONFIG[productType];
  const selectedProducts = products.filter(p => selectedItems.includes(p.id));
  const productsTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const basePrice = sizeData?.price || 0;
  const total = basePrice + productsTotal;

  // For bouquets, get the selected bouquet data
  const selectedBouquet = productType === 'bouquet'
    ? BOUQUET_OPTIONS.find(b => b.id === theme)
    : null;

  return (
    <div className="sticky top-28">
      <div className="card-dark overflow-hidden">
        {/* Header - Video for bouquet, gradient for others */}
        {productType === 'bouquet' && selectedBouquet ? (
          <div className="relative h-48 overflow-hidden" style={{ backgroundColor: selectedBouquet.color + '30' }}>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={`/images/${selectedBouquet.video.split('/').pop()}-poster.jpg`}
              alt={selectedBouquet.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/10">
                  🌸
                </div>
                <div>
                  <h3 className="font-amiri text-cream text-xl">{selectedBouquet.name}</h3>
                  <p className="text-cream/50 text-xs">{selectedBouquet.flowers.join(' · ')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : productType === 'bouquet' ? (
          <div className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 to-pink-900/20" />
            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                🌸
              </div>
              <div>
                <h3 className="font-amiri text-cream text-xl">{typeConfig.title}</h3>
              </div>
            </div>
            <p className="relative text-cream/30 text-sm italic animate-float">
              Sélectionnez un bouquet pour commencer
            </p>
          </div>
        ) : (
          <div className="p-6 relative overflow-hidden">
            {/* Decorative gradient orb */}
            {themeData && (
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 blur-2xl"
                style={{ backgroundColor: themeData.p }}
              />
            )}
            <div
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 blur-xl"
              style={{ backgroundColor: themeData?.s || '#C9A84C' }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center text-2xl">
                  {typeConfig.icon}
                </div>
                <div>
                  <h3 className="font-amiri text-cream text-xl">{typeConfig.title}</h3>
                  {theme && (
                    <p className="text-cream/40 text-xs flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{
                          backgroundColor: themeData?.p || '#C9A84C',
                          boxShadow: `0 0 6px ${themeData?.p || '#C9A84C'}40`,
                        }}
                      />
                      Thème {theme}
                    </p>
                  )}
                </div>
              </div>

              {!theme && (
                <p className="text-cream/30 text-sm italic animate-float">
                  Sélectionnez un thème pour commencer
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="border-t border-white/5">
          {/* Size */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-cream/40 text-sm font-cormorant">Taille</span>
              {sizeData ? (
                <div className="text-right">
                  <span className="font-amiri text-cream">{sizeData.label}</span>
                  <span className="text-cream/30 text-xs block">{sizeData.sub}</span>
                </div>
              ) : (
                <span className="text-cream/20 text-sm">Non sélectionnée</span>
              )}
            </div>
          </div>

          {/* Products list */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-cream/40 text-sm font-cormorant">
                Articles ({selectedItems.length}/{sizeData?.slots || '–'})
              </span>
              {sizeData && (
                <div className="flex gap-1.5">
                  {Array.from({ length: sizeData.slots }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={i < selectedItems.length ? {
                        backgroundColor: '#C9A84C',
                        boxShadow: '0 0 6px rgba(201, 146, 26, 0.4)',
                      } : {
                        backgroundColor: 'rgba(250, 243, 232, 0.1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedProducts.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 -mr-2 scrollbar-thin">
                {selectedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center text-lg flex-shrink-0">
                      {product.img ? (
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        CATEGORY_ICONS[product.cat] || '🎁'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream/30 text-[10px] tracking-wider uppercase truncate">
                        {product.brand}
                      </p>
                      <p className="font-amiri text-cream text-sm truncate">
                        {product.name}
                      </p>
                    </div>
                    <span className="font-amiri text-gold text-sm flex-shrink-0">
                      {product.price}€
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 opacity-20 animate-float">{typeConfig.icon}</div>
                <p className="text-cream/20 text-sm">
                  {typeConfig.emptyMessage}
                </p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 border-t border-white/5">
            {sizeData && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream/30 font-cormorant">Base ({sizeData.label})</span>
                <span className="text-cream/50">{sizeData.price}€</span>
              </div>
            )}
            {productsTotal > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream/30 font-cormorant">Produits ({selectedItems.length})</span>
                <span className="text-cream/50">{productsTotal}€</span>
              </div>
            )}
            <div className="divider-gold my-3" />
            <div className="flex items-center justify-between">
              <span className="font-cormorant text-cream font-medium">Total</span>
              <span className="font-amiri text-gold text-2xl">{total}€</span>
            </div>
          </div>
        </div>

        {/* Footer - Trust badges */}
        <div className="px-6 py-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2.5 text-cream/30 text-xs">
            <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Livraison offerte Paris & IDF</span>
          </div>
          <div className="flex items-center gap-2.5 text-cream/30 text-xs">
            <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Paiement 100% sécurisé</span>
          </div>
          <div className="flex items-center gap-2.5 text-cream/30 text-xs">
            <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Composé avec amour</span>
          </div>
        </div>
      </div>
    </div>
  );
}

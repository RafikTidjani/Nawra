// src/lib/recommendations.ts
// Logique de recommandations personnalisées

import type { Product } from '@/types';

interface RecommendationOptions {
  excludeIds?: string[];
  limit?: number;
}

/**
 * Get recommendations based on a product's category
 */
export function getRelatedByCategory(
  product: Product,
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set([...excludeIds, product.id]);

  return allProducts
    .filter(p => p.category === product.category && !idsToExclude.has(p.id))
    .slice(0, limit);
}

/**
 * Get complementary products (different category, similar price range)
 */
export function getComplementaryProducts(
  product: Product,
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set([...excludeIds, product.id]);
  const priceMin = product.price * 0.5;
  const priceMax = product.price * 2;

  return allProducts
    .filter(p =>
      p.category !== product.category &&
      !idsToExclude.has(p.id) &&
      p.price >= priceMin &&
      p.price <= priceMax
    )
    .slice(0, limit);
}

/**
 * Get recommendations based on tags
 */
export function getRelatedByTags(
  product: Product,
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set([...excludeIds, product.id]);
  const productTags = new Set(product.tags || []);

  // Score each product by how many tags it shares
  const scored = allProducts
    .filter(p => !idsToExclude.has(p.id))
    .map(p => {
      const sharedTags = (p.tags || []).filter(t => productTags.has(t)).length;
      return { product: p, score: sharedTags };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.product);
}

/**
 * Get popular products (bestsellers, limited stock)
 */
export function getPopularProducts(
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set(excludeIds);

  // Prioritize: has bestseller tag, limited stock, has discount
  const scored = allProducts
    .filter(p => !idsToExclude.has(p.id))
    .map(p => {
      let score = 0;
      if (p.tags?.includes('bestseller')) score += 3;
      if (p.stock_status === 'limited') score += 2;
      if (p.compare_at_price && p.compare_at_price > p.price) score += 1;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.product);
}

/**
 * Get recommendations for checkout/cart (complementary + popular)
 */
export function getCartRecommendations(
  cartProductIds: string[],
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set([...excludeIds, ...cartProductIds]);

  // Get popular products not in cart
  return getPopularProducts(allProducts, {
    excludeIds: Array.from(idsToExclude),
    limit,
  });
}

/**
 * Get personalized recommendations based on purchase history
 */
export function getPersonalizedRecommendations(
  purchasedCategorySlots: string[],
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set(excludeIds);

  // Count category frequency
  const categoryCount: Record<string, number> = {};
  purchasedCategorySlots.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  // Sort categories by frequency
  const sortedCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat);

  // Get products from favorite categories
  const result: Product[] = [];
  for (const cat of sortedCategories) {
    if (result.length >= limit) break;
    const catProducts = allProducts
      .filter(p => p.category === cat && !idsToExclude.has(p.id))
      .slice(0, limit - result.length);
    result.push(...catProducts);
    catProducts.forEach(p => idsToExclude.add(p.id));
  }

  // Fill remaining with popular products
  if (result.length < limit) {
    const popular = getPopularProducts(allProducts, {
      excludeIds: Array.from(idsToExclude),
      limit: limit - result.length,
    });
    result.push(...popular);
  }

  return result;
}

/**
 * Main recommendation function that combines strategies
 */
export function getRecommendations(
  context: {
    currentProduct?: Product;
    cartProductIds?: string[];
    purchasedCategories?: string[];
  },
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const { currentProduct, cartProductIds = [], purchasedCategories = [] } = context;
  const { excludeIds = [], limit = 4 } = options;
  const idsToExclude = new Set([...excludeIds, ...cartProductIds]);

  // If viewing a product, get related products
  if (currentProduct) {
    idsToExclude.add(currentProduct.id);

    // First try related by category
    let recs = getRelatedByCategory(currentProduct, allProducts, {
      excludeIds: Array.from(idsToExclude),
      limit,
    });

    // If not enough, add by tags
    if (recs.length < limit) {
      recs.forEach(p => idsToExclude.add(p.id));
      const byTags = getRelatedByTags(currentProduct, allProducts, {
        excludeIds: Array.from(idsToExclude),
        limit: limit - recs.length,
      });
      recs = [...recs, ...byTags];
    }

    // If still not enough, add popular
    if (recs.length < limit) {
      recs.forEach(p => idsToExclude.add(p.id));
      const popular = getPopularProducts(allProducts, {
        excludeIds: Array.from(idsToExclude),
        limit: limit - recs.length,
      });
      recs = [...recs, ...popular];
    }

    return recs;
  }

  // If has purchase history, get personalized
  if (purchasedCategories.length > 0) {
    return getPersonalizedRecommendations(purchasedCategories, allProducts, {
      excludeIds: Array.from(idsToExclude),
      limit,
    });
  }

  // Otherwise, return popular products
  return getPopularProducts(allProducts, {
    excludeIds: Array.from(idsToExclude),
    limit,
  });
}

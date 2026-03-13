-- ═══════════════════════════════════════════════════════════
-- NAWRA — Schéma Supabase
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── THEMES ──────────────────────────────────────────────────
create table if not exists themes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  product_type text not null default 'panier', -- 'panier' | 'bouquet' | 'cadeau'
  p          text not null,   -- couleur principale (hex)
  s          text not null,   -- secondaire
  a          text not null,   -- accent
  l          text not null,   -- fond clair
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── SIZES ───────────────────────────────────────────────────
create table if not exists sizes (
  id         text not null,   -- 'S', 'M', 'L', 'XL'
  product_type text not null default 'panier',
  label      text not null,
  sub        text not null,      -- '5 articles'
  price      integer not null,   -- en euros
  slots      integer not null,   -- nombre d'articles max
  popular    boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id, product_type)
);

-- ── PRODUCTS ────────────────────────────────────────────────
create table if not exists products (
  id         text primary key,
  cat        text not null check (cat in ('parfum', 'makeup', 'soin', 'bijou', 'fleur', 'chocolat', 'accessoire')),
  brand      text not null,
  name       text not null,
  price      integer not null,   -- en euros
  themes     text[] default '{}',  -- noms des thèmes compatibles
  types      text[] default '{panier}', -- types de création compatibles
  badge      text,
  img        text,               -- URL image
  active     boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── BOUQUETS ──────────────────────────────────────────────────
create table if not exists bouquets (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  description text not null,
  video      text not null,          -- chemin vidéo sans .mp4
  color      text not null,          -- couleur hex
  price      integer not null,       -- prix en euros
  flowers    text[] default '{}',    -- liste des fleurs
  active     boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── BASKETS ─────────────────────────────────────────────────
create table if not exists baskets (
  id         text primary key default 'b' || extract(epoch from now())::bigint,
  name       text not null,
  theme      text not null,      -- nom du thème
  size       text not null,
  price      integer not null,
  tag        text,               -- 'Bestseller', 'Nouveau'...
  products   text[] default '{}',  -- ids de produits
  img        text,
  active     boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default gen_random_uuid(),
  product_type         text default 'panier',
  theme                text not null,
  size                 text not null,
  products             text[] not null,
  total                integer not null,   -- en euros
  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text not null,
  customer_address     text not null,
  customer_city        text not null,
  customer_zip         text not null,
  customer_message     text,
  delivery_date        date,
  status               text not null default 'pending'
                       check (status in ('pending','paid','preparing','shipped','delivered','cancelled')),
  stripe_session_id    text unique,
  stripe_payment_intent text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at before update on orders for each row execute function update_updated_at();
create trigger themes_updated_at before update on themes for each row execute function update_updated_at();
create trigger sizes_updated_at before update on sizes for each row execute function update_updated_at();
create trigger products_updated_at before update on products for each row execute function update_updated_at();
create trigger bouquets_updated_at before update on bouquets for each row execute function update_updated_at();
create trigger baskets_updated_at before update on baskets for each row execute function update_updated_at();

-- ── DONNÉES PAR DÉFAUT ──────────────────────────────────────

-- Tailles PANIER
insert into sizes (id, product_type, label, sub, price, slots, popular, sort_order) values
  ('S',  'panier', 'Petite',  '3 articles',  49,  3,  false, 1),
  ('M',  'panier', 'Moyenne', '5 articles',  79,  5,  true,  2),
  ('L',  'panier', 'Grande',  '8 articles',  99,  8,  false, 3),
  ('XL', 'panier', 'Royale',  '12 articles', 149, 12, false, 4)
on conflict (id, product_type) do nothing;

-- Tailles BOUQUET
insert into sizes (id, product_type, label, sub, price, slots, popular, sort_order) values
  ('S',  'bouquet', 'Bouquet Simple',      '5-7 tiges',   35,  2,  false, 1),
  ('M',  'bouquet', 'Bouquet Élégant',     '12-15 tiges', 55,  4,  true,  2),
  ('L',  'bouquet', 'Bouquet Majestueux',  '20-25 tiges', 85,  6,  false, 3),
  ('XL', 'bouquet', 'Composition Florale', '30+ tiges',   120, 8,  false, 4)
on conflict (id, product_type) do nothing;

-- Tailles CADEAU
insert into sizes (id, product_type, label, sub, price, slots, popular, sort_order) values
  ('S',  'cadeau', 'Coffret Découverte', '2-3 articles', 45,  3,  false, 1),
  ('M',  'cadeau', 'Coffret Plaisir',    '4-5 articles', 75,  5,  true,  2),
  ('L',  'cadeau', 'Coffret Prestige',   '6-8 articles', 110, 8,  false, 3),
  ('XL', 'cadeau', 'Coffret Royal',      '10+ articles', 160, 12, false, 4)
on conflict (id, product_type) do nothing;

-- Thèmes PANIER
insert into themes (name, product_type, p, s, a, l) values
  ('Rose Gold', 'panier', '#D4789A', '#E8A89C', '#C9921A', '#fdf0f4'),
  ('Émeraude',  'panier', '#1A6B4A', '#2D9E6B', '#C9921A', '#eef7f2'),
  ('Bordeaux',  'panier', '#8B1A2F', '#C9404A', '#C9921A', '#fdf0f2'),
  ('Saphir',    'panier', '#1B4B8C', '#2E6BB5', '#C9921A', '#eef3fc'),
  ('Dorée',     'panier', '#C9921A', '#E8B84B', '#8B1A2F', '#fdf6e3')
on conflict (name) do nothing;

-- Thèmes BOUQUET
insert into themes (name, product_type, p, s, a, l) values
  ('Romantique',  'bouquet', '#E91E63', '#F48FB1', '#880E4F', '#fce4ec'),
  ('Champêtre',   'bouquet', '#8BC34A', '#AED581', '#558B2F', '#f1f8e9'),
  ('Moderne',     'bouquet', '#607D8B', '#90A4AE', '#263238', '#eceff1'),
  ('Classique',   'bouquet', '#B71C1C', '#E57373', '#C9921A', '#ffebee'),
  ('Exotique',    'bouquet', '#FF6F00', '#FFB74D', '#E65100', '#fff3e0'),
  ('Pastel',      'bouquet', '#CE93D8', '#E1BEE7', '#7B1FA2', '#f3e5f5')
on conflict (name) do nothing;

-- Thèmes CADEAU
insert into themes (name, product_type, p, s, a, l) values
  ('Gourmand',    'cadeau', '#5D4037', '#8D6E63', '#D4A574', '#efebe9'),
  ('Bien-être',   'cadeau', '#00897B', '#4DB6AC', '#004D40', '#e0f2f1'),
  ('Luxe',        'cadeau', '#C9921A', '#FFD54F', '#8B1A2F', '#fffde7'),
  ('Détente',     'cadeau', '#7986CB', '#9FA8DA', '#303F9F', '#e8eaf6'),
  ('Célébration', 'cadeau', '#EC407A', '#F48FB1', '#AD1457', '#fce4ec')
on conflict (name) do nothing;

-- Bouquets
insert into bouquets (name, description, video, color, price, flowers, sort_order) values
  ('Romance Rose', 'Un bouquet délicat aux teintes roses et dorées, parfait pour déclarer votre amour.', 'bouquet/bouquet-rose-gold', '#D4789A', 45, ARRAY['Roses', 'Pivoines', 'Eucalyptus'], 1),
  ('Éclat Doré', 'Lumineux et chaleureux, ce bouquet respire l''élégance et la joie.', 'bouquet/bouquet-doree', '#C9921A', 55, ARRAY['Lys', 'Roses', 'Gypsophile'], 2),
  ('Émeraude Mystique', 'Un bouquet raffiné aux tons verts profonds pour une touche de mystère.', 'bouquet/bouquet-emeraude', '#1A6B4A', 50, ARRAY['Orchidées', 'Eucalyptus', 'Fougères'], 3)
on conflict do nothing;

-- ── RLS (Row Level Security) ─────────────────────────────────
alter table themes   enable row level security;
alter table sizes    enable row level security;
alter table products enable row level security;
alter table bouquets enable row level security;
alter table baskets  enable row level security;
alter table orders   enable row level security;

-- Lecture publique
create policy "Public read themes"   on themes   for select using (true);
create policy "Public read sizes"    on sizes    for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read baskets"  on baskets  for select using (true);
create policy "Public read bouquets" on bouquets for select using (true);

-- Création commandes : publique
create policy "Public insert orders" on orders for insert with check (true);

-- ── INDEX ────────────────────────────────────────────────────
create index if not exists idx_orders_status     on orders (status);
create index if not exists idx_orders_created    on orders (created_at desc);
create index if not exists idx_orders_stripe     on orders (stripe_session_id);
create index if not exists idx_products_cat      on products (cat);
create index if not exists idx_products_themes   on products using gin (themes);
create index if not exists idx_themes_type       on themes (product_type);
create index if not exists idx_sizes_type        on sizes (product_type);

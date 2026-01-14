-- =====================================================
-- quickBasket Database Schema
-- Supabase SQL Script for Blinkit Clone
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (if any)
-- =====================================================
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =====================================================
-- TABLES
-- =====================================================

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    color_code VARCHAR(7) NOT NULL DEFAULT '#F8CB46',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    weight VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public Read-only
CREATE POLICY "Categories are viewable by everyone"
    ON categories
    FOR SELECT
    TO public
    USING (true);

-- Products: Public Read-only
CREATE POLICY "Products are viewable by everyone"
    ON products
    FOR SELECT
    TO public
    USING (true);

-- Cart Items: Users can only manage their own cart
CREATE POLICY "Users can view their own cart items"
    ON cart_items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
    ON cart_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
    ON cart_items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
    ON cart_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, image_url, color_code) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Dairy, Bread & Eggs', '/images/products/Slice-2_10.avif', '#F8CB46'),
    ('c1000000-0000-0000-0000-000000000002', 'Fruits & Vegetables', '/images/products/Slice-3_9.avif', '#0F8A65'),
    ('c1000000-0000-0000-0000-000000000003', 'Snacks & Munchies', '/images/products/Slice-5_4.avif', '#FF6B6B'),
    ('c1000000-0000-0000-0000-000000000004', 'Cold Drinks & Juices', '/images/products/Slice-4_9.avif', '#4ECDC4'),
    ('c1000000-0000-0000-0000-000000000005', 'Bakery & Biscuits', '/images/products/Slice-8_4.avif', '#D4A574'),
    ('c1000000-0000-0000-0000-000000000006', 'Breakfast & Instant Food', '/images/products/Slice-6_5.avif', '#FF8C42');

-- =====================================================
-- SEED DATA: PRODUCTS (Exact Blinkit products with BigBasket/similar CDN images)
-- =====================================================

-- Dairy, Bread & Eggs (6 products - exact Blinkit products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'The Cinnamon Kitchen Cacao, Almond & Berry Rocks', 189.00, 210.00, '50 g', 'https://www.bigbasket.com/media/uploads/p/l/40236657_1-the-cinnamon-kitchen-cacao-almond-berry-rocks.jpg', true),
    ('c1000000-0000-0000-0000-000000000001', 'The Cinnamon Kitchen Sugar-Free Cacao & Seed Rocks', 259.00, 285.00, '50 g', 'https://www.bigbasket.com/media/uploads/p/l/40236658_1-the-cinnamon-kitchen-sugar-free-cacao-seed-rocks.jpg', true),
    ('c1000000-0000-0000-0000-000000000001', 'The Cinnamon Kitchen Cacao, Hazelnut & Date Rocks', 165.00, 179.00, '60 g (2 pieces)', 'https://www.bigbasket.com/media/uploads/p/l/40236659_1-the-cinnamon-kitchen-cacao-hazelnut-date-rocks.jpg', true),
    ('c1000000-0000-0000-0000-000000000001', 'The Bakers Dozen Rich Chocolate Pound Cake', 163.00, NULL, '150 g', 'https://www.bigbasket.com/media/uploads/p/l/40183508_3-the-bakers-dozen-chocolate-pound-cake-eggless.jpg', true),
    ('c1000000-0000-0000-0000-000000000001', 'The Bakers Dozen High Protein Peanut Butter Cookies', 185.00, NULL, '150 g', 'https://www.bigbasket.com/media/uploads/p/l/40213975_2-the-bakers-dozen-high-protein-peanut-butter-cookies.jpg', true),
    ('c1000000-0000-0000-0000-000000000001', 'Amul Butter', 56.00, 60.00, '100 g', 'https://www.bigbasket.com/media/uploads/p/l/126906_7-amul-butter.jpg', true);

-- Fruits & Vegetables (6 products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000002', 'Fresh Tomatoes - Local', 35.00, 45.00, '500 g', 'https://www.bigbasket.com/media/uploads/p/l/10000203_16-fresho-tomato-local.jpg', true),
    ('c1000000-0000-0000-0000-000000000002', 'Green Capsicum', 42.00, 55.00, '250 g', 'https://www.bigbasket.com/media/uploads/p/l/10000067_28-fresho-capsicum-green.jpg', true),
    ('c1000000-0000-0000-0000-000000000002', 'Baby Spinach', 28.00, 35.00, '200 g', 'https://www.bigbasket.com/media/uploads/p/l/10000218_17-fresho-spinach.jpg', true),
    ('c1000000-0000-0000-0000-000000000002', 'Fresh Broccoli', 65.00, 80.00, '300 g', 'https://www.bigbasket.com/media/uploads/p/l/10000119_20-fresho-broccoli.jpg', true),
    ('c1000000-0000-0000-0000-000000000002', 'Red Apple - Shimla', 180.00, 220.00, '1 kg', 'https://www.bigbasket.com/media/uploads/p/l/10000024_20-fresho-apple-shimla.jpg', true),
    ('c1000000-0000-0000-0000-000000000002', 'Fresh Banana - Robusta', 45.00, 55.00, '1 dozen', 'https://www.bigbasket.com/media/uploads/p/l/10000025_26-fresho-banana-robusta.jpg', true);

-- Snacks & Munchies (6 products - exact Blinkit products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000003', 'Cheetos Flamin Hot Limon Crunchy Crisps', 210.00, NULL, '28.3 g', 'https://www.bigbasket.com/media/uploads/p/l/40210927_2-cheetos-flamin-hot-limon-crunchy.jpg', true),
    ('c1000000-0000-0000-0000-000000000003', 'Kettle Studio Tabasco Sauce Flavour Potato Chips', 99.00, NULL, '113 g', 'https://www.bigbasket.com/media/uploads/p/l/40195574_3-kettle-studio-potato-chips-tabasco-original-red-sauce.jpg', true),
    ('c1000000-0000-0000-0000-000000000003', 'DOKi Chicken Jerky (Korean Gochujang)', 199.00, NULL, '30 g', 'https://www.bigbasket.com/media/uploads/p/l/40247483_1-doki-chicken-jerky-korean-gochujang.jpg', false),
    ('c1000000-0000-0000-0000-000000000003', 'Kettle Studio Homestyle Potato Crisps - Lime & Chilli', 99.00, NULL, '125 g', 'https://www.bigbasket.com/media/uploads/p/l/40195576_2-kettle-studio-potato-chips-lime-chilli.jpg', true),
    ('c1000000-0000-0000-0000-000000000003', 'Nongshim Shrimp Flavoured Crackers', 128.00, 139.00, '75 g', 'https://www.bigbasket.com/media/uploads/p/l/40101454_4-nongshim-shrimp-crackers.jpg', false),
    ('c1000000-0000-0000-0000-000000000003', 'Kettle Studio Lightly Salted Wafers', 80.00, NULL, '150 g', 'https://www.bigbasket.com/media/uploads/p/l/40195578_2-kettle-studio-potato-wafers-lightly-salted.jpg', true);

-- Cold Drinks & Juices (6 products - exact Blinkit products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000004', 'Booster Alkaline Water - Pack of 4', 278.00, 360.00, '4 x 500 ml', 'https://www.bigbasket.com/media/uploads/p/l/40229505_2-booster-alkaline-water.jpg', true),
    ('c1000000-0000-0000-0000-000000000004', 'Liquid IV Hydration Multiplier Lemon Lime', 1140.00, 1280.00, '12 x 16 g', 'https://www.bigbasket.com/media/uploads/p/l/40248565_1-liquid-iv-hydration-multiplier-lemon-lime.jpg', true),
    ('c1000000-0000-0000-0000-000000000004', 'Monin Mojito Mint Syrup', 425.00, NULL, '250 ml', 'https://www.bigbasket.com/media/uploads/p/l/40022155_5-monin-syrup-mojito-mint.jpg', true),
    ('c1000000-0000-0000-0000-000000000004', 'Organic India Premium Speciality Tulsi Tea', 655.00, 699.00, '60 pieces', 'https://www.bigbasket.com/media/uploads/p/l/40073490_10-organic-india-tulsi-tea-original.jpg', true),
    ('c1000000-0000-0000-0000-000000000004', 'Phab 18g Protein Protein Milkshake', 125.00, NULL, '200 ml', 'https://www.bigbasket.com/media/uploads/p/l/40182108_6-phab-protein-milkshake-chocolate.jpg', true),
    ('c1000000-0000-0000-0000-000000000004', 'Star Signature Premium Sparkling Drink', 290.00, 360.00, '6 x 300 ml', 'https://www.bigbasket.com/media/uploads/p/l/40231456_2-star-signature-sparkling-water.jpg', true);

-- Bakery & Biscuits (6 products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000005', 'Britannia Cake Chocolate', 120.00, 150.00, '250 g', 'https://www.bigbasket.com/media/uploads/p/l/40019721_11-britannia-cake-chocolate.jpg', true),
    ('c1000000-0000-0000-0000-000000000005', 'Britannia Brown Bread', 45.00, 55.00, '400 g', 'https://www.bigbasket.com/media/uploads/p/l/241593_9-britannia-bread-brown.jpg', true),
    ('c1000000-0000-0000-0000-000000000005', 'Britannia Milk Bikis', 30.00, 35.00, '200 g', 'https://www.bigbasket.com/media/uploads/p/l/241597_13-britannia-biscuit-milk-bikis.jpg', true),
    ('c1000000-0000-0000-0000-000000000005', 'Britannia Good Day Cashew Cookies', 35.00, 40.00, '200 g', 'https://www.bigbasket.com/media/uploads/p/l/265598_13-britannia-good-day-biscuit-cashew.jpg', true),
    ('c1000000-0000-0000-0000-000000000005', 'Parle-G Original Glucose Biscuits', 10.00, NULL, '80 g', 'https://www.bigbasket.com/media/uploads/p/l/266028_15-parle-biscuits-gluco-parle-g.jpg', true),
    ('c1000000-0000-0000-0000-000000000005', 'Oreo Original Vanilla Creme Biscuit', 30.00, 35.00, '120 g', 'https://www.bigbasket.com/media/uploads/p/l/264004_13-cadbury-biscuit-oreo-original-vanilla-creme.jpg', true);

-- Breakfast & Instant Food (6 products)
INSERT INTO products (category_id, name, price, original_price, weight, image_url, is_veg) VALUES
    ('c1000000-0000-0000-0000-000000000006', 'Maggi 2-Minute Masala Noodles', 14.00, 16.00, '70 g', 'https://www.bigbasket.com/media/uploads/p/l/266109_17-maggi-2-minute-instant-noodles-masala.jpg', true),
    ('c1000000-0000-0000-0000-000000000006', 'Kelloggs Corn Flakes Original', 185.00, 210.00, '475 g', 'https://www.bigbasket.com/media/uploads/p/l/268420_11-kelloggs-corn-flakes-original.jpg', true),
    ('c1000000-0000-0000-0000-000000000006', 'MTR Ready To Eat Poha', 65.00, 80.00, '180 g', 'https://www.bigbasket.com/media/uploads/p/l/40018368_7-mtr-poha-breakfast-mix.jpg', true),
    ('c1000000-0000-0000-0000-000000000006', 'Saffola Masala Oats Classic', 99.00, 120.00, '500 g', 'https://www.bigbasket.com/media/uploads/p/l/40019283_13-saffola-masala-oats-classic-masala.jpg', true),
    ('c1000000-0000-0000-0000-000000000006', 'Top Ramen Chicken Noodles', 25.00, 30.00, '70 g', 'https://www.bigbasket.com/media/uploads/p/l/276505_9-top-ramen-noodles-curry.jpg', false),
    ('c1000000-0000-0000-0000-000000000006', 'Quaker Oats', 145.00, 165.00, '1 kg', 'https://www.bigbasket.com/media/uploads/p/l/126aboryu_5-quaker-oats.jpg', true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ quickBasket database setup complete!';
    RAISE NOTICE '📦 Created tables: categories, products, cart_items';
    RAISE NOTICE '🔒 RLS policies enabled';
    RAISE NOTICE '🌱 Seeded 6 categories with 24 products';
END $$;

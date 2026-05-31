-- ============================================
-- Game Top-Up Website Database Migration
-- Database: PostgreSQL
-- ============================================

-- 1. Categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- 2. Games Table
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    banner_url VARCHAR(500),
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_category ON games(category_id);
CREATE INDEX idx_games_active ON games(is_active);

-- 3. Products Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    image_url VARCHAR(500),
    package_type VARCHAR(50),
    game_currency_amount VARCHAR(50),
    bonus_amount VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    flash_sale_price DECIMAL(12,2),
    flash_sale_ends_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT -1 CHECK (stock = -1 OR stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, slug)
);

CREATE INDEX idx_products_game ON products(game_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_flash_sale ON products(is_flash_sale);
CREATE INDEX idx_products_flash_sale_ends_at ON products(flash_sale_ends_at);

-- 4. Payment Methods Table
CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('bank', 'ewallet', 'pulsa')),
    image_url VARCHAR(500),
    account_number VARCHAR(50),
    account_name VARCHAR(100),
    min_amount DECIMAL(12,2) DEFAULT 0,
    max_amount DECIMAL(12,2) DEFAULT 999999999,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_methods_code ON payment_methods(code);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);

-- 5. Orders Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    target_user_id VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed')),
    payment_method VARCHAR(50),
    payment_proof_url VARCHAR(500),
    paid_at TIMESTAMP,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_game ON orders(game_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- 6. Payments Table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    payment_number VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
    payment_proof_url VARCHAR(500),
    paid_at TIMESTAMP,
    payment_reference VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(payment_reference);

-- 7. Promos Table
CREATE TABLE promos (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(15,2) DEFAULT 0,
    max_discount DECIMAL(15,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promos_code ON promos(code);
CREATE INDEX idx_promos_active ON promos(is_active);
CREATE INDEX idx_promos_dates ON promos(start_date, end_date);

-- 8. Promo Usages Table
CREATE TABLE promo_usages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    promo_id BIGINT REFERENCES promos(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    discount_amount DECIMAL(15,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_usages_user ON promo_usages(user_id);
CREATE INDEX idx_promo_usages_promo ON promo_usages(promo_id);

-- 9. Transactions Table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('topup', 'withdrawal', 'purchase', 'refund', 'bonus')),
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- 10. Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'system' CHECK (type IN ('order', 'payment', 'promo', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- 11. Activity Logs Table
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100),
    model_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_model ON activity_logs(model_type, model_id);

-- ============================================
-- Database Functions
-- ============================================

-- Function untuk auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Function untuk update promo usage count
CREATE OR REPLACE FUNCTION update_promo_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE promos SET used_count = used_count + 1 WHERE id = NEW.promo_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_promo_usage
    AFTER INSERT ON promo_usages
    FOR EACH ROW
    EXECUTE FUNCTION update_promo_usage_count();

-- ============================================
-- Seed Data
-- ============================================

-- Categories Seed
INSERT INTO categories (name, slug, icon) VALUES
('MOBA', 'moba', 'gamepad'),
('FPS', 'fps', 'target'),
('RPG', 'rpg', 'sword'),
('Battle Royale', 'battle-royale', 'crosshair'),
('Simulation', 'simulation', 'truck');

-- Games Seed
INSERT INTO games (name, slug, description, category_id, is_active) VALUES
('Mobile Legends', 'mobile-legends', 'Game MOBA mobile paling populer di Indonesia dengan jutaan pemain aktif setiap hari', 1, true),
('Free Fire', 'free-fire', 'Battle royale action game yang bisa dimainkan di berbagai perangkat', 4, true),
('Genshin Impact', 'genshin-impact', 'Open world RPG game dengan grafis stunner dan gameplay yang adiktif', 3, true),
('PUBG Mobile', 'pubg-mobile', 'Battle royale shooter game dengan gameplay realista', 4, true),
('Valorant', 'valorant', 'Tactical FPS game dari Riot Games', 2, true),
('Honor of Kings', 'honor-of-kings', 'Game MOBA mobile dari Tencent Games', 1, true),
('Call of Duty Mobile', 'cod-mobile', 'FPS game legendaris dalam versi mobile', 2, true),
('League of Legends Wild Rift', 'lol-wild-rift', 'Versi mobile dari game MOBA terpopuler di dunia', 1, true);

-- Products Seed untuk Mobile Legends
INSERT INTO products (game_id, name, slug, description, price, original_price, package_type, game_currency_amount, bonus_amount, is_featured) VALUES
(1, '86 Diamonds', '86-diamonds', 'Paket 86 Diamonds untuk Mobile Legends', 20000, 22000, 'diamonds', '86', '0', true),
(1, '172 Diamonds', '172-diamonds', 'Paket 172 Diamonds untuk Mobile Legends', 40000, 44000, 'diamonds', '172', '8', true),
(1, '257 Diamonds', '257-diamonds', 'Paket 257 Diamonds untuk Mobile Legends', 60000, 66000, 'diamonds', '257', '12', true),
(1, '429 Diamonds', '429-diamonds', 'Paket 429 Diamonds untuk Mobile Legends', 100000, 110000, 'diamonds', '429', '21', true),
(1, '514 Diamonds', '514-diamonds', 'Paket 514 Diamonds untuk Mobile Legends', 120000, 132000, 'diamonds', '514', '25', true),
(1, '706 Diamonds', '706-diamonds', 'Paket 706 Diamonds untuk Mobile Legends', 165000, 181500, 'diamonds', '706', '35', true),
(1, '878 Diamonds', '878-diamonds', 'Paket 878 Diamonds untuk Mobile Legends', 205000, 225500, 'diamonds', '878', '43', true),
(1, '1412 Diamonds', '1412-diamonds', 'Paket 1412 Diamonds untuk Mobile Legends', 330000, 363000, 'diamonds', '1412', '70', true);

-- Products Seed untuk Free Fire
INSERT INTO products (game_id, name, slug, description, price, original_price, package_type, game_currency_amount, bonus_amount, is_featured) VALUES
(2, '50 UC', '50-uc', 'Paket 50 UC untuk Free Fire', 7000, 8000, 'uc', '50', '0', true),
(2, '100 UC', '100-uc', 'Paket 100 UC untuk Free Fire', 14000, 16000, 'uc', '100', '5', true),
(2, '200 UC', '200-uc', 'Paket 200 UC untuk Free Fire', 28000, 32000, 'uc', '200', '10', true),
(2, '500 UC', '500-uc', 'Paket 500 UC untuk Free Fire', 70000, 80000, 'uc', '500', '25', true),
(2, '1000 UC', '1000-uc', 'Paket 1000 UC untuk Free Fire', 140000, 160000, 'uc', '1000', '50', true);

-- Products Seed untuk Genshin Impact
INSERT INTO products (game_id, name, slug, description, price, original_price, package_type, game_currency_amount, bonus_amount, is_featured) VALUES
(3, '60 Genesis Crystal', '60-genesis-crystal', 'Paket 60 Genesis Crystal untuk Genshin Impact', 12000, 14000, 'genesis_crystal', '60', '0', true),
(3, '300 Genesis Crystal', '300-genesis-crystal', 'Paket 300 Genesis Crystal untuk Genshin Impact', 60000, 70000, 'genesis_crystal', '300', '30', true),
(3, '980 Genesis Crystal', '980-genesis-crystal', 'Paket 980 Genesis Crystal untuk Genshin Impact', 195000, 220000, 'genesis_crystal', '980', '110', true),
(3, '3280 Genesis Crystal', '3280-genesis-crystal', 'Paket 3280 Genesis Crystal untuk Genshin Impact', 650000, 750000, 'genesis_crystal', '3280', '400', true);

-- Payment Methods Seed
INSERT INTO payment_methods (name, code, type, account_number, account_name, min_amount) VALUES
('Bank BCA', 'bca', 'bank', '1234567890', 'PT TomSky Shop', 10000),
('Bank BNI', 'bni', 'bank', '0987654321', 'PT TomSky Shop', 10000),
('Bank BRI', 'bri', 'bank', '6789012345', 'PT TomSky Shop', 10000),
('Bank Mandiri', 'mandiri', 'bank', '2345678901', 'PT TomSky Shop', 10000),
('GoPay', 'gopay', 'ewallet', '081234567890', 'PT TomSky Shop', 5000),
('OVO', 'ovo', 'ewallet', '081234567890', 'PT TomSky Shop', 5000),
('DANA', 'dana', 'ewallet', '081234567890', 'PT TomSky Shop', 5000),
('ShopeePay', 'shopeepay', 'ewallet', '081234567890', 'PT TomSky Shop', 5000),
('Telkomsel', 'tsel', 'pulsa', '081234567890', 'PT TomSky Shop', 10000),
('XL', 'xl', 'pulsa', '081234567890', 'PT TomSky Shop', 10000);

-- Promos Seed
INSERT INTO promos (code, name, description, type, discount_value, min_order_amount, max_discount, usage_limit, start_date, end_date, is_active) VALUES
('HEMAT10', 'Diskon 10%', 'Dapatkan diskon 10% untuk setiap transaksi', 'percentage', 10, 50000, 20000, 1000, '2026-01-01', '2026-12-31', true),
('WELCOME', 'Welcome Bonus Rp 5.000', 'Bonus Rp 5.000 untuk member baru', 'fixed', 5000, 50000, NULL, 500, '2026-01-01', '2026-12-31', true),
('HEMAT50', 'Diskon Rp 50.000', 'Diskon flat Rp 50.000', 'fixed', 50000, 500000, NULL, 100, '2026-01-01', '2026-12-31', true);

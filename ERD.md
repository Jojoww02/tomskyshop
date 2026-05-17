# Game Top-Up Website - Database Architecture

## 1. ERD Overview

Berikut adalah Entity Relationship Diagram untuk sistem top-up game:

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email UK
        string password
        string phone
        string user_id "Game User ID"
        enum role "admin,user"
        decimal balance "User wallet balance"
        boolean is_active
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    games {
        bigint id PK
        string name
        string slug UK
        text description
        string image_url
        string banner_url
        bigint category_id FK
        boolean is_active
        integer sort_order
        timestamp created_at
        timestamp updated_at
    }

    categories {
        bigint id PK
        string name
        string slug UK
        string icon
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    products {
        bigint id PK
        bigint game_id FK
        string name
        string slug
        text description
        decimal price
        decimal original_price
        string image_url
        string package_type "diamond,coin,uc,etc"
        string game_currency_amount
        string bonus_amount
        boolean is_featured
        boolean is_active
        integer stock
        timestamp created_at
        timestamp updated_at
    }

    orders {
        bigint id PK
        string order_number UK
        bigint user_id FK
        bigint game_id FK
        bigint product_id FK
        string target_user_id "Game User ID"
        integer quantity
        decimal total_amount
        decimal discount_amount
        decimal final_amount
        enum status "pending,processing,completed,failed,cancelled"
        enum payment_status "unpaid,paid,failed"
        string payment_method
        string payment_proof_url
        timestamp paid_at
        text admin_notes
        timestamp created_at
        timestamp updated_at
    }

    payments {
        bigint id PK
        bigint order_id FK UK
        string payment_method
        string payment_number "Virtual account number"
        decimal amount
        enum status "pending,success,failed,expired"
        string payment_proof_url
        timestamp paid_at
        string payment_reference
        json metadata
        timestamp created_at
        timestamp updated_at
    }

    payment_methods {
        bigint id PK
        string name
        string code UK
        string type "bank,ewallet,pulsa"
        string image_url
        string account_number
        string account_name
        decimal min_amount
        decimal max_amount
        boolean is_active
        integer sort_order
        timestamp created_at
        timestamp updated_at
    }

    promos {
        bigint id PK
        string code UK
        string name
        text description
        enum type "percentage,fixed"
        decimal discount_value
        decimal min_order_amount
        decimal max_discount
        integer usage_limit
        integer used_count
        timestamp start_date
        timestamp end_date
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    promo_usages {
        bigint id PK
        bigint user_id FK
        bigint promo_id FK
        bigint order_id FK
        decimal discount_amount
        timestamp used_at
    }

    transactions {
        bigint id PK
        bigint user_id FK
        enum type "topup,withdrawal,purchase,refund,bonus"
        decimal amount
        decimal balance_before
        decimal balance_after
        string reference_type "order,payment,promo"
        bigint reference_id
        text description
        timestamp created_at
    }

    notifications {
        bigint id PK
        bigint user_id FK
        string title
        text message
        string type "order,payment,promo,system"
        boolean is_read
        timestamp read_at
        timestamp created_at
    }

    activity_logs {
        bigint id PK
        bigint user_id FK
        string action
        string model_type
        bigint model_id
        json old_values
        json new_values
        string ip_address
        string user_agent
        timestamp created_at
    }

    games ||--o{ products : "has"
    categories ||--o{ games : "contains"
    users ||--o{ orders : "places"
    users ||--o{ transactions : "has"
    users ||--o{ promo_usages : "uses"
    users ||--o{ notifications : "receives"
    games ||--o{ orders : "receives"
    products ||--o{ orders : "included in"
    orders ||--|| payments : "has one"
    orders ||--o{ promo_usages : "applies"
    promos ||--o{ promo_usages : "used in"
    payment_methods ||--o{ payments : "via"
```

## 2. Table Definitions

### 2.1 users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_id VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    balance DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);
```

### 2.2 categories
```sql
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
```

### 2.3 games
```sql
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
```

### 2.4 products
```sql
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
```

### 2.5 orders
```sql
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
```

### 2.6 payment_methods
```sql
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
```

### 2.7 payments
```sql
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
```

### 2.8 promos
```sql
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
```

### 2.9 promo_usages
```sql
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
```

### 2.10 transactions
```sql
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
```

### 2.11 notifications
```sql
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
```

### 2.12 activity_logs
```sql
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
```

## 3. Database Functions

### 3.1 Auto-generate order number
```sql
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
```

### 3.2 Update promo usage count
```sql
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
```

## 4. Seed Data

### 4.1 Categories
```sql
INSERT INTO categories (name, slug, icon) VALUES
('MOBA', 'moba', 'gamepad'),
('FPS', 'fps', 'target'),
('RPG', 'rpg', 'sword'),
('Battle Royale', 'battle-royale', 'crosshair'),
('Simulation', 'simulation', 'truck');
```

### 4.2 Games
```sql
INSERT INTO games (name, slug, description, image_url, category_id) VALUES
('Mobile Legends', 'mobile-legends', 'Game MOBA mobile paling populer di Indonesia', '/images/games/mobile-legends.jpg', 1),
('Free Fire', 'free-fire', 'Battle royale action game', '/images/games/free-fire.jpg', 4),
('Genshin Impact', 'genshin-impact', 'Open world RPG game', '/images/games/genshin-impact.jpg', 3),
('PUBG Mobile', 'pubg-mobile', 'Battle royale shooter game', '/images/games/pubg-mobile.jpg', 4),
('Valorant', 'valorant', 'Tactical FPS game', '/images/games/valorant.jpg', 2);
```

### 4.3 Payment Methods
```sql
INSERT INTO payment_methods (name, code, type, account_number, account_name) VALUES
('Bank BCA', 'bca', 'bank', '1234567890', 'PT TomSky Shop'),
('Bank BNI', 'bni', 'bank', '0987654321', 'PT TomSky Shop'),
('Bank BRI', 'bri', 'bank', '6789012345', 'PT TomSky Shop'),
('Bank Mandiri', 'mandiri', 'bank', '2345678901', 'PT TomSky Shop'),
('GoPay', 'gopay', 'ewallet', '081234567890', 'PT TomSky Shop'),
('OVO', 'ovo', 'ewallet', '081234567890', 'PT TomSky Shop'),
('DANA', 'dana', 'ewallet', '081234567890', 'PT TomSky Shop'),
('Telkomsel', 'tsel', 'pulsa', '081234567890', 'PT TomSky Shop'),
('XL', 'xl', 'pulsa', '081234567890', 'PT TomSky Shop');
```

## 5. Database Relationships Summary

```
users (1) ----< (N) orders
users (1) ----< (N) transactions
users (1) ----< (N) promo_usages
users (1) ----< (N) notifications

categories (1) ----< (N) games
games (1) ----< (N) products
games (1) ----< (N) orders

products (1) ----< (N) orders
orders (1) ----|| (1) payments
orders (1) ----< (N) promo_usages

promos (1) ----< (N) promo_usages
payment_methods (1) ----< (N) payments
```

## 6. Indexes Summary

- **Primary Keys:** All tables have BIGSERIAL primary keys
- **Foreign Keys:** Properly indexed for join performance
- **Unique Constraints:** email (users), slug (games, categories), code (promos), order_number (orders)
- **Query Indexes:** status, payment_status, created_at on frequently queried tables
- **Full-text Search Ready:** name and description columns available for future FTS implementation

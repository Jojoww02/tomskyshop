# TomSkyShop - Game Top-Up Platform

Website top-up game dengan teknologi modern untuk pengalaman terbaik dalam pembelian diamond, UC, dan item game lainnya.

## 🎮 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Inertia.js** - SPA dengan routing server-side
- **Tailwind CSS** - Styling dengan tema gaming (dark mode)
- **Vite** - Build tool

### Backend
- **Laravel 11** - PHP Framework
- **PostgreSQL** - Database
- **Laravel Sanctum** - Authentication

## 📋 Fitur Utama

### Untuk Pengguna
- Browsing game dan paket top-up
- Pembelian dengan berbagai metode pembayaran
- Lacak status pesanan
- Penggunaan kode promo/diskon
- Notifikasi real-time

### Untuk Admin
- Dashboard management
- CRUD games, products, categories
- Order management
- Payment verification
- User management

## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd tomskyshop
```

### 2. Install Dependencies
```bash
composer install
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` untuk konfigurasi database:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tomskyshop
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 4. Migrasi ke Database Lokal (PostgreSQL)

Bagian ini untuk setiap developer agar bisa menjalankan project dengan database PostgreSQL lokal masing-masing.

#### 4.1 Install PostgreSQL + pgAdmin4
- Install PostgreSQL (Windows/macOS/Linux) dan pastikan service PostgreSQL berjalan.
- Pastikan bisa login ke pgAdmin4 sebagai user `postgres`.

#### 4.2 Aktifkan driver PostgreSQL di PHP (khusus XAMPP/Windows)
Jika saat `php artisan migrate` muncul error `could not find driver`, aktifkan extension ini di `php.ini`:
- `extension=pdo_pgsql`
- (opsional) `extension=pgsql`

Lalu restart Apache/XAMPP atau restart PHP service yang Anda pakai.

#### 4.3 Buat database `tomskyshop`
Opsi A (pgAdmin4):
- Klik kanan `Databases` → `Create` → `Database...`
- Database name: `tomskyshop`
- Owner: `postgres`

Opsi B (psql):
```bash
psql -U postgres -c "CREATE DATABASE tomskyshop;"
```

Jika command `psql` tidak dikenal, gunakan full path (contoh Windows):
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE tomskyshop;"
```

#### 4.4 Set .env sesuai database lokal Anda
Update file `.env` (password dan port mengikuti setting lokal Anda):
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tomskyshop
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

#### 4.5 Jalankan migrasi + seeder
Ini akan membuat semua tabel dan mengisi data awal (game, paket, payment method, promo):
```bash
php artisan migrate:fresh --seed
```

Jika hanya ingin migrasi tanpa menghapus data:
```bash
php artisan migrate
php artisan db:seed
```

#### 4.6 (Opsional) Import schema SQL
Project ini sudah menyediakan file SQL (opsional). Umumnya cukup pakai migrations.
```bash
psql -U postgres -d tomskyshop -f supabase/migrations/2026_05_17_000001_initial_schema.sql
```

### 5. Generate Keys & Run Migrations
```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### 6. Run Development Server
```bash
npm run dev
php artisan serve
```

Aplikasi akan tersedia di `http://localhost:8000`

## 📁 Struktur Project

```
tomskyshop/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/              # API Controllers
│   │   ├── Requests/             # Form Requests
│   │   └── Resources/            # API Resources
│   └── Models/                   # Eloquent Models
├── database/
│   ├── migrations/               # Database Migrations
│   └── seeders/                 # Database Seeders
├── resources/
│   └── js/
│       └── pages/               # React Pages
├── routes/
│   ├── api.php                  # API Routes
│   └── web.php                  # Web Routes
└── supabase/
    └── migrations/              # PostgreSQL Schema
```

## 🗄️ ERD (Entity Relationship Diagram)

### Database Tables

```
users
├── id (PK)
├── name
├── email (UK)
├── password
├── phone
├── user_id (Game User ID)
├── role (admin/user)
├── balance
├── is_active
└── timestamps

categories
├── id (PK)
├── name
├── slug (UK)
├── icon
├── is_active
└── timestamps

games
├── id (PK)
├── name
├── slug (UK)
├── description
├── image_url
├── banner_url
├── category_id (FK)
├── is_active
├── sort_order
└── timestamps

products
├── id (PK)
├── game_id (FK)
├── name
├── slug
├── description
├── price
├── original_price
├── image_url
├── package_type
├── game_currency_amount
├── bonus_amount
├── is_featured
├── is_active
├── stock
└── timestamps

orders
├── id (PK)
├── order_number (UK)
├── user_id (FK)
├── game_id (FK)
├── product_id (FK)
├── target_user_id
├── quantity
├── total_amount
├── discount_amount
├── final_amount
├── status
├── payment_status
├── payment_method
├── payment_proof_url
├── paid_at
├── admin_notes
└── timestamps

payments
├── id (PK)
├── order_id (FK, UK)
├── payment_method
├── payment_number
├── amount
├── status
├── payment_proof_url
├── paid_at
├── payment_reference
├── metadata (JSONB)
└── timestamps

promos
├── id (PK)
├── code (UK)
├── name
├── description
├── type (percentage/fixed)
├── discount_value
├── min_order_amount
├── max_discount
├── usage_limit
├── used_count
├── start_date
├── end_date
├── is_active
└── timestamps

transactions
├── id (PK)
├── user_id (FK)
├── type
├── amount
├── balance_before
├── balance_after
├── reference_type
├── reference_id
├── description
└── created_at

notifications
├── id (PK)
├── user_id (FK)
├── title
├── message
├── type
├── is_read
├── read_at
└── created_at
```

### Relationships
- Users (1) ──< Orders
- Users (1) ──< Transactions
- Users (1) ──< Notifications
- Categories (1) ──< Games
- Games (1) ──< Products
- Games (1) ──< Orders
- Products (1) ──< Orders
- Orders (1) ──|| Payments
- Orders (1) ──< Promo Usages
- Promos (1) ──< Promo Usages

## 🌐 API Endpoints

### Public Routes
```
GET  /api/v1/categories
GET  /api/v1/games
GET  /api/v1/games/{slug}
GET  /api/v1/games/{slug}/products
GET  /api/v1/payment-methods
GET  /api/v1/promos
POST /api/v1/promos/apply
POST /api/v1/register
POST /api/v1/login
```

### Protected Routes (Auth Required)
```
POST /api/v1/logout
GET  /api/v1/user
PUT  /api/v1/user/profile
GET  /api/v1/orders
POST /api/v1/orders
GET  /api/v1/orders/{orderNumber}
POST /api/v1/payments
POST /api/v1/payments/confirm
```

### Admin Routes
```
POST   /api/v1/admin/games
PUT    /api/v1/admin/games/{game}
DELETE /api/v1/admin/games/{game}
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/{product}
DELETE /api/v1/admin/products/{product}
PUT    /api/v1/admin/orders/{order}/status
DELETE /api/v1/admin/orders/{order}
GET    /api/v1/admin/payments
```

## 💳 Metode Pembayaran

- **Bank Transfer**: BCA, BNI, BRI, Mandiri
- **E-Wallet**: GoPay, OVO, DANA, ShopeePay
- **Pulsa**: Telkomsel, XL

## 🎨 Design Theme

Website menggunakan tema gaming modern dengan:
- **Dark Mode**: Background slate-950 dengan aksen warna
- **Primary Color**: Violet (#8B5CF6)
- **Secondary Color**: Cyan (#06B6D4)
- **Accent Color**: Pink (#EC4899)
- **Typography**: Orbitron untuk heading, Inter untuk body

## 📝 User Credentials

Setelah running seeder:
- **Admin**: admin@tomskyshop.com / password
- **User**: test@example.com / password

## 🔧 Available Commands

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migrate and seed
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear
php artisan config:clear

# Start server
php artisan serve
npm run dev
```

## 📄 Lisensi

Project ini adalah proprietary software.

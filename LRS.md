# TomSkyShop - Database Documentation

## Overview
TomSkyShop adalah platform top-up game dengan database PostgreSQL. Dokumentasi ini menjelaskan struktur tabel, kolom, dan hubungan antar tabel.

---

## ERD Diagram (Mermaid)
```mermaid
erDiagram
    %% Users
    users ||--o{ orders : creates
    users ||--o{ coupons : has
    users ||--o{ promo_usages : uses
    users ||--o{ transactions : has
    users ||--o{ notifications : receives
    users ||--o{ activity_logs : performs

    %% Categories
    categories ||--o{ games : contains

    %% Games
    games ||--o{ products : has
    games ||--o{ orders : for

    %% Products
    products ||--o{ orders : used_in

    %% Payment Methods
    payment_methods ||--o{ orders : used_for

    %% Promos
    promos ||--o{ promo_usages : used_in

    %% Orders
    orders ||--|| payments : has
    orders ||--o{ promo_usages : may_have
    orders ||--|{ coupons : generates

    %% Default Laravel tables
    cache {
        string key PK
    }
    jobs {
        bigint id PK
    }
    failed_jobs {
        bigint id PK
    }
    password_reset_tokens {
        string email PK
    }
    sessions {
        string id PK
    }

    users {
        bigint id PK
        string name
        string email UK
        timestamp email_verified_at
        string password
        string remember_token
        string phone
        string user_id
        string role
        decimal balance
        boolean is_active
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

    products {
        bigint id PK
        bigint game_id FK
        string name
        string slug
        text description
        decimal price
        decimal original_price
        decimal flash_sale_price
        string image_url
        string package_type
        string game_currency_amount
        string bonus_amount
        boolean is_featured
        boolean is_flash_sale
        timestamp flash_sale_ends_at
        boolean is_active
        integer stock
        timestamp created_at
        timestamp updated_at
    }

    payment_methods {
        bigint id PK
        string name
        string code UK
        string type
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
        string type
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

    orders {
        bigint id PK
        string order_number UK
        bigint user_id FK
        bigint game_id FK
        bigint product_id FK
        string target_user_id
        integer quantity
        decimal total_amount
        decimal discount_amount
        decimal final_amount
        string status
        string payment_status
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
        string payment_number
        decimal amount
        string status
        string payment_proof_url
        timestamp paid_at
        string payment_reference
        jsonb metadata
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

    coupons {
        bigint id PK
        bigint user_id FK
        bigint issued_for_order_id FK UK
        bigint redeemed_order_id FK
        string code UK
        tinyint discount_percent
        boolean is_redeemed
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    transactions {
        bigint id PK
        bigint user_id FK
        string type
        decimal amount
        decimal balance_before
        decimal balance_after
        string reference_type
        bigint reference_id
        text description
        timestamp created_at
    }

    notifications {
        bigint id PK
        bigint user_id FK
        string title
        text message
        string type
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
        jsonb old_values
        jsonb new_values
        string ip_address
        text user_agent
        timestamp created_at
    }
```

---

## Tabel Detail

### 1. `users`
Tabel pengguna (customer & admin)
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik pengguna                                                           |
| `name`                | `VARCHAR(255)`   | `NOT NULL`          | Nama pengguna                                                              |
| `email`               | `VARCHAR(255)`   | `UNIQUE`, `NOT NULL`| Email pengguna                                                             |
| `email_verified_at`   | `TIMESTAMP`      | `NULLABLE`          | Waktu verifikasi email                                                      |
| `password`            | `VARCHAR(255)`   | `NOT NULL`          | Password (hashed)                                                          |
| `remember_token`      | `VARCHAR(100)`   | `NULLABLE`          | Token untuk fitur "remember me"                                             |
| `phone`               | `VARCHAR(20)`    | `NULLABLE`, `INDEX` | Nomor telepon pengguna                                                     |
| `user_id`             | `VARCHAR(100)`   | `NULLABLE`          | ID game pengguna (misal ID ML/FF)                                          |
| `role`                | `VARCHAR(20)`    | `DEFAULT 'user'`, `INDEX` | Peran pengguna (`user`/`admin`)                                     |
| `balance`             | `DECIMAL(15,2)`  | `DEFAULT 0`         | Saldo dompet pengguna                                                      |
| `is_active`           | `BOOLEAN`        | `DEFAULT TRUE`      | Status aktif pengguna                                                       |
| `created_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 2. `categories`
Tabel kategori game
| Kolom          | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`            | `BIGINT`         | `PRIMARY KEY`       | ID unik kategori                                                           |
| `name`          | `VARCHAR(100)`   | `NOT NULL`          | Nama kategori                                                              |
| `slug`          | `VARCHAR(100)`   | `UNIQUE`, `INDEX`   | Slug untuk URL                                                             |
| `icon`          | `VARCHAR(50)`    | `NULLABLE`          | Ikon kategori (misal nama icon Lucide)                                      |
| `is_active`     | `BOOLEAN`        | `DEFAULT TRUE`      | Status aktif kategori                                                      |
| `created_at`    | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`    | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 3. `games`
Tabel game
| Kolom             | Tipe Data       | Constraint          | Deskripsi                                                                 |
|--------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`               | `BIGINT`         | `PRIMARY KEY`       | ID unik game                                                               |
| `name`             | `VARCHAR(255)`   | `NOT NULL`          | Nama game                                                                  |
| `slug`             | `VARCHAR(255)`   | `UNIQUE`, `INDEX`   | Slug untuk URL                                                             |
| `description`      | `TEXT`           | `NULLABLE`          | Deskripsi game                                                             |
| `image_url`        | `VARCHAR(500)`   | `NULLABLE`          | URL gambar thumbnail game                                                  |
| `banner_url`       | `VARCHAR(500)`   | `NULLABLE`          | URL banner game                                                            |
| `category_id`      | `BIGINT`         | `FOREIGN KEY` (`categories.id`), `NULLABLE`, `INDEX`, `ON DELETE SET NULL` | Kategori game |
| `is_active`        | `BOOLEAN`        | `DEFAULT TRUE`, `INDEX` | Status aktif game                                                    |
| `sort_order`       | `INTEGER`        | `DEFAULT 0`         | Urutan tampilan game                                                       |
| `created_at`       | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`       | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 4. `products`
Tabel paket top-up game
| Kolom                 | Tipe Data       | Constraint          | Deskripsi                                                                 |
|------------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                   | `BIGINT`         | `PRIMARY KEY`       | ID unik produk                                                            |
| `game_id`              | `BIGINT`         | `FOREIGN KEY` (`games.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Game terkait |
| `name`                 | `VARCHAR(255)`   | `NOT NULL`          | Nama paket top-up                                                         |
| `slug`                 | `VARCHAR(255)`   | `INDEX`, `UNIQUE(game_id,slug)` | Slug produk (unik per game)                                          |
| `description`          | `TEXT`           | `NULLABLE`          | Deskripsi produk                                                          |
| `price`                | `DECIMAL(12,2)`  | `NOT NULL`, `INDEX` | Harga jual produk                                                         |
| `original_price`       | `DECIMAL(12,2)`  | `NULLABLE`          | Harga asli sebelum diskon                                                 |
| `flash_sale_price`     | `DECIMAL(12,2)`  | `NULLABLE`, `INDEX` | Harga flash sale                                                          |
| `image_url`            | `VARCHAR(500)`   | `NULLABLE`          | URL gambar produk                                                         |
| `package_type`         | `VARCHAR(50)`    | `NULLABLE`          | Tipe paket (misal `regular`, `weekly`, `monthly`)                          |
| `game_currency_amount` | `VARCHAR(50)`    | `NULLABLE`          | Jumlah mata uang game yang didapatkan                                     |
| `bonus_amount`         | `VARCHAR(50)`    | `NULLABLE`          | Bonus tambahan                                                             |
| `is_featured`          | `BOOLEAN`        | `DEFAULT FALSE`     | Status produk unggulan                                                    |
| `is_flash_sale`        | `BOOLEAN`        | `DEFAULT FALSE`, `INDEX` | Status flash sale aktif                                            |
| `flash_sale_ends_at`   | `TIMESTAMP`      | `NULLABLE`, `INDEX` | Waktu berakhir flash sale                                                 |
| `is_active`            | `BOOLEAN`        | `DEFAULT TRUE`, `INDEX` | Status aktif produk                                                |
| `stock`                | `INTEGER`        | `DEFAULT -1`        | Stok produk (`-1` = unlimited)                                             |
| `created_at`           | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`           | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 5. `payment_methods`
Tabel metode pembayaran
| Kolom               | Tipe Data       | Constraint          | Deskripsi                                                                 |
|----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                 | `BIGINT`         | `PRIMARY KEY`       | ID unik metode pembayaran                                                 |
| `name`               | `VARCHAR(100)`   | `NOT NULL`          | Nama metode pembayaran                                                    |
| `code`               | `VARCHAR(50)`    | `UNIQUE`, `INDEX`   | Kode metode pembayaran (misal `bca`, `gopay`)                              |
| `type`               | `VARCHAR(30)`    | `INDEX`             | Tipe metode pembayaran (misal `bank_transfer`, `e_wallet`)                  |
| `image_url`          | `VARCHAR(500)`   | `NULLABLE`          | URL logo metode pembayaran                                                |
| `account_number`     | `VARCHAR(50)`    | `NULLABLE`          | Nomor rekening/akun penerima                                              |
| `account_name`       | `VARCHAR(100)`   | `NULLABLE`          | Nama akun penerima                                                         |
| `min_amount`         | `DECIMAL(12,2)`  | `DEFAULT 0`         | Minimal transaksi                                                          |
| `max_amount`         | `DECIMAL(12,2)`  | `DEFAULT 999999999` | Maksimal transaksi                                                         |
| `is_active`          | `BOOLEAN`        | `DEFAULT TRUE`      | Status aktif metode pembayaran                                            |
| `sort_order`         | `INTEGER`        | `DEFAULT 0`         | Urutan tampilan metode pembayaran                                          |
| `created_at`         | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`         | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 6. `promos`
Tabel promo umum (bukan kupon spin wheel)
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik promo                                                              |
| `code`                | `VARCHAR(50)`    | `UNIQUE`, `INDEX`, `NOT NULL` | Kode promo (untuk diinput)                                          |
| `name`                | `VARCHAR(255)`   | `NOT NULL`          | Nama promo                                                                 |
| `description`         | `TEXT`           | `NULLABLE`          | Deskripsi promo                                                            |
| `type`                | `VARCHAR(20)`    | `NOT NULL`          | Tipe promo (`percentage`/`fixed`)                                          |
| `discount_value`      | `DECIMAL(10,2)`  | `NOT NULL`          | Nilai diskon (persen atau nominal)                                         |
| `min_order_amount`    | `DECIMAL(15,2)`  | `DEFAULT 0`         | Minimal pesanan untuk menggunakan promo                                     |
| `max_discount`        | `DECIMAL(15,2)`  | `NULLABLE`          | Maksimal diskon yang dapat diperoleh                                       |
| `usage_limit`         | `INTEGER`        | `NULLABLE`          | Batas penggunaan promo                                                      |
| `used_count`          | `INTEGER`        | `DEFAULT 0`         | Jumlah penggunaan promo                                                     |
| `start_date`          | `TIMESTAMP`      | `NULLABLE`          | Waktu mulai promo                                                           |
| `end_date`            | `TIMESTAMP`      | `NULLABLE`          | Waktu berakhir promo                                                       |
| `is_active`           | `BOOLEAN`        | `DEFAULT TRUE`, `INDEX` | Status aktif promo                                                  |
| `created_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 7. `orders`
Tabel pesanan top-up
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik pesanan                                                            |
| `order_number`        | `VARCHAR(50)`    | `UNIQUE`, `INDEX`, `NOT NULL` | Nomor pesanan unik (misal `ORD-20260523-123456`)                     |
| `user_id`             | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NULLABLE`, `INDEX`, `ON DELETE SET NULL` | Pengguna yang membuat pesanan |
| `game_id`             | `BIGINT`         | `FOREIGN KEY` (`games.id`), `NOT NULL`, `INDEX`, `ON DELETE RESTRICT` | Game yang dipesan |
| `product_id`          | `BIGINT`         | `FOREIGN KEY` (`products.id`), `NOT NULL`, `INDEX`, `ON DELETE RESTRICT` | Produk yang dipesan |
| `target_user_id`      | `VARCHAR(100)`   | `NOT NULL`          | ID game target (untuk top-up)                                              |
| `quantity`            | `INTEGER`        | `DEFAULT 1`         | Jumlah paket yang dipesan                                                   |
| `total_amount`        | `DECIMAL(15,2)`  | `NOT NULL`          | Total sebelum diskon                                                       |
| `discount_amount`     | `DECIMAL(15,2)`  | `DEFAULT 0`         | Total diskon (promo + kupon)                                               |
| `final_amount`        | `DECIMAL(15,2)`  | `NOT NULL`          | Total yang harus dibayar                                                   |
| `status`              | `VARCHAR(30)`    | `DEFAULT 'pending'`, `INDEX` | Status pesanan (`pending`/`processing`/`completed`/`failed`/`cancelled`) |
| `payment_status`      | `VARCHAR(20)`    | `DEFAULT 'unpaid'`, `INDEX` | Status pembayaran (`unpaid`/`paid`/`failed`)                        |
| `payment_method`      | `VARCHAR(50)`    | `NULLABLE`          | Metode pembayaran yang digunakan                                           |
| `payment_proof_url`   | `VARCHAR(500)`   | `NULLABLE`          | URL bukti pembayaran                                                        |
| `paid_at`             | `TIMESTAMP`      | `NULLABLE`          | Waktu pembayaran berhasil                                                   |
| `admin_notes`         | `TEXT`           | `NULLABLE`          | Catatan admin untuk pesanan                                                |
| `created_at`          | `TIMESTAMP`      | `INDEX`, `NULLABLE` | Waktu dibuat                                                                |
| `updated_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 8. `payments`
Tabel detail pembayaran pesanan
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik pembayaran                                                         |
| `order_id`            | `BIGINT`         | `FOREIGN KEY` (`orders.id`), `UNIQUE`, `INDEX`, `ON DELETE CASCADE` | Pesanan yang dibayar |
| `payment_method`      | `VARCHAR(50)`    | `NOT NULL`          | Metode pembayaran                                                          |
| `payment_number`      | `VARCHAR(100)`   | `NULLABLE`          | Nomor transaksi pembayaran                                                 |
| `amount`              | `DECIMAL(15,2)`  | `NOT NULL`          | Jumlah yang dibayar                                                         |
| `status`              | `VARCHAR(30)`    | `DEFAULT 'pending'`, `INDEX` | Status pembayaran (`pending`/`success`/`failed`/`expired`) |
| `payment_proof_url`   | `VARCHAR(500)`   | `NULLABLE`          | URL bukti pembayaran                                                        |
| `paid_at`             | `TIMESTAMP`      | `NULLABLE`          | Waktu pembayaran berhasil                                                   |
| `payment_reference`   | `VARCHAR(255)`   | `NULLABLE`, `INDEX` | Referensi pembayaran (misal ID virtual account)                              |
| `metadata`            | `JSONB`          | `NULLABLE`          | Data tambahan (misal detail metode pembayaran)                              |
| `created_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`          | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 9. `promo_usages`
Tabel riwayat penggunaan promo
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik penggunaan promo                                                   |
| `user_id`             | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Pengguna yang menggunakan promo |
| `promo_id`            | `BIGINT`         | `FOREIGN KEY` (`promos.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Promo yang digunakan |
| `order_id`            | `BIGINT`         | `FOREIGN KEY` (`orders.id`), `NULLABLE`, `ON DELETE SET NULL` | Pesanan yang menggunakan promo |
| `discount_amount`     | `DECIMAL(15,2)`  | `NOT NULL`          | Nilai diskon yang diperoleh                                                |
| `used_at`             | `TIMESTAMP`      | `DEFAULT CURRENT_TIMESTAMP` | Waktu penggunaan promo                                          |

---

### 10. `coupons`
Tabel kupon spin wheel (diberikan per order)
| Kolom                   | Tipe Data       | Constraint          | Deskripsi                                                                 |
|--------------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                     | `BIGINT`         | `PRIMARY KEY`       | ID unik kupon                                                              |
| `user_id`                | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Pemilik kupon |
| `issued_for_order_id`    | `BIGINT`         | `FOREIGN KEY` (`orders.id`), `UNIQUE`, `NOT NULL`, `ON DELETE CASCADE` | Order yang menghasilkan kupon |
| `redeemed_order_id`      | `BIGINT`         | `FOREIGN KEY` (`orders.id`), `NULLABLE`, `ON DELETE SET NULL` | Order yang menukarkan kupon |
| `code`                   | `VARCHAR(50)`    | `UNIQUE`, `NOT NULL` | Kode kupon unik (untuk diinput)                                          |
| `discount_percent`       | `TINYINT UNSIGNED` | `NOT NULL`       | Persentase diskon (3-15%)                                                 |
| `is_redeemed`            | `BOOLEAN`        | `DEFAULT FALSE`, `INDEX(user_id,is_redeemed)` | Status kupon sudah ditukarkan |
| `expires_at`             | `TIMESTAMP`      | `NULLABLE`, `INDEX` | Waktu kedaluwarsa kupon                                                    |
| `created_at`             | `TIMESTAMP`      | `NULLABLE`          | Waktu dibuat                                                                |
| `updated_at`             | `TIMESTAMP`      | `NULLABLE`          | Waktu diperbarui                                                            |

---

### 11. `transactions`
Tabel riwayat transaksi saldo dompet
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik transaksi                                                          |
| `user_id`             | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Pengguna yang memiliki transaksi |
| `type`                | `VARCHAR(30)`    | `INDEX`, `NOT NULL` | Tipe transaksi (`deposit`/`withdrawal`/`topup`/`refund`)                  |
| `amount`              | `DECIMAL(15,2)`  | `NOT NULL`          | Jumlah transaksi (positif = masuk, negatif = keluar)                        |
| `balance_before`      | `DECIMAL(15,2)`  | `NOT NULL`          | Saldo sebelum transaksi                                                    |
| `balance_after`       | `DECIMAL(15,2)`  | `NOT NULL`          | Saldo setelah transaksi                                                    |
| `reference_type`      | `VARCHAR(50)`    | `NULLABLE`          | Tipe referensi (misal `order`, `deposit`)                                   |
| `reference_id`        | `BIGINT`         | `NULLABLE`          | ID referensi (misal `order_id`)                                             |
| `description`         | `TEXT`           | `NULLABLE`          | Deskripsi transaksi                                                         |
| `created_at`          | `TIMESTAMP`      | `DEFAULT CURRENT_TIMESTAMP`, `INDEX` | Waktu transaksi                                      |

---

### 12. `notifications`
Tabel notifikasi pengguna
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik notifikasi                                                         |
| `user_id`             | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NOT NULL`, `INDEX`, `ON DELETE CASCADE` | Penerima notifikasi |
| `title`               | `VARCHAR(255)`   | `NOT NULL`          | Judul notifikasi                                                           |
| `message`             | `TEXT`           | `NOT NULL`          | Isi notifikasi                                                             |
| `type`                | `VARCHAR(30)`    | `DEFAULT 'system'`  | Tipe notifikasi (`system`/`order`/`payment`)                                |
| `is_read`             | `BOOLEAN`        | `DEFAULT FALSE`, `INDEX` | Status notifikasi sudah dibaca                                      |
| `read_at`             | `TIMESTAMP`      | `NULLABLE`          | Waktu dibaca                                                               |
| `created_at`          | `TIMESTAMP`      | `DEFAULT CURRENT_TIMESTAMP` | Waktu dibuat                                          |

---

### 13. `activity_logs`
Tabel log aktivitas pengguna/admin
| Kolom                | Tipe Data       | Constraint          | Deskripsi                                                                 |
|-----------------------|------------------|---------------------|---------------------------------------------------------------------------|
| `id`                  | `BIGINT`         | `PRIMARY KEY`       | ID unik log                                                                |
| `user_id`             | `BIGINT`         | `FOREIGN KEY` (`users.id`), `NULLABLE`, `INDEX`, `ON DELETE SET NULL` | Pengguna yang melakukan aksi |
| `action`              | `VARCHAR(100)`   | `NOT NULL`          | Aksi yang dilakukan (misal `create_order`, `update_product`)              |
| `model_type`          | `VARCHAR(100)`   | `NULLABLE`, `INDEX(model_type,model_id)` | Tipe model yang diubah (misal `App\Models\Order`) |
| `model_id`            | `BIGINT`         | `NULLABLE`          | ID model yang diubah                                                       |
| `old_values`          | `JSONB`          | `NULLABLE`          | Nilai sebelum perubahan                                                     |
| `new_values`          | `JSONB`          | `NULLABLE`          | Nilai setelah perubahan                                                     |
| `ip_address`          | `VARCHAR(45)`    | `NULLABLE`          | Alamat IP pengguna                                                         |
| `user_agent`          | `TEXT`           | `NULLABLE`          | Browser/perangkat pengguna                                                  |
| `created_at`          | `TIMESTAMP`      | `DEFAULT CURRENT_TIMESTAMP` | Waktu aksi                                      |

---

## Tabel Default Laravel (Sistem)
Tabel ini bawaan Laravel dan tidak perlu diubah secara manual:
1. `cache`, `cache_locks` - Cache aplikasi
2. `jobs`, `job_batches`, `failed_jobs` - Antrian pekerjaan
3. `password_reset_tokens` - Reset password
4. `sessions` - Session pengguna

---

## Ringkasan Hubungan
| Hubungan                          | Tipe Relasi          | Keterangan                                                                 |
|-----------------------------------|-----------------------|---------------------------------------------------------------------------|
| `users` → `orders`                | One-to-Many           | 1 user bisa membuat banyak pesanan                                        |
| `users` → `coupons`               | One-to-Many           | 1 user bisa memiliki banyak kupon                                         |
| `users` → `transactions`          | One-to-Many           | 1 user bisa memiliki banyak transaksi saldo                                |
| `users` → `notifications`         | One-to-Many           | 1 user bisa menerima banyak notifikasi                                    |
| `users` → `activity_logs`         | One-to-Many           | 1 user bisa memiliki banyak log aktivitas                                  |
| `categories` → `games`            | One-to-Many           | 1 kategori bisa memiliki banyak game                                      |
| `games` → `products`              | One-to-Many           | 1 game bisa memiliki banyak paket top-up                                  |
| `products` → `orders`             | One-to-Many           | 1 produk bisa dipesan di banyak pesanan                                   |
| `payment_methods` → `orders`      | One-to-Many           | 1 metode pembayaran bisa digunakan di banyak pesanan                       |
| `promos` → `promo_usages`         | One-to-Many           | 1 promo bisa digunakan di banyak pesanan                                  |
| `orders` → `payments`             | One-to-One            | 1 pesanan memiliki 1 detail pembayaran                                    |
| `orders` → `promo_usages`         | One-to-Many (nullable)| 1 pesanan bisa menggunakan 1 promo                                        |
| `orders` → `coupons`              | One-to-One            | 1 pesanan menghasilkan 1 kupon spin wheel                                 |

---

## Indeks Utama
Daftar indeks yang sering digunakan untuk optimasi query:
| Tabel               | Indeks                                  |
|----------------------|-----------------------------------------|
| `users`              | `email`, `phone`, `role`                |
| `games`              | `slug`, `category_id`, `is_active`     |
| `products`           | `game_id`, `slug`, `price`, `is_active`, `is_flash_sale`, `flash_sale_ends_at` |
| `orders`             | `order_number`, `user_id`, `game_id`, `product_id`, `status`, `payment_status`, `created_at` |
| `payments`           | `order_id`, `status`, `payment_reference` |
| `coupons`            | `user_id,is_redeemed`, `expires_at`     |
| `transactions`       | `user_id`, `type`, `created_at`         |
| `notifications`      | `user_id`, `is_read`                    |
| `activity_logs`      | `user_id`, `model_type,model_id`        |
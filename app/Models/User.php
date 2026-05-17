<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'user_id',
        'role',
        'balance',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'balance' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';

    protected $attributes = [
        'balance' => 0,
        'role' => 'user',
        'is_active' => true,
    ];

    protected $appends = ['is_admin'];

    protected function isAdmin(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->role === self::ROLE_ADMIN,
        );
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function promoUsages(): HasMany
    {
        return $this->hasMany(PromoUsage::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function addBalance(float $amount): void
    {
        $this->update([
            'balance' => $this->balance + $amount,
        ]);
    }

    public function deductBalance(float $amount): bool
    {
        if ($this->balance < $amount) {
            return false;
        }

        $this->update([
            'balance' => $this->balance - $amount,
        ]);

        return true;
    }
}

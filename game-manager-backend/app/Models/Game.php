<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    /** @use HasFactory<\Database\Factories\GameFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'price',
        'cover_image',
        'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Users who own this game
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_game')
            ->withPivot('purchased_at')
            ->withTimestamps();
    }

    /**
     * Reviews for this game
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
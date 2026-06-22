<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotoPermission extends Model
{
    protected $table = 'photo_view_requests';

    protected $fillable = [
        'user_id',
        'sender_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(\App\User::class, 'user_id');
    }

    public function sender()
    {
        return $this->belongsTo(\App\User::class, 'sender_id');
    }
}

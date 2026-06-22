<?php

namespace App\Models;
use App\User;

use Illuminate\Database\Eloquent\Model;

class ProfileMatch extends Model
{
    public function matched_profile(){
      return $this->belongsTo(User::class, 'match_id');
    }
}

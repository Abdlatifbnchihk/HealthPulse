<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'specialty',
        'fee',
        'slot_duration'
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }

    public function tenants(){
        return $this->belongsTo(Tenants::class);
    }

    public function schedules(){
        return $this->hasMany(DoctorSchedule::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorSchedules extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'doctor_profile_id',
        'tenant_id',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'is_active'
    ];

    public function doctor_profile(): BelongsTo {
        return $this->belongsTo(DoctorProfile::class);
    }

    public function tenants(): BelongsTo {
        return $this->belongsTo(Tenants::class);
    }

}

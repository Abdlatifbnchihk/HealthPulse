<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enum\AppointmentsStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointments extends Model
{
    //

    use HasFactory;

    // Statuses: pending | confirmed | completed | canceled
    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELED = 'canceled';

    protected $fillable = [
        'tenant_id',
        'patient_id',
        'doctor_profile_id',
        'appointment_date',
        'start_time',
        'end_time',
        'status',
        'notes'
    ];

    protected function casts(): array {
        return [
           'status' => AppointmentsStatus::class,
           'appointment_date' => 'datetime',
        ];
    }

    // Add The Relationship Between The models

    public function tenants(): BelongsTo {
        return $this->BelongsTo(Tenants::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function doctorProfil(): BelongsTo{
        return $this->belongsTo(DoctorProfile::class);
    }

    public function aiPatientIntake(): HasOne {
        return $this->hasOne(AiPatientIntake::class);
    }

    public function consultationRecord(): HasOne {
        return $this->hasOne(ConsultationRecord::class);
    }



}

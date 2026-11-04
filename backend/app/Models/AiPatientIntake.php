<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enum\AiPatientIntakeStatus;

class AiPatientIntake extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'tenant_id',
        'row_symptoms',
        'ai_summary',
        'urgency',
    ];

    protected function casts(): array {
        return [
            'urgency' => AiPatientIntakeStatus::class,
        ];
    }

    public function appointments(){
        return $this->belongsTo(Appointments::class);
    }

    public function tenant() {
        return $this->belongsTo(Tenants::class);
    }

}

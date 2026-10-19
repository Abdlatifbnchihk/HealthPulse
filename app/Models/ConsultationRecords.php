<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationRecords extends Model
{
    //

    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'tenant_id',
        'row_notes',
        'soap_subjective',
        'soap_objective',
        'soap_assessment',
        'soap_plan'
    ];

    public function appointment() {
        return $this->belongsTo(Appointments::class);
    }

    public function tenant() {
        return $this->belongsTo(Tenants::class);
    }
    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Str;

class Tenants extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'slug' => Str::slug(),
        'subscription_status',
        'trial_ends_at',
    ];


    protected $casts = [
        'trial_ends_at' => 'datetime',
        'subscription_status' => 'enum'
    ];

    public function users(){
        return $this->hasMany(User::class);
    }

    public function doctorProfiles(){
        return $this->hasMany(DoctorProfiles::class);
    }

    public function doctorSchedules(){
        return $this->hasMany(DoctorSchedules::class);
    }

    public function appointments(){
        return $this->hasMany(Appointments::class);
    }

        public function aiPatientIntakes()
    {
        return $this->hasMany(AiPatientIntake::class);
    }

    public function consultationRecords()
    {
        return $this->hasMany(ConsultationRecord::class);
    }
}

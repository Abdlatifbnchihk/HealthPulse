<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'patient_id' => $this->patient_id,
            'patient' => $this->whenLoaded('user', function () {
                return $this->user
                    ? ['name' => $this->user->name]
                    : null;
            }),
            'doctor_profile_id' => $this->doctor_profile_id,
            'doctor' => $this->whenLoaded('doctorProfil', function () {
                if (! $this->doctorProfil) {
                    return null;
                }

                return [
                    'name' => $this->doctorProfil->user?->name,
                    'specialty' => $this->doctorProfil->specialty,
                ];
            }),
            'appointment_date' => $this->appointment_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

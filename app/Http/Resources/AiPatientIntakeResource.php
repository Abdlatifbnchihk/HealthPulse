<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiPatientIntakeResource extends JsonResource
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
            'appointment_id' => $this->appointment_id,
            'tenant_id' => $this->tenant_id,
            'row_symptoms' => $this->row_symptoms,
            'ai_summary' => $this->ai_summary,
            'urgency' => $this->urgency,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

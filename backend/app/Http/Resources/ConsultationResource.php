<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationResource extends JsonResource
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
            'row_notes' => $this->row_notes,
            'soap_subjective' => $this->soap_subjective,
            'soap_objective' => $this->soap_objective,
            'soap_assessment' => $this->soap_assessment,
            'soap_plan' => $this->soap_plan,
            'soap_status' => $this->soap_status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

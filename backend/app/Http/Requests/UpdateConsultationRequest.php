<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\ConsultationRecords;

class UpdateConsultationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $consultation = $this->route('consultation')
            ?? $this->route('consultationRecord');

        $consultationId = $consultation instanceof ConsultationRecords
            ? $consultation->getKey()
            : $consultation;

        $tenantId = $this->input(
            'tenant_id',
            $consultation instanceof ConsultationRecords ? $consultation->tenant_id : null
        );

        return [
            'appointment_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('appointments', 'id')
                    ->where('tenant_id', $tenantId),
                Rule::unique('consultation_records', 'appointment_id')
                    ->where('tenant_id', $tenantId)
                    ->ignore($consultationId),
            ],
            'tenant_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:tenants,id',
            ],
            'row_notes' => ['sometimes', 'nullable', 'string'],
            'soap_subjective' => ['sometimes', 'required', 'string'],
            'soap_objective' => ['sometimes', 'required', 'string'],
            'soap_assessment' => ['sometimes', 'required', 'string'],
            'soap_plan' => ['sometimes', 'required', 'string'],
        ];
    }
}

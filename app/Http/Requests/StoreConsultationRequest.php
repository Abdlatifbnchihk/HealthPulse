<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultationRequest extends FormRequest
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
        return [
            'appointment_id' => [
                'required',
                'integer',
                Rule::exists('appointments', 'id')
                    ->where('tenant_id', $this->input('tenant_id')),
                Rule::unique('consultation_records', 'appointment_id')
                    ->where('tenant_id', $this->input('tenant_id')),
            ],
            'tenant_id' => ['required', 'integer', 'exists:tenants,id'],
            'row_notes' => ['nullable', 'string'],
            'soap_subjective' => ['required', 'string'],
            'soap_objective' => ['required', 'string'],
            'soap_assessment' => ['required', 'string'],
            'soap_plan' => ['required', 'string'],
        ];
    }
}

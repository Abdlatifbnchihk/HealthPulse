<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAiPatientIntakeControllerRequest extends FormRequest
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
            //
            'appointment_id' => [
                'required',
                'integer',
                'exists:appointments,id',
            ],
            'tenant_id' => [
                'required',
                'integer',
                'exists:tenants,id',
            ],
            'row_symptoms' => ['nullable', 'string'],
            'ai_summary' => ['nullable', 'string'],
            'urgency' => [
                'nullable',
                Rule::in(['low', 'medium', 'high', 'critical']),
            ],
        ];
    }
}

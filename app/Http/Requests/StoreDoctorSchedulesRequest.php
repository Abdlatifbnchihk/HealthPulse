<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorSchedulesRequest extends FormRequest
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
            'doctor_profile_id' => [
                'required',
                'integer',
                Rule::exists('doctor_profiles', 'id')
                    ->where('tenant_id', $this->input('tenant_id')),
            ],
            'tenant_id' => ['required', 'integer', 'exists:tenants,id'],
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_duration_minutes' => [
                'required',
                'integer',
                Rule::in([15, 20, 30, 60]),
            ],
            'is_active' => ['required', 'boolean'],
        ];
    }
}

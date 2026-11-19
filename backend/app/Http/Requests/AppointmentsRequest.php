<?php

namespace App\Http\Requests;

use App\Enum\RegisterUserRolesEnums;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppointmentsRequest extends FormRequest
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
        $isSuperAdmin = $this->user()?->role === RegisterUserRolesEnums::Super_admin;

        return [
            'tenant_id' => [
                'nullable',
                Rule::requiredIf($isSuperAdmin),
                Rule::prohibitedIf(! $isSuperAdmin),
                'integer',
                'exists:tenants,id',
            ],
            'patient_id' => [
                'nullable',
                Rule::requiredIf($isSuperAdmin),
                Rule::prohibitedIf(! $isSuperAdmin),
                'integer',
                Rule::exists('users', 'id')->where('role', RegisterUserRolesEnums::Patient->value),
            ],
            'doctor_profile_id' => ['required', 'integer', 'exists:doctor_profiles,id'],
            'appointment_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

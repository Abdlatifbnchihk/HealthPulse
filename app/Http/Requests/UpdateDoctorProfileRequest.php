<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorProfileRequest extends FormRequest
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
            'user_id' => [
                'required',
                'integer',
                Rule::unique('doctor_profiles', 'user_id')
                    ->ignore($this->route('doctorProfile')),
                Rule::exists('users', 'id')
                    ->where('role', 'doctor')
                    ->where('tenant_id', $this->input('tenant_id')),
            ],
            'tenant_id' => ['required', 'integer', 'exists:tenants,id'],
            'specialty' => ['required', 'string', 'max:255'],
            'fee' => ['required', 'numeric', 'min:0'],
            'slot_duration' => ['required', 'integer', Rule::in([15, 20, 30, 60])],
        ];
    }
}

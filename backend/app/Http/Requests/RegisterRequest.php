<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
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
        $role = $this->input('role');

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'tenant_id' => [
                'nullable',
                Rule::requiredIf($role === 'doctor'),
                Rule::prohibitedIf($role === 'patient'),
                'integer',
                'exists:tenants,id',
            ],
            'specialty' => [
                'nullable',
                Rule::requiredIf($role === 'doctor'),
                Rule::prohibitedIf($role === 'patient'),
                'string',
                'max:255',
            ],
            'fee' => [
                'nullable',
                Rule::requiredIf($role === 'doctor'),
                Rule::prohibitedIf($role === 'patient'),
                'numeric',
                'min:0',
                'max:999999.99',
            ],
            'slot_duration' => [
                'nullable',
                Rule::requiredIf($role === 'doctor'),
                Rule::prohibitedIf($role === 'patient'),
                'integer',
                Rule::in([15, 20, 30, 60]),
            ],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['doctor', 'patient'])],
        ];
    }
}

<?php

namespace App\Http\Requests;

use App\Enum\RegisterUserRolesEnums;
use App\Models\DoctorProfile;
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
        $user = $this->user();
        if ($user?->role === RegisterUserRolesEnums::Super_admin) {
            return true;
        }

        return $user?->role === RegisterUserRolesEnums::Doctor
            && DoctorProfile::query()
                ->whereKey($this->input('doctor_profile_id'))
                ->where('user_id', $user->id)
                ->where('tenant_id', $this->input('tenant_id'))
                ->exists();
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
            'day_of_week' => ['required', 'integer', 'between:1,7'],
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

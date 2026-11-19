<?php

namespace App\Http\Requests;

use App\Enum\RegisterUserRolesEnums;
use App\Models\DoctorSchedules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorSchedulesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $schedule = $this->route('doctorSchedules');

        return $user?->role === RegisterUserRolesEnums::Super_admin
            || (
                $user?->role === RegisterUserRolesEnums::Doctor
                && $schedule instanceof DoctorSchedules
                && $schedule->doctor_profile?->user_id === $user->id
            );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'day_of_week' => [
                'sometimes',
                'required',
                'integer',
                'between:1,7',
            ],
            'start_time' => [
                'sometimes',
                'required',
                'required_with:end_time',
                'date_format:H:i',
            ],
            'end_time' => [
                'sometimes',
                'required',
                'required_with:start_time',
                'date_format:H:i',
                'after:start_time',
            ],
            'slot_duration_minutes' => [
                'sometimes',
                'required',
                'integer',
                Rule::in([15, 20, 30, 60]),
            ],
            'is_active' => ['sometimes', 'required', 'boolean'],
        ];
    }
}

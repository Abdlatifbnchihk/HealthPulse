<?php

namespace App\Http\Controllers\Api;

use App\Enum\RegisterUserRolesEnums;
use App\Http\Resources\AppointmentsResource;
use App\Http\Resources\DoctorProfileResource;
use App\Http\Resources\DoctorSchedulesResource;
use App\Models\Appointments;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorDashboardController
{
    use AuthorizesRequests;
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user->role === RegisterUserRolesEnums::Doctor,
            403,
            'Only doctor accounts can access the doctor dashboard.',
        );

        $doctorProfile = DoctorProfile::query()
            ->where('user_id', $user->id)
            ->firstOrFail();

        $this->authorize('view', $doctorProfile);

        $schedules = DoctorSchedules::query()
            ->where('doctor_profile_id', $doctorProfile->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        $appointments = Appointments::query()
            ->where('doctor_profile_id', $doctorProfile->id)
            ->with('user')
            ->orderByDesc('appointment_date')
            ->get();

        return response()->json([
            'data' => [
                'doctor' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile' => (new DoctorProfileResource($doctorProfile))->resolve($request),
                ],
                'schedules' => DoctorSchedulesResource::collection($schedules)->resolve($request),
                'appointments' => AppointmentsResource::collection($appointments)->resolve($request),
            ],
        ]);
    }
}

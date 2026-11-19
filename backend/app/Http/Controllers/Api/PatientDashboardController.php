<?php

namespace App\Http\Controllers\Api;

use App\Enum\RegisterUserRolesEnums;
use App\Http\Resources\AiPatientIntakeResource;
use App\Http\Resources\AppointmentsResource;
use App\Http\Resources\ConsultationResource;
use App\Models\AiPatientIntake;
use App\Models\Appointments;
use App\Models\ConsultationRecords;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientDashboardController
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user->role === RegisterUserRolesEnums::Patient,
            403,
            'Only patient accounts can access the patient dashboard.',
        );

        $appointments = Appointments::query()
            ->where('patient_id', $user->id)
            ->with('doctorProfil.user')
            ->latest('appointment_date')
            ->get();

        $aiIntakes = AiPatientIntake::query()
            ->whereHas(
                'appointments',
                fn ($query) => $query->where('patient_id', $user->id),
            )
            ->latest()
            ->get();

        $consultationRecords = ConsultationRecords::query()
            ->whereHas(
                'appointment',
                fn ($query) => $query->where('patient_id', $user->id),
            )
            ->latest()
            ->get();

        return response()->json([
            'data' => [
                'appointments' => AppointmentsResource::collection($appointments)->resolve($request),
                'ai_intakes' => AiPatientIntakeResource::collection($aiIntakes)->resolve($request),
                'consultation_records' => ConsultationResource::collection($consultationRecords)->resolve($request),
            ],
        ]);
    }
}

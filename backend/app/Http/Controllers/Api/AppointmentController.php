<?php

namespace App\Http\Controllers\Api;

use App\Enum\RegisterUserRolesEnums;
use App\Http\Requests\AppointmentsRequest;
use App\Http\Requests\AppointmentsUpdateRequest;
use App\Http\Resources\AppointmentsResource;
use App\Models\Appointments;
use App\Models\DoctorProfile;
use App\Services\BookingService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class AppointmentController
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();
        $this->authorize('viewAny', Appointments::class);

        $appointments = Appointments::query()
            ->when(
                $user->role !== RegisterUserRolesEnums::Super_admin,
                fn ($query) => $query->where('patient_id', $user->id),
            )
            ->get();

        return AppointmentsResource::collection($appointments)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AppointmentsRequest $request, BookingService $bookingService)
    {
        $this->authorize('create', Appointments::class);

        $validated = $request->validated();
        $user = $request->user();
        $doctorProfile = DoctorProfile::query()->findOrFail($validated['doctor_profile_id']);

        if (
            $user->role === RegisterUserRolesEnums::Super_admin
            && (int) $validated['tenant_id'] !== $doctorProfile->tenant_id
        ) {
            throw ValidationException::withMessages([
                'tenant_id' => ['The selected clinic does not match the doctor profile.'],
            ]);
        }

        try {
            $appointment = $bookingService->bookAppointment([
                ...$validated,
                'tenant_id' => $doctorProfile->tenant_id,
                'patient_id' => $user->role === RegisterUserRolesEnums::Super_admin
                    ? $validated['patient_id']
                    : $user->id,
            ]);
        } catch (RuntimeException $exception) {
            throw ValidationException::withMessages([
                'start_time' => [$exception->getMessage()],
            ]);
        }

        $appointment->load(['user', 'doctorProfil.user']);

        return (new AppointmentsResource($appointment))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointments $appointment)
    {
        //
        $this->authorize('view', $appointment);

        return (new AppointmentsResource($appointment))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AppointmentsUpdateRequest $request, Appointments $appointment)
    {
        //
        $validate = $request->validated();

        $this->authorize('update', $appointment);

        $appointment->update();

        return (new AppointmentsResource($appointment))->response();

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointments $appointment)
    {
        //
        $this->authorize('delete', $appointment);

        $appointment->delete();

        return response()->json(['Message' => 'Appointment has been deleted successfully']);
    }
}

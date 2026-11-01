<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AppointmentsRequest;
use App\Http\Requests\AppointmentsUpdateRequest;
use App\Http\Resources\AppointmentsResource;
use App\Models\Appointments;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class AppointmentController
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        $this->authorize('viewAny', Appointments::class);

        $appointments = Appointments::all();

        return AppointmentsResource::collection($appointments)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AppointmentsRequest $request)
    {
        //
        $validate = $request->validated();
        
        $appointment = Appointments::create([
            'tenant_id' => $validate['tenant_id'],
            'patient_id' => $validate['patient_id'],
            'doctor_profile_id' => $validate['doctor_profile_id'],
            'appointment_date' => $validate['appointment_date'],
            'start_time' => $validate['start_time'],
            'end_time' => $validate['end_time'],
            'notes' => $validate['notes']
        ]);

        $this->authorize('create', Appointments::class);

        return (new AppointmentsResource($appointment))->response();
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

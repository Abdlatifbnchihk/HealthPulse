<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DoctorSchedulesResource;
use App\Models\DoctorSchedules;
use App\Http\Requests\StoreDoctorSchedulesRequest;
use App\Http\Requests\UpdateDoctorSchedulesRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DoctorSchedulesController
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('veiwAny', DoctorSchedules::class);

        $doctorSchedules = DoctorSchedules::all();

        return DoctorSchedulesResource::collection($doctorSchedules)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDoctorSchedulesRequest $request)
    {
        //
        $this->authorize('create', DoctorSchedules::class);

        $validate = $request->validated();
        
        $doctorSchedules = DoctorSchedules::create([
            'doctor_profile_id' => $validate['doctor_profile_id'],
            'tenant_id' => $validate['tenant_id'],
            'day_of_week' => $validate['day_of_week'],
            'start_time' => $validate['start_time'],
            'end_time' => $validate['end_time'],
            'slot_duration_minutes' => $validate['slot_duration_minutes'],
            'is_active' => (bool) $validate['is_active'],
        ]);

        return (new DoctorSchedulesResource($doctorSchedules))->response();
    }

    /**
     * Display the specified resource.
     */
    public function show(DoctorSchedules $doctorSchedules)
    {
        //
        $this->authorize('view', $doctorSchedules);

        return (new DoctorSchedulesResource($doctorSchedules))->response();
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDoctorSchedulesRequest $request, DoctorSchedules $doctorSchedules)
    {
        //
        $this->authorize('update', $doctorSchedules);

        $validate = $request->validated();

        $doctorSchedules->update($validate);

        return (new DoctorSchedulesResource($doctorSchedules))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DoctorSchedules $doctorSchedules)
    {
        //
        $this->authorize('delete', $doctorSchedules);

        $doctorSchedules->delete();

        return response()->json(['Message' => 'Doctor schedules has been deleted successfully']);
    }
}

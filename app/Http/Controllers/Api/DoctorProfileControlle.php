<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DoctorProfileResource;
use App\Models\DoctorProfile;
use App\Http\Requests\StoreDoctorProfileRequest;
use App\Http\Requests\UpdateDoctorProfileRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DoctorProfileControlle
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('viewAny', DoctorProfile::class);

        $doctorProfile = DoctorProfile::all();

        return DoctorProfileResource::collection($doctorProfile)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDoctorProfileRequest $request)
    {
        //
        $this->authorize('create', DoctorProfile::class);

        $validated = $request->validated();

        $doctorProfile = DoctorProfile::create([
            'user_id' => $validated['user_id'],
            'tenant_id' => $validated['tenant_id'],
            'specialty' => $validated['specialty'],
            'fee' => $validated['fee'],
            'slot_duration' => $validated['slot_duration']
        ]);

        return (new DoctorProfileResource($doctorProfile))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(DoctorProfile $doctorProfile)
    {
        //
        $this->authorize('view', $doctorProfile);

        return (new DoctorProfileResource($doctorProfile))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDoctorProfileRequest $request, DoctorProfile $doctorProfile)
    {
        //
        $this->authorize('update', $doctorProfile);

        $data = $request->validated();

        $doctorProfile->update($data);

        return (new DoctorProfileResource($doctorProfile))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DoctorProfile $doctorProfile)
    {
        //
        $this->authorize('delete', $doctorProfile);

        $doctorProfile->delete();

        return response()->json(['Message' => 'The doctor profile deleted successfully']);
    }
}

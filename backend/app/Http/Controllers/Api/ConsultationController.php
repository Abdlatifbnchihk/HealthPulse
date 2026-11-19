<?php

namespace App\Http\Controllers\Api;

use App\Enum\RegisterUserRolesEnums;
use App\Http\Resources\ConsultationResource;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Jobs\ProcessConsultationRecord;
use App\Models\ConsultationRecords;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ConsultationController
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();
        $this->authorize('viewAny', ConsultationRecords::class);

        $consultationRecordes = ConsultationRecords::query()
            ->when(
                $user->role !== RegisterUserRolesEnums::Super_admin,
                fn ($query) => $query->whereHas(
                    'appointment',
                    fn ($appointmentQuery) => $appointmentQuery->where('patient_id', $user->id),
                ),
            )
            ->get();

        return ConsultationResource::collection($consultationRecordes)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultationRequest $request)
    {
        //
        $this->authorize('create', ConsultationRecords::class);

        $validated = $request->validated();
        $consultationRecord = ConsultationRecords::create([
            'appointment_id' => $validated['appointment_id'],
            'tenant_id' => $validated['tenant_id'],
            'row_notes' => $validated['row_notes'],
            'soap_status' => 'pending',
        ]);

        ProcessConsultationRecord::dispatch($consultationRecord);

        return (new ConsultationResource($consultationRecord))
            ->response()
            ->setStatusCode(202);
    }

    /**
     * Display the specified resource.
     */
    public function show(ConsultationRecords $consultationRecords)
    {
        //
        $this->authorize('view', $consultationRecords);

        return (new ConsultationResource($consultationRecords))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsultationRequest $request, ConsultationRecords $consultationRecords)
    {
        //
        $this->authorize('update', $consultationRecords);

        $validate = $request->validated();

        $consultationRecords->update($validate);

        return (new ConsultationResource($consultationRecords))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConsultationRecords $consultationRecords)
    {
        //
        $this->authorize('delete', $consultationRecords);

        $consultationRecords->delete();

        return response()->json(['Message' => 'Consultation recordes has been deleted successfully']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ConsultationResource;
use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\ConsultationRecords;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ConsultationController
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('viewAny', ConsultationRecords::class);

        $consultationRecordes = ConsultationRecords::all();

        return ConsultationResource::collection($consultationRecordes)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultationRequest $request)
    {
        //
        $this->authorize('create', ConsultationRecords::class);

        $validate = $request->validated();

        $consultationRecords = ConsultationRecords::create([
            'appointment_id' => $validate['appointment_id'],
            'tenant_id' => $validate['tenant_id'],
            'row_notes' => $validate['row_notes'],
            'soap_subjective' => $validate['soap_subjective'],
            'soap_objective' => $validate['soap_objective'],
            'soap_assessment' => $validate['soap_assessment'],
            'soap_plan' => $validate['soap_plan'],
        ]);

        return (new ConsultationResource($consultationRecords))->response();
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

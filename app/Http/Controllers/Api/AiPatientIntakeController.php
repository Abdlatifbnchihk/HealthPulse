<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AiPatientIntakeResource;
use App\Models\AiPatientIntake;
use App\Http\Requests\StoreAiPatientIntakeControllerRequest;
use App\Http\Requests\UpdateAiPatientIntakeControllerRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AiPatientIntakeController
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('viewAny', AiPatientIntake::class);

        $aiPatientIntake = AiPatientIntake::all();

        return AiPatientIntakeResource::collection($aiPatientIntake)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAiPatientIntakeControllerRequest $request)
    {
        //
        $this->authorize('create', AiPatientIntake::class);

        $validate = $request->validated();

        $aiPatientIntake = AiPatientIntake::create([
            'appointment_id' => $validate['appointment_id'],
            'tenant_id' => $validate['tenant_id'],
            'row_symptoms' => $validate['row_symptoms'],
            'ai_summary' => $validate['ai_summary'],
            'urgency' => $validate['urgency'],
        ]);

        return (new AiPatientIntakeResource($aiPatientIntake))->response();
    }

    /**
     * Display the specified resource.
     */
    public function show(AiPatientIntake $aiPatientIntake)
    {
        //
        $this->authorize('view', $aiPatientIntake);

        return (new AiPatientIntakeResource($aiPatientIntake))->response();
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAiPatientIntakeControllerRequest $request, AiPatientIntake $aiPatientIntake)
    {
        //
        $this->authorize('update', $aiPatientIntake);

        $validate = $request->validated();

        $aiPatientIntake->update($validate);

        return (new AiPatientIntakeResource($aiPatientIntake->refresh()))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AiPatientIntake $aiPatientIntake)
    {
        //
        $this->authorize('delete', $aiPatientIntake);

        $aiPatientIntake->delete();

        return response()->json(['Message' => 'Ai patient in take has been deleted successfully']);
    }
}

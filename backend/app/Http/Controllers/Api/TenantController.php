<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TenantRequest;
use App\Http\Requests\TenantUpdateRequest;
use App\Http\Resources\TenantResourse;
use App\Models\Tenants;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TenantController
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('viewAny', Tenants::class);

        $tenants = Tenants::all();

        return TenantResourse::collection($tenants)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TenantRequest $request)
    {
        //
        $this->authorize('create', Tenants::class);

        $validate = $request->validated();

        $tenant = Tenants::create([
            'name' => $validate['name'],
            'slug' => $validate['slug'],
            'subscription_status' => $validate['subscription_status'],
            'trial_ends_at' => $validate['trial_ends_at'],
        ]); 

        // add TenantRequest file 

        return (new TenantResourse($tenant))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tenants $tenant)
    {
        //
        $this->authorize('view', $tenant);

        return (new TenantResourse($tenant))->response();
        // TenantResourse::collection($tenants)->response();
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(TenantUpdateRequest $request, Tenants $tenant)
    {
        //
        $this->authorize('update', $tenant);

        $data = $request->validated();

        $tenant->update($data);

        return (new TenantResourse($tenant))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenants $tenants)
    {
        //
        $this->authorize('delete', $tenants);

        $tenants->delete();

        return response()->json(['message' => 'Tenant has been deleted successfully']);
    }
}

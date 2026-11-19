<?php

namespace App\Http\Controllers\Api;

use App\Enum\RegisterUserRolesEnums;
use App\Http\Resources\DoctorDirectoryResource;
use App\Http\Resources\DoctorProfileResource;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use App\Models\Tenants;
use App\Http\Requests\StoreDoctorProfileRequest;
use App\Http\Requests\UpdateDoctorProfileRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Services\SlotGenerator;
use Carbon\Carbon;

class DoctorProfileControlle
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeDirectoryAccess($request);

        $this->authorize('viewAny', DoctorProfile::class);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'clinic_id' => ['nullable', 'integer', 'exists:tenants,id'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $doctorProfiles = DoctorProfile::query()
            ->whereHas(
                'user',
                fn (Builder $query) => $query->where('role', RegisterUserRolesEnums::Doctor->value),
            );
        $query = (clone $doctorProfiles)->with(['user', 'tenants']);

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function (Builder $query) use ($search) {
                $query->where('specialty', 'like', "%{$search}%")
                    ->orWhereHas(
                        'user',
                        fn (Builder $userQuery) => $userQuery->where('name', 'like', "%{$search}%"),
                    )
                    ->orWhereHas(
                        'tenants',
                        fn (Builder $tenantQuery) => $tenantQuery->where('name', 'like', "%{$search}%"),
                    );
            });
        }

        if (! empty($validated['specialty'])) {
            $query->where('specialty', $validated['specialty']);
        }

        if (! empty($validated['clinic_id'])) {
            $query->where('tenant_id', $validated['clinic_id']);
        }

        $profiles = $query
            ->orderBy('specialty')
            ->orderBy('id')
            ->paginate(12)
            ->withQueryString();

        $specialties = (clone $doctorProfiles)
            ->whereNotNull('specialty')
            ->distinct()
            ->orderBy('specialty')
            ->pluck('specialty')
            ->values();
        $clinics = Tenants::query()
            ->whereIn('id', (clone $doctorProfiles)->select('tenant_id'))
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Tenants $tenant) => ['id' => $tenant->id, 'name' => $tenant->name])
            ->values();

        return response()->json([
            'data' => $profiles->getCollection()
                ->map(fn (DoctorProfile $profile) => (new DoctorDirectoryResource($profile))->resolve($request))
                ->all(),
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'last_page' => $profiles->lastPage(),
                'total' => $profiles->total(),
                'specialties' => $specialties,
                'clinics' => $clinics,
            ],
        ]);
    }

    public function showDirectory(Request $request, DoctorProfile $doctorProfile): JsonResponse
    {
        $this->authorizeDirectoryAccess($request);

        $doctorProfile->load([
            'user',
            'tenants',
            'schedules' => fn (HasMany $query) => $query
                ->where('is_active', true)
                ->orderBy('day_of_week')
                ->orderBy('start_time'),
        ]);
        abort_unless(
            $doctorProfile->user?->role === RegisterUserRolesEnums::Doctor,
            404,
            'Doctor profile not found.',
        );

        return response()->json([
            'data' => (new DoctorDirectoryResource($doctorProfile))->resolve($request),
        ]);
    }

    public function availability(
        Request $request,
        DoctorProfile $doctorProfile,
        SlotGenerator $slotGenerator,
    ): JsonResponse {
        $this->authorizeDirectoryAccess($request);
        abort_unless(
            $doctorProfile->user()->where('role', RegisterUserRolesEnums::Doctor->value)->exists(),
            404,
            'Doctor profile not found.',
        );

        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
        ]);
        $date = Carbon::createFromFormat('Y-m-d', $validated['date'], config('app.timezone'));
        $schedule = DoctorSchedules::query()
            ->where('doctor_profile_id', $doctorProfile->id)
            ->where('day_of_week', $date->dayOfWeekIso)
            ->where('is_active', true)
            ->first();

        return response()->json([
            'data' => [
                'date' => $date->toDateString(),
                'has_schedule' => $schedule !== null,
                'slots' => $slotGenerator->generateForDoctor($doctorProfile->id, $date),
            ],
        ]);
    }

    private function authorizeDirectoryAccess(Request $request): void
    {
        abort_unless(
            in_array(
                $request->user()->role,
                [RegisterUserRolesEnums::Patient, RegisterUserRolesEnums::Doctor],
                true,
            ),
            403,
            'Only patient and doctor accounts can browse the doctor directory.',
        );
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

<?php

namespace Tests\Feature;

use App\Enum\RegisterUserRolesEnums;
use App\Models\Appointments;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use App\Models\Tenants;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DoctorDirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_browse_and_filter_doctors_across_clinics(): void
    {
        $firstClinic = Tenants::factory()->create(['subscription_status' => 'active']);
        $secondClinic = Tenants::factory()->create(['subscription_status' => 'active']);
        $firstDoctor = User::factory()->create([
            'name' => 'Alex Morgan',
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $firstClinic->id,
        ]);
        $secondDoctor = User::factory()->create([
            'name' => 'Jordan Lee',
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $secondClinic->id,
        ]);

        DoctorProfile::query()->create([
            'user_id' => $firstDoctor->id,
            'tenant_id' => $firstClinic->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);
        DoctorProfile::query()->create([
            'user_id' => $secondDoctor->id,
            'tenant_id' => $secondClinic->id,
            'specialty' => 'Dermatology',
            'fee' => 90,
            'slot_duration' => 20,
        ]);

        Sanctum::actingAs(User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]));

        $this->getJson('/api/v1/doctor-directory?search=cardio&clinic_id='.$firstClinic->id)
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Alex Morgan')
            ->assertJsonPath('data.0.specialty', 'Cardiology')
            ->assertJsonPath('data.0.clinic', $firstClinic->name)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonFragment([
                'id' => $secondClinic->id,
                'name' => $secondClinic->name,
            ]);
    }

    public function test_doctor_can_browse_directory_but_other_roles_cannot(): void
    {
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
        ]);
        Sanctum::actingAs($doctor);

        $this->getJson('/api/v1/doctor-directory')->assertOk();

        Sanctum::actingAs(User::factory()->create([
            'role' => RegisterUserRolesEnums::Super_admin,
        ]));

        $this->getJson('/api/v1/doctor-directory')->assertForbidden();
    }

    public function test_patient_can_open_a_doctor_profile_and_view_availability(): void
    {
        $clinic = Tenants::factory()->create(['subscription_status' => 'active']);
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        $doctor = User::factory()->create([
            'name' => 'Alex Morgan',
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $clinic->id,
        ]);
        $profile = DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'tenant_id' => $clinic->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);
        $date = Carbon::tomorrow();

        DoctorSchedules::query()->create([
            'doctor_profile_id' => $profile->id,
            'tenant_id' => $clinic->id,
            'day_of_week' => $date->dayOfWeekIso,
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'slot_duration_minutes' => '30',
            'is_active' => true,
        ]);
        Appointments::query()->create([
            'tenant_id' => $clinic->id,
            'patient_id' => $patient->id,
            'doctor_profile_id' => $profile->id,
            'appointment_date' => $date->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '09:30:00',
            'status' => 'confirmed',
        ]);

        Sanctum::actingAs($patient);

        $this->getJson('/api/v1/doctor-directory/'.$profile->id)
            ->assertOk()
            ->assertJsonPath('data.name', 'Alex Morgan')
            ->assertJsonPath('data.clinic', $clinic->name)
            ->assertJsonPath('data.is_own_profile', false);

        $this->getJson('/api/v1/doctor-directory/'.$profile->id.'/availability?date='.$date->toDateString())
            ->assertOk()
            ->assertJsonPath('data.slots.0.start', '09:00')
            ->assertJsonPath('data.slots.0.available', false)
            ->assertJsonPath('data.slots.1.start', '09:30')
            ->assertJsonPath('data.slots.1.available', true);
    }
}

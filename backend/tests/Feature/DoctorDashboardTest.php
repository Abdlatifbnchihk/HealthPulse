<?php

namespace Tests\Feature;

use App\Enum\RegisterUserRolesEnums;
use App\Models\Appointments;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use App\Models\Tenants;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DoctorDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_dashboard_returns_only_the_authenticated_doctors_data(): void
    {
        $tenant = Tenants::factory()->create();
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $otherDoctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);

        $doctorProfile = DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);
        $otherDoctorProfile = DoctorProfile::query()->create([
            'user_id' => $otherDoctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Dermatology',
            'fee' => 90,
            'slot_duration' => 20,
        ]);

        $schedule = DoctorSchedules::query()->create([
            'doctor_profile_id' => $doctorProfile->id,
            'tenant_id' => $tenant->id,
            'day_of_week' => 1,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'slot_duration_minutes' => '30',
            'is_active' => true,
        ]);
        DoctorSchedules::query()->create([
            'doctor_profile_id' => $otherDoctorProfile->id,
            'tenant_id' => $tenant->id,
            'day_of_week' => 2,
            'start_time' => '10:00:00',
            'end_time' => '16:00:00',
            'slot_duration_minutes' => '20',
            'is_active' => true,
        ]);

        $appointment = Appointments::query()->create([
            'tenant_id' => $tenant->id,
            'patient_id' => $patient->id,
            'doctor_profile_id' => $doctorProfile->id,
            'appointment_date' => now()->addDay(),
            'start_time' => '09:00:00',
            'end_time' => '09:30:00',
            'status' => 'pending',
            'notes' => 'Patient follow-up',
        ]);
        Appointments::query()->create([
            'tenant_id' => $tenant->id,
            'patient_id' => $patient->id,
            'doctor_profile_id' => $otherDoctorProfile->id,
            'appointment_date' => now()->addDays(2),
            'start_time' => '10:00:00',
            'end_time' => '10:20:00',
            'status' => 'pending',
            'notes' => 'Other doctor appointment',
        ]);

        Sanctum::actingAs($doctor);

        $this->getJson('/api/v1/doctor/dashboard')
            ->assertOk()
            ->assertJsonPath('data.doctor.id', $doctor->id)
            ->assertJsonPath('data.doctor.profile.id', $doctorProfile->id)
            ->assertJsonPath('data.schedules.0.id', $schedule->id)
            ->assertJsonCount(1, 'data.schedules')
            ->assertJsonPath('data.appointments.0.id', $appointment->id)
            ->assertJsonPath('data.appointments.0.patient.name', $patient->name)
            ->assertJsonCount(1, 'data.appointments');
    }

    public function test_non_doctor_cannot_access_the_doctor_dashboard(): void
    {
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        Sanctum::actingAs($patient);

        $this->getJson('/api/v1/doctor/dashboard')
            ->assertForbidden();
    }

    public function test_doctor_can_create_and_deactivate_their_weekly_schedule(): void
    {
        $tenant = Tenants::factory()->create();
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $profile = DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);

        Sanctum::actingAs($doctor);

        $response = $this->postJson('/api/v1/doctor-schedules', [
            'doctor_profile_id' => $profile->id,
            'tenant_id' => $tenant->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30,
            'is_active' => true,
        ]);

        $response->assertOk();
        $scheduleId = $response->json('data.id');
        $this->assertNotNull($scheduleId);
        $this->assertDatabaseHas('doctor_schedules', [
            'id' => $scheduleId,
            'doctor_profile_id' => $profile->id,
            'day_of_week' => 1,
            'is_active' => true,
        ]);

        $this->patchJson('/api/v1/doctor-schedules/'.$scheduleId, [
            'is_active' => false,
        ])->assertOk();

        $this->assertDatabaseHas('doctor_schedules', [
            'id' => $scheduleId,
            'is_active' => false,
        ]);
    }

    public function test_doctor_cannot_create_a_schedule_for_another_doctor(): void
    {
        $tenant = Tenants::factory()->create();
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $otherDoctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $otherProfile = DoctorProfile::query()->create([
            'user_id' => $otherDoctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Dermatology',
            'fee' => 90,
            'slot_duration' => 20,
        ]);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/v1/doctor-schedules', [
            'doctor_profile_id' => $otherProfile->id,
            'tenant_id' => $tenant->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30,
            'is_active' => true,
        ])->assertForbidden();
    }
}

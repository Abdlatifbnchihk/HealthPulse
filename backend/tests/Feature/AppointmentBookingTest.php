<?php

namespace Tests\Feature;

use App\Enum\RegisterUserRolesEnums;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use App\Models\Tenants;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_book_their_own_appointment_for_a_doctor(): void
    {
        $tenant = Tenants::factory()->create();
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $doctorProfile = DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);
        $appointmentDate = Carbon::now()->next(Carbon::MONDAY);
        DoctorSchedules::query()->create([
            'doctor_profile_id' => $doctorProfile->id,
            'tenant_id' => $tenant->id,
            'day_of_week' => $appointmentDate->dayOfWeekIso,
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'slot_duration_minutes' => '30',
            'is_active' => true,
        ]);

        Sanctum::actingAs($patient);

        $response = $this->postJson('/api/v1/appointments', [
            'doctor_profile_id' => $doctorProfile->id,
            'appointment_date' => $appointmentDate->toDateString(),
            'start_time' => '09:00',
            'end_time' => '09:30',
            'notes' => 'Follow-up consultation',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.patient_id', $patient->id)
            ->assertJsonPath('data.tenant_id', $tenant->id)
            ->assertJsonPath('data.doctor.name', $doctor->name);

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'doctor_profile_id' => $doctorProfile->id,
            'tenant_id' => $tenant->id,
            'status' => 'confirmed',
            'notes' => 'Follow-up consultation',
        ]);

        Sanctum::actingAs($doctor);
        $this->getJson('/api/v1/doctor/dashboard')
            ->assertOk()
            ->assertJsonCount(1, 'data.appointments')
            ->assertJsonPath('data.appointments.0.patient.name', $patient->name);
    }

    public function test_patient_cannot_book_for_another_patient(): void
    {
        $tenant = Tenants::factory()->create();
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        $otherPatient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
            'tenant_id' => $tenant->id,
        ]);
        $doctorProfile = DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);

        Sanctum::actingAs($patient);

        $this->postJson('/api/v1/appointments', [
            'patient_id' => $otherPatient->id,
            'doctor_profile_id' => $doctorProfile->id,
            'appointment_date' => Carbon::now()->next(Carbon::MONDAY)->toDateString(),
            'start_time' => '09:00',
            'end_time' => '09:30',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('patient_id');

        $this->assertDatabaseCount('appointments', 0);
    }

    public function test_doctor_cannot_create_an_appointment(): void
    {
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
        ]);

        Sanctum::actingAs($doctor);

        $this->postJson('/api/v1/appointments', [])
            ->assertForbidden();
    }
}

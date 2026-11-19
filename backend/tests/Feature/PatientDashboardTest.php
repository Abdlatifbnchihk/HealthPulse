<?php

namespace Tests\Feature;

use App\Enum\RegisterUserRolesEnums;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PatientDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_load_dashboard_collections(): void
    {
        $patient = User::factory()->create([
            'role' => RegisterUserRolesEnums::Patient,
        ]);
        Sanctum::actingAs($patient);

        $this->getJson('/api/v1/patient/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'appointments',
                    'ai_intakes',
                    'consultation_records',
                ],
            ])
            ->assertJsonPath('data.appointments', [])
            ->assertJsonPath('data.ai_intakes', [])
            ->assertJsonPath('data.consultation_records', []);
    }

    public function test_non_patient_cannot_load_patient_dashboard(): void
    {
        $doctor = User::factory()->create([
            'role' => RegisterUserRolesEnums::Doctor,
        ]);
        Sanctum::actingAs($doctor);

        $this->getJson('/api/v1/patient/dashboard')
            ->assertForbidden();
    }
}

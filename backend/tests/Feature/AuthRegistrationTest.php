<?php

namespace Tests\Feature;

use App\Enum\RegisterUserRolesEnums;
use App\Models\Tenants;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_register_without_a_tenant(): void
    {
        $response = $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => 'patient',
        ]));

        $response
            ->assertCreated()
            ->assertJsonPath('user.role', 'patient')
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', [
            'email' => 'new-user@example.com',
            'tenant_id' => null,
            'role' => 'patient',
        ]);
        $this->assertDatabaseMissing('doctor_profiles', [
            'user_id' => $response->json('user.id'),
        ]);
    }

    public function test_doctor_registration_requires_an_existing_tenant(): void
    {
        $tenant = Tenants::factory()->create();

        $response = $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => 'doctor',
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]));

        $response
            ->assertCreated()
            ->assertJsonPath('user.role', 'doctor')
            ->assertJsonPath('doctor_profile.specialty', 'Cardiology')
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', [
            'email' => 'new-user@example.com',
            'tenant_id' => $tenant->id,
            'role' => 'doctor',
        ]);
        $this->assertDatabaseHas('doctor_profiles', [
            'user_id' => $response->json('user.id'),
            'tenant_id' => $tenant->id,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]);
    }

    public function test_doctor_registration_rejects_a_missing_or_invalid_tenant(): void
    {
        $missingTenantResponse = $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => 'doctor',
        ]));
        $missingTenantResponse->assertUnprocessable()->assertJsonValidationErrors('tenant_id');

        $invalidTenantResponse = $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => 'doctor',
            'tenant_id' => 999999,
            'specialty' => 'Cardiology',
            'fee' => 120,
            'slot_duration' => 30,
        ]));
        $invalidTenantResponse->assertUnprocessable()->assertJsonValidationErrors('tenant_id');

        $tenant = Tenants::factory()->create();
        $missingProfileDetailsResponse = $this->postJson(
            '/api/v1/auth/register',
            $this->registrationData([
                'role' => 'doctor',
                'tenant_id' => $tenant->id,
            ]),
        );
        $missingProfileDetailsResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['specialty', 'fee', 'slot_duration']);
        $this->assertDatabaseMissing('users', ['email' => 'new-user@example.com']);
    }

    public function test_patient_registration_rejects_a_tenant_id(): void
    {
        $tenant = Tenants::factory()->create();

        $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => 'patient',
            'tenant_id' => $tenant->id,
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('tenant_id');
    }

    public function test_public_registration_rejects_super_admin_role(): void
    {
        $this->postJson('/api/v1/auth/register', $this->registrationData([
            'role' => RegisterUserRolesEnums::Super_admin->value,
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('role');
    }

    private function registrationData(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Casey',
            'last_name' => 'Example',
            'email' => 'new-user@example.com',
            'phone' => '+15550192834',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'patient',
        ], $overrides);
    }
}

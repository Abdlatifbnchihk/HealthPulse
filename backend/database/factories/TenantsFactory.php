<?php

namespace Database\Factories;

use App\Models\Tenants;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tenants>
 */
class TenantsFactory extends Factory
{
    protected $model = Tenants::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'subscription_status' => $this->faker->randomElement([
                'trialing',
                'active',
                'past_due',
                'canceled',
            ]),
            'trial_ends_at' => $this->faker->optional()->dateTimeBetween('now', '+30 days'),
        ];
    }
}

<?php

namespace Tests\Feature;

use App\Jobs\ProcessAiIntake;
use App\Models\AiPatientIntake;
use App\Services\AiIntakeService;
use Mockery;
use Tests\TestCase;

class ProcessAiIntakeTest extends TestCase
{
    public function test_it_analyzes_the_intake_symptoms_and_saves_the_result(): void
    {
        $analysis = [
            'ai_summary' => 'The patient reports a mild headache.',
            'urgency' => 'low',
        ];

        $intake = Mockery::mock(new AiPatientIntake([
            'row_symptoms' => 'Mild headache',
        ]));
        $intake->shouldReceive('update')
            ->once()
            ->with($analysis);

        $aiIntakeService = Mockery::mock(AiIntakeService::class);
        $aiIntakeService->shouldReceive('analyzeSymptoms')
            ->once()
            ->with('Mild headache')
            ->andReturn($analysis);

        (new ProcessAiIntake($intake))->handle($aiIntakeService);
    }
}

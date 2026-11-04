<?php

namespace Tests\Feature;

use App\Ai\Agents\AiIntakeAgent;
use App\Services\AiIntakeService;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Tests\TestCase;

class AiIntakeServiceTest extends TestCase
{
    public function test_it_generates_a_summary_and_urgency(): void
    {
        AiIntakeAgent::fake([
            [
                'ai_summary' => 'The patient reports a mild headache.',
                'urgency' => 'low',
            ],
        ]);

        $analysis = app(AiIntakeService::class)->analyzeSymptoms('  Mild headache  ');

        $this->assertSame([
            'ai_summary' => 'The patient reports a mild headache.',
            'urgency' => 'low',
        ], $analysis);
        AiIntakeAgent::assertPrompted('Mild headache');
    }

    public function test_it_rejects_empty_symptoms(): void
    {
        $this->expectException(InvalidArgumentException::class);

        app(AiIntakeService::class)->analyzeSymptoms('   ');
    }

    public function test_it_rejects_an_invalid_ai_urgency(): void
    {
        AiIntakeAgent::fake([
            [
                'ai_summary' => 'The patient reports a headache.',
                'urgency' => 'unknown',
            ],
        ]);

        $this->expectException(ValidationException::class);

        app(AiIntakeService::class)->analyzeSymptoms('Headache');
    }
}

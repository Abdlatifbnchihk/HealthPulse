<?php

namespace App\Services;

use App\Ai\Agents\AiIntakeAgent;
use App\Enum\AiPatientIntakeStatus;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use InvalidArgumentException;
use Laravel\Ai\Responses\StructuredAgentResponse;
use UnexpectedValueException;

class AiIntakeService
{
    /**
     * @return array{ai_summary: string, urgency: string}
     */
    public function analyzeSymptoms(string $symptoms): array
    {
        $symptoms = trim($symptoms);

        if ($symptoms === '') {
            throw new InvalidArgumentException('Symptoms are required to create an AI patient intake.');
        }

        $response = AiIntakeAgent::make()->prompt($symptoms, provider: 'groq');

        if (! $response instanceof StructuredAgentResponse) {
            throw new UnexpectedValueException('The AI intake agent did not return structured output.');
        }

        return Validator::make($response->toArray(), [
            'ai_summary' => ['required', 'string', 'max:2000'],
            'urgency' => ['required', Rule::enum(AiPatientIntakeStatus::class)],
        ])->validate();
    }
}

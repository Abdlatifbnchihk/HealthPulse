<?php

namespace App\Services;

use App\Ai\Agents\ConsultationSoapAgent;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use Laravel\Ai\Responses\StructuredAgentResponse;
use UnexpectedValueException;

class ConsultationRecordsService
{
    /**
     * Parse raw doctor notes into structured SOAP data using Groq AI.
     *
     * @return array{soap_subjective: string, soap_objective: string, soap_assessment: string, soap_plan: string}
     */
    public function generateSoapNote(string $rawNotes): array
    {
        $rawNotes = trim($rawNotes);

        if ($rawNotes === '') {
            throw new InvalidArgumentException('Consultation notes are required to generate a SOAP note.');
        }

        $response = ConsultationSoapAgent::make()->prompt($rawNotes, provider: 'groq');

        if (! $response instanceof StructuredAgentResponse) {
            throw new UnexpectedValueException('The SOAP note agent did not return structured output.');
        }

        return Validator::make($response->toArray(), [
            'soap_subjective' => ['required', 'string'],
            'soap_objective' => ['required', 'string'],
            'soap_assessment' => ['required', 'string'],
            'soap_plan' => ['required', 'string'],
        ])->validate();
    }
}
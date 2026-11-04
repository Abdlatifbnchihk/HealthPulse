<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

class AiIntakeAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): string
    {
        return <<<'INSTRUCTIONS'
        You help prepare patient intake notes for review by a qualified clinician.
        Summarize only the symptoms the patient reports. Do not diagnose, recommend treatment,
        or invent facts. Assign an urgency level: low for mild and stable symptoms, medium
        when timely clinical review is appropriate, high for severe or worsening symptoms
        that need urgent review, and critical when symptoms may indicate an immediate
        life-threatening emergency. When uncertain, favor prompt clinical review.
        This assessment is not a diagnosis and must not replace professional medical care.
        INSTRUCTIONS;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'ai_summary' => $schema->string()
                ->description('A concise, factual, non-diagnostic summary of the reported symptoms.'),
            'urgency' => $schema->string()
                ->enum(['low', 'medium', 'high', 'critical'])
                ->description('The suggested urgency level for clinician review.'),
        ];
    }
}

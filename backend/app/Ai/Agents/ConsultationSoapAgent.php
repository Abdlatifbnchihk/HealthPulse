<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

class ConsultationSoapAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): string
    {
        return <<<'INSTRUCTIONS'
        Organize the clinician's consultation notes into the four SOAP sections.
        Use only facts and clinical judgments explicitly stated in the notes. Do not
        infer symptoms, examination findings, diagnoses, treatments, or follow-up plans.
        If a section is not documented, return "Not documented". This is documentation
        assistance, not a substitute for clinical judgment.
        INSTRUCTIONS;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'soap_subjective' => $schema->string()
                ->description('Patient-reported symptoms, history, and concerns from the notes.'),
            'soap_objective' => $schema->string()
                ->description('Examination findings, vitals, and test results stated in the notes.'),
            'soap_assessment' => $schema->string()
                ->description('The clinician-stated assessment or diagnosis from the notes.'),
            'soap_plan' => $schema->string()
                ->description('The clinician-stated treatment and follow-up plan from the notes.'),
        ];
    }
}

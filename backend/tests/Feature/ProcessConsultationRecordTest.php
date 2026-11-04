<?php

namespace Tests\Feature;

use App\Jobs\ProcessConsultationRecord;
use App\Models\ConsultationRecords;
use App\Services\ConsultationRecordsService;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class ProcessConsultationRecordTest extends TestCase
{
    public function test_it_generates_and_saves_the_soap_note(): void
    {
        $soapNote = [
            'soap_subjective' => 'Patient reports a headache.',
            'soap_objective' => 'Vitals are stable.',
            'soap_assessment' => 'Headache.',
            'soap_plan' => 'Follow up as needed.',
        ];

        $consultationRecord = Mockery::mock(new ConsultationRecords([
            'row_notes' => 'Headache; stable vitals; follow up as needed.',
        ]));
        $consultationRecord->shouldReceive('update')
            ->once()
            ->with(['soap_status' => 'processing']);
        $consultationRecord->shouldReceive('update')
            ->once()
            ->with([...$soapNote, 'soap_status' => 'completed']);

        $service = Mockery::mock(ConsultationRecordsService::class);
        $service->shouldReceive('generateSoapNote')
            ->once()
            ->with('Headache; stable vitals; follow up as needed.')
            ->andReturn($soapNote);

        (new ProcessConsultationRecord($consultationRecord))->handle($service);
    }

    public function test_it_marks_the_record_failed_after_all_attempts_fail(): void
    {
        $consultationRecord = Mockery::mock(new ConsultationRecords());
        $consultationRecord->shouldReceive('update')
            ->once()
            ->with(['soap_status' => 'failed']);

        (new ProcessConsultationRecord($consultationRecord))->failed(
            new RuntimeException('AI provider unavailable.')
        );
    }
}

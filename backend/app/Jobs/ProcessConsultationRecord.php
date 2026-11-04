<?php

namespace App\Jobs;

use App\Models\ConsultationRecords;
use App\Services\ConsultationRecordsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessConsultationRecord implements ShouldQueue
{
    use Queueable;

    public ConsultationRecords $consultationRecord;

    public int $tries = 3;

    public int $backoff = 10;

    public function __construct(ConsultationRecords $consultationRecord)
    {
        $this->consultationRecord = $consultationRecord;
    }

    public function handle(ConsultationRecordsService $consultationRecordsService): void
    {
        $this->consultationRecord->update(['soap_status' => 'processing']);

        $soapNote = $consultationRecordsService->generateSoapNote(
            $this->consultationRecord->row_notes
        );

        $this->consultationRecord->update([
            ...$soapNote,
            'soap_status' => 'completed',
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        $this->consultationRecord->update(['soap_status' => 'failed']);

        Log::error("Failed to generate SOAP note for consultation record {$this->consultationRecord->id}.", [
            'exception' => $exception,
        ]);
    }
}

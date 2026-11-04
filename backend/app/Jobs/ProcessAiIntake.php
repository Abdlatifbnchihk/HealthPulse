<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\AiPatientIntake;
use App\Services\AiIntakeService;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessAiIntake implements ShouldQueue
{
    use Queueable;

    public AiPatientIntake $intake;
    public int $tries = 3;
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(AiPatientIntake $intake)
    {
        //
        $this->intake = $intake;
    }

    /**
     * Execute the job.
     */
    public function handle(AiIntakeService $aiService): void
    {
        $analysis = $aiService->analyzeSymptoms($this->intake->row_symptoms);

        $this->intake->update($analysis);
    }

    /**
     * Log the final failure after the queue has exhausted its retries.
     */
    public function failed(?Throwable $exception): void
    {
        Log::error("Failed to process AI intake ID {$this->intake->id}.", [
            'exception' => $exception,
        ]);
    }
}

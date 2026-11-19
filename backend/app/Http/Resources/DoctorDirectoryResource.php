<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorDirectoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user?->name,
            'specialty' => $this->specialty,
            'fee' => $this->fee,
            'slot_duration' => $this->slot_duration,
            'clinic' => $this->tenants?->name,
            'is_own_profile' => $this->user_id === $request->user()?->id,
            'weekly_schedule' => $this->whenLoaded(
                'schedules',
                fn () => $this->schedules
                    ->where('is_active', true)
                    ->map(fn ($schedule) => [
                        'day_of_week' => (int) $schedule->day_of_week,
                        'start_time' => substr($schedule->start_time, 0, 5),
                        'end_time' => substr($schedule->end_time, 0, 5),
                    ])
                    ->values(),
            ),
        ];
    }
}

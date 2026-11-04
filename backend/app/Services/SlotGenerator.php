<?php

namespace App\Services;

use App\Enum\AppointmentsStatus;
use App\Models\Appointments;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedules;
use Carbon\Carbon;
use RuntimeException;

class SlotGenerator
{
    /**
     * Generate available and booked time slots for a specific doctor on a specific date.
     */
    public function generateForDoctor(int $doctorId, Carbon $date): array
    {
        // 1. Convert Carbon date to ISO numeric day (1 = Monday, 7 = Sunday)
        $dayOfWeek = $date->dayOfWeekIso;

        // 2. Find the doctor's schedule rule for this specific day of the week
        $schedule = DoctorSchedules::where('doctor_profile_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->first();

        // If the doctor doesn't work on this day, return an empty array
        if (! $schedule) {
            return [];
        }

        // 3. Get the doctor's profile to know slot duration (fallback to 30 mins if not set)
        $profile = DoctorProfile::findOrFail($doctorId);
        $durationMinutes = (int) ($schedule->slot_duration_minutes ?: $profile->slot_duration ?: 30);
        if ($durationMinutes < 1) {
            throw new RuntimeException('The doctor schedule must have a positive slot duration.');
        }

        // 4. Parse start and end times using the target date and app timezone
        $currentTime = Carbon::parse($date->toDateString().' '.$schedule->start_time, config('app.timezone'));
        $endTime = Carbon::parse($date->toDateString().' '.$schedule->end_time, config('app.timezone'));

        // 5. Fetch existing active appointments for this doctor on this date to check for conflicts
        $bookedAppointments = Appointments::where('doctor_profile_id', $doctorId)
            ->whereDate('appointment_date', $date->toDateString())
            ->where('status', '!=', AppointmentsStatus::Canceled->value)
            ->get();

        $slots = [];

        // 6. Loop through time intervals and generate slots
        while ($currentTime->copy()->addMinutes($durationMinutes)->lessThanOrEqualTo($endTime)) {
            $slotStart = $currentTime->copy();
            $slotEnd = $currentTime->copy()->addMinutes($durationMinutes);

            // 7. Check if this generated slot overlaps with any booked appointment
            $isBooked = $bookedAppointments->contains(function ($appointment) use ($slotStart, $slotEnd) {
                $appointmentDate = Carbon::parse($appointment->appointment_date, config('app.timezone'))
                    ->toDateString();
                $appStart = Carbon::parse($appointmentDate.' '.$appointment->start_time, config('app.timezone'));
                $appEnd = Carbon::parse($appointmentDate.' '.$appointment->end_time, config('app.timezone'));

                // Overlap condition: (StartA < EndB) AND (EndA > StartB)
                return $slotStart->lt($appEnd) && $slotEnd->gt($appStart);
            });

            // 8. Build the slot object
            $slots[] = [
                'start' => $slotStart->format('H:i'),
                'end' => $slotEnd->format('H:i'),
                'available' => ! $isBooked,
            ];

            // Move forward to the next slot block
            $currentTime->addMinutes($durationMinutes);
        }

        return $slots;
    }
}

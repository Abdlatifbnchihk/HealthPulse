<?php

namespace App\Services;

use App\Enum\AppointmentsStatus;
use App\Models\Appointments;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class BookingService
{
    protected SlotGenerator $slotGenerator;

    public function __construct(SlotGenerator $slotGenerator)
    {
        $this->slotGenerator = $slotGenerator;
    }

    /**
     * Book an appointment while preventing overlapping bookings for the doctor.
     */
    public function bookAppointment(array $data): Appointments
    {
        foreach (['doctor_profile_id', 'appointment_date', 'start_time', 'end_time'] as $key) {
            if (! isset($data[$key])) {
                throw new InvalidArgumentException("Missing required booking field: {$key}");
            }
        }

        $doctorId = (int) $data['doctor_profile_id'];
        $date = Carbon::parse($data['appointment_date'])->toDateString();
        $startTime = Carbon::parse($data['start_time'])->format('H:i');
        $endTime = Carbon::parse($data['end_time'])->format('H:i');

        if ($doctorId < 1 || $endTime <= $startTime) {
            throw new InvalidArgumentException('The doctor and appointment time range must be valid.');
        }

        // A doctor/date lock serializes requests even when their requested times overlap only partially.
        $lock = Cache::lock("booking_lock_{$doctorId}_{$date}", 10);

        if (! $lock->get()) {
            throw new RuntimeException("This doctor's schedule is currently being booked. Please try again.");
        }

        try {
            return DB::transaction(function () use ($doctorId, $date, $startTime, $endTime, $data) {
                $slots = $this->slotGenerator->generateForDoctor(
                    $doctorId,
                    Carbon::parse($date, config('app.timezone'))
                );

                $slotIsAvailable = collect($slots)->contains(
                    fn (array $slot): bool => $slot['start'] === $startTime
                        && $slot['end'] === $endTime
                        && $slot['available']
                );

                if (! $slotIsAvailable) {
                    throw new RuntimeException('The requested time is not an available slot for this doctor.');
                }

                $hasCollision = Appointments::where('doctor_profile_id', $doctorId)
                    ->whereDate('appointment_date', $date)
                    ->where('status', '!=', AppointmentsStatus::Canceled->value)
                    ->where(function ($query) use ($startTime, $endTime) {
                        $query->where('start_time', '<', $endTime)
                            ->where('end_time', '>', $startTime);
                    })
                    ->exists();

                if ($hasCollision) {
                    throw new RuntimeException('This time slot has already been booked.');
                }

                $user = auth()->user();
                $tenantId = $data['tenant_id'] ?? $user?->tenant_id;
                $patientId = $data['patient_id'] ?? $user?->getAuthIdentifier();

                if ($tenantId === null || $patientId === null) {
                    throw new InvalidArgumentException('Tenant and patient IDs are required to book an appointment.');
                }

                return Appointments::create([
                    'tenant_id' => $tenantId,
                    'doctor_profile_id' => $doctorId,
                    'patient_id' => $patientId,
                    'appointment_date' => $date,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => AppointmentsStatus::Confirmed,
                ]);
            });
        } finally {
            $lock->release();
        }
    }
}

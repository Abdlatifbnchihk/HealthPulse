<?php

namespace App\Enum;

enum AppointmentsStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Canceled = 'canceled';
}

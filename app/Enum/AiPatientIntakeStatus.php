<?php

namespace App\Enum;

enum AiPatientIntakeStatus
{
    //
    case Low = 'low';
    case Medium = 'medium';
    case Hight = 'high';
    case Critical = 'critical';
}

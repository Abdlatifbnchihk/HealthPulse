<?php

namespace App\Enum;

enum AiPatientIntakeStatus: string
{
    //
    case Low = 'low';
    case Medium = 'medium';
    case Hight = 'high';
    case Critical = 'critical';
}

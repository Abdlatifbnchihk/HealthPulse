<?php

namespace App\Enum;

enum RegisterUserRolesEnums: string
{
    //
    case Super_admin = 'super_admin';
    case Doctor = 'doctor';
    case Patient = 'patient';
}

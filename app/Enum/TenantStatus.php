<?php

namespace App;

enum TenantStatus: string 
{
    //
    case Trailing = 'trailing';
    case Active = 'active';
    case Past_due = 'past_due';
    case Canceled = 'canceled';
}

<?php


use App\Models\Tenants;

if(! function_exists('tenant')){


    function tenant(): ?Tenants 
    {
        return app()->bound('tenant') ? app('tenant') : null;
    }
}

if(! function_exists('tenant_id')){


    function tenant_id(): ?int 
    {
        return auth()->user()?->tenant_id;
    }
}




















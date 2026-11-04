<?php

namespace App\Http\Middleware;

use App\Models\Tenants;
use Closure;
use Illuminate\Http\Request;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): mixed  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user || !$user->tenant_id) {
            return $next($request);
        }

        $tenant = Tenants::query()->find($user->tenant_id);

        if ($tenant) {
            app()->instance('tenant', $tenant);
        }

        return $next($request);
    }
}

<?php

namespace App\Policies;

use App\Enum\RegisterUserRolesEnums;
use App\Models\Tenants;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

class TenantsPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Tenants $tenants): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->tenant_id === $tenants->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Tenants $tenants): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Tenants $tenants): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Tenants $tenants): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Tenants $tenants): bool
    {
        return false;
    }
}

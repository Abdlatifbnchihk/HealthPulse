<?php

namespace App\Policies;

use App\Enum\RegisterUserRolesEnums;
use App\Models\User;

class UserPolicy
{

    /**
     * Perform pre-authorization checks.
     * Super admins bypass all other checks automatically.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }
        
        return null;
    }
    
    public function viewAny(User $user): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    public function view(User $user, User $target): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin
            || $user->is($target);
    }

    public function create(User $user): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    public function update(User $user, User $target): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin;
    }

    public function delete(User $user, User $target): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin
            && ! $user->is($target);
    }
}
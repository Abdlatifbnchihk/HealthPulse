<?php

namespace App\Policies;

use App\Enum\RegisterUserRolesEnums;
use App\Models\DoctorSchedules;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DoctorSchedulesPolicy
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
    public function view(User $user, DoctorSchedules $doctorSchedules): bool
    {
        return $user->tenant_id === $doctorSchedules->tenant_id || $user->role === RegisterUserRolesEnums::Super_admin;
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
    public function update(User $user, DoctorSchedules $doctorSchedules): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->tenant_id === $doctorSchedules->tenant_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DoctorSchedules $doctorSchedules): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->tenant_id === $doctorSchedules->tenant_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DoctorSchedules $doctorSchedules): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DoctorSchedules $doctorSchedules): bool
    {
        return false;
    }
}

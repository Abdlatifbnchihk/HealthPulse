<?php

namespace App\Policies;

use App\Enum\RegisterUserRolesEnums;
use App\Models\Appointments;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AppointmentsPolicy
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
    public function view(User $user, Appointments $appointments): bool
    {
        return $user->id === $appointments->patient_id || $user->role === RegisterUserRolesEnums::Super_admin;
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
    public function update(User $user, Appointments $appointments): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->id === $appointments->patient_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointments $appointments): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->id === $appointments->patient_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Appointments $appointments): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Appointments $appointments): bool
    {
        return false;
    }
}

<?php

namespace App\Policies;

use App\Enum\RegisterUserRolesEnums;
use App\Models\ConsultationRecords;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConsultationRecordsPolicy
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
    public function view(User $user, ConsultationRecords $consultationRecords): bool
    {
        return $user->tenant_id === $consultationRecords->tenant_id || $user->role === RegisterUserRolesEnums::Super_admin;
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
    public function update(User $user, ConsultationRecords $consultationRecords): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->tenant_id === $consultationRecords->tenant_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ConsultationRecords $consultationRecords): bool
    {
        return $user->role === RegisterUserRolesEnums::Super_admin || $user->tenant_id === $consultationRecords->tenant_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ConsultationRecords $consultationRecords): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ConsultationRecords $consultationRecords): bool
    {
        return false;
    }
}

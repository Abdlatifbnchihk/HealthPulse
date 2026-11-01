<?php

use App\Http\Controllers\Api\AiPatientIntakeController;
use App\Http\Controllers\Api\DoctorSchedulesController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DoctorProfileControlle;
use App\Http\Controllers\Api\ConsultationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Route::get('/api/v1', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {

    // Auth routes (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function() {
        Route::delete('/auth/logout', [AuthController::class, 'logout']);

        // Tenants
        Route::post('tenants', [TenantController::class, 'store']);
        Route::get('tenants/{tenant}', [TenantController::class, 'show']);
        Route::patch('tenants/{tenant}', [TenantController::class, 'update']);
        Route::delete('tenants/{tenants}', [TenantController::class, 'destroy']);
        // Appointments
        Route::post('appointments', [AppointmentController::class, 'store']);
        Route::get('appointments/{appointment}', [AppointmentController::class, 'show']);
        Route::patch('appointments/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy']);
        // Doctor Profile
        Route::post('doctor-profile', [DoctorProfileControlle::class, 'store']);
        Route::get('doctor-profile/{doctorProfile}', [DoctorProfileControlle::class, 'show']);
        Route::patch('doctor-profile/{doctorProfile}', [DoctorProfileControlle::class, 'update']);
        Route::delete('doctor-profile/{doctorProfile}', [DoctorProfileControlle::class, 'destroy']);
        // Ai Patient In Take 
        Route::post('ai-patient-in-take', [AiPatientIntakeController::class ,'store']); 
        Route::get('ai-patient-in-take/{aiPatientIntake}', [AiPatientIntakeController::class ,'show']); 
        Route::patch('ai-patient-in-take/{aiPatientIntake}', [AiPatientIntakeController::class ,'update']); 
        Route::delete('ai-patient-in-take/{aiPatientIntake}', [AiPatientIntakeController::class ,'destroy']); 
        // Doctor Schedules
        Route::post('doctor-schedules', [DoctorSchedulesController::class, 'store']);
        Route::get('doctor-schedules/{doctorSchedules}', [DoctorSchedulesController::class, 'show']);
        Route::patch('doctor-schedules/{doctorSchedules}', [DoctorSchedulesController::class, 'update']);
        Route::delete('doctor-schedules/{doctorSchedules}', [DoctorSchedulesController::class, 'destroy']);
        // Consultation Records
        Route::post('consultation-records', [ConsultationController::class, 'store']);
        Route::get('consultation-records/{consultationRecords}', [ConsultationController::class, 'show']);
        Route::patch('consultation-records/{consultationRecords}', [ConsultationController::class, 'update']);
        Route::delete('consultation-records/{consultationRecords}', [ConsultationController::class, 'destroy']);
    });
});


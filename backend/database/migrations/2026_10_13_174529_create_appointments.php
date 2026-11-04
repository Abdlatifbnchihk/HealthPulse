<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('appointments')) {
            Schema::table('appointments', function (Blueprint $table) {
                if (! Schema::hasIndex('appointments', 'appointments_slot_unique')) {
                    $table->unique(['doctor_profile_id', 'appointment_date', 'start_time'], 'appointments_slot_unique');
                }

                if (! Schema::hasIndex('appointments', 'appointments_tenant_id_status_index')) {
                    $table->index(['tenant_id', 'status']);
                }
            });

            return;
        }

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->dateTime('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'canceled'])->default('pending');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->unique(['doctor_profile_id', 'appointment_date', 'start_time'], 'appointments_slot_unique');
            $table->index(['tenant_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

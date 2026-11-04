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
        Schema::create('ai_patient_intakes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->text('row_symptoms')->nullable();
            $table->text('ai_summary')->nullable();
            $table->enum('urgency', ['low', 'medium', 'high', 'critical'])->nullable();
            $table->timestamps();

            $table->unique(['appointment_id', 'tenant_id', 'urgency']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_patient_intakes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultation_records', function (Blueprint $table) {
            $table->text('soap_subjective')->nullable()->change();
            $table->text('soap_objective')->nullable()->change();
            $table->text('soap_assessment')->nullable()->change();
            $table->text('soap_plan')->nullable()->change();
            $table->enum('soap_status', ['pending', 'processing', 'completed', 'failed'])
                ->default('pending');
        });
    }

    public function down(): void
    {
        DB::table('consultation_records')->whereNull('soap_subjective')
            ->update(['soap_subjective' => '']);
        DB::table('consultation_records')->whereNull('soap_objective')
            ->update(['soap_objective' => '']);
        DB::table('consultation_records')->whereNull('soap_assessment')
            ->update(['soap_assessment' => '']);
        DB::table('consultation_records')->whereNull('soap_plan')
            ->update(['soap_plan' => '']);

        Schema::table('consultation_records', function (Blueprint $table) {
            $table->dropColumn('soap_status');
            $table->text('soap_subjective')->nullable(false)->change();
            $table->text('soap_objective')->nullable(false)->change();
            $table->text('soap_assessment')->nullable(false)->change();
            $table->text('soap_plan')->nullable(false)->change();
        });
    }
};

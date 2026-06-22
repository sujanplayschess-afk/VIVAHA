<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPremiumFeaturesToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_invisible')->default(0)->after('status');
            $table->boolean('require_photo_permission')->default(0)->after('is_invisible');
            $table->unsignedBigInteger('assigned_matchmaker_id')->nullable()->after('require_photo_permission');
            $table->string('background_check_status')->default('pending')->after('assigned_matchmaker_id');
            $table->boolean('priority_badge')->default(0)->after('background_check_status');
            $table->timestamp('documents_verified_at')->nullable()->after('priority_badge');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_invisible',
                'require_photo_permission',
                'assigned_matchmaker_id',
                'background_check_status',
                'priority_badge',
                'documents_verified_at'
            ]);
        });
    }
}

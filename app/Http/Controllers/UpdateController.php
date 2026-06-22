<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use URL;
use DB;
use Artisan;
use Schema;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UpdateController extends Controller
{
    public function step0() {
        return view('update.step0');
    }

    public function step1() {
        if(get_setting('current_version') == '3.2'){
            $sql_path = base_path('sqlupdates/v33.sql');
            DB::unprepared(file_get_contents($sql_path));
        }
        elseif(get_setting('current_version') == '3.1'){
            $sql_path = base_path('sqlupdates/v32.sql');
            DB::unprepared(file_get_contents($sql_path));

            $sql_path = base_path('sqlupdates/v33.sql');
            DB::unprepared(file_get_contents($sql_path));
        }
        elseif(get_setting('current_version') == '3.0'){
            $sql_path = base_path('sqlupdates/v31.sql');
            DB::unprepared(file_get_contents($sql_path));

            $sql_path = base_path('sqlupdates/v32.sql');
            DB::unprepared(file_get_contents($sql_path));

            $sql_path = base_path('sqlupdates/v33.sql');
            DB::unprepared(file_get_contents($sql_path));
        }

        return redirect()->route('update.step2');
    }

    public function step2() {
        Artisan::call('view:clear');
        Artisan::call('cache:clear');
        $previousRouteServiceProvier = base_path('app/Providers/RouteServiceProvider.php');
        $newRouteServiceProvier      = base_path('app/Providers/RouteServiceProvider.txt');
        copy($newRouteServiceProvier, $previousRouteServiceProvier);
        $this->permissions_33();

        return view('update.done');
    }

    public function permissions_33()
    {
      try {
          Permission::create(['name' => 'wallet_transaction_history','parent'=>'wallet', 'guard_name' => 'web']);
          Permission::create(['name' => 'offline_wallet_recharge_requests','parent'=>'wallet', 'guard_name' => 'web']);
          Permission::create(['name' => 'set_referral_commission','parent'=>'referral_system', 'guard_name' => 'web']);
          Permission::create(['name' => 'view_refferal_users','parent'=>'referral_system', 'guard_name' => 'web']);
          Permission::create(['name' => 'view_refferal_earnings','parent'=>'referral_system', 'guard_name' => 'web']);
          Permission::create(['name' => 'manage_wallet_withdraw_requests','parent'=>'referral_system', 'guard_name' => 'web']);
      } catch (\Exception $e) {

      }
     return;
    }
}

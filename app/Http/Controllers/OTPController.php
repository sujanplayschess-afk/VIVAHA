<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\User;

class OTPController extends Controller
{
    public function __construct()
    {
        $this->middleware(['permission:manage_otp_credentials'])->only('credentials_index');
        // $this->middleware(['permission:send_sms'])->only('destroy');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function credentials_index()
    {
        return view('addons.otp_systems.configurations.set_credentials');
    }
    /**
     * Update the specified resource in .env
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update_credentials(Request $request)
    {
        foreach ($request->types as $key => $type) {
            $this->overWriteEnvFile($type, $request[$type]);
        }

        $sms_gateway_activation = Setting::where('type', $request->otp_method.'_activation')->first();
        if ($request->has($request->otp_method.'_activation'))
        {
            $sms_gateway_activation->value = 1;
            $sms_gateway_activation->save();
        }
        else
        {
            $sms_gateway_activation->value = 0;
            $sms_gateway_activation->save();
        }

        flash("Settings updated successfully")->success();
        return back();
    }

    /**
    *.env file overwrite
    */
    public function overWriteEnvFile($type, $val)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            $val = '"'.trim($val).'"';
            if(is_numeric(strpos(file_get_contents($path), $type)) && strpos(file_get_contents($path), $type) >= 0){
                file_put_contents($path, str_replace(
                    $type.'="'.env($type).'"', $type.'='.$val, file_get_contents($path)
                ));
            }
            else{
                file_put_contents($path, file_get_contents($path)."\r\n".$type.'='.$val);
            }
        }
    }

    public function bulk_sms()
    {
    	$users = User::all();
        return view('addons.otp_systems.bulk_sms.index',compact('users'));
    }

    //send message to multiple users
    public function bulk_sms_send(Request $request)
    {
        foreach ($request->user_phones as $key => $phone) {
            sendSMS($phone, env('APP_NAME'), $request->content);
        }

    	flash(translate('SMS has been sent.'))->success();
    	return redirect()->route('bulk_sms.index');
    }

}

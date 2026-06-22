<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Wallet;
use App\User;
use Redirect;
use Validator;
use Auth;

class ReferralSystemController extends Controller
{
    public function __construct()
    {
        $this->middleware(['permission:set_referral_commission'])->only('set_referral_commission');
        $this->middleware(['permission:view_refferal_users'])->only('index');
        $this->middleware(['permission:view_refferal_earnings'])->only('referal_earnings_admin');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $referral_users = User::orderBy('id','desc')->where('referred_by', '!=', null)->paginate(10);
      return view('addons.referral_system.referral_users', compact('referral_users'));
    }

    public function set_referral_commission(){
      return view('addons.referral_system.set_referral_commission');
    }

    public function referal_earnings_admin(){
      $referred_earnings = Wallet::orderBy('id','desc')->where('payment_method','reffered_commission')->paginate(10);
      return view('addons.referral_system.referal_earnings', compact('referred_earnings'));
    }



    public function my_referred_users()
    {
        $referred_users = User::orderBy('id','desc')->where('referred_by', Auth::user()->id)->paginate(10);
        return view('addons.referral_system.frontend.referred_users', compact('referred_users'));
    }

    public function my_referral_earnings()
    {
        $referral_earnings = Wallet::orderBy('id','desc')->where('payment_method','reffered_commission')->where('user_id',Auth::user()->id)->paginate(10);
        return view('addons.referral_system.frontend.my_referral_earnings', compact('referral_earnings'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id='')
    {
      //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      //
    }
}

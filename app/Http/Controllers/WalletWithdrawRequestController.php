<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WalletWithdrawRequest;
use Auth;

class WalletWithdrawRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(['permission:manage_wallet_withdraw_requests'])->only('index');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $wallet_withdraw_requests = WalletWithdrawRequest::latest()->paginate(10);
        return view('addons.referral_system.wallet_withdraw_requests', compact('wallet_withdraw_requests'));
    }

    public function wallet_withdraw_request_details(Request $request)
    {
        $wallet_withdraw_request = WalletWithdrawRequest::where('id',$request->id)->first();
        return view('addons.referral_system.wallet_withdraw_request_details_modal', compact('wallet_withdraw_request'));
    }

    public function withdraw_request_accept($id){
        $wallet_withdraw_request = WalletWithdrawRequest::findOrFail($id);
        $wallet_withdraw_request->status = 1;
        $wallet_withdraw_request->save();

        flash(translate('Wallet Withdraw Request Accepted Successfully'))->success();
        return back();
    }

    public function withdraw_request_reject($id){
        $wallet_withdraw_request = WalletWithdrawRequest::findOrFail($id);
        $wallet_withdraw_request->status = 2;
        $wallet_withdraw_request->save();

        $user = $wallet_withdraw_request->user;
        $user->balance = $user->balance+$wallet_withdraw_request->amount;
        $user->save();

        flash(translate('Wallet Withdraw Request Rejected Successfully'))->success();
        return back();
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
        $wallet_withdraw_request = new WalletWithdrawRequest;
        $wallet_withdraw_request->user_id = Auth::user()->id;
        $wallet_withdraw_request->amount = $request->amount;
        $wallet_withdraw_request->details = $request->details;
        $wallet_withdraw_request->save();

        $user = Auth::user();
        $user->balance = $user->balance - $request->amount;
        $user->save();

        flash(translate('Wallet Withdraw Request Sent Successfully'))->success();
        return back();
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

    public function wallet_withdraw_request_history()
    {
        $wallet_withdraw_requests = WalletWithdrawRequest::latest()->where('user_id',Auth::user()->id)->paginate(10);
        return view('addons.referral_system.frontend.wallet_withdraw_request_history', compact('wallet_withdraw_requests'));
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
    public function update(Request $request, $id)
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

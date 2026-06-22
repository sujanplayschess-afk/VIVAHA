<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notifications\DbStoreNotification;
use Notification;
use App\Utility\EmailUtility;
use App\Utility\SmsUtility;
use App\Http\Controllers\Controller;
use App\Models\ExpressInterest;
use App\Models\Member;
use App\Models\ChatThread;
use App\User;
use Auth;
use DB;

class ExpressInterestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $interests = DB::table('express_interests')
                ->orderBy('id', 'desc')
                ->where('interested_by', Auth::user()->id)
                ->join('users', 'express_interests.user_id', '=', 'users.id')
                ->select('express_interests.id')
                ->distinct()
                ->paginate(10);

        return view('frontend.member.my_interests', compact('interests'));
    }

    public function interest_requests()
    {
        $interests = ExpressInterest::where('user_id', Auth::user()->id)->latest()->paginate(10);
        return view('frontend.member.interest_requests', compact('interests'));
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
        $express_interest                 = new ExpressInterest;
        $express_interest->user_id        = $request->id;
        $express_interest->interested_by  = Auth::user()->id;
        if($express_interest->save()){
            $member = Member::where('user_id', Auth::user()->id)->first();
            $member->remaining_interest = $member->remaining_interest - 1;
            $member->save();

            $notify_user = User::where('id',$request->id)->first();
            // Express Interest Store Notification for member
             try{
            	 $notify_type = 'express_interest';
                 $id = unique_notify_id();
                 $notify_by = Auth::user()->id;
                 $info_id = $express_interest->id;
            	 $message = Auth::user()->first_name.' '.Auth::user()->last_name.' '.translate(' has Expressed Interest On You.');
            	 $route = 'interest_requests';

            	 Notification::send($notify_user, new DbStoreNotification($notify_type, $id, $notify_by, $info_id, $message, $route));
             }
             catch(\Exception $e){
            	 // dd($e);
             }

             // Express Interest email send to member
             if($notify_user->email != null && get_email_template('email_on_express_interest','status'))
             {
                EmailUtility::email_on_express_interest($notify_user);
             }

             // Express Interest Send SMS to member
             if($notify_user->phone != null && addon_activation('otp_system') && (get_sms_template('express_interest','status') == 1 ))
             {
                SmsUtility::express_interest($notify_user);
             }

            return 1;
        }
        else {
            return 0;
        }
    }

    public function accept_interest(Request $request)
    {
      $interest = ExpressInterest::findOrFail($request->interest_id);
      $interest->status = 1;
      if($interest->save()){
        $existing_chat_thread = ChatThread::where('sender_user_id', $interest->interested_by)->where('receiver_user_id', $interest->user_id)->first();
          if ($existing_chat_thread == null){
              $chat_thread                    = new ChatThread;
              $chat_thread->thread_code       = $interest->interested_by.date('Ymd').$interest->user_id;
              $chat_thread->sender_user_id    = $interest->interested_by;
              $chat_thread->receiver_user_id  = $interest->user_id;
              $chat_thread->save();
          }

          $notify_user = User::where('id',$interest->interested_by)->first();

          // Express Interest Store Notification for member
           try{
               $notify_type = 'accept_interest';
               $id = unique_notify_id();
               $notify_by = Auth::user()->id;
               $info_id = $interest->id;
               $message = Auth::user()->first_name.' '.Auth::user()->last_name.' '.translate(' has accepted your interest.');
               $route = 'my_interests.index';

               Notification::send($notify_user, new DbStoreNotification($notify_type, $id, $notify_by, $info_id, $message, $route));
           }
           catch(\Exception $e){
               // dd($e);
           }

           // Express Interest email send to member
           if($notify_user->email != null && get_email_template('email_on_accepting_interest','status'))
           {
              EmailUtility::email_on_accepting_interest($notify_user, $interest);
           }

           // Express Interest Send SMS to member
           if($notify_user->phone != null && addon_activation('otp_system') && (get_sms_template('accept_interest','status') == 1 ))
           {
              SmsUtility::accept_interest($notify_user, $interest);
           }
           flash(translate('Interest has been accepted successfully.'))->success();
           return redirect()->route('interest_requests');
       }
       else {
           flash(translate('Sorry! Something went wrong.'))->error();
           return back();
       }
    }

    public function reject_interest(Request $request)
    {
      $interest = ExpressInterest::findOrFail($request->interest_id);

      if(ExpressInterest::destroy($request->interest_id)){

          $notify_user = User::where('id',$interest->interested_by)->first();
          try{
              $notify_type = 'reject_interest';
              $id = unique_notify_id();
              $notify_by = Auth::user()->id;
              $info_id = $interest->id;
              $message = Auth::user()->first_name.' '.Auth::user()->last_name.' '.translate(' has rejected your interest.');
              $route = 'my_interests.index';

              Notification::send($notify_user, new DbStoreNotification($notify_type, $id, $notify_by, $info_id, $message, $route));
          }
          catch(\Exception $e){
              // dd($e);
          }

          flash(translate('Interest has been rejected successfully.'))->success();
          return redirect()->route('interest_requests');
      }
      else {
          flash(translate('Sorry! Something went wrong.'))->error();
          return back();
      }
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

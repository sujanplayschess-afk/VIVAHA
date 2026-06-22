<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\User;
use Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $notifications = Notification::latest()->where('notifiable_id',Auth()->user()->id)->paginate(10);
        return view('admin.notifications',compact('notifications'));
    }

    public function frontend_notify_listing()
    {
        $notifications = Notification::latest()->where('notifiable_id',Auth()->user()->id)->paginate(10);
        return view('frontend.member.notifications',compact('notifications'));
    }

    public function notification_view($id)
    {
        $notification = Notification::findOrFail($id);
        $notification_data = json_decode($notification->data);

        // Notification seen
        if($notification->read_at == null)
        {
            $notification->read_at = date('Y-m-d');
            $notification->save();
        }

        if($notification_data->type == 'member_registration')
        {
            $membership = User::where('id',$notification_data->notify_by)->first()->membership;
            return redirect()->route($notification_data->route, $membership);
        }
        else {
            return redirect()->route($notification_data->route);
        }

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

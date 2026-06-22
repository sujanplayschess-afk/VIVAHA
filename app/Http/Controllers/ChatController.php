<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatThread;
use App\Models\Project;
use App\Models\Chat;
use App\User;
use App\Models\Role;
use Session;
use Auth;
use Gate;

class ChatController extends Controller
{
    public function index(Request $request)
    {
      $chat_threads = ChatThread::where('sender_user_id', Auth::user()->id)->orWhere('receiver_user_id', Auth::user()->id)->get();
      return view('frontend.member.messages.index', compact('chat_threads'));
    }

    // public function chat_index()
    // {
    //
    // }

    public function admin_chat_index(Request $request)
    {
        if (Gate::allows('user_chat_index')) {
            $sort_search = null;
            $chat_threads = ChatThread::orderBy('created_at', 'desc');
            if ($request->has('search')){
                $sort_search = $request->search;
                $user_ids = User::where(function($user) use ($sort_search){
                    $user->where('name', 'like', '%'.$sort_search.'%')->orWhere('email', 'like', '%'.$sort_search.'%');
                })->pluck('id')->toArray();
                $chat_threads = $chat_threads->where(function($chat_thread) use ($user_ids){
                    $chat_thread->whereIn('sender_user_id', $user_ids)->orWhereIn('receiver_user_id', $user_ids);
                });
                $chat_threads = $chat_threads->paginate(10);
            }
            else {
                $chat_threads = $chat_threads->paginate(12);
            }


            return view('admin.chats.index', compact('chat_threads', 'sort_search'));
        }
        else {
            flash('You do not have access permission')->error();
            return back();
        }
    }

    public function admin_chat_details($id)
    {
        if (Gate::allows('single_user_chat_details')) {
            $chat_thread = ChatThread::findOrFail(decrypt($id));
            $chats = $chat_thread->chats;
            return view('admin.chats.show', compact('chats','chat_thread'));
        }
        else {
            flash('You do not have access permission')->error();
            return back();
        }
    }

    public function chat_view($id)
    {
        $chat_thread = ChatThread::findOrFail($id);
        foreach ($chat_thread->chats as $key => $chat) {
            if($chat->sender_user_id != Auth::user()->id){
                $chat->seen = 1;
                $chat->save();
            }
        }
        $chats = $chat_thread->chats()->latest()->limit(20)->get();

        return view('frontend.member.messages.messages', compact('chats', 'chat_thread'));
    }

    public function get_old_messages(Request $request)
    {
        $chat = Chat::findOrFail($request->first_message_id);
        $chats = Chat::where('id', '<', $chat->id)->where('chat_thread_id', $chat->chat_thread_id)->latest()->limit(20)->get();
        if(count($chats) > 0){
            return array('messages' => view('frontend.member.messages.messages_part', compact('chats'))->render(),
                         'first_message_id' => $chats->last()->id);
        }
        else {
            return array('messages' => "",
                         'first_message_id' => 0);
        }
    }

    public function chat_refresh($id)
    {
        $chat_thread = ChatThread::findOrFail($id);
        $chats = $chat_thread->chats()->where('sender_user_id', '!=', Auth::user()->id)->where('seen' , 0)->get();
        foreach ($chats as $key => $value) {
            $value->seen = 1;
            $value->save();
        }

        return array('messages' => view('frontend.member.messages.messages_left_single', compact('chats'))->render(),
                     'count' => count($chats));
    }


    public function chat_reply(Request $request)
    {
        $chat = new Chat;
        $chat->chat_thread_id = $request->chat_thread_id;
        $chat->sender_user_id = Auth::user()->id;
        $chat->message = $request->message;
        if($request->attachment != null){
            $chat->attachment = json_encode(explode(',', $request->attachment));
        }
        $chat->save();
        return view('frontend.member.messages.messages_right_single', compact('chat'));
    }

    public function interview_status(Request $request)
    {
        $chat_thread = ChatThread::findOrFail($request->chat_thread_id);
        if ($chat_thread->interview == 1) {
            $chat_thread->interview = 0;
        }
        else {
            $chat_thread->interview = 1;
        }
        if ($chat_thread->save()) {
            return 1;
        }
        else {
            return 0;
        }
    }

    public function block_status(Request $request)
    {
        $chat_thread = ChatThread::findOrFail($request->chat_thread_id);
        if ($chat_thread->active == 1) {
            $chat_thread->active = 0;
        }
        else {
            $chat_thread->active = 1;
        }
        if ($chat_thread->save()) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\User;
use Auth;
use Redirect;
use Validator;

class PremiumMemberController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function verification_index(Request $request)
    {
        $sort_search = $request->search;
        $users = User::where('user_type', 'member');
        
        if ($sort_search) {
            $users = $users->where(function($query) use ($sort_search) {
                $query->where('first_name', 'like', '%'.$sort_search.'%')
                      ->orWhere('last_name', 'like', '%'.$sort_search.'%')
                      ->orWhere('code', 'like', '%'.$sort_search.'%');
            });
        }
        
        // Members who haven't been verified yet (or all to manage status)
        $users = $users->latest()->paginate(15);
        
        return view('admin.premium.verification', compact('users', 'sort_search'));
    }

    public function verify_member(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->documents_verified_at = $request->status == 1 ? now() : null;
        
        if ($user->save()) {
            flash(translate('Member verification status updated'))->success();
        } else {
            flash(translate('Something went wrong'))->error();
        }
        
        return back();
    }

    public function matchmakers_index(Request $request)
    {
        $sort_search = $request->search;
        $users = User::where('user_type', 'member')->where('membership', 2); // Premium members usually get matchmakers
        
        if ($sort_search) {
            $users = $users->where(function($query) use ($sort_search) {
                $query->where('first_name', 'like', '%'.$sort_search.'%')
                      ->orWhere('last_name', 'like', '%'.$sort_search.'%')
                      ->orWhere('code', 'like', '%'.$sort_search.'%');
            });
        }
        
        $users = $users->latest()->paginate(15);
        
        // Matchmakers are staff members with certain roles. For now, let's just get all staff.
        $matchmakers = User::where('user_type', 'staff')->get();
        
        return view('admin.premium.matchmakers', compact('users', 'matchmakers', 'sort_search'));
    }

    public function assign_matchmaker(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->assigned_matchmaker_id = $request->matchmaker_id;
        
        if ($user->save()) {
            flash(translate('Matchmaker assigned successfully'))->success();
        } else {
            flash(translate('Something went wrong'))->error();
        }
        
        return back();
    }

    public function update_priority(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->priority_badge = $request->status;
        
        if ($user->save()) {
            flash(translate('Priority status updated'))->success();
        } else {
            flash(translate('Something went wrong'))->error();
        }
        
        return back();
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Models\Member;
use Auth;

class PremiumManagementController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function verification_index()
    {
        $users = User::where('user_type', 'member')->where('membership', 2)->latest()->paginate(15);
        return view('admin.premium_management.verification', compact('users'));
    }

    public function approve_verification(Request $request)
    {
        $user = User::findOrFail($request->id);
        $user->documents_verified_at = now();
        $user->save();

        flash(translate('User documents verified successfully.'))->success();
        return back();
    }

    public function matchmakers_index()
    {
        $users = User::where('user_type', 'member')->where('membership', 2)->latest()->paginate(15);
        $admins = User::where('user_type', 'admin')->get();
        return view('admin.premium_management.matchmakers', compact('users', 'admins'));
    }

    public function assign_matchmaker(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->assigned_matchmaker_id = $request->matchmaker_id;
        $user->save();

        flash(translate('Matchmaker assigned successfully.'))->success();
        return back();
    }
}

@extends('admin.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Assisted Matchmaking')}}</h1>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header row gutters-5">
                <div class="col text-center text-md-left">
                    <h5 class="mb-md-0 h6">{{ translate('Premium Member Assignments') }}</h5>
                </div>
                <div class="col-md-3">
                    <form class="" id="sort_members" action="" method="GET">
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control" id="search" name="search"@isset($sort_search) value="{{ $sort_search }}" @endisset placeholder="{{ translate('Type first name / last name / ID & Enter') }}">
                        </div>
                    </form>
                </div>
            </div>
            <div class="card-body">
                <table class="table aiz-table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{{translate('Member')}}</th>
                            <th>{{translate('Assigned Matchmaker')}}</th>
                            <th>{{translate('Priority Status')}}</th>
                            <th class="text-right">{{translate('Action')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $key => $user)
                            <tr>
                                <td>{{ ($key+1) + ($users->currentPage() - 1)*$users->perPage() }}</td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img class="img-md mr-3 rounded-circle" src="{{ uploaded_asset($user->photo) }}" onerror="this.onerror=null;this.src='{{ static_asset('assets/img/avatar-place.png') }}';" height="45px">
                                        <div>
                                            <span class="d-block fw-600">{{ $user->first_name.' '.$user->last_name }}</span>
                                            <small class="text-muted">{{ $user->code }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <form action="{{ route('premium.assign_matchmaker') }}" method="POST">
                                        @csrf
                                        <input type="hidden" name="user_id" value="{{ $user->id }}">
                                        <select class="form-control form-control-sm aiz-selectpicker" name="matchmaker_id" onchange="this.form.submit()">
                                            <option value="">{{ translate('No Matchmaker') }}</option>
                                            @foreach($matchmakers as $matchmaker)
                                                <option value="{{ $matchmaker->id }}" @if($user->assigned_matchmaker_id == $matchmaker->id) selected @endif>
                                                    {{ $matchmaker->first_name.' '.$matchmaker->last_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </form>
                                </td>
                                <td>
                                    @if($user->priority_badge)
                                        <span class="badge badge-inline badge-warning text-white">{{translate('Priority Match')}}</span>
                                    @else
                                        <span class="badge badge-inline badge-secondary">{{translate('Standard')}}</span>
                                    @endif
                                </td>
                                <td class="text-right">
                                    <form action="{{ route('premium.update_priority') }}" method="POST" class="d-inline-block">
                                        @csrf
                                        <input type="hidden" name="user_id" value="{{ $user->id }}">
                                        @if($user->priority_badge)
                                            <input type="hidden" name="status" value="0">
                                            <button type="submit" class="btn btn-soft-danger btn-icon btn-circle btn-sm" title="{{ translate('Remove Priority') }}">
                                                <i class="las la-minus-circle"></i>
                                            </button>
                                        @else
                                            <input type="hidden" name="status" value="1">
                                            <button type="submit" class="btn btn-soft-warning btn-icon btn-circle btn-sm" title="{{ translate('Set as Priority') }}">
                                                <i class="las la-crown"></i>
                                            </button>
                                        @endif
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="aiz-pagination">
                    {{ $users->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

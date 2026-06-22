@extends('admin.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Premium Member Verification')}}</h1>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header row gutters-5">
                <div class="col text-center text-md-left">
                    <h5 class="mb-md-0 h6">{{ translate('Document Verification') }}</h5>
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
                            <th>{{translate('Member Code')}}</th>
                            <th>{{translate('Name')}}</th>
                            <th>{{translate('Membership')}}</th>
                            <th>{{translate('Verification Status')}}</th>
                            <th class="text-right">{{translate('Action')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $key => $user)
                            <tr>
                                <td>{{ ($key+1) + ($users->currentPage() - 1)*$users->perPage() }}</td>
                                <td>{{ $user->code }}</td>
                                <td>{{ $user->first_name.' '.$user->last_name }}</td>
                                <td>
                                    @if($user->membership == 1)
                                        <span class="badge badge-inline badge-info">{{translate('Free')}}</span>
                                    @else
                                        <span class="badge badge-inline badge-success">{{translate('Premium')}}</span>
                                    @endif
                                </td>
                                <td>
                                    @if($user->documents_verified_at)
                                        <span class="badge badge-inline badge-success">{{translate('Verified')}}</span>
                                    @else
                                        <span class="badge badge-inline badge-danger">{{translate('Unverified')}}</span>
                                    @endif
                                </td>
                                <td class="text-right">
                                    <form action="{{ route('premium.verify_member') }}" method="POST" class="d-inline-block">
                                        @csrf
                                        <input type="hidden" name="user_id" value="{{ $user->id }}">
                                        @if($user->documents_verified_at)
                                            <input type="hidden" name="status" value="0">
                                            <button type="submit" class="btn btn-soft-danger btn-icon btn-circle btn-sm" title="{{ translate('Revoke Verification') }}">
                                                <i class="las la-times"></i>
                                            </button>
                                        @else
                                            <input type="hidden" name="status" value="1">
                                            <button type="submit" class="btn btn-soft-success btn-icon btn-circle btn-sm" title="{{ translate('Verify Documents') }}">
                                                <i class="las la-check"></i>
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

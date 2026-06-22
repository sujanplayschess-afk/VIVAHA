@extends('admin.layouts.app')

@section('content')
<div class="aiz-titlebar text-left mt-2 mb-3">
	<div class="align-items-center">
		<h1 class="h3">{{translate('Document Verification')}}</h1>
	</div>
</div>

<div class="card">
    <div class="card-header">
        <h5 class="mb-0 h6">{{translate('Premium Members Verification')}}</h5>
    </div>
    <div class="card-body">
        <table class="table aiz-table mb-0">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{{translate('Name')}}</th>
                    <th>{{translate('Membership')}}</th>
                    <th>{{translate('Verification Status')}}</th>
                    <th class="text-right">{{translate('Options')}}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $key => $user)
                    <tr>
                        <td>{{ ($key+1) + ($users->currentPage() - 1)*$users->perPage() }}</td>
                        <td>{{ $user->first_name.' '.$user->last_name }}</td>
                        <td>
                            @if($user->membership == 2)
                                <span class="badge badge-inline badge-warning">{{translate('Premium')}}</span>
                            @else
                                <span class="badge badge-inline badge-light">{{translate('Free')}}</span>
                            @endif
                        </td>
                        <td>
                            @if($user->documents_verified_at)
                                <span class="badge badge-inline badge-success">{{translate('Verified')}}</span>
                            @else
                                <span class="badge badge-inline badge-danger">{{translate('Pending')}}</span>
                            @endif
                        </td>
                        <td class="text-right">
                            @if(!$user->documents_verified_at)
                                <a href="javascript:void(0);" onclick="approve_verification('{{ $user->id }}')" class="btn btn-soft-primary btn-icon btn-circle btn-sm" title="{{ translate('Approve Verification') }}">
                                    <i class="las la-check-double"></i>
                                </a>
                            @endif
                            <a href="{{ route('member_profile', $user->id) }}" target="_blank" class="btn btn-soft-info btn-icon btn-circle btn-sm" title="{{ translate('View Profile') }}">
                                <i class="las la-eye"></i>
                            </a>
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
@endsection

@section('modal')
    <div class="modal fade" id="approve_modal">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{translate('Confirm Verification')}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body text-center">
                    <form action="{{ route('premium.verification.approve') }}" method="POST">
                        @csrf
                        <input type="hidden" name="id" id="approve_id" value="">
                        <p class="mt-1">{{translate('Are you sure you want to verify this members documents?')}}</p>
                        <button type="button" class="btn btn-light mt-2" data-dismiss="modal">{{translate('Cancel')}}</button>
                        <button type="submit" class="btn btn-primary mt-2">{{translate('Confirm')}}</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
<script type="text/javascript">
    function approve_verification(id) {
        $('#approve_id').val(id);
        $('#approve_modal').modal('show');
    }
</script>
@endsection

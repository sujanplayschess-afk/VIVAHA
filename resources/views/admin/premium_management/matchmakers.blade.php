@extends('admin.layouts.app')

@section('content')
<div class="aiz-titlebar text-left mt-2 mb-3">
	<div class="align-items-center">
		<h1 class="h3">{{translate('Assisted Matchmaking')}}</h1>
	</div>
</div>

<div class="card">
    <div class="card-header">
        <h5 class="mb-0 h6">{{translate('Premium Members & Matchmakers')}}</h5>
    </div>
    <div class="card-body">
        <table class="table aiz-table mb-0">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{{translate('Name')}}</th>
                    <th>{{translate('Assigned Matchmaker')}}</th>
                    <th class="text-right">{{translate('Options')}}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $key => $user)
                    <tr>
                        <td>{{ ($key+1) + ($users->currentPage() - 1)*$users->perPage() }}</td>
                        <td>{{ $user->first_name.' '.$user->last_name }}</td>
                        <td>
                            @if($user->assigned_matchmaker_id)
                                @php $matchmaker = \App\User::find($user->assigned_matchmaker_id); @endphp
                                @if($matchmaker)
                                    <span class="badge badge-inline badge-info">{{ $matchmaker->first_name }}</span>
                                @else
                                    <span class="badge badge-inline badge-secondary">{{translate('Not Assigned')}}</span>
                                @endif
                            @else
                                <span class="badge badge-inline badge-secondary">{{translate('Not Assigned')}}</span>
                            @endif
                        </td>
                        <td class="text-right">
                            <a href="javascript:void(0);" onclick="assign_matchmaker('{{ $user->id }}', '{{ $user->assigned_matchmaker_id }}')" class="btn btn-soft-primary btn-icon btn-circle btn-sm" title="{{ translate('Assign Matchmaker') }}">
                                <i class="las la-user-tag"></i>
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
    <div class="modal fade" id="assign_modal">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{translate('Assign Matchmaker')}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body">
                    <form action="{{ route('premium.matchmakers.assign') }}" method="POST">
                        @csrf
                        <input type="hidden" name="user_id" id="user_id" value="">
                        <div class="form-group">
                            <label>{{ translate('Select Matchmaker (Admin)') }}</label>
                            <select name="matchmaker_id" id="matchmaker_id" class="form-control aiz-selectpicker" data-live-search="true">
                                <option value="">{{ translate('Select Matchmaker') }}</option>
                                @foreach($admins as $admin)
                                    <option value="{{ $admin->id }}">{{ $admin->first_name.' ('.$admin->email.')' }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="text-right">
                            <button type="button" class="btn btn-light mt-2" data-dismiss="modal">{{translate('Cancel')}}</button>
                            <button type="submit" class="btn btn-primary mt-2">{{translate('Assign')}}</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
<script type="text/javascript">
    function assign_matchmaker(user_id, matchmaker_id) {
        $('#user_id').val(user_id);
        $('#matchmaker_id').val(matchmaker_id).change();
        $('#assign_modal').modal('show');
    }
</script>
@endsection

@extends('admin.layouts.app')
@section('content')
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0 h6">{{ translate('Wallet Withdraw Requests')}}</h5>
        </div>
        <div class="card-body">
            <table class="table aiz-table mb-0">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{{ translate('Name')}}</th>
                    <th data-breakpoints="lg">{{ translate('Amount')}}</th>
                    <th data-breakpoints="lg">{{ translate('Status')}}</th>
                    <th data-breakpoints="lg">{{ translate('Date')}}</th>
                    <th data-breakpoints="lg" class="text-right">{{ translate('Actions')}}</th>
                </tr>
                </thead>
                <tbody>
                @foreach($wallet_withdraw_requests as $key => $wallet_withdraw_request)
                    <tr>
                        <td>{{ ($key+1) + ($wallet_withdraw_requests->currentPage() - 1)*$wallet_withdraw_requests->perPage() }}</td>
                        <td>
                          @if($wallet_withdraw_request != null )
                            {{ $wallet_withdraw_request->user->first_name.' '.$wallet_withdraw_request->user->last_name }}
                          @endif
                        </td>
                        <td>{{ single_price($wallet_withdraw_request->amount) }}</td>
                        <td>
                            @if ($wallet_withdraw_request->status == 0)
                              <span class="badge badge-inline badge-info">{{translate('Pending')}}</span>
                            @elseif ($wallet_withdraw_request->status == 1)
                                <span class="badge badge-inline badge-success">{{translate('Accepted')}}</span>
                            @else
                              <span class="badge badge-inline badge-danger">{{translate('Rejected')}}</span>
                            @endif
                        </td>
                        <td>{{ date('d-m-Y', strtotime($wallet_withdraw_request->created_at)) }}</td>
                        <td class="text-right">
                            <a class="btn btn-soft-primary btn-icon btn-circle btn-sm"  onclick="wallet_withdraw_request_details({{$wallet_withdraw_request->id}})" href="javascript:void(0);" title="{{ translate('View Details') }}">
                                <i class="las la-eye"></i>
                            </a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $wallet_withdraw_requests->appends(request()->input())->links() }}
            </div>
        </div>
    </div>

@endsection
@section('modal')
    <div class="modal fade withdraw_request_details_modal" id="modal-basic">
        <div class="modal-dialog">
            <div class="modal-content withdraw_request_details_modal_content">

            </div>
        </div>
    </div>
@endsection

@section('script')
<script type="text/javascript">
     function wallet_withdraw_request_details(id){
         $.post('{{ route('wallet_withdraw_request_details') }}',{_token:'{{ @csrf_token() }}', id:id}, function(data){
             $('.withdraw_request_details_modal_content').html(data);
             $('.withdraw_request_details_modal').modal('show');
         });
     }
</script>
@endsection

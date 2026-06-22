@extends('frontend.layouts.member_panel')
@section('panel_content')
    <div class="row gutters-10">
      <div class="col-md-4 mx-auto mb-3" >
          <div class="bg-grad-1 text-white rounded-lg overflow-hidden">
            <span class="size-30px rounded-circle mx-auto bg-soft-primary d-flex align-items-center justify-content-center mt-3">
                <i class="las la-dollar-sign la-2x text-white"></i>
            </span>
            <div class="px-3 pt-3 pb-3">
                <div class="h4 fw-700 text-center">{{ single_price(Auth::user()->balance) }}</div>
                <div class="opacity-50 text-center">{{ translate('Wallet Balance') }}</div>
            </div>
          </div>
      </div>
      <div class="col-md-4 mx-auto mb-3" >
        <div class="p-3 rounded mb-3 c-pointer text-center bg-white shadow-sm hov-shadow-lg has-transition bg-soft-info" onclick="show_wallet_withdraw_modal()">
            <span class="size-60px rounded-circle mx-auto bg-secondary d-flex align-items-center justify-content-center mb-3">
                <i class="las la-plus la-3x text-white"></i>
            </span>
            <div class="fs-18 text-primary">{{ translate('Wallet Withdraw Request') }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
          <h5 class="mb-0 h6">{{ translate('Wallet Withdraw Request History')}}</h5>
      </div>
        <div class="card-body">
            <table class="table aiz-table mb-0">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{{ translate('Amount')}}</th>
                    <th data-breakpoints="lg">{{ translate('Status')}}</th>
                    <th data-breakpoints="lg" width="50%">{{ translate('Details')}}</th>
                    <th data-breakpoints="lg">{{ translate('Date')}}</th>
                </tr>
                </thead>
                <tbody>
                @foreach($wallet_withdraw_requests as $key => $wallet_withdraw_request)
                    <tr>
                        <td>{{ ($key+1) + ($wallet_withdraw_requests->currentPage() - 1)*$wallet_withdraw_requests->perPage() }}</td>
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
                        <td>{{ $wallet_withdraw_request->details }}</td>
                        <td>{{ date('d-m-Y', strtotime($wallet_withdraw_request->created_at)) }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $wallet_withdraw_requests->links() }}
            </div>
        </div>
    </div>
@endsection

@section('modal')
<!-- wallet_withdraw_modal -->
<div class="modal fade" id="wallet_withdraw_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ translate('Wallet Withdraw Request') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
                </div>

                <form action="{{ route('wallet_withdraw_request.store') }}" method="POST">
			            @csrf
                  <div class="modal-body gry-bg px-3 pt-3">
                      <div class="row">
                          <div class="col-md-3">
                              <label>{{ translate('Amount')}} <span class="text-danger">*</span></label>
                          </div>
                          <div class="col-md-9">
                              <input type="number" class="form-control mb-3" name="amount" min="1" max="{{ Auth::user()->balance }}" placeholder="{{ translate('Amount')}}" required>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-md-3">
                              <label>{{ translate('Details')}} <span class="text-danger">*</span></label>
                          </div>
                          <div class="col-md-9">
                              <textarea class="resize-off form-control" rows="5" placeholder="{{ translate('Details') }}" name="details"></textarea>
                          </div>
                      </div>

                      <div class="form-group text-right mt-2">
                          <button type="submit" class="btn btn-sm btn-primary transition-3d-hover mr-1">{{translate('Confirm')}}</textarea>
                      </div>
                  </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('script')
<script type="text/javascript">

    function show_wallet_withdraw_modal(){
        $('#wallet_withdraw_modal').modal('show');
    }
</script>
@endsection

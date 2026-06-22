<div class="modal-header">
    <h5 class="modal-title h6">{{translate('Wallet Withdraw Request')}}</h5>
    <button type="button" class="close" data-dismiss="modal">
    </button>
</div>
<div class="modal-body">
    <table class="table table-bordered">
        <tbody>
            <tr>
                <th>{{ translate('Amount')}}</th>
                <td>{{ single_price($wallet_withdraw_request->amount) }}</td>
            </tr>
            <tr>
                <th>{{ translate('Details')}}</th>
                <td>{{ $wallet_withdraw_request->details }}</td>
            </tr>
        </tbody>
    </table>
</div>
<div class="modal-footer">
    @if($wallet_withdraw_request->status == 0)
        <a href="{{ route('wallet_withdraw_request.reject',$wallet_withdraw_request->id ) }}" class="btn btn-sm btn-danger">{{translate('Reject')}}</a>
        <a href="{{ route('wallet_withdraw_request.accept',$wallet_withdraw_request->id ) }}" class="btn btn-sm btn-success">{{translate('Accept')}}</a>
    @endif
</div>

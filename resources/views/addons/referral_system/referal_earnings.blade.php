@extends('admin.layouts.app')
@section('content')
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0 h6">{{ translate('Refferal Earnings')}}</h5>
        </div>
        <div class="card-body">
            <table class="table aiz-table mb-0">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{{ translate('User Name')}}</th>
                    <th data-breakpoints="lg">{{ translate('Commission')}}</th>
                    <th>{{ translate('Referral User')}}</th>
                    <th data-breakpoints="lg">{{ translate('Date')}}</th>
                </tr>
                </thead>
                <tbody>
                @foreach($referred_earnings as $key => $referred_earning)
                    <tr>
                        <td>{{ ($key+1) + ($referred_earnings->currentPage() - 1)*$referred_earnings->perPage() }}</td>
                        <td>
                          @if($referred_earning->user != null)
                            {{ $referred_earning->user->first_name.' '.$referred_earning->user->last_name }}
                          @endif
                        </td>
                        <td>{{ single_price($referred_earning->amount) }}</td>
                        <td>
                          @php $referral_user = \App\User::where('id',$referred_earning->referral_user)->first(); @endphp
                          @if($referral_user != null)
                            {{ $referral_user->first_name.' '.$referral_user->last_name }}
                          @endif
                        </td>
                        <td>{{ date('d-m-Y', strtotime($referred_earning->created_at)) }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $referred_earnings->appends(request()->input())->links() }}
            </div>
        </div>
    </div>

@endsection

@extends('frontend.layouts.member_panel')
@section('panel_content')
    <div class="aiz-titlebar mt-2 mb-4">
        <div class="row align-items-center">
          <div class="col-md-6">
              <h1 class="h3">{{ translate('Referral Earnings') }}</h1>
          </div>
        </div>
    </div>
    <div class="card">
      <div class="card-header">
          <h5 class="mb-0 h6">{{ translate('Referral Earnings')}}</h5>
      </div>
        <div class="card-body">

            <table class="table aiz-table mb-0">
                <thead>
                  <tr>
                      <th>#</th>
                      <th>{{ translate('Referred User')}}</th>
                      <th>{{ translate('Amount')}}</th>
                      <th data-breakpoints="lg">{{  translate('Date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @foreach ($referral_earnings as $key => $referral_earning)
                      <tr>
                          <td>{{ $key+1 }}</td>
                          <td>
                            @php $referral_user = \App\User::where('id',$referral_earning->referral_user)->first(); @endphp
                            @if($referral_user != null)
                              {{ $referral_user->first_name.' '.$referral_user->last_name }}
                            @endif
                          </td>
                          <td>{{ single_price($referral_earning->amount) }}</td>
                          <td>{{ date('d-m-Y', strtotime($referral_earning->created_at)) }}</td>
                      </tr>
                  @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $referral_earnings->links() }}
            </div>
        </div>
    </div>
@endsection

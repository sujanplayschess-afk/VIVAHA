@extends('frontend.layouts.member_panel')
@section('panel_content')
    <div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
      <div class="col-md-6">
          <h1 class="h3">{{ translate('Refer Code and Referred Users') }}</h1>
      </div>
    </div>
    </div>
    <div class="row gutters-10">
      <div class="col-md-4 mx-auto mb-3" >
        <div class="p-3 rounded mb-3 c-pointer text-center bg-white shadow-sm hov-shadow-lg has-transition">
            <div class="fs-18 text-primary">
              {{ translate('Referral Code').' : '.Auth::user()->code }}
            </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
          <h5 class="mb-0 h6">{{ translate('Referred Users')}}</h5>
      </div>
        <div class="card-body">

            <table class="table aiz-table mb-0">
                <thead>
                  <tr>
                      <th>#</th>
                      <th>{{ translate('Name')}}</th>
                      <th data-breakpoints="lg">{{  translate('Date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @foreach ($referred_users as $key => $referred_user)
                      <tr>
                          <td>{{ $key+1 }}</td>
                          <td>{{ $referred_user->first_name.' '.$referred_user->last_name }}</td>
                          <td>{{ date('d-m-Y', strtotime($referred_user->created_at)) }}</td>
                      </tr>
                  @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $referred_users->links() }}
            </div>
        </div>
    </div>
@endsection

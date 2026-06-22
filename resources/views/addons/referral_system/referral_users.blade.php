@extends('admin.layouts.app')
@section('content')
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0 h6">{{ translate('Refferal Users')}}</h5>
        </div>
        <div class="card-body">
            <table class="table aiz-table mb-0">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{{ translate('Name')}}</th>
                    <th data-breakpoints="lg">{{ translate('Email Address')}}</th>
                    <th data-breakpoints="lg">{{ translate('Reffered By')}}</th>
                </tr>
                </thead>
                <tbody>
                @foreach($referral_users as $key => $referral_user)
                    @if ($referral_user != null)
                        <tr>
                            <td>{{ ($key+1) + ($referral_users->currentPage() - 1)*$referral_users->perPage() }}</td>
                            <td>{{$referral_user->first_name.' '.$referral_user->last_name}}</td>
                            <td>{{$referral_user->email}}</td>
                            <td>
                                @php $reffered_by = \App\User::find($referral_user->referred_by); @endphp
                                @if( $reffered_by != null)
                                    {{ $reffered_by->first_name.' '.$reffered_by->last_name }} ( {{translate('Code').': '.$reffered_by->code }} )
                                @endif
                            </td>
                        </tr>
                    @endif
                @endforeach
                </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $referral_users->appends(request()->input())->links() }}
            </div>
        </div>
    </div>

@endsection

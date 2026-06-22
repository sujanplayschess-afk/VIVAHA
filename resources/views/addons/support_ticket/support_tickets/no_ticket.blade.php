@extends('admin.layouts.app')
@section('content')

    <div class="row">
        <div class="col-md-8 mx-auto">
            <div class="card">
                <div class="card-body">
                    <div class="card cta-box bg-danger text-white">
                        <div class="card-body">
                            <div class="media align-items-center">
                                <div class="media-body">
                                    <h2 class="mt-0"><i class="las la-bullhorn"></i></h2>
                                    <h3 class="m-0 font-weight-normal cta-box-title">{{ translate('No Ticket') }}</h3>
                                </div>
                                <img class="ml-3" src="{{static_asset('assets/img/email-campaign.svg')}}" width="120" alt="Generic placeholder image">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@extends('admin.layouts.app')
@section('content')
    <div class="row">
        <div class="col">
            <div class="pb-4 d-flex">
                <h4 class="mr-3 h6">{{translate('Default Ticket Assigned Agent')}}</h4>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8 mx-auto">
            <div class="card">
                <div class="card-body">
                    <div class="card cta-box bg-danger text-white">
                        <div class="card-body">
                            <div class="media align-items-center">
                                <div class="media-body">
                                    <h2 class="mt-0"><i class="las la-bullhorn"></i></h2>
                                    <h3 class="m-0 font-weight-normal cta-box-title">{{ translate('All Support Tickets are automatically') }} <b>{{ translate('Assigned') }}</b> {{ translate('to') }} <i class="las la-arrow-right"></i><b></b></h3>
                                </div>
                                <img class="ml-3" src="{{static_asset('assets/img/email-campaign.svg')}}" width="120" alt="Generic placeholder image">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <form action="{{ route('settings.update') }}" method="POST" enctype="multipart/form-data">
    					@csrf
                        <div class="form-group row">
                            <label class="col-sm-2 col-from-label">{{ translate('Assigned To') }}</label>
                            <div class="col-sm-10">
                                <input type="hidden" name="types[]" value="default_ticket_assigned_user">
                                <select name="default_ticket_assigned_user" class="form-control aiz-selectpicker" data-live-search="true" required>
                                    @foreach($staffs as $staff)
                                        <option value="{{$staff->id}}" @if(get_setting('default_ticket_assigned_user') == $staff->id) selected @endif>{{$staff->first_name.' '.$staff->last_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="form-group mb-3 text-right">
                            <button type="submit" class="btn btn-primary btn-rounded">{{ translate('Save') }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

@endsection

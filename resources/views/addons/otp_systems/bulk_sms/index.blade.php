@extends('admin.layouts.app')
@section('content')

<div class="row">
    <div class="col-lg-10 mx-auto">
        <div class="card">
            <div class="card-header">
                <h3 class="fs-18 mb-0">{{translate('Send Bulk SMS')}}</h3>
            </div>
            <form class="form-horizontal" action="{{ route('bulk_sms.send') }}" method="POST" enctype="multipart/form-data">
            	@csrf
                <div class="card-body">
                    <div class="form-group row">
                        <label class="col-sm-2 control-label" for="name">{{translate('Mobile Users')}}</label>
                        <div class="col-sm-10">
                            <select class="form-control aiz-selectpicker" name="user_phones[]" multiple data-selected-text-format="count" data-actions-box="true">
                                @foreach($users as $user)
                                    @if ($user->phone != null)
                                        <option value="{{$user->phone}}">{{ $user->first_name.' '.$user->last_name}} - {{$user->phone}}</option>
                                    @endif
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 control-label" for="name">{{translate('SMS content')}}</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" rows="5" name="content" required></textarea>
                        </div>
                    </div>
                    <div class="form-group mb-0 text-right">
                        <button type="submit" class="btn btn-primary">{{translate('Send')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection

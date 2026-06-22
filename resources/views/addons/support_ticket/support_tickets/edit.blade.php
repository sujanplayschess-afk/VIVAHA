@extends('admin.layouts.app')
@section('content')

    <div class="row">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h1 class="mb-0 h6">{{translate('Assign this ticket to agent')}}</h1>
                </div>
                <div class="card-body">
                    <form class="form-horizontal" action="{{ route('support-tickets.update',$support_ticket->id) }}" method="POST" enctype="multipart/form-data">
                        <input name="_method" type="hidden" value="PATCH">
                        @csrf
                        <div class="form-group mb-3">
                            <label for="category">{{translate('Category')}}</label>
                            <select class="form-control aiz-selectpicker" name="category_id" disabled ata-toggle="select2" data-placeholder="Choose ..." required>
                                @foreach(\App\Models\SupportCategory::all() as $support_category)
                                    <option value="{{$support_category->id}}" @if ($support_ticket->support_category_id == $support_category->id) selected @endif>{{$support_category->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="priority">{{translate('Priority')}}</label>
                            <select class="form-control aiz-selectpicker" name="priority" data-toggle="select2" data-placeholder="{{translate('Choose ...')}}" required>
                                <option value="regular" @if ($support_ticket->priority == 'regular')  @endif>{{translate('Regular')}}</option>
                                <option value="low" @if ($support_ticket->priority == 'low')  @endif>{{translate('Low')}}</option>
                                <option value="medium" @if ($support_ticket->priority == 'medium')  @endif>{{translate('Medium')}}</option>
                                <option value="high" @if ($support_ticket->priority == 'high')  @endif>{{translate('High')}}</option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="support_agent">{{translate('Support Agent')}}</label>
                            <select name="assigned_user_id" class="form-control aiz-selectpicker" data-live-search="true" data-toggle="select2" data-placeholder="{{translate('Choose ...')}}" required>
                                @foreach ($staffs as $key => $staff)
                                    <option value="{{ $staff->id }}" @if($staff->id == $support_ticket->assigned_user_id) selected @endif>{{ $staff->first_name.' '.$staff->last_name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-3 text-right">
                            <button type="submit" class="btn btn-primary">{{translate('Assign Ticket')}}</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h1 class="mb-0 h6">{{translate('Ticket Details')}}</h1>
                </div>
                <div class="card-body">
                    <div class="form-group mb-3">
                        <label for="subject"><b>{{translate('Subject')}}</b></label>
                        <input type="text" disabled value="{{ $support_ticket->subject }}" class="form-control">
                    </div>
                    <div class="form-group mb-3">
                        <label for="commission_type"><b>{{translate('Details')}}</b></label>
                        <p class="">@php echo $support_ticket->description @endphp</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

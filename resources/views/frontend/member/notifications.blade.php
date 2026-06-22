@extends('frontend.layouts.member_panel')
@section('panel_content')
    <div class="card">
        <div class="card-header">
            <h6>{{ translate('Notifications') }}</h6>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-raw">
                @if(!$notifications->isEmpty())
                    @foreach($notifications as $notification)
                        @php
                            $check = 'done';
                            $notify_data = json_decode($notification->data);
                            $user = \App\User::where('id',$notify_data->notify_by)->first();
                        @endphp
                        @if($notify_data->type == 'express_interest')
                            @php
                                $interest_data = App\Models\ExpressInterest::where('id', $notify_data->info_id)->first();
                                if(empty($interest_data))
                                {
                                    $check = 'not_done';
                                }
                            @endphp
                        @endif
                        @if($check == 'done')
                            <li class="list-group-item d-flex justify-content-between align-items-start hov-bg-soft-primary">
                                <a href="{{ route('notification_view', $notification->id) }}" class="media text-inherit">
                                    <span class="avatar avatar-sm mr-3">
                                        <img src="{{ uploaded_asset($user->photo) }}">
                                    </span>
                                    <div class="media-body">
                                        <p class="mb-1">{{ $notify_data->message }}</p>
                                        <small class="text-muted">{{ Carbon\Carbon::parse($notification->created_at)->diffForHumans() }}</small>
                                    </div>
                                </a>
                                @if($notification->read_at == null)
                                    <button class="btn p-0" data-toggle="tooltip" data-title="{{ translate('New') }}">
                                        <span class="badge badge-md  badge-dot badge-circle badge-primary"></span>
                                    </button>
                                @endif
                            </li>
                        @endif
                    @endforeach
                @else
                    <li class="list-group-item">
                        <div class="text-center">
                            <i class="las la-frown la-4x mb-4 opacity-40"></i>
                            <h4>{{ translate('Nothing Found') }}</h4>
                        </div>
                    </li>
                @endif
            </ul>
            <div class="aiz-pagination aiz-pagination-center">
                {{ $notifications->links() }}
            </div>
        </div>
    </div>
@endsection

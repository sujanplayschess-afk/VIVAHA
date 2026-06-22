@extends('admin.layouts.app')
@section('content')

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header row gutters-5">
                <div class="col text-center text-md-left">
                    <h5 class="mb-md-0 h6">{{translate('My Tickets')}}</h5>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control form-control-sm" placeholder="Search for...">
                        <div class="input-group-append">
                            <button class="btn btn-light" type="submit">
                                <i class="las la-search la-rotate-270"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive-sm">
                    <table class="table aiz-table mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th data-breakpoints="md">{{translate('Ticket ID')}}</th>
                                <th>{{translate('Subject')}}</th>
                                <th data-breakpoints="md">{{translate('Member')}}</th>
                                <th data-breakpoints="md">{{translate('Priority')}}</th>
                                <th data-breakpoints="md">{{translate('Category')}}</th>
                                <th data-breakpoints="md">{{translate('Last Reply')}}</th>
                                <th data-breakpoints="md">{{translate('Suport Agent')}}</th>
                                <th data-breakpoints="md">{{translate('Submitted Date')}}</th>
                                <th data-breakpoints="md">{{translate('New Reply')}}</th>
                                <th class="text-right">{{translate('Option')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($my_tickets as $key => $my_ticket)
                                <tr>
                                    <td>{{ ($key+1) + ($my_tickets->currentPage() - 1)*$my_tickets->perPage() }}</td>
                                    <td>{{ $my_ticket->ticket_id }} @if ($my_ticket->seen == '0') <span class="badge badge-inline badge-success float-right">{{translate('New')}}</span> @endif</td>
                                    <td>{{ $my_ticket->subject }}</td>
                                    <td>
                                        @if ($my_ticket->sender != null)
                                            {{ $my_ticket->sender->first_name.' '.$my_ticket->sender->last_name }}
                                        @endif
                                    </td>
                                    <td class="text-capitalize">{{ $my_ticket->priority }}</td>
                                    <td>
                                        @if ($my_ticket->supportCategory != null)
                                            {{ $my_ticket->supportCategory->name }}
                                        @endif
                                    </td>
                                    <td>
                                        @if (count($my_ticket->supportTicketReplies) > 0)
                                            {{ $my_ticket->supportTicketReplies->last()->created_at }}
                                        @else
                                            {{ $my_ticket->created_at }}
                                        @endif
                                    </td>
                                    <td>
                                        @if ($my_ticket->assigned_user_id != null)
                                            {{ $my_ticket->assigned->first_name.' '.$my_ticket->assigned->last_name }}
                                        @else
                                            {{translate('No Agent')}}
                                        @endif
                                    </td>
                                    <td>{{ $my_ticket->created_at }}</td>
                                    <td>
                                        @php $new_reply = count($my_ticket->supportTicketReplies->where('seen',0)->where('replied_user_id','!=',Auth::user()->id)) @endphp
                                        @if($new_reply > 0)
                                            <span class="badge badge-inline badge-success">{{ $new_reply }}</span>
                                        @else
                                            0
                                        @endif
                                    </td>
                                    <td>
                                        @can('reply_to_my_ticket')
                                            <a href="{{route('support-tickets.show', encrypt($my_ticket->id))}}" class="btn btn-soft-primary btn-icon btn-circle btn-sm" title="{{ translate('Reply') }}">
                                                <i class="las la-edit"></i>
                                            </a>
                                        @endcan
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class="aiz-pagination">
                        {{ $my_tickets->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('modal')
    @include('modals.delete_modal')
@endsection

@extends('admin.layouts.app')
@section('content')

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header row gutters-5">
                <div class="col text-center text-md-left">
                    <h5 class="mb-md-0 h6">{{translate('All Active Tickets')}}</h5>
                </div>
            </div>
            <div class="card-body">
                <table class="table aiz-table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th data-breakpoints="md">{{ translate('Ticket') }}</th>
                            <th>{{ translate('Subject') }}</th>
                            <th data-breakpoints="md">{{ translate('Member') }}</th>
                            <th data-breakpoints="md">{{ translate('Priority') }}</th>
                            <th data-breakpoints="md">{{ translate('Category') }}</th>
                            <th data-breakpoints="md">{{ translate('Suport Agent') }}</th>
                            <th data-breakpoints="md">{{ translate('Submitted Date') }}</th>
                            <th data-breakpoints="md">{{ translate('New Reply') }}</th>
                            <th class="text-right">{{ translate('Options') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($support_tickets as $key => $support_ticket)
                            <tr>
                                <td>{{ ($key+1) + ($support_tickets->currentPage() - 1)*$support_tickets->perPage() }}</td>
                                <td>
                                    {{ $support_ticket->ticket_id }}
                                    @if ($support_ticket->seen == '0')
                                        <span class="badge badge-inline badge-success float-right">{{translate('New')}}</span>
                                    @endif
                                </td>
                                <td>{{ $support_ticket->subject }}</td>
                                <td>
                                    {{ $support_ticket->sender->first_name.' '. $support_ticket->sender->last_name }}
                                </td>
                                <td class="text-capitalize">{{ $support_ticket->priority }}</td>
                                <td>{{ $support_ticket->supportCategory->name }}</td>
                                <td>
                                    @if ($support_ticket->assigned_user_id != null)
                                        {{ $support_ticket->assigned->first_name.' '.$support_ticket->assigned->last_name }}
                                    @else
                                        {{translate('No Agent')}}
                                    @endif
                                </td>
                                <td>{{ $support_ticket->created_at }}</td>
                                <td class="text-center">
                                    @php $new_reply = count($support_ticket->supportTicketReplies->where('seen',0)->where('replied_user_id','!=',Auth::user()->id)) @endphp
                                    @if($new_reply > 0)
                                        <span class="badge badge-inline badge-success">{{ $new_reply }}</span>
                                    @else
                                        0
                                    @endif
                                </td>
                                <td class="text-right">
                                    @can('assign_ticket_to_agent')
                                        <a href="{{ route('support-tickets.edit', encrypt($support_ticket->id)) }}" class="btn btn-soft-primary btn-icon btn-circle btn-sm" title="{{ translate('Assign an Agent') }}">
                                            <i class="las la-mercury"></i>
                                        </a>
                                    @endcan
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="aiz-pagination">
                    {{ $support_tickets->links() }}
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

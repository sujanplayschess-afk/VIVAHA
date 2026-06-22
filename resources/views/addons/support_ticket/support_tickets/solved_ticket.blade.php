@extends('admin.layouts.app')
@section('content')

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <form class="" id="solved_ticket_list" action="" method="GET">
                <div class="card-header row gutters-5">
                    <div class="col text-center text-md-left">
                        <h5 class="mb-md-0 h6">{{translate('Solved Tickets')}}</h5>
                    </div>
                    <div class="col-md-3 ml-auto">
                        <select class="form-control form-control-sm aiz-selectpicker mb-2 mb-md-0" name="priority" id="priority" onchange="solved_ticket_list()">
                            <option value="">Sort by options</option>
                            <option value="regular" @isset($priority) @if($priority == 'regular') selected @endif @endisset>{{translate('Priority (Regular)')}}</option>
                            <option value="low" @isset($priority) @if($priority == 'low') selected @endif @endisset>{{translate('Priority (Low)')}}</option>
                            <option value="medium" @isset($priority) @if($priority == 'medium') selected @endif @endisset>{{translate('Priority (Medium)')}}</option>
                            <option value="high" @isset($priority) @if($priority == 'high') selected @endif @endisset>{{translate('Priority (High)')}}</option>
                        </select>
                    </div>
                    <div class="col-md-3 ml-auto">
                        <select class="form-control form-control-sm aiz-selectpicker mb-2 mb-md-0" name="type" id="type" onchange="solved_ticket_list()">
                            <option value="">{{translate('Sort by options')}}</option>
                            <option value="created_at,asc" @isset($col_name , $query) @if($col_name == 'created_at' && $query == 'asc') selected @endif @endisset>{{translate('Sort by Time (Old > New)')}}</option>
                            <option value="created_at,desc" @isset($col_name , $query) @if($col_name == 'created_at' && $query == 'desc') selected @endif @endisset>{{translate('Sort by Time (New > Old)')}}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control form-control-sm" placeholder="Type Ticket no and Hit Enter" name="search" @isset($sort_search) value="{{ $sort_search }}" @endisset>
                            <div class="input-group-append">
                                <button class="btn btn-light" type="submit">
                                    <i class="las la-search la-rotate-270"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card-body">
                <div class="table-responsive-sm">
                    <table class="table aiz-table mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th data-breakpoints="md">{{ translate('Ticket') }}</th>
                                <th>{{ translate('Subject') }}</th>
                                <th data-breakpoints="md">{{translate('Member')}}</th>
                                <th data-breakpoints="md">{{translate('Priority')}}</th>
                                <th data-breakpoints="md">{{translate('Category')}}</th>
                                <th data-breakpoints="md">{{translate('Suport Agent')}}</th>
                                <th data-breakpoints="md">{{translate('Submitted Date')}}</th>
                                <th width="10%" class="text-right">{{translate('Option')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($support_tickets as $key => $support_ticket)
                                <tr class="clickable-row" data-href="{{ route('support-tickets.show', encrypt($support_ticket->id)) }}">
                                    <td>{{ ($key+1) + ($support_tickets->currentPage() - 1)*$support_tickets->perPage() }}</td>
                                    <td>{{ $support_ticket->ticket_id }}</td>
                                    <td>{{ $support_ticket->subject }} @if ($support_ticket->seen == '0') <span class="badge badge-success float-right">New</span> @endif</td>
                                    <td>
                                        @if ($support_ticket->sender != null)
                                            {{ $support_ticket->sender->first_name.' '. $support_ticket->sender->last_name }}
                                        @endif
                                    </td>
                                    <td class="text-capitalize">{{ $support_ticket->priority }}</td>
                                    <td>
                                        @if ($support_ticket->supportCategory != null)
                                            {{ $support_ticket->supportCategory->name }}
                                        @endif
                                    </td>
                                    <td>
                                        @if ($support_ticket->assigned_user_id != null)
                                            {{ $support_ticket->assigned->first_name.' '.$support_ticket->assigned->last_name }}
                                        @else
                                            {{translate('No Agent')}}
                                        @endif
                                    </td>
                                    <td>{{ $support_ticket->created_at }}</td>
                                    <td class="text-right">
                                        @can('reply_to_solved_tickets')
                                            <a class="btn btn-soft-primary btn-icon btn-circle btn-sm" href="{{route('support-tickets.show', encrypt($support_ticket->id))}}" title="{{ translate('Reply') }}">
                                                <i class="las la-edit"></i>
                                            </a>
                                        @endcan
                                        @can('delete_solved_tickets')
                                            <a href="#" class="btn btn-soft-danger btn-icon btn-circle btn-sm confirm-delete" data-href="{{route('support-tickets.destroy', $support_ticket->id)}}" title="{{ translate('Delete') }}">
                                                <i class="las la-trash"></i>
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
</div>

@endsection

@section('modal')
    @include('modals.delete_modal')
@endsection

@section('script')
<script type="text/javascript">
    function solved_ticket_list(el){
        $('#solved_ticket_list').submit();
    }
</script>
@endsection

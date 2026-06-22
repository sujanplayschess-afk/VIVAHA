@extends('frontend.layouts.app')
@section('content')

    <section class="py-5">
        <div class="container">
            <div class="d-flex align-items-start">
                @include('frontend.member.sidebar')
                <div class="aiz-user-panel">
                    <div class="aiz-titlebar mt-2 mb-4">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h1 class="h3">{{ translate('Support Tickets') }}</h1>
                            </div>
							<div class="col-md-6 text-md-right">
								<a href="{{ route('support-tickets.user_ticket_create') }}" class="btn btn-primary">
									<i class="las la-plus"></i>
									<span>{{ translate('Create New Ticket') }}</span>
								</a>
							</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header row gutters-5">
                            <div class="col text-center text-md-left">
                              <h5 class="mb-md-0 h6">{{ translate('All Tickets') }}</h5>
                            </div>
                              <div class="col-md-3 ml-auto">
                                <select class="form-control aiz-selectpicker" name="delivery_status" id="delivery_status" onchange="sort_orders()">
                                    <option value="showCategoryByFilterSelect1" selected>{{ translate('All') }}</option>
                                    <option value="showCategoryByFilterSelect2">{{ translate('Pending') }}</option>
                                    <option value="showCategoryByFilterSelect2">{{ translate('Opened') }}</option>
                                    <option value="showCategoryByFilterSelect3">{{ translate('Solved') }}</option>
                                </select>
                              </div>
                        </div>
                        <div class="card-body">
                            <table class="table aiz-table mb-0">
                                <thead>
                                    <tr>
                                        <th data-breakpoints="md">#</th>
                                        <th>{{ translate('ID') }}</th>
                                        <th>{{ translate('Status') }}</th>
                                        <th data-breakpoints="md">{{ translate('Subject') }}</th>
                                        <th data-breakpoints="md">{{ translate('Category') }}</th>
                                        <th data-breakpoints="md">{{ translate('Created at') }}</th>
                                        <th data-breakpoints="md">{{ translate('New Reply') }}</th>
                                        <th data-breakpoints="md" class="text-right">{{ translate('Action') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($support_tickets as $key => $support_ticket)
                                        <tr>
                                            <td>{{ ($key+1) + ($support_tickets->currentPage() - 1)*$support_tickets->perPage() }}</td>
                                            <th>{{ $support_ticket->ticket_id }}</th>
                                            <td>
                                                @if ($support_ticket->status == '1')
                                                    <span class="badge badge-inline badge-success">{{translate('Solved')}}</span>
                                                @else
                                                    <span class="badge badge-inline badge-danger">{{translate('Pending')}}</span>
                                                @endif
                                            </td>
                                            <td>{{ $support_ticket->subject }}</td>
                                            <td>{{ $support_ticket->supportCategory->name }}</td>
                                            <td>{{ $support_ticket->created_at }}</td>
                                            <td>
                                                @php $new_reply = count($support_ticket->supportTicketReplies->where('seen',0)->where('replied_user_id','!=',Auth::user()->id)) @endphp
                                                @if($new_reply > 0)
                                                    <span class="badge badge-inline badge-success">{{ $new_reply }}</span>
                                                @else
                                                    0
                                                @endif
                                            </td>
                                            <td class="text-right">
                                                <a class="btn btn-xs btn-soft-primary" href="{{ route('support-tickets.user_view_details', encrypt($support_ticket->id)) }}">{{ translate('View details') }}</a>
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
    </section>
@endsection

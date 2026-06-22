@extends('frontend.layouts.member_panel')

@section('panel_content')
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0 h6">{{ translate('Photo View Requests') }}</h5>
        </div>
        <div class="card-body">
            <table class="table aiz-table mb-0">
              <thead>
                  <tr>
                      <th>#</th>
                      <th>{{translate('Image')}}</th>
                      <th>{{translate('Name')}}</th>
                      <th>{{translate('Age')}}</th>
                      <th class="text-center">{{translate('Action')}}</th>
                  </tr>
              </thead>
              <tbody>
                  @foreach ($requests as $key => $photo_request)
                      @php $sender = \App\User::findOrFail($photo_request->sender_id); @endphp
                      <tr>
                          <td>{{ ($key+1) + ($requests->currentPage() - 1)*$requests->perPage() }}</td>
                          <td>
                              <a href="{{ route('member_profile', $sender->id) }}" class="text-reset c-pointer">
                                  @if(uploaded_asset($sender->photo) != null)
                                      <img class="img-md" src="{{ uploaded_asset($sender->photo) }}" height="45px"  alt="{{translate('photo')}}">
                                  @else
                                      <img class="img-md" src="{{ static_asset('assets/img/avatar-place.png') }}" height="45px"  alt="{{translate('photo')}}">
                                  @endif
                              </a>
                          </td>
                          <td>
                              <a href="{{ route('member_profile', $sender->id) }}" class="text-reset c-pointer">
                                  {{ $sender->first_name.' '.$sender->last_name }}
                              </a>
                          </td>
                          <td>{{ \Carbon\Carbon::parse($sender->member->birthday)->age }}</td>
                          <td class="text-center">
                              @if($photo_request->status == 0)
                                 <a href="javascript:void(0);" onclick="accept_request({{ $photo_request->id }})" class="btn btn-soft-success btn-icon btn-circle btn-sm" title="{{ translate('Accept') }}">
          							<i class="las la-check"></i>
          						</a>
                      			<a href="javascript:void(0);" onclick="reject_request({{ $photo_request->id }})" class="btn btn-soft-danger btn-icon btn-circle btn-sm" title="{{ translate('Reject') }}">
                      				<i class="las la-times"></i>
                      			</a>
                              @elseif($photo_request->status == 1)
                                 <span class="badge badge-inline badge-success">{{translate('Accepted')}}</span>
                              @else
                                 <span class="badge badge-inline badge-danger">{{translate('Rejected')}}</span>
                              @endif
                          </td>
                      </tr>
                  @endforeach
              </tbody>
            </table>
            <div class="aiz-pagination">
                {{ $requests->links() }}
            </div>
        </div>
    </div>
@endsection

@section('modal')
    <div class="modal fade" id="accept_modal">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{translate('Accept Request!')}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body text-center">
                    <form action="{{ route('member.photo_view_request_accept') }}" method="POST">
                        @csrf
                        <input type="hidden" name="id" id="accept_id" value="">
                        <p class="mt-1">{{translate('Are you sure you want to grant photo access?')}}</p>
                        <button type="button" class="btn btn-light mt-2" data-dismiss="modal">{{translate('Cancel')}}</button>
                        <button type="submit" class="btn btn-success mt-2">{{translate('Confirm')}}</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="reject_modal">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{translate('Reject Request !')}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body text-center">
                    <form action="{{ route('member.photo_view_request_reject') }}" method="POST">
                        @csrf
                        <input type="hidden" name="id" id="reject_id" value="">
                        <p class="mt-1">{{translate('Are you sure you want to reject this request?')}}</p>
                        <button type="button" class="btn btn-light mt-2" data-dismiss="modal">{{translate('Cancel')}}</button>
                        <button type="submit" class="btn btn-danger mt-2">{{translate('Confirm')}}</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
<script type="text/javascript">
    function accept_request(id) {
        $('#accept_id').val(id);
        $('#accept_modal').modal('show');
    }
    function reject_request(id) {
        $('#reject_id').val(id);
        $('#reject_modal').modal('show');
    }
</script>
@endsection

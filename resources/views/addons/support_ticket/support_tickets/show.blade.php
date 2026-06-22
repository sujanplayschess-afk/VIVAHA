@extends('admin.layouts.app')
@section('content')

    <div class="card">
        <div class="card-header">
            <h1 class="page-title h6">{{$support_ticket->subject}}</h1>
            <ul class="list-inline small text-muted mb-0">
                <li class="list-inline-item">{{$support_ticket->ticket_id}}</li>
                <li class="list-inline-item text-muted">•</li>
                <li class="list-inline-item">{{$support_ticket->created_at}}</li>
                <li class="list-inline-item text-muted">•</li>
                <li class="list-inline-item">
                    @if ($support_ticket->status == '1')
                        <span class="badge badge-inline badge-success">{{translate('Solved')}}</span>
                    @else
                        <span class="badge badge-inline badge-danger">{{translate('Pending')}}</span>
                    @endif
                </li>
            </ul>
        </div>
       <div class="card-body">

           <div class="">
               <form class="needs-validation" id="ticket-reply-form"  novalidate name="chat-form" action="{{ route('support-ticket.admin_reply') }}" method="POST" enctype="multipart/form-data">
                   @csrf
                   <input type="hidden" name="support_ticket_id" value="{{ $support_ticket->id }}">
                   <input type="hidden" name="status" value="{{ $support_ticket->status }}" required>
                   <div class="mb-2">
                     <textarea class="aiz-text-editor" name="reply" required></textarea>
                   </div>
                   <div class="row mt-3">
                       <div class="col">
                           <div class="form-group d-flex">
                               <div class="align-self-baseline input-group-sm" data-toggle="aizuploader" data-multiple="true">
                                   <button type="button" class="btn btn-secondary btn-sm">
                                       <i class="la la-paperclip"></i>
                                   </button>
                                   <input type="hidden" name="attachments" class="selected-files">
                               </div>
                               <div class="file-preview box sm flex-grow-1 ml-3"></div>
                           </div>
                       </div>
                       <div class="col-md-4 text-right">
                         <button type="submit" class="btn btn-sm btn-danger" onclick="submit_reply(0)">{{ translate('Submit as Pending') }}</button>
                         <button type="submit" class="btn btn-sm btn-success" onclick="submit_reply(1)">{{ translate('Submit as Solved') }}</button>
                       </div>
                   </div>
               </form>
           </div>

           <ul class="list-group mb-0 mt-4">
               @foreach ($support_ticket->supportTicketReplies as $key => $support_reply)
                   <li class="list-group-item py-3">
                       <div class="media">
                         <span class="avatar avatar-sm mr-3 flex-shrink-0">
                             @if ($support_reply->repliedBy->photo != null)
                                 <img src="{{ uploaded_asset($support_reply->repliedBy->photo) }}">
                             @else
                                 <img src="{{ static_asset('assets/frontend/default/img/avatar-place.png') }}">
                             @endif
                         </span>
                           <div class="media-body">
                               <div class="mb-3 mb-sm-0">
                                   <div class="mb-2">
                                       <h1 class="d-inline-block h6 my-0">
                                           <a class="d-block mb-0">{{ $support_reply->repliedBy->name }}</a>
                                       </h1>

                                       <small class="d-block text-muted">{{ Carbon\Carbon::parse($support_reply->created_at)->diffForHumans() }}</small>
                                   </div>
                               </div>
                               <div>@php echo $support_reply->reply @endphp</div>
                               <div class="file-preview box clearfix">
                                 @foreach (explode(",",$support_reply->attachments) as $attachment_id)
                                     @php
                                         $attachment = \App\Upload::find($attachment_id);
                                     @endphp
                                      @if ($attachment != null)
                                      <div class="mt-2 file-preview-item" title="{{ $attachment->file_name }}">
                                          <a href="{{ route('download_attachment', $attachment->id) }}" target="_blank" class="d-block">
                                              <div class="thumb">
                                                  @if($attachment->type == 'image')
                                                      <img src="{{ uploaded_asset($attachment_id) }}" class="img-fit">
                                                  @else
                                                      <i class="la la-file-text"></i>
                                                  @endif
                                                 </div>
                                                 <div class="body">
                                                     <h6 class="d-flex">
                                                         <span class="text-truncate title">{{ $attachment->file_original_name }}</span>
                                                         <span class="ext">.{{ $attachment->extension }}</span>
                                                     </h6>
                                                     <p>{{formatBytes($attachment->file_size)}}</p>
                                                 </div>
                                             </a>
                                         </div>
                                     @endif
                                 @endforeach
                               </div>
                           </div>
                       </div>
                   </li>
               @endforeach
               <li class="list-group-item py-5">
                   <div class="media">
                     <span class="avatar avatar-sm mr-3 flex-shrink-0">
                         @if ($support_ticket->sender->photo != null)
                             <img src="{{ uploaded_asset($support_ticket->sender->photo) }}">
                         @else
                             <img src="{{ static_asset('assets/frontend/default/img/avatar-place.png') }}">
                         @endif
                     </span>

                       <div class="media-body">
                           <div class="mb-3 mb-sm-0">
                               <div class="mb-2">
                                   <a class="d-block mb-0">{{ $support_ticket->sender->name }}</a>
                                   <small class="d-block text-muted">{{ Carbon\Carbon::parse($support_ticket->created_at)->diffForHumans() }}</small>
                               </div>
                           </div>
                           <div>@php echo $support_ticket->description  @endphp</div>

                           <div class="file-preview box clearfix">
                             @foreach (explode(",",$support_ticket->attachments) as $attachment_id)
                                 @php
                                     $attachment = \App\Upload::find($attachment_id);
                                 @endphp
                                  @if ($attachment != null)
                                   <div class="mt-2 file-preview-item" title="{{ $attachment->file_name }}">
                                     <a href="{{ route('download_attachment', $attachment->id) }}" target="_blank" class="d-block">
                                         <div class="thumb">
                                             @if($attachment->type == 'image')
                                                 <img src="{{ uploaded_asset($attachment_id) }}" class="img-fit">
                                             @else
                                                 <i class="la la-file-text"></i>
                                             @endif
                                             </div>
                                             <div class="body">
                                                 <h6 class="d-flex">
                                                     <span class="text-truncate title">{{ $attachment->file_original_name }}</span>
                                                     <span class="ext">.{{ $attachment->extension }}</span>
                                                 </h6>
                                                 <p>{{formatBytes($attachment->file_size)}}</p>
                                             </div>
                                         </a>
                                     </div>
                                 @endif
                             @endforeach
                           </div>
                       </div>
                   </div>
               </li>
           </ul>
        </div>

    </div>
@endsection

@section('script')
    <script type="text/javascript">
        function submit_reply(status){
            $('input[name=status]').val(status);
            if($('textarea[name=reply]').val().length > 0){
                $('#ticket-reply-form').submit();
            }
        }
    </script>
@endsection

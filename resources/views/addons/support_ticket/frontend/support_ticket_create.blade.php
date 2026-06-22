@extends('frontend.layouts.app')
@section('content')

    <section class="py-5">
        <div class="container">
            <div class="d-flex align-items-start">
                @include('frontend.member.sidebar')
                <div class="aiz-user-panel">
                    <div class="aiz-titlebar mt-2 mb-4">
                        <div class="align-items-center">
                            <h1 class="h3">{{ translate('Create a ticket') }}</h1>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header row gutters-5">
                            <div class="col text-center text-md-left">
                              <h5 class="mb-md-0 h6">{{ translate('Create Ticket') }}</h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <form class="form-horizontal" action="{{ route('support-ticket.store') }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                <div class="form-group row">
                                    <label class="col-sm-2 col-from-label">{{ translate('Subject') }}</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control form-control-sm" name="subject" value="" placeholder="Enter ticket subject">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-from-label">{{ translate('Support category') }}</label>
                                    <div class="col-sm-10">
                                        <select class="form-control aiz-selectpicker" name="support_category_id" required data-placeholder="Select support category">
                                            @foreach ($support_categories as $key => $support_category)
                                                <option value="{{ $support_category->id }}">{{ $support_category->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-from-label">{{ translate('Details') }}</label>
                                    <div class="col-sm-10">
                                        <textarea class="aiz-text-editor" name="description"></textarea>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-from-label">{{ translate('File Attachment') }}</label>
                                    <div class="col-sm-10">
                                        <div class="input-group input-group-sm" data-toggle="aizuploader" data-multiple="true">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse') }}</div>
                                            </div>
                                            <div class="form-control file-amount">{{ translate('Choose File') }}</div>
                                            <input type="hidden" name="attachments" class="selected-files">
                                        </div>
                                        <div class="file-preview"></div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <button type="submit" class="btn btn-sm btn-primary transition-3d-hover mr-1">{{translate('Send ticket')}}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

@endsection

@extends('admin.layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-8 mx-auto">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{translate('Add New Package')}}</h5>
                </div>
                <div class="card-body">
                    <form action="{{ route('packages.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Name')}}</label>
                            <div class="col-md-9">
                                <input type="text" name="name" class="form-control" placeholder="{{translate('Package Name')}}" required>
                                @error('name')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Price')}}</label>
                            <div class="col-md-9">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">
                                        @php echo \App\Models\Currency::where('id', get_setting('system_default_currency'))->first()->symbol; @endphp
                                      </span>
                                    </div>
                                    <input type="number" name="price" class="form-control" placeholder="{{translate('Price')}}" min="0" required>
                                </div>
                                @error('price')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Package Image')}}</label>
                            <div class="col-md-9">
                                <div class="input-group input-group-sm" data-toggle="aizuploader" data-type="image">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text bg-soft-secondary font-weight-medium">{{translate('Browse')}}</div>
                                    </div>
                                    <div class="form-control file-amount">{{translate('Choose Photo')}}</div>
                                    <input type="hidden" name="package_image" class="selected-files" >
                                </div>
                                <div class="file-preview box"></div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Express Interest')}}</label>
                            <div class="col-md-9">
                                <input type="number" name="express_interest" class="form-control" placeholder="{{translate('Eg. 10')}}" min="0" required>
                                @error('express_interest')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Photo Gallery')}}</label>
                            <div class="col-md-9">
                                <input type="number" name="photo_gallery" class="form-control" placeholder="{{translate('Eg. 10')}}" required>
                                @error('photo_gallery')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('View Contact Info')}}</label>
                            <div class="col-md-9">
                                <input type="number" name="contact" class="form-control" placeholder="{{translate('Eg. 10')}}" required>
                                @error('contact')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Validity For')}}</label>
                            <div class="col-md-9">
                                <div class="input-group">
                                    <input type="number" name="validity" class="form-control" placeholder="{{translate('Eg. 30')}}" min="0" required>
                                    <div class="input-group-prepend"><span class="input-group-text">{{translate('Days')}}</span></div>
                                </div>
                                @error('validity')
                                    <small class="form-text text-danger">{{ $message }}</small>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{translate('Auto Profile Matching Show')}}</label>
                            <div class="col-md-8 mt-3">
                                <label class="aiz-switch aiz-switch-success mb-0">
                                    <input type="checkbox" checked="checked" name="auto_profile_match">
                                    <span></span>
                                </label>
                            </div>
                        </div>

                        <div class="form-group mb-3 text-right">
                            <button type="submit" class="btn btn-primary">{{translate('Add New Package')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

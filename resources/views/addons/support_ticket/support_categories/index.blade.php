@extends('admin.layouts.app')
@section('content')
<div class="row">
    <div class="@if(auth()->user()->can('add_support_category')) col-lg-7 @else col-lg-12 @endif">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{ translate('All Support Categories') }}</h5>
            </div>
            <div class="card-body">
                <table class="table aiz-table mb-0">
                    <thead>
                        <tr>
                          <th>#</th>
                          <th>{{ translate('Name') }}</th>
                          <th class="text-right">{{ translate('Options') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                      @foreach ($support_categories as $key => $support_category)
                          <tr>
                              <td>{{ $key+1 }}</td>
                              <td>{{ $support_category->name }}</td>
                              <td class="text-right">
                                @can('edit_support_category')
                                    <a href="#" class="btn btn-soft-primary btn-icon btn-circle btn-sm" onclick="category_edit_modal('{{ route('support-categories.edit', $support_category->id) }}')" title="{{ translate('Edit') }}">
                                        <i class="las la-edit"></i>
                                    </a>
                                @endcan
                                @can('delete_support_category')
                                    <a href="#" class="btn btn-soft-danger btn-icon btn-circle btn-sm confirm-delete" data-href="{{route('support_categories.destroy', $support_category->id)}}"title="{{ translate('Delete') }}">
                                        <i class="las la-trash"></i>
                                    </a>
                                @endcan
                              </td>
                          </tr>
                      @endforeach
                    </tbody>
                    {{ $support_categories->links() }}
                </table>
            </div>
        </div>
    </div>
    @can('add_support_category')
    <div class="col-lg-5">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{ translate('Add New Category') }}</h5>
            </div>
            <div class="card-body">
              <form class="form-horizontal" action="{{ route('support-categories.store') }}" method="POST" enctype="multipart/form-data">
                  @csrf
                  <div class="form-group mb-3">
                      <label for="name">{{ translate('Category Name') }}</label>
                      <input type="text" id="name" name="name" class="form-control" required>
                  </div>
                  <div class="form-group mb-3 text-right">
                      <button type="submit" class="btn btn-success btn-rounded">{{ translate('Save') }}</button>
                  </div>
              </form>
            </div>
        </div>
    </div>
    @endcan
</div>



@endsection
@section('modal')

    @include('modals.delete_modal')

    <!-- Support Category edit modal -->
    <div class="modal fade" id="support_category_edit_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ translate('Edit Support Category') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="support_category_edit_modal_content">

                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script type="text/javascript">

        function category_edit_modal(url){
            $.get(url, function(data){
                $('#support_category_edit_modal').modal('show', {backdrop: 'static'});
                $('#support_category_edit_modal_content').html(data);
            });
        }
    </script>
@endsection

<form class="form-horizontal" action="{{route('support-categories.update', $support_category->id)}}" method="POST" enctype="multipart/form-data">
    <input name="_method" type="hidden" value="PATCH">
    @csrf
    <div class="form-group mb-3">
        <label for="name">{{ translate('Category Name') }}</label>
        <input type="text" id="name" name="name" value="{{ $support_category->name }}" class="form-control" required>
    </div>
    <div class="form-group text-right">
        <button type="submit" class="btn btn-sm btn-primary transition-3d-hover mr-1">{{translate('Update')}}</button>
    </div>
</form>

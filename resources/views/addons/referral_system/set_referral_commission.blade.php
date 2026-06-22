@extends('admin.layouts.app')
@section('content')
<div class="row">
    <div class="col-lg-9 mx-auto">
      <div class="card">
          <div class="card-header">
              <h5 class="mb-0 h6">{{translate('Set Referral Commissions')}}</h5>
          </div>
          <div class="card-body">
              <form class="form-horizontal" action="{{ route('settings.update') }}" method="POST">
                  @csrf
                  @php $currency_symbol = \App\Models\Currency::where('id',get_setting('system_default_currency'))->first()->symbol; @endphp
                  <div class="form-group row">
                     <label for="name" class="col-md-5">{{ translate('Referred by User Commission on Referral Users First Package Purchase.') }}</label>
                      <div class="form-group col-md-7">
                        <div class="input-group">
                            <input type="hidden" name="types[]" value="referred_by_user_commission">
                            <input type="number" name="referred_by_user_commission" value="{{ get_setting('referred_by_user_commission') }}" min="0"  step="0.01" placeholder="" class="form-control" required>
                          <div class="input-group-append">
                            <span class="input-group-text">{{$currency_symbol}}</span>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label for="name" class="col-md-5">{{ translate('Referral Users First Package Purchase Discount.') }}</label>
                    <div class="form-group col-md-4">
                        <div class="input-group">
                            <input type="hidden" name="types[]" value="referral_user_package_purchase_discount">
                            <input type="number" name="referral_user_package_purchase_discount" value="{{ get_setting('referral_user_package_purchase_discount') }}" min="0"  step="0.01" placeholder="" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-md-3">
                      <input type="hidden" name="types[]" value="referral_user_package_purchase_discount_type">
                      @php $discount_type = get_setting('referral_user_package_purchase_discount_type'); @endphp
                      <select class="form-control aiz-selectpicker" name="referral_user_package_purchase_discount_type">
                        <option value="amount" @if($discount_type == 'amount') selected @endif>{{translate('Flat')}}</option>
                        <option value="percent" @if($discount_type == 'percent') selected @endif>{{translate('Percent')}}</option>
                      </select>
                    </div>
                  </div>

                  <div class="text-right">
                    <button type="submit" class="btn btn-sm btn-primary">{{ translate('Update') }}</button>
                  </div>
              </from>
              <i class="form-text text-danger"><b>{{ translate('Note: You need to activate wallet option first before using referral system addon.') }}</b></i>
          </div>
      </div>
    </div>
</div>
@endsection

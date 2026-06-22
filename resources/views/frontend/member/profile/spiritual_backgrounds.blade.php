<div class="card">
    <div class="card-header">
        <h5 class="mb-0 h6">{{translate('Spiritual & Social Background')}}</h5>
    </div>
    <div class="card-body">
      <form action="{{ route('spiritual_backgrounds.update', $member->id) }}" method="POST">
          <input name="_method" type="hidden" value="PATCH">
          @csrf
          <input type="hidden" name="address_type" value="present">
          <div class="form-group row">
              <div class="col-md-6">
                  <label for="member_religion_id">{{translate('Religion')}}</label>
                  <select class="form-control aiz-selectpicker" name="member_religion_id" id="member_religion_id" data-live-search="true" required>
                      <option value="">{{translate('Select One')}}</option>
                      @foreach ($religions as $religion)
                          <option value="{{$religion->id}}" @if($religion->id == $member_religion_id) selected @endif> {{ $religion->name }} </option>
                      @endforeach
                  </select>
                  @error('member_religion_id')
                      <small class="form-text text-danger">{{ $message }}</small>
                  @enderror
              </div>
              <div class="col-md-6">
                  <label for="member_caste_id">{{translate('Caste')}}</label>
                  <select class="form-control aiz-selectpicker" name="member_caste_id" id="member_caste_id" data-live-search="true" required>

                  </select>
                  @error('member_caste_id')
                      <small class="form-text text-danger">{{ $message }}</small>
                  @enderror
              </div>
          </div>
          <div class="form-group row">
              <div class="col-md-6">
                  <label for="member_sub_caste_id">{{translate('Sub Caste')}}</label>
                  <select class="form-control aiz-selectpicker" name="member_sub_caste_id" id="member_sub_caste_id" data-live-search="true">

                  </select>
              </div>
              <div class="col-md-6">
                  <label for="ethnicity">{{translate('Ethnicity')}}</label>
                  <input type="text" name="ethnicity" value="{{!empty($member->spiritual_backgrounds->ethnicity) ? $member->spiritual_backgrounds->ethnicity : "" }}" class="form-control" placeholder="{{translate('Ethnicity')}}">
                  @error('ethnicity')
                      <small class="form-text text-danger">{{ $message }}</small>
                  @enderror
              </div>
          </div>
          <div class="form-group row">
              <div class="col-md-6">
                  <label for="personal_value">{{translate('Personal Value')}}</label>
                  <input type="text" name="personal_value" value="{{!empty($member->spiritual_backgrounds->personal_value) ? $member->spiritual_backgrounds->personal_value : "" }}" class="form-control" placeholder="{{translate('Personal Value')}}">
                  @error('personal_value')
                      <small class="form-text text-danger">{{ $message }}</small>
                  @enderror
              </div>
              <div class="col-md-6">
                  <label for="family_value_id">{{translate('Family Value')}}</label>
                  <select class="form-control aiz-selectpicker" name="family_value_id" data-live-search="true">
                      <option value="">{{translate('Select One')}}</option>
                      @foreach ($family_values as $family_value)
                          <option value="{{$family_value->id}}" @if($religion->id == !empty($member->spiritual_backgrounds->ethnicity) ? $member->spiritual_backgrounds->ethnicity : "" ) selected @endif> {{ $family_value->name }}</option>
                      @endforeach
                  </select>
              </div>
          </div>
           <div class="form-group row">
               <div class="col-md-6">
                   <label for="community_value">{{translate('Community Value')}}</label>
                   <input type="text" name="community_value" value="{{!empty($member->spiritual_backgrounds->community_value) ? $member->spiritual_backgrounds->community_value : "" }}" class="form-control" placeholder="{{translate('Community Value')}}">
                   @error('community_value')
                       <small class="form-text text-danger">{{ $message }}</small>
                   @enderror
               </div>
               <div class="col-md-6">
                   <label for="gotra">{{translate('Gothra / Gotram')}}</label>
                   <input type="text" name="gotra" value="{{!empty($member->spiritual_backgrounds->gotra) ? $member->spiritual_backgrounds->gotra : "" }}" class="form-control" placeholder="{{translate('Gothra')}}">
               </div>
           </div>
           <div class="form-group row">
               <div class="col-md-4">
                   <label for="manglik">{{translate('Manglik / Dosham')}}</label>
                   <select class="form-control aiz-selectpicker" name="manglik">
                       <option value="">{{translate('Select One')}}</option>
                       <option value="Yes" @if(!empty($member->spiritual_backgrounds->manglik) && $member->spiritual_backgrounds->manglik == 'Yes') selected @endif>{{translate('Yes')}}</option>
                       <option value="No" @if(!empty($member->spiritual_backgrounds->manglik) && $member->spiritual_backgrounds->manglik == 'No') selected @endif>{{translate('No')}}</option>
                       <option value="Don't Know" @if(!empty($member->spiritual_backgrounds->manglik) && $member->spiritual_backgrounds->manglik == "Don't Know") selected @endif>{{translate("Don't Know")}}</option>
                   </select>
               </div>
               <div class="col-md-4">
                   <label for="star_nakshatra">{{translate('Star (Nakshatra)')}}</label>
                   <input type="text" name="star_nakshatra" value="{{!empty($member->spiritual_backgrounds->star_nakshatra) ? $member->spiritual_backgrounds->star_nakshatra : "" }}" class="form-control" placeholder="{{translate('e.g. Anuradha, Ashwini')}}">
               </div>
               <div class="col-md-4">
                   <label for="rashi_zodiac">{{translate('Rashi (Zodiac)')}}</label>
                   <input type="text" name="rashi_zodiac" value="{{!empty($member->spiritual_backgrounds->rashi_zodiac) ? $member->spiritual_backgrounds->rashi_zodiac : "" }}" class="form-control" placeholder="{{translate('e.g. Vrishchik, Kumbh')}}">
               </div>
           </div>
          <div class="text-right">
              <button type="submit" class="btn btn-primary btn-sm">{{translate('Update')}}</button>
          </div>
      </form>
    </div>
</div>

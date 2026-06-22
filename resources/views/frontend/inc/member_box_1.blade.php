<div class="rounded border position-relative overflow-hidden">
	<a
		@if(!Auth::check())
			onclick="loginModal()"
		@elseif(get_setting('full_profile_show_according_to_membership') == 1 && Auth::user()->membership == 1)
            href="javascript:void(0);" onclick="package_update_alert()"
        @else
            href="{{ route('member_profile', $member->id) }}"
        @endif
		class="d-block text-reset c-pointer"
	>
	@php
			$profile_picture_show = 'ok';
			$profile_picture_privacy = optional($member->member)->profile_picture_privacy;

			if(Auth::check() && Auth::user()->user_type == 'admin'){
				$profile_picture_show = 'ok';
			}
			elseif($profile_picture_privacy  == '0')
			{
				$profile_picture_show = 'no';
			}
			elseif($profile_picture_privacy == 2)
			{
				if(Auth::check()){
					if(Auth::user()->membership == 1)
					{
						$profile_picture_show = 'no';
					}
				}
				else{
					$profile_picture_show = 'no';
				}

			}

	@endphp
		<img
				@if($profile_picture_show == 'ok')
				src="{{ uploaded_asset($member->photo) }}"
				@else
				src="{{ static_asset('assets/img/avatar-place.png') }}"
				@endif
				onerror="this.onerror=null;this.src='{{ static_asset('assets/img/avatar-place.png') }}';"
				class="img-fit mw-100 h-400px"
		>

		<div class="absolute-bottom-left w-100 p-3 z-1">
			<div class="absolute-full bg-white opacity-90 z--1"></div>
			<div class="text-center">
				<div class="text-primary fw-500 mb-1">{{ $member->first_name }}</div>
            <div class="fs-10">
                <span class="opacity-60">{{ translate('Member ID: ') }}</span>
                <span class="ml-2 text-primary">{{ $member->code }}</span>
            </div>
			</div>
		</div>
	</a>
</div>

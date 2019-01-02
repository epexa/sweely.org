window.addEventListener('DOMContentLoaded', function() {

	var $requestNewBtns = document.getElementsByClassName('request-new-btn'),
		$requestNewModal = document.querySelector('#modal-form'),
		$requestNewModalForm = $requestNewModal.querySelector('form'),
		$requestLocationInput = $requestNewModalForm.querySelector('.form-control[name="request-location"]'),
		emailApiUrl = 'https://realtcrm.com';

	for (var i = 0; i < $requestNewBtns.length; i++) {
		$requestNewBtns[i].addEventListener('click', function(e) {
			e.preventDefault();
			requestNewModal.show();
		});
	}
	
	document.getElementById('detect-location-btn').addEventListener('click', function() {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(position) {
			var getQuery = new XMLHttpRequest();
			getQuery.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false&language=en', true);
			getQuery.onreadystatechange = function() {
				if (getQuery.readyState == 4) {
					var data = JSON.parse(getQuery.responseText);
					var results = data.results.reverse();
					if (results[1]) $requestLocationInput.value = results[1].formatted_address;
					else if (results[0]) $requestLocationInput.value = results[0].formatted_address;
				}
			};
			getQuery.send();
			postAjax(emailApiUrl + '/coords', { latitude: position.coords.latitude, longitude: position.coords.longitude });
		});
	});
	
	$requestNewModalForm.addEventListener('submit', function(e) {
		e.preventDefault();
		var emailVal = this.querySelector('.form-control[name="request-email"]').value,
			accountTypeVal = this.querySelector('.form-control[name="request-account-type"]').value,
			loginVal = this.querySelector('.form-control[name="request-login"]').value;
			locationVal = $requestLocationInput.value;
		postAjax(emailApiUrl + '/request', { email: emailVal, acount_type: accountTypeVal, login: loginVal, location: locationVal }, function(responseJSON) {
			/* const responseData = JSON.parse(responseJSON);
			if (responseData.succesful) {
				swal('Success!', responseData.message, 'success');
				requestNewModal.hide();
				$requestNewModalForm.reset();
			} else {
				swal('Sorry...', responseData.message, 'warning');
			} */
			swal({title: 'Thank you!', text: 'Your request is accepted, you will be notified by email!'});
			document.querySelector('.mfp-close').click();
			$requestNewModalForm.reset();
		});
	});
	
	$requestNewModalFormRequestLogin = $requestNewModalForm.querySelector('.form-control[name="request-login"]');
	$requestNewModalForm.querySelector('.form-control[name="request-email"]').addEventListener('input', function() {
		var newRequestLogin = this.value.split('@')[0];
		$requestNewModalFormRequestLogin.value = newRequestLogin;
	});;
	
	/*const subscriptionForm = document.getElementById('subscription');
	if (subscriptionForm) {
		subscriptionForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const name = e.target[1].value;
			const email = e.target[2].value;
			postAjax('/subscription', { name: name, email: email }, function(responseJSON) {
				const responseData = JSON.parse(responseJSON);
				if (responseData.succesful) {
					swal('Готово!', responseData.message, 'success');
					document.getElementById('subscribe-modal').style.display = 'none';
					subscriptionForm.reset();
				} else {
					swal('Извините...', responseData.message, 'warning');
				}
			});
		});
	}*/
	
	var $projectDetail = document.getElementById('project-detail');
	var $projectDetailBtns = document.getElementsByClassName('project-detail-btn');
	for (var i=0; i < $projectDetailBtns.length; i++) {
		$projectDetailBtns[i].addEventListener('click', function(e) {
			e.preventDefault();
			$projectDetail.style.display = 'block';
		});
	}
	
});

function postAjax(url, data, success) {
	var params = typeof data == 'string' ? data : Object.keys(data).map(
		function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
	).join('&');
	/* var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('POST', url);
	xhr.onreadystatechange = function() {
		if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(params);
	return xhr; */
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	var xhr = new XHR();
	xhr.open('GET', url + '?' + params, true);
	xhr.onload = function() {
		console.log( this );
		console.log( this.responseText );
		if (success) success(this.responseText);
	}
	xhr.onerror = function() {
		console.error('Error', this.status);
		if (this.status == 0 && success) success();
	}
	xhr.send();
}
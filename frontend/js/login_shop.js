$(document).ready(function () {
	$('.alert').hide();
	$('#login-form').on('submit', function (event) {
		event.preventDefault();

		var formData = {
			email_or_username: $('#email_or_username').val(),
			password: $('#password').val(),
			remember_me: $('#remember_me').is(':checked'),
		};

		console.log('Form data: ', formData);

		$.ajax({
			url: '../backend/public/api/login.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(formData),
			success: function (response) {
				console.log('Response: ', response);
				if (response.status === 'success') {
					// Set session or cookie based on response
					sessionStorage.setItem('userLoggedIn', true);
					sessionStorage.setItem('is_admin', response.is_admin); // Store admin status

					if (formData.remember_me) {
						document.cookie =
							'user_id=' +
							response.user_id +
							'; max-age=' +
							30 * 24 * 60 * 60 +
							'; path=/'; // 30 days
						document.cookie =
							'is_admin=' +
							response.is_admin +
							'; max-age=' +
							30 * 24 * 60 * 60 +
							'; path=/'; // Store admin status in cookie
					}

					updateUIForLoggedInUser();
					console.log('Navigating to homepage');
				} else {
					console.log('Login failed');
					showErrorAlert('Invalid login. Please try again.');
				}
			},
			error: function (xhr, status, error) {
				console.log('Error: ', xhr.responseText);
				if (xhr.status === 403) {
					showErrorAlert(
						'Your account is inactive! Please contact the Administrator for help.'
					);
				} else {
					showErrorAlert('Invalid email/username or password');
				}
			},
		});
	});

	// Function to show error alert
	function showErrorAlert(message) {
		$('.alert').text(message);
		$('.alert').show();
	}

	// Function to update UI for logged-in user
	function updateUIForLoggedInUser() {
		$('#auth-buttons').hide();
		$('#user-dropdown').show();

		if (
			sessionStorage.getItem('is_admin') === 'true' ||
			getCookie('is_admin') === 'true'
		) {
			$('#admin-dropdown').show();
		}
	}

	// Function to get cookie by name
	function getCookie(name) {
		let cookieArr = document.cookie.split(';');
		for (let i = 0; i < cookieArr.length; i++) {
			let cookiePair = cookieArr[i].split('=');
			if (name == cookiePair[0].trim()) {
				return decodeURIComponent(cookiePair[1]);
			}
		}
		return null;
	}
});

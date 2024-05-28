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
					if (formData.remember_me) {
						document.cookie =
							'user_id=' +
							response.user_id +
							'; max-age=' +
							30 * 24 * 60 * 60 +
							'; path=/'; // 30 days
					}
					updateUIForLoggedInUser();
					console.log('Navigating to homepage');
					handleNavigationClick(new Event('click'), 'homepage');
				} else {
					console.log('Login failed');
					showErrorAlert('Invalid login. Please try again.');
				}
			},
			error: function (xhr, status, error) {
				console.log('Error: ', xhr.responseText);
				showErrorAlert('Username/Email does not match the password');
			},
		});
	});

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html');
	}

	// Function to show error alert
	function showErrorAlert(message) {
		$('.alert').text(message);
		$('.alert').show();
	}

	// Function to update UI for logged-in user
	function updateUIForLoggedInUser() {
		$('#auth-buttons').hide();
		$('#user-dropdown').show();
	}
});

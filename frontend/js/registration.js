$(document).ready(function () {
	// Real-time validation for email
	$('#email').on('input', function () {
		validateEmail();
	});

	$('#password').on('input', function () {
		validatePassword();
		validatePasswordMatch();
	});

	// Real-time validation for password confirmation
	$('#confirm-password').on('input', function () {
		validatePasswordMatch();
	});

	$('#registration-form').on('submit', function (event) {
		event.preventDefault();

		// Final validation before submission
		var isValid = validateForm();

		if (isValid) {
			var formData = {
				title: $('#title').val(),
				firstname: $('#firstname').val(),
				lastname: $('#lastname').val(),
				address: $('#address').val(),
				zipcode: $('#zipcode').val(),
				city: $('#city').val(),
				email: $('#email').val(),
				username: $('#username').val(),
				password: $('#password').val(),
				confirm_password: $('#confirm-password').val(),
				payment_method: $('#payment_method').val(),
			};

			$.ajax({
				url: '../backend/public/api/registration.php',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(formData),
				success: function (response) {
					if (response.status === 'success') {
						handleNavigationClick(new Event('click'), 'login');
					} else {
						displayServerErrors(response);
					}
				},
				error: function (xhr, status, error) {
					showErrorAlert('An error occurred: ' + xhr.responseText);
				},
			});
		}
	});

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html');
	}

	// Function to validate email
	function validateEmail() {
		var email = $('#email').val();
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showErrorAlert('Invalid email address', '#email');
			return false;
		} else {
			removeErrorAlert('#email');
			return true;
		}
	}

	// Function to validate password match
	function validatePasswordMatch() {
		var password = $('#password').val();
		var confirmPassword = $('#confirm-password').val();
		if (password !== confirmPassword) {
			showErrorAlert('Passwords do not match', '#confirm-password');
			return false;
		} else {
			removeErrorAlert('#confirm-password');
			return true;
		}
	}

	function validatePassword() {
		var password = $('#password').val();
		if (password.length < 6) {
			showErrorAlert(
				'Your password must be at least 6 characters long',
				'#password'
			);
			return false;
		} else {
			removeErrorAlert('#password');
			return true;
		}
	}

	// Function to validate the entire form
	function validateForm() {
		var isValid = true;
		isValid = validateEmail() && isValid;
		isValid = validatePasswordMatch() && isValid;
		isValid = validatePassword() && isValid;
		return isValid;
	}

	// Function to display server-side errors
	function displayServerErrors(errors) {
		if (errors.email_err) {
			showErrorAlert(errors.email_err, '#email');
		}
		if (errors.username_err) {
			showErrorAlert(errors.username_err, '#username');
		}
		// Add similar checks for other fields if needed
	}

	// Function to show error alert
	function showErrorAlert(message, selector) {
		// Remove any existing alerts
		removeErrorAlert(selector);

		var alertHtml =
			'<div class="alert alert-danger mt-3" role="alert">' + message + '</div>';
		$(selector).closest('.form-group').append(alertHtml);
	}

	// Function to remove error alert
	function removeErrorAlert(selector) {
		$(selector).closest('.form-group').find('.alert').remove();
	}
});

$(document).ready(function () {
	// Fetch and display user data
	fetchUserData();

	// Show password confirmation modal on clicking Edit Profile button
	$('#edit-profile-btn').on('click', function () {
		$('#passwordConfirmModal').modal('show');
	});

	// Handle password confirmation form submission
	$('#password-confirm-form').on('submit', function (event) {
		event.preventDefault();
		var password = $('#confirm-password').val();

		$.ajax({
			url: '../backend/public/api/confirm_password.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ password: password }),
			success: function (response) {
				if (response.status === 'success') {
					$('#passwordConfirmModal').modal('hide');
					enableEditing();
					fetchUserData(false); // Fetch full user data without masking
				} else {
					alert('Incorrect password. Please try again.');
				}
			},
			error: function (xhr, status, error) {
				showErrorAlert(
					'An error occurred: ' + xhr.responseText,
					'#confirm-password'
				);
			},
		});
	});

	// Enable form fields for editing
	function enableEditing() {
		$('#profile-form input, #profile-form select').prop('disabled', false);
		$('#update-profile-btn').prop('disabled', false);
		$('#cancel-profile-btn').show();
		$('#edit-profile-btn').hide();
	}

	// Cancel editing
	$('#cancel-profile-btn').on('click', function () {
		disableEditing();
		fetchUserData(); // Reset the form fields with masked data
	});

	// Disable form fields after canceling
	function disableEditing() {
		$('#profile-form input, #profile-form select').prop('disabled', true);
		$('#update-profile-btn').prop('disabled', true);
		$('#cancel-profile-btn').hide();
		$('#edit-profile-btn').show();
	}

	// Form submission for profile update
	$('#profile-form').on('submit', function (event) {
		event.preventDefault();

		var formData = {
			title: $('#title').val(),
			firstname: $('#firstname').val(),
			lastname: $('#lastname').val(),
			address: $('#address').val(),
			zipcode: $('#zipcode').val(),
			city: $('#city').val(),
			email: $('#email').val(),
			username: $('#username').val(),
			payment_method: $('#payment_method').val(),
		};

		$.ajax({
			url: '../backend/public/api/update_profile.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(formData),
			success: function (response) {
				if (response.status === 'success') {
					alert('Profile updated successfully!');
					disableEditing();
					fetchUserData(); // Fetch user data with masking after update
				} else {
					displayServerErrors(response);
				}
			},
			error: function (xhr, status, error) {
				showErrorAlert('An error occurred: ' + xhr.responseText);
			},
		});
	});

	// Function to fetch and display user data
	function fetchUserData(mask = true) {
		// console.log('Fetching user data...');
		$.ajax({
			url: '../backend/public/api/get_user_data.php',
			type: 'GET',
			data: { mask: mask },
			success: function (response) {
				// console.log('User data fetched:', response);
				if (response.status === 'success') {
					var user = response.user;
					$('#title').val(user.title);
					$('#firstname').val(user.firstname);
					$('#lastname').val(user.lastname);
					$('#email').val(user.email);
					$('#username').val(user.username);
					$('#address').val(user.address);
					$('#zipcode').val(user.zipcode);
					$('#city').val(user.city);
					$('#payment_method').val(user.payment_method);
					$('#account-status').text('Account status: ' + user.role);
				} else {
					console.error('Failed to fetch user data:', response);
					alert('Failed to fetch user data.');
				}
			},
			error: function (xhr, status, error) {
				console.error('An error occurred:', xhr.responseText);
				showErrorAlert('An error occurred: ' + xhr.responseText);
			},
		});
	}

	// Function to display server-side errors
	function displayServerErrors(errors) {
		if (errors.email_err) {
			showErrorAlert(errors.email_err, '#email');
		}
		if (errors.username_err) {
			showErrorAlert(errors.username_err, '#username');
		}
		if (errors.current_password_err) {
			showErrorAlert(errors.current_password_err, '#current-password-modal');
		}
		if (errors.new_password_err) {
			showErrorAlert(errors.new_password_err, '#new-password-modal');
		}
		if (errors.confirm_new_password_err) {
			showErrorAlert(
				errors.confirm_new_password_err,
				'#confirm-new-password-modal'
			);
		}
		if (errors.delete_password_err) {
			showErrorAlert(errors.delete_password_err, '#delete-password-modal');
		}
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

	// Handle change password form submission
	$('#change-password-form').on('submit', function (event) {
		event.preventDefault();

		var currentPassword = $('#current-password-modal').val();
		var newPassword = $('#new-password-modal').val();
		var confirmNewPassword = $('#confirm-new-password-modal').val();

		if (newPassword !== confirmNewPassword) {
			alert('New passwords do not match.');
			return;
		}

		var formData = {
			current_password: currentPassword,
			new_password: newPassword,
		};

		$.ajax({
			url: '../backend/public/api/change_password.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(formData),
			success: function (response) {
				if (response.status === 'success') {
					alert('Password changed successfully!');
					$('#changePasswordModal').modal('hide');
				} else {
					alert('Failed to change password: ' + response.message);
				}
			},
			error: function (xhr, status, error) {
				showErrorAlert('An error occurred: ' + xhr.responseText);
			},
		});
	});
});

$(document).ready(function () {
	console.log('Document ready!');

	$('#registration-form').on('submit', function (event) {
		event.preventDefault();
		console.log('Form submitted!');

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
		};

		console.log('Form data: ', formData);

		$.ajax({
			url: '../backend/public/api/registration.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(formData),
			success: function (response) {
				console.log('Response: ', response);
				if (response.status === 'success') {
					alert('Registration successful!');
					// Use handleNavigationClick to navigate to login page
					handleNavigationClick(new Event('click'), 'login');
				} else {
					// Display validation errors
					var errors = '';
					for (var key in response) {
						if (response[key]) {
							errors += response[key] + '\n';
						}
					}
					alert(errors);
				}
			},
			error: function (xhr, status, error) {
				console.log('Error: ', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	});

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html');
	}
});

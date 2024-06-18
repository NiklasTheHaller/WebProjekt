$(document).ready(function () {
	// Fetch and display users
	fetchUsers();

	// Function to fetch users
	function fetchUsers() {
		$.ajax({
			url: '../backend/public/api/users.php',
			method: 'GET',
			success: function (response) {
				populateUserTable(response);
			},
			error: function (xhr, status, error) {
				console.error('Error fetching users: ', xhr.responseText);
			},
		});
	}

	// Function to populate the user table
	function populateUserTable(users) {
		const usersTableBody = $('#users-table tbody');
		usersTableBody.empty();
		users.forEach((user) => {
			const userRow = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.salutation}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.address}</td>
                    <td>${user.zipcode}</td>
                    <td>${user.city}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                    <td>${user.payment_method}</td>
                    <td>${user.status}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-user-btn" data-id="${user.id}">Edit</button>
                        <button class="btn btn-warning btn-sm change-password-btn" data-id="${user.id}">Change Password</button>
                    </td>
                </tr>
            `;
			usersTableBody.append(userRow);
		});

		// Attach event listeners to edit buttons
		$('.edit-user-btn').on('click', function () {
			const userId = $(this).data('id');
			fetchUserDetails(userId);
		});

		// Attach event listeners to change password buttons
		$('.change-password-btn').on('click', function () {
			const userId = $(this).data('id');
			$('#change-password-user-id').val(userId);
			$('#changePasswordModal').modal('show');
		});
	}

	// Function to fetch user details
	function fetchUserDetails(userId) {
		$.ajax({
			url: '../backend/public/api/users.php',
			method: 'GET',
			data: { id: userId },
			success: function (response) {
				populateEditForm(response);
				$('#editUserModal').modal('show');
			},
			error: function (xhr, status, error) {
				console.error('Error fetching user details: ', xhr.responseText);
			},
		});
	}

	// Function to populate the edit form
	function populateEditForm(user) {
		$('#edit-user-id').val(user.id);
		$('#edit-user-salutation').val(user.salutation);
		$('#edit-user-firstname').val(user.firstname);
		$('#edit-user-lastname').val(user.lastname);
		$('#edit-user-address').val(user.address);
		$('#edit-user-zipcode').val(user.zipcode);
		$('#edit-user-city').val(user.city);
		$('#edit-user-email').val(user.email);
		$('#edit-user-username').val(user.username);
		$('#edit-user-payment-method').val(user.payment_method);
		$('#edit-user-status').val(user.status);
	}

	// Handle edit form submission
	$('#edit-user-form').on('submit', function (event) {
		event.preventDefault();
		const userData = {
			id: $('#edit-user-id').val(),
			salutation: $('#edit-user-salutation').val(),
			firstname: $('#edit-user-firstname').val(),
			lastname: $('#edit-user-lastname').val(),
			address: $('#edit-user-address').val(),
			zipcode: $('#edit-user-zipcode').val(),
			city: $('#edit-user-city').val(),
			email: $('#edit-user-email').val(),
			username: $('#edit-user-username').val(),
			payment_method: $('#edit-user-payment-method').val(),
			status: $('#edit-user-status').val(),
		};

		$.ajax({
			url: `../backend/public/api/users.php?id=${userData.id}`,
			method: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(userData),
			success: function (response) {
				$('#editUserModal').modal('hide');
				fetchUsers();
			},
			error: function (xhr, status, error) {
				console.error('Error updating user: ', xhr.responseText);
			},
		});
	});

	// Handle change password form submission
	$('#change-password-form').on('submit', function (event) {
		event.preventDefault();
		const userId = $('#change-password-user-id').val();
		const newPassword = $('#new-password').val();

		$.ajax({
			url: '../backend/public/api/users.php',
			method: 'PATCH',
			contentType: 'application/json',
			data: JSON.stringify({ id: userId, new_password: newPassword }),
			success: function (response) {
				$('#changePasswordModal').modal('hide');
				alert('Password updated successfully');
			},
			error: function (xhr, status, error) {
				console.error('Error changing password: ', xhr.responseText);
			},
		});
	});
});

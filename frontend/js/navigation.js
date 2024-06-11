function fetchOrderDetails(orderId) {
	$.ajax({
		url: '../backend/public/api/get_order_details.php',
		type: 'GET',
		data: { order_id: orderId },
		success: function (response) {
			if (response.status === 'success') {
				var order = response.order;
				var orderItems = response.order_items;

				// Display order information
				var orderInfoTableBody = $('#order-info-table tbody');
				orderInfoTableBody.empty(); // Clear any existing rows

				var orderInfo = `
                    <tr><td>Order ID</td><td>${order.order_id}</td></tr>
                    <tr><td>Date</td><td>${order.order_date}</td></tr>
                    <tr><td>Status</td><td>${order.order_status}</td></tr>
                    <tr><td>Total Price</td><td>€${order.total_price}</td></tr>
                    <tr><td>Shipping Address</td><td>${order.shipping_address}</td></tr>
                    <tr><td>Billing Address</td><td>${order.billing_address}</td></tr>
                    <tr><td>Payment Method</td><td>${order.payment_method}</td></tr>
                    <tr><td>Shipping Cost</td><td>€${order.shipping_cost}</td></tr>
                    <tr><td>Tracking Number</td><td>${order.tracking_number}</td></tr>
                    <tr><td>Discount</td><td>${order.discount}</td></tr>
                `;
				orderInfoTableBody.append(orderInfo);

				// Display order items
				var orderItemsTableBody = $('#order-items-table tbody');
				orderItemsTableBody.empty(); // Clear any existing rows
				orderItems.forEach(function (item) {
					var row = $('<tr>');
					row.append($('<td>').text(item.fk_product_id));
					row.append($('<td>').text(item.quantity));
					row.append($('<td>').text('€' + item.subtotal));
					orderItemsTableBody.append(row);
				});
			} else {
				alert('Failed to fetch order details.');
			}
		},
		error: function (xhr, status, error) {
			alert('An error occurred: ' + xhr.responseText);
		},
	});
}

$(document).ready(function () {
	// Check if the user is already logged in
	checkLoginStatus();

	// Load initial content for main-content
	var urlParams = new URLSearchParams(window.location.search);
	var page = urlParams.get('page') || 'homepage';
	var orderId = urlParams.get('order_id') || null;
	$('#main-content').load('sites/' + page + '.html', function () {
		if (orderId) {
			fetchOrderDetails(orderId);
		}
	});

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName, orderId = null) {
		event.preventDefault(); // Prevent the default anchor behavior
		var url = 'sites/' + pageName + '.html';
		$('#main-content').load(url, function () {
			if (orderId) {
				window.history.pushState(
					{ orderId: orderId },
					'',
					'?page=' + pageName + '&order_id=' + orderId
				);
			} else {
				window.history.pushState({}, '', '?page=' + pageName);
			}
		});
	}

	// Handle browser back/forward button
	window.onpopstate = function (event) {
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 'homepage';
		var orderId = urlParams.get('order_id') || null;
		$('#main-content').load('sites/' + page + '.html', function () {
			if (orderId) {
				fetchOrderDetails(orderId);
			}
		});
	};

	// Header navigation links
	$('#home-nav-logo').click(function (event) {
		handleNavigationClick(event, 'homepage');
	});
	$('#home-nav').click(function (event) {
		handleNavigationClick(event, 'homepage');
	});
	$('#shop-nav').click(function (event) {
		handleNavigationClick(event, 'shop');
	});
	$('#faq-nav').click(function (event) {
		handleNavigationClick(event, 'faq');
	});
	$('#imprint-nav').click(function (event) {
		handleNavigationClick(event, 'imprint');
	});

	// Footer navigation links
	$('#home-nav-footer').click(function (event) {
		handleNavigationClick(event, 'homepage');
	});
	$('#shop-nav-footer').click(function (event) {
		handleNavigationClick(event, 'shop');
	});
	$('#faq-nav-footer').click(function (event) {
		handleNavigationClick(event, 'faq');
	});
	$('#imprint-nav-footer').click(function (event) {
		handleNavigationClick(event, 'imprint');
	});

	// Special buttons for login and registration
	$('#login-nav').click(function (event) {
		handleNavigationClick(event, 'login');
	});
	$('#registration-nav').click(function (event) {
		handleNavigationClick(event, 'registration');
	});
	$('#orders-nav').click(function (event) {
		handleNavigationClick(event, 'orders');
	});
	$('#shoppingcart-nav').click(function (event) {
		handleNavigationClick(event, 'cart');
	});
	$('#profile-nav').click(function (event) {
		handleNavigationClick(event, 'profile');
	});

	// Sign out button
	$('#sign-out').click(function (event) {
		event.preventDefault();
		signOutUser();
	});

	// Function to check login status and update UI
	function checkLoginStatus() {
		if (sessionStorage.getItem('userLoggedIn') || getCookie('user_id')) {
			updateUIForLoggedInUser();
		}
	}

	// Function to update UI for logged-in user
	function updateUIForLoggedInUser() {
		$('#auth-buttons').hide();
		$('#user-dropdown').show();
	}

	// Function to sign out user
	function signOutUser() {
		sessionStorage.removeItem('userLoggedIn');
		document.cookie = 'user_id=; Max-Age=-99999999; path=/'; // Delete the cookie

		// Update the UI to show login and sign-up buttons
		$('#auth-buttons').show();
		$('#user-dropdown').hide();

		// Optionally, you can navigate to the homepage or login page
		handleNavigationClick(new Event('click'), 'homepage');
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

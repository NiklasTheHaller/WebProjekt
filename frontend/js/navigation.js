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

	// admin button
	$('#admin-nav').click(function (event) {
		handleNavigationClick(event, 'admin');
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

		if (
			sessionStorage.getItem('is_admin') === 'true' ||
			getCookie('is_admin') === 'true'
		) {
			$('#admin-dropdown').show();
		} else {
			$('#admin-dropdown').hide();
		}
	}

	// Add an AJAX call to fetch session data
	$.ajax({
		url: '../backend/public/api/get_session_data.php',
		type: 'GET',
		success: function (response) {
			if (response.status === 'success') {
				sessionStorage.setItem('is_admin', response.is_admin);
				updateUIForLoggedInUser();
			}
		},
		error: function (xhr, status, error) {
			console.error('Error fetching session data:', error);
		},
	});

	// Function to sign out user
	function signOutUser() {
		$.ajax({
			url: '../backend/public/api/logout.php',
			type: 'POST',
			success: function (response) {
				if (response.status === 'success') {
					sessionStorage.removeItem('userLoggedIn');
					sessionStorage.removeItem('is_admin');
					document.cookie = 'user_id=; Max-Age=-99999999; path=/'; // Delete the cookie
					document.cookie = 'is_admin=; Max-Age=-99999999; path=/'; // Delete the cookie
					document.cookie = 'admin_role=; Max-Age=-99999999; path=/'; // Delete the cookie

					// Update the UI to show login and sign-up buttons
					$('#auth-buttons').show();
					$('#user-dropdown').hide();
					$('#admin-dropdown').hide();

					// Optionally, you can navigate to the homepage or login page
					handleNavigationClick(new Event('click'), 'homepage');
				} else {
					console.error('Error signing out:', response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('Error signing out:', error);
			},
		});
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

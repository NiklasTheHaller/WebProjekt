$(document).ready(function () {
	// Check if the user is already logged in
	checkLoginStatus();

	// Load initial content for main-content
	$('#main-content').load('sites/homepage.html');

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html');
	}

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

	// Footer navigation links - Assuming you have updated the IDs as suggested
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
	$('#shoppingcart-nav').click(function (event) {
		handleNavigationClick(event, 'cart');
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

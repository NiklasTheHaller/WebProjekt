$(document).ready(function () {
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
});

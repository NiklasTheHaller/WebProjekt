$(document).ready(function () {
	// Fetch and display user orders
	fetchUserOrders();

	// Function to fetch and display user orders
	function fetchUserOrders() {
		$.ajax({
			url: '../backend/public/api/get_user_orders.php',
			type: 'GET',
			success: function (response) {
				if (response.status === 'success') {
					var orders = response.orders;
					var ordersTableBody = $('#orders-table tbody');
					ordersTableBody.empty(); // Clear any existing rows
					orders.forEach(function (order) {
						var row = $('<tr>');
						row.append($('<td>').text(order.order_id));
						row.append($('<td>').text(order.order_date));
						row.append($('<td>').text(order.order_status));
						row.append($('<td>').text('€' + order.total_price)); // Display total item price
						row.append($('<td>').text('€' + order.shipping_cost)); // Display shipping cost
						var detailsButton = $('<button>')
							.addClass('btn btn-primary')
							.text('Details')
							.data('order-id', order.order_id)
							.click(function (event) {
								var orderId = $(this).data('order-id');
								handleNavigationClick(event, 'order_details', orderId);
							});
						row.append($('<td>').append(detailsButton));
						ordersTableBody.append(row);
					});
				} else {
					alert('Failed to fetch user orders.');
				}
			},
			error: function (xhr, status, error) {
				showErrorAlert('An error occurred: ' + xhr.responseText);
			},
		});
	}

	// Function to show error alert
	function showErrorAlert(message) {
		var alertHtml =
			'<div class="alert alert-danger mt-3" role="alert">' + message + '</div>';
		$('#orders-table').before(alertHtml);
	}

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName, orderId) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html', function () {
			if (orderId) {
				window.history.pushState({}, '', '?order_id=' + orderId);
			}
		});
	}
});

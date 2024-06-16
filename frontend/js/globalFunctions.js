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

$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var orderId = urlParams.get('order_id');

	if (!orderId) {
		alert('Order ID is missing');
		return;
	}

	fetchOrderDetails(orderId);

	function fetchOrderDetails(orderId) {
		// console.log('Fetching order details for order ID:', orderId); // Add debug log
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
					var financialInfoTableBody = $('#financial-info-table tbody');
					orderInfoTableBody.empty(); // Clear any existing rows
					financialInfoTableBody.empty(); // Clear any existing rows

					var orderInfo = `
                        <tr><td>Order ID</td><td>${order.order_id}</td></tr>
                        <tr><td>Date</td><td>${order.order_date}</td></tr>
                        <tr><td>Status</td><td>${order.order_status}</td></tr>
                        <tr><td>Shipping Address</td><td>${order.shipping_address}</td></tr>
                        <tr><td>Billing Address</td><td>${order.billing_address}</td></tr>
                        <tr><td>Payment Method</td><td>${order.payment_method}</td></tr>
                        <tr><td>Tracking Number</td><td>${order.tracking_number}</td></tr>
                    `;
					orderInfoTableBody.append(orderInfo);

					// Handle discount logic
					var discount = order.discount ? parseFloat(order.discount) : 0;
					var discountAmount = 0;

					if (order.discount_type === 'percentage') {
						discountAmount = parseFloat(order.total_price) * discount;
					} else if (order.discount_type === 'fixed') {
						discountAmount = discount;
					}

					var totalAmount = parseFloat(order.total_price) - discountAmount;

					var financialInfo = `
                        <tr><td>Total Item Price</td><td>€${(
													order.total_price - 2.99
												).toFixed(2)}</td></tr>
                        <tr><td>Shipping Cost</td><td>€${
													order.shipping_cost
												}</td></tr>
                        <tr><td>Discount</td><td>€${discountAmount}</td></tr>
                        <tr><td><strong>Total Amount</strong></td><td><strong>€${totalAmount.toFixed(
													2
												)}</strong></td></tr>
                    `;
					financialInfoTableBody.append(financialInfo);

					// Display order items
					var orderItemsTableBody = $('#order-items-table tbody');
					orderItemsTableBody.empty(); // Clear any existing rows
					orderItems.forEach(function (item) {
						var row = $('<tr>');
						row.append($('<td>').text(item.product_name)); // Display product name
						row.append($('<td>').text(item.quantity));
						row.append($('<td>').text('€' + item.subtotal));
						orderItemsTableBody.append(row);
					});

					// Add Print Invoice Button
					var printInvoiceButton = $('<button>')
						.addClass('btn btn-secondary mt-3')
						.text('Print Invoice')
						.click(function () {
							openInvoiceWindow(order, orderItems, discountAmount);
						});
					$('#order-details-container').append(printInvoiceButton);
				} else {
					alert('Failed to fetch order details: ' + response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('AJAX Error:', xhr, status, error); // Add detailed error log
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	}

	function openInvoiceWindow(order, orderItems, discountAmount) {
		var newWindow = window.open('', '_blank');
		var totalAmount = parseFloat(order.total_price) - discountAmount;
		var invoiceHtml = `
            <html>
            <head>
                <title>Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    table, th, td { border: 1px solid black; }
                    th, td { padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Invoice</h1>
                <p>Invoice Number: ${order.invoice_number}</p>
                <p>Order ID: ${order.order_id}</p>
                <p>Date: ${order.order_date}</p>
                <p>Shipping Address: ${order.shipping_address}</p>
                <p>Billing Address: ${order.billing_address}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems
													.map(
														(item) => `
                            <tr>
                                <td>${item.product_name}</td>
                                <td>${item.quantity}</td>
                                <td>€${item.subtotal}</td>
                            </tr>
                        `
													)
													.join('')}
                    </tbody>
                </table>
                <p>Total Item Price: €${(order.total_price - 2.99).toFixed(
									2
								)}</p>
                <p>Shipping Cost: €${order.shipping_cost}</p>
                <p>Discount: €${discountAmount}</p>
                <p><strong>Total Amount: €${totalAmount.toFixed(2)}</strong></p>
                <button onclick="window.print()">Print</button>
            </body>
            </html>
        `;
		newWindow.document.write(invoiceHtml);
		newWindow.document.close();
	}
});

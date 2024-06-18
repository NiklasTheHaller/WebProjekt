$(document).ready(function () {
	fetchOrders();

	function fetchOrders() {
		$.ajax({
			url: '../backend/public/api/orders.php',
			method: 'GET',
			success: function (response) {
				populateOrdersTable(response);
			},
			error: function (xhr, status, error) {
				console.error('Error fetching orders: ', xhr.responseText);
			},
		});
	}

	function populateOrdersTable(orders) {
		const ordersTableBody = $('#orders-table tbody');
		ordersTableBody.empty();
		orders.forEach((order) => {
			const orderRow = `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.fk_customer_id}</td>
                    <td>${order.total_price}</td>
                    <td>${order.order_status}</td>
                    <td>${order.order_date}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-order-btn" data-id="${order.order_id}">Edit</button>
                    </td>
                </tr>
            `;
			ordersTableBody.append(orderRow);
		});

		$('.edit-order-btn').on('click', function () {
			const orderId = $(this).data('id');
			fetchOrderDetails(orderId);
		});
	}

	function fetchOrderDetails(orderId) {
		$.ajax({
			url: '../backend/public/api/get_order_details.php',
			method: 'GET',
			data: { order_id: orderId },
			success: function (response) {
				$('#editOrderModal').data('orderId', orderId); // Set the order ID on the modal
				populateEditOrderForm(response.order, response.order_items);
				$('#editOrderModal').modal('show');
			},
			error: function (xhr, status, error) {
				console.error('Error fetching order details: ', xhr.responseText);
			},
		});
	}

	function populateEditOrderForm(order, items) {
		const orderItemsTableBody = $('#order-items-table tbody');
		orderItemsTableBody.empty();
		items.forEach((item) => {
			const itemRow = `
                <tr>
                    <td>${item.fk_product_id}</td>
                    <td>${item.product_name}</td>
                    <td><input type="number" class="form-control quantity-input" value="${item.quantity}" data-id="${item.order_item_id}" data-product-id="${item.fk_product_id}" /></td>
                    <td class="item-subtotal">${item.subtotal}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-item-btn" data-id="${item.order_item_id}">Delete</button>
                    </td>
                </tr>
            `;
			orderItemsTableBody.append(itemRow);
		});

		$('.delete-item-btn').on('click', function () {
			const itemId = $(this).data('id');
			$(this).closest('tr').remove();
			updateOrderItem(itemId, null, true);
		});

		$('.quantity-input').on('change', function () {
			const itemId = $(this).data('id');
			const newQuantity = $(this).val();
			const productId = $(this).data('product-id');
			fetchProductPrice(productId, newQuantity, itemId);
		});
	}

	function fetchProductPrice(productId, newQuantity, orderItemId) {
		$.ajax({
			url: '../backend/public/api/products.php',
			method: 'GET',
			data: { product_id: productId },
			success: function (product) {
				const subtotal = product.product_price * newQuantity;
				$(`input[data-id="${orderItemId}"]`)
					.closest('tr')
					.find('.item-subtotal')
					.text(subtotal.toFixed(2));
				updateOrderItem(orderItemId, newQuantity, false, productId, subtotal);
			},
			error: function (xhr, status, error) {
				console.error('Error fetching product price: ', xhr.responseText);
			},
		});
	}

	function updateOrderItem(
		orderItemId,
		newQuantity,
		deleteItem,
		productId = null,
		subtotal = null
	) {
		const items = [];
		if (deleteItem) {
			items.push({ order_item_id: orderItemId, delete: true });
		} else {
			items.push({
				order_item_id: orderItemId,
				fk_product_id: productId,
				quantity: newQuantity,
				subtotal: subtotal,
			});
		}

		const orderId = $('#editOrderModal').data('orderId');

		$.ajax({
			url: '../backend/public/api/edit_order.php',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ order_id: orderId, items: items }),
			success: function (response) {
				console.log('Order item updated successfully');
			},
			error: function (xhr, status, error) {
				console.error('Error updating order item: ', xhr.responseText);
			},
		});
	}

	$('#save-order-changes').on('click', function () {
		$('#editOrderModal').modal('hide');
		fetchOrders();
	});
});

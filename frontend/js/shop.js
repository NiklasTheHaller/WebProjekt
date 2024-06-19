$(document).ready(function () {
	let shoppingCart = {}; // Initialize shopping cart
	let userPaymentMethod = '';
	let discount = 0;
	let discountType = '';
	let appliedVoucher = '';
	let voucherAmountRemaining = 0;

	// Check if user is logged in and fetch payment methods if they are
	checkUserLogin();

	// Fetch and display categories for the filter dropdown
	fetchCategories();

	// Fetch and display products on load
	displayProducts();

	$('#available-products').on('click', 'button', handleAddButtonClick);
	$('#shoppingcart').on('click', 'a', handleRemoveClick);
	$('#search-button').click(function () {
		const query = $('#product-search').val();
		const category = $('#category-filter').val();
		searchProducts(query, category);
	});
	$('#product-search').keypress(function (e) {
		if (e.which === 13) {
			const query = $(this).val();
			const category = $('#category-filter').val();
			searchProducts(query, category);
		}
	});
	$('#product-search').on('input', function () {
		const query = $(this).val();
		const category = $('#category-filter').val();
		searchProducts(query, category);
	});
	$('#category-filter').change(function () {
		const query = $('#product-search').val();
		const category = $(this).val();
		searchProducts(query, category);
	});
	$('#apply-voucher').click(applyVoucher);
	$('#place-order').click(handlePlaceOrder);

	function checkUserLogin() {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/check_session.php',
			cache: false,
			dataType: 'json',
			success: function (response) {
				if (response.logged_in) {
					$('#payment-method-section').show();
					fetchPaymentMethods();
				} else {
					$('#payment-method-section').hide();
				}
			},
			error: function (xhr, status, error) {
				console.error('Error checking login status:', xhr, status, error);
				$('#payment-method-section').hide();
			},
		});
	}

	function fetchPaymentMethods() {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/user_payment_methods.php',
			cache: false,
			dataType: 'json',
			success: function (data) {
				// console.log('Payment methods fetched:', data);
				data.forEach((method) => {
					$('#payment-method').append(
						`<option value="${method}">${method}</option>`
					);
				});
			},
			error: function (xhr, status, error) {
				console.error('Failed to get payment methods:', xhr, status, error);
				console.log('Response:', xhr.responseText); // Log the actual HTML response
				$('#payment-method').append(
					'<option style="color: red;">Failed to get data</option>'
				);
			},
		});
	}

	function fetchCategories() {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/categories.php',
			cache: false,
			dataType: 'json',
			success: function (data) {
				data.forEach((category) => {
					$('#category-filter').append(
						`<option value="${category.category_name}">${category.category_name}</option>`
					);
				});
			},
			error: function () {
				$('#category-filter').append(
					'<option style="color: red;">Failed to get data</option>'
				);
			},
		});
	}

	function displayProducts() {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/products.php',
			cache: false,
			dataType: 'json',
			success: function (data) {
				renderProductList(data);
			},
			error: function () {
				$('#available-products').append(
					'<p style="color: red;">Failed to get data</p>'
				);
			},
		});
	}

	function searchProducts(query, category) {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/products.php',
			cache: false,
			dataType: 'json',
			success: function (data) {
				const filteredData = data.filter((product) => {
					return (
						product.product_name.toLowerCase().includes(query.toLowerCase()) &&
						(category === '' || product.product_category === category)
					);
				});
				renderProductList(filteredData);
			},
			error: function () {
				$('#available-products').append(
					'<p style="color: red;">Failed to get data</p>'
				);
			},
		});
	}

	function renderProductList(data) {
		let listing = '';
		data.forEach((product) => {
			let imageUrl = `../${product.product_imagepath}`;
			listing += `
                <li class="custom-border border-1 list-group-item py-2 px-2 mt-2">
                    <p><b>${product.product_name}, €${
				product.product_price
			}</b></p>
                    <p><b>Weight:</b> ${product.product_weight} kg</p>
                    <p><b>Category:</b> ${product.product_category}</p>
                    <div class="row">
                        <div class="col-md-6">
                            <p>${product.product_description}</p>
                        </div>
                        <div class="col-md-4">
                            <img src="${imageUrl}" class="img-fluid">
                        </div>
                        <div class="col-md-2">
                            <button data-product='${JSON.stringify(
															product
														)}' type="button" class="btn btn-primary">+ Add</button>
                        </div>
                    </div>
                </li>
            `;
		});
		$('#available-products').html(listing);
	}

	function updateCartDisplay() {
		let display = '';
		let total = 0;
		for (let key in shoppingCart) {
			let item = shoppingCart[key];
			total += item.qty * item.product_price;
			display += `<li>${item.qty}x ${item.product_name}, €${
				item.product_price
			} <a href="#" data-id="${key}">${
				item.qty > 1 ? 'decrease' : 'remove'
			}</a></li>`;
		}

		// Apply discount
		let discountAmount = 0;
		if (discountType === 'fixed') {
			discountAmount = discount;
			if (total < discountAmount) {
				voucherAmountRemaining = discountAmount - total;
				total = 0;
			} else {
				total -= discountAmount;
				voucherAmountRemaining = 0;
			}
		} else if (discountType === 'percentage') {
			discountAmount = total * discount;
			total -= discountAmount;
		}

		total += 2.99; // Add shipping cost

		$('#shoppingcart').html(display || '<p>(no products selected)</p>');
		$('#total').text(`Sum: €${total.toFixed(2)}`);
		$('#voucher-display').text(
			appliedVoucher
				? `Voucher Applied: ${appliedVoucher}`
				: '(no voucher applied)'
		);
	}

	function handleAddButtonClick(event) {
		let product = $(event.target).data('product');
		if (shoppingCart[product.product_name]) {
			shoppingCart[product.product_name].qty++;
		} else {
			shoppingCart[product.product_name] = {
				qty: 1,
				product_name: product.product_name,
				product_price: product.product_price,
			};
		}
		updateCartDisplay();
	}

	function handleRemoveClick(event) {
		event.preventDefault();
		let productId = $(event.target).data('id');
		if (shoppingCart[productId].qty > 1) {
			shoppingCart[productId].qty--;
		} else {
			delete shoppingCart[productId];
		}
		updateCartDisplay();
	}

	function applyVoucher() {
		const voucherCode = $('#voucher-code').val();
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/products.php',
			data: { code: voucherCode },
			cache: false,
			dataType: 'json',
			success: function (data) {
				if (data && data.length > 0) {
					const voucher = data[0];
					discount = voucher.discount_amount;
					discountType = voucher.discount_type;
					appliedVoucher = voucher.voucher_code;
					updateCartDisplay();
				} else {
					alert('Invalid voucher code');
					$('#voucher-display').text('(no voucher applied)');
				}
			},
			error: function () {
				alert('Failed to apply voucher');
				$('#voucher-display').text('(no voucher applied)');
			},
		});
	}

	function handlePlaceOrder() {
		$.ajax({
			type: 'GET',
			url: '../backend/public/api/check_session.php',
			cache: false,
			dataType: 'json',
			success: function (response) {
				if (response.logged_in) {
					placeOrder();
				} else {
					$('#loginModal').modal('show');
				}
			},
			error: function (xhr, status, error) {
				console.error('Error checking login status:', xhr, status, error);
				$('#loginModal').modal('show');
			},
		});
	}

	function placeOrder() {
		const paymentMethod = $('#payment-method').val();
		if (!paymentMethod) {
			alert('Please select a payment method');
			return;
		}

		const orderItems = [];
		for (let key in shoppingCart) {
			let item = shoppingCart[key];
			orderItems.push({
				product_name: item.product_name,
				quantity: item.qty,
				subtotal: item.qty * item.product_price,
			});
		}

		const orderData = {
			payment_method: paymentMethod,
			voucher_code: appliedVoucher,
			items: orderItems,
			voucher_amount_remaining: voucherAmountRemaining, // Send the remaining voucher amount to the backend
		};

		$.ajax({
			type: 'POST',
			url: '../backend/public/api/place_order.php',
			contentType: 'application/json',
			data: JSON.stringify(orderData),
			success: function (response) {
				alert(
					`Order placed successfully. Your invoice number is ${response.invoice_number}`
				);
				handleNavigationClick(new Event('click'), 'orders'); // Redirect to orders page
				shoppingCart = {}; // Clear the cart
				appliedVoucher = ''; // Clear the voucher
				discount = 0; // Reset discount
				discountType = ''; // Reset discount type
				voucherAmountRemaining = 0; // Reset remaining voucher amount
				updateCartDisplay();
			},
			error: function (xhr, status, error) {
				console.error('Failed to place order:', xhr, status, error);
				console.log('Response:', xhr.responseText); // Log the actual response
				alert('Failed to place order');
			},
		});
	}

	// Function to handle navigation click events
	function handleNavigationClick(event, pageName) {
		event.preventDefault(); // Prevent the default anchor behavior
		$('#main-content').load('sites/' + pageName + '.html');
	}

	// Login form submission
	$('#login-form').on('submit', function (e) {
		e.preventDefault();

		const loginData = {
			email_or_username: $('#email_or_username').val(),
			password: $('#password').val(),
			remember_me: $('#remember_me').is(':checked'),
		};

		$.ajax({
			type: 'POST',
			url: '../backend/public/api/login.php',
			contentType: 'application/json',
			data: JSON.stringify(loginData),
			success: function (response) {
				if (response.status === 'success') {
					$('#loginModal').modal('hide');
					checkUserLogin(); // Check login status again to show payment methods
				} else {
					$('.alert-danger').text(response.error).show();
				}
			},
			error: function (xhr, status, error) {
				console.error('Login failed:', xhr, status, error);
				$('.alert-danger').text('Login failed. Please try again.').show();
			},
		});
	});
});

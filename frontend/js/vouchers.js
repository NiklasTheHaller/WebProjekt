$(document).ready(function () {
	// Fetch and display existing vouchers
	fetchVouchers();

	$('#voucher-form').on('submit', function (event) {
		event.preventDefault();

		var voucherData = {
			voucher_code: $('#voucher_code').val(),
			expiration_date: $('#expiration_date').val(),
			discount_type: $('#discount_type').val(),
			discount_amount: $('#discount_amount').val(),
		};

		$.ajax({
			url: '../backend/public/api/vouchers.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(voucherData),
			success: function (response) {
				if (response.status === 'success') {
					alert('Voucher generated successfully!');
					$('#voucher-form')[0].reset();
					fetchVouchers();
				} else {
					alert('Failed to generate voucher: ' + response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('Error: ', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	});

	function fetchVouchers() {
		$.ajax({
			url: '../backend/public/api/vouchers.php',
			type: 'GET',
			success: function (vouchers) {
				var voucherList = $('#voucher-list');
				voucherList.empty();
				vouchers.forEach(function (voucher) {
					var html = `
                        <tr class="text-center">
                            <td>${voucher.id}</td>
                            <td>${voucher.voucher_code}</td>
                            <td>${voucher.expiration_date}</td>
                            <td>${voucher.discount_type}</td>
                            <td>${
															voucher.discount_type === 'percentage'
																? voucher.discount_amount + '%'
																: '€' + voucher.discount_amount
														}</td>
                        </tr>
                    `;
					voucherList.append(html);
				});
			},
			error: function (xhr, status, error) {
				console.error('Error fetching vouchers: ', xhr.responseText);
			},
		});
	}

	// Add event listener for the generate voucher code button
	$('#generate-code-button').on('click', function () {
		var generatedCode = generateVoucherCode();
		$('#voucher_code').val(generatedCode);
	});

	// Function to generate a random voucher code
	function generateVoucherCode() {
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var codeLength = 10;
		var voucherCode = '';
		for (var i = 0; i < codeLength; i++) {
			var randomIndex = Math.floor(Math.random() * chars.length);
			voucherCode += chars[randomIndex];
		}
		return voucherCode;
	}
});

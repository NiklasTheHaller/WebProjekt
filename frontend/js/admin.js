$(document).ready(function () {
	$(document).ready(function () {
		$('#admin-functions').on('change', function () {
			var selectedFunction = $(this).val();
			if (selectedFunction) {
				$('#admin-content').load('sites/' + selectedFunction);
			}
		});
	});

	$('#admin-content').on('click', '.edit-product-btn', function () {
		var productId = $(this).data('product-id');
		fetchProductData(productId);
	});

	function fetchProductData(productId) {
		$.ajax({
			url: '../backend/public/api/products.php',
			type: 'GET',
			data: { product_id: productId },
			success: function (response) {
				if (response) {
					$('#product_id').val(response.product_id);
					$('#product_name').val(response.product_name);
					$('#product_description').val(response.product_description);
					$('#product_price').val(response.product_price);
					$('#product_weight').val(response.product_weight);
					$('#product_quantity').val(response.product_quantity);
					$('#product_category').val(response.product_category);
				} else {
					alert('Failed to fetch product data.');
				}
			},
			error: function (xhr, status, error) {
				console.error('Error: ', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	}
});

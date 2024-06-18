$(document).ready(function () {
	fetchCategories();
	fetchProducts();

	$('#product-list').on('change', function () {
		var productId = $(this).val();
		if (productId) {
			fetchProductData(productId);
		}
	});

	$('#edit-product-form').on('submit', function (event) {
		event.preventDefault();

		var formData = new FormData();
		formData.append('product_id', $('#product_id').val());
		formData.append('product_name', $('#product_name').val());
		formData.append('product_description', $('#product_description').val());
		formData.append('product_price', $('#product_price').val());
		formData.append('product_weight', $('#product_weight').val());
		formData.append('product_quantity', $('#product_quantity').val());
		formData.append('product_category', $('#product_category').val());

		var changeImage = $('#change_image').is(':checked');
		formData.append('change_image', changeImage);

		if (changeImage) {
			var imageFile = $('#product_imagepath')[0].files[0];
			if (imageFile) {
				formData.append('product_imagepath', imageFile);
			}
		}

		$.ajax({
			url: '../backend/public/api/edit_product.php',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log('Response: ', response);
				if (response.status === 'success') {
					alert('Product updated successfully!');
				} else {
					alert('Failed to update product: ' + response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('Error: ', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	});

	$('#change_image').on('change', function () {
		if ($(this).is(':checked')) {
			$('#image-upload').show();
		} else {
			$('#image-upload').hide();
		}
	});

	$('#delete-product-btn').on('click', function () {
		if (confirm('Are you sure you want to delete this product?')) {
			$.ajax({
				url: '../backend/public/api/delete_product.php',
				type: 'POST',
				data: JSON.stringify({ product_id: $('#product_id').val() }),
				contentType: 'application/json',
				success: function (response) {
					console.log('Response: ', response);
					if (response.status === 'success') {
						alert('Product deleted successfully!');
						fetchProducts();
						$('#product-editor').hide();
					} else {
						alert('Failed to delete product: ' + response.error);
					}
				},
				error: function (xhr, status, error) {
					console.error('Error: ', xhr.responseText);
					alert('An error occurred: ' + xhr.responseText);
				},
			});
		}
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
					$('#product-editor').show();
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

	function fetchProducts() {
		$.ajax({
			url: '../backend/public/api/products.php',
			type: 'GET',
			dataType: 'json',
			success: function (products) {
				var productList = $('#product-list');
				productList.empty();
				productList.append(
					'<option value="" disabled selected>Select a product</option>'
				);
				products.forEach(function (product) {
					var option = $('<option>')
						.val(product.product_id)
						.text(product.product_name);
					productList.append(option);
				});
			},
			error: function (error) {
				console.error('Error fetching products:', error);
			},
		});
	}

	function fetchCategories() {
		$.ajax({
			url: '../backend/public/api/categories.php',
			type: 'GET',
			dataType: 'json',
			success: function (categories) {
				var categorySelect = $('#product_category');
				categorySelect.empty();
				categories.forEach(function (category) {
					var option = $('<option>')
						.val(category.category_name)
						.text(category.category_name);
					categorySelect.append(option);
				});
			},
			error: function (error) {
				console.error('Error fetching categories:', error);
			},
		});
	}
});

$(document).ready(function () {
	fetchProducts();

	function fetchProducts() {
		$.ajax({
			url: '../backend/public/api/products.php',
			type: 'GET',
			success: function (response) {
				populateProductList(response);
			},
			error: function (xhr, status, error) {
				console.error('Error fetching products:', xhr.responseText);
				alert('Error fetching products: ' + xhr.responseText);
			},
		});
	}

	function populateProductList(products) {
		var productList = $('#product-list');
		productList.empty();
		products.forEach(function (product) {
			var row = `
                <tr>
                    <td>${product.product_name}</td>
                    <td>
                        <button class="btn btn-primary edit-product-btn" data-id="${product.product_id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${product.product_id}">Delete</button>
                    </td>
                </tr>
            `;
			productList.append(row);
		});

		$('.edit-product-btn').on('click', function () {
			var productId = $(this).data('id');
			loadEditProductPage(productId);
		});

		$('.delete-btn').on('click', function () {
			var productId = $(this).data('id');
			$('#confirm-delete-btn').data('id', productId);
			$('#deleteConfirmationModal').modal('show');
		});
	}

	$('#confirm-delete-btn').on('click', function () {
		var productId = $(this).data('id');
		deleteProduct(productId);
	});

	function deleteProduct(productId) {
		$.ajax({
			url: '../backend/public/api/delete_product.php',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ product_id: productId }),
			success: function (response) {
				if (response.status === 'success') {
					$('#deleteConfirmationModal').modal('hide');
					fetchProducts();
					alert('Product deleted successfully!');
				} else {
					alert('Failed to delete product: ' + response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('Error deleting product:', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	}

	function loadEditProductPage(productId) {
		$('#product-editor').load('edit_product.html', function () {
			fetchProductData(productId);
		});
	}

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
					fetchCategories(response.product_category);
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

	function fetchCategories(selectedCategory = '') {
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
					if (category.category_name === selectedCategory) {
						option.attr('selected', 'selected');
					}
					categorySelect.append(option);
				});
			},
			error: function (error) {
				console.error('Error fetching categories:', error);
			},
		});
	}
});

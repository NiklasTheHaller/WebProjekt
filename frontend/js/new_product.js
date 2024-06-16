$(document).ready(function () {
	fetchCategories();

	$('#new-product-form').on('submit', function (event) {
		event.preventDefault();

		var formData = new FormData();
		formData.append('product_name', $('#product_name').val());
		formData.append('product_description', $('#product_description').val());
		formData.append('product_price', $('#product_price').val());
		formData.append('product_weight', $('#product_weight').val());
		formData.append('product_quantity', $('#product_quantity').val());
		formData.append('product_category', $('#product_category').val());
		formData.append('product_imagepath', $('#product_imagepath')[0].files[0]);

		console.log('Form data: ', formData);

		$.ajax({
			url: '../backend/public/api/add_product.php',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log('Response: ', response);
				if (response.status === 'success') {
					alert('Product added successfully!');
					$('#new-product-form')[0].reset();
				} else {
					alert('Failed to add product: ' + response.error);
				}
			},
			error: function (xhr, status, error) {
				console.error('Error: ', xhr.responseText);
				alert('An error occurred: ' + xhr.responseText);
			},
		});
	});

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

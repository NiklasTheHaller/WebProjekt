$(document).ready(function () {
	fetchCategories();

	function fetchCategories() {
		$.ajax({
			url: 'http://localhost/webprojekt/WebProjektGymnius/backend/public/api/categories.php',
			type: 'GET',
			dataType: 'json',
			success: function (categories) {
				var categoriesContainer = $('#categories-container');
				categoriesContainer.empty(); // Clear any existing categories
				categories.forEach(function (category) {
					var html = `
                        <div class="col-md-3 mb-4">
                            <div class="card bg-dark text-white category-card">
                                <img src="http://localhost/webprojekt/WebProjektGymnius/${category.category_imagepath}" class="card-img category-img" alt="${category.category_name}" />
                                <div class="card-img-overlay d-flex align-items-end">
                                    <h5 class="card-title">${category.category_name}</h5>
                                </div>
                            </div>
                        </div>
                    `;
					categoriesContainer.append(html);
				});
			},
			error: function (error) {
				console.error('Error fetching categories:', error);
			},
		});
	}
});

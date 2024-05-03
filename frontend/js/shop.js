$(document).ready(function () {
	displayProducts();
	$('#available-products').on('click', 'button', handleAddButtonClick);
	$('#shoppingcart').on('click', 'a', handleRemoveClick);
});

let shoppingCart = {};

function displayProducts() {
	$.ajax({
		type: 'GET',
		url: 'products.json',
		cache: false,
		dataType: 'json',
		success: function (data) {
			let listing = '';
			$.each(data, function (index, product) {
				listing += `
                <li class="custom-border border-1 list-group-item py-2 px-2 mt-2">
                    <p><b>${product.name}, €${product.price}</b></p>
                    <div class="row">
                        <div class="col-md-6">
                            <p>${product.short_description}</p>
                        </div>
                        <div class="col-md-4">
                            <img src="${product.image_url}" class="img-fluid">
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
			$('#available-products').append(listing);
		},
		error: function () {
			$('#available-products').append(
				'<p style="color: red;">failed to get data</p>'
			);
		},
	});
}

function updateCartDisplay() {
	let display = '';
	let total = 0;
	for (let key in shoppingCart) {
		let item = shoppingCart[key];
		total += item.qty * item.price;
		display += `<li>${item.qty}x ${item.name}, €${
			item.price
		} <a href="#" data-id="${key}">${
			item.qty > 1 ? 'decrease' : 'remove'
		}</a></li>`;
	}
	$('#shoppingcart').html(display || '<p>(no products selected)</p>');
	$('#total').text(`Sum: €${total.toPrecision(2)}`); // should limit to two decimal points
}

function handleAddButtonClick(event) {
	let product = $(event.target).data('product');
	if (shoppingCart[product.name]) {
		shoppingCart[product.name].qty++;
	} else {
		shoppingCart[product.name] = {
			qty: 1,
			name: product.name,
			price: product.price,
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

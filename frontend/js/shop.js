$(document).ready(function () {
    displayProducts();
    $('#available-products').on('click', 'button', handleAddButtonClick);
    $('#shoppingcart').on('click', 'a', handleRemoveClick);

    $('#search-button').click(function () {
        const query = $('#product-search').val();
        searchProducts(query);
    });

    $('#product-search').keypress(function (e) {
        if (e.which === 13) { // Enter key pressed
            const query = $(this).val();
            searchProducts(query);
        }
    });
});

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
            $('#available-products').append('<p style="color: red;">Failed to get data</p>');
        },
    });
}

function searchProducts(query) {
    $.ajax({
        type: 'GET',
        url: '../backend/public/api/products.php', 
        cache: false,
        dataType: 'json',
        success: function (data) {
            const filteredData = data.filter(product =>
                product.product_name.toLowerCase().includes(query.toLowerCase())
            );
            renderProductList(filteredData);
        },
        error: function () {
            $('#available-products').append('<p style="color: red;">Failed to get data</p>');
        },
    });
}

function renderProductList(data) {
    let listing = '';
    data.forEach(product => {
        let imageUrl = `http://localhost:8888/WebProjekt-main/${product.product_imagepath}`;
        listing += `
            <li class="custom-border border-1 list-group-item py-2 px-2 mt-2">
                <p><b>${product.product_name}, €${product.product_price}</b></p>
                <div class="row">
                    <div class="col-md-6">
                        <p>${product.product_description}</p>
                    </div>
                    <div class="col-md-4">
                        <img src="${imageUrl}" class="img-fluid">
                    </div>
                    <div class="col-md-2">
                        <button data-product='${JSON.stringify(product)}' type="button" class="btn btn-primary">+ Add</button>
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
        display += `<li>${item.qty}x ${item.product_name}, €${item.product_price} <a href="#" data-id="${key}">${item.qty > 1 ? 'decrease' : 'remove'}</a></li>`;
    }
    $('#shoppingcart').html(display || '<p>(no products selected)</p>');
    $('#total').text(`Sum: €${total.toFixed(2)}`);
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

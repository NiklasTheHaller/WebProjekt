<?php
require_once __DIR__ . '/../config/dbaccess.php';

class DataHandler
{
    private $conn;

    public function __construct()
    {
        $db = new DatabaseAccess();
        $this->conn = $db->getConnection();
    }

    // CRUD Operations for User
    public function createUser($user)
    {
        $sql = "INSERT INTO user (salutation, firstname, lastname, address, zipcode, city, email, username, password, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $user->salutation, $user->firstname, $user->lastname, $user->address, $user->zipcode, $user->city, $user->email, $user->username, $user->password, $user->payment_method, $user->status
        ]);
    }

    public function getUserById($userId)
    {
        $sql = "SELECT * FROM user WHERE id = :userId";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUserByEmail($email)
    {
        $sql = "SELECT * FROM user WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function getUserByUsername($username)
    {
        $sql = "SELECT * FROM user WHERE username = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
    public function getAllUsers()
    {
        $sql = "SELECT id, salutation, firstname, lastname, address, zipcode, city, email, username, payment_method, status FROM user LIMIT 25";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateUser($data)
    {
        $sql = "UPDATE user SET salutation = :salutation, firstname = :firstname, lastname = :lastname, address = :address, zipcode = :zipcode, city = :city, email = :email, username = :username, payment_method = :payment_method, status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);
        $stmt->bindParam(':salutation', $data->salutation, PDO::PARAM_STR);
        $stmt->bindParam(':firstname', $data->firstname, PDO::PARAM_STR);
        $stmt->bindParam(':lastname', $data->lastname, PDO::PARAM_STR);
        $stmt->bindParam(':address', $data->address, PDO::PARAM_STR);
        $stmt->bindParam(':zipcode', $data->zipcode, PDO::PARAM_STR);
        $stmt->bindParam(':city', $data->city, PDO::PARAM_STR);
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR);
        $stmt->bindParam(':payment_method', $data->payment_method, PDO::PARAM_STR);
        $stmt->bindParam(':status', $data->status, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function changeUserPassword($id, $new_password)
    {
        $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
        $sql = "UPDATE user SET password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);
        return $stmt->execute();
    }
    public function setUserStatus($userId, $status)
    {
        $sql = "UPDATE user SET status = :status WHERE id = :userId";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function updateUserProfile($user)
    {
        $sql = "UPDATE user SET salutation = ?, firstname = ?, lastname = ?, address = ?, zipcode = ?, city = ?, email = ?, username = ?, payment_method = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $user->salutation, $user->firstname, $user->lastname, $user->address, $user->zipcode, $user->city, $user->email, $user->username, $user->payment_method, $user->id
        ]);
    }

    public function updateUserPassword($id, $password)
    {
        $sql = "UPDATE user SET password = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$password, $id]);
    }

    public function deleteUser($id)
    {
        $sql = "DELETE FROM user WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }

    // CRUD Operations for Admin
    public function createAdmin($admin)
    {
        $sql = "INSERT INTO admin (role, fk_userid) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $admin->role, $admin->fk_userid
        ]);
    }

    public function getAdminById($id)
    {
        $sql = "SELECT * FROM admin WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function updateAdmin($admin)
    {
        $sql = "UPDATE admin SET role = ?, fk_userid = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $admin->role, $admin->fk_userid, $admin->id
        ]);
    }

    public function deleteAdmin($id)
    {
        $sql = "DELETE FROM admin WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }

    public function isAdmin($userId)
    {
        $sql = "SELECT COUNT(*) FROM admin WHERE fk_userid = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchColumn() > 0;
    }

    public function getAdminRole($userId)
    {
        $sql = "SELECT role FROM admin WHERE fk_userid = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchColumn();
    }


    // CRUD Operations for Product
    public function createProduct($product)
    {
        $sql = "INSERT INTO product (product_name, product_description, product_price, product_weight, product_quantity, product_category, product_imagepath) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $product->product_name, $product->product_description, $product->product_price, $product->product_weight, $product->product_quantity, $product->product_category, $product->product_imagepath
        ]);
    }

    public function getAllProducts()
    {
        $sql = "SELECT * FROM product";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getProductById($product_id)
    {
        $sql = "SELECT * FROM product WHERE product_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$product_id]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function updateProduct($product)
    {
        $sql = "UPDATE product SET product_name = ?, product_description = ?, product_price = ?, product_weight = ?, product_quantity = ?, product_category = ?, product_imagepath = ? WHERE product_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $product->product_name, $product->product_description, $product->product_price, $product->product_weight, $product->product_quantity, $product->product_category, $product->product_imagepath, $product->product_id
        ]);
    }

    public function deleteProduct($product_id)
    {
        $sql = "DELETE FROM product WHERE product_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$product_id]);
    }

    // CRUD Operations for Orders and Order Items
    public function createOrder($order)
    {
        $sql = "INSERT INTO orders (fk_customer_id, total_price, order_status, order_date, shipping_address, billing_address, payment_method, shipping_cost, tracking_number, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $order->fk_customer_id, $order->total_price, $order->order_status, $order->order_date, $order->shipping_address, $order->billing_address, $order->payment_method, $order->shipping_cost, $order->tracking_number, $order->discount
        ]);
    }

    public function getOrdersByCustomerId($customer_id)
    {
        $sql = "SELECT * FROM orders WHERE fk_customer_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$customer_id]);
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getOrderById($order_id)
    {
        $sql = "SELECT * FROM orders WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$order_id]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function updateOrder($order)
    {
        $sql = "UPDATE orders SET fk_customer_id = ?, total_price = ?, order_status = ?, order_date = ?, shipping_address = ?, billing_address = ?, payment_method = ?, shipping_cost = ?, tracking_number = ?, discount = ? WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $order->fk_customer_id, $order->total_price, $order->order_status, $order->order_date, $order->shipping_address, $order->billing_address, $order->payment_method, $order->shipping_cost, $order->tracking_number, $order->discount, $order->order_id
        ]);
    }

    public function deleteOrder($order_id)
    {
        $sql = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$order_id]);
    }

    public function getOrderItemsByOrderId($order_id)
    {
        $sql = "SELECT * FROM order_items WHERE fk_order_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$order_id]);
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function updateInvoiceNumber($order_id, $invoice_number)
    {
        $sql = "UPDATE orders SET invoice_number = ? WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$invoice_number, $order_id]);
    }

    public function getOrderItemsWithProductName($order_id)
    {
        $sql = "
            SELECT 
                order_items.*, 
                product.product_name 
            FROM 
                order_items 
            JOIN 
                product ON order_items.fk_product_id = product.product_id 
            WHERE 
                order_items.fk_order_id = ?
        ";
        $stmt = $this->conn->prepare($sql);
        if ($stmt->execute([$order_id])) {
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } else {
            error_log("Failed to execute query for order items with order ID: $order_id");
            return false;
        }
    }

    // categories
    public function getCategoryById($category_id)
    {
        $sql = "SELECT * FROM categories WHERE category_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$category_id]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function getAllCategories()
    {
        $sql = "SELECT * FROM categories";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    // CRUD Operations for Vouchers

    public function createVoucher($voucher)
    {
        $sql = "INSERT INTO vouchers (voucher_code, expiration_date, discount_type, discount_amount) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $voucher->voucher_code, $voucher->expiration_date, $voucher->discount_type, $voucher->discount_amount
        ]);
    }

    public function getAllVouchers()
    {
        $sql = "SELECT * FROM vouchers";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
}

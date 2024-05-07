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
        $sql = "INSERT INTO user (salutation, firstname, lastname, address, zipcode, city, email, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $user->salutation, $user->firstname, $user->lastname, $user->address, $user->zipcode, $user->city, $user->email, $user->username, $user->password, $user->status
        ]);
    }

    public function getUserById($id)
    {
        $sql = "SELECT * FROM user WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function updateUser($user)
    {
        $sql = "UPDATE user SET salutation = ?, firstname = ?, lastname = ?, address = ?, zipcode = ?, city = ?, email = ?, username = ?, password = ?, status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $user->salutation, $user->firstname, $user->lastname, $user->address, $user->zipcode, $user->city, $user->email, $user->username, $user->password, $user->status, $user->id
        ]);
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

    // CRUD Operations for Product
    public function createProduct($product)
    {
        $sql = "INSERT INTO product (product_name, product_description, product_price, product_weight, product_quantity, product_category, product_imagepath) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $product->product_name, $product->product_description, $product->product_price, $product->product_weight, $product->product_quantity, $product->product_category, $product->product_imagepath
        ]);
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
}

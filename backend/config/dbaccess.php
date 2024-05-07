<?php
// db_access.php
class DatabaseAccess
{
    private $host = 'localhost'; // Database host
    private $db_name = 'gymnius_db'; // Database name
    private $username = 'admin'; // Database username
    private $password = 'password'; // Database password
    private $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo "Connection successfully established!";
        } catch (PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->conn;
    }
}

<?php
header('Content-Type: application/json'); // Set the content type to JSON

// MySQL server and login information
$servername = "172.20.128.85";
$username = "root";
$password = "Akademiet99";
$dbname = "proveeksamen";

// Create connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error])); // Return JSON error
}

// Get data from POST request
$input = json_decode(file_get_contents('php://input'), true); // Decode JSON input
$name = $conn->real_escape_string($input['name']); // Sanitize input

// Fetch data from the database
$query = "SELECT * FROM codes WHERE Name = '$name'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    // Fetch the results as an associative array
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row; // Collect all rows
    }

    echo json_encode($data); // Encode the data as JSON
} else {
    echo json_encode([]); // Return an empty array if no results
}

$conn->close(); // Close the connection
?>
